'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { OrderList } from '@/components/order-list/order-list'
import { OrderDetail } from '@/components/order-list/order-detail'

export default function OrderListPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  return (
    <div className="flex h-screen bg-background">
      <div className="flex flex-1 flex-col overflow-hidden w-full">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          {selectedOrderId ? (
            <OrderDetail
              orderId={selectedOrderId}
              onBack={() => setSelectedOrderId(null)}
            />
          ) : (
            <OrderList onSelectOrder={setSelectedOrderId} />
          )}
        </main>
        <footer className="px-4 py-2 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground bg-card">
          <span>&copy; 2025 IICOMBINED CO., LTD. ALL RIGHTS RESERVED.</span>
          <span>V.1.0.0</span>
        </footer>
      </div>
    </div>
  )
}
