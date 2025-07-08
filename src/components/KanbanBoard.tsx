import React, { useState } from 'react';
import { Plus, Grid3X3, List, Calendar as CalendarIcon } from 'lucide-react';
import { Task, TeamMember, Column, ViewMode, BoardView } from '../types';
import TaskCard from './TaskCard';
import CreateTaskModal from './CreateTaskModal';
import CalendarView from './CalendarView';

interface KanbanBoardProps {
  tasks: Task[];
  teamMembers: TeamMember[];
  columns: Column[];
  onTaskUpdate: (task: Task) => void;
  onTaskCreate: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  projectId: string;
  projectName: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  teamMembers,
  columns,
  onTaskUpdate,
  onTaskCreate,
  projectId,
  projectName
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [boardView, setBoardView] = useState<BoardView>('kanban');

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      onTaskUpdate({
        ...editingTask,
        ...taskData,
        updatedAt: new Date().toISOString()
      });
    } else {
      onTaskCreate(taskData);
    }
    setEditingTask(undefined);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  if (boardView === 'calendar') {
    return (
      <div className="h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">{projectName} - Calendar View</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setBoardView('kanban')}
                className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md"
              >
                Board
              </button>
              <button
                onClick={() => setBoardView('calendar')}
                className="px-3 py-1 text-sm font-medium bg-white text-gray-900 rounded-md shadow-sm"
              >
                Calendar
              </button>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Task
            </button>
          </div>
        </div>

        <CalendarView tasks={tasks} teamMembers={teamMembers} onTaskEdit={handleEditTask} />

        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
          teamMembers={teamMembers}
          editingTask={editingTask}
          projectId={projectId}
        />
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{projectName}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setBoardView('kanban')}
              className="px-3 py-1 text-sm font-medium bg-white text-gray-900 rounded-md shadow-sm"
            >
              Board
            </button>
            <button
              onClick={() => setBoardView('calendar')}
              className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md"
            >
              Calendar
            </button>
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Task
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-3">Task</div>
              <div className="col-span-2">Priority</div>
              <div className="col-span-2">Assignee</div>
              <div className="col-span-2">Code Reviewer</div>
              <div className="col-span-2">Dates</div>
              <div className="col-span-1">Status</div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                teamMembers={teamMembers}
                onEdit={handleEditTask}
                viewMode={viewMode}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
          {columns.map(column => {
            const columnTasks = getTasksByStatus(column.status);
            return (
              <div key={column.id} className="bg-gray-50 rounded-lg p-4 h-fit">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{column.title}</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: column.color }}
                    />
                    <span className="text-sm text-gray-600">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 min-h-[200px]">
                  {columnTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      teamMembers={teamMembers}
                      onEdit={handleEditTask}
                      viewMode={viewMode}
                    />
                  ))}
                  {columnTasks.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">No tasks in this column</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        teamMembers={teamMembers}
        editingTask={editingTask}
        projectId={projectId}
      />
    </div>
  );
};

export default KanbanBoard;