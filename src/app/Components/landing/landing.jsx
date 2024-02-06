'use client'

import React,{useEffect, useState} from 'react'
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsalAuthentication,
} from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import axios from 'axios';

const Landing = () => {

  const [userData,setUserData]=useState([])

  

  const { result, error } = useMsalAuthentication(InteractionType.Popup, {
    scopes: ["user.read"],
  });


  useEffect(()=>{

    // const retrieveUserData=async()=>{

    //   if(result){
    //     // console.log(result)
  
    //     const {accessToken}=result;
    //     const response =await axios.get("https://graph.microsoft.com/v1.0/me", accessToken);

    //     console.log(response);

    //     setUserData(response)
    //   }

    // }

    // retrieveUserData();

    console.log(result)

  },[])


  return (
    <div>Landing</div>
  )
}

export default Landing