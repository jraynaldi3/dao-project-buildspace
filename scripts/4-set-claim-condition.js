import sdk from "./1-initialize-sdk.js";

const bundleDrop = sdk.getBundleDropModule(
  "0xEaDAb6d179A9c0DB0D4A20F08296D1Ac77a2A99a"
);

(async ()=> {
  try {
    const claimConditionFactory = bundleDrop.getClaimConditionFactory();
    //specify conditions.
    claimConditionFactory.newClaimPhase({
      startTime: new Date(),
      maxQuantity: 50_000,
      maxQuantityPerTransaction : 1,
    });

    await bundleDrop.setClaimCondition(0, claimConditionFactory);
    console.log("Successfully set claim condition on bundle drop:", bundleDrop.address)
  }catch(error){
    console.error(error);
  }
})()