import React, { useState } from 'react';
import { Kanban, Bot, Search, Filter, Users, FolderOpen, Moon, Sun } from 'lucide-react';
import KanbanBoard from './components/KanbanBoard';
import AIAssistant from './components/AIAssistant';
import TeamMemberModal from './components/TeamMemberModal';
import { useTheme } from './contexts/ThemeContext';
import { Task, TeamMember, Project } from './types';
import { mockTasks, mockTeamMembers, columns, mockProjects } from './data/mockData';

type TabType = 'board' | 'ai' | 'team';

function App() {
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('board');
  const [activeProject, setActiveProject] = useState<string>('1');
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [teamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [projects] = useState<Project[]>(mockProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const currentProject = projects.find(p => p.id === activeProject);
  const projectTasks = tasks.filter(task => task.projectId === activeProject);

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleTaskCreate = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const filteredTasks = projectTasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const tabs = [
    { id: 'board' as TabType, label: 'Project Board', icon: Kanban },
    { id: 'ai' as TabType, label: 'AI Assistant', icon: Bot },
    { id: 'team' as TabType, label: 'Team', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Kanban className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">ProjectFlow</h1>
              
              {/* Project Selector */}
              <div className="flex items-center gap-2 ml-6">
                <FolderOpen className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <select
                  value={activeProject}
                  onChange={(e) => setActiveProject(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                <Filter className="w-5 h-5 dark:text-gray-500 dark:hover:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'board' && currentProject && (
          <KanbanBoard
            tasks={filteredTasks}
            teamMembers={teamMembers}
            columns={columns}
            onTaskUpdate={handleTaskUpdate}
            onTaskCreate={handleTaskCreate}
            projectId={activeProject}
            projectName={currentProject.name}
          />
        )}
        
        {activeTab === 'ai' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-[calc(100vh-200px)] transition-colors">
            <AIAssistant tasks={projectTasks} teamMembers={teamMembers} />
          </div>
        )}
        
        {activeTab === 'team' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Team Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map(member => {
                const assignedTasks = projectTasks.filter(t => t.assigneeId === member.id);
                const completedTasks = assignedTasks.filter(t => t.status === 'completed');
                
                return (
                  <div 
                    key={member.id} 
                    className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setSelectedMember(member)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}&size=48`}
                        alt={member.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{member.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Assigned Tasks</span>
                        <span className="font-medium text-gray-900 dark:text-white">{assignedTasks.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Completed</span>
                        <span className="font-medium text-green-600 dark:text-green-400">{completedTasks.length}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all"
                          style={{
                            width: `${assignedTasks.length > 0 ? (completedTasks.length / assignedTasks.length) * 100 : 0}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Team Member Modal */}
      {selectedMember && (
        <TeamMemberModal
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          member={selectedMember}
          tasks={projectTasks}
          onTaskEdit={(task) => {
            // Handle task editing from team member modal
            setSelectedMember(null);
            setActiveTab('board');
          }}
        />
      )}
    </div>
  );
}

export default App;