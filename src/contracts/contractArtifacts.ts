// Auto-generated Contract Artifacts with EVM Bytecode & ABIs

export const QARBITokenArtifact = {
  "contractName": "QARBIToken",
  "sourceFile": "QARBIToken.sol",
  "abi": [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "initialSupply",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "FaucetClaimed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "reason",
          "type": "string"
        }
      ],
      "name": "TokensBurned",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "FAUCET_AMOUNT",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "FAUCET_COOLDOWN",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "reason",
          "type": "string"
        }
      ],
      "name": "burn",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "faucet",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "lastFaucetClaim",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "mint",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  "bytecode": "0x6080346101a257601f610dcb38819003918201601f19168301916001600160401b038311848410176101a6578084926020946040528339810103126101a257516100495f546101ba565b601f811161016d575b507f51415242492050726f746f636f6c20546f6b656e0000000000000000000000285f55600154610082906101ba565b601f8111610137575b50600a64514152424960d81b016001556002805460ff19166012179055600480546001600160a01b03191633179055670de0b6b3a764000081810291801590830490911417156101235780600355335f5260056020528060405f20556040519081525f7fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60203393a3604051610bd890816101f38239f35b634e487b7160e01b5f52601160045260245ffd5b600581111561008b5760015f52601f60205f20910160051c905f5b82811061016057505061008b565b5f82820155600101610152565b6014811115610052575f8052601f60205f20910160051c905f5b828110610195575050610052565b5f82820155600101610187565b5f80fd5b634e487b7160e01b5f52604160045260245ffd5b90600182811c921680156101e8575b60208310146101d457565b634e487b7160e01b5f52602260045260245ffd5b91607f16916101c956fe60806040526004361015610011575f80fd5b5f3560e01c806306fdde03146109af578063095ea7b3146108f057806318160ddd146108d357806323b872dd1461076b578063313ce5671461074b57806340c10f191461064a57806370a08231146106125780637641e6f31461049a57806376697640146104775780637d1d5d191461045b5780638a877205146104235780638da5cb5b146103fb57806395d89b41146102ef578063a9059cbb14610251578063dd62ed3e146102015763de5f72fd146100c9575f80fd5b346101fd575f3660031901126101fd57335f52600760205260405f2054610e1081018091116101ab5742106101bf57335f5260076020524260405f2055600354680d8d726b7177a8000081018091116101ab57600355335f52600560205260405f20805490680d8d726b7177a8000082018092116101ab5755604051680d8d726b7177a8000081525f5f516020610b835f395f51905f5260203393a3604051680d8d726b7177a8000081524260208201527fa19a7d2b5bf6a987a66e0eac8a6eb2dbd34ae6a43285849af788b224268ec02260403392a2602060405160018152f35b634e487b7160e01b5f52601160045260245ffd5b60405162461bcd60e51b815260206004820152601660248201527546617563657420636f6f6c646f776e2061637469766560501b6044820152606490fd5b5f80fd5b346101fd5760403660031901126101fd5761021a610aad565b610222610ac3565b6001600160a01b039182165f908152600660209081526040808320949093168252928352819020549051908152f35b346101fd5760403660031901126101fd5761026a610aad565b6001600160a01b0316602435610281821515610ad9565b335f5260056020526102998160405f20541015610b25565b335f52600560205260405f206102b0828254610b68565b9055815f52600560205260405f206102c9828254610b75565b90556040519081525f516020610b835f395f51905f5260203392a3602060405160018152f35b346101fd575f3660031901126101fd576040515f6001548060011c906001811680156103f1575b6020831081146103dd578285529081156103b9575060011461035b575b6103578361034381850382610a67565b604051918291602083526020830190610a89565b0390f35b60015f9081527fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6939250905b80821061039f57509091508101602001610343610333565b919260018160209254838588010152019101909291610387565b60ff191660208086019190915291151560051b840190910191506103439050610333565b634e487b7160e01b5f52602260045260245ffd5b91607f1691610316565b346101fd575f3660031901126101fd576004546040516001600160a01b039091168152602090f35b346101fd5760203660031901126101fd576001600160a01b03610444610aad565b165f526007602052602060405f2054604051908152f35b346101fd575f3660031901126101fd576020604051610e108152f35b346101fd575f3660031901126101fd576020604051680d8d726b7177a800008152f35b346101fd5760403660031901126101fd5760243560043567ffffffffffffffff82116101fd57366023830112156101fd57816004013567ffffffffffffffff81116105fe57604051926104f7601f8301601f191660200185610a67565b81845236602483830101116101fd57815f926024602093018387013784010152335f5260056020528060405f2054106105b9577ffad31924d655455395c87544c8aa1ffdb5a7505a22a3c2e03f28003b6556a75f90335f52600560205260405f20610563828254610b68565b905561057181600354610b68565b6003555f6040518281525f516020610b835f395f51905f5260203392a360405190815260406020820152806105ab33946040830190610a89565b0390a2602060405160018152f35b60405162461bcd60e51b815260206004820152601c60248201527f496e73756666696369656e742062616c616e636520746f206275726e000000006044820152606490fd5b634e487b7160e01b5f52604160045260245ffd5b346101fd5760203660031901126101fd576001600160a01b03610633610aad565b165f526005602052602060405f2054604051908152f35b346101fd5760403660031901126101fd57610663610aad565b60045460243591906001600160a01b03163303610711576001600160a01b03169081156106d5575f516020610b835f395f51905f526020826106a85f94600354610b75565b60035584845260058252604084206106c1828254610b75565b9055604051908152a3602060405160018152f35b60405162461bcd60e51b81526020600482015260146024820152734d696e7420746f207a65726f206164647265737360601b6044820152606490fd5b60405162461bcd60e51b815260206004820152601260248201527113db9b1e481bdddb995c88185b1b1bddd95960721b6044820152606490fd5b346101fd575f3660031901126101fd57602060ff60025416604051908152f35b346101fd5760603660031901126101fd57610784610aad565b61078c610ac3565b604435916001600160a01b031690811561088e576001600160a01b0316916107b5831515610ad9565b815f5260056020526107cd8160405f20541015610b25565b5f82815260066020908152604080832033845290915290205481116108545760205f516020610b835f395f51905f5291835f526006825260405f2060018060a01b0333165f52825260405f20610824828254610b68565b9055835f526005825260405f2061083c828254610b68565b9055845f526005825260405f206106c1828254610b75565b60405162461bcd60e51b8152602060048201526012602482015271105b1b1bddd85b98d948195e18d95959195960721b6044820152606490fd5b60405162461bcd60e51b815260206004820152601a60248201527f5472616e736665722066726f6d207a65726f20616464726573730000000000006044820152606490fd5b346101fd575f3660031901126101fd576020600354604051908152f35b346101fd5760403660031901126101fd57610909610aad565b6001600160a01b0316602435811561096a57335f52600660205260405f20825f526020528060405f20556040519081527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560203392a3602060405160018152f35b60405162461bcd60e51b815260206004820152601760248201527f417070726f766520746f207a65726f20616464726573730000000000000000006044820152606490fd5b346101fd575f3660031901126101fd576040515f5f548060011c90600181168015610a5d575b6020831081146103dd578285529081156103b95750600114610a01576103578361034381850382610a67565b5f8080527f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563939250905b808210610a4357509091508101602001610343610333565b919260018160209254838588010152019101909291610a2b565b91607f16916109d5565b90601f8019910116810190811067ffffffffffffffff8211176105fe57604052565b805180835260209291819084018484015e5f828201840152601f01601f1916010190565b600435906001600160a01b03821682036101fd57565b602435906001600160a01b03821682036101fd57565b15610ae057565b60405162461bcd60e51b815260206004820152601860248201527f5472616e7366657220746f207a65726f206164647265737300000000000000006044820152606490fd5b15610b2c57565b60405162461bcd60e51b8152602060048201526014602482015273496e73756666696369656e742062616c616e636560601b6044820152606490fd5b919082039182116101ab57565b919082018092116101ab5756feddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa264697066735822122089f8c81354981c9172934a176b44984d1d604c395c10bb4e57f6789047d6c3e464736f6c63430008250033"
} as const;

