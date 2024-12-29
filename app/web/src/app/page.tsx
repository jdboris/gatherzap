"use client";

import Map from "@/components/map";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { APIProvider } from "@vis.gl/react-google-maps";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        onLoad={() => console.log("Maps API has loaded.")}
      >
        <header className="flex justify-between">
          <nav>
            <Link href={"/"}>Gatherzap</Link>
          </nav>

          <div>
            <SignedOut>
              <Link href={"/sign-up"}>Sign Up</Link>
              <Link href={"/log-in"}>Log In</Link>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </header>
        <main className="h-full">
          <Map />
        </main>
        <footer></footer>
      </APIProvider>
    </>
  );
}
