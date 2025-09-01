import React from 'react';
import SalesForecastChart from '../dashboard/SalesForecastChart';
import ProfitLossChart from '../dashboard/ProfitLossChart';
import YearlyComparisonChart from '../dashboard/YearlyComparisonChart';
import { ForecastData } from '../../types';

interface ForecastingViewProps {
    salesData: {
        daily: ForecastData[];
        weekly: ForecastData[];
        monthly: ForecastData[];
    };
}

const ForecastingView: React.FC<ForecastingViewProps> = ({ salesData }) => {
    return (
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-6">
            <SalesForecastChart salesData={salesData} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProfitLossChart />
                <YearlyComparisonChart />
            </div>
        </main>
    );
};

export default ForecastingView;
