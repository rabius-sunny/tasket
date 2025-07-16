'use client';

import { Button } from '@/components/ui/button';
import { Board, Workspace } from '@/types';
import {
  CheckCircle,
  Clock,
  Layers,
  ListTodo,
  Plus,
  Sparkles,
  Users
} from 'lucide-react';
import { useState } from 'react';
import { BoardCard } from './board-card';
import { CreateBoardModal } from './board-update';

interface TProps {
  boards: Board[];
  workspace: Workspace;
  onCreateBoard: (data: { title: string; workspaceId: number }) => void;
}

export default function BoardList({
  boards,
  workspace,
  onCreateBoard
}: TProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
      {/* Hero Header */}
      <div className='relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 text-white'>
        <div className='absolute inset-0 bg-black/20' />
        <div className='relative max-w-7xl mx-auto px-6 py-16'>
          <div className='flex items-center justify-between'>
            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center'>
                  <Layers className='h-6 w-6 text-white' />
                </div>
                <div>
                  <h1 className='text-4xl font-bold tracking-tight'>
                    {workspace.name}
                  </h1>
                  <p className='text-xl text-white/90 mt-1'>
                    Boards & Projects
                  </p>
                </div>
              </div>

              <p className='text-lg text-white/80 max-w-2xl'>
                Organize your work, track progress, and collaborate seamlessly
                with your team using powerful project boards.
              </p>

              <div className='flex items-center gap-6 text-white/90'>
                <div className='flex items-center gap-2'>
                  <ListTodo className='h-5 w-5' />
                  <span className='font-medium'>{boards.length} Boards</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Users className='h-5 w-5' />
                  <span className='font-medium'>Team Workspace</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setShowCreateModal(true)}
              className='bg-white text-violet-600 hover:bg-white/90 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105'
            >
              <Plus className='h-5 w-5 mr-2' />
              Create Board
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className='absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48' />
        <div className='absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-36 -translate-x-36' />
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-6 py-12'>
        {boards.length === 0 ? (
          <div className='text-center py-20'>
            <div className='max-w-md mx-auto'>
              <div className='w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center'>
                <ListTodo className='h-12 w-12 text-violet-600' />
              </div>

              <h3 className='text-2xl font-bold text-gray-900 mb-3'>
                No boards yet
              </h3>
              <p className='text-lg text-gray-600 mb-8 leading-relaxed'>
                Create your first board to start organizing tasks and
                collaborating with your team.
              </p>

              <Button
                onClick={() => setShowCreateModal(true)}
                className='bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105'
              >
                <Plus className='h-5 w-5 mr-2' />
                Create Your First Board
              </Button>
            </div>
          </div>
        ) : (
          <div className='space-y-8'>
            {/* Quick Stats */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
              <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                    <Layers className='h-5 w-5 text-blue-600' />
                  </div>
                  <div>
                    <div className='text-2xl font-bold text-gray-900'>
                      {boards.length}
                    </div>
                    <div className='text-sm text-gray-600'>Total Boards</div>
                  </div>
                </div>
              </div>

              <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
                    <CheckCircle className='h-5 w-5 text-green-600' />
                  </div>
                  <div>
                    <div className='text-2xl font-bold text-gray-900'>
                      {boards.reduce(
                        (acc, board) => acc + (board._count?.tasks || 0),
                        0
                      )}
                    </div>
                    <div className='text-sm text-gray-600'>Total Tasks</div>
                  </div>
                </div>
              </div>

              <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
                    <Clock className='h-5 w-5 text-purple-600' />
                  </div>
                  <div>
                    <div className='text-2xl font-bold text-gray-900'>
                      {
                        boards.filter((board) => (board._count?.tasks || 0) > 0)
                          .length
                      }
                    </div>
                    <div className='text-sm text-gray-600'>Active Boards</div>
                  </div>
                </div>
              </div>

              <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center'>
                    <Sparkles className='h-5 w-5 text-orange-600' />
                  </div>
                  <div>
                    {/* TODO: Calculate productivity percentage */}
                    <div className='text-2xl font-bold text-gray-900'>98%</div>
                    <div className='text-sm text-gray-600'>Productivity</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Boards Grid */}
            <div>
              <h2 className='text-xl font-semibold text-gray-900 mb-6'>
                Your Boards
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                {boards.map((board) => (
                  <BoardCard
                    workspaceName={workspace.name}
                    key={board.id}
                    board={board}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <CreateBoardModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={onCreateBoard}
        workspaceId={workspace.id}
      />
    </div>
  );
}
