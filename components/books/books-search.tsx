"use client"

import React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, X } from "lucide-react"

interface BooksSearchProps {
  categories: string[]
}

export function BooksSearch({ categories }: BooksSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const category = searchParams.get("category") || "all"

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newParams = new URLSearchParams(searchParams.toString())
      
      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === "" || value === "all") {
          newParams.delete(key)
        } else {
          newParams.set(key, value)
        }
      }
      
      return newParams.toString()
    },
    [searchParams]
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const query = createQueryString({ search })
    router.push(`/books${query ? `?${query}` : ""}`)
  }

  const handleCategoryChange = (value: string) => {
    const query = createQueryString({ category: value })
    router.push(`/books${query ? `?${query}` : ""}`)
  }

  const clearFilters = () => {
    setSearch("")
    router.push("/books")
  }

  const hasFilters = searchParams.get("search") || searchParams.get("category")

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
      <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
        <div className="relative flex-1 md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <Select value={category} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  )
}
