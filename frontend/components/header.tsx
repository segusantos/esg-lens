import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"

export function Header() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <MainNav />
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

