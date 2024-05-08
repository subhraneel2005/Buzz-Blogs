"use client"

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";


export default function Authenticate(){
    
    const provider = new GoogleAuthProvider();
    const router = useRouter();
    
    const googleHanlerAuth = () => {
        signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        router.push("/homePage")
        
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
    }

    return (
        <div className="min-h-screen w-full p-3 flex justify-center items-center">
            <button className="bg-neutral-950 text-neutral-300 rounded-xl p-3" onClick={googleHanlerAuth}>Sign in with Google</button>
        </div>
    )
}