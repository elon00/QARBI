import { ethers } from "ethers";
import deployedAddresses from "../contracts/deployedAddresses.json";
import QARBITokenAbi from "../contracts/abis/QARBIToken.json";
import AgentRegistryAbi from "../contracts/abis/AgentRegistry.json";
import TaskMarketAbi from "../contracts/abis/TaskMarket.json";
import AgentWalletAbi from "../contracts/abis/AgentWallet.json";
import ConwayEngineAbi from "../contracts/abis/ConwayEngine.json";

export const ARBITRUM_SEPOLIA_CHAIN_ID = 421614;
export const ARBITRUM_SEPOLIA_HEX_CHAIN_ID = "0x66eee";
export const ARBITRUM_SEPOLIA_RPC = "https://sepolia-rollup.arbitrum.io/rpc";

export interface WalletState {
  isConnected: boolean; address: string | null; chainId: number | null;
  isCorrectNetwork: boolean; qarbiBalance: number; ethBalance: number;
  provider: ethers.BrowserProvider | null; signer: ethers.JsonRpcSigner | null;
}
export type WalletType = "metamask" | "trust";
type Eip1193Provider = { request:(args:{method:string;params?:unknown[]})=>Promise<any>; isMetaMask?:boolean; isTrust?:boolean; isTrustWallet?:boolean; providerInfo?:{rdns?:string;name?:string} };

const sleep=(ms:number)=>new Promise<void>(r=>window.setTimeout(r,ms));
const isTrust=(p:Eip1193Provider|undefined|null)=>Boolean(p?.isTrust||p?.isTrustWallet||p?.providerInfo?.rdns==="com.trustwallet.app");
const isMetaMask=(p:Eip1193Provider|undefined|null)=>Boolean(p?.isMetaMask)&&!isTrust(p);
function unique(list:Eip1193Provider[], p:Eip1193Provider|undefined|null){if(p&&!list.includes(p))list.push(p)}

async function providers():Promise<Eip1193Provider[]> {
  if(typeof window==="undefined") return [];
  const w=window as any, list:Eip1193Provider[]=[];
  if(Array.isArray(w.ethereum?.providers)) w.ethereum.providers.forEach((p:Eip1193Provider)=>unique(list,p)); else unique(list,w.ethereum);
  unique(list,w.trustwallet?.ethereum);
  const found:Eip1193Provider[]=[];
  const handler=(e:Event)=>{const d=(e as CustomEvent<any>).detail;if(d?.provider){d.provider.providerInfo=d.info;unique(found,d.provider)}};
  window.addEventListener("eip6963:announceProvider",handler);
  window.dispatchEvent(new Event("eip6963:requestProvider"));
  await sleep(250);
  window.removeEventListener("eip6963:announceProvider",handler);
  found.forEach(p=>unique(list,p)); return list;
}
async function injected(type:WalletType){const ps=await providers();return ps.find(type==="trust"?isTrust:isMetaMask)||null}
function walletError(label:string,error:any){
  const m=String(error?.message||error||"");
  if(/broadcast channel unavailable|channel secret not available/i.test(m))
    return new Error(label+" extension is not ready. Unlock/restart only that wallet extension, reload the page, and try again. The other wallet is not used as a fallback.");
  if(/user rejected|rejected the request|4001/i.test(m)) return new Error(label+" connection was cancelled.");
  return new Error(m||"Failed to connect "+label);
}

export function getPublicRpcProvider(){return new ethers.JsonRpcProvider(ARBITRUM_SEPOLIA_RPC)}

export async function checkWalletConnection(){
  const ethereum=await injected("metamask");
  if(!ethereum)return {address:null,chainId:null,isCorrectNetwork:false};
  try{const a=await ethereum.request({method:"eth_accounts"});const h=await ethereum.request({method:"eth_chainId"});const c=parseInt(String(h),16);return a?.length?{address:a[0],chainId:c,isCorrectNetwork:c===ARBITRUM_SEPOLIA_CHAIN_ID}:{address:null,chainId:null,isCorrectNetwork:false}}
  catch{return {address:null,chainId:null,isCorrectNetwork:false}}
}

export async function connectWallet(walletType:WalletType="metamask"){
  const label=walletType==="metamask"?"MetaMask":"Trust Wallet";
  const ethereum=await injected(walletType);
  if(!ethereum)throw new Error(label+" was not detected. Install, unlock, and enable only the "+label+" extension, then reload.");
  try{
    // One explicit user click -> one provider request. Never probe or fall back to another wallet.
    const accounts=await ethereum.request({method:"eth_requestAccounts"});
    if(!accounts?.length)throw new Error("No account was selected in "+label);
    const provider=new ethers.BrowserProvider(ethereum,"any");
    let chainId=parseInt(String(await ethereum.request({method:"eth_chainId"})),16);
    if(chainId!==ARBITRUM_SEPOLIA_CHAIN_ID){
      try{await ethereum.request({method:"wallet_switchEthereumChain",params:[{chainId:ARBITRUM_SEPOLIA_HEX_CHAIN_ID}]})}
      catch(e:any){
        if(e?.code===4902||/unrecognized chain|chain not added/i.test(String(e?.message||""))){
          await ethereum.request({method:"wallet_addEthereumChain",params:[{chainId:ARBITRUM_SEPOLIA_HEX_CHAIN_ID,chainName:"Arbitrum Sepolia",nativeCurrency:{name:"Ether",symbol:"ETH",decimals:18},rpcUrls:[ARBITRUM_SEPOLIA_RPC],blockExplorerUrls:["https://sepolia.arbiscan.io"]}]})
        }else throw e;
      }
      chainId=parseInt(String(await ethereum.request({method:"eth_chainId"})),16);
    }
    if(chainId!==ARBITRUM_SEPOLIA_CHAIN_ID)throw new Error("Please switch "+label+" to Arbitrum Sepolia.");
    const signer=await provider.getSigner();
    return {address:accounts[0],chainId,isCorrectNetwork:true,provider,signer};
  }catch(e){console.error(label+" connection error:",e);throw walletError(label,e)}
}

export function getContractInstances(signerOrProvider?:ethers.Signer|ethers.Provider){
 const r=signerOrProvider||getPublicRpcProvider();return {token:new ethers.Contract(deployedAddresses.contracts.QARBIToken.address,QARBITokenAbi,r),registry:new ethers.Contract(deployedAddresses.contracts.AgentRegistry.address,AgentRegistryAbi,r),market:new ethers.Contract(deployedAddresses.contracts.TaskMarket.address,TaskMarketAbi,r),wallet:new ethers.Contract(deployedAddresses.contracts.AgentWallet.address,AgentWalletAbi,r),conway:new ethers.Contract(deployedAddresses.contracts.ConwayEngine.address,ConwayEngineAbi,r)}
}
export async function fetchLiveBalances(address:string){try{const p=getPublicRpcProvider(),ethBalance=parseFloat(ethers.formatEther(await p.getBalance(address)));let qarbiBalance=0;try{qarbiBalance=parseFloat(ethers.formatEther(await getContractInstances(p).token.balanceOf(address)))}catch{}return {ethBalance,qarbiBalance}}catch{return {ethBalance:0,qarbiBalance:0}}}
export async function claimFaucetOnchain(signer:ethers.Signer){const tx=await getContractInstances(signer).token.faucet();const receipt=await tx.wait();return receipt.hash||tx.hash}