export const AgentRegistryArtifact = {
  "contractName": "AgentRegistry",
  "sourceFile": "AgentRegistry.sol",
  "abi": [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "agentId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "archetype",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "delegatedSessionWallet",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "pqcCommitmentHash",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "registeredAt",
          "type": "uint256"
        }
      ],
      "name": "AgentRegistered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "agentId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newEnergy",
          "type": "uint256"
        }
      ],
      "name": "EnergyUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "agentId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "oldRep",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newRep",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "reason",
          "type": "string"
        }
      ],
      "name": "ReputationUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "agentId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "enum AgentRegistry.AgentStatus",
          "name": "newStatus",
          "type": "uint8"
        }
      ],
      "name": "StatusChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "marketAddress",
          "type": "address"
        }
      ],
      "name": "TaskMarketAddressSet",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "agents",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "archetype",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "delegatedSessionWallet",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "pqcCommitmentHash",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "metadataURI",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "singleTxLimit",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "dailyBudget",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "reputation",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "energy",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "completedTasks",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "failedTasks",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "registeredAt",
          "type": "uint256"
        },
        {
          "internalType": "enum AgentRegistry.AgentStatus",
          "name": "status",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "agentId",
          "type": "uint256"
        }
      ],
      "name": "getAgent",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "archetype",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "delegatedSessionWallet",
              "type": "address"
            },
            {
              "internalType": "bytes32",
              "name": "pqcCommitmentHash",
              "type": "bytes32"
            },
            {
              "internalType": "string",
              "name": "metadataURI",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "singleTxLimit",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "dailyBudget",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "reputation",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "energy",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "completedTasks",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "failedTasks",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "registeredAt",
              "type": "uint256"
            },
            {
              "internalType": "enum AgentRegistry.AgentStatus",
              "name": "status",
              "type": "uint8"
            }
          ],
          "internalType": "struct AgentRegistry.Agent",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "agentId",
          "type": "uint256"
        }
      ],
      "name": "getAgentAuth",
      "outputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "sessionWallet",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "getOwnerAgents",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalAgents",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "nextAgentId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "ownerAgents",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "protocolAdmin",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "agentId",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        }
      ],
      "name": "recordTaskCompletion",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "archetype",
          "type": "string"
        },
        {
          "internalType": "bytes32",
          "name": "pqcCommitmentHash",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "delegatedSessionWallet",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "metadataURI",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "singleTxLimit",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "dailyBudget",
          "type": "uint256"
        }
      ],
      "name": "registerAgent",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "sessionWalletToAgentId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "agentId",
          "type": "uint256"
        },
        {
          "internalType": "enum AgentRegistry.AgentStatus",
          "name": "newStatus",
          "type": "uint8"
        }
      ],
      "name": "setAgentStatus",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_marketAddress",
          "type": "address"
        }
      ],
      "name": "setTaskMarketAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "taskMarketAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "agentId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "newEnergy",
          "type": "uint256"
        }
      ],
      "name": "updateEnergy",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "agentId",
          "type": "uint256"
        },
        {
          "internalType": "int256",
          "name": "delta",
          "type": "int256"
        },
        {
          "internalType": "string",
          "name": "reason",
          "type": "string"
        }
      ],
      "name": "updateReputation",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "usedCommitments",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "bytecode": "0x60808060405234602b5760016002555f80546001600160a01b0319163317905561159990816100308239f35b5f80fdfe60806040526004361015610011575f80fd5b5f3560e01c80630b62134214610b7f57806313ae356514610ad85780632de5aaf71461087d57806330efc498146108605780633731a16f146108375780633c93baeb146106db578063420f6861146106b4578063513856c81461058a57806362febe4f146105325780637585840a1461047e578063914020391461044f5780639890006214610351578063a4bf7cf614610329578063b21910ef146102f1578063c6fe8e3114610204578063d9a9a8d3146101585763e7d92bee146100d4575f80fd5b34610154576020366003190112610154576004355f52600360205260405f206100ff81541515611500565b60018060a01b0360038201541660ff600e60018060a01b03600485015416930154166003811015610140576060926040519283526020830152156040820152f35b634e487b7160e01b5f52602160045260245ffd5b5f80fd5b346101545760203660031901126101545761017161135c565b5f546001600160a01b031633036101c757600180546001600160a01b0319166001600160a01b039290921691821790557f5223e8a853067e901089253975bcb38e611d4a615b88fcf9f78969a8a471256c5f80a2005b60405162461bcd60e51b815260206004820152601560248201527413db9b1e4818591b5a5b88185d5d1a1bdc9a5e9959605a1b6044820152606490fd5b3461015457604036600319011261015457600435602435600381101561015457815f52600360205260405f2061023c81541515611500565b60038101546001600160a01b0316331480156102de575b1561029957816102897f365a3d0a71be5f440c8224437355d5bd81a703759bf906e441902272bfbafcb393600e602094016114a4565b6102966040518092611396565ba2005b60405162461bcd60e51b815260206004820152601f60248201527f4e6f7420617574686f72697a656420746f206368616e676520737461747573006044820152606490fd5b505f546001600160a01b03163314610253565b34610154576020366003190112610154576001600160a01b0361031261135c565b165f526006602052602060405f2054604051908152f35b34610154575f366003190112610154576001546040516001600160a01b039091168152602090f35b34610154576040366003190112610154576024358015158103610154575f546001600160a01b03163314801561043b575b61038b906114bc565b6004355f52600360205260405f20906103a682541515611500565b1561040357600b8101908154600181018091116103ef57600992550180546103e881106103cf57005b600f81018091116103ef57806103e8918355116103e857005b6103e89055005b634e487b7160e01b5f52601160045260245ffd5b600c8101908154600181018091116103ef5790915560090180546019116104365780546018198101919082116103ef5755005b5f9055005b506001546001600160a01b03163314610382565b34610154576020366003190112610154576004355f526005602052602060ff60405f2054166040519015158152f35b34610154576020366003190112610154576001600160a01b0361049f61135c565b165f52600460205260405f20604051806020835491828152019081935f5260205f20905f5b81811061051c57505050816104da9103826112e4565b604051918291602083019060208452518091526040830191905f5b818110610503575050500390f35b82518452859450602093840193909201916001016104f5565b82548452602090930192600192830192016104c4565b346101545760403660031901126101545761054b61135c565b6001600160a01b03165f908152600460205260409020805460243591908210156101545760209161057b9161147b565b90549060031b1c604051908152f35b34610154576020366003190112610154576004355f52600360205260405f208054600182016105b8906113db565b906105c5600284016113db565b60038401546004850154600586015492956001600160a01b03928316939092909116906105f4600684016113db565b946007840154956008850154600986015491600a87015493600b88015495600c89015497600d8a015499600e015460ff169a6040519e8f9e8f958652602086016101e090526101e0860161064791611372565b858103604087015261065891611372565b936060015260808d015260a08c01528a810360c08c015261067891611372565b9760e08a01526101008901526101208801526101408701526101608601526101808501526101a08401526101c083016106b091611396565b0390f35b34610154575f366003190112610154575f546040516001600160a01b039091168152602090f35b346101545760603660031901126101545760043560243560443567ffffffffffffffff811161015457610712903690600401611306565b5f546001600160a01b031633148015610823575b61072f906114bc565b825f526003602052600960405f2061074981541515611500565b01805490925f8113156107ae5781018082116103ef575f5160206115445f395f51905f52936107a4916103e88111156107a957506103e85b81555b549260405193849384526020840152606060408401526060830190611372565b0390a2005b610781565b5f81126107ce575b506107a45f5160206115445f395f51905f5293610784565b600160ff1b81146103ef57805f0382115f1461080a5781018181116103ef575f5160206115445f395f51905f52936107a4915b815593506107b6565b506107a45f5160206115445f395f51905f52935f610801565b506001546001600160a01b03163314610726565b34610154575f366003190112610154576002545f1981019081116103ef57602090604051908152f35b34610154575f366003190112610154576020600254604051908152f35b34610154576020366003190112610154576004355f6101c06040516108a1816112c7565b82815260606020820152606060408201528260608201528260808201528260a0820152606060c08201528260e08201528261010082015282610120820152826101408201528261016082015282610180820152826101a08201520152805f52600360205261091460405f20541515611500565b5f52600360205260405f206040519061092c826112c7565b8054825261093c600182016113db565b9060208301918252610950600282016113db565b92604081019384528060018060a01b03600384015416926060820193845260018060a01b0360048201541660808301908152600582015460a0840190815261099a600684016113db565b60c0850190815260078401549660e0860197885260088501549061010087019182526009860154926101208801938452600a870154946101408901958652600b880154966101608a0197885260ff600e600c8b01549a6101808d019b8c526101a0600d8201549d019c8d520154169a6101c081019b6003811015610140578c526040519e8f9e8f926020845251602084015251604083016101e090526102008301610a4491611372565b9051828203601f19016060840152610a5c9190611372565b94516001600160a01b0390811660809092019190915290511660a08d01525160c08c0152518a8203601f190160e08c0152610a979190611372565b97516101008a015251610120890152516101408801525161016087015251610180860152516101a0850152516101c0840152516101e083016106b091611396565b34610154576040366003190112610154576004357f76086644802772625b8df30a3d7d84450d578671eff342a76435bd1abd97d1006020600a60243560018060a01b035f541633148015610b6b575b610b30906114bc565b845f526003835260405f2090610b4882541515611500565b6064811115610b63575060649182915b0155604051908152a2005b918291610b58565b506001546001600160a01b03163314610b27565b346101545760e03660031901126101545760043567ffffffffffffffff811161015457610bb0903690600401611306565b60243567ffffffffffffffff811161015457610bd0903690600401611306565b60443591906064356001600160a01b03811691908290036101545760843567ffffffffffffffff811161015457610c0b903690600401611306565b9260a4359360c43582511561128b57861561124657865f52600560205260ff60405f2054166111f757600254955f1987146103ef5760018701600255875f52600560205260405f20600160ff19825416179055856111e4575b80156111db57905b80156111d3575b60405191610c80836112c7565b87835260208301938585528660408501523360608501528760808501528960a085015260c084015260e083015261010082015261032061012082015260646101408201525f6101608201525f610180820152426101a08201525f6101c0820152855f52600360205260405f2091815183555180519067ffffffffffffffff8211610f58578190610d1360018601546113a3565b601f811161116f575b50602090601f8311600114611102575f926110f7575b50508160011b915f199060031b1c19161760018301555b60028201604082015180519067ffffffffffffffff8211610f58578190610d7084546113a3565b601f811161109e575b50602090601f831160011461103b575f92611030575b50508160011b915f199060031b1c19161790555b60608101516003830180546001600160a01b039283166001600160a01b031991821617909155608083015160048501805491909316911617905560a0810151600583015560c08101518051600684019167ffffffffffffffff8211610f5857610e0c83546113a3565b601f8111610fdf575b50602090601f8311600114610f77576101c0949392915f9183610f6c575b50508160011b915f199060031b1c19161790555b60e0810151600784015561010081015160088401556101208101516009840155610140810151600a840155610160810151600b840155610180810151600c8401556101a0810151600d8401550151600381101561014057600e610eaa92016114a4565b335f52600460205260405f209081549568010000000000000000871015610f5857610f398694610f03897fae28b955c60e29121c78cb95300f31282d20643def55bd5d4d1bf681acd4d13496600160209c01815561147b565b81549060031b9088821b915f19901b1916179055610f2c6040519460a0865260a0860190611372565b908482038a860152611372565b94604083015260608201524260808201528033940390a3604051908152f35b634e487b7160e01b5f52604160045260245ffd5b015190508b80610e33565b90601f19831691845f52815f20925f5b818110610fc757509160019391856101c09897969410610faf575b505050811b019055610e47565b01515f1960f88460031b161c191690558b8080610fa2565b92936020600181928786015181550195019301610f87565b82811115610e1557835f5260205f20601f840160051c9060208510611028575b81601f9101920160051c03905f5b82811061101b575050610e15565b5f8282015560010161100d565b5f9150610fff565b015190508a80610d8f565b5f8581528281209350601f198516905b818110611086575090846001959493921061106e575b505050811b019055610da3565b01515f1960f88460031b161c191690558a8080611061565b9293602060018192878601518155019501930161104b565b82811115610d7957909150835f5260205f20601f840160051c90602085106110ef575b849392601f0160051c82900391015f5b8281106110df575050610d79565b5f818301558594506001016110d1565b5f91506110c1565b015190508980610d32565b9250600185015f52805f20905f935b601f1984168510611154576001945083601f1981161061113c575b505050811b016001830155610d49565b01515f1960f88460031b161c1916905589808061112c565b81810151835560209485019460019093019290910190611111565b82811115610d1c57909150600185015f5260205f20601f840160051c90602085106111cb575b92909184925f945b81601f840160051c0386106111b6575050509091610d1c565b5f81830187015560019095019486945061119d565b5f9150611195565b5060fa610c73565b50603290610c6c565b855f5260066020528660405f2055610c64565b60405162461bcd60e51b815260206004820152602160248201527f50514320636f6d6d69746d656e7420616c7265616479207265676973746572656044820152601960fa1b6064820152608490fd5b60405162461bcd60e51b815260206004820152601b60248201527f496e76616c69642050514320636f6d6d69746d656e74206861736800000000006044820152606490fd5b60405162461bcd60e51b81526020600482015260146024820152734e616d652063616e6e6f7420626520656d70747960601b6044820152606490fd5b6101e0810190811067ffffffffffffffff821117610f5857604052565b90601f8019910116810190811067ffffffffffffffff821117610f5857604052565b81601f820112156101545780359067ffffffffffffffff8211610f58576040519261133b601f8401601f1916602001856112e4565b8284526020838301011161015457815f926020809301838601378301015290565b600435906001600160a01b038216820361015457565b805180835260209291819084018484015e5f828201840152601f01601f1916010190565b9060038210156101405752565b90600182811c921680156113d1575b60208310146113bd57565b634e487b7160e01b5f52602260045260245ffd5b91607f16916113b2565b9060405191825f8254926113ee846113a3565b80845293600181169081156114595750600114611415575b50611413925003836112e4565b565b90505f9291925260205f20905f915b81831061143d575050906020611413928201015f611406565b6020919350806001915483858901015201910190918492611424565b90506020925061141394915060ff191682840152151560051b8201015f611406565b8054821015611490575f5260205f2001905f90565b634e487b7160e01b5f52603260045260245ffd5b9060038110156101405760ff80198354169116179055565b156114c357565b60405162461bcd60e51b815260206004820152601560248201527410d85b1b195c881b9bdd08185d5d1a1bdc9a5e9959605a1b6044820152606490fd5b1561150757565b60405162461bcd60e51b81526020600482015260146024820152731059d95b9d08191bd95cc81b9bdd08195e1a5cdd60621b6044820152606490fdfea98c95045e5b7a322aa9588c185e16cddc3a614e56b9762d0b7d678bcc076910a26469706673582212208e305b762932e1d30b498c9bb8efe2ad82f777d0758e6d9967e7648e79ec238d64736f6c63430008250033"
} as const;

