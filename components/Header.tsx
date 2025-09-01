
import React from 'react';
import { BellIcon } from './Icons';

interface HeaderProps {
    title: string;
    restaurants: { id: string; name: string }[];
    selectedRestaurantId: string;
    onRestaurantChange: (id: string) => void;
}

const Header: React.FC<HeaderProps> = ({ title, restaurants, selectedRestaurantId, onRestaurantChange }) => {
    return (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <div className="flex items-center gap-6">
                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                <div className="flex items-center space-x-2">
                    <label htmlFor="restaurant-select" className="text-sm font-medium text-gray-600 whitespace-nowrap">
                        Location:
                    </label>
                    <select
                        id="restaurant-select"
                        value={selectedRestaurantId}
                        onChange={(e) => onRestaurantChange(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md"
                        aria-label="Select Restaurant"
                    >
                        {restaurants.map(r => (
                            <option key={r.id} value={r.id}>
                                {r.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex items-center space-x-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-4 pr-10 py-2 w-64 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                    <svg className="h-5 w-5 text-gray-400 absolute top-1/2 right-4 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <button className="relative text-gray-500 hover:text-gray-700">
                    <BellIcon className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
                </button>
                <div className="flex items-center space-x-3">
                    <img
                        className="h-10 w-10 rounded-full object-cover"
                        src="https://picsum.photos/100"
                        alt="User Avatar"
                    />
                    <div>
                        <p className="font-semibold text-gray-800 text-sm">Alex Turner</p>
                        <p className="text-xs text-gray-500">Partner / Manager</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;