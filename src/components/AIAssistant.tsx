import React, { useState } from 'react';
import { Send, Bot, User, Lightbulb, Users, Calendar, BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { AIMessage, Task, TeamMember } from '../types';

interface AIAssistantProps {
  tasks: Task[];
  teamMembers: TeamMember[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ tasks, teamMembers }) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI Project Manager assistant. I can help you with task planning, team allocation, project insights, and scheduling. How can I assist you today?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');

  // Calculate project metrics
  const projectMetrics = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
    overdueTasks: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
    highPriorityTasks: tasks.filter(t => t.priority === 'high').length,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0
  };

  const suggestions = [
    { icon: BarChart3, text: 'Analyze current project status', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { icon: Users, text: 'Suggest optimal task allocation', color: 'bg-green-50 text-green-600 border-green-200' },
    { icon: Calendar, text: 'Review upcoming deadlines', color: 'bg-orange-50 text-orange-600 border-orange-200' },
    { icon: TrendingUp, text: 'Generate productivity insights', color: 'bg-purple-50 text-purple-600 border-purple-200' }
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const response = generateAIResponse(input, tasks, teamMembers);
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInput('');
  };

  const generateAIResponse = (input: string, tasks: Task[], teamMembers: TeamMember[]): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('status') || lowerInput.includes('project')) {
      return `📊 **Project Status Overview:**

**Overall Progress:**
• **Completion Rate**: ${projectMetrics.completionRate}% (${projectMetrics.completedTasks}/${projectMetrics.totalTasks} tasks)
• **Active Tasks**: ${projectMetrics.inProgressTasks} in progress
• **High Priority**: ${projectMetrics.highPriorityTasks} critical tasks
• **Overdue**: ${projectMetrics.overdueTasks} tasks need immediate attention

**Key Insights:**
${projectMetrics.overdueTasks > 0 ? `🚨 **Action Required**: ${projectMetrics.overdueTasks} overdue tasks detected` : '✅ **On Track**: No overdue tasks'}
${projectMetrics.completionRate > 75 ? '🎯 **Excellent Progress**: Project is on track for completion' : projectMetrics.completionRate > 50 ? '⚠️ **Moderate Progress**: Consider accelerating key tasks' : '🔴 **Needs Attention**: Project may need resource reallocation'}

**Recommendations:**
• Schedule daily standups for better coordination
• Review and prioritize overdue tasks
• Consider breaking down complex tasks into smaller chunks`;
    }
    
    if (lowerInput.includes('allocat') || lowerInput.includes('assign')) {
      const workload = teamMembers.map(member => {
        const assignedTasks = tasks.filter(t => t.assigneeId === member.id && t.status !== 'completed');
        const completedTasks = tasks.filter(t => t.assigneeId === member.id && t.status === 'completed');
        return { member, active: assignedTasks.length, completed: completedTasks.length };
      });
      
      const maxLoad = Math.max(...workload.map(w => w.active));
      const minLoad = Math.min(...workload.map(w => w.active));
      
      return `👥 **Team Allocation Analysis:**

**Current Workload Distribution:**
${workload.map(w => `• **${w.member.name}**: ${w.active} active tasks, ${w.completed} completed`).join('\n')}

**Load Balancing:**
${maxLoad - minLoad > 2 ? '⚖️ **Imbalance Detected**: Consider redistributing tasks' : '✅ **Well Balanced**: Workload is evenly distributed'}

**Smart Allocation Suggestions:**
• **Frontend Tasks** → Sarah Johnson (UI/UX expertise)
• **Backend Development** → Mike Chen (API specialist)
• **Code Reviews** → Alex Thompson (Senior developer)
• **Project Coordination** → David Kim (Management focus)

**Optimization Tips:**
• Pair junior developers with seniors for knowledge transfer
• Rotate code review responsibilities to prevent bottlenecks
• Consider skill development opportunities in task assignments`;
    }
    
    if (lowerInput.includes('deadline') || lowerInput.includes('schedule')) {
      const upcomingTasks = tasks.filter(t => {
        const dueDate = new Date(t.dueDate);
        const today = new Date();
        const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilDue <= 7 && daysUntilDue >= 0 && t.status !== 'completed';
      });
      
      return `📅 **Upcoming Deadlines (Next 7 Days):**

${upcomingTasks.length > 0 ? upcomingTasks.map(t => {
  const daysLeft = Math.ceil((new Date(t.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const assignee = teamMembers.find(m => m.id === t.assigneeId);
  return `• **${t.title}** - ${daysLeft} day${daysLeft !== 1 ? 's' : ''} left
  Priority: ${t.priority} | Assignee: ${assignee?.name || 'Unassigned'}`;
}).join('\n') : '✅ **No Urgent Deadlines**: All tasks are on schedule'}

**Timeline Recommendations:**
• Schedule check-ins 2 days before each deadline
• Set up automated reminders for assignees
• Prepare contingency plans for high-priority tasks
• Consider extending deadlines if quality might be compromised

**Risk Assessment:**
${upcomingTasks.filter(t => t.priority === 'high').length > 0 ? '🔴 High-priority tasks approaching - monitor closely' : '🟡 Standard monitoring recommended'}`;
    }
    
    return `I understand you're asking about "${input}". Based on your current project data:

🎯 **Current Project Snapshot:**
• **Total Tasks**: ${projectMetrics.totalTasks}
• **Completion Rate**: ${projectMetrics.completionRate}%
• **Team Members**: ${teamMembers.length} active
• **Critical Tasks**: ${projectMetrics.highPriorityTasks} high-priority

**AI Recommendations:**
• **Focus Areas**: Prioritize high-impact tasks first
• **Team Coordination**: Maintain regular communication
• **Risk Management**: Monitor dependencies and blockers
• **Quality Assurance**: Ensure proper code review processes

**Next Steps:**
1. Review task priorities and deadlines
2. Check team capacity and availability
3. Identify potential bottlenecks
4. Plan for upcoming milestones

Would you like me to dive deeper into any specific area? I can provide detailed analysis on team performance, project timelines, or resource optimization.`;
  };

  return (
    <div className="h-full flex bg-white dark:bg-gray-800 transition-colors">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AI Project Manager</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your intelligent project management assistant</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInput(suggestion.text)}
                className={`flex items-center gap-3 p-3 text-left border rounded-lg hover:shadow-sm transition-all ${suggestion.color} dark:border-gray-600`}
              >
                <suggestion.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{suggestion.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex items-start gap-4 ${
                  message.type === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.type === 'assistant' && (
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-2xl p-4 rounded-xl ${
                    message.type === 'user'
                      ? 'bg-blue-600 dark:bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                  <div className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-100 dark:text-blue-200' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                {message.type === 'user' && (
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me about your project..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar with Project Metrics */}
      <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 p-6 transition-colors">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Insights</h3>
        
        <div className="space-y-4">
          {/* Completion Rate */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="font-medium text-gray-900 dark:text-white">Completion Rate</span>
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{projectMetrics.completionRate}%</div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
              <div
                className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${projectMetrics.completionRate}%` }}
              />
            </div>
          </div>

          {/* Active Tasks */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">Active Tasks</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{projectMetrics.inProgressTasks}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>

          {/* Overdue Tasks */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="font-medium text-gray-900">Overdue</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{projectMetrics.overdueTasks}</div>
            <div className="text-sm text-gray-600">Need Attention</div>
          </div>

          {/* Team Performance */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-900">Team Performance</span>
            </div>
            <div className="space-y-2">
              {teamMembers.slice(0, 3).map(member => {
                const memberTasks = tasks.filter(t => t.assigneeId === member.id);
                const completed = memberTasks.filter(t => t.status === 'completed').length;
                const rate = memberTasks.length > 0 ? Math.round((completed / memberTasks.length) * 100) : 0;
                
                return (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}&size=24`}
                        alt={member.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-gray-700">{member.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{rate}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;