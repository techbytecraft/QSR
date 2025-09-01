
import React, { useState, useCallback } from 'react';
import { getCostOptimizationInsights } from '../../services/geminiService';
import { InventoryItem } from '../../types';
import { SparklesIcon } from '../Icons';

const CostOptimizationAI: React.FC<{ inventory: InventoryItem[] }> = ({ inventory }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [insights, setInsights] = useState('');

    const handleGenerateInsights = useCallback(async () => {
        setIsLoading(true);
        setInsights('');
        try {
            const result = await getCostOptimizationInsights(inventory);
            setInsights(result);
        } catch (error) {
            console.error(error);
            setInsights('Failed to generate insights.');
        } finally {
            setIsLoading(false);
        }
    }, [inventory]);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Cost Optimization</h3>
            <div className="flex-1 p-4 bg-gray-50 rounded-lg overflow-y-auto text-sm text-gray-600">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <p>Generating insights...</p>
                    </div>
                ) : insights ? (
                    <p className="whitespace-pre-wrap">{insights}</p>
                ) : (
                    <div className="text-center text-gray-500 flex flex-col items-center justify-center h-full">
                       <SparklesIcon className="h-10 w-10 mb-2"/>
                       <p>Click the button below to generate AI-powered suggestions for optimizing your inventory costs.</p>
                    </div>
                )}
            </div>
            <button
                onClick={handleGenerateInsights}
                disabled={isLoading}
                className="w-full bg-brand-secondary text-white py-3 rounded-lg mt-4 flex items-center justify-center hover:bg-emerald-500 disabled:bg-emerald-300 transition-colors"
            >
                {isLoading ? 'Generating...' : 'Generate Costing Insights'}
            </button>
        </div>
    );
};

export default CostOptimizationAI;