export const TaskMarketArtifact = {
  "contractName": "TaskMarket",
  "sourceFile": "TaskMarket.sol",
  "abi": [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_tokenAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_registryAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "taskId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "agentId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "proofHash",
          "type": "bytes32"
        }
      ],
      "name": "ProofSubmitted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "taskId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "refundAmount",
          "type": "uint256"
        }
      ],
      "name": "TaskCancelled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "taskId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "agentId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "claimant",
          "type": "address"
        }
      ],
      "name": "TaskClaimed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "taskId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "requiredArchetype",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "rewardAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "createdAt",
          "type": "uint256"
        }
      ],
      "name": "TaskCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "taskId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "agentId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "rewardPaid",
          "type": "uint256"
        }
      ],
      "name": "TaskSettled",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "agentRegistry",
      "outputs": [
        {
          "internalType": "contract IAgentRegistry",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "taskId",
          "type": "uint256"
        }
      ],
      "name": "cancelTask",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "taskId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "agentId",
          "type": "uint256"
        }
      ],
      "name": "claimTask",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "requiredArchetype",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "rewardAmount",
          "type": "uint256"
        }
      ],
      "name": "createTask",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "taskId",
          "type": "uint256"
        }
      ],
      "name": "getTask",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "creator",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "requiredArchetype",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "rewardAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "assignedAgentId",
              "type": "uint256"
            },
            {
              "internalType": "bytes32",
              "name": "proofHash",
              "type": "bytes32"
            },
            {
              "internalType": "enum TaskMarket.TaskStatus",
              "name": "status",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "createdAt",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "completedAt",
              "type": "uint256"
            }
          ],
          "internalType": "struct TaskMarket.Task",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalTasks",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "nextTaskId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "protocolAdmin",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "qarbiToken",
      "outputs": [
        {
          "internalType": "contract IQARBIToken",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_tokenAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_registryAddress",
          "type": "address"
        }
      ],
      "name": "setContracts",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "taskId",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "proofHash",
          "type": "bytes32"
        }
      ],
      "name": "submitProofAndSettle",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "tasks",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "requiredArchetype",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "rewardAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "assignedAgentId",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "proofHash",
          "type": "bytes32"
        },
        {
          "internalType": "enum TaskMarket.TaskStatus",
          "name": "status",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "createdAt",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "completedAt",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "bytecode": "0x608034609657601f6116f038819003918201601f19168301916001600160401b03831184841017609a578084926040948552833981010312609657604b602060458360ae565b920160ae565b600160038190555f8054336001600160a01b03199182161790915581546001600160a01b03948516908216179091556002805492909316911617905560405161162e90816100c28239f35b5f80fd5b634e487b7160e01b5f52604160045260245ffd5b51906001600160a01b038216820360965756fe6080806040526004361015610012575f80fd5b5f905f3560e01c9081630d1cfcae146113a457508063103099f314610d015780631d65e77e14610b225780633bad40ea146107475780633c93b90514610708578063420f6861146106e15780637eec20a8146104aa5780638d977672146103bb57806393faca2a14610392578063d8952a49146102d9578063db6bebf9146100c25763fdc3d8d7146100a2575f80fd5b346100bf57806003193601126100bf576020600354604051908152f35b80fd5b50346100bf5760403660031901126100bf576004356024358183526004602052604083206100f281541515611572565b600881019060ff82541660048110156102c55761028d576002546040516373ec95f760e11b81526004810185905290606090829060249082906001600160a01b03165afa80156102825786908792889161024d575b5015610212576001600160a01b031633149081156101ff575b5080156101ec575b156101a757600601829055805460ff1916600117905533917fadb41d3227141be28f9f5e534a02e82d83fc4a946b0ae913099a2371b9316aae8480a480f35b60405162461bcd60e51b815260206004820152601b60248201527f556e617574686f72697a6564206167656e74206f70657261746f7200000000006044820152606490fd5b5084546001600160a01b03163314610168565b6001600160a01b0316331490505f610160565b60405162461bcd60e51b81526020600482015260136024820152724167656e74206973206e6f742061637469766560681b6044820152606490fd5b915050610272915060603d60601161027b575b61026a81836113e4565b8101906115c8565b9190915f610147565b503d610260565b6040513d88823e3d90fd5b60405162461bcd60e51b815260206004820152601060248201526f2a30b9b59034b9903737ba1037b832b760811b6044820152606490fd5b634e487b7160e01b86526021600452602486fd5b50346100bf5760403660031901126100bf576004356001600160a01b0381169081900361038e576024356001600160a01b038116919082900361038a5782546001600160a01b03163303610350576001600160601b0360a01b60015416176001556001600160601b0360a01b600254161760025580f35b60405162461bcd60e51b815260206004820152601260248201527113db9b1e4818591b5a5b88185b1b1bddd95960721b6044820152606490fd5b8280fd5b5080fd5b50346100bf57806003193601126100bf576001546040516001600160a01b039091168152602090f35b50346100bf5760203660031901126100bf5760048035825260205260409020805460018201546001600160a01b0316916103f7600282016114c5565b610403600383016114c5565b91610410600482016114c5565b926005820154936006830154600784015491600885015460ff1693600986015495600a0154966040519a8b9a8b5260208b015260408a0161016090526101608a0161045a9161145c565b89810360608b015261046b9161145c565b88810360808a015261047c9161145c565b9560a088015260c087015260e0860152610100850161049a91611480565b6101208401526101408301520390f35b50346100bf5760203660031901126100bf57600435808252600460205260408220906104d882541515611572565b6008820160ff81541660048110156106cd5761068957600183019060018060a01b0382541633148015610676575b1561063157805460ff1916600317905560015481546005909401805460405163a9059cbb60e01b81526001600160a01b0396871660048201526024810191909152909490916020918391168188816044810103925af19081156106265785916105e8575b50156105aa5760207f06f63d695245e4cf8f0b7aae0b8da95876a4b173ba8d0d4466cc83c357dda3a89160018060a01b039054169354604051908152a380f35b60405162461bcd60e51b81526020600482015260166024820152751499599d5b99081d1c985b9cd9995c8819985a5b195960521b6044820152606490fd5b90506020813d60201161061e575b81610603602093836113e4565b8101031261061a5761061490611565565b5f61056a565b8480fd5b3d91506105f6565b6040513d87823e3d90fd5b60405162461bcd60e51b815260206004820152601760248201527f4f6e6c792063726561746f722063616e2063616e63656c0000000000000000006044820152606490fd5b5084546001600160a01b03163314610506565b606460405162461bcd60e51b815260206004820152602060248201527f4f6e6c79206f70656e207461736b732063616e2062652063616e63656c6c65646044820152fd5b634e487b7160e01b85526021600452602485fd5b50346100bf57806003193601126100bf57546040516001600160a01b039091168152602090f35b50346100bf57806003193601126100bf576003545f1981019190821161073357602082604051908152f35b634e487b7160e01b81526011600452602490fd5b50346109675760403660031901126109675760043560243590805f52600460205260405f2061077881541515611572565b600881019260ff8454166004811015610b0e57600103610ac9578015610a8f5760018060a01b03600254166006830190606082546024604051809481936373ec95f760e11b835260048301525afa95861561095c575f915f97610a6b575b506001600160a01b03821696338814908115610a58575b508015610a42575b8015610a2f575b156109ea5760078501849055805460ff1916600217905542600a8501556001546005909401805460405163a9059cbb60e01b81526001600160a01b039384166004820152602481019190915290949091602091839116815f816044810103925af190811561095c575f916109b0575b501561096b5760018060a01b03600254168154813b15610967575f91604483926040519485938492634c48003160e11b84526004840152600160248401525af1801561095c57610917575b5083927fb0755c953aaa49e0343ee8b81548c4a9c9c93b2e1de17336ef73c2f14fcd8c62926020957f9b5cdf2a1d86062250bc359360ca976cc957376d56fd42bbea88d776805c9a51879454978893604051908152a354604051908152a480f35b6020949390859297509261094c5f7fb0755c953aaa49e0343ee8b81548c4a9c9c93b2e1de17336ef73c2f14fcd8c62956113e4565b5f979495919490935091506108b6565b6040513d5f823e3d90fd5b5f80fd5b60405162461bcd60e51b815260206004820152601d60248201527f526577617264207061796f7574207472616e73666572206661696c65640000006044820152606490fd5b90506020813d6020116109e2575b816109cb602093836113e4565b81010312610967576109dc90611565565b5f61086b565b3d91506109be565b60405162461bcd60e51b815260206004820152601e60248201527f4e6f7420617574686f72697a656420746f207375626d69742070726f6f6600006044820152606490fd5b505f546001600160a01b031633146107fc565b5060018501546001600160a01b031633146107f5565b6001600160a01b0316331490505f6107ed565b909650610a87915060603d60601161027b5761026a81836113e4565b50955f6107d6565b60405162461bcd60e51b8152602060048201526012602482015271092dcecc2d8d2c840e0e4dedecc40d0c2e6d60731b6044820152606490fd5b60405162461bcd60e51b815260206004820152601760248201527f5461736b206973206e6f7420696e2070726f67726573730000000000000000006044820152606490fd5b634e487b7160e01b5f52602160045260245ffd5b34610967576020366003190112610967576004355f610140604051610b46816113c7565b82815282602082015260606040820152606080820152606060808201528260a08201528260c08201528260e082015282610100820152826101208201520152805f526004602052610b9c60405f20541515611572565b5f52600460205260405f20604051610bb3816113c7565b8154815260018201546001600160a01b03166020820190815291610bd9600282016114c5565b60408301908152610bec600383016114c5565b9160608401928352610c00600482016114c5565b926080850193845260058201549360a08601948552600683015460c0870190815260078401549160e0880192835260ff600886015416936101008901946004811015610b0e5785526009860154956101208a01968752600a0154966101408a019788526040519a8b9a60208c525160208c0152600160a01b6001900390511660408b01525160608a0161016090526101808a01610c9c9161145c565b9051898203601f190160808b0152610cb4919061145c565b9051888203601f190160a08a0152610ccc919061145c565b955160c08801525160e087015251610100860152516101208501610cef91611480565b51610140840152516101608301520390f35b346109675760803660031901126109675760043567ffffffffffffffff811161096757610d32903690600401611406565b60243567ffffffffffffffff811161096757610d52903690600401611406565b9060443567ffffffffffffffff811161096757610d73903690600401611406565b906064359080511561136b57811561131a576001546040516323b872dd60e01b81523360048201523060248201526044810184905290602090829060649082905f906001600160a01b03165af190811561095c575f916112e0575b501561129b57600354925f198414611287576001840160035560405191610df4836113c7565b84835260208301953387526040840192828452606085019182526080850181815260a0860187815260c08701905f825260e08801925f84526101008901955f87526101208a0198428a526101408b019a5f8c528d5f52600460205260405f209e8f915182556001820190600160a01b600190039051166001600160601b0360a01b825416179055600201905180519067ffffffffffffffff82116110e5578190610e9e845461148d565b601f811161122e575b50602090601f83116001146111cb575f926111c0575b50508160011b915f199060031b1c19161790555b51805160038e019167ffffffffffffffff82116110e5578190610ef4845461148d565b601f8111611167575b50602090601f8311600114611104575f926110f9575b50508160011b915f199060031b1c19161790555b51805160048d019167ffffffffffffffff82116110e5578190610f4a845461148d565b601f811161108c575b50602090601f8311600114611029575f9261101e575b50508160011b915f199060031b1c19161790555b5160058b01555160068a0155516007890155600888019151976004891015610b0e57600a88967f7ef2ea2bdef77ccf5258ed00c883d78e43c82ff5d0a77bfc4a9b6f4feda8d63e966110049560209c60ff8019835416911617905551600984015551910155610ff76040519360808552608085019061145c565b908382038985015261145c565b9360408201524260608201528033940390a3604051908152f35b015190508e80610f69565b5f8581528281209350601f198516905b818110611074575090846001959493921061105c575b505050811b019055610f7d565b01515f1960f88460031b161c191690558e808061104f565b92936020600181928786015181550195019301611039565b82811115610f5357909150835f5260205f20601f840160051c90602085106110dd575b849392601f0160051c82900391015f5b8281106110cd575050610f53565b5f818301558594506001016110bf565b5f91506110af565b634e487b7160e01b5f52604160045260245ffd5b015190508f80610f13565b5f8581528281209350601f198516905b81811061114f5750908460019594939210611137575b505050811b019055610f27565b01515f1960f88460031b161c191690558f808061112a565b92936020600181928786015181550195019301611114565b82811115610efd57909150835f5260205f20601f840160051c90602085106111b8575b849392601f0160051c82900391015f5b8281106111a8575050610efd565b5f8183015585945060010161119a565b5f915061118a565b015190505f80610ebd565b5f8581528281209350601f198516905b81811061121657509084600195949392106111fe575b505050811b019055610ed1565b01515f1960f88460031b161c191690555f80806111f1565b929360206001819287860151815501950193016111db565b82811115610ea757909150835f5260205f20601f840160051c906020851061127f575b849392601f0160051c82900391015f5b82811061126f575050610ea7565b5f81830155859450600101611261565b5f9150611251565b634e487b7160e01b5f52601160045260245ffd5b60405162461bcd60e51b815260206004820152601f60248201527f546f6b656e207472616e7366657220746f20657363726f77206661696c6564006044820152606490fd5b90506020813d602011611312575b816112fb602093836113e4565b810103126109675761130c90611565565b85610dce565b3d91506112ee565b60405162461bcd60e51b8152602060048201526024808201527f52657761726420616d6f756e74206d75737420626520677265617465722074686044820152630616e20360e41b6064820152608490fd5b60405162461bcd60e51b8152602060048201526011602482015270151a5d1b19481a5cc81c995c5d5a5c9959607a1b6044820152606490fd5b34610967575f366003190112610967576002546001600160a01b03168152602090f35b610160810190811067ffffffffffffffff8211176110e557604052565b90601f8019910116810190811067ffffffffffffffff8211176110e557604052565b81601f820112156109675780359067ffffffffffffffff82116110e5576040519261143b601f8401601f1916602001856113e4565b8284526020838301011161096757815f926020809301838601378301015290565b805180835260209291819084018484015e5f828201840152601f01601f1916010190565b906004821015610b0e5752565b90600182811c921680156114bb575b60208310146114a757565b634e487b7160e01b5f52602260045260245ffd5b91607f169161149c565b9060405191825f8254926114d88461148d565b808452936001811690811561154357506001146114ff575b506114fd925003836113e4565b565b90505f9291925260205f20905f915b8183106115275750509060206114fd928201015f6114f0565b602091935080600191548385890101520191019091849261150e565b9050602092506114fd94915060ff191682840152151560051b8201015f6114f0565b5190811515820361096757565b1561157957565b60405162461bcd60e51b815260206004820152601360248201527215185cdac8191bd95cc81b9bdd08195e1a5cdd606a1b6044820152606490fd5b51906001600160a01b038216820361096757565b90816060910312610967576115dc816115b4565b916115f560406115ee602085016115b4565b9301611565565b9056fea2646970667358221220db909d629191c4722ce28e3463c5d79325de05adba6ee5fac035bcb705fef1a064736f6c63430008250033"
} as const;

