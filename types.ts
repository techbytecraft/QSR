// FIX: Import React to resolve the "Cannot find namespace 'React'" error.
import React from 'react';

export type View = 'Dashboard' | 'Inventory' | 'Forecasting' | 'Tasks' | 'Reports' | 'Costing' | 'Environment';

export interface StatCardData {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface ProfitLossData {
  name: string;
  profit: number;
  loss: number;
}

export type Timeframe = 'daily' | 'weekly' | 'monthly';

export interface ForecastData {
  period: string;
  actual: number;
  forecast: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  unitCost: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface YearlyComparisonData {
  name: string;
  'Last Year': number;
  'This Year': number;
}

export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export interface Ingredient {
  inventoryId: string;
  quantity: number;
}

export interface Dish {
  id: string;
  name: string;
  ingredients: Ingredient[];
}

export interface Restaurant {
  id: string;
  name: string;
  inventory: InventoryItem[];
  tasks: Task[];
  dishes: Dish[];
  salesData: {
    daily: ForecastData[];
    weekly: ForecastData[];
    monthly: ForecastData[];
  };
  financials: {
    investment: number;
    monthlyReturn: number;
    annualReturn: number;
    profit: number;
    profitChange: number;
    profitChangeType: 'increase' | 'decrease';
  };
  yearlyComparison: YearlyComparisonData[];
}