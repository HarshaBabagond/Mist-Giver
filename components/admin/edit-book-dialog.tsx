"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"

interface Book {
  id: string
  title: string
  author: string
  category: string
  description: string | null
  book_url: string
  cover_url: string | null
}

interface EditBookDialogProps {
  book: Book
  onClose: () => void
}

export function EditBookDialog({ book, onClose }: EditBookDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    const { error: updateError } = await supabase
      .from("books")
      .update({
        title: formData.get("title") as string,
        author: formData.get("author") as string,
        category: formData.get("category") as string,
        description: formData.get("description") as string || null,
        book_url: formData.get("book_url") as string,
        cover_url: formData.get("cover_url") as string || null,
      })
      .eq("id", book.id)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    onClose()
    setLoading(false)
    router.refresh()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogDescription>
            Update the book details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" name="title" defaultValue={book.title} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input id="author" name="author" defaultValue={book.author} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Input id="category" name="category" defaultValue={book.category} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="book_url">Book URL *</Label>
            <Input id="book_url" name="book_url" type="url" defaultValue={book.book_url} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cover_url">Cover Image URL</Label>
            <Input id="cover_url" name="cover_url" type="url" defaultValue={book.cover_url || ""} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={3} defaultValue={book.description || ""} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
