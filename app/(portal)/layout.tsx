import React from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getCurrentUser, getUserRole } from "@/lib/auth"

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  const role = user ? await getUserRole() : null
  
  const userInfo = user ? { email: user.email || "", id: user.id } : null
  const isAdmin = role === "admin"

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={userInfo} isAdmin={isAdmin} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
