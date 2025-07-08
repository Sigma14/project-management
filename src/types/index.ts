export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'in-progress' | 'under-review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  assigneeId: string;
  supervisorId: string;
  codeReviewerId: string;
  dueDate: string;
  startDate: string;
  estimatedEndDate: string;
  codeReviewEndDate: string;
  implementationEndDate: string;
  googleDocLink?: string;
  createdAt: string;
  updatedAt: string;
  projectId: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface Column {
  id: string;
  title: string;
  status: Task['status'];
  color: string;
}

export interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
}

export type ViewMode = 'grid' | 'list';
export type BoardView = 'kanban' | 'calendar';