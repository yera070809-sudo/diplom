import { AdminHeader } from "@/components/admin-header"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="dark min-h-screen bg-background text-foreground antialiased">
            <AdminHeader />
            {children}
        </div>
    )
}
