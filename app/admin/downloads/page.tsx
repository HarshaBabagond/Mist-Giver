import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

async function getDownloads() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("downloads")
    .select(`
      id,
      downloaded_at,
      profiles!inner (full_name, email),
      books!inner (title, author)
    `)
    .order("downloaded_at", { ascending: false })
  
  return data || []
}

export default async function AdminDownloadsPage() {
  const downloads = await getDownloads()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Downloads</h1>
        <p className="text-muted-foreground">Track book downloads</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Downloads ({downloads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {downloads.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {downloads.map((download) => {
                  const profile = download.profiles as { full_name: string; email: string }
                  const book = download.books as { title: string; author: string }
                  
                  return (
                    <TableRow key={download.id}>
                      <TableCell className="font-medium">{book?.title}</TableCell>
                      <TableCell>{book?.author}</TableCell>
                      <TableCell>{profile?.full_name || profile?.email}</TableCell>
                      <TableCell>
                        {new Date(download.downloaded_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">No downloads yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
