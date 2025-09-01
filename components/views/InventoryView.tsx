import React, { useState, FormEvent } from 'react';
import { InventoryItem } from '../../types';
import { TrashIcon, ArchiveBoxIcon } from '../Icons';

interface InventoryViewProps {
    inventory: InventoryItem[];
    addInventoryItem: (item: Omit<InventoryItem, 'id' | 'status'>) => void;
    deleteInventoryItem: (id: string) => void;
}

const InventoryView: React.FC<InventoryViewProps> = ({ inventory, addInventoryItem, deleteInventoryItem }) => {
    const [newItem, setNewItem] = useState({ name: '', stock: '', unitCost: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const stockNum = parseInt(newItem.stock, 10);
        const unitCostNum = parseFloat(newItem.unitCost);

        if (newItem.name && !isNaN(stockNum) && !isNaN(unitCostNum) && stockNum >= 0 && unitCostNum >= 0) {
            addInventoryItem({
                name: newItem.name,
                stock: stockNum,
                unitCost: unitCostNum,
            });
            setNewItem({ name: '', stock: '', unitCost: '' });
        } else {
            alert("Please fill in all fields with valid numbers.");
        }
    };

    const getStatusColor = (status: InventoryItem['status']) => {
        switch (status) {
            case 'In Stock': return 'bg-green-100 text-green-800';
            case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
            case 'Out of Stock': return 'bg-red-100 text-red-800';
        }
    };
    
    return (
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
            <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <ArchiveBoxIcon className="h-6 w-6 mr-3 text-brand-primary" />
                    Add New Inventory Item
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="col-span-1 md:col-span-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Item Name</label>
                        <input type="text" name="name" id="name" value={newItem.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm p-2" placeholder="e.g., Burger Buns" />
                    </div>
                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                        <input type="number" name="stock" id="stock" value={newItem.stock} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm p-2" placeholder="e.g., 150" />
                    </div>
                    <div>
                        <label htmlFor="unitCost" className="block text-sm font-medium text-gray-700">Unit Cost ($)</label>
                        <input type="number" name="unitCost" id="unitCost" step="0.01" value={newItem.unitCost} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm p-2" placeholder="e.g., 0.50" />
                    </div>
                    <div className="col-span-1 md:col-span-4 flex justify-end">
                         <button type="submit" className="bg-brand-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto">
                            Add Item
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-md">
                 <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Inventory</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Product Name</th>
                                <th scope="col" className="px-6 py-3">Stock Level</th>
                                <th scope="col" className="px-6 py-3">Unit Cost</th>
                                <th scope="col" className="px-6 py-3">Total Value</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map(item => (
                                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.name}</th>
                                    <td className="px-6 py-4">{item.stock}</td>
                                    <td className="px-6 py-4">${item.unitCost.toFixed(2)}</td>
                                    <td className="px-6 py-4">${(item.stock * item.unitCost).toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => deleteInventoryItem(item.id)} className="text-gray-400 hover:text-red-500">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default InventoryView;
