import { TeamMember, Task, Column, Project } from '../types';

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'Frontend Developer',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@company.com',
    role: 'Backend Developer',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@company.com',
    role: 'UI/UX Designer',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david@company.com',
    role: 'Project Manager',
    avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '5',
    name: 'Alex Thompson',
    email: 'alex@company.com',
    role: 'Senior Developer',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Software App',
    description: 'Main software application development',
    color: '#3B82F6',
    createdAt: '2024-12-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Online Courses',
    description: 'Educational content and course platform',
    color: '#10B981',
    createdAt: '2024-12-01T00:00:00Z'
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design user authentication flow',
    description: 'Create wireframes and mockups for login, registration, and password reset flows',
    status: 'backlog',
    priority: 'high',
    tags: ['design', 'authentication', 'ui'],
    assigneeId: '3',
    supervisorId: '4',
    codeReviewerId: '5',
    dueDate: '2024-12-30',
    startDate: '2024-12-20',
    estimatedEndDate: '2024-12-28',
    codeReviewEndDate: '2024-12-29',
    implementationEndDate: '2024-12-30',
    googleDocLink: 'https://docs.google.com/document/d/1234567890',
    createdAt: '2024-12-15T10:00:00Z',
    updatedAt: '2024-12-15T10:00:00Z',
    projectId: '1'
  },
  {
    id: '2',
    title: 'Implement API endpoints',
    description: 'Set up REST API endpoints for user management, task operations, and team functionality',
    status: 'in-progress',
    priority: 'high',
    tags: ['backend', 'api', 'database'],
    assigneeId: '2',
    supervisorId: '4',
    codeReviewerId: '5',
    dueDate: '2024-12-28',
    startDate: '2024-12-16',
    estimatedEndDate: '2024-12-26',
    codeReviewEndDate: '2024-12-27',
    implementationEndDate: '2024-12-28',
    googleDocLink: 'https://docs.google.com/document/d/0987654321',
    createdAt: '2024-12-14T09:00:00Z',
    updatedAt: '2024-12-16T14:30:00Z',
    projectId: '1'
  },
  {
    id: '3',
    title: 'Course content structure',
    description: 'Define the structure and flow for online course modules',
    status: 'under-review',
    priority: 'medium',
    tags: ['content', 'education', 'planning'],
    assigneeId: '3',
    supervisorId: '4',
    codeReviewerId: '1',
    dueDate: '2024-12-25',
    startDate: '2024-12-18',
    estimatedEndDate: '2024-12-23',
    codeReviewEndDate: '2024-12-24',
    implementationEndDate: '2024-12-25',
    createdAt: '2024-12-13T11:00:00Z',
    updatedAt: '2024-12-17T16:45:00Z',
    projectId: '2'
  },
  {
    id: '4',
    title: 'Video recording setup',
    description: 'Set up equipment and environment for course video recording',
    status: 'completed',
    priority: 'low',
    tags: ['video', 'setup', 'equipment'],
    assigneeId: '1',
    supervisorId: '4',
    codeReviewerId: '2',
    dueDate: '2024-12-20',
    startDate: '2024-12-10',
    estimatedEndDate: '2024-12-18',
    codeReviewEndDate: '2024-12-19',
    implementationEndDate: '2024-12-20',
    createdAt: '2024-12-10T08:00:00Z',
    updatedAt: '2024-12-20T17:00:00Z',
    projectId: '2'
  }
];

export const columns: Column[] = [
  { id: 'backlog', title: 'Backlog', status: 'backlog', color: '#64748B' },
  { id: 'in-progress', title: 'In Progress', status: 'in-progress', color: '#3B82F6' },
  { id: 'under-review', title: 'Under Review', status: 'under-review', color: '#F59E0B' },
  { id: 'completed', title: 'Completed', status: 'completed', color: '#10B981' }
];