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
 * Users & Orchestrators deposit $QARBI bounties, agents claim and execute tasks with verifiable cryptographic proofs.
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

    mapping(uint256 => Task) public tasks;

    event TaskCreated(
        uint256 indexed taskId,
        address indexed creator,
        string title,
        string requiredArchetype,
        uint256 rewardAmount,
        uint256 createdAt
    );
    event TaskClaimed(uint256 indexed taskId, uint256 indexed agentId, address indexed claimant);
    event ProofSubmitted(uint256 indexed taskId, uint256 indexed agentId, bytes32 proofHash);
    event TaskSettled(uint256 indexed taskId, uint256 indexed agentId, address indexed recipient, uint256 rewardPaid);
    event TaskCancelled(uint256 indexed taskId, address indexed creator, uint256 refundAmount);

    modifier onlyAdmin() {
        require(msg.sender == protocolAdmin, "Only admin allowed");
        _;
    }

    constructor(address _tokenAddress, address _registryAddress) {
        protocolAdmin = msg.sender;
        qarbiToken = IQARBIToken(_tokenAddress);
        agentRegistry = IAgentRegistry(_registryAddress);
    }

    function setContracts(address _tokenAddress, address _registryAddress) external onlyAdmin {
        qarbiToken = IQARBIToken(_tokenAddress);
        agentRegistry = IAgentRegistry(_registryAddress);
    }

    /**
     * @notice Creates a new bounty task locking $QARBI tokens in smart contract escrow
     */
    function createTask(
        string memory title,
        string memory description,
        string memory requiredArchetype,
        uint256 rewardAmount
    ) external returns (uint256) {
        require(bytes(title).length > 0, "Title is required");
        require(rewardAmount > 0, "Reward amount must be greater than 0");

        // Escrow $QARBI tokens from creator into this market contract
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
     * @notice Allows an autonomous agent or its owner/session wallet to claim an open task
     */
    function claimTask(uint256 taskId, uint256 agentId) external {
        Task storage task = tasks[taskId];
        require(task.id != 0, "Task does not exist");
        require(task.status == TaskStatus.OPEN, "Task is not open");

        (address owner, address sessionWallet, bool isActive) = agentRegistry.getAgentAuth(agentId);
        require(isActive, "Agent is not active");
        require(msg.sender == owner || msg.sender == sessionWallet || msg.sender == protocolAdmin, "Unauthorized agent operator");

        task.assignedAgentId = agentId;
        task.status = TaskStatus.IN_PROGRESS;

        emit TaskClaimed(taskId, agentId, msg.sender);
    }

    /**
     * @notice Submits cryptographic execution proof and settles the bounty
     */
    function submitProofAndSettle(uint256 taskId, bytes32 proofHash) external {
        Task storage task = tasks[taskId];
        require(task.id != 0, "Task does not exist");
        require(task.status == TaskStatus.IN_PROGRESS, "Task is not in progress");
        require(proofHash != bytes32(0), "Invalid proof hash");

        (address owner, address sessionWallet, ) = agentRegistry.getAgentAuth(task.assignedAgentId);

        require(
            msg.sender == owner || msg.sender == sessionWallet || msg.sender == task.creator || msg.sender == protocolAdmin,
            "Not authorized to submit proof"
        );

        task.proofHash = proofHash;
        task.status = TaskStatus.COMPLETED;
        task.completedAt = block.timestamp;

        // Reward payout to agent owner
        bool payoutSuccess = qarbiToken.transfer(owner, task.rewardAmount);
        require(payoutSuccess, "Reward payout transfer failed");

        // Record onchain reputation reward in registry
        agentRegistry.recordTaskCompletion(task.assignedAgentId, true);

        emit ProofSubmitted(taskId, task.assignedAgentId, proofHash);
        emit TaskSettled(taskId, task.assignedAgentId, owner, task.rewardAmount);
    }

    /**
     * @notice Cancels an unfulfilled task and returns escrowed $QARBI tokens to creator
     */
    function cancelTask(uint256 taskId) external {
        Task storage task = tasks[taskId];
        require(task.id != 0, "Task does not exist");
        require(task.status == TaskStatus.OPEN, "Only open tasks can be cancelled");
        require(msg.sender == task.creator || msg.sender == protocolAdmin, "Only creator can cancel");

        task.status = TaskStatus.CANCELLED;
        bool refundSuccess = qarbiToken.transfer(task.creator, task.rewardAmount);
        require(refundSuccess, "Refund transfer failed");

        emit TaskCancelled(taskId, task.creator, task.rewardAmount);
    }

    function getTask(uint256 taskId) external view returns (Task memory) {
        require(tasks[taskId].id != 0, "Task does not exist");
        return tasks[taskId];
    }

    function getTotalTasks() external view returns (uint256) {
        return nextTaskId - 1;
    }
}
