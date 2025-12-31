import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function DashboardCard({
    title,
    children,
    className = "",
}: {
    title: string
    children: React.ReactNode
    className?: string
}) {
    return (
        <Card className={`h-full ${className}`}>
            <CardHeader>
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )
}