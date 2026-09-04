// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IQARBIToken {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

interface IAgentRegistry {
    function getAgentAuth(uint256 agentId) external view returns (address owner, address sessionWallet, bool isActive);
    function recordTaskCompletion(uint256 agentId, bool success) external;
}

/**
 * @title TaskMarket
 * @notice Decentralized Escrow Bounty Marketplace for Autonomous AI Agents on Arbitrum Sepolia.
 * Users deposit $QARBI bounties; agents claim and execute tasks with recorded proof commitments.
 * Proof commitments are recorded on-chain; note that zero-knowledge/PQC proof payloads are NOT cryptographically verified on-chain by EVM bytecode, but attested via public proof hashes.
 */
contract TaskMarket {
    enum TaskStatus { OPEN, IN_PROGRESS, COMPLETED, CANCELLED }

    struct Task {
        uint256 id;
        address creator;
        string title;
        string description;
        string requiredArchetype;
        uint256 rewardAmount; // in QARBI (wei)
        uint256 assignedAgentId;
        bytes32 proofHash;
        TaskStatus status;
        uint256 createdAt;
        uint256 completedAt;
    }

    address public protocolAdmin;
    IQARBIToken public qarbiToken;
    IAgentRegistry public agentRegistry;
    uint256 public nextTaskId = 1;
    uint256 private _reentrancyStatus; // 1 = NOT_ENTERED, 2 = ENTERED

    mapping(uint256 => Task) public tasks;
    mapping(uint256 => uint256[]) public agentAssignedTasks; // agentId => taskIds

    event TaskCreated(uint256 indexed taskId, address indexed creator, string title, string requiredArchetype, uint256 rewardAmount, uint256 createdAt);
    event TaskAssigned(uint256 indexed taskId, uint256 indexed agentId, address indexed worker);
    event ProofSubmitted(uint256 indexed taskId, uint256 indexed agentId, bytes32 proofHash);
    event TaskCancelled(uint256 indexed taskId, address indexed creator, uint256 refundedAmount);

    modifier onlyAdmin() {
        require(msg.sender == protocolAdmin, "Only protocol admin can call");
        _;
    }

    modifier nonReentrant() {
        require(_reentrancyStatus != 2, "ReentrancyGuard: reentrant call");
        _reentrancyStatus = 2;
        _;
        _reentrancyStatus = 1;
    }

    constructor(address _qarbiToken, address _agentRegistry) {
        protocolAdmin = msg.sender;
        qarbiToken = IQARBIToken(_qarbiToken);
        agentRegistry = IAgentRegistry(_agentRegistry);
        _reentrancyStatus = 1;
    }

    /**
     * @notice Creates a new bounty task locking $QARBI tokens in smart contract escrow
     */
    function createTask(
        string calldata title,
        string calldata description,
        string calldata requiredArchetype,
        uint256 rewardAmount
    ) external nonReentrant returns (uint256) {
        require(bytes(title).length > 0, "Title is required");
        require(rewardAmount > 0, "Reward amount must be greater than 0");

        bool success = qarbiToken.transferFrom(msg.sender, address(this), rewardAmount);
        require(success, "Token transfer to escrow failed");

        uint256 taskId = nextTaskId++;
        tasks[taskId] = Task({
            id: taskId,
            creator: msg.sender,
            title: title,
            description: description,
            requiredArchetype: requiredArchetype,
            rewardAmount: rewardAmount,
            assignedAgentId: 0,
            proofHash: bytes32(0),
            status: TaskStatus.OPEN,
            createdAt: block.timestamp,
            completedAt: 0
        });

        emit TaskCreated(taskId, msg.sender, title, requiredArchetype, rewardAmount, block.timestamp);
        return taskId;
    }

    /**
     * @notice Allows an authenticated agent owner or session wallet to claim an open task
     */
    function claimTask(uint256 taskId, uint256 agentId) external {
        Task storage task = tasks[taskId];
        require(task.id != 0, "Task does not exist");
        require(task.status == TaskStatus.OPEN, "Task is not open");

        (address owner, address sessionWallet, bool isActive) = agentRegistry.getAgentAuth(agentId);
        require(isActive, "Agent is not active");
        require(msg.sender == owner || msg.sender == sessionWallet, "Caller not authorized for agent");

        task.status = TaskStatus.IN_PROGRESS;
        task.assignedAgentId = agentId;
        agentAssignedTasks[agentId].push(taskId);

        emit TaskAssigned(taskId, agentId, msg.sender);
    }

    /**
     * @notice Submits cryptographic proof of task completion and settles escrowed $QARBI reward
     * Note: Proof hashes are recorded on-chain, but are NOT cryptographically verified on-chain by the EVM.
     */
    function submitProofAndSettle(uint256 taskId, bytes32 proofHash) public nonReentrant {
        Task storage task = tasks[taskId];
        require(task.id != 0, "Task does not exist");
        require(task.status == TaskStatus.IN_PROGRESS, "Task is not in progress");
        require(proofHash != bytes32(0), "Proof hash is required");

        (address owner, address sessionWallet, ) = agentRegistry.getAgentAuth(task.assignedAgentId);
        require(msg.sender == owner || msg.sender == sessionWallet, "Caller not authorized for agent");

        task.proofHash = proofHash;
        task.status = TaskStatus.COMPLETED;
        task.completedAt = block.timestamp;

        bool payoutSuccess = qarbiToken.transfer(owner, task.rewardAmount);
        require(payoutSuccess, "Reward payout transfer failed");

        agentRegistry.recordTaskCompletion(task.assignedAgentId, true);

        emit ProofSubmitted(taskId, task.assignedAgentId, proofHash);
    }

    /**
     * @notice Backward-compatible alias for submitProofAndSettle
     */
    function submitProofAndClaim(uint256 taskId, bytes32 proofHash) external {
        submitProofAndSettle(taskId, proofHash);
    }

    /**
     * @notice Cancels an open task and refunds the escrowed bounty to creator
     */
    function cancelTask(uint256 taskId) external nonReentrant {
        Task storage task = tasks[taskId];
        require(task.id != 0, "Task does not exist");
        require(task.status == TaskStatus.OPEN, "Only open tasks can be cancelled");
        require(msg.sender == task.creator, "Only creator can cancel");

        task.status = TaskStatus.CANCELLED;
        bool refundSuccess = qarbiToken.transfer(task.creator, task.rewardAmount);
        require(refundSuccess, "Refund transfer failed");

        emit TaskCancelled(taskId, task.creator, task.rewardAmount);
    }

    function getTask(uint256 taskId) external view returns (Task memory) {
        return tasks[taskId];
    }
}
