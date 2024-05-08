import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home(){

  return(
    <main className="min-h-screen w-full flex justify-center items-center select-none p-4">
      <div className="block space-y-6">
        <h1 className="text-center text-5xl">Welcome to Buzz-Blogs 📝</h1>
        <h1 className="text-center text-3xl">Explore and write trendy articles all at one place 😁</h1>

        <div className="h-full w-full flex justify-center items-center mt-4">
        <Link href={"/auth"}>
          <Button variant="default">Get started</Button>
        </Link>
        </div>
      </div>
    </main>
  )
}