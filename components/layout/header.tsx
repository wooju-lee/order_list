"use client"

import { Globe, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  return (
    <header className="flex items-center justify-between h-11 px-5 bg-card border-b border-border">
      <span className="text-sm font-bold tracking-tight">IIC_BO</span>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-1.5 text-[9px] h-7 px-2">
              <Globe className="h-3 w-3" />
              Language
              <span className="font-semibold">Korean</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-[9px]">Korean</DropdownMenuItem>
            <DropdownMenuItem className="text-[9px]">English</DropdownMenuItem>
            <DropdownMenuItem className="text-[9px]">Japanese</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 h-7 px-3 text-[9px]">
              <span className="font-semibold">Monster1437</span>
              <span className="text-[8px] opacity-80">(Super_Admin)</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-[9px]">Profile Settings</DropdownMenuItem>
            <DropdownMenuItem className="text-[9px]">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
