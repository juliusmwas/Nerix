import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative bg-white shadow-sm w-full z-50">
      {/* Main Navbar Container */}
      <div className="flex items-center justify-between h-16 px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex-shrink-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-blue-600">
            Nerix.
          </h1>
        </div>

        {/* Desktop Navlinks (Hidden on Mobile) */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <ul className="flex items-center gap-6">
            {["Features", "How it Works", "Docs", "About", "Scan"].map(
              (link) => (
                <li key={link}>
                  <a
                    className="text-sm text-blue-500 hover:text-blue-600 hover:font-medium transition-colors"
                    href="#"
                  >
                    {link}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Desktop Buttons (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-4">
          <button className="border border-blue-300 rounded-sm py-1.5 px-4 text-sm text-blue-500 cursor-pointer hover:text-white hover:bg-blue-500 transition-all">
            Login
          </button>
          <button className="rounded-sm py-1.5 px-4 text-sm text-white bg-blue-500 cursor-pointer hover:bg-blue-600 transition-all">
            Get Started
          </button>
        </div>

        {/* Hamburger Button (Visible only on Mobile) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-blue-500 hover:text-blue-600 focus:outline-none p-2"
            aria-label="Toggle Menu"
          >
            <svg
              className="h-6 w-6 transition-transform duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                // "X" Close Icon
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                // Hamburger Icon
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white shadow-md transition-all duration-300 ease-in-out origin-top ${
          isOpen
            ? "opacity-100 scale-y-100 visible"
            : "opacity-0 scale-y-0 invisible h-0"
        }`}
      >
        <ul className="flex flex-col p-4 border-t border-gray-100 gap-4">
          {["Features", "How it Works", "Docs", "About", "Scan"].map((link) => (
            <li key={link} className="w-full">
              <a
                className="block text-base text-blue-500 hover:text-blue-600 py-2 border-b border-gray-50/50"
                href="#"
                onClick={() => setIsOpen(false)} // Closes menu when a link is clicked
              >
                {link}
              </a>
            </li>
          ))}
          {/* Mobile Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <button className="w-full border border-blue-300 rounded-sm py-2 text-sm text-blue-500 hover:text-white hover:bg-blue-500 transition-all">
              Login
            </button>
            <button className="w-full rounded-sm py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 transition-all">
              Get Started
            </button>
          </div>
        </ul>
      </div>
    </nav>
  );
}
