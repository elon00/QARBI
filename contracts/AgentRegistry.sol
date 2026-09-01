// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title AgentRegistry
 * @notice Sovereign Post-Quantum Identity & Digital Citizenship Ledger for AI Agents on Arbitrum Sepolia.
 * Manages NIST FIPS 204 (ML-DSA-65) public key commitments, delegated session keys, and reputation scores.
 */
contract AgentRegistry {
    enum AgentStatus { ACTIVE, DORMANT, TERMINATED }

    struct Agent {
        uint256 id;
        string name;
        string archetype;
        address owner;
        address delegatedSessionWallet;
        bytes32 pqcCommitmentHash;
        string metadataURI;
        uint256 singleTxLimit;
        uint256 dailyBudget;
        uint256 reputation;
        uint256 energy;
        uint256 completedTasks;
        uint256 failedTasks;
        uint256 registeredAt;
        AgentStatus status;
    }

    address public protocolAdmin;
    address public taskMarketAddress;
    uint256 public nextAgentId = 1;

    mapping(uint256 => Agent) public agents;
    mapping(address => uint256[]) public ownerAgents;
    mapping(bytes32 => bool) public usedCommitments;
    mapping(address => uint256) public sessionWalletToAgentId;

    event AgentRegistered(uint256 indexed agentId, string name, string archetype, address indexed owner, address delegatedSessionWallet, bytes32 pqcCommitmentHash, uint256 registeredAt);
    event ReputationUpdated(uint256 indexed agentId, uint256 oldRep, uint256 newRep, string reason);
    event EnergyUpdated(uint256 indexed agentId, uint256 newEnergy);
    event StatusChanged(uint256 indexed agentId, AgentStatus newStatus);
    event TaskMarketAddressSet(address indexed marketAddress);

    modifier onlyAdmin() {
        require(msg.sender == protocolAdmin, "Only admin authorized");
        _;
    }

    modifier onlyAuthorized() {
        require(msg.sender == protocolAdmin || msg.sender == taskMarketAddress, "Caller not authorized");
        _;
    }

    constructor() {
        protocolAdmin = msg.sender;
    }

    function setTaskMarketAddress(address _marketAddress) external onlyAdmin {
        require(_marketAddress != address(0), "Invalid market address");
        require(_marketAddress.code.length > 0, "Market must be a contract");
        taskMarketAddress = _marketAddress;
        emit TaskMarketAddressSet(_marketAddress);
    }

    function registerAgent(
        string memory name,
        string memory archetype,
        bytes32 pqcCommitmentHash,
        address delegatedSessionWallet,
        string memory metadataURI,
        uint256 singleTxLimit,
        uint256 dailyBudget
    ) external returns (uint256) {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(pqcCommitmentHash != bytes32(0), "Invalid PQC commitment hash");
        require(!usedCommitments[pqcCommitmentHash], "PQC commitment already registered");

        uint256 agentId = nextAgentId++;
        usedCommitments[pqcCommitmentHash] = true;
        if (delegatedSessionWallet != address(0)) sessionWalletToAgentId[delegatedSessionWallet] = agentId;

        agents[agentId] = Agent({
            id: agentId,
            name: name,
            archetype: archetype,
            owner: msg.sender,
            delegatedSessionWallet: delegatedSessionWallet,
            pqcCommitmentHash: pqcCommitmentHash,
            metadataURI: metadataURI,
            singleTxLimit: singleTxLimit > 0 ? singleTxLimit : 50,
            dailyBudget: dailyBudget > 0 ? dailyBudget : 250,
            reputation: 800,
            energy: 100,
            completedTasks: 0,
            failedTasks: 0,
            registeredAt: block.timestamp,
            status: AgentStatus.ACTIVE
        });
        ownerAgents[msg.sender].push(agentId);

        emit AgentRegistered(agentId, name, archetype, msg.sender, delegatedSessionWallet, pqcCommitmentHash, block.timestamp);
        return agentId;
    }

    function updateReputation(uint256 agentId, int256 delta, string memory reason) external onlyAuthorized {
        Agent storage agent = agents[agentId];
        require(agent.id != 0, "Agent does not exist");
        uint256 oldRep = agent.reputation;
        if (delta > 0) {
            uint256 newRep = oldRep + uint256(delta);
            agent.reputation = newRep > 1000 ? 1000 : newRep;
        } else if (delta < 0) {
            uint256 sub = uint256(-delta);
            agent.reputation = oldRep > sub ? oldRep - sub : 0;
        }
        emit ReputationUpdated(agentId, oldRep, agent.reputation, reason);
    }

    function recordTaskCompletion(uint256 agentId, bool success) external onlyAuthorized {
        Agent storage agent = agents[agentId];
        require(agent.id != 0, "Agent does not exist");
        if (success) {
            agent.completedTasks += 1;
            if (agent.reputation < 1000) {
                agent.reputation += 15;
                if (agent.reputation > 1000) agent.reputation = 1000;
            }
        } else {
            agent.failedTasks += 1;
            agent.reputation = agent.reputation >= 25 ? agent.reputation - 25 : 0;
        }
    }

    function updateEnergy(uint256 agentId, uint256 newEnergy) external onlyAuthorized {
        Agent storage agent = agents[agentId];
        require(agent.id != 0, "Agent does not exist");
        agent.energy = newEnergy > 100 ? 100 : newEnergy;
        emit EnergyUpdated(agentId, agent.energy);
    }

    function setAgentStatus(uint256 agentId, AgentStatus newStatus) external {
        Agent storage agent = agents[agentId];
        require(agent.id != 0, "Agent does not exist");
        require(msg.sender == agent.owner || msg.sender == protocolAdmin, "Not authorized to change status");
        agent.status = newStatus;
        emit StatusChanged(agentId, newStatus);
    }

    function getAgent(uint256 agentId) external view returns (Agent memory) {
        require(agents[agentId].id != 0, "Agent does not exist");
        return agents[agentId];
    }

    function getAgentAuth(uint256 agentId) external view returns (address owner, address sessionWallet, bool isActive) {
        Agent storage a = agents[agentId];
        require(a.id != 0, "Agent does not exist");
        return (a.owner, a.delegatedSessionWallet, a.status == AgentStatus.ACTIVE);
    }

    function getOwnerAgents(address owner) external view returns (uint256[] memory) {
        return ownerAgents[owner];
    }

    function getTotalAgents() external view returns (uint256) {
        return nextAgentId - 1;
    }
}
