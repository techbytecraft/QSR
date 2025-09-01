import React from 'react';
import StatCard from '../dashboard/StatCard';
import SalesForecastChart from '../dashboard/SalesForecastChart';
import ProfitLossChart from '../dashboard/ProfitLossChart';
import Tasks from '../dashboard/Tasks';
import InventoryStatus from '../dashboard/InventoryStatus';
import BulkUpload from '../dashboard/BulkUpload';
import CostOptimizationAI from '../dashboard/CostOptimizationAI';
import { StatCardData, InventoryItem, Task, ForecastData } from '../../types';

interface DashboardViewProps {
    operationalStatCards: StatCardData[];
    partnerStatCards: StatCardData[];
    inventory: InventoryItem[];
    tasks: Task[];
    salesData: {
        daily: ForecastData[];
        weekly: ForecastData[];
        monthly: ForecastData[];
    };
    setTasks: (tasks: Task[]) => void;
    handleUpload: (itemName: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
    operationalStatCards,
    partnerStatCards,
    inventory,
    tasks,
    salesData,
    setTasks,
    handleUpload,
}) => {
    return (
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
            {/* Partner Financials */}
            <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Partner Financial Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {partnerStatCards.map((data, index) => <StatCard key={index} data={data} />)}
                </div>
            </div>

            {/* Operational Dashboard */}
            <div className="mt-8">
                 <h2 className="text-xl font-semibold text-gray-700 mb-4">Operational Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {operationalStatCards.map((data, index) => <StatCard key={index} data={data} />)}
                </div>
            </div>
            
            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
               <SalesForecastChart salesData={salesData} />
               <ProfitLossChart />
               <Tasks tasks={tasks} setTasks={setTasks} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <InventoryStatus inventory={inventory} />
                <div className="grid grid-rows-2 gap-6">
                   <BulkUpload onUpload={handleUpload}/>
                   <CostOptimizationAI inventory={inventory} />
                </div>
            </div>
        </main>
    );
};

export default DashboardView;