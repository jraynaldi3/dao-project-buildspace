import {ethers} from "ethers";
import sdk from "./1-initialize-sdk.js";

const voteModule = sdk.getVoteModule(
  "0xDd45fafeC0dEbF26c55f343AA4192DE0762485e6"
);

const tokenModule = sdk.getTokenModule(
  "0xf4552FD2ac882D3fF36e7b1D8632f90E741cc88D"
);

(async ()=>{
  try {
    await tokenModule.grantRole("minter", voteModule.address);

    console.log(
      "Successfully gave vote module permissions to act on token module"
    );
    
  }catch(error){
    console.error(
      "Failed to grant vote module permissions on token module",
      error
    )
    process.exit(1);
  }

  try{
    //Grab our wallet's token balance, remember -- we hold basically the entire supply
    const ownedTokenBalance = await tokenModule.balanceOf(
      process.env['WALLET_ADDRESS']
    );

    const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value);
    const percent90 = ownedAmount.div(100).mul(90);

    await tokenModule.transfer(
      voteModule.address,
      percent90
    );

    console.log("Successfully transferred tokens to vote module");
    
  } catch(err){
    console.error("Failed to transfer tokens to vote module", err);
  }
})();