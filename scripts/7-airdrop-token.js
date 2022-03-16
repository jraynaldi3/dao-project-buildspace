import {ethers} from "ethers";
import sdk from "./1-initialize-sdk.js";

const bundleDropModule = sdk.getBundleDropModule(
  "0xEaDAb6d179A9c0DB0D4A20F08296D1Ac77a2A99a"
);

const tokenModule = sdk.getTokenModule(
  "0xf4552FD2ac882D3fF36e7b1D8632f90E741cc88D"
);

(async()=>{
  try{
  //Grab all the addresses of people who own our membership NFT, which has
  // a tokenId of 0
  const walletAddresses = await bundleDropModule.getAllClaimerAddresses("0");

  if (walletAddresses.length === 0){
    console.log(
      "No NFTs have been claimed yet, maybe get some friends to claim your free NFTS"
    )
    process.exit(0);
  }

  //Loop through the array of addresses.
  const airdropTargets = walletAddresses.map((address)=>{
    //pick a  random #between 1000 and 10000.
    const randomAmount = Math.floor(Math.random()*(10000-1000+1)+1000);
    console.log("Going to airdrop", randomAmount, "token to", address);

    // Set up the targt.
    const airdropTarget={
      address,
      //remember, we need 18 decimal places!
      amount: ethers.utils.parseUnits(randomAmount.toString(),18),
    }

    return airdropTarget
  })

  //Call TransferBatch on all our airdrop targets
  console.log("starting airdrop...")
  await tokenModule.transferBatch(airdropTargets);
  console.log("Succesfully airdropped tokens to all the holders of the NFT!")
  } catch(error){

    console.error("Failet to airdrop", error);
  }
  
})()