export const ConwayEngineArtifact = {
  "contractName": "ConwayEngine",
  "sourceFile": "ConwayEngine.sol",
  "abi": [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "livingCount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "entropyScore",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "synergyScore",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "GridStepped",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "COLS",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "ROWS",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "livingCells",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "agentCount",
          "type": "uint256"
        }
      ],
      "name": "calculateAgentSynergy",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64[24]",
          "name": "livingGrid",
          "type": "uint64[24]"
        }
      ],
      "name": "stepGrid",
      "outputs": [
        {
          "internalType": "uint64[24]",
          "name": "nextGrid",
          "type": "uint64[24]"
        },
        {
          "internalType": "uint256",
          "name": "livingCount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "entropyScore",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "synergyScore",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  "bytecode": "0x608080604052346015576104f1908161001a8239f35b5f80fdfe6080806040526004361015610012575f80fd5b5f3560e01c9081630cc23225146103be5750806322b51670146100905780632eb524e8146100755763aaa04ca114610048575f80fd5b34610071576040366003190112610071576020610069602435600435610447565b604051908152f35b5f80fd5b34610071575f36600319011261007157602060405160248152f35b34610071576103003660031901126100715736610304116100715761030060405181810181811067ffffffffffffffff8211176103aa5760405281803683375f915f5b60ff811660188110156102cd575f9493919294935f94825f0b925b60ff871660248110156102a2575f989598975f1996825f0b985b885f0b600181136101fb57159b5f195b805f0b600181136101e3578e90816101da575b506101a357601861013c8c8c6103e7565b5f0b01607f8113607f198212176101c6576024610161838f936018905f0b07936103e7565b5f0b0190607f8213607f198312176101c657600160ff61019961019482602467ffffffffffffffff975f0b0795166103ff565b610425565b92161b16166101b1575b6101ac906103d7565b610118565b9b60ff1660ff81146101c6576001019b6101a3565b634e487b7160e01b5f52601160045260245ffd5b9050158f61012b565b5050919b50976101f2906103d7565b979a909a610108565b50959a99929193975097506001610214610194896103ff565b911b915f91831667ffffffffffffffff161561028f5760ff1660028114908115610284575b5061027c575b610257575b50600160ff9101169593969194966100ee565b67ffffffffffffffff90989291981617905f1981146101c65760019081019790610244565b50600161023f565b60039150148b610239565b60ff600391160361023f5750600161023f565b505067ffffffffffffffff16600585901b611fe01687015294919350909160010160ff1690506100d3565b505091617a698102811590828104617a69148217156101c6576102f46103e891429061043a565b0690806103a257605583029083820460551417156101c65761031c600a91609684069061043a565b04915b7f789c493fb3ff01883f4d1a73bb81476506f3f39fbe60a01676074bce70ff76346080604051838152846020820152856040820152426060820152a1604051935f855b601882106103825750506103609550840152610320830152610340820152f35b60208060019267ffffffffffffffff8b5116815201980191019096610362565b505f9161031f565b634e487b7160e01b5f52604160045260245ffd5b34610071575f3660031901126100715780601860209252f35b5f0b607f81146101c65760010190565b905f0b905f0b0190607f198212607f8313176101c657565b60188110156104115760051b60040190565b634e487b7160e01b5f52603260045260245ffd5b3567ffffffffffffffff811681036100715790565b919082018092116101c657565b8015918280156104b3575b6104ab5780820292828404821417156101c657600c830292808404600c14901517156101c6576104819161043a565b9081156104975704606401806064116101c65790565b634e487b7160e01b5f52601260045260245ffd5b505050606490565b50801561045256fea26469706673582212205018824b16cf490a37cbf6c200374a7c9db930e0385748bb68a68037d6a89b9b64736f6c63430008250033"
} as const;

export const AgentWalletArtifact = {
  "contractName": "AgentWallet",
  "sourceFile": "AgentWallet.sol",
  "abi": [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_guardian",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_singleTxLimit",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_dailyLimit",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isLocked",
          "type": "bool"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "triggeredBy",
          "type": "address"
        }
      ],
      "name": "EmergencyLockToggled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "target",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "Executed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "singleTxLimit",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "dailyLimit",
          "type": "uint256"
        }
      ],
      "name": "LimitsUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "target",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "allowed",
          "type": "bool"
        }
      ],
      "name": "TargetWhitelisted",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "dailyLimit",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "target",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "execute",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "guardian",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "isEmergencyLocked",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "lastResetDay",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "target",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "allowed",
          "type": "bool"
        }
      ],
      "name": "setWhitelistedTarget",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "singleTxLimit",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "spentToday",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "locked",
          "type": "bool"
        }
      ],
      "name": "toggleEmergencyLock",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_singleTxLimit",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_dailyLimit",
          "type": "uint256"
        }
      ],
      "name": "updateLimits",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "whitelistedTargets",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ],
  "bytecode": "0x60803460a457601f61088a38819003918201601f19168301916001600160401b0383118484101760a85780849260809460405283398101031260a45760428160bc565b90604d6020820160bc565b606060408301519201519260018060a01b031660018060a01b03195f5416175f5560018060a01b031660018060a01b031960015416176001556002556003556201518042046005556040516107ba90816100d08239f35b5f80fd5b634e487b7160e01b5f52604160045260245ffd5b51906001600160a01b038216820360a45756fe608080604052600436101561001c575b50361561001a575f80fd5b005b5f3560e01c9081631259a5c8146106f6575080631d26480c14610651578063452a93201461062957806367eeba0c1461060c5780638da5cb5b146105e5578063a2240e1914610566578063b1176a0714610549578063b39a7c5f14610524578063b61d27f6146101a2578063e0b1750f1461010a578063f059cf2b146100ed5763fb9ed257146100ac575f61000f565b346100e95760203660031901126100e9576001600160a01b036100cd610710565b165f526006602052602060ff60405f2054166040519015158152f35b5f80fd5b346100e9575f3660031901126100e9576020600454604051908152f35b346100e95760203660031901126100e9576004358015158091036100e9575f546001600160a01b03163314801561018e575b61014590610726565b6001805460ff60a01b191660a083901b60ff60a01b1617905560405190815233907f0f01a22fbd8fac7fb169e8ceaf348be1373de85f445744d7411876b0ff65c70990602090a2005b506001546001600160a01b0316331461013c565b346100e95760603660031901126100e9576101bb610710565b6044359060243567ffffffffffffffff83116100e957366023840112156100e95782600401359167ffffffffffffffff83116100e957602484019360248436920101116100e9575f546001600160a01b031633148015610510575b61021f90610726565b60ff60015460a01c166104cb576001600160a01b0381165f8181526006602052604090205490919060ff1615610474576002548311610423576201518042046005548111610416575b506004546102768482610763565b600354106103c6575f9161028b858493610763565b60045560405186888237858188810185815203925af1913d156103be573d9267ffffffffffffffff84116103aa5760405193601f8101601f19908116603f0116850167ffffffffffffffff8111868210176103aa5760405284523d5f602086013e5b156103725760209460607fcaf938de11c367272220bfd1d2baa99ca46665e7bc4d85f00adb51b90fe1fa9f928660409788519485938452898b850152818a850152848401375f828201840152601f01601f19168101030190a2815192839181835280519182918282860152018484015e5f828201840152601f01601f19168101030190f35b60405162461bcd60e51b815260206004820152601060248201526f115e1958dd5d1a5bdb8819985a5b195960821b6044820152606490fd5b634e487b7160e01b5f52604160045260245ffd5b6060926102ed565b60405162461bcd60e51b815260206004820152602260248201527f4461696c79206275646765742076656c6f636974792063617020657863656564604482015261195960f21b6064820152608490fd5b5f60045560055585610268565b60405162461bcd60e51b8152602060048201526024808201527f56616c756520657863656564732073696e676c652074782076656c6f636974796044820152630206361760e41b6064820152608490fd5b60405162461bcd60e51b815260206004820152602960248201527f54617267657420636f6e7472616374206e6f74206f6e207665726966696564206044820152681dda1a5d195b1a5cdd60ba1b6064820152608490fd5b60405162461bcd60e51b815260206004820152601b60248201527f456e636c61766520697320656d657267656e6379206c6f636b656400000000006044820152606490fd5b506001546001600160a01b03163314610216565b346100e9575f3660031901126100e957602060ff60015460a01c166040519015158152f35b346100e9575f3660031901126100e9576020600254604051908152f35b346100e95760403660031901126100e9577f4d4981437d0211f9e6843eb024d9ada1fa3a99514d4343d4aece106dd11524bb604060043560243560018060a01b035f5416331480156105d1575b6105bc90610726565b816002558060035582519182526020820152a1005b506001546001600160a01b031633146105b3565b346100e9575f3660031901126100e9575f546040516001600160a01b039091168152602090f35b346100e9575f3660031901126100e9576020600354604051908152f35b346100e9575f3660031901126100e9576001546040516001600160a01b039091168152602090f35b346100e95760403660031901126100e95761066a610710565b602435908115158092036100e95760207ff6c76eeb7c8ff50ae11742b7c9c659668fd5450291aa2e196914e251b7786abe9160018060a01b035f5416331480156106e2575b6106b890610726565b60018060a01b031692835f526006825260405f2060ff1981541660ff8316179055604051908152a2005b506001546001600160a01b031633146106af565b346100e9575f3660031901126100e9576020906005548152f35b600435906001600160a01b03821682036100e957565b1561072d57565b60405162461bcd60e51b815260206004820152600e60248201526d139bdd08185d5d1a1bdc9a5e995960921b6044820152606490fd5b9190820180921161077057565b634e487b7160e01b5f52601160045260245ffdfea26469706673582212209a5ecbf3cbf7cddd256697670f94bbb8c275d824f5335c8787452fc1fb267b8f64736f6c63430008250033"
} as const;
