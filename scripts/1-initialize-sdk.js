import {ThirdwebSDK} from "@3rdweb/sdk";
import ethers from "ethers";
const privateKey = process.env['PRIVATE_KEY']
const alchemyApi = process.env['ALCHEMY_API_URL']
const walletAddress = process.env['WALLET_ADDRESS']

if(!privateKey || privateKey == "") {
  console.log("Private key not found")
}

if(!alchemyApi || alchemyApi==""){
  console.log("Alchemy API URL not found.")
}

if(!walletAddress || walletAddress==""){
  consol.log("Wallet Address not found.")
}


const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    //your wallet private key
    privateKey,
    //RPC URL, we'll use our Alchemy API URL
    ethers.getDefaultProvider(alchemyApi),
  ),
);

(async ()=>{
  try{
    const apps = await sdk.getApps();
    console.log("Your app address is:", apps[0].address);
  } catch(err){
    console.error("Failed to get apps from the sdk", err);
    process.exit(1);
  }
})()

export default sdk