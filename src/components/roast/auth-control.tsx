'use client';

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AuthControl = () => {
    return (
        <div className="flex items-center">
            <SignedOut>
                <SignInButton mode="modal">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-amber-500 hover:bg-slate-800" title="Login for Inventory Sync">
                        <LogIn className="h-5 w-5" />
                    </Button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <UserButton appearance={{
                    elements: {
                        avatarBox: "h-8 w-8"
                    }
                }} />
            </SignedIn>
        </div>
    );
};
