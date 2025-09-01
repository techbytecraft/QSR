
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { YearlyComparisonData } from '../../types';

const data: YearlyComparisonData[] = [
  { name: 'Q1', 'Last Year': 4000, 'This Year': 4400 },
  { name: 'Q2', 'Last Year': 3000, 'This Year': 3500 },
  { name: 'Q3', 'Last Year': 2000, 'This Year': 2800 },
  { name: 'Q4', 'Last Year': 2780, 'This Year': 3100 },
];

const YearlyComparisonChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Year-over-Year Comparison (Revenue)</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
            <Legend wrapperStyle={{ fontSize: '14px' }} />
            <Bar dataKey="Last Year" fill="#A5B4FC" radius={[4, 4, 0, 0]} />
            <Bar dataKey="This Year" fill="#4F46E5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default YearlyComparisonChart;
