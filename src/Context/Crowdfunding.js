
import React, {useState,useEffect} from "react";
import Web3modal from 'web3modal';
import {ethers} from 'ethers';
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import {prepareWriteContract,writeContract,waitForTransaction} from '@wagmi/core'
import {useOpenModal} from '@web3modal/react';
import {useNetwork,useSwitchNeework} from 'wagmi';

//internal import
import  {Crowdfundingaddress,crowdfundingabi} from './constant';


// fetching smart contract
const fetchcontract=(signerorprovider)=>{
   return new ethers.Contract(Crowdfundingaddress,crowdfundingabi,signerorprovider); 
}

export const Crowdfundingcontext=React.createContext();


export const CrowdFundingProvider=({children})=>{
  
    const {address}=useAccount()
const titleData=" CrowdFunding data";
const [currentAccount,setCurrentAccount]=useState("");


const createCampaign=async (campaign)=>{
    if(!address){
        toast.error("Connect your wallet first")
        console.log("Main bhol gia")
    }
    else{
        
        const currentTimestamp = new Date().getTime();
       const provider1 = new ethers.providers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/a_lqfI5wJluRQ97wgP-McBNqy9cOg_2F')
       const contract1= await fetchcontract(provider1);
       const allcampaign= await contract1.getCampaigns();
       const parsedtitle=allcampaign.map((campaign,i)=>({
        owner: campaign.owner,
        title: campaign.title,
        description:campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline:campaign.deadline.toNumber(),
        amountCollected:ethers.utils.formatEther(campaign.amountCollected.toString()),
        imageurl:campaign.imageurl,
        pId:i
        
        
       })).filter(campaign=> campaign.deadline>currentTimestamp && campaign.amountCollected<campaign.target);

       var i=0;
      
       const {title,description,amount,deadline,imageurl}=campaign;
       console.log(parsedtitle.length)
       for(i=0;i<parsedtitle.length;i++){
if(parsedtitle[i].title.toLowerCase()==title.toLowerCase()){
    toast.error("Already a campaign with the same title. Try with new title");
    return;
}
       }

       var nocampaign=0;
       for(i=0;i<parsedtitle.length;i++){
if(parsedtitle[i].owner.toLowerCase()==address.toLowerCase()){
    nocampaign++;
    if(nocampaign>=3){
        toast.error("Only three number of live campaigns are allowed")
        return
    }
}
       }

   console.log("Owner of Campaign: ",currentAccount," Title: ",title," Description: ",description, " Amount: ",ethers.utils.parseUnits(amount,18).toString()," Deadline: ",new Date(deadline).getTime()," Url of image: ",imageurl)
   const web3modal=new Web3modal();
   const connection=await web3modal.connect();
   const provider =new ethers.providers.Web3Provider(connection);
   const signer =provider.getSigner();
   const contract=fetchcontract(signer);
  
   try{
       const transaction=await contract.createCampaign(
address, //owner
title,// title
description,//description
ethers.utils.parseUnits(amount,18).toString(),//Wei mn convert
new Date(deadline).getTime(), //deadline
imageurl
       );
       await transaction.wait();
       console.log("All contract Data", transaction);
       toast.success("Campaign is Uploaded")
       getCampaign();
       getUserCampaign();
   }
   catch(error){
console.log("contract call fail, ",error)
   }
}
}
const getCampaign=async()=>{
  
   
const provider =new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/a_lqfI5wJluRQ97wgP-McBNqy9cOg_2F");
const contract =fetchcontract(provider);
const campaign=await contract.getCampaigns();
const currentTimestamp = new Date().getTime();

const parsedCampaigns=campaign?.map((campaign,i)=>({//parsedCampaigns[0].own
    owner: campaign.owner,
    title: campaign.title,
    description:campaign.description,
    target: ethers.utils.formatEther(campaign.target.toString()),
    deadline:campaign.deadline.toNumber(),
    amountCollected:ethers.utils.formatEther(campaign.amountCollected.toString()),
    imageurl:campaign.imageurl,
    pId:i
    
})).filter(campaign => campaign.deadline > currentTimestamp && campaign.amountCollected<campaign.target);;
return parsedCampaigns;

}
const getUserCampaign=async()=>{
  if(!address){

  }
   else{ 
   const provider =new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/a_lqfI5wJluRQ97wgP-McBNqy9cOg_2F");
   const contract=fetchcontract(provider);
   const allcampaign=await contract.getCampaigns();
// const request= await prepareWriteContract({
//     address:Crowdfundingaddress,
//     abi:crowdfundingabi,
//     functionName:'getCampains',
//     args: [],
//     account:address
// })
// const {hast}= await writeContract(request)
// const {allcampaign,status}=await waitForTransaction({
//     hash
// })
   const accounts =await window.ethereum.request({
       method: "eth_accounts",
   });
   const currentTimestamp = new Date().getTime();
   const currentUser=currentAccount;
   console.log("This is in Get User Campaign: ",currentUser);
   const filterCampaigns=allcampaign?.filter(
       (campaign)=>
       campaign.owner.toLowerCase() === address.toLowerCase()
   );
   console.log("This is in Get User Campaign: ",filterCampaigns);
   
   var userData=filterCampaigns.map((campaign,i)=>({
       owner: campaign.owner,
    title: campaign.title,
    description:campaign.description,
    target: ethers.utils.formatEther(campaign.target.toString()),
    deadline:campaign.deadline.toNumber(),
    amountCollected:ethers.utils.formatEther(campaign.amountCollected.toString()),
    imageurl:campaign.imageurl,
    pId:i
   })).filter(campaign => campaign.deadline > currentTimestamp && campaign.amountCollected<campaign.target);;
   ;
   return  userData;
   }
}
const donate=async(pId,amount)=>{
    if(!currentAccount){
        toast.error("Connect your wallet first")
    }
    else{
const web3modal=new Web3modal();
const connection= await web3modal.connect();
const provider=new ethers.providers.Web3Provider(connection);
const signer=provider.getSigner();
const contract=fetchcontract(signer);
const campaigndata=await contract.donateToCampaign(pId,{
   value: ethers.utils.parseEther(amount),
});
await campaigndata.wait();
//location.reload();
return campaigndata
}}
const getDonations=async(pId)=>{
   const provider =new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/a_lqfI5wJluRQ97wgP-McBNqy9cOg_2F");
   const contract =fetchcontract(provider);
   const donations=await contract.getDonator(pId);
const numberofdonations=donations[0].length;
const parsedDonations=[];
for(let i=0;i<numberofdonations;i++){
parsedDonations.push({
    donator:donations[0][i],
   donation:ethers.utils.formatEther(donations[1][i].toString()),
   })

}
return parsedDonations;
}

/// Check if wallet is connected 



useEffect(()=>
{
  getCampaign();
  getUserCampaign();
   
},[address])





return (
   <Crowdfundingcontext.Provider
   value={{
       titleData,
       createCampaign,
       getCampaign,
       getUserCampaign,
       donate,
       getDonations,
       
   }}>{children}</Crowdfundingcontext.Provider>
);
};