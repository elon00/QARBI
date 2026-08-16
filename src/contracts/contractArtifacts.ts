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
  "bytecode": "0x6080346101c757601f610dde38819003918201601f19168301916001600160401b038311848410176101cb578084926020946040528339810103126101c757516100495f546101df565b601f8111610180575b507f51415242492050726f746f636f6c20546f6b656e0000000000000000000000285f5560018054610083906101df565b601f8111610139575b5050600a64514152424960d81b016001556002805460ff19166012179055600480546001600160a01b03191633179055670de0b6b3a764000081810291801590830490911417156101255780600355335f5260056020528060405f20556040519081525f7fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60203393a3604051610bc690816102188239f35b634e487b7160e01b5f52601160045260245ffd5b60015f52601f0160051c7fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6908101905b818110610176575061008c565b5f81558201610169565b5f8052601f0160051c7f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563908101905b8181106101bc5750610052565b5f81556001016101af565b5f80fd5b634e487b7160e01b5f52604160045260245ffd5b90600182811c9216801561020d575b60208310146101f957565b634e487b7160e01b5f52602260045260245ffd5b91607f16916101ee56fe6080604081815260049182361015610015575f80fd5b5f3560e01c90816306fdde031461094e57508063095ea7b31461089757806318160ddd1461087957806323b872dd1461072b578063313ce5671461070a57806340c10f191461061857806370a08231146105e15780637641e6f314610480578063766976401461045d5780637d1d5d19146104415780638a8772051461040a5780638da5cb5b146103e357806395d89b41146102d0578063a9059cbb1461023b578063dd62ed3e146101f25763de5f72fd146100cf575f80fd5b346101ee575f3660031901126101ee57335f5260209160078352815f2054610e1081018091116101a15742106101b457335f526007835242825f205560035490680d8d726b7177a80000918281018091116101a157600355335f5260058452825f2080549183830180931161018e57505581518181525f5f80516020610b71833981519152853393a3815190815242838201527fa19a7d2b5bf6a987a66e0eac8a6eb2dbd34ae6a43285849af788b224268ec022823392a25160018152f35b601190634e487b7160e01b5f525260245ffd5b601182634e487b7160e01b5f525260245ffd5b82606492519162461bcd60e51b8352820152601660248201527546617563657420636f6f6c646f776e2061637469766560501b6044820152fd5b5f80fd5b50346101ee57806003193601126101ee5760209061020e610a87565b610216610a9d565b9060018060a01b038091165f5260068452825f2091165f528252805f20549051908152f35b50346101ee57806003193601126101ee57602090610257610a87565b6001600160a01b031660243561026e821515610ab3565b335f526005845261028481845f20541015610aff565b335f5260058452825f20610299828254610b42565b9055815f5260058452825f206102b0828254610b63565b905582519081525f80516020610b71833981519152843392a35160018152f35b50346101ee575f3660031901126101ee578051905f90600191600154928360011c90600185169485156103d9575b60209586841081146103c6578388528794939291879082156103a4575050600114610349575b50506103459291610336910385610a13565b51928284938452830190610a49565b0390f35b9085925060015f527fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6915f925b82841061038c5750505082010181610336610324565b8054848a018601528895508794909301928101610376565b60ff19168682015292151560051b850190920192508391506103369050610324565b602289634e487b7160e01b5f525260245ffd5b91607f16916102fe565b50346101ee575f3660031901126101ee57905490516001600160a01b039091168152602090f35b50346101ee5760203660031901126101ee576020906001600160a01b0361042f610a87565b165f5260078252805f20549051908152f35b50346101ee575f3660031901126101ee5760209051610e108152f35b50346101ee575f3660031901126101ee5760209051680d8d726b7177a800008152f35b50346101ee57806003193601126101ee5781356024359067ffffffffffffffff938483116101ee57366023840112156101ee57828101359485116105ce576020948451936104d787601f19601f8501160186610a13565b81855236602483830101116101ee57815f9260248993018388013785010152335f526005855281845f20541061058b57507ffad31924d655455395c87544c8aa1ffdb5a7505a22a3c2e03f28003b6556a75f90335f5260058552835f2061053f828254610b42565b905561054d81600354610b42565b6003555f84518281525f80516020610b71833981519152873392a38351908152838582015280610581339486830190610a49565b0390a25160018152f35b835162461bcd60e51b8152908101859052601c60248201527f496e73756666696369656e742062616c616e636520746f206275726e000000006044820152606490fd5b604190634e487b7160e01b5f525260245ffd5b50346101ee5760203660031901126101ee576020906001600160a01b03610606610a87565b165f5260058252805f20549051908152f35b50346101ee57806003193601126101ee57610631610a87565b825460243593916001600160a01b0391821633036106d2571690811561069857505f5f80516020610b718339815191526020856106718297600354610b63565b60035584845260058252858420610689828254610b63565b90558551908152a35160018152f35b606490602084519162461bcd60e51b835282015260146024820152734d696e7420746f207a65726f206164647265737360601b6044820152fd5b835162461bcd60e51b8152602081850152601260248201527113db9b1e481bdddb995c88185b1b1bddd95960721b6044820152606490fd5b50346101ee575f3660031901126101ee5760209060ff600254169051908152f35b50346101ee5760603660031901126101ee57610745610a87565b61074d610a9d565b604435916001600160a01b03908116918215610836571691610770831515610ab3565b815f526020946005865261078982865f20541015610aff565b825f5260068652845f20335f52865281855f2054106107fe5750845f80516020610b7183398151915291835f5260068252855f20335f528252855f206107d0828254610b42565b9055835f5260058252855f206107e7828254610b42565b9055845f5260058252855f20610689828254610b63565b845162461bcd60e51b81529081018690526012602482015271105b1b1bddd85b98d948195e18d95959195960721b6044820152606490fd5b845162461bcd60e51b8152602081880152601a60248201527f5472616e736665722066726f6d207a65726f20616464726573730000000000006044820152606490fd5b50346101ee575f3660031901126101ee576020906003549051908152f35b50346101ee57806003193601126101ee576108b0610a87565b6001600160a01b0316602435811561090b5760209350335f5260068452825f20825f52845280835f205582519081527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925843392a35160018152f35b825162461bcd60e51b8152602081860152601760248201527f417070726f766520746f207a65726f20616464726573730000000000000000006044820152606490fd5b919050346101ee575f3660031901126101ee575f905f549160018360011c9060018516948515610a09575b60209586841081146103c6578388528794939291879082156103a45750506001146109b05750506103459291610336910385610a13565b5f80805286935091907f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e5635b8284106109f15750505082010181610336610324565b8054848a0186015288955087949093019281016109db565b91607f1691610979565b90601f8019910116810190811067ffffffffffffffff821117610a3557604052565b634e487b7160e01b5f52604160045260245ffd5b91908251928382525f5b848110610a73575050825f602080949584010152601f8019910116010190565b602081830181015184830182015201610a53565b600435906001600160a01b03821682036101ee57565b602435906001600160a01b03821682036101ee57565b15610aba57565b60405162461bcd60e51b815260206004820152601860248201527f5472616e7366657220746f207a65726f206164647265737300000000000000006044820152606490fd5b15610b0657565b60405162461bcd60e51b8152602060048201526014602482015273496e73756666696369656e742062616c616e636560601b6044820152606490fd5b91908203918211610b4f57565b634e487b7160e01b5f52601160045260245ffd5b91908201809211610b4f5756feddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa2646970667358221220eb292c3f80d73a9ad44af3547eb9388df2ebad8e291d8787ac20ab7e9151cbdf64736f6c63430008180033"
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
  "bytecode": "0x6080806040523461002c5760016002555f80546001600160a01b031916331790556115bb90816100318239f35b5f80fdfe60806040526004361015610011575f80fd5b5f3560e01c80630b62134214610b6857806313ae356514610ac65780632de5aaf71461086057806330efc498146108435780633731a16f1461081a5780633c93baeb146106c0578063420f686114610699578063513856c81461057557806362febe4f1461051e5780637585840a1461047057806391402039146104415780639890006214610348578063a4bf7cf614610320578063b21910ef146102e8578063c6fe8e31146101fd578063d9a9a8d3146101535763e7d92bee146100d4575f80fd5b3461014f57602036600319011261014f576004355f52600360205260405f206100ff81541515611522565b60018060a01b0360ff600e826003850154169260048501541693015416600381101561013b576060926040519283526020830152156040820152f35b634e487b7160e01b5f52602160045260245ffd5b5f80fd5b3461014f57602036600319011261014f5761016c611362565b5f546001600160a01b039190821633036101c05716806bffffffffffffffffffffffff60a01b60015416176001557f5223e8a853067e901089253975bcb38e611d4a615b88fcf9f78969a8a471256c5f80a2005b60405162461bcd60e51b815260206004820152601560248201527413db9b1e4818591b5a5b88185d5d1a1bdc9a5e9959605a1b6044820152606490fd5b3461014f57604036600319011261014f57600435602435600381101561014f57815f52600360205260405f2061023581541515611522565b6003810154336001600160a01b03918216149081156102db575b501561029657816102867f365a3d0a71be5f440c8224437355d5bd81a703759bf906e441902272bfbafcb393600e602094016114c6565b61029360405180926113b6565ba2005b60405162461bcd60e51b815260206004820152601f60248201527f4e6f7420617574686f72697a656420746f206368616e676520737461747573006044820152606490fd5b90505f541633148461024f565b3461014f57602036600319011261014f576001600160a01b03610309611362565b165f526006602052602060405f2054604051908152f35b3461014f575f36600319011261014f576001546040516001600160a01b039091168152602090f35b3461014f57604036600319011261014f57602435801515810361014f575f5461038690336001600160a01b0391821614908115610433575b506114de565b6004355f52600360205260405f20906103a182541515611522565b156103fb57600b8101908154600181018091116103e75760099255018054906103e8918281106103cd57005b600f81018091116103e7578083918355116103e457005b55005b634e487b7160e01b5f52601160045260245ffd5b600c8101908154600181018091116103e757909155600901805460191161042e5780546018198101919082116103e75755005b5f9055005b905060015416331483610380565b3461014f57602036600319011261014f576004355f526005602052602060ff60405f2054166040519015158152f35b3461014f5760208060031936011261014f576001600160a01b03610492611362565b165f526004815260405f20604051908183825491828152019081925f52845f20905f5b8682821061050a5786866104cb828803836112ea565b60405192839281840190828552518091526040840192915f5b8281106104f357505050500390f35b8351855286955093810193928101926001016104e4565b8354855290930192600192830192016104b5565b3461014f57604036600319011261014f57610537611362565b6001600160a01b03165f9081526004602052604090208054602435919082101561014f576020916105679161149d565b90546040519160031b1c8152f35b3461014f57602036600319011261014f576004355f52600360205260405f208054600182016105a3906113fb565b906105b0600284016113fb565b92600160a01b600190039081600382015416916004820154166005820154600683016105db906113fb565b946007840154956008850154600986015491600a87015493600b88015495600c89015497600d8a015499600e015460ff169a6040519e8f9e8f956101e0908752806020880152860161062c91611378565b858103604087015261063d91611378565b936060015260808d015260a08c01528a810360c08c015261065d91611378565b9760e08a01526101008901526101208801526101408701526101608601526101808501526101a08401526101c08301610695916113b6565b0390f35b3461014f575f36600319011261014f575f546040516001600160a01b039091168152602090f35b3461014f57606036600319011261014f5760043560243560443567ffffffffffffffff811161014f576106f790369060040161130c565b5f5461071790336001600160a01b039182161490811561080c57506114de565b825f526003602052600960405f2061073181541515611522565b01805490925f8113156107975781018082116103e7575f805160206115668339815191529361078b916103e8908181111561079057505b81555b549260405193849384526020840152606060408401526060830190611378565b0390a2005b9050610768565b5f81126107b7575b5061078b5f805160206115668339815191529361076b565b600160ff1b81146103e757805f0382115f146107f35781018181116103e7575f805160206115668339815191529361078b915b8155935061079f565b5061078b5f80516020611566833981519152935f6107ea565b905060015416331485610380565b3461014f575f36600319011261014f576002545f1981019081116103e757602090604051908152f35b3461014f575f36600319011261014f576020600254604051908152f35b3461014f57602036600319011261014f575f6101c0604051610881816112cd565b82815260606020820152606060408201528260608201528260808201528260a0820152606060c08201528260e08201528261010082015282610120820152826101408201528261016082015282610180820152826101a082015201526004355f5260036020526108f660405f20541515611522565b6004355f52600360205260405f2060ff600e60405192610915846112cd565b80548452610925600182016113fb565b6020850152610936600282016113fb565b604085015260038101546001600160a01b0390811660608601526004820154166080850152600581015460a0850152610971600682016113fb565b60c0850152600781015460e085015260088101546101008501526009810154610120850152600a810154610140850152600b810154610160850152600c810154610180850152600d8101546101a0850152015416600381101561013b576101c0820152604051809160208252805160208301526106956101c0610a67610a0860208501516101e06040880152610200870190611378565b610a24604086015191601f1992838983030160608a0152611378565b9060018060a01b03606087015116608088015260018060a01b0360808701511660a088015260a086015160c088015260c0860151908783030160e0880152611378565b9260e08101516101008601526101008101516101208601526101208101516101408601526101408101516101608601526101608101516101808601526101808101516101a08601526101a08101518286015201516101e08401906113b6565b3461014f57604036600319011261014f576004357f76086644802772625b8df30a3d7d84450d578671eff342a76435bd1abd97d1006020600a602435610b1f60018060a01b03805f54163314908115610b5a57506114de565b845f526003835260405f2090610b3782541515611522565b6064811115610b52575060649182915b0155604051908152a2005b918291610b47565b905060015416331487610380565b3461014f5760e036600319011261014f5760043567ffffffffffffffff811161014f57610b9990369060040161130c565b60243567ffffffffffffffff811161014f57610bb990369060040161130c565b6064356001600160a01b038116810361014f5760843567ffffffffffffffff811161014f57610bec90369060040161130c565b91835115611291576044351561124c576044355f52600560205260ff60405f2054166111fd57600254925f1984146103e75760018481016002556044355f908152600560205260409020805460ff191690911790556001600160a01b0383166111de575b60a435156111d75760a4355b60c435156111cf5760c435905b60405192610c76846112cd565b86845287602085015284604085015233606085015260018060a01b038616608085015260443560a085015260c084015260e083015261010082015261032061012082015260646101408201525f6101608201525f610180820152426101a08201525f6101c0820152835f52600360205260405f209080518255602081015180519067ffffffffffffffff8211610f6a578190610d1560018601546113c3565b601f811161117f575b50602090601f8311600114611111575f92611106575b50508160011b915f199060031b1c19161760018301555b604081015180519067ffffffffffffffff8211610f6a578190610d7160028601546113c3565b601f81116110b6575b50602090601f8311600114611048575f9261103d575b50508160011b915f199060031b1c19161760028301555b60608101516003830180546001600160a01b039283166001600160a01b031991821617909155608083015160048501805491909316911617905560a0810151600583015560c081015180519067ffffffffffffffff8211610f6a57610e0f60068501546113c3565b601f8111610ff9575b50602090601f8311600114610f89576101c09392915f9183610f7e575b50508160011b915f199060031b1c19161760068401555b60e0810151600784015561010081015160088401556101208101516009840155610140810151600a840155610160810151600b840155610180810151600c8401556101a0810151600d8401550151600381101561013b57600e610eaf92016114c6565b335f52600460205260405f2080549468010000000000000000861015610f6a57610f3d8593610f07887fae28b955c60e29121c78cb95300f31282d20643def55bd5d4d1bf681acd4d13495600160209b01815561149d565b81549060031b9087821b915f19901b1916179055610f306040519360a0855260a0850190611378565b9083820389850152611378565b6001600160a01b0390941660408201526044356060820152426080820152339381900390a3604051908152f35b634e487b7160e01b5f52604160045260245ffd5b015190508980610e35565b90600685015f5260205f20915f5b601f1985168110610fe157509183916001936101c09695601f19811610610fc9575b505050811b016006840155610e4c565b01515f1960f88460031b161c19169055898080610fb9565b91926020600181928685015181550194019201610f97565b600685015f5260205f20601f840160051c810160208510611036575b601f830160051c8201811061102b575050610e18565b5f8155600101611015565b5080611015565b015190508880610d90565b9250600285015f5260205f20905f935b601f198416851061109b576001945083601f19811610611083575b505050811b016002830155610da7565b01515f1960f88460031b161c19169055888080611073565b81810151835560209485019460019093019290910190611058565b909150600285015f5260205f20601f840160051c8101602085106110ff575b90849392915b601f830160051c820181106110f1575050610d7a565b5f81558594506001016110db565b50806110d5565b015190508880610d34565b9250600185015f5260205f20905f935b601f1984168510611164576001945083601f1981161061114c575b505050811b016001830155610d4b565b01515f1960f88460031b161c1916905588808061113c565b81810151835560209485019460019093019290910190611121565b909150600185015f5260205f20601f840160051c8101602085106111c8575b90849392915b601f830160051c820181106111ba575050610d1e565b5f81558594506001016111a4565b508061119e565b60fa90610c69565b6032610c5c565b6001600160a01b0383165f908152600660205260409020849055610c50565b60405162461bcd60e51b815260206004820152602160248201527f50514320636f6d6d69746d656e7420616c7265616479207265676973746572656044820152601960fa1b6064820152608490fd5b60405162461bcd60e51b815260206004820152601b60248201527f496e76616c69642050514320636f6d6d69746d656e74206861736800000000006044820152606490fd5b60405162461bcd60e51b81526020600482015260146024820152734e616d652063616e6e6f7420626520656d70747960601b6044820152606490fd5b6101e0810190811067ffffffffffffffff821117610f6a57604052565b90601f8019910116810190811067ffffffffffffffff821117610f6a57604052565b81601f8201121561014f5780359067ffffffffffffffff8211610f6a5760405192611341601f8401601f1916602001856112ea565b8284526020838301011161014f57815f926020809301838601378301015290565b600435906001600160a01b038216820361014f57565b91908251928382525f5b8481106113a2575050825f602080949584010152601f8019910116010190565b602081830181015184830182015201611382565b90600382101561013b5752565b90600182811c921680156113f1575b60208310146113dd57565b634e487b7160e01b5f52602260045260245ffd5b91607f16916113d2565b9060405191825f825461140d816113c3565b908184526020946001916001811690815f1461147b575060011461143d575b50505061143b925003836112ea565b565b5f90815285812095935091905b81831061146357505061143b93508201015f808061142c565b8554888401850152948501948794509183019161144a565b9250505061143b94925060ff191682840152151560051b8201015f808061142c565b80548210156114b2575f5260205f2001905f90565b634e487b7160e01b5f52603260045260245ffd5b90600381101561013b5760ff80198354169116179055565b156114e557565b60405162461bcd60e51b815260206004820152601560248201527410d85b1b195c881b9bdd08185d5d1a1bdc9a5e9959605a1b6044820152606490fd5b1561152957565b60405162461bcd60e51b81526020600482015260146024820152731059d95b9d08191bd95cc81b9bdd08195e1a5cdd60621b6044820152606490fdfea98c95045e5b7a322aa9588c185e16cddc3a614e56b9762d0b7d678bcc076910a264697066735822122086c671b7ceca50e7e77a5d88ce16bf05b1833d218cf926785a1a178fdae8ab0d64736f6c63430008180033"
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
  "bytecode": "0x60803461009557601f6116d238819003918201601f19168301916001600160401b0383118484101761009957808492604094855283398101031261009557610052602061004b836100ad565b92016100ad565b90600160035560018060a01b03199133835f5416175f5560018060a01b038092168360015416176001551690600254161760025560405161161090816100c28239f35b5f80fd5b634e487b7160e01b5f52604160045260245ffd5b51906001600160a01b03821682036100955756fe6080806040526004361015610012575f80fd5b5f905f3560e01c9081630d1cfcae1461136a57508063103099f314610ca45780631d65e77e14610aaa5780633bad40ea146107105780633c93b905146106d1578063420f6861146106aa5780637eec20a8146104845780638d9776721461039557806393faca2a1461036c578063d8952a49146102ca578063db6bebf9146100c25763fdc3d8d7146100a2575f80fd5b346100bf57806003193601126100bf576020600354604051908152f35b80fd5b50346100bf5760403660031901126100bf576004356024803590828452600460205260408420906100f582541515611554565b600882019182549160ff831660048110156102b757610280576002546040516373ec95f760e11b815260048101879052906001600160a01b039060609083908590829085165afa80156102755789908a938b9161023e575b501561020457811633149182156101f7575b5081156101ea575b50156101a6575060060183905560ff1916600117905533917fadb41d3227141be28f9f5e534a02e82d83fc4a946b0ae913099a2371b9316aae8480a480f35b606490601b6040519162461bcd60e51b8352602060048401528201527f556e617574686f72697a6564206167656e74206f70657261746f7200000000006044820152fd5b905087541633145f610167565b819250163314905f61015f565b60405162461bcd60e51b815260206004820152601381860152724167656e74206973206e6f742061637469766560681b6044820152606490fd5b91505061026491925060603d60601161026e575b61025c81836113aa565b8101906115aa565b929190925f61014d565b503d610252565b6040513d8b823e3d90fd5b60649060106040519162461bcd60e51b8352602060048401528201526f2a30b9b59034b9903737ba1037b832b760811b6044820152fd5b50634e487b7160e01b8752602160045286fd5b50346100bf5760403660031901126100bf576001600160a01b0360043581811690819003610368576024359180831680930361036857835416330361032e576bffffffffffffffffffffffff60a01b90816001541617600155600254161760025580f35b60405162461bcd60e51b815260206004820152601260248201527113db9b1e4818591b5a5b88185b1b1bddd95960721b6044820152606490fd5b5f80fd5b50346100bf57806003193601126100bf576001546040516001600160a01b039091168152602090f35b50346100bf5760203660031901126100bf57604090600435815260046020522080549060018060a01b03600182015416906103d2600282016114a5565b6103de600383016114a5565b916104746103ee600483016114a5565b93600583015494600684015461045960078601549261044b60ff6008890154169561043d600a60098b01549a01549a6040519e8f9e8f9061016092825260208201528160408201520190611422565b8c810360608e015290611422565b908a820360808c0152611422565b9660a089015260c088015260e0870152610100860190611460565b6101208401526101408301520390f35b50346100bf576020806003193601126106a6576004358083526004825260408320916104b283541515611554565b60088301805460ff811660048110156106925761064f576001850180546001600160a01b0393919290841691903383148015610643575b156105fe5760ff19166003179055600154600596909601805460405163a9059cbb60e01b81526001600160a01b039093166004840152602483015295849082908516818a816044810103925af19081156105f35787916105ba575b501561057c57907f06f63d695245e4cf8f0b7aae0b8da95876a4b173ba8d0d4466cc83c357dda3a8929154169354604051908152a380f35b60405162461bcd60e51b81526004810184905260166024820152751499599d5b99081d1c985b9cd9995c8819985a5b195960521b6044820152606490fd5b90508381813d83116105ec575b6105d181836113aa565b810103126105e8576105e290611547565b5f610544565b8680fd5b503d6105c7565b6040513d89823e3d90fd5b60405162461bcd60e51b815260048101879052601760248201527f4f6e6c792063726561746f722063616e2063616e63656c0000000000000000006044820152606490fd5b508489541633146104e9565b6064836040519062461bcd60e51b825280600483015260248201527f4f6e6c79206f70656e207461736b732063616e2062652063616e63656c6c65646044820152fd5b634e487b7160e01b87526021600452602487fd5b5080fd5b50346100bf57806003193601126100bf57546040516001600160a01b039091168152602090f35b50346100bf57806003193601126100bf576003545f198101919082116106fc57602082604051908152f35b634e487b7160e01b81526011600452602490fd5b503461036857604036600319011261036857600435602490813590805f526020916004835260405f209061074682541515611554565b6008820180549560ff87166004811015610a9657600103610a53578215610a1b5760018060a01b03806002541660068601936060855485604051809581936373ec95f760e11b835260048301525afa998a15610903575f925f9b6109f3575b508383169a848c33149182156109e6575b505080156109d7575b80156109cb575b15610987576007880187905560ff1916600217905542600a8701556001546005909601805460405163a9059cbb60e01b81526001600160a01b039093166004840152602483015295889082908416815f816044810103925af1908115610903575f91610952575b501561090e5760025416908254823b15610368575f92604484926040519586938492634c48003160e11b845260048401526001878401525af18015610903576108d0575b5050918491847f9b5cdf2a1d86062250bc359360ca976cc957376d56fd42bbea88d776805c9a517fb0755c953aaa49e0343ee8b81548c4a9c9c93b2e1de17336ef73c2f14fcd8c629554978893604051908152a354604051908152a480f35b9091975067ffffffffffffffff82116108f057506040525f958184610871565b634e487b7160e01b5f9081526041600452fd5b6040513d5f823e3d90fd5b60405162461bcd60e51b815260048101889052601d818401527f526577617264207061796f7574207472616e73666572206661696c65640000006044820152606490fd5b90508781813d8311610980575b61096981836113aa565b810103126103685761097a90611547565b5f61082d565b503d61095f565b60405162461bcd60e51b8152600481018b9052601e818701527f4e6f7420617574686f72697a656420746f207375626d69742070726f6f6600006044820152606490fd5b50835f541633146107c6565b508360018901541633146107bf565b909150163314845f6107b6565b909a50610a1091925060603d60601161026e5761025c81836113aa565b50919091995f6107a5565b8560126064926040519262461bcd60e51b8452600484015282015271092dcecc2d8d2c840e0e4dedecc40d0c2e6d60731b6044820152fd5b8560176064926040519262461bcd60e51b845260048401528201527f5461736b206973206e6f7420696e2070726f67726573730000000000000000006044820152fd5b50634e487b7160e01b5f9081526021600452fd5b34610368576020366003190112610368576004355f610140604051610ace8161138d565b82815282602082015260606040820152606080820152606060808201528260a08201528260c08201528260e082015282610100820152826101208201520152805f526004602052610b2460405f20541515611554565b5f52600460205260405f2060405190610b3c8261138d565b8054825260018101546001600160a01b03166020830152610b5f600282016114a5565b6040830152610b70600382016114a5565b6060830152610b81600482016114a5565b6080830152600581015460a0830152600681015460c0830152600781015460e083015260ff600882015416906004821015610c9057600a91610100840152600981015461012084015201546101408201526040518091602082528051602083015260018060a01b0360208201511660408301526040810151610140610c48610c1761016093846060880152610180870190611422565b610c33606086015191601f1992838983030160808a0152611422565b906080860151908783030160a0880152611422565b9260a081015160c086015260c081015160e086015260e0810151610100860152610c7c610100820151610120870190611460565b610120810151828601520151908301520390f35b634e487b7160e01b5f52602160045260245ffd5b346103685760803660031901126103685760043567ffffffffffffffff811161036857610cd59036906004016113cc565b60243567ffffffffffffffff811161036857610cf59036906004016113cc565b60443567ffffffffffffffff811161036857610d159036906004016113cc565b9180511561133157606435156112e0576001546040516323b872dd60e01b81523360048201523060248201526064803560448301529091602091839182905f906001600160a01b03165af1908115610903575f916112a6575b501561126157600354915f19831461124d576001830160035560405190610d948261138d565b838252336020830152826040830152606082015283608082015260643560a08201525f60c08201525f60e08201525f610100820152426101208201525f610140820152825f52600460205260405f2093815185556001850160018060a01b036020840151166bffffffffffffffffffffffff60a01b825416179055604082015180519067ffffffffffffffff82116110a7578190610e35600289015461146d565b601f81116111fd575b50602090601f831160011461118f575f92611184575b50508160011b915f199060031b1c19161760028601555b606082015180519067ffffffffffffffff82116110a7578190610e91600389015461146d565b601f8111611134575b50602090601f83116001146110c6575f926110bb575b50508160011b915f199060031b1c19161760038601555b608082015180519067ffffffffffffffff82116110a7578190610eed600489015461146d565b601f8111611057575b50602090601f8311600114610fec575f92610fe1575b50508160011b915f199060031b1c19161760048601555b60a0820151600586015560c0820151600686015560e082015160078601556008850191610100810151916004831015610c9057602096600a610140610fc49489977f7ef2ea2bdef77ccf5258ed00c883d78e43c82ff5d0a77bfc4a9b6f4feda8d63e9760ff8019835416911617905561012081015160098501550151910155610fb760405195608087526080870190611422565b9085820388870152611422565b9260643560408201524260608201528033940390a3604051908152f35b015190508780610f0c565b600489015f908152602081209350601f198516905b81811061103f5750908460019594939210611027575b505050811b016004860155610f23565b01515f1960f88460031b161c19169055878080611017565b92936020600181928786015181550195019301611001565b909150600488015f5260205f20601f840160051c8101602085106110a0575b90849392915b601f830160051c82018110611092575050610ef6565b5f815585945060010161107c565b5080611076565b634e487b7160e01b5f52604160045260245ffd5b015190508780610eb0565b9250600388015f5260205f20905f935b601f1984168510611119576001945083601f19811610611101575b505050811b016003860155610ec7565b01515f1960f88460031b161c191690558780806110f1565b818101518355602094850194600190930192909101906110d6565b909150600388015f5260205f20601f840160051c81016020851061117d575b90849392915b601f830160051c8201811061116f575050610e9a565b5f8155859450600101611159565b5080611153565b015190508780610e54565b9250600288015f5260205f20905f935b601f19841685106111e2576001945083601f198116106111ca575b505050811b016002860155610e6b565b01515f1960f88460031b161c191690558780806111ba565b8181015183556020948501946001909301929091019061119f565b909150600288015f5260205f20601f840160051c810160208510611246575b90849392915b601f830160051c82018110611238575050610e3e565b5f8155859450600101611222565b508061121c565b634e487b7160e01b5f52601160045260245ffd5b60405162461bcd60e51b815260206004820152601f60248201527f546f6b656e207472616e7366657220746f20657363726f77206661696c6564006044820152606490fd5b90506020813d6020116112d8575b816112c1602093836113aa565b81010312610368576112d290611547565b84610d6e565b3d91506112b4565b60405162461bcd60e51b8152602060048201526024808201527f52657761726420616d6f756e74206d75737420626520677265617465722074686044820152630616e20360e41b6064820152608490fd5b60405162461bcd60e51b8152602060048201526011602482015270151a5d1b19481a5cc81c995c5d5a5c9959607a1b6044820152606490fd5b34610368575f366003190112610368576002546001600160a01b03168152602090f35b610160810190811067ffffffffffffffff8211176110a757604052565b90601f8019910116810190811067ffffffffffffffff8211176110a757604052565b81601f820112156103685780359067ffffffffffffffff82116110a75760405192611401601f8401601f1916602001856113aa565b8284526020838301011161036857815f926020809301838601378301015290565b91908251928382525f5b84811061144c575050825f602080949584010152601f8019910116010190565b60208183018101518483018201520161142c565b906004821015610c905752565b90600182811c9216801561149b575b602083101461148757565b634e487b7160e01b5f52602260045260245ffd5b91607f169161147c565b9060405191825f82546114b78161146d565b908184526020946001916001811690815f1461152557506001146114e7575b5050506114e5925003836113aa565b565b5f90815285812095935091905b81831061150d5750506114e593508201015f80806114d6565b855488840185015294850194879450918301916114f4565b925050506114e594925060ff191682840152151560051b8201015f80806114d6565b5190811515820361036857565b1561155b57565b60405162461bcd60e51b815260206004820152601360248201527215185cdac8191bd95cc81b9bdd08195e1a5cdd606a1b6044820152606490fd5b51906001600160a01b038216820361036857565b90816060910312610368576115be81611596565b916115d760406115d060208501611596565b9301611547565b9056fea2646970667358221220848e22d163f76e4b476427d7cfdbeba25cbf3e1f4e15cfd2edfaa0ac4f0f84b864736f6c63430008180033"
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
  "bytecode": "0x60808060405234610016576104ea908161001b8239f35b5f80fdfe6080806040526004361015610012575f80fd5b5f3560e01c9081630cc23225146103b75750806322b51670146100905780632eb524e8146100755763aaa04ca114610048575f80fd5b34610071576040366003190112610071576020610069602435600435610440565b604051908152f35b5f80fd5b34610071575f36600319011261007157602060405160248152f35b346100715761030036600319011261007157366103041161007157604051610300810181811067ffffffffffffffff8211176103a3576040526103003682375f80915b60ff83169060188210156102bb575f91825b602460ff851610156102945791945f945f1993915b845f0b97600189136101ec575f195b805f0b600181136101d7578a1590816101ce575b5061019757601861013088885f0b6103e0565b5f0b01607f8113607f198212176101ba5760246101528360ff8c165f0b6103e0565b5f0b01607f8113607f198212176101ba57600160ff602461018a61018583601867ffffffffffffffff985f0b07166103f8565b61041e565b935f0b07161b16166101a5575b6101a0906103d0565b610109565b9760ff1660ff81146101ba5760010197610197565b634e487b7160e01b5f52601160045260245ffd5b9050158b61011d565b5050946101e59198506103d0565b93966100fa565b959297509295909350610201610185876103f8565b60019160ff841683901b915f9190831667ffffffffffffffff16156102825760ff1660028114908115610277575b50610270575b61024d575b5050600160ff91011692919390946100e5565b67ffffffffffffffff169096179590925f1981146101ba570191600160ff61023a565b5081610235565b60039150148a61022f565b60ff6003911603610235575081610235565b60ff935060019295915067ffffffffffffffff16611fe08260051b168601520116916100d3565b82617a69808202821591838204148217156101ba576102de6103e8914290610433565b06908061039857605583029083820460551417156101ba57610306600a916096840690610433565b04909291925b604051938085527f789c493fb3ff01883f4d1a73bb81476506f3f39fbe60a01676074bce70ff76346080602096846020820152856040820152426060820152a160405193945f90855b60188310610379575050506103609450610300840152610320830152610340820152f35b818060019267ffffffffffffffff8b5116815201980192019196610355565b505f9092919261030c565b634e487b7160e01b5f52604160045260245ffd5b34610071575f3660031901126100715780601860209252f35b5f0b607f81146101ba5760010190565b905f0b905f0b0190607f198212607f8313176101ba57565b601881101561040a5760051b60040190565b634e487b7160e01b5f52603260045260245ffd5b3567ffffffffffffffff811681036100715790565b919082018092116101ba57565b8015918280156104ac575b6104a45780820292828404821417156101ba57600c830292808404600c14901517156101ba5761047a91610433565b9081156104905704606401806064116101ba5790565b634e487b7160e01b5f52601260045260245ffd5b505050606490565b50801561044b56fea264697066735822122092eb411b71b814b0e387509f1b2303adaa08ccf10c76932d56e1b5c6adbb0fa864736f6c63430008180033"
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
  "bytecode": "0x6080346100a257601f61086338819003918201601f19168301916001600160401b038311848410176100a6578084926080946040528339810103126100a257610047816100ba565b90610054602082016100ba565b91606060408301519201519260018060a01b03908160018060a01b03199316835f5416175f551690600154161760015560025560035562015180420460055560405161079490816100cf8239f35b5f80fd5b634e487b7160e01b5f52604160045260245ffd5b51906001600160a01b03821682036100a25756fe6080604090808252600480361015610021575b505050361561001f575f80fd5b005b5f3560e01c9182631259a5c8146106d0575081631d26480c14610639578163452a93201461061157816367eeba0c146105f35781638da5cb5b146105cc578163a2240e1914610555578163b1176a0714610537578163b39a7c5f14610511578163b61d27f6146101a3578163e0b1750f1461010e578163f059cf2b146100f2575063fb9ed257146100b3578080610012565b346100ee5760203660031901126100ee576020906001600160a01b036100d76106ea565b165f526006825260ff815f20541690519015158152f35b5f80fd5b82346100ee575f3660031901126100ee57602091549051908152f35b9050346100ee5760203660031901126100ee5735908115158092036100ee575f5461014e90336001600160a01b0391821614908115610195575b50610700565b6001805460ff60a01b191660a084901b60ff60a01b161790555190815233907f0f01a22fbd8fac7fb169e8ceaf348be1373de85f445744d7411876b0ff65c70990602090a2005b90506001541633145f610148565b82346100ee5760603660031901126100ee576101bd6106ea565b916024803560449081359167ffffffffffffffff948584116100ee57366023850112156100ee5783810135918683116100ee5785850194868436920101116100ee575f546001600160a01b0390811633148015610504575b61021e90610700565b60ff60015460a01c166104c357891695865f5260209960068b5260ff8a5f2054161561046f576002548611610423576201518042046005548111610417575b50835461026a878261073d565b600354106103c9575f9161027f88849361073d565b86558b51878a8237888189810185815203925af13d156103c0573d8981116103ae578a5199601f8201601f19908116603f01168b019081118b82101761039c578b5289523d5f8c8b013e5b156103685787898b601f8a7fcaf938de11c367272220bfd1d2baa99ca46665e7bc4d85f00adb51b90fe1fa9f8b60608c8c80895194859384528a8a850152818b850152848401375f8282018401528619960186168101030190a2825193828593845281519182828601525f5b8381106103525750505f84830186015250601f01168101030190f35b8181018301518882018801528795508201610336565b885162461bcd60e51b81529283018a90526010908301526f115e1958dd5d1a5bdb8819985a5b195960821b90820152606490fd5b83604187634e487b7160e01b5f52525ffd5b82604186634e487b7160e01b5f52525ffd5b606098506102ca565b5050885162461bcd60e51b81529283018a90526022908301527f4461696c79206275646765742076656c6f6369747920636170206578636565649082015261195960f21b6064820152608490fd5b5f85556005558b61025d565b6084847f56616c756520657863656564732073696e676c652074782076656c6f6369747985858f8f519462461bcd60e51b865285015280840152820152630206361760e41b6064820152fd5b50885162461bcd60e51b81529283018a90526029908301527f54617267657420636f6e7472616374206e6f74206f6e2076657269666965642090820152681dda1a5d195b1a5cdd60ba1b6064820152608490fd5b885162461bcd60e51b8152602081850152601b818901527f456e636c61766520697320656d657267656e6379206c6f636b6564000000000081840152606490fd5b5060015481163314610215565b82346100ee575f3660031901126100ee5760209060ff60015460a01c1690519015158152f35b82346100ee575f3660031901126100ee576020906002549051908152f35b82346100ee57806003193601126100ee577f4d4981437d0211f9e6843eb024d9ada1fa3a99514d4343d4aece106dd11524bb91356024356105a960018060a01b03805f541633149081156105be5750610700565b816002558060035582519182526020820152a1005b905060015416331486610148565b82346100ee575f3660031901126100ee575f5490516001600160a01b039091168152602090f35b82346100ee575f3660031901126100ee576020906003549051908152f35b82346100ee575f3660031901126100ee5760015490516001600160a01b039091168152602090f35b82346100ee57806003193601126100ee576106526106ea565b602435908115158092036100ee577ff6c76eeb7c8ff50ae11742b7c9c659668fd5450291aa2e196914e251b7786abe9160209160018060a01b0390815f5416331480156106c3575b6106a390610700565b1693845f5260068352805f2060ff1981541660ff841617905551908152a2005b506001548216331461069a565b346100ee575f3660031901126100ee576020906005548152f35b600435906001600160a01b03821682036100ee57565b1561070757565b60405162461bcd60e51b815260206004820152600e60248201526d139bdd08185d5d1a1bdc9a5e995960921b6044820152606490fd5b9190820180921161074a57565b634e487b7160e01b5f52601160045260245ffdfea2646970667358221220b4f7ba5ba5d74b765bdca5ea87baa82daecd68fbfa9646d495c596474111894c64736f6c63430008180033"
} as const;
