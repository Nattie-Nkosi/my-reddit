'use client'

import { useState, useTransition } from 'react'
import { Role } from '@prisma/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Shield, User, Ban, CheckCircle } from 'lucide-react'
import { updateUserRole, toggleUserSuspension } from '@/actions'
import { toast } from 'sonner'

interface UserActionsMenuProps {
  user: {
    id: string
    role: Role
    suspended: boolean
  }
}

export default function UserActionsMenu({ user }: UserActionsMenuProps) {
  const [isPending, startTransition] = useTransition()
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [showSuspendDialog, setShowSuspendDialog] = useState(false)

  const handleRoleChange = (newRole: Role) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('userId', user.id)
      formData.append('role', newRole)

      const result = await updateUserRole({ errors: {} }, formData)

      if (result.success) {
        toast.success(`User role updated to ${newRole}`)
        setShowRoleDialog(false)
      } else {
        toast.error(result.errors._form?.[0] || 'Failed to update role')
      }
    })
  }

  const handleToggleSuspension = () => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('userId', user.id)

      const result = await toggleUserSuspension({ errors: {} }, formData)

      if (result.success) {
        toast.success(user.suspended ? 'User unsuspended' : 'User suspended')
        setShowSuspendDialog(false)
      } else {
        toast.error(result.errors._form?.[0] || 'Failed to toggle suspension')
      }
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" disabled={isPending}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {user.role === Role.USER ? (
            <DropdownMenuItem onClick={() => setShowRoleDialog(true)}>
              <Shield className="mr-2 h-4 w-4" />
              Promote to Admin
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setShowRoleDialog(true)}>
              <User className="mr-2 h-4 w-4" />
              Demote to User
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setShowSuspendDialog(true)}>
            {user.suspended ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Unsuspend User
              </>
            ) : (
              <>
                <Ban className="mr-2 h-4 w-4" />
                Suspend User
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change User Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change this user&apos;s role to{' '}
              {user.role === Role.USER ? 'ADMIN' : 'USER'}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleRoleChange(
                user.role === Role.USER ? Role.ADMIN : Role.USER
              )}
              disabled={isPending}
            >
              {isPending ? 'Updating...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {user.suspended ? 'Unsuspend' : 'Suspend'} User
            </AlertDialogTitle>
            <AlertDialogDescription>
              {user.suspended
                ? 'This will restore the user\'s access to create posts and comments.'
                : 'This will prevent the user from creating posts, comments, and voting. Their existing content will remain visible.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleSuspension}
              disabled={isPending}
            >
              {isPending ? 'Processing...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
