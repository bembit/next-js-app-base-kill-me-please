"use client";

import { NavigationMenuDemo } from "@/components/Navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import SignOutButton from "./SignOutButton";
import { useSession } from "next-auth/react"; // Import useSession hook
// import { DropdownMenuDemo } from "@/components/DropdownMenuDemo";

export default function Nav() {

    const { data: session } = useSession();

    return (
        <div className="w-full flex flex-wrap justify-between max-w-4xl shadow-md rounded-lg p-6 light:bg-gray-900 dark:bg-black border-b border-gray-200">
            <NavigationMenuDemo />
            {/* <DropdownMenuDemo email={email} /> Use the DropdownMenuDemo component */}
            <>
            {session && (
                <SignOutButton />
            )}
            <ThemeToggle />
            </>
        </div>
    );
}