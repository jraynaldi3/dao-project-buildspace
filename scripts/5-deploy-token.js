import sdk from "./1-initialize-sdk.js";

const app = sdk.getAppModule("0x499Df258da030794D8f22CC029b90f8808705F7C");

(async ()=>{
  try {
    // Deploy a standard ERC-20 contract.
    const tokenModule = await app.deployTokenModule({
      // What's your token's name
      name: "ProjectG",
      //What's your token symbol
      symbol: "GDAO"
    });
    console.log(
      "Successfully deployed token module, address:",
      tokenModule.address,
    );
  }catch(error){
    console.error("failed to deploy token module", error);
  }
})();