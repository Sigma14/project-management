import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, User } from 'lucide-react';
import { Task, TeamMember } from '../types';

interface GanttViewProps {
  tasks: Task[];
  teamMembers: TeamMember[];
  onTaskEdit: (task: Task) => void;
}

const GanttView: React.FC<GanttViewProps> = ({ tasks, teamMembers, onTaskEdit }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'month' | 'week'>('month');

  const getDateRange = () => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);
    
    if (viewType === 'month') {
      start.setDate(1);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
    } else {
      const day = start.getDay();
      start.setDate(start.getDate() - day);
      end.setDate(start.getDate() + 6);
    }
    
    return { start, end };
  };

  const generateDateColumns = () => {
    const { start, end } = getDateRange();
    const dates = [];
    const current = new Date(start);
    
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  };

  const getTaskPosition = (task: Task, dates: Date[]) => {
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.dueDate);
    const rangeStart = dates[0];
    const rangeEnd = dates[dates.length - 1];
    
    const startIndex = Math.max(0, Math.floor((taskStart.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24)));
    const endIndex = Math.min(dates.length - 1, Math.floor((taskEnd.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24)));
    
    return {
      left: `${(startIndex / dates.length) * 100}%`,
      width: `${((endIndex - startIndex + 1) / dates.length) * 100}%`,
      isVisible: taskEnd >= rangeStart && taskStart <= rangeEnd
    };
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'in-progress': return 'bg-blue-600';
      case 'under-review': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  const navigateTime = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (viewType === 'month') {
        newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      } else {
        newDate.setDate(prev.getDate() + (direction === 'next' ? 7 : -7));
      }
      return newDate;
    });
  };

  const dates = generateDateColumns();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors">
      {/* Gantt Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Gantt Chart - {viewType === 'month' ? monthNames[currentDate.getMonth()] : 'Week'} {currentDate.getFullYear()}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewType('week')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewType === 'week' 
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewType('month')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewType === 'month' 
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Month
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTime('prev')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => navigateTime('next')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Date Headers */}
          <div className="grid grid-cols-12 gap-px bg-gray-200 dark:bg-gray-600 rounded-t-lg overflow-hidden mb-4">
            <div className="col-span-3 bg-gray-50 dark:bg-gray-700 p-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Task</span>
            </div>
            <div className="col-span-9 bg-gray-50 dark:bg-gray-700 p-3">
              <div className="grid grid-cols-7 gap-1">
                {dates.slice(0, 7).map((date, index) => (
                  <div key={index} className="text-center">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Task Rows */}
          <div className="space-y-2">
            {tasks.map(task => {
              const assignee = teamMembers.find(m => m.id === task.assigneeId);
              const position = getTaskPosition(task, dates);
              
              return (
                <div key={task.id} className="grid grid-cols-12 gap-px items-center">
                  {/* Task Info */}
                  <div className="col-span-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-l-lg">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">{task.title}</h4>
                        {assignee && (
                          <div className="flex items-center gap-1 mt-1">
                            <User className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{assignee.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="col-span-9 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-r-lg relative h-16">
                    {position.isVisible && (
                      <div
                        className={`absolute top-1/2 transform -translate-y-1/2 h-6 rounded cursor-pointer hover:opacity-80 transition-opacity ${getPriorityColor(task.priority)}`}
                        style={{ left: position.left, width: position.width }}
                        onClick={() => onTaskEdit(task)}
                        title={`${task.title} (${task.status})`}
                      >
                        <div className="px-2 py-1 text-white text-xs font-medium truncate">
                          {task.title}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-4">
          <span className="text-gray-600 dark:text-gray-400 font-medium">Priority:</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Low</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 dark:text-gray-400 font-medium">Status:</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Backlog</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Under Review</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttView;