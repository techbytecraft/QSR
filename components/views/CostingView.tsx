import React, { useState, useMemo, ChangeEvent, FormEvent } from 'react';
import { Dish, InventoryItem, Ingredient } from '../../types';
import { BanknotesIcon, ChevronDownIcon, DocumentArrowUpIcon, PlusIcon, TrashIcon } from '../Icons';
import { parseInvoiceForIngredients } from '../../services/geminiService';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Helper to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove the data URL prefix e.g. "data:image/png;base64,"
            resolve(result.split(',')[1]);
        };
        reader.onerror = error => reject(error);
    });
};

// Sub-component for adding ingredients to a dish
const AddIngredientForm: React.FC<{
    dish: Dish;
    inventory: InventoryItem[];
    updateDish: (dish: Dish) => void;
}> = ({ dish, inventory, updateDish }) => {
    const [selectedInventoryId, setSelectedInventoryId] = useState<string>(inventory[0]?.id || '');
    const [quantity, setQuantity] = useState<string>('1');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const quantNum = parseFloat(quantity);
        if (!selectedInventoryId || isNaN(quantNum) || quantNum <= 0) {
            alert("Please select a valid ingredient and quantity.");
            return;
        }

        const existingIngredient = dish.ingredients.find(ing => ing.inventoryId === selectedInventoryId);

        if (existingIngredient) {
            alert("This ingredient is already in the dish. Please remove the existing one to add it again with a new quantity.");
            return;
        }

        const newIngredient: Ingredient = {
            inventoryId: selectedInventoryId,
            quantity: quantNum,
        };

        const updatedDish = {
            ...dish,
            ingredients: [...dish.ingredients, newIngredient],
        };
        updateDish(updatedDish);
        setQuantity('1');
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-50 rounded-lg flex items-end gap-4">
            <div>
                <label htmlFor={`ingredient-select-${dish.id}`} className="block text-xs font-medium text-gray-700">Ingredient</label>
                <select
                    id={`ingredient-select-${dish.id}`}
                    value={selectedInventoryId}
                    onChange={(e) => setSelectedInventoryId(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm p-2"
                >
                    {inventory.map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor={`quantity-input-${dish.id}`} className="block text-xs font-medium text-gray-700">Quantity</label>
                <input
                    id={`quantity-input-${dish.id}`}
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    step="0.01"
                    min="0.01"
                    className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm p-2"
                />
            </div>
            <button type="submit" className="bg-brand-secondary text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors flex items-center">
                <PlusIcon className="h-5 w-5 mr-1" />
                Add
            </button>
        </form>
    );
};


// Invoice Parser Component (inside CostingView)
const InvoiceParser: React.FC<{
    addMultipleInventoryItems: (items: Omit<InventoryItem, 'id' | 'status'>[]) => void;
}> = ({ addMultipleInventoryItems }) => {
    const [isParsing, setIsParsing] = useState(false);
    const [parsedItems, setParsedItems] = useState<Omit<InventoryItem, 'id' | 'status'>[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setIsParsing(true);
        setError(null);
        setParsedItems([]);

        try {
            if (!file.type.startsWith('image/')) {
                throw new Error("Please upload an image file (PNG, JPG, etc).");
            }
            const base64Data = await fileToBase64(file);
            const items = await parseInvoiceForIngredients({
                mimeType: file.type,
                data: base64Data,
            });

            if (items.length === 0) {
                setError("Could not extract any items from the invoice. The image might be unclear or not an invoice.");
            } else {
                setParsedItems(items);
            }
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "An unknown error occurred during parsing.");
        } finally {
            setIsParsing(false);
        }
    };

    const handleConfirmAdd = () => {
        addMultipleInventoryItems(parsedItems);
        setParsedItems([]);
        setFileName(null);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <DocumentArrowUpIcon className="h-6 w-6 mr-3 text-brand-primary" />
                Add Ingredients from Invoice
            </h2>
            <div className="flex items-center gap-4">
                 <label htmlFor="invoice-upload" className="flex-1 cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-100 transition">
                    <input type="file" id="invoice-upload" className="hidden" onChange={handleFileChange} accept="image/*" disabled={isParsing} />
                    <div className="flex flex-col items-center justify-center">
                       <DocumentArrowUpIcon className="h-10 w-10 text-gray-400 mb-2"/>
                       <p className="font-semibold text-brand-primary">{fileName || "Click to upload an invoice image"}</p>
                       <p className="text-xs text-gray-500 mt-1">AI will read and extract items</p>
                    </div>
                </label>
                {isParsing && (
                    <div className="text-gray-600">
                        <p>Parsing invoice...</p>
                        <p className="text-sm text-gray-500">This may take a moment.</p>
                    </div>
                )}
            </div>

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

            {parsedItems.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-semibold text-gray-700">Extracted Items:</h3>
                    <ul className="mt-2 space-y-2 text-sm max-h-48 overflow-y-auto p-2 border rounded-md">
                        {parsedItems.map((item, index) => (
                            <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span><strong>{item.name}</strong></span>
                                <span>Qty: {item.stock}</span>
                                <span>Cost: ${item.unitCost.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-end gap-4 mt-4">
                        <button onClick={() => { setParsedItems([]); setFileName(null);}} className="text-sm font-semibold text-gray-600 hover:text-gray-800">Cancel</button>
                        <button onClick={handleConfirmAdd} className="bg-brand-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                            Add to Inventory
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280'];

const CostBreakdownChart: React.FC<{ dish: Dish; inventoryMap: Map<string, InventoryItem> }> = ({ dish, inventoryMap }) => {
    const chartData = useMemo(() => {
        if (!dish.ingredients.length) return [];

        const ingredientCosts = dish.ingredients
            .map(ingredient => {
                const item = inventoryMap.get(ingredient.inventoryId);
                if (!item) return { name: 'Unknown', value: 0 };
                return {
                    name: item.name,
                    value: ingredient.quantity * item.unitCost,
                };
            })
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value);

        if (ingredientCosts.length <= 5) {
            return ingredientCosts;
        }

        const topIngredients = ingredientCosts.slice(0, 4);
        const otherCost = ingredientCosts.slice(4).reduce((sum, item) => sum + item.value, 0);

        return [
            ...topIngredients,
            { name: 'Other Ingredients', value: otherCost },
        ];
    }, [dish, inventoryMap]);

    if (chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-sm text-gray-500">
                <p>No ingredients to display in chart.</p>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                        if (percent === 0) return null;
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                        return (
                            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12}>
                                {`${(percent * 100).toFixed(0)}%`}
                            </text>
                        );
                    }}
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{fontSize: '12px'}}/>
            </PieChart>
        </ResponsiveContainer>
    );
};


interface CostingViewProps {
    dishes: Dish[];
    inventory: InventoryItem[];
    updateDish: (dish: Dish) => void;
    addMultipleInventoryItems: (items: Omit<InventoryItem, 'id' | 'status'>[]) => void;
}

const CostingView: React.FC<CostingViewProps> = ({ dishes, inventory, updateDish, addMultipleInventoryItems }) => {
    const [expandedDishId, setExpandedDishId] = useState<string | null>(null);

    const inventoryMap = useMemo(() => {
        return new Map(inventory.map(item => [item.id, item]));
    }, [inventory]);

    const calculateDishCost = (dish: Dish) => {
        return dish.ingredients.reduce((total, ingredient) => {
            const inventoryItem = inventoryMap.get(ingredient.inventoryId);
            if (!inventoryItem) return total;
            return total + (ingredient.quantity * inventoryItem.unitCost);
        }, 0);
    };

    const handleToggle = (dishId: string) => {
        setExpandedDishId(expandedDishId === dishId ? null : dishId);
    };
    
    const removeIngredient = (dish: Dish, ingredientId: string) => {
        const updatedDish = {
            ...dish,
            ingredients: dish.ingredients.filter(ing => ing.inventoryId !== ingredientId),
        };
        updateDish(updatedDish);
    };

    return (
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
            <InvoiceParser addMultipleInventoryItems={addMultipleInventoryItems} />
            
            <div className="bg-white p-6 rounded-2xl shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <BanknotesIcon className="h-6 w-6 mr-3 text-brand-primary" />
                    Production Costing Analysis
                </h2>
                <div className="space-y-4">
                    {dishes.map(dish => {
                        const totalCost = calculateDishCost(dish);
                        const isExpanded = expandedDishId === dish.id;
                        return (
                            <div key={dish.id} className="border border-gray-200 rounded-lg">
                                <button
                                    onClick={() => handleToggle(dish.id)}
                                    className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 focus:outline-none"
                                    aria-expanded={isExpanded}
                                >
                                    <div>
                                        <p className="font-semibold text-gray-800">{dish.name}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="text-gray-600 mr-4">
                                            Total Cost: <span className="font-bold text-brand-primary">${totalCost.toFixed(2)}</span>
                                        </p>
                                        <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                    </div>
                                </button>
                                {isExpanded && (
                                    <div className="p-4 border-t border-gray-200">
                                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                            <div className="lg:col-span-3">
                                                <h4 className="font-semibold text-sm text-gray-600 mb-2">Cost Breakdown:</h4>
                                                <table className="w-full text-sm text-left text-gray-500">
                                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                                        <tr>
                                                            <th scope="col" className="px-4 py-2">Ingredient</th>
                                                            <th scope="col" className="px-4 py-2">Quantity</th>
                                                            <th scope="col" className="px-4 py-2">Unit Cost</th>
                                                            <th scope="col" className="px-4 py-2">Subtotal</th>
                                                            <th scope="col" className="px-4 py-2"><span className="sr-only">Actions</span></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dish.ingredients.map(ingredient => {
                                                            const item = inventoryMap.get(ingredient.inventoryId);
                                                            if (!item) return null;
                                                            const subtotal = ingredient.quantity * item.unitCost;
                                                            return (
                                                                <tr key={ingredient.inventoryId} className="bg-white border-b hover:bg-gray-50 text-xs">
                                                                    <td className="px-4 py-2 font-medium text-gray-900">{item.name}</td>
                                                                    <td className="px-4 py-2">{ingredient.quantity}</td>
                                                                    <td className="px-4 py-2">${item.unitCost.toFixed(2)}</td>
                                                                    <td className="px-4 py-2">${subtotal.toFixed(2)}</td>
                                                                    <td className="px-4 py-2 text-right">
                                                                        <button onClick={() => removeIngredient(dish, ingredient.inventoryId)} className="text-gray-400 hover:text-red-500">
                                                                            <TrashIcon className="h-4 w-4" />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                                <AddIngredientForm dish={dish} inventory={inventory} updateDish={updateDish} />
                                            </div>
                                            <div className="lg:col-span-2">
                                                 <h4 className="font-semibold text-sm text-gray-600 mb-2">Cost Contribution:</h4>
                                                 <div className="bg-gray-50 p-2 rounded-lg h-full min-h-[250px] flex items-center justify-center">
                                                    <CostBreakdownChart dish={dish} inventoryMap={inventoryMap} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
};

export default CostingView;