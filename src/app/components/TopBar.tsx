"use client";

export default function Topbar() {
  return (
    <div className="bg-white fixed w-full h-15 flex justify-between  items-center gap-8 shadow-navbar pr-12 py-2 z-10">
      <header className="w-full h-10% text-white shadow-md fixed top-0 left-0 z-10 p-4 bg-[#FFFFFF]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="colums-md">
            <img src="/logo.svg" className="w-40 h-auto" />
          </div>

          {/* Navigation Links */}
          <nav className="space-x-8 hidden md:flex">
            <a href="#home" className="text-gray-600 hover:text-blue-600">
              Home
            </a>
            <a href="#about" className="text-gray-600 hover:text-blue-600">
              About
            </a>
            <a href="#services" className="text-gray-600 hover:text-blue-600">
              Services
            </a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600">
              Contact
            </a>
          </nav>

          {/* Button */}
          {/* <div className="hidden md:block">
            <a
              href="#login"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Login
            </a>
          </div> */}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-600 focus:outline-none">
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
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
