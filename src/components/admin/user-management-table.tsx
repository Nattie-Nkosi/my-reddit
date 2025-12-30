import { db } from '@/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import RoleBadge from './role-badge'
import UserActionsMenu from './user-actions-menu'
import { formatDistanceToNow } from 'date-fns'

export default async function UserManagementTable() {
  const users = await db.user.findMany({
    orderBy: { id: 'desc' },
    include: {
      _count: {
        select: {
          Post: true,
          Comment: true,
        },
      },
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users ({users.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase bg-muted">
              <tr>
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Activity</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image || ''} />
                        <AvatarFallback>
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name || 'Anonymous'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-6 py-4">
                    {user.suspended ? (
                      <Badge variant="destructive">Suspended</Badge>
                    ) : (
                      <Badge variant="outline">Active</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="text-xs">
                      <div>{user._count.Post} posts</div>
                      <div>{user._count.Comment} comments</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <UserActionsMenu user={user} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
