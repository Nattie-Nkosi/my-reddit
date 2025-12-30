import { db } from '@/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileText, MessageSquare, Hash } from 'lucide-react'

export default async function DashboardStats() {
  const [totalUsers, totalPosts, totalComments, totalTopics] = await Promise.all([
    db.user.count(),
    db.post.count(),
    db.comment.count(),
    db.topic.count(),
  ])

  const stats = [
    { title: 'Total Users', value: totalUsers, icon: Users, description: 'Registered accounts' },
    { title: 'Total Topics', value: totalTopics, icon: Hash, description: 'Active communities' },
    { title: 'Total Posts', value: totalPosts, icon: FileText, description: 'Published posts' },
    { title: 'Total Comments', value: totalComments, icon: MessageSquare, description: 'User discussions' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
