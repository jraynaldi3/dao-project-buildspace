import sdk from "./1-initialize-sdk.js";
import {ethers} from "ethers";

const voteModule = sdk.getVoteModule(
  "0xDd45fafeC0dEbF26c55f343AA4192DE0762485e6",
);

const tokenModule = sdk.getTokenModule(
  "0xf4552FD2ac882D3fF36e7b1D8632f90E741cc88D",
);

(async()=>{
  try{
  const amount = 420_000;
  //create proposal to mint 420,000 new token to the treasury.
  await voteModule.propose(
    "Should the Dao mint an additional "+ amount +"tokens into the treasury?",
    [
      {
        //Our nativeToken is ETH. nativeTokenValue is the amount of ETH we want
        //to send in this proposal.. in this case, we're sending 0 ETH.
        //We're just minting new tokens to the treasury. So, set to 0.
        nativeTokenValue : 0,
        transactionData : tokenModule.contract.interface.encodeFunctionData(
          //We're doing a mint! And, we're minting to thevoteModule, which 
          //actiong as our treasury.
          "mint",
          [
            voteModule.address,
            ethers.utils.parseUnits(amount.toString(),18),
          ]
        ),
        //Our token module that actually execute the mint
        toAddress: tokenModule.address,
      },
    ]
  );
    console.log("Successfully created proposal to mint tokens");
    
  } catch(error){
    console.error("failed to created proposal to mint tokens",error);
    process.exit(1);
  }

  try{
    const amount = 6_900;
    //Created proposal to transfer ourselves 6_900 tokens for being awesome
    await voteModule.propose(
      "Should the Dao transfer " + amount + "tokens from the trasury to " +
      process.env["WALLET_ADDRESS"] +" for being awesome?",
      [
        {
          nativeTokenValue:0,
          transactionData: tokenModule.contract.interface.encodeFunctionData(
            "transfer",
            [
              process.env["WALLET_ADDRESS"],
              ethers.utils.parseUnits(amount.toString(),18),
            ]
          ),
          toAddress: tokenModule.address,
        },
      ]
    );
    console.log(
      "Succesfully created proposal to reward ourselves from the treasury,let's hope people vote for it!"
               );
  } catch(error){
    console.error("failed to create second proposal",error);
  }
})()