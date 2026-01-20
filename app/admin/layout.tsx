import React from "react"
import { redirect } from "next/navigation"
import { isAdmin, getCurrentUser } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin/sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/auth/login")
  }
  
  const admin = await isAdmin()
  
  if (!admin) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex">
      <AdminSidebar userEmail={user.email || ""} />
      <main className="flex-1 bg-muted/20">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  )
}
