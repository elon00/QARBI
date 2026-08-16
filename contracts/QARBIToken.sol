// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title QARBIToken
 * @notice Native utility & compute token for the QARBI Protocol on Arbitrum Sepolia.
 * Powers agent bounty escrows, session gas, compute credits, and reputation staking.
 */
contract QARBIToken {
    string public name = "QARBI Protocol Token";
    string public symbol = "QARBI";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    address public owner;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => uint256) public lastFaucetClaim;

    uint256 public constant FAUCET_AMOUNT = 250 * 10**18;
    uint256 public constant FAUCET_COOLDOWN = 1 hours;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event FaucetClaimed(address indexed recipient, uint256 amount, uint256 timestamp);
    event TokensBurned(address indexed from, uint256 amount, string reason);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner allowed");
        _;
    }

    constructor(uint256 initialSupply) {
        owner = msg.sender;
        uint256 supplyWithDecimals = initialSupply * 10**18;
        totalSupply = supplyWithDecimals;
        balanceOf[msg.sender] = supplyWithDecimals;
        emit Transfer(address(0), msg.sender, supplyWithDecimals);
    }

    function transfer(address recipient, uint256 amount) public returns (bool) {
        require(recipient != address(0), "Transfer to zero address");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");

        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        require(spender != address(0), "Approve to zero address");
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
        require(sender != address(0), "Transfer from zero address");
        require(recipient != address(0), "Transfer to zero address");
        require(balanceOf[sender] >= amount, "Insufficient balance");
        require(allowance[sender][msg.sender] >= amount, "Allowance exceeded");

        allowance[sender][msg.sender] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    /**
     * @notice Testnet Faucet allowing users & autonomous agents to mint $QARBI on Arbitrum Sepolia
     */
    function faucet() public returns (bool) {
        require(block.timestamp >= lastFaucetClaim[msg.sender] + FAUCET_COOLDOWN, "Faucet cooldown active");
        
        lastFaucetClaim[msg.sender] = block.timestamp;
        totalSupply += FAUCET_AMOUNT;
        balanceOf[msg.sender] += FAUCET_AMOUNT;

        emit Transfer(address(0), msg.sender, FAUCET_AMOUNT);
        emit FaucetClaimed(msg.sender, FAUCET_AMOUNT, block.timestamp);
        return true;
    }

    /**
     * @notice Burns tokens for compute credits, penalties, or gas compression
     */
    function burn(uint256 amount, string memory reason) public returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance to burn");
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;

        emit Transfer(msg.sender, address(0), amount);
        emit TokensBurned(msg.sender, amount, reason);
        return true;
    }

    function mint(address to, uint256 amount) external onlyOwner returns (bool) {
        require(to != address(0), "Mint to zero address");
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
        return true;
    }
}
