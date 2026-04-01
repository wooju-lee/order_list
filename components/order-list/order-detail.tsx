"use client"

import { useState } from "react"
import { ArrowLeft, ShoppingCart, ClipboardList, ChevronLeft, ChevronRight, User, CreditCard, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { orderDetails } from "@/lib/mock-data"

interface OrderDetailProps {
  orderId: string
  onBack: () => void
}

export function OrderDetail({ orderId, onBack }: OrderDetailProps) {
  const detail = orderDetails[orderId]
  const [rowsPerPage, setRowsPerPage] = useState(30)
  const [currentPage, setCurrentPage] = useState(1)

  if (!detail) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <p className="text-muted-foreground">Order not found.</p>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-3.5 w-3.5" />
          Back to List
        </Button>
      </div>
    )
  }

  const { order, items } = detail

  const totalRows = items.length
  const totalPages = Math.ceil(totalRows / rowsPerPage)
  const startIdx = (currentPage - 1) * rowsPerPage
  const paginatedItems = items.slice(startIdx, startIdx + rowsPerPage)

  const statusStyles: Record<string, string> = {
    "Pending": "bg-[oklch(0.93_0.05_55)] text-[oklch(0.42_0.09_50)] border-[oklch(0.86_0.06_55)]",
    "Confirmed": "bg-[oklch(0.94_0.04_85)] text-[oklch(0.45_0.08_75)] border-[oklch(0.88_0.05_85)]",
    "Processing": "bg-[oklch(0.93_0.04_210)] text-[oklch(0.38_0.07_205)] border-[oklch(0.85_0.05_210)]",
    "Shipped": "bg-[oklch(0.93_0.04_160)] text-[oklch(0.40_0.07_155)] border-[oklch(0.86_0.05_160)]",
    "Delivered": "bg-[oklch(0.92_0.04_145)] text-[oklch(0.38_0.08_140)] border-[oklch(0.85_0.05_145)]",
    "Canceled": "bg-[oklch(0.95_0.01_0)] text-[oklch(0.48_0.02_0)] border-[oklch(0.88_0.015_0)]",
    "Returned": "bg-[oklch(0.94_0.04_25)] text-[oklch(0.45_0.09_20)] border-[oklch(0.87_0.05_25)]",
  }

  const formatAmount = (amount: number, currency: string) => {
    if (currency === "JPY") return `¥${amount.toLocaleString()}`
    if (currency === "CAD") return `C$${amount.toFixed(2)}`
    return `$${amount.toFixed(2)}`
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-6 w-6">
          <ArrowLeft className="h-3.5 w-3.5" />
        </Button>
        <h1 className="text-sm font-bold">{order.orderNo}</h1>
        <Badge variant="outline" className={`px-2 py-0.5 text-xs font-medium ${statusStyles[order.orderStatus] || ""}`}>
          {order.orderStatus}
        </Badge>
        <Badge
          variant="outline"
          className={`text-xs px-2 py-0.5 ${
            order.orderType === "RX"
              ? "bg-[oklch(0.93_0.04_210)] text-[oklch(0.40_0.07_205)] border-[oklch(0.86_0.05_210)]"
              : order.orderType === "Pre-Order"
              ? "bg-[oklch(0.93_0.04_160)] text-[oklch(0.40_0.07_155)] border-[oklch(0.86_0.05_160)]"
              : "bg-[oklch(0.93_0.05_55)] text-[oklch(0.42_0.09_50)] border-[oklch(0.86_0.06_55)]"
          }`}
        >
          {order.orderType}
        </Badge>
      </div>

      {/* Order Info Cards */}
      <div className="grid grid-cols-3 gap-3">
        {/* Order Info */}
        <div className="bg-card rounded-lg border border-border p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <ShoppingCart className="h-3 w-3 text-primary" />
            <h2 className="text-[10px] font-semibold">Order Information</h2>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-[9px] text-muted-foreground">Order Date</p>
              <p className="mt-0.5 text-[10px] font-medium">{order.orderDate}</p>
            </div>
            <div>
              <p className="text-[9px] text-muted-foreground">Store</p>
              <p className="mt-0.5 text-[10px] font-medium">{order.storeCode} / {order.storeName}</p>
            </div>
            <div>
              <p className="text-[9px] text-muted-foreground">Total Amount</p>
              <p className="mt-0.5 text-[10px] font-bold text-primary">
                {formatAmount(order.totalAmount, order.currency)}
              </p>
            </div>
            <div>
              <p className="text-[9px] text-muted-foreground">Created By</p>
              <p className="mt-0.5 text-[10px] font-medium">{order.createdBy}</p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-card rounded-lg border border-border p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <User className="h-3 w-3 text-primary" />
            <h2 className="text-[10px] font-semibold">Customer Information</h2>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-[9px] text-muted-foreground">Customer Name</p>
              <p className="mt-0.5 text-[10px] font-medium">{order.customerName}</p>
            </div>
            <div>
              <p className="text-[9px] text-muted-foreground">Email</p>
              <p className="mt-0.5 text-[10px] font-medium">{order.customerEmail}</p>
            </div>
            <div>
              <p className="text-[9px] text-muted-foreground">BP</p>
              <p className="mt-0.5 text-[10px] font-medium">{order.bpCode} / {order.bpName}</p>
            </div>
          </div>
        </div>

        {/* Payment & Shipping */}
        <div className="bg-card rounded-lg border border-border p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <CreditCard className="h-3 w-3 text-primary" />
            <h2 className="text-[10px] font-semibold">Payment & Shipping</h2>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-[9px] text-muted-foreground">Payment Method</p>
              <p className="mt-0.5 text-[10px] font-medium">{order.paymentMethod}</p>
            </div>
            <div>
              <p className="text-[9px] text-muted-foreground">Shipping Method</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Truck className="h-3 w-3 text-muted-foreground" />
                <p className="text-[10px] font-medium">{order.shippingMethod}</p>
              </div>
            </div>
            <div>
              <p className="text-[9px] text-muted-foreground">Request Date</p>
              <p className="mt-0.5 text-[10px] font-medium">{order.requestDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Item List */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-3 py-2 bg-muted/30">
          <div className="flex items-center gap-1.5">
            <ClipboardList className="h-3 w-3 text-primary" />
            <h2 className="text-[10px] font-semibold">Item List</h2>
          </div>
          <Badge variant="secondary" className="text-[9px]">{items.length} items</Badge>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 h-8 text-[9px]">
              <TableHead className="pl-6">Item Code</TableHead>
              <TableHead className="pl-6">Item Name</TableHead>
              <TableHead className="pl-6">Category</TableHead>
              <TableHead className="pl-6">Subcategory</TableHead>
              <TableHead className="pl-6">Color</TableHead>
              <TableHead className="pl-6">Size</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead className="text-right pr-6">Unit Price</TableHead>
              <TableHead className="text-right pr-6">Total Price</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((item, idx) => (
              <TableRow key={`${item.itemCode}-${idx}`} className="h-8">
                <TableCell className="text-[10px] font-medium text-primary pl-6">{item.itemCode}</TableCell>
                <TableCell className="text-[10px] pl-6">{item.itemName}</TableCell>
                <TableCell className="text-[10px] pl-6">{item.category}</TableCell>
                <TableCell className="text-[10px] pl-6">{item.subcategory}</TableCell>
                <TableCell className="text-[10px] pl-6">{item.color}</TableCell>
                <TableCell className="text-[10px] pl-6">{item.size}</TableCell>
                <TableCell className="text-[10px] text-center">{item.quantity}</TableCell>
                <TableCell className="text-[10px] text-right pr-6">
                  {formatAmount(item.unitPrice, order.currency)}
                </TableCell>
                <TableCell className="text-[10px] text-right font-medium pr-6">
                  {formatAmount(item.totalPrice, order.currency)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={`text-[9px] px-1.5 py-0 ${
                      item.status === "Active"
                        ? "bg-[oklch(0.93_0.04_160)] text-[oklch(0.40_0.07_155)] border-[oklch(0.86_0.05_160)]"
                        : item.status === "Canceled"
                        ? "bg-[oklch(0.95_0.01_0)] text-[oklch(0.48_0.02_0)] border-[oklch(0.88_0.015_0)]"
                        : "bg-[oklch(0.94_0.04_25)] text-[oklch(0.45_0.09_20)] border-[oklch(0.87_0.05_25)]"
                    }`}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-3 px-3 py-2 border-t border-border">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-muted-foreground">Rows per page:</span>
            <Select value={String(rowsPerPage)} onValueChange={(v) => { setRowsPerPage(Number(v)); setCurrentPage(1) }}>
              <SelectTrigger className="w-14 h-5 text-[9px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10" className="text-[9px]">10</SelectItem>
                <SelectItem value="30" className="text-[9px]">30</SelectItem>
                <SelectItem value="50" className="text-[9px]">50</SelectItem>
                <SelectItem value="100" className="text-[9px]">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <span className="text-[9px] text-muted-foreground">
            {startIdx + 1}-{Math.min(startIdx + rowsPerPage, totalRows)} of {totalRows}
          </span>
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
