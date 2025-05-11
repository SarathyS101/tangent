"use client";

import Link from "next/link";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import  auth  from "@/utils/authorization";

export default function Navbar() {
    const router = useRouter();
  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          Tangent
        </Link>

        <div className="hidden md:flex space-x-6">
          <p className="text-gray-600 hover:text-gray-900">
            Prepare to Tangent
          </p>
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex space-x-4">
          <Button
            onClick={() => {
              signOut(auth).then(() => router.replace("/"));
            }}
          >
            Sign Out
          </Button>
        </div>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="flex flex-col space-y-4">
              <SheetClose asChild>
                <Link href="/" className="text-xl font-bold">
                  Tangent
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <p className="text-gray-600 hover:text-gray-900">
                  Prepare to Tangent
                </p>
              </SheetClose>
              <SheetClose asChild>
                <Button>Sign Out</Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
