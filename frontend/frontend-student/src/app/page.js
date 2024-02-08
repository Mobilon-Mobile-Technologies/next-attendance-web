'use client'

import MsalComponent from "./Components/msalComponent/msalComponent";
import styles from "./homepage.module.css";
import { PublicClientApplication, EventType } from "@azure/msal-browser";


const pca=new PublicClientApplication({
  auth:{
      clientId: 'cc6ffe01-47f8-4532-a84d-d789df590cb3',
      authority: 'https://login.microsoftonline.com/2c5bdaf4-8ff2-4bd9-bd54-7c50ab219590',
      redirectUri: '/',
  }
})

pca.addEventCallback(event=>{
  if(event.eventType===EventType.LOGIN_SUCCESS){
      console.log(event);
      pca.setActiveAccount(event.payload.account);
  }
})

export default function Home() {
  return (
    <div className={styles.parentContainer}>
      <MsalComponent msalInstance={pca}/>
    </div>
  );
}
