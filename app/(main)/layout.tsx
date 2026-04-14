'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'

const MENU_ROUTES: Record<string, string> = {
  "Order List": "/",
  "Refund List": "/returns",
}

const ROUTE_MENUS: Record<string, string> = Object.fromEntries(
  Object.entries(MENU_ROUTES).map(([k, v]) => [v, k])
)

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const activeMenu = ROUTE_MENUS[pathname] || "Order List"

  const handleMenuChange = (menu: string) => {
    const route = MENU_ROUTES[menu]
    if (route) router.push(route)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeMenu={activeMenu} onMenuChange={handleMenuChange} />
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <Header />
          <main className="flex-1 overflow-y-auto p-4">
            {children}
          </main>
        </div>
      </div>
      <footer className="px-4 py-2 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground bg-card shrink-0">
        <span>&copy; 2025 IICOMBINED CO., LTD. ALL RIGHTS RESERVED.</span>
        <span>V.1.0.0</span>
      </footer>
    </div>
  )
}
