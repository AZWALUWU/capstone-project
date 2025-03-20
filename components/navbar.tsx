"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, Heart } from "lucide-react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  // Simplified navigation links
  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/blog", label: "Blog" },
    { href: "/diagnosis", label: "Diagnosis" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left side: Navigation links */}
          <div className="flex items-center space-x-6">
            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side: Logo and buttons */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle button */}
            <ThemeToggle />

            {/* Login/Register button */}
            <Link href="/login">
              <Button variant="outline" size="sm">
                Masuk / Daftar
              </Button>
            </Link>

            {/* Logo on the right */}
            <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
              <span className="text-xl font-bold text-primary">Sehatica</span>
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                <Heart className="h-4 w-4 text-primary" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

