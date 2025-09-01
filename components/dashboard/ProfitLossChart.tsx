
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ProfitLossData } from '../../types';

const data: ProfitLossData[] = [
    { name: 'Jan', profit: 4000, loss: 2400 },
    { name: 'Feb', profit: 3000, loss: 1398 },
    { name: 'Mar', profit: 2000, loss: 9800 },
    { name: 'Apr', profit: 2780, loss: 3908 },
    { name: 'May', profit: 1890, loss: 4800 },
    { name: 'Jun', profit: 2390, loss: 3800 },
];

const ProfitLossChart: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md col-span-1 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Profit & Loss Overview</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart
                        data={data}
                        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                        <Tooltip
                            cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}
                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '14px' }}/>
                        <Bar dataKey="profit" fill="#10B981" name="Profit" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="loss" fill="#EF4444" name="Loss" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ProfitLossChart;
