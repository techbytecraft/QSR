import React, { useState, useCallback } from 'react';
import { Task } from '../../types';
import { ClipboardDocumentListIcon } from '../Icons';

interface TasksProps {
    tasks: Task[];
    setTasks: (tasks: Task[]) => void;
}

const Tasks: React.FC<TasksProps> = ({ tasks, setTasks }) => {
  const [newTask, setNewTask] = useState('');

  const handleAddTask = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    const newTaskObject: Task = {
      id: Date.now(),
      text: newTask.trim(),
      completed: false,
    };
    setTasks([...tasks, newTaskObject]);
    setNewTask('');
  }, [newTask, tasks, setTasks]);

  const handleToggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <ClipboardDocumentListIcon className="h-6 w-6 mr-2 text-brand-primary" />
        My Tasks
      </h3>
      <form onSubmit={handleAddTask} className="flex mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow border border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
        <button type="submit" className="bg-brand-primary text-white px-4 rounded-r-md hover:bg-blue-700 transition-colors">
          Add
        </button>
      </form>
      <div className="flex-1 overflow-y-auto pr-2">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md group">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTask(task.id)}
                className="h-5 w-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
              />
              <span className={`ml-3 text-sm text-gray-700 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                {task.text}
              </span>
            </label>
            <button onClick={() => handleDeleteTask(task.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                ✕
            </button>
          </div>
        ))}
        {tasks.length === 0 && (
            <div className="text-center text-gray-500 pt-8">
                <p>No tasks yet. Add one above!</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
