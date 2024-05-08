"use client"

import { Button } from "@/components/ui/button";
import { auth } from "@/firebase/config";
import { getAuth, signOut } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  

export default function HomePage(){

    const router = useRouter();
    
    const auth = getAuth()
   const user = auth.currentUser
    
    const logOut = () => {
        if(user){
            signOut(auth)
            router.push("/auth")
        }
    }
    return(
        <main className="select-none min-h-screen w-full p-3">
            <DropdownMenu>
            <DropdownMenuTrigger className=" rounded-xl border-2 border-gray-600 px-4 py-2">My Profile</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{user?.displayName}</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem><img src={user?.photoURL} className="rounded-full w-10 h-10"/></DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>{user?.email}</DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem><Button variant="destructive" onClick={logOut}>Log out</Button></DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </main>
    )
}