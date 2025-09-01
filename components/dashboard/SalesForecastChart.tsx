import React, { useState, useCallback, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ForecastData, Timeframe } from '../../types';
import { getForecastAnalysis } from '../../services/geminiService';
import { SparklesIcon } from '../Icons';

interface SalesForecastChartProps {
    salesData: {
        daily: ForecastData[];
        weekly: ForecastData[];
        monthly: ForecastData[];
    };
}

const TimeframeToggle: React.FC<{ activeTimeframe: Timeframe, setTimeframe: (timeframe: Timeframe) => void }> = ({ activeTimeframe, setTimeframe }) => {
    const timeframes: { id: Timeframe, label: string }[] = [
        { id: 'daily', label: 'Daily' },
        { id: 'weekly', label: 'Weekly' },
        { id: 'monthly', label: 'Monthly' },
    ];
    return (
        <div className="flex p-1 bg-gray-100 rounded-lg">
            {timeframes.map(({ id, label }) => (
                <button
                    key={id}
                    onClick={() => setTimeframe(id)}
                    className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-200 ${
                        activeTimeframe === id ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};


const SalesForecastChart: React.FC<SalesForecastChartProps> = ({ salesData }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState('');
    const [timeframe, setTimeframe] = useState<Timeframe>('monthly');

    const chartData = useMemo(() => {
        switch (timeframe) {
            case 'daily': return salesData.daily;
            case 'weekly': return salesData.weekly;
            case 'monthly': return salesData.monthly;
            default: return salesData.monthly;
        }
    }, [timeframe, salesData]);

    const handleGetAnalysis = useCallback(async () => {
        setIsLoading(true);
        setAnalysis('');
        try {
            const result = await getForecastAnalysis(chartData, timeframe);
            setAnalysis(result);
        } catch (error) {
            console.error(error);
            setAnalysis("Failed to retrieve analysis.");
        } finally {
            setIsLoading(false);
        }
    }, [chartData, timeframe]);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md col-span-1 lg:col-span-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                 <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800">Sales Forecast vs. Actual</h3>
                    <p className="text-sm text-gray-500">Performance review</p>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                   <TimeframeToggle activeTimeframe={timeframe} setTimeframe={setTimeframe} />
                   <button
                        onClick={handleGetAnalysis}
                        disabled={isLoading}
                        className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                    >
                        <SparklesIcon className="h-5 w-5 mr-2"/>
                        <span className="whitespace-nowrap">{isLoading ? 'Analyzing...' : 'Get AI Analysis'}</span>
                    </button>
                </div>
            </div>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="period" tick={{ fill: '#6B7280', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}/>
                        <Legend wrapperStyle={{ fontSize: '14px' }}/>
                        <Line type="monotone" dataKey="forecast" stroke="#3B82F6" strokeWidth={2} name="Forecasted Sales" />
                        <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={2} name="Actual Sales" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            {analysis && (
                 <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">AI-Powered Analysis ({timeframe})</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{analysis}</p>
                </div>
            )}
        </div>
    );
};

export default SalesForecastChart;
