'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { OrderList } from '@/components/order-list/order-list'
import { ReturnList } from '@/components/return-list/return-list'

export default function OrderListPage() {
  const [activeMenu, setActiveMenu] = useState("Order List")

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <Header />
          <main className="flex-1 overflow-y-auto p-4">
            {activeMenu === "Order List" && <OrderList />}
            {activeMenu === "Return List" && <ReturnList />}
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
