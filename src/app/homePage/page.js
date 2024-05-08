"use client"

import { Button } from "@/components/ui/button";
import { auth } from "@/firebase/config";
import { getAuth, signOut } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input"
import { db } from "@/firebase/config";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
  

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

    const [articleTitle, setArticleTitle] = useState("");
    const [articleBody, setArticleBody] = useState("");
    const [allArticles, setAllAcrticles] = useState([]);

    const [allUsers, setAllUsers] = useState([]);

    const postAllUsersToFirestoreDatabase = async() => {
        const newUser = {
            userName: user.displayName,
            userPic: user.photoURL,
            userEmail: user.email,
        }

        try {
            const usersCollection = collection(db, "users");
            const querySnapshot = await getDocs(query(usersCollection, where("userEmail", "==", user.email)));


            if(querySnapshot.empty){
                await addDoc(usersCollection, newUser);
                allUsers.push(newUser);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (user && user.email) {
            postAllUsersToFirestoreDatabase(user);
        }
    },[user])


    const addArticle = async (e) => {
        e.preventDefault();

        const newArticle = {
            articleTitle: articleTitle,
            articleBody: articleBody,
            author: user.displayName,
            authorPic: user.photoURL,
            }

        try {
            await addDoc(collection(db, "articles"), newArticle);

            allArticles.push(newArticle);

            alert("Article added to firestore successfully")
        } catch (error) {
            console.log(error);
        }
    }

    const discardPost = () => {
        setArticleTitle("");
        setArticleBody("");
    }

    const getAllArticles = async () => {
        
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

            <div className="block space-y-3">
                <h1>Recent Users</h1>
                <div className="flex justify-between">
                    
                </div>
            </div>
            <div className="h-full w-full p-3 flex justify-center items-center">
                <div className="block">
                    <div className="space-y-3 border-2 border-gray-800 rounded-xl px-10 py-6">
                        <h1 className="text-gray-500 text-xl">Whats on your mind...</h1>
                        <Input placeholder="Give a mindblowing title 🤯" value={articleTitle} onChange={(e) => setArticleTitle(e.target.value)}/>
                        <Textarea value={articleBody} onChange={(e) => setArticleBody(e.target.value)}/>
                        <div className="flex justify-between">
                            <Button onClick={addArticle}>Post</Button>
                            <Button onClick={discardPost} variant="destructive">Discard</Button>
                        </div>
                    </div>
                    <div className="mt-10">
                        <h1 className="text-center text-gray-300 text-2xl">
                            Recent feeds 👇
                        </h1>

                        <div className="grid grid-cols-1 space-y-4 mt-5">
                            <div className="h-auto w-auto p-2 border-2 border-gray-800 rounded-xl">
                                <div className="flex justify-between px-2">
                                    <img src={user?.photoURL} className="rounded-full h-10 w-10"/>
                                    <p className="font-semibold">{`Author: ${user.displayName}`}</p>
                                </div>
                                <div className="p-2">
                                 Article body   
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}