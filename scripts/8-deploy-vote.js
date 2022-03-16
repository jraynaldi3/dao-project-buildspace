import sdk from "./1-initialize-sdk.js";

const appModule = sdk.getAppModule(
  "0x499Df258da030794D8f22CC029b90f8808705F7C"
);

(async ()=>{
  try{
    const voteModule = await appModule.deployVoteModule({
      //give your governance contract a name
      name: "Project G DAO Proposals",

      //This is the location of our governance token, our ERC-20 contract!
      votingTokenAddress: "0xf4552FD2ac882D3fF36e7b1D8632f90E741cc88D",

      //After a proposal is created, when can members start voting 
      //for now, we set this to immediately
      proposalStartWaitTimeInSeconds:0,

      //How long do members have to vote on a proposal when it's created
      //Here, we set it to 24 hours (86400 seconds)
      proposalVotingTimeInSeconds: 24*60*60,

      //quorum
      votingQuorumFraction:0,

      //What the minimum # of tokens a user needs to be allowes to create a proposal
      minimumNumberOfTokensNeededToPropose:"0",
    });
    console.log(
      "Successfully deployed vote module, address:",
      voteModule.address,
    );
  }catch(err){
    console.error("Failed to deploy vote module", err)
  }
})();