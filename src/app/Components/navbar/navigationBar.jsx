"use client";

import React from "react";
import styles from "./navbar.module.css";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import SignInButton from "../authButtons/signInButton";
import { useIsAuthenticated } from "@azure/msal-react";
import { SignOutButton } from "../authButtons/signOutButton";
import Image from "next/image";

const NavigationBar = () => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <Navbar>
      <NavbarBrand>
        <Image src='/assets/uni_logo.png' height={140} width={140} alt="univeristy_logo"/>
      </NavbarBrand>
      {/* <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
         <p className="text-inherit text-2xl font-medium text-gray">Attendance Portal</p>
        </NavbarItem>
      </NavbarContent> */}
      <NavbarContent justify="end">
        <NavbarItem>
          {isAuthenticated ? <SignOutButton /> : <SignInButton />}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default NavigationBar;
