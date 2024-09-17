"use client";

import Image from "next/image";
import logoSrc from "/public/logo.svg";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TopbarProps {
  onAddNew?: () => void; // Make onAddNew optional
}

export default function Topbar({ onAddNew }: TopbarProps) {
  return (
    <div className="bg-white fixed w-full h-15 flex justify-between items-center gap-8 shadow-navbar pr-12 py-2 z-10">
      <header className="w-full h-10% text-white shadow-md fixed top-0 left-0 z-10 p-4 bg-[#FFFFFF]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="colums-md">
          <Link href="http://10.100.101.124:3000/clipan/public/#header" passHref>
          <Image
            src={logoSrc}
            alt="Logo"
            className="w-40 h-auto"
            width={160}
            height={40}
          />
        </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-x-8 hidden md:flex">
            <a href="http://10.100.101.124:3000/clipan/public/#header" className="text-gray-600 hover:text-blue-600">
              Home
            </a>
            <a href="http://10.100.101.124:3000/clipan/public/#links" className="text-gray-600 hover:text-blue-600">
              Web Links
            </a>
            <a href="http://10.100.101.124:3000/clipan/public/#contacts" className="text-gray-600 hover:text-blue-600">
              Contact
            </a>
          </nav>

          {/* Render Add New button if onAddNew is provided */}
          {onAddNew && (
            <Button
              className="bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={onAddNew}
            >
              Add New
            </Button>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button className="text-gray-600 focus:outline-none">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
}
