import sdk from "./1-initialize-sdk.js";

const tokenModule =sdk.getTokenModule(
  "0xf4552FD2ac882D3fF36e7b1D8632f90E741cc88D"
);

(async()=>{
  try{
    console.log(
      "Roles that exist right now",
      await tokenModule.getAllRoleMembers()
    );

    //revoke all the superpowers your wallet had over the ERC-20 contract.
    await tokenModule.revokeAllRolesFromAddress(process.env["WALLET_ADDRESS"]);
    console.log(
      "Roles after revoking ourselves",
      await tokenModule.getAllRoleMembers()
    );
    console.log("Succesfully revoked our superpowers from the ERC-20 contract")
  }catch(error){
    console.log("Failed to revoke", error);
  }
})()