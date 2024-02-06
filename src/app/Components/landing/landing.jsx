"use client";

import React, { useEffect, useState } from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsalAuthentication,
  useIsAuthenticated,
  useMsal
} from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import axios from "axios";
import QrReader from "react-qr-scanner";

const Landing = () => {
  const [userData, setUserData] = useState([]);
  const [qrStatus, setQrStatus] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const {instance}=useMsal();

  const { authResult, error } = useMsalAuthentication(InteractionType.Popup, {
    scopes: ["user.read"],
  });


const checkUser=()=>{
  if(isAuthenticated){
    const currentAccount=instance.getActiveAccount();

    if(currentAccount){
        console.log(currentAccount);
        setUserData(currentAccount);
        setQrStatus(true);
    }
  }
  else{
    console.log('User not found')
  }

}

  
  const handleError = (error) => {
    console.log(error);
  };

  const handleScan = (result) => {
    if (result) {
      console.log("qr found");
      checkUser();

    } else {  
      console.log("no qr found yet");
    }
  };

  return (
    <div>
      Landing
      <div>
        {qrStatus ? (
          <div>QR Scanned</div>
        ) : (
          <QrReader
            delay={100}
            style={{ width: "100%" }}
            onError={handleError}
            onScan={handleScan}
          />
        )}
      </div>
    </div>
  );
};

export default Landing;
