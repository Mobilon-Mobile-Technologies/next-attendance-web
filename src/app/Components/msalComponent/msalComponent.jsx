"use client";

import React, { useEffect } from "react";
import { MsalProvider, useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import Landing from "../landing/landing";
import NavigationBar from "../navbar/navigationBar";

const MsalComponent = ({ msalInstance }) => {
  return (
    <MsalProvider instance={msalInstance}>
      <div className="flex-1 ">
        <NavigationBar />
        <HomePage />
      </div>
    </MsalProvider>
  );
};

const HomePage = () => {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (!isAuthenticated) {
      instance
        .ssoSilent({
          scopes: ["user.read"],
          loginHint: "",
        })
        .then((response) => {
          instance.setActiveAccount(response.account);
        })
        .catch((error) => {
          if (error instanceof InteractionRequiredAuthError) {
            instance.loginRedirect({
              scopes: ["user.read"],
            });
          }
        });
    }
  }, []);

  return <Landing />;
};

export default MsalComponent;
