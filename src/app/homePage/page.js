"use client"

import { Button } from "@/components/ui/button";
import { auth } from "@/firebase/config";
import { getAuth, signOut } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
        <main>
            <h1>{`Welcome :${user?.displayName}`}</h1>
            <p>{`Email: ${user?.email}`}</p>
            <img className="rounded-full shadow-xl w-10 h-10" src={user.photoURL}/>

            <Button variant="destructive" onClick={logOut}>Log Out</Button>
        </main>
    )
}