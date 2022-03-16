import sdk from "./1-initialize-sdk.js";
import {readFileSync} from "fs";

const bundleDrop= sdk.getBundleDropModule(
  "0xEaDAb6d179A9c0DB0D4A20F08296D1Ac77a2A99a"
);

(async()=>{
  try{
    await bundleDrop.createBatch([
      {
        name: "Project G pin",
        description: "This NFT will give you access to ProjectG DAO",
        image: readFileSync("scripts/assets/projectGpin.jpg"),
      }
    ]);
    console.log("Successfully created a new NFT in the drop!");
  } catch(error){
    console.error("failed to create the new NFT", error);
  }
})()
