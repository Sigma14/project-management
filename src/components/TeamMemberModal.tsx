import React from 'react';
import { X, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Task, TeamMember } from '../types';

interface TeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember;
  tasks: Task[];
  onTaskEdit: (task: Task) => void;
}

const TeamMemberModal: React.FC<TeamMemberModalProps> = ({
  isOpen,
  onClose,
  member,
  tasks,
  onTaskEdit
}) => {
  if (!isOpen) return null;

  const memberTasks = tasks.filter(t => t.assigneeId === member.id);
  const completedTasks = memberTasks.filter(t => t.status === 'completed');
  const inProgressTasks = memberTasks.filter(t => t.status === 'in-progress');
  const overdueTasks = memberTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed');

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'under-review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}&size=64`}
              alt={member.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{member.name}</h2>
              <p className="text-gray-600">{member.role}</p>
              <p className="text-sm text-gray-500">{member.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Total Tasks</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{memberTasks.length}</div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">Completed</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-900">In Progress</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">{inProgressTasks.length}</div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-900">Overdue</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{overdueTasks.length}</div>
            </div>
          </div>

          {/* Task List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Tasks</h3>
            {memberTasks.length > 0 ? (
              <div className="space-y-3">
                {memberTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => onTaskEdit(task)}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status.replace('-', ' ')}
                        </span>
                        <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Start: {new Date(task.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className={`${new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-red-600' : 'text-gray-600'}`}>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      {task.tags.length > 0 && (
                        <div className="flex gap-1">
                          {task.tags.slice(0, 2).map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {task.tags.length > 2 && (
                            <span className="text-xs text-gray-500">+{task.tags.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No tasks assigned to this team member</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberModal;