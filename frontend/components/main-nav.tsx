"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"

export function MainNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "Panel principal" },
    { href: "/compare", label: "Comparar informes" },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/" className="flex items-center mr-6">
        <Logo className="mr-2" />
        <span className="font-bold text-lg">ESG Lens</span>
      </Link>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href ? "text-indigo-600 font-semibold" : "text-muted-foreground",
          )}
        >
          {item.label}
        </Link>
      ))}
      <Link
        href="/upload"
        className={cn(
          "text-sm font-medium transition-colors ml-auto rounded-full px-4 py-2",
          pathname === "/upload"
            ? "bg-indigo-600 text-white"
            : "bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
        )}
      >
        Subir informe
      </Link>
    </nav>
  )
}

