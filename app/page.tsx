'use client'

import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { OrderList } from '@/components/order-list/order-list'

export default function OrderListPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden w-full">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <OrderList />
        </main>
        <footer className="px-4 py-2 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground bg-card">
          <span>&copy; 2025 IICOMBINED CO., LTD. ALL RIGHTS RESERVED.</span>
          <span>V.1.0.0</span>
        </footer>
      </div>
    </div>
  )
}
