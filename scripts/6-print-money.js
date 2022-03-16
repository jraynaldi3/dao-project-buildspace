import {ethers} from "ethers";
import sdk from "./1-initialize-sdk.js";

const tokenModule = sdk.getTokenModule(
  "0xf4552FD2ac882D3fF36e7b1D8632f90E741cc88D"
);

(async()=>{
  try {
    //Whats the max supply you want to set
    const amount = 1_000_000;
    //We use util function from ethers to conver the amount 
    //to have 18 decimals (which is the standard for ERC20 tokens).
    const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(),18);
    //Interact with your deployed ERC-20 contract and mint the tokens!
    await tokenModule.mint(amountWith18Decimals);
    const totalSupply = await tokenModule.totalSupply();

    //print out how many of our token's are out there now!
    console.log (
      "there now is",
      ethers.utils.formatUnits(totalSupply,18),
      "$GDAO in circulation"
    );
  } catch(error){
    console.error("Failed to print money", error);
  }
})()