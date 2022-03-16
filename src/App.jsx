import {useEffect, useMemo, useState} from "react";
import {ThirdwebSDK} from "@3rdweb/sdk";
import {useWeb3} from "@3rdweb/hooks";
import {ethers} from "ethers";
import {UnsupportedChainIdError} from '@web3-react/core';

//inisiate the sdk on Rinkeby
const sdk = new ThirdwebSDK("rinkeby");

// We can grab a reference to our ERC-1155 contract
const bundleDropModule = sdk.getBundleDropModule(
  "0xEaDAb6d179A9c0DB0D4A20F08296D1Ac77a2A99a",
);

const tokenModule = sdk.getTokenModule(
  "0xf4552FD2ac882D3fF36e7b1D8632f90E741cc88D",
);

const voteModule = sdk.getVoteModule(
  "0xDd45fafeC0dEbF26c55f343AA4192DE0762485e6"
);

const App = () => {
  //use the connectWallet hook thirdweb gives us.
  const {connectWallet,address, error, provider} = useWeb3();
  console.log("Address:", address);

  //The signer is required to sign transaction on the blockchain.
  //Without it we can only read data, not write.
  const signer = provider? provider.getSigner(): undefined;
  
  //state to define user has our NFT or not
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  //isClaiming lets us easily keep a loading state while the NFT is minting.
  const [isClaiming, setIsClaiming] = useState(false);
  //Hold the amoun of token each member has in state.
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
  //the array holding all our members addresses
  const [memberAddresses, setMemberAddresses] = useState([]);

  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  //Retrieve all our existing proposals from the contract
  useEffect(async()=>{
    if(!hasClaimedNFT){
      return;
    }
    // A simple call to voteModule.getAll() to grab the proposals.
    try {
      const proposals = await voteModule.getAll();
      setProposals(proposals);
      console.log("Proposals:",proposals);
    } catch(error){
      console.log("failed to get proposal", error);
    }
  },[hasClaimedNFT]);

  //check if user already voted
  useEffect(async()=>{
    if(!hasClaimedNFT){
      return;
    }

    //If we haven't finished retrieving the proposals fromthe useEffect above 
    // then we can't check if the user voted yet!
    if(!proposals.length){
      return;
    }

    //Check if the user hasalready voted on the first proposal.
    try{
      const hasVoted = await voteModule.hasVoted(proposals[0].proposalId,address);
      setHasVoted(hasVoted);
      if(hasVoted){
        console.log("User has already voted");
        
      }else {
        console.log("User has not voted yet")
      }
    } catch(error){
      console.error("Failed to check if wallet has voted", error);
    }
  }, [hasClaimedNFT, proposals, address])

  // A fancy function to shorten someones wallet address
  const shortenAddress = (str) =>{
    return str.substring(0,6) + "..." + str.substring(str.length - 4);
  };

  // This useEffect grabs all the addresses of our members holding our NFT.
  useEffect(async()=>{
    if (!hasClaimedNFT){
      return;
    }

    //Grab the users who hold NFT with tokenId 0
    try{
      const memberAddresses = await bundleDropModule.getAllClaimerAddresses("0")
      setMemberAddresses(memberAddresses);
      console.log("Members addresses", memberAddresses);
    } catch(error){
      console.error("failed to get member list", error);
    }
  },[hasClaimedNFT])

  useEffect(async()=>{
    if(!hasClaimedNFT){
      return;
    }

    //Grab all the balance 
    try{
      const amounts = await tokenModule.getAllHolderBalances();
      setMemberTokenAmounts(amounts);
      console.log("Amounts", amounts);
    } catch(error){
      console.error("failed to get token amounts", error);
    }
  },[hasClaimedNFT]);

  const memberList = useMemo(()=>{
    return memberAddresses.map((address)=>{
      return {
        address,
        tokenAmount : ethers.utils.formatUnits(
          //If the address isn't in memberTokenAmount, it means they
          //don't hold any of our token
          memberTokenAmounts[address] || 0,
          18
        ),
      };
    });
  },[memberAddresses, memberTokenAmounts]);
  
  //Another useEffect!
  useEffect(()=>{
    //pass the signer to the SDK
    //enables us to interact with our deployed contract!
    sdk.setProviderOrSigner(signer);
  },[signer])

  useEffect(async()=>{
    if (!address){
      return;
    }

    //Check if the user has the NFT using bundleDropModule.BalanceOf
    const balance = await bundleDropModule.balanceOf(address,"0");

    try{
      //if balance greater than 0, they have our NFT!
      if (balance.gt(0)){
        setHasClaimedNFT(true);
        console.log("This user has a membership NFT!");
      } else {
        setHasClaimedNFT(false);
        console.log("this user doesn't have a membership NFT.");
      }
    } catch(error){
      setHasClaimedNFT(false);
      console.error("failed to nft balance", error);
    }
  }, [address]);

  if(error instanceof UnsupportedChainIdError){
    return (
      <div className="unsupported-network">
        <h2>Please connect to Rinkeby</h2>
        <p>
          This dapp only works on the Rinkeby network, please switch networks in your connected wallet!
        </p>
      </div>
    );
  }


  
  //this is the case user hasn't connected their wallet
  // to your web app. let them call connectWallet
  if(!address){
    return (
      <div className="landing">
        <h1>Welcome to ProjectGDAO</h1>
        <button onClick={()=> connectWallet("injected")} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    )
  }

  const mintNft= async()=>{
    setIsClaiming(true);
    try{
      // Call bundleDropModule.claim("0",1) to mint nft to user's wallet.
      await bundleDropModule.claim("0",1);
      //set claim state
      setHasClaimedNFT(true);
      //show user their fance new NFT
      alert(`Successfully Minted! check itout on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`)
    }catch(error){
      console.error("Failed to claim", error);
    } finally{
      setIsClaiming(false);
    }
  }

  //if the user has already claimed their NFT we want to display the internal
  //DAO, only DAO member will see this. Render all the members + token amounts.
  if(hasClaimedNFT){
    return(
      <div className="member-page">
        <h1>DAO member page</h1>
        <p>Congratulations on being a member</p>
        <div>
          <div>
            <h2> Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member)=>{
                  return(
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        
        
          <div>
            <h2> Active Proposals </h2>
            <form onSubmit={
              async(e)=>{
                e.preventDefault();
                e.stopPropagation();

                setIsVoting(true);

                const votes = proposals.map((proposal)=>{
                  let voteResult = {
                    proposalId: proposal.proposalId,
                    //abstain by default
                    vote : 2,
                  }
                  proposal.votes.forEach((vote)=>{
                    const elem = document.getElementById(
                      proposal.proposalId+'-'+vote.type
                    )
                    if (elem.checked){
                      voteResult.vote = vote.type;
                      return;
                    }
                  })
                  return voteResult;
                });

                //first we need to make sure the user delegates their token to vote
                try{
                  const delegation = await tokenModule.getDelegationOf(address);
                  //if the delegaion is the 0x0 that means they have note delegated their governance tokens yet
                  if (delegation === ethers.constants.AddressZero){
                    //if they havent delegated their token yet, we'll have them before voting
                    await tokenModule.delegateTo(address);
                  }
                  console.log(delegation);
                  console.log(votes)
                  //then we need to vote on the proposals
                  try {
                    await Promise.all(
                      votes.map(async(vote)=>{
                        //before voting we first need to check whether the proposal is open for voting
                        //we first need to get the latest state of the proposal
                        const proposal = await voteModule.get(vote.proposalId);
                        console.log(proposal);
                        console.log(vote.vote);
                        //then we check if the proposal is open for voting (state === 1 means it is open)
                        if( proposal.state === 1){
                          return voteModule.vote(vote.proposalId,vote.vote)
                        }
                        //if proposal is not open for voting we just return nothing
                        return;
                      })
                    );
                    try{
                      //if any of the proposals are ready to be executed we'll need to execute them
                      //a proposal isready to be executed if it is in state 4
                      await Promise.all(
                        votes.map(async(vote)=>{
                          const proposal = await voteModule.get(
                            vote.proposalId
                          );

                          //if the state is in state 4, we'll execute 
                          if (proposal.state === 4){
                            return voteModule.execute(vote.proposalId);
                          }
                        })
                      );
                      // if we get here that means we succesfully voted, so let's set the "hasVoted" status
                      setHasVoted(true);
                      console.log("successfully voted");
                    } catch (error){
                      console.error("failed to execute votes", error);
                    }
                  } catch(err){
                    console.error("failed to vote", err);
                  }
                } catch (err){
                  console.error("failed to delegate tokens");
                } finally {
                  setIsVoting(false);
                }
              }
            }>
            {proposals.map((proposal)=>{
              return(
                <div className="card">
                  <h5> {proposal.description}</h5>
                  {proposal.votes.map((vote)=>{
                  return(
                    <div key={vote.type}>
                      <input 
                        type="radio" 
                        id={proposal.proposalId + "-"+ vote.type}
                        name={proposal.proposalId}
                        value={vote.type}
                        defaultChecked= {vote.type === 2}/>
                      <label 
                        for={vote.label}>
                        {vote.label}
                      </label>
                    </div>
                  )})}
                </div>
              )
            })}
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting 
                  ? "Voting..."
                  : hasVoted 
                    ? "You Already voted"
                    : "Submit Votes"
                }
              </button>
              <small>
                This will trigger multiple transactions that you will need to sign.
              </small>
            </form>
          </div>
        </div>
      </div>
      
    
    );
  };
  
  //this is the case where we have the user address
  // which means they've connected their wallet to our site!
  
  return (
    <div className="mint-nft">
      <h1>Mint Your free DAO Membership NFT</h1>
      <button disabled={isClaiming} onClick={()=>mintNft()}>
        {isClaiming? "Minting..." : "Mint your nft (FREE)"}
      </button>
    </div>
  );
};

export default App;
