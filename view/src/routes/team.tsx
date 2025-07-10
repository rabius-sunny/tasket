import { For, createSignal } from 'solid-js';
import {
  Plus,
  Mail,
  MoreHorizontal,
  Users,
  Crown,
  Shield,
  User,
  Calendar,
  Activity
} from 'lucide-solid';
import Layout from '~/components/ui/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/Card';
import Button from '~/components/ui/Button';
import Badge from '~/components/ui/Badge';
import {
  Dropdown,
  DropdownItem,
  DropdownDivider
} from '~/components/ui/Dropdown';
import Avatar from '~/components/ui/Avatar';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  avatar?: string;
  status: 'active' | 'inactive';
  lastActive: string;
  tasksCount: number;
  joinedAt: string;
}

export default function TeamPage() {
  const [members] = createSignal<TeamMember[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'owner',
      status: 'active',
      lastActive: '2 hours ago',
      tasksCount: 12,
      joinedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      role: 'admin',
      status: 'active',
      lastActive: '1 hour ago',
      tasksCount: 8,
      joinedAt: '2024-02-10'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'member',
      status: 'active',
      lastActive: '30 minutes ago',
      tasksCount: 15,
      joinedAt: '2024-03-05'
    },
    {
      id: '4',
      name: 'Emma Davis',
      email: 'emma@example.com',
      role: 'member',
      status: 'inactive',
      lastActive: '2 days ago',
      tasksCount: 6,
      joinedAt: '2024-03-12'
    },
    {
      id: '5',
      name: 'Alex Smith',
      email: 'alex@example.com',
      role: 'admin',
      status: 'active',
      lastActive: '5 hours ago',
      tasksCount: 9,
      joinedAt: '2024-01-28'
    }
  ]);

  const getRoleIcon = (role: TeamMember['role']) => {
    switch (role) {
      case 'owner':
        return <Crown class='w-4 h-4' />;
      case 'admin':
        return <Shield class='w-4 h-4' />;
      case 'member':
        return <User class='w-4 h-4' />;
      default:
        return <User class='w-4 h-4' />;
    }
  };

  const getRoleColor = (role: TeamMember['role']) => {
    switch (role) {
      case 'owner':
        return 'warning';
      case 'admin':
        return 'info';
      case 'member':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: TeamMember['status']) => {
    return status === 'active' ? 'success' : 'default';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const activeMembers = () =>
    members().filter((m) => m.status === 'active').length;
  const totalTasks = () => members().reduce((sum, m) => sum + m.tasksCount, 0);

  return (
    <Layout>
      <div class='space-y-6'>
        {/* Header */}
        <div class='flex justify-between items-center'>
          <div>
            <h1 class='text-3xl font-bold text-gray-900'>Team</h1>
            <p class='text-gray-600 mt-1'>
              Manage your team members and their permissions.
            </p>
          </div>
          <Button
            variant='primary'
            size='md'
          >
            <Plus class='w-4 h-4 mr-2' />
            Invite Member
          </Button>
        </div>

        {/* Team Stats */}
        <div class='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <Card>
            <CardContent class='flex items-center p-6'>
              <div class='p-3 bg-blue-100 rounded-lg'>
                <Users class='w-6 h-6 text-blue-600' />
              </div>
              <div class='ml-4'>
                <p class='text-sm font-medium text-gray-600'>Total Members</p>
                <p class='text-2xl font-bold text-gray-900'>
                  {members().length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent class='flex items-center p-6'>
              <div class='p-3 bg-green-100 rounded-lg'>
                <Activity class='w-6 h-6 text-green-600' />
              </div>
              <div class='ml-4'>
                <p class='text-sm font-medium text-gray-600'>Active Members</p>
                <p class='text-2xl font-bold text-gray-900'>
                  {activeMembers()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent class='flex items-center p-6'>
              <div class='p-3 bg-purple-100 rounded-lg'>
                <Calendar class='w-6 h-6 text-purple-600' />
              </div>
              <div class='ml-4'>
                <p class='text-sm font-medium text-gray-600'>Total Tasks</p>
                <p class='text-2xl font-bold text-gray-900'>{totalTasks()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div class='space-y-4'>
              <For each={members()}>
                {(member) => (
                  <div class='flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'>
                    <div class='flex items-center space-x-4'>
                      <Avatar
                        src={member.avatar}
                        alt={member.name}
                        name={member.name}
                      />
                      <div>
                        <div class='flex items-center space-x-2'>
                          <h4 class='font-medium text-gray-900'>
                            {member.name}
                          </h4>
                          <Badge
                            variant={getRoleColor(member.role)}
                            size='sm'
                          >
                            <span class='flex items-center space-x-1'>
                              {getRoleIcon(member.role)}
                              <span>{member.role}</span>
                            </span>
                          </Badge>
                          <Badge
                            variant={getStatusColor(member.status)}
                            size='sm'
                          >
                            {member.status}
                          </Badge>
                        </div>
                        <p class='text-sm text-gray-500 mt-1'>{member.email}</p>
                        <div class='flex items-center space-x-4 text-xs text-gray-400 mt-1'>
                          <span>Last active: {member.lastActive}</span>
                          <span>•</span>
                          <span>{member.tasksCount} tasks</span>
                          <span>•</span>
                          <span>Joined {formatDate(member.joinedAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div class='flex items-center space-x-2'>
                      <Button
                        variant='outline'
                        size='sm'
                      >
                        <Mail class='w-4 h-4 mr-2' />
                        Message
                      </Button>
                      <Dropdown
                        trigger={
                          <button class='p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100'>
                            <MoreHorizontal class='w-5 h-5' />
                          </button>
                        }
                        align='right'
                      >
                        <DropdownItem>View Profile</DropdownItem>
                        <DropdownItem>Edit Permissions</DropdownItem>
                        <DropdownDivider />
                        <DropdownItem>Remove from Team</DropdownItem>
                      </Dropdown>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </CardContent>
        </Card>

        {/* Role Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div class='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div class='text-center'>
                <div class='w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4'>
                  <Crown class='w-8 h-8 text-yellow-600' />
                </div>
                <h3 class='font-semibold text-gray-900 mb-2'>Owner</h3>
                <p class='text-sm text-gray-600 mb-4'>
                  Full access to all features and settings
                </p>
                <ul class='text-xs text-gray-500 space-y-1'>
                  <li>• Manage team members</li>
                  <li>• Billing and plans</li>
                  <li>• Delete workspace</li>
                  <li>• All admin permissions</li>
                </ul>
              </div>

              <div class='text-center'>
                <div class='w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4'>
                  <Shield class='w-8 h-8 text-blue-600' />
                </div>
                <h3 class='font-semibold text-gray-900 mb-2'>Admin</h3>
                <p class='text-sm text-gray-600 mb-4'>
                  Manage projects and team settings
                </p>
                <ul class='text-xs text-gray-500 space-y-1'>
                  <li>• Create and manage boards</li>
                  <li>• Invite team members</li>
                  <li>• Manage integrations</li>
                  <li>• View analytics</li>
                </ul>
              </div>

              <div class='text-center'>
                <div class='w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4'>
                  <User class='w-8 h-8 text-gray-600' />
                </div>
                <h3 class='font-semibold text-gray-900 mb-2'>Member</h3>
                <p class='text-sm text-gray-600 mb-4'>
                  View and edit assigned tasks
                </p>
                <ul class='text-xs text-gray-500 space-y-1'>
                  <li>• View all boards</li>
                  <li>• Create and edit tasks</li>
                  <li>• Comment on tasks</li>
                  <li>• Upload attachments</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
