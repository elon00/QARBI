// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title AgentWallet
 * @notice Policy-guarded Smart Contract Enclave & Session Wallet on Arbitrum Sepolia.
 * Enforces per-transaction caps, daily spending velocity budgets, whitelist verifications, and guardian killswitches.
 */
contract AgentWallet {
    address public owner;
    address public guardian;
    bool public isEmergencyLocked;

    uint256 public singleTxLimit;
    uint256 public dailyLimit;
    uint256 public spentToday;
    uint256 public lastResetDay;

    mapping(address => bool) public whitelistedTargets;

    event Executed(address indexed target, uint256 value, bytes data);
    event EmergencyLockToggled(bool isLocked, address indexed triggeredBy);
    event TargetWhitelisted(address indexed target, bool allowed);
    event LimitsUpdated(uint256 singleTxLimit, uint256 dailyLimit);

    modifier onlyOwnerOrGuardian() {
        require(msg.sender == owner || msg.sender == guardian, "Not authorized");
        _;
    }

    modifier whenNotLocked() {
        require(!isEmergencyLocked, "Enclave is emergency locked");
        _;
    }

    constructor(
        address _owner,
        address _guardian,
        uint256 _singleTxLimit,
        uint256 _dailyLimit
    ) {
        owner = _owner;
        guardian = _guardian;
        singleTxLimit = _singleTxLimit;
        dailyLimit = _dailyLimit;
        lastResetDay = block.timestamp / 1 days;
    }

    receive() external payable {}

    function setWhitelistedTarget(address target, bool allowed) external onlyOwnerOrGuardian {
        whitelistedTargets[target] = allowed;
        emit TargetWhitelisted(target, allowed);
    }

    function toggleEmergencyLock(bool locked) external onlyOwnerOrGuardian {
        isEmergencyLocked = locked;
        emit EmergencyLockToggled(locked, msg.sender);
    }

    function updateLimits(uint256 _singleTxLimit, uint256 _dailyLimit) external onlyOwnerOrGuardian {
        singleTxLimit = _singleTxLimit;
        dailyLimit = _dailyLimit;
        emit LimitsUpdated(_singleTxLimit, _dailyLimit);
    }

    function execute(
        address target,
        uint256 value,
        bytes calldata data
    ) external onlyOwnerOrGuardian whenNotLocked returns (bytes memory) {
        require(whitelistedTargets[target], "Target contract not on verified whitelist");
        require(value <= singleTxLimit, "Value exceeds single tx velocity cap");

        uint256 currentDay = block.timestamp / 1 days;
        if (currentDay > lastResetDay) {
            spentToday = 0;
            lastResetDay = currentDay;
        }

        require(spentToday + value <= dailyLimit, "Daily budget velocity cap exceeded");
        spentToday += value;

        (bool success, bytes memory result) = target.call{value: value}(data);
        require(success, "Execution failed");

        emit Executed(target, value, data);
        return result;
    }
}
