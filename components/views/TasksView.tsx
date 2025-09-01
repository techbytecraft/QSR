import React from 'react';
import TasksWidget from '../dashboard/Tasks';
import { Task } from '../../types';

interface TasksViewProps {
    tasks: Task[];
    setTasks: (tasks: Task[]) => void;
}

const TasksView: React.FC<TasksViewProps> = ({ tasks, setTasks }) => {
    return (
        <main className="flex-1 p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              <TasksWidget tasks={tasks} setTasks={setTasks} />
            </div>
        </main>
    );
};

export default TasksView;
