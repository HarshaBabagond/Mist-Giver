import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessagesTable } from "@/components/admin/messages-table"

async function getMessages() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
  
  return data || []
}

export default async function AdminMessagesPage() {
  const messages = await getMessages()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Contact Messages</h1>
        <p className="text-muted-foreground">View and manage contact form submissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Messages ({messages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <MessagesTable messages={messages} />
        </CardContent>
      </Card>
    </div>
  )
}
