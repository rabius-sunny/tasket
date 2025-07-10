import { For, createSignal, Show } from 'solid-js';
import {
  Plus,
  Users,
  Calendar,
  MoreHorizontal,
  Star,
  Settings,
  Archive,
  Trash2,
  FolderKanban,
  Activity
} from 'lucide-solid';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '~/components/ui/Card';
import Button from '~/components/ui/Button';
import Badge from '~/components/ui/Badge';
import {
  Dropdown,
  DropdownItem,
  DropdownDivider
} from '~/components/ui/Dropdown';
import Modal from '~/components/ui/Modal';
import Input from '~/components/ui/Input';

interface Workspace {
  id: string;
  name: string;
  description: string;
  color: string;
  members: number;
  boards: number;
  lastActivity: string;
  starred: boolean;
  role: 'owner' | 'admin' | 'member';
}

export default function Workspaces() {
  const [workspaces] = createSignal<Workspace[]>([
    {
      id: '1',
      name: 'Marketing Team',
      description: 'All marketing campaigns and content creation tasks',
      color: 'blue',
      members: 8,
      boards: 12,
      lastActivity: '2 hours ago',
      starred: true,
      role: 'owner'
    },
    {
      id: '2',
      name: 'Product Development',
      description: 'Feature development and product roadmap',
      color: 'purple',
      members: 15,
      boards: 8,
      lastActivity: '1 day ago',
      starred: false,
      role: 'admin'
    },
    {
      id: '3',
      name: 'Design System',
      description: 'UI components and design guidelines',
      color: 'green',
      members: 5,
      boards: 6,
      lastActivity: '3 hours ago',
      starred: true,
      role: 'member'
    },
    {
      id: '4',
      name: 'Customer Support',
      description: 'Help desk and customer feedback management',
      color: 'orange',
      members: 12,
      boards: 4,
      lastActivity: '5 hours ago',
      starred: false,
      role: 'admin'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = createSignal(false);
  const [newWorkspaceName, setNewWorkspaceName] = createSignal('');
  const [newWorkspaceDescription, setNewWorkspaceDescription] =
    createSignal('');

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-500 text-blue-700 bg-blue-50',
      purple: 'bg-purple-500 text-purple-700 bg-purple-50',
      green: 'bg-green-500 text-green-700 bg-green-50',
      orange: 'bg-orange-500 text-orange-700 bg-orange-50',
      red: 'bg-red-500 text-red-700 bg-red-50',
      yellow: 'bg-yellow-500 text-yellow-700 bg-yellow-50'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const handleCreateWorkspace = () => {
    // Handle workspace creation logic here
    console.log(
      'Creating workspace:',
      newWorkspaceName(),
      newWorkspaceDescription()
    );
    setShowCreateModal(false);
    setNewWorkspaceName('');
    setNewWorkspaceDescription('');
  };

  const toggleStar = (workspaceId: string) => {
    // Handle starring/unstarring logic here
    console.log('Toggle star for workspace:', workspaceId);
  };

  return (
    <div class='space-y-8'>
      {/* Header */}
      <div class='flex justify-between items-center'>
        <div>
          <h1 class='text-3xl font-bold text-gray-900'>Workspaces</h1>
          <p class='text-gray-600 mt-1'>
            Organize your projects and collaborate with your team.
          </p>
        </div>
        <Button
          variant='primary'
          onClick={() => setShowCreateModal(true)}
        >
          <Plus class='w-4 h-4 mr-2' />
          New Workspace
        </Button>
      </div>

      {/* Starred Workspaces */}
      <div>
        <h2 class='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
          <Star class='w-5 h-5 mr-2 text-yellow-500' />
          Starred Workspaces
        </h2>
        <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <For each={workspaces().filter((w) => w.starred)}>
            {(workspace) => (
              <Card class='hover:shadow-lg transition-shadow cursor-pointer group'>
                <CardHeader>
                  <div class='flex items-start justify-between'>
                    <div class='flex items-center space-x-3'>
                      <div
                        class={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          getColorClasses(workspace.color).split(' ')[2]
                        }`}
                      >
                        <FolderKanban
                          class={`w-6 h-6 ${
                            getColorClasses(workspace.color).split(' ')[1]
                          }`}
                        />
                      </div>
                      <div>
                        <CardTitle class='text-lg'>{workspace.name}</CardTitle>
                        <Badge
                          variant='default'
                          size='sm'
                          class='mt-1'
                        >
                          {workspace.role}
                        </Badge>
                      </div>
                    </div>
                    <div class='flex items-center space-x-1'>
                      <button
                        onClick={() => toggleStar(workspace.id)}
                        class='p-1 text-yellow-500 hover:text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity'
                      >
                        <Star class='w-4 h-4 fill-current' />
                      </button>
                      <Dropdown
                        trigger={
                          <button class='p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity'>
                            <MoreHorizontal class='w-4 h-4' />
                          </button>
                        }
                        align='right'
                      >
                        <DropdownItem>
                          <Settings class='w-4 h-4 mr-2' />
                          Settings
                        </DropdownItem>
                        <DropdownItem>
                          <Archive class='w-4 h-4 mr-2' />
                          Archive
                        </DropdownItem>
                        <DropdownDivider />
                        <DropdownItem>
                          <Trash2 class='w-4 h-4 mr-2 text-red-500' />
                          Delete
                        </DropdownItem>
                      </Dropdown>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p class='text-gray-600 text-sm mb-4'>
                    {workspace.description}
                  </p>
                  <div class='flex items-center justify-between text-sm text-gray-500'>
                    <div class='flex items-center space-x-4'>
                      <div class='flex items-center space-x-1'>
                        <Users class='w-4 h-4' />
                        <span>{workspace.members}</span>
                      </div>
                      <div class='flex items-center space-x-1'>
                        <FolderKanban class='w-4 h-4' />
                        <span>{workspace.boards}</span>
                      </div>
                    </div>
                    <div class='flex items-center space-x-1'>
                      <Activity class='w-4 h-4' />
                      <span>{workspace.lastActivity}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </For>
        </div>
      </div>

      {/* All Workspaces */}
      <div>
        <h2 class='text-lg font-semibold text-gray-900 mb-4'>All Workspaces</h2>
        <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <For each={workspaces()}>
            {(workspace) => (
              <Card class='hover:shadow-lg transition-shadow cursor-pointer group'>
                <CardHeader>
                  <div class='flex items-start justify-between'>
                    <div class='flex items-center space-x-3'>
                      <div
                        class={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          getColorClasses(workspace.color).split(' ')[2]
                        }`}
                      >
                        <FolderKanban
                          class={`w-6 h-6 ${
                            getColorClasses(workspace.color).split(' ')[1]
                          }`}
                        />
                      </div>
                      <div>
                        <CardTitle class='text-lg'>{workspace.name}</CardTitle>
                        <Badge
                          variant='default'
                          size='sm'
                          class='mt-1'
                        >
                          {workspace.role}
                        </Badge>
                      </div>
                    </div>
                    <div class='flex items-center space-x-1'>
                      <button
                        onClick={() => toggleStar(workspace.id)}
                        class={`p-1 hover:text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity ${
                          workspace.starred
                            ? 'text-yellow-500'
                            : 'text-gray-400'
                        }`}
                      >
                        <Star
                          class={`w-4 h-4 ${
                            workspace.starred ? 'fill-current' : ''
                          }`}
                        />
                      </button>
                      <Dropdown
                        trigger={
                          <button class='p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity'>
                            <MoreHorizontal class='w-4 h-4' />
                          </button>
                        }
                        align='right'
                      >
                        <DropdownItem>
                          <Settings class='w-4 h-4 mr-2' />
                          Settings
                        </DropdownItem>
                        <DropdownItem>
                          <Archive class='w-4 h-4 mr-2' />
                          Archive
                        </DropdownItem>
                        <DropdownDivider />
                        <DropdownItem>
                          <Trash2 class='w-4 h-4 mr-2 text-red-500' />
                          Delete
                        </DropdownItem>
                      </Dropdown>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p class='text-gray-600 text-sm mb-4'>
                    {workspace.description}
                  </p>
                  <div class='flex items-center justify-between text-sm text-gray-500'>
                    <div class='flex items-center space-x-4'>
                      <div class='flex items-center space-x-1'>
                        <Users class='w-4 h-4' />
                        <span>{workspace.members}</span>
                      </div>
                      <div class='flex items-center space-x-1'>
                        <FolderKanban class='w-4 h-4' />
                        <span>{workspace.boards}</span>
                      </div>
                    </div>
                    <div class='flex items-center space-x-1'>
                      <Activity class='w-4 h-4' />
                      <span>{workspace.lastActivity}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </For>
        </div>
      </div>

      {/* Create Workspace Modal */}
      <Modal
        show={showCreateModal()}
        onClose={() => setShowCreateModal(false)}
        title='Create New Workspace'
        size='md'
      >
        <div class='space-y-4'>
          <div>
            <label class='block text-sm font-medium text-gray-700 mb-2'>
              Workspace Name
            </label>
            <Input
              type='text'
              placeholder='Enter workspace name'
              value={newWorkspaceName()}
              onInput={(e) => setNewWorkspaceName(e.currentTarget.value)}
            />
          </div>
          <div>
            <label class='block text-sm font-medium text-gray-700 mb-2'>
              Description
            </label>
            <textarea
              class='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              rows='3'
              placeholder='Describe what this workspace is for'
              value={newWorkspaceDescription()}
              onInput={(e) => setNewWorkspaceDescription(e.currentTarget.value)}
            />
          </div>
          <div class='flex justify-end space-x-3 pt-4'>
            <Button
              variant='outline'
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={handleCreateWorkspace}
            >
              <Plus class='w-4 h-4 mr-2' />
              Create Workspace
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
