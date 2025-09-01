import React from 'react';
import { ChartBarIcon, ArchiveBoxIcon, ArrowTrendingUpIcon, ClipboardDocumentListIcon, SparklesIcon, BanknotesIcon, EnvironmentIcon } from './Icons';
import { View } from '../types';

interface SidebarProps {
    activeView: View;
    onNavigate: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {

    const navItems = [
        { name: 'Dashboard', icon: ChartBarIcon },
        { name: 'Inventory', icon: ArchiveBoxIcon },
        { name: 'Forecasting', icon: ArrowTrendingUpIcon },
        { name: 'Tasks', icon: ClipboardDocumentListIcon },
        { name: 'Reports', icon: SparklesIcon },
        { name: 'Costing', icon: BanknotesIcon },
        { name: 'Environment', icon: EnvironmentIcon },
    ];

    return (
        <div className="w-64 bg-brand-dark text-gray-300 flex flex-col min-h-screen">
            <div className="h-20 flex items-center justify-center border-b border-gray-700">
                <h1 className="text-2xl font-bold text-white tracking-wider">QSR Synergy Suite</h1>
            </div>
            <nav className="flex-1 px-4 py-6">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.name} className="mb-2">
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onNavigate(item.name as View);
                                }}
                                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                                    activeView === item.name
                                        ? 'bg-brand-primary text-white'
                                        : 'hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                <item.icon className="h-6 w-6 mr-3" />
                                <span className="font-medium">{item.name}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t border-gray-700">
                <div className="p-4 bg-gray-700 rounded-lg text-center">
                    <h3 className="font-bold text-white">Need Help?</h3>
                    <p className="text-sm mt-1">Check our documentation or contact support.</p>
                    <button className="mt-4 w-full bg-brand-primary text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Get Help
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;