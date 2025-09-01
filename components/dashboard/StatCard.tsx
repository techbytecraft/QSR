
import React from 'react';
import { StatCardData } from '../../types';
import { ArrowTrendingUpIcon } from '../Icons';

const StatCard: React.FC<{ data: StatCardData }> = ({ data }) => {
    const isIncrease = data.changeType === 'increase';
    const changeColor = isIncrease ? 'text-green-500' : 'text-red-500';
    const bgColor = isIncrease ? 'bg-green-100' : 'bg-red-100';

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-between transition-transform hover:scale-105 duration-300">
            <div>
                <p className="text-sm font-medium text-gray-500">{data.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{data.value}</p>
                <div className={`flex items-center mt-2 text-sm ${changeColor}`}>
                    <ArrowTrendingUpIcon className={`h-4 w-4 mr-1 ${!isIncrease && 'transform rotate-180'}`} />
                    <span>{data.change} vs last month</span>
                </div>
            </div>
            <div className="p-3 bg-brand-primary/10 rounded-full">
                <data.icon className="h-8 w-8 text-brand-primary" />
            </div>
        </div>
    );
};

export default StatCard;
