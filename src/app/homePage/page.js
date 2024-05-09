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
import { addDoc, collection, doc, getDocs, query, where } from "firebase/firestore";
  

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

    const getAllUsers = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));

        const newUsers = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

        setAllUsers(newUsers);
    }

    
    
    const addArticle = async (e) => {
        e.preventDefault();

        const newArticle = {
            articleTitle: articleTitle,
            articleBody: articleBody,
            author: user.displayName,
            authorPic: user.photoURL,
        }

        allArticles.push(newArticle);
        
        try {
            await addDoc(collection(db, "articles"), newArticle);
            alert("Article added to firestore successfully");
            setArticleTitle("");
            setArticleBody("");
        } catch (error) {
            console.log(error);
        }

        setAllAcrticles(allArticles)
    }
    
    const discardPost = () => {
        setArticleTitle("");
        setArticleBody("");
    }
    
    const getAllArticles = async () => {
        const querySnapshot = await getDocs(collection(db, "articles"));

        const newArticles = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

        setAllAcrticles(newArticles);
    }
    
    useEffect(() => {
        getAllArticles()
        postAllUsersToFirestoreDatabase()
        getAllUsers()
    },[]);

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

            <div className="flex justify-between h-full w-full">
            <div className="block space-y-3 mt-10">
                <h1>Recent Users</h1>
                <div className="block space-y-4">
                    {allUsers.map((user) => (
                        <div className="flex gap-3 px-2">
                        <img src={user.userPic} className="rounded-full h-7 w-7"/>
                        <p className="text-[12px] mt-2">{`@${user.userName}`}</p>
                    </div>
                    ))}
                </div>
            </div>
            <div className="h-full w-full p-3 flex justify-center items-center">
                <div className="block">
                    <div className="flex items-center justify-center h-full w-full">
                        <div className="mr-24 h-[430px] w-[450px] space-y-3 border-2 border-gray-800 rounded-xl px-10 py-6">
                            <h1 className="text-gray-500 text-xl">Whats on your mind...</h1>
                            <Input placeholder="Give a mindblowing title 🤯" value={articleTitle} onChange={(e) => setArticleTitle(e.target.value)}/>
                            <Textarea value={articleBody} onChange={(e) => setArticleBody(e.target.value)}/>
                            <div className="flex justify-between">
                                <Button onClick={addArticle}>Post</Button>
                                <Button onClick={discardPost} variant="destructive">Discard</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>

            <div className="mt-10">
                        <h1 className="text-center text-gray-300 text-2xl">
                            Recent feeds 👇
                        </h1>

                        <div className="grid grid-cols-1 space-y-4 mt-5">
                            {allArticles.map((article) => (
                                <div className="h-auto w-auto p-2 border-2 border-gray-800 rounded-xl overflow-hidden">
                                <div className="flex gap-3 px-2">
                                    <img src={article.authorPic} className="rounded-full h-10 w-10"/>
                                    <p className="text-sm mt-2">{`@${article.author}`}</p>
                                </div>
                                <div className="p-2">
                                 <h1 className="text-gray-300 text-xl">{article.articleTitle}</h1>
                                 <p className="text-gray-500">{article.articleBody}</p>
                                </div>
                            </div>
                            ))}
                        </div>
            </div>

        </main>
    )
}