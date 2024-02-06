"use client";

import React, { useEffect, useState } from "react";
import {
  useMsalAuthentication,
  useIsAuthenticated,
  useMsal,
} from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import QrReader from "react-qr-scanner";
import styles from "./landing.module.css";

const Landing = () => {
  const [userData, setUserData] = useState([]);
  const [qrStatus, setQrStatus] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();

  const { authResult, error } = useMsalAuthentication(InteractionType.Popup, {
    scopes: ["user.read"],
  });

  const checkUser = () => {
    if (isAuthenticated) {
      const currentAccount = instance.getActiveAccount();

      if (currentAccount) {
        console.log(currentAccount);
        setUserData(currentAccount);
        setQrStatus(true);
      }
    } else {
      console.log("User not found");
    }
  };

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
    <div className={styles.container}>
      {isAuthenticated ? (
        <div>
          {qrStatus ? (
            <div>QR Scanned</div>
          ) : (
            <div>
              <h1 className={styles.heading}>Scan the QR</h1>
              <div className={styles.qrBox}>
                <div className={styles.qr}>
                  <QrReader
                    delay={100}
                    style={{ width: "100%" }}
                    onError={handleError}
                    onScan={handleScan}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.notLoggedIn}>
          <div>You are not Logged In. Sign In to mark your Attendance.</div>
        </div>
      )}
    </div>
  );
};

export default Landing;
