import React, { useState, useRef } from 'react';
import { Upload, Download, FileSpreadsheet, Check, X, Edit3 } from 'lucide-react';
import { ExcelData } from '../types';

interface ExcelTrackingViewProps {
  projectName: string;
}

const ExcelTrackingView: React.FC<ExcelTrackingViewProps> = ({ projectName }) => {
  const [excelFiles, setExcelFiles] = useState<ExcelData[]>([]);
  const [selectedFile, setSelectedFile] = useState<ExcelData | null>(null);
  const [checklistItems, setChecklistItems] = useState<Array<{
    id: string;
    text: string;
    completed: boolean;
    category: string;
  }>>([
    { id: '1', text: 'Project requirements gathering', completed: true, category: 'Planning' },
    { id: '2', text: 'Technical architecture design', completed: true, category: 'Planning' },
    { id: '3', text: 'Database schema design', completed: false, category: 'Development' },
    { id: '4', text: 'API endpoints implementation', completed: false, category: 'Development' },
    { id: '5', text: 'Frontend components development', completed: false, category: 'Development' },
    { id: '6', text: 'Unit testing implementation', completed: false, category: 'Testing' },
    { id: '7', text: 'Integration testing', completed: false, category: 'Testing' },
    { id: '8', text: 'User acceptance testing', completed: false, category: 'Testing' },
    { id: '9', text: 'Performance optimization', completed: false, category: 'Optimization' },
    { id: '10', text: 'Security audit', completed: false, category: 'Security' },
    { id: '11', text: 'Documentation completion', completed: false, category: 'Documentation' },
    { id: '12', text: 'Deployment preparation', completed: false, category: 'Deployment' }
  ]);
  const [newItem, setNewItem] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Development');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['Planning', 'Development', 'Testing', 'Optimization', 'Security', 'Documentation', 'Deployment'];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const newExcelFile: ExcelData = {
          id: Date.now().toString(),
          name: file.name,
          content: content,
          uploadedAt: new Date().toISOString()
        };
        setExcelFiles(prev => [...prev, newExcelFile]);
        setSelectedFile(newExcelFile);
      };
      reader.readAsText(file);
    }
  };

  const toggleChecklistItem = (id: string) => {
    setChecklistItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const addChecklistItem = () => {
    if (newItem.trim()) {
      const newChecklistItem = {
        id: Date.now().toString(),
        text: newItem.trim(),
        completed: false,
        category: selectedCategory
      };
      setChecklistItems(prev => [...prev, newChecklistItem]);
      setNewItem('');
    }
  };

  const getCompletionStats = () => {
    const total = checklistItems.length;
    const completed = checklistItems.filter(item => item.completed).length;
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const getItemsByCategory = (category: string) => {
    return checklistItems.filter(item => item.category === category);
  };

  const stats = getCompletionStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{projectName} - Excel Tracking</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Upload and manage Excel documents for project tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Excel
          </button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Project Progress</h2>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
          <div
            className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>{stats.completed} of {stats.total} tasks completed</span>
          <span>{stats.total - stats.completed} remaining</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Excel Files */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Uploaded Files</h2>
          {excelFiles.length > 0 ? (
            <div className="space-y-3">
              {excelFiles.map(file => (
                <div
                  key={file.id}
                  onClick={() => setSelectedFile(file)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedFile?.id === file.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No Excel files uploaded yet</p>
            </div>
          )}
        </div>

        {/* Checklist */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Project Checklist</h2>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
              <Edit3 className="w-4 h-4 inline mr-1" />
              Edit
            </button>
          </div>

          {/* Add New Item */}
          <div className="flex gap-2 mb-6">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addChecklistItem()}
              placeholder="Add new checklist item..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addChecklistItem}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Add
            </button>
          </div>

          {/* Checklist by Category */}
          <div className="space-y-6">
            {categories.map(category => {
              const categoryItems = getItemsByCategory(category);
              if (categoryItems.length === 0) return null;

              const completedInCategory = categoryItems.filter(item => item.completed).length;
              const categoryPercentage = Math.round((completedInCategory / categoryItems.length) * 100);

              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900 dark:text-white">{category}</h3>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {completedInCategory}/{categoryItems.length} ({categoryPercentage}%)
                    </span>
                  </div>
                  <div className="space-y-2">
                    {categoryItems.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <button
                          onClick={() => toggleChecklistItem(item.id)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            item.completed
                              ? 'bg-green-600 border-green-600 text-white'
                              : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                          }`}
                        >
                          {item.completed && <Check className="w-3 h-3" />}
                        </button>
                        <span className={`flex-1 ${
                          item.completed 
                            ? 'text-gray-500 dark:text-gray-400 line-through' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelTrackingView;