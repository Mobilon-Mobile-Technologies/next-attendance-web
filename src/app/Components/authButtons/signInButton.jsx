'use client'

import React from "react";
import { useMsal } from "@azure/msal-react";
import { Button } from "@nextui-org/react";

const SignInButton = () => {
  const { instance } = useMsal();

  const handleSignIn = () => {
    instance.loginRedirect({
      scopes: ["user.read"],
    });
  };

  return (
    <Button color="primary" onPress={handleSignIn} variant="flat">
      Sign In
    </Button>
  );
};

export default SignInButton;
