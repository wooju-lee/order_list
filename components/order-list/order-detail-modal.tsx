"use client"

import { ShoppingCart, Package, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import type { OrderRecord } from "@/lib/mock-data"

interface OrderDetailModalProps {
  order: OrderRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusStyles: Record<string, string> = {
  "Pending": "bg-[oklch(0.95_0.02_55)] text-[oklch(0.45_0.03_55)] border-[oklch(0.90_0.02_55)]",
  "Confirmed": "bg-[oklch(0.95_0.02_155)] text-[oklch(0.45_0.03_155)] border-[oklch(0.90_0.02_155)]",
  "Fulfilled": "bg-[oklch(0.95_0.02_230)] text-[oklch(0.45_0.03_230)] border-[oklch(0.90_0.02_230)]",
  "Completed": "bg-[oklch(0.95_0.02_280)] text-[oklch(0.45_0.03_280)] border-[oklch(0.90_0.02_280)]",
  "Canceled": "bg-[oklch(0.95_0.02_0)] text-[oklch(0.45_0.03_0)] border-[oklch(0.90_0.02_0)]",
}

export function OrderDetailModal({ order, open, onOpenChange }: OrderDetailModalProps) {
  if (!order) return null

  const fmt = (v: number) =>
    order.currency === "JPY"
      ? v.toLocaleString()
      : v % 1 === 0 ? v.toLocaleString() : v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const isPackage = (code: string) => code.startsWith("99")
  const totalQty = order.products.filter(p => !isPackage(p.productCode)).reduce((s, p) => s + p.qty, 0)
  const totalCancelQty = order.products.filter(p => !isPackage(p.productCode)).reduce((s, p) => s + (p.cancelQty || 0), 0)
  const totalAmount = order.products.reduce((s, p) => s + p.qty * p.unitPrice, 0)
  const netSales = Math.round(totalAmount / 1.1 * 100) / 100
  const vat = Math.round((totalAmount - netSales) * 100) / 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-5 pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <DialogTitle className="text-sm font-bold">{order.orderNo}</DialogTitle>
            <Badge variant="outline" className={`px-2 py-0.5 text-[10px] font-medium ${statusStyles[order.orderStatus] || ""}`}>
              {order.orderStatus}
            </Badge>
          </div>
        </DialogHeader>

        {/* Order Info */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-1.5 mb-3">
            <ShoppingCart className="h-3.5 w-3.5 text-primary" />
            <h3 className="text-[11px] font-semibold">Order Information</h3>
          </div>
          <div className="grid grid-cols-4 gap-x-6 gap-y-2.5">
            <div>
              <p className="text-[9px] text-muted-foreground">Order Date</p>
              <p className="text-[10px] font-medium mt-0.5">{order.orderDate}</p>
            </div>
            <div>
              <p className="text-[9px] text-muted-foreground">Store</p>
              <p className="text-[10px] font-medium mt-0.5">{order.storeCode} / {order.storeName}</p>
            </div>
            <div>
              <p className="text-[9px] text-muted-foreground">Location</p>
              <p className="text-[10px] font-medium mt-0.5">{order.locationCode} / {order.locationName}</p>
            </div>
            <div>
              <p className="text-[9px] text-muted-foreground">Currency</p>
              <p className="text-[10px] font-medium mt-0.5">{order.currency}</p>
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="px-6 pb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5 text-primary" />
              <h3 className="text-[11px] font-semibold">Product List</h3>
            </div>
            <Badge variant="secondary" className="text-[9px]">{order.products.length} items</Badge>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <colgroup>
                <col className="w-[36%]" />
                <col className="w-[7%]" />
                <col className="w-[9%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
              </colgroup>
              <thead>
                <tr className="bg-muted/50 h-8 text-[10px] text-foreground font-medium">
                  <th className="text-left pl-4 py-2">Product Info (Code / Name / Barcode)</th>
                  <th className="text-center py-2">Qty</th>
                  <th className="text-center py-2">Cancel Qty</th>
                  <th className="text-right py-2 pr-3">Unit Price</th>
                  <th className="text-right py-2 pr-3">Net Sales</th>
                  <th className="text-right py-2 pr-3">VAT</th>
                  <th className="text-right py-2 pr-4">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((product, idx) => {
                  const itemTotal = product.qty * product.unitPrice
                  const itemNet = Math.round(itemTotal / 1.1 * 100) / 100
                  const itemVat = Math.round((itemTotal - itemNet) * 100) / 100
                  return (
                    <tr key={idx} className="h-7 border-t border-border">
                      <td className="text-[10px] pl-4 py-2">{product.productCode} / {product.productName}{product.barcode ? ` / ${product.barcode}` : ""}</td>
                      <td className="text-[10px] text-center py-2">{product.qty}</td>
                      <td className="text-[10px] text-center py-2 text-foreground">{product.cancelQty ? `-${product.cancelQty}` : "-"}</td>
                      <td className="text-[10px] text-right py-2 pr-3">{fmt(product.unitPrice)}</td>
                      <td className="text-[10px] text-right py-2 pr-3">{fmt(itemNet)}</td>
                      <td className="text-[10px] text-right py-2 pr-3">{fmt(itemVat)}</td>
                      <td className="text-[10px] text-right font-medium py-2 pr-4">{fmt(itemTotal)}</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="h-8 border-t border-border bg-muted/30">
                  <td className="text-[10px] font-bold pl-4 py-2">
                    <span className="flex items-center gap-1">
                      Total
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Total quantity excludes package items.</p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </td>
                  <td className="text-[11px] font-extrabold text-center py-2 text-primary">{totalQty.toLocaleString()}</td>
                  <td className="py-2" />
                  <td className="py-2" />
                  <td className="text-[11px] font-extrabold text-right py-2 pr-3 text-primary">{fmt(netSales)}</td>
                  <td className="text-[11px] font-extrabold text-right py-2 pr-3 text-primary">{fmt(vat)}</td>
                  <td className="text-[11px] font-extrabold text-right py-2 pr-4 text-primary">{fmt(totalAmount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
