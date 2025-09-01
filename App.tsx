import React, { useState, useCallback, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { StatCardData, InventoryItem, View, Task, Restaurant, Dish, Ingredient, YearlyComparisonData } from './types';
import { CurrencyDollarIcon, ArchiveBoxIcon, ChartBarIcon, BuildingStorefrontIcon, BanknotesIcon, ArrowTrendingUpIcon } from './components/Icons';
import DashboardView from './components/views/DashboardView';
import InventoryView from './components/views/InventoryView';
import ForecastingView from './components/views/ForecastingView';
import TasksView from './components/views/TasksView';
import ReportsView from './components/views/ReportsView';
import CostingView from './components/views/CostingView';
import EnvironmentView from './components/views/EnvironmentView';
import { mockRestaurants } from './data/mockData';

const getStatus = (stock: number): InventoryItem['status'] => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 40) return 'Low Stock';
    return 'In Stock';
};

const App: React.FC = () => {
    const [view, setView] = useState<View>('Dashboard');
    const [allRestaurantsData, setAllRestaurantsData] = useState<Restaurant[]>(mockRestaurants);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>(allRestaurantsData[0].id);

    const selectedRestaurant = useMemo(
        () => allRestaurantsData.find(r => r.id === selectedRestaurantId)!,
        [allRestaurantsData, selectedRestaurantId]
    );

    const handleSetTasks = (tasks: Task[]) => {
        setAllRestaurantsData(prevData =>
            prevData.map(r => (r.id === selectedRestaurantId ? { ...r, tasks } : r))
        );
    };
    
    const handleSetInventory = (inventory: InventoryItem[]) => {
        setAllRestaurantsData(prevData =>
            prevData.map(r => (r.id === selectedRestaurantId ? { ...r, inventory } : r))
        );
    };

    const handleUpdateDish = (updatedDish: Dish) => {
        setAllRestaurantsData(prevData =>
            prevData.map(r => {
                if (r.id !== selectedRestaurantId) return r;
                return {
                    ...r,
                    dishes: r.dishes.map(d => (d.id === updatedDish.id ? updatedDish : d)),
                };
            })
        );
    };

    const addMultipleInventoryItems = (items: Omit<InventoryItem, 'id' | 'status'>[]) => {
        const newItems: InventoryItem[] = items.map(item => ({
            ...item,
            id: `${Date.now()}-${item.name}-${Math.random()}`,
            status: getStatus(item.stock),
        }));
        handleSetInventory([...newItems, ...selectedRestaurant.inventory]);
        alert(`${newItems.length} item(s) have been added to the inventory.`);
    };

    const handleUpload = useCallback((itemName: string) => {
        const isScanned = itemName === "Scanned Item";
        const newItemData = {
            name: isScanned ? 'Scanned Item' : `Uploaded Item (${itemName.substring(0, 10)})`,
            stock: isScanned ? 50 : 100,
            unitCost: isScanned ? 3.5 : 5.0,
        };
        addInventoryItem(newItemData);
        alert(`Inventory updated for ${selectedRestaurant.name} with: ${newItemData.name}`);
    }, [selectedRestaurant]);

    const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'status'>) => {
        const newItem: InventoryItem = {
            ...item,
            id: `${Date.now()}`,
            status: getStatus(item.stock),
        };
        handleSetInventory([newItem, ...selectedRestaurant.inventory]);
    };

    const deleteInventoryItem = (id: string) => {
        handleSetInventory(selectedRestaurant.inventory.filter(item => item.id !== id));
    };

    const { inventory, tasks, salesData, financials, dishes, yearlyComparison } = selectedRestaurant;
    
    const totalRevenue = useMemo(() => salesData.monthly.reduce((sum, d) => sum + d.actual, 0), [salesData]);
    const inventoryValue = useMemo(() => inventory.reduce((sum, item) => sum + item.stock * item.unitCost, 0), [inventory]);

    const operationalStatCards: StatCardData[] = [
        { title: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: '+12.5%', changeType: 'increase', icon: CurrencyDollarIcon },
        { title: 'Total Profit', value: `$${financials.profit.toLocaleString()}`, change: `${financials.profitChange > 0 ? '+' : ''}${financials.profitChange}%`, changeType: financials.profitChangeType, icon: ChartBarIcon },
        { title: 'Inventory Value', value: `$${inventoryValue.toLocaleString()}`, change: '-2.1%', changeType: 'decrease', icon: ArchiveBoxIcon },
    ];
    
    const partnerStatCards: StatCardData[] = [
        { title: 'Total Investment', value: `$${financials.investment.toLocaleString()}`, change: 'Partner Share', changeType: 'increase', icon: BuildingStorefrontIcon },
    ];


    const renderView = () => {
        switch (view) {
            case 'Dashboard':
                return <DashboardView operationalStatCards={operationalStatCards} partnerStatCards={partnerStatCards} inventory={inventory} tasks={tasks} setTasks={handleSetTasks} handleUpload={handleUpload} salesData={salesData} />;
            case 'Inventory':
                return <InventoryView inventory={inventory} addInventoryItem={addInventoryItem} deleteInventoryItem={deleteInventoryItem} />;
            case 'Forecasting':
                return <ForecastingView salesData={salesData} />;
            case 'Tasks':
                return <TasksView tasks={tasks} setTasks={handleSetTasks} />;
            case 'Reports':
                return <ReportsView 
                            inventory={inventory} 
                            sales={salesData.monthly} 
                            tasks={tasks}
                            dishes={dishes}
                            yearlyComparison={yearlyComparison}
                        />;
            case 'Costing':
                return <CostingView 
                            dishes={dishes} 
                            inventory={inventory} 
                            updateDish={handleUpdateDish}
                            addMultipleInventoryItems={addMultipleInventoryItems} 
                       />;
            case 'Environment':
                return <EnvironmentView />;
            default:
                return <DashboardView operationalStatCards={operationalStatCards} partnerStatCards={partnerStatCards} inventory={inventory} tasks={tasks} setTasks={handleSetTasks} handleUpload={handleUpload} salesData={salesData} />;
        }
    };

    return (
        <div className="flex bg-brand-light font-sans min-h-screen">
            <Sidebar activeView={view} onNavigate={setView} />
            <div className="flex-1 flex flex-col">
                <Header 
                    title={`${view} Overview`} 
                    restaurants={allRestaurantsData.map(r => ({id: r.id, name: r.name}))}
                    selectedRestaurantId={selectedRestaurantId}
                    onRestaurantChange={setSelectedRestaurantId}
                />
                {renderView()}
            </div>
        </div>
    );
};

export default App;