"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import Image from "next/image"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-primary shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Image
            src="/placeholder.svg?height=40&width=40"
            alt="Dhamrai Puja Logo"
            width={40}
            height={40}
            className="rounded-full bg-white p-1"
          />
          <h1 className="text-lg font-bold text-white md:text-xl">Dhamrai Puja Committee</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="text-white/90 transition hover:text-white">
                Records
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="text-white/90 transition hover:text-white">
                Dashboard
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button className="text-white md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-white/10 bg-primary md:hidden">
          <nav className="container mx-auto p-4">
            <ul className="flex flex-col space-y-3">
              <li>
                <Link
                  href="/"
                  className="block text-white/90 transition hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Records
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="block text-white/90 transition hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}

