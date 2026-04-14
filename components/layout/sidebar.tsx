"use client"

import { useState } from "react"
import {
  Building2,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  ClipboardList,
  ExternalLink,
} from "lucide-react"

interface MenuItem {
  label: string
  icon: React.ReactNode
  children?: { label: string; active?: boolean }[]
}

const menuItems: MenuItem[] = [
  {
    label: "Master Information",
    icon: <Building2 className="h-4 w-4" />,
    children: [
      { label: "BP Management" },
      { label: "Store Management" },
      { label: "Product Management" },
    ],
  },
  {
    label: "Sales",
    icon: <ShoppingCart className="h-4 w-4" />,
    children: [
      { label: "Sales Dashboard" },
      { label: "Sales History" },
    ],
  },
  {
    label: "Order",
    icon: <ClipboardList className="h-4 w-4" />,
    children: [
      { label: "Order List" },
      { label: "Return List" },
    ],
  },
  {
    label: "Inventory",
    icon: <Package className="h-4 w-4" />,
    children: [
      { label: "Stock Management" },
      { label: "Transfer" },
    ],
  },
  {
    label: "Global Report",
    icon: <BarChart3 className="h-4 w-4" />,
    children: [
      { label: "Sales Report" },
      { label: "Inventory Report" },
    ],
  },
  {
    label: "System Setting",
    icon: <Settings className="h-4 w-4" />,
    children: [
      { label: "User Management" },
      { label: "Role Management" },
    ],
  },
]

interface SidebarProps {
  activeMenu: string
  onMenuChange: (menu: string) => void
}

export function Sidebar({ activeMenu, onMenuChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Order"])
  const alwaysExpanded = ["Order"]
  const [expandedSubMenus, setExpandedSubMenus] = useState<string[]>([])

  const toggleMenu = (label: string) => {
    if (alwaysExpanded.includes(label)) return
    setExpandedMenus((prev) =>
      prev.includes(label) ? prev.filter((m) => m !== label) : [...prev, label]
    )
  }

  const toggleSubMenu = (label: string) => {
    setExpandedSubMenus((prev) =>
      prev.includes(label) ? prev.filter((m) => m !== label) : [...prev, label]
    )
  }

  if (collapsed) {
    return (
      <aside className="w-12 bg-card border-r border-border flex flex-col items-center py-3 shrink-0">
        <button onClick={() => setCollapsed(false)} className="mb-4 p-1 hover:bg-muted rounded">
          <PanelLeft className="h-4 w-4 text-muted-foreground" />
        </button>
        {menuItems.map((item) => (
          <div key={item.label} className="mb-2 p-1.5 rounded hover:bg-muted cursor-pointer" title={item.label}>
            {item.icon}
          </div>
        ))}
      </aside>
    )
  }

  return (
    <aside className="w-48 bg-card flex flex-col shrink-0">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-11 px-3 border-b border-border">
        <div className="flex items-center gap-2">
          <button onClick={() => setCollapsed(true)} className="p-0.5 hover:bg-muted rounded">
            <PanelLeftClose className="h-4 w-4 text-muted-foreground" />
          </button>
          <span className="text-sm font-bold">IIC_BO</span>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {menuItems.map((item) => {
          const isExpanded = expandedMenus.includes(item.label)
          return (
            <div key={item.label} className="mb-0.5">
              <button
                onClick={() => toggleMenu(item.label)}
                className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-muted transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span className="text-[11px] font-semibold">{item.label}</span>
                </div>
                {item.children && (
                  <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${isExpanded ? "" : "-rotate-90"}`} />
                )}
              </button>

              {isExpanded && item.children && (
                <div className="ml-4 mt-0.5">
                  {item.children.map((child) => (
                    <div
                      key={child.label}
                      onClick={() => onMenuChange(child.label)}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                        activeMenu === child.label
                          ? "bg-primary/10 text-primary font-semibold"
                          : "hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      <ChevronRight className="h-2.5 w-2.5" />
                      <span className="text-[10px]">{child.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Bottom Button */}
      <div className="p-3 flex justify-end">
        <button className="flex items-center justify-center gap-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-2.5 py-2.5 text-[9px] font-semibold transition-colors">
          Front POS
          <ExternalLink className="h-2.5 w-2.5" />
        </button>
      </div>
    </aside>
  )
}
