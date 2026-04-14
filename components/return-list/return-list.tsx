"use client"

import { useState } from "react"
import * as XLSX from "xlsx"
import {
  Search,
  Calendar,
  Download,
  ChevronRight,
  ChevronLeft,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { returnRecords, type ReturnRecord } from "@/lib/mock-data"
import { ReturnDetailModal } from "./return-detail-modal"

type QuickDate = "today" | "week" | "month" | "3months"
type SortField = "returnDate" | "returnNo" | "store" | "location" | "totalQty" | "totalAmount"
type SortDirection = "asc" | "desc"

const BP_OPTIONS = [
  { value: "C1002", label: "C1002 US Corporation" },
  { value: "C1003", label: "C1003 CA Corporation" },
  { value: "C1004", label: "C1004 JP Corporation" },
]

const STORE_OPTIONS_BY_BP: Record<string, { value: string; label: string }[]> = {
  C1002: [
    { value: "US1001", label: "US1001 / US_STORE_01" },
    { value: "US1002", label: "US1002 / US_STORE_02" },
    { value: "US1003", label: "US1003 / US_STORE_03" },
    { value: "US1004", label: "US1004 / US_ONLINE" },
  ],
  C1003: [
    { value: "CA1001", label: "CA1001 / CA_STORE_01" },
    { value: "CA1002", label: "CA1002 / CA_STORE_02" },
  ],
  C1004: [
    { value: "JP1001", label: "JP1001 / JP_STORE_01" },
    { value: "JP1002", label: "JP1002 / JP_STORE_02" },
  ],
}

const TYPE_OPTIONS = [
  { value: "REFUND", label: "Refund" },
  { value: "EXCHANGE", label: "Exchange" },
  { value: "FORCE_REFUND", label: "Force Refund" },
]

const formatDate = (date: Date) => date.toISOString().split("T")[0]
const today = new Date()
const thirtyDaysAgo = new Date(today)
thirtyDaysAgo.setDate(today.getDate() - 30)

function MultiSelectPopover({
  label,
  options,
  selected,
  onToggle,
  onToggleAll,
  disabled = false,
}: {
  label: string
  options: { value: string; label: string }[]
  selected: string[]
  onToggle: (value: string) => void
  onToggleAll: () => void
  disabled?: boolean
}) {
  return (
    <div>
      <label className="block text-[10px] font-medium text-foreground mb-1.5">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className="w-full justify-between bg-background border-border font-normal disabled:opacity-50 disabled:cursor-not-allowed !h-8 text-[10px]"
          >
            {selected.length === 0
              ? "All"
              : selected.length === options.length
              ? "All Selected"
              : `${selected.length} selected`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[160px] p-2" align="start">
          <div className="space-y-1">
            <div
              className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer"
              onClick={onToggleAll}
            >
              <Checkbox
                checked={options.length > 0 && selected.length === options.length}
              />
              <span className="text-[10px] font-medium">Select All</span>
            </div>
            <div className="border-t my-1" />
            {options.map((opt) => (
              <div
                key={opt.value}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer"
                onClick={() => onToggle(opt.value)}
              >
                <Checkbox checked={selected.includes(opt.value)} />
                <span className="text-[10px]">{opt.label}</span>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export function ReturnList() {
  const [quickDate, setQuickDate] = useState<QuickDate | null>(null)
  const [startDate, setStartDate] = useState(formatDate(thirtyDaysAgo))
  const [endDate, setEndDate] = useState(formatDate(today))

  const handleQuickDate = (key: QuickDate) => {
    setQuickDate(key)
    const now = new Date()
    const end = formatDate(now)
    setEndDate(end)
    switch (key) {
      case "today":
        setStartDate(end)
        break
      case "week": {
        const d = new Date(now)
        d.setDate(d.getDate() - 7)
        setStartDate(formatDate(d))
        break
      }
      case "month": {
        const d = new Date(now)
        d.setDate(d.getDate() - 30)
        setStartDate(formatDate(d))
        break
      }
      case "3months": {
        const d = new Date(now)
        d.setDate(d.getDate() - 90)
        setStartDate(formatDate(d))
        break
      }
    }
  }

  const [sortField, setSortField] = useState<SortField>("returnDate")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [searchText, setSearchText] = useState("")

  const [selectedBP, setSelectedBP] = useState<string>("")
  const [selectedStores, setSelectedStores] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState<string>("all")
  const [detailRecord, setDetailRecord] = useState<ReturnRecord | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const [appliedFilters, setAppliedFilters] = useState({
    bp: "",
    stores: [] as string[],
    types: [] as string[],
    currency: "all",
    startDate: formatDate(thirtyDaysAgo),
    endDate: formatDate(today),
    searchText: "",
  })

  const handleSearch = () => {
    setAppliedFilters({
      bp: selectedBP,
      stores: selectedStores,
      types: selectedTypes,
      currency: selectedCurrency,
      startDate,
      endDate,
      searchText,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  const currentStoreOptions = selectedBP ? (STORE_OPTIONS_BY_BP[selectedBP] ?? []) : []

  const handleBPChange = (value: string) => {
    setSelectedBP(value)
    setSelectedStores([])
  }

  const toggleInList = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value]

  const toggleAll = (list: string[], options: { value: string }[]) =>
    list.length === options.length ? [] : options.map((o) => o.value)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 ml-1 text-muted-foreground" />
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3 ml-1 text-primary" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1 text-primary" />
    )
  }

  const handleExcelDownload = () => {
    const rows: Record<string, string | number>[] = []

    sortedRecords.forEach((record) => {
      record.products.forEach((product) => {
        const itemTotal = product.qty * product.unitPrice
        const itemNet = Math.round(itemTotal / 1.1 * 100) / 100
        const itemVat = Math.round((itemTotal - itemNet) * 100) / 100
        rows.push({
          "Refund Date": record.returnDate,
          "Type": record.returnType,
          "Return No.": record.returnNo,
          "Original Order": record.originalOrderNo,
          "Store": `${record.storeCode} / ${record.storeName}`,
          "Location": `${record.locationCode} / ${record.locationName}`,
          "Currency": record.currency,
          "Product Code": product.productCode,
          "Product Name": product.productName,
          "Qty": -product.qty,
          "Unit Price": product.unitPrice,
          "Total Price": -itemTotal,
          "Net Sales": -itemNet,
          "VAT": -itemVat,
        })
      })
    })

    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Returns")
    XLSX.writeFile(wb, `returns_${new Date().toISOString().split("T")[0]}.xlsx`)
  }

  const filteredRecords = returnRecords.filter((record) => {
    if (appliedFilters.bp && record.bpCode !== appliedFilters.bp) return false
    if (appliedFilters.stores.length > 0 && !appliedFilters.stores.includes(record.storeCode)) return false
    if (appliedFilters.types.length > 0 && !appliedFilters.types.includes(record.returnType)) return false
    if (appliedFilters.currency !== "all" && record.currency !== appliedFilters.currency) return false

    const recordDate = record.returnDate.split(" ")[0]
    if (appliedFilters.startDate && recordDate < appliedFilters.startDate) return false
    if (appliedFilters.endDate && recordDate > appliedFilters.endDate) return false

    if (appliedFilters.searchText.length >= 2) {
      const q = appliedFilters.searchText.toLowerCase()
      const match =
        record.returnNo.toLowerCase().includes(q) ||
        record.originalOrderNo.toLowerCase().includes(q) ||
        record.storeCode.toLowerCase().includes(q) ||
        record.storeName.toLowerCase().includes(q)
      if (!match) return false
    }

    return true
  })

  const getReturnTotal = (r: typeof filteredRecords[0]) =>
    r.products.reduce((s, p) => s + p.qty * p.unitPrice, 0)
  const getReturnQty = (r: typeof filteredRecords[0]) =>
    r.products.reduce((s, p) => s + p.qty, 0)

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    let comparison = 0
    switch (sortField) {
      case "returnDate":
        comparison = new Date(a.returnDate.split(" ")[0]).getTime() - new Date(b.returnDate.split(" ")[0]).getTime()
        break
      case "returnNo":
        comparison = a.returnNo.localeCompare(b.returnNo)
        break
      case "totalQty":
        comparison = getReturnQty(a) - getReturnQty(b)
        break
      case "store":
        comparison = a.storeCode.localeCompare(b.storeCode)
        break
      case "location":
        comparison = a.locationCode.localeCompare(b.locationCode)
        break
      case "totalAmount":
        comparison = getReturnTotal(a) - getReturnTotal(b)
        break
    }
    return sortDirection === "asc" ? comparison : -comparison
  })

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[10px]">
        <span className="text-muted-foreground">Order</span>
        <ChevronRight className="h-3 w-3 text-muted-foreground" />
        <span className="text-primary font-medium">Return List</span>
      </nav>

      {/* Page Title */}
      <div>
        <h1 className="text-lg font-extrabold">Return List</h1>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          View and search all return and refund information.
        </p>
      </div>

      {/* Filter Section */}
      <div className="bg-card rounded-xl border border-border p-4">
        {/* Row 1 - Dropdowns */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="w-[160px]">
            <label className="block text-[10px] font-medium text-foreground mb-1.5">BP</label>
            <Select value={selectedBP} onValueChange={handleBPChange}>
              <SelectTrigger className="w-full bg-background border-border !h-8 text-[10px]">
                <SelectValue placeholder="Select BP" />
              </SelectTrigger>
              <SelectContent>
                {BP_OPTIONS.map((bp) => (
                  <SelectItem key={bp.value} value={bp.value} className="text-[10px]">
                    {bp.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-[160px]">
            <MultiSelectPopover
              label="Store"
              options={currentStoreOptions}
              selected={selectedStores}
              onToggle={(v) => setSelectedStores(toggleInList(selectedStores, v))}
              onToggleAll={() => setSelectedStores(toggleAll(selectedStores, currentStoreOptions))}
              disabled={!selectedBP}
            />
          </div>

          <div className="w-[160px]">
            <MultiSelectPopover
              label="Refund Type"
              options={TYPE_OPTIONS}
              selected={selectedTypes}
              onToggle={(v) => setSelectedTypes(toggleInList(selectedTypes, v))}
              onToggleAll={() => setSelectedTypes(toggleAll(selectedTypes, TYPE_OPTIONS))}
            />
          </div>

          <div className="w-[160px]">
            <label className="block text-[10px] font-medium text-foreground mb-1.5">Currency</label>
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger className="w-full bg-background border-border !h-8 text-[10px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-[10px]">All</SelectItem>
                <SelectItem value="USD" className="text-[10px]">USD</SelectItem>
                <SelectItem value="CAD" className="text-[10px]">CAD</SelectItem>
                <SelectItem value="JPY" className="text-[10px]">JPY</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 2 - Date Range */}
        <div className="mb-4">
          <label className="block text-[10px] font-medium text-foreground mb-1.5">Refund Date</label>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none z-10" />
              <Input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setQuickDate(null) }}
                className="w-36 pl-8 bg-background border-border h-7 !text-[10px] [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-datetime-edit]:text-[10px]"
              />
            </div>
            <span className="text-[10px] text-muted-foreground">~</span>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none z-10" />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setQuickDate(null) }}
                className="w-36 pl-8 bg-background border-border h-7 !text-[10px] [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-datetime-edit]:text-[10px]"
              />
            </div>
            <div className="flex gap-1.5 ml-1">
              {[
                { key: "today", label: "Today" },
                { key: "week", label: "1 Week" },
                { key: "month", label: "1 Month" },
                { key: "3months", label: "3 Months" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleQuickDate(item.key as QuickDate)}
                  className={`px-3 py-1.5 text-[10px] font-medium rounded-md border transition-all ${
                    quickDate === item.key
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:border-primary/50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3 - Search */}
        <div className="flex items-end justify-between gap-3">
          <div className="flex-1">
            <label className="block text-[10px] text-muted-foreground mb-1">
              Return No., Original Order No., Store Code, Store Name
            </label>
            <Input
              placeholder="Enter at least 2 characters"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-background border-border h-7 !text-[10px] placeholder:text-[10px]"
            />
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 px-4 h-7 text-[10px]" onClick={handleSearch}>
            <Search className="h-3.5 w-3.5" />
            Search
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-card rounded-lg border border-border">
        {/* Summary & Actions */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground">Total</span>
            <span className="text-[10px] font-bold">{sortedRecords.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-1.5 border-border bg-background hover:bg-muted h-7 text-[10px] px-3" onClick={handleExcelDownload}>
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table className="table-fixed">
          <TableHeader>
            <TableRow className="bg-muted/50 h-12 text-[10px]">
              <TableHead className="text-center">
                <button
                  onClick={() => handleSort("returnDate")}
                  className="flex items-center justify-center w-full hover:text-primary transition-colors"
                >
                  Refund Date
                  {getSortIcon("returnDate")}
                </button>
              </TableHead>
              <TableHead className="text-center">Refund Type</TableHead>
              <TableHead className="text-center">
                <button
                  onClick={() => handleSort("returnNo")}
                  className="flex items-center justify-center w-full hover:text-primary transition-colors"
                >
                  Return No. #
                  {getSortIcon("returnNo")}
                </button>
              </TableHead>
              <TableHead className="text-center">Original Order</TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("store")}
                  className="flex items-center w-full hover:text-primary transition-colors"
                >
                  Store
                  {getSortIcon("store")}
                </button>
                <span className="text-[10px] text-muted-foreground">(Code / Name)</span>
              </TableHead>
              <TableHead className="text-center">Currency</TableHead>
              <TableHead className="text-center">
                <button
                  onClick={() => handleSort("totalQty")}
                  className="flex items-center justify-center w-full hover:text-primary transition-colors"
                >
                  Total Qty
                  {getSortIcon("totalQty")}
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button
                  onClick={() => handleSort("totalAmount")}
                  className="flex items-center justify-end w-full hover:text-primary transition-colors"
                >
                  Total Price
                  {getSortIcon("totalAmount")}
                </button>
              </TableHead>
              <TableHead className="text-right">Net Sales</TableHead>
              <TableHead className="text-right">VAT</TableHead>

            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRecords.map((record) => {
              const typeStyles: Record<string, string> = {
                "REFUND": "bg-[oklch(0.95_0.02_230)] text-[oklch(0.45_0.03_230)] border-[oklch(0.90_0.02_230)]",
                "EXCHANGE": "bg-[oklch(0.95_0.02_155)] text-[oklch(0.45_0.03_155)] border-[oklch(0.90_0.02_155)]",
                "FORCE_REFUND": "bg-[oklch(0.95_0.02_15)] text-[oklch(0.45_0.03_15)] border-[oklch(0.90_0.02_15)]",
              }
              const typeLabels: Record<string, string> = {
                "REFUND": "Refund",
                "EXCHANGE": "Exchange",
                "FORCE_REFUND": "Force Refund",
              }
              const returnTotal = getReturnTotal(record)
              const returnQty = getReturnQty(record)
              const fmtRaw = (v: number) =>
                record.currency === "JPY"
                  ? v.toLocaleString()
                  : v % 1 === 0 ? v.toLocaleString() : v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              const fmt = (v: number) => `-${fmtRaw(v)}`

              return (
                <TableRow key={record.id} className="h-10">
                  <TableCell className="text-center text-[10px]">{record.returnDate}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={`px-2 py-0.5 text-[10px] font-medium ${typeStyles[record.returnType] || ""}`}
                    >
                      {typeLabels[record.returnType] || record.returnType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      className="font-bold text-[10px] text-primary underline cursor-pointer hover:text-primary/80 transition-colors"
                      onClick={() => { setDetailRecord(record); setDetailOpen(true) }}
                    >
                      {record.returnNo}
                    </button>
                  </TableCell>
                  <TableCell className="text-center text-[10px]">{record.originalOrderNo}</TableCell>
                  <TableCell className="text-[10px]">{record.storeCode} / {record.storeName}</TableCell>
                  <TableCell className="text-center text-[10px]">{record.currency}</TableCell>
                  <TableCell className="text-center text-[10px]">-{returnQty.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-[10px] font-medium">{fmt(returnTotal)}</TableCell>
                  <TableCell className="text-right text-[10px]">{fmt(Math.round(returnTotal / 1.1 * 100) / 100)}</TableCell>
                  <TableCell className="text-right text-[10px]">{fmt(Math.round((returnTotal - Math.round(returnTotal / 1.1 * 100) / 100) * 100) / 100)}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-3 px-4 py-2.5 border-t border-border">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground">Rows per page:</span>
            <Select defaultValue="30">
              <SelectTrigger className="w-16 h-6 text-[10px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10" className="text-[10px]">10</SelectItem>
                <SelectItem value="30" className="text-[10px]">30</SelectItem>
                <SelectItem value="50" className="text-[10px]">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <span className="text-[10px] text-muted-foreground">1-{sortedRecords.length} of {sortedRecords.length}</span>
          <div className="flex items-center gap-0.5">
            <Button variant="ghost" size="icon" className="h-6 w-6" disabled>
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      <ReturnDetailModal
        returnRecord={detailRecord}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}
