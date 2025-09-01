
import React, { useState, useMemo } from 'react';
import { InventoryItem, Timeframe } from '../../types';

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


const InventoryStatus: React.FC<{ inventory: InventoryItem[] }> = ({ inventory }) => {
    const [timeframe, setTimeframe] = useState<Timeframe>('weekly');
    const [lowStockThreshold, setLowStockThreshold] = useState<number>(20);
    const [outOfStockThreshold, setOutOfStockThreshold] = useState<number>(0);

    const filteredInventory = useMemo(() => {
        switch (timeframe) {
            case 'daily':
                // The 'Daily' view shows all items with stock below the configurable "Low Stock" threshold.
                return inventory.filter(item => item.stock < lowStockThreshold);
            case 'monthly':
                 return inventory.filter(item => item.stock > 100);
            case 'weekly':
            default:
                return inventory;
        }
    }, [inventory, timeframe, lowStockThreshold]);

    const getStatusColor = (status: InventoryItem['status']) => {
        switch (status) {
            case 'In Stock':
                return 'bg-green-100 text-green-800';
            case 'Low Stock':
                return 'bg-yellow-100 text-yellow-800';
            case 'Out of Stock':
                return 'bg-red-100 text-red-800';
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md col-span-1 lg:col-span-2 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                <h3 className="text-lg font-semibold text-gray-800 whitespace-nowrap">Inventory Status</h3>
                <TimeframeToggle activeTimeframe={timeframe} setTimeframe={setTimeframe} />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 text-sm text-gray-600 border-t pt-4">
                <div className="flex items-center gap-2">
                    <label htmlFor="lowStock" className="font-medium">Low Stock:</label>
                    <input
                        type="number"
                        id="lowStock"
                        value={lowStockThreshold}
                        onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                        className="w-20 p-1 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                        aria-label="Low stock threshold"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label htmlFor="outOfStock" className="font-medium">Out of Stock:</label>
                    <input
                        type="number"
                        id="outOfStock"
                        value={outOfStockThreshold}
                        onChange={(e) => setOutOfStockThreshold(Number(e.target.value))}
                        className="w-20 p-1 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                        aria-label="Out of stock threshold"
                    />
                </div>
                 <p className="text-xs text-gray-500 sm:ml-auto">Set thresholds for the 'Daily' view.</p>
            </div>
            <div className="flex-1 overflow-y-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3">Product Name</th>
                            <th scope="col" className="px-6 py-3">Stock Level</th>
                            <th scope="col" className="px-6 py-3">Unit Cost</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInventory.length > 0 ? filteredInventory.map((item) => (
                            <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {item.name}
                                </th>
                                <td className="px-6 py-4">{item.stock}</td>
                                <td className="px-6 py-4">${item.unitCost.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="text-center py-10 text-gray-500">
                                    No items match the current filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryStatus;
