import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Sidebar from "@/components/sidebar/sidebar";
import Main from "@/components/main/Main";
import CheckIfLoggedIn from "@/components/other/CheckIfLoggedIn";


export default function Home() {
  

  return (
    <div className="flex flex-row justify-center min-h-svh w-full h-screen">
      <CheckIfLoggedIn />
      <Sidebar />
      <Main />
      
    </div>
  );
}
