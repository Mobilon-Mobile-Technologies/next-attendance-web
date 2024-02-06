import { useMsal } from "@azure/msal-react";
import { Button } from "@nextui-org/react";

export const SignOutButton = () => {
  const { instance } = useMsal();

  const handleSignOut = () => {
    instance.logoutRedirect();
  };

  return (
    <Button color="primary" onPress={handleSignOut} variant="flat">
      Sign Out
    </Button>
  );
};
