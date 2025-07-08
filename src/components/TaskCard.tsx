import React from 'react';
import { Calendar, User, UserCheck, Tag, ExternalLink, AlertCircle, Code } from 'lucide-react';
import { Task, TeamMember, ViewMode } from '../types';

interface TaskCardProps {
  task: Task;
  teamMembers: TeamMember[];
  onEdit: (task: Task) => void;
  viewMode: ViewMode;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, teamMembers, onEdit, viewMode }) => {
  const assignee = teamMembers.find(member => member.id === task.assigneeId);
  const supervisor = teamMembers.find(member => member.id === task.supervisorId);
  const codeReviewer = teamMembers.find(member => member.id === task.codeReviewerId);

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date();

  if (viewMode === 'list') {
    return (
      <div 
        className="bg-white border border-gray-200 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => onEdit(task)}
      >
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-3">
            <h3 className="font-semibold text-gray-900 truncate">{task.title}</h3>
            <p className="text-sm text-gray-600 truncate">{task.description}</p>
          </div>
          
          <div className="col-span-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
          
          <div className="col-span-2">
            {assignee && (
              <div className="flex items-center gap-1">
                <img
                  src={assignee.avatar || `https://ui-avatars.com/api/?name=${assignee.name}&size=24`}
                  alt={assignee.name}
                  className="w-5 h-5 rounded-full"
                />
                <span className="text-sm text-gray-600 truncate">{assignee.name}</span>
              </div>
            )}
          </div>
          
          <div className="col-span-2">
            {codeReviewer && (
              <div className="flex items-center gap-1">
                <Code className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 truncate">{codeReviewer.name}</span>
              </div>
            )}
          </div>
          
          <div className="col-span-2">
            <div className="text-sm text-gray-600">
              <div>Start: {new Date(task.startDate).toLocaleDateString()}</div>
              <div className={isOverdue ? 'text-red-600' : ''}>
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="col-span-1 flex justify-end">
            {isOverdue && <AlertCircle className="w-4 h-4 text-red-500" />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onEdit(task)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 line-clamp-2">{task.title}</h3>
        <div className="flex items-center gap-1 ml-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          {isOverdue && (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Google Doc Link */}
      {task.googleDocLink && (
        <div className="mb-3">
          <a
            href={task.googleDocLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4" />
            View Document
          </a>
        </div>
      )}

      {/* Team Members */}
      <div className="space-y-2 mb-3">
        {assignee && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <img
              src={assignee.avatar || `https://ui-avatars.com/api/?name=${assignee.name}&size=20`}
              alt={assignee.name}
              className="w-4 h-4 rounded-full"
            />
            <span className="text-xs text-gray-600">{assignee.name}</span>
          </div>
        )}
        {supervisor && (
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-600">{supervisor.name}</span>
          </div>
        )}
        {codeReviewer && (
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-600">{codeReviewer.name}</span>
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="pt-3 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-500">Start:</span>
            <div className="text-gray-700">{new Date(task.startDate).toLocaleDateString()}</div>
          </div>
          <div>
            <span className="text-gray-500">Due:</span>
            <div className={isOverdue ? 'text-red-600' : 'text-gray-700'}>
              {new Date(task.dueDate).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;