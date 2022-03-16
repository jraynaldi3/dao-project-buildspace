import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const app = sdk.getAppModule("0x499Df258da030794D8f22CC029b90f8808705F7C");

(async () => {
  try {
    const bundleDropModule = await app.deployBundleDropModule({
      //the collection's name 
      name: "ProjectG Membership",
      //description for the collection. 
      description: "A DAO for NFTs Artist.",
      //imace fro the collection that will show up on OpenSea.
      image: readFileSync("scripts/assets/ProjectG.png"),
      // We need to pass in the address of the person who will be receiving the proceeds from sales of nfts in the module.
      //We're planning on not charging people for the drop, so we'll pass in the 0x0 address
      //you can set this to your own wallet if you want to charge for the NFT
      primarySaleRecipientAddress: ethers.constants.AddressZero
    });
    console.log(
      "Successfully deployed bundleDrop module, address:", bundleDropModule.address,
    );
    console.log(
      "bundleDrop metadata",
      await bundleDropModule.getMetadata(),
    );
  } catch (error) {
    console.log(error);
  }
})()