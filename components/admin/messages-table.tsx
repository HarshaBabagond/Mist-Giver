"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Eye, Mail, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

interface MessagesTableProps {
  messages: Message[]
}

export function MessagesTable({ messages }: MessagesTableProps) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleView = async (message: Message) => {
    setSelectedMessage(message)
    
    if (!message.is_read) {
      await supabase
        .from("contact_messages")
        .update({ is_read: true })
        .eq("id", message.id)
      router.refresh()
    }
  }

  const markAsRead = async (id: string) => {
    await supabase
      .from("contact_messages")
      .update({ is_read: true })
      .eq("id", id)
    router.refresh()
  }

  if (messages.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        No contact messages yet.
      </p>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>From</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow key={message.id} className={!message.is_read ? "bg-primary/5" : ""}>
              <TableCell>
                <Badge variant={message.is_read ? "secondary" : "default"}>
                  {message.is_read ? "Read" : "New"}
                </Badge>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{message.name}</p>
                  <p className="text-sm text-muted-foreground">{message.email}</p>
                </div>
              </TableCell>
              <TableCell className="max-w-xs truncate">{message.subject}</TableCell>
              <TableCell>{new Date(message.created_at).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleView(message)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                  <a href={`mailto:${message.email}?subject=Re: ${message.subject}`}>
                    <Button variant="ghost" size="icon">
                      <Mail className="h-4 w-4" />
                      <span className="sr-only">Reply</span>
                    </Button>
                  </a>
                  {!message.is_read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => markAsRead(message.id)}
                    >
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Mark as read</span>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Message Detail Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject}</DialogTitle>
            <DialogDescription>
              From {selectedMessage?.name} ({selectedMessage?.email})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Received: {selectedMessage && new Date(selectedMessage.created_at).toLocaleString()}
            </div>
            <div className="p-4 bg-muted/30 rounded-lg whitespace-pre-wrap">
              {selectedMessage?.message}
            </div>
            <div className="flex gap-2">
              <a href={`mailto:${selectedMessage?.email}?subject=Re: ${selectedMessage?.subject}`} className="flex-1">
                <Button className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Reply via Email
                </Button>
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
