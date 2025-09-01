import { Restaurant } from '../types';

export const mockRestaurants: Restaurant[] = [
  {
    id: 'rest_1',
    name: 'Downtown Diner',
    inventory: [
      { id: '1', name: 'Burger Buns', stock: 120, unitCost: 0.5, status: 'In Stock' },
      { id: '2', name: 'Patties', stock: 80, unitCost: 1.2, status: 'In Stock' },
      { id: '3', name: 'Lettuce Heads', stock: 30, unitCost: 0.8, status: 'Low Stock' },
      { id: '4', name: 'Cheese Slices', stock: 200, unitCost: 0.3, status: 'In Stock' },
      { id: '5', name: 'Tomato Crates', stock: 15, unitCost: 15, status: 'Low Stock' },
      { id: '6', name: 'French Fries (frozen)', stock: 0, unitCost: 2.5, status: 'Out of Stock' },
      { id: '7', name: 'Soda Syrup', stock: 50, unitCost: 10, status: 'In Stock' },
    ],
    tasks: [
      { id: 1, text: 'Review Q2 sales report', completed: true },
      { id: 2, text: 'Plan weekly staff meeting for Downtown', completed: false },
      { id: 3, text: 'Check inventory for new menu items', completed: false },
    ],
    dishes: [
      {
        id: 'dish_1',
        name: 'Classic Cheeseburger',
        ingredients: [
          { inventoryId: '2', quantity: 1 }, // Beef Patties
          { inventoryId: '1', quantity: 2 }, // Burger Buns
          { inventoryId: '4', quantity: 2 }, // Cheese Slices
        ],
      },
      {
        id: 'dish_2',
        name: 'Deluxe Burger',
        ingredients: [
          { inventoryId: '2', quantity: 1 }, // Beef Patties
          { inventoryId: '1', quantity: 2 }, // Burger Buns
          { inventoryId: '4', quantity: 2 }, // Cheese Slices
          { inventoryId: '3', quantity: 0.1 }, // Lettuce Heads (1/10th of a head)
          { inventoryId: '5', quantity: 0.05 }, // Tomato Crates (5% of a crate)
        ],
      },
    ],
    salesData: {
      monthly: [
        { period: 'Jan', forecast: 4000, actual: 4500 },
        { period: 'Feb', forecast: 3000, actual: 2800 },
        { period: 'Mar', forecast: 5000, actual: 5200 },
        { period: 'Apr', forecast: 4500, actual: 4000 },
        { period: 'May', forecast: 6000, actual: 6500 },
        { period: 'Jun', forecast: 5500, actual: 5800 },
      ],
      weekly: [
        { period: 'W1', forecast: 1000, actual: 1100 },
        { period: 'W2', forecast: 900, actual: 850 },
        { period: 'W3', forecast: 1200, actual: 1300 },
        { period: 'W4', forecast: 1100, actual: 1000 },
      ],
      daily: [
        { period: 'Mon', forecast: 200, actual: 220 },
        { period: 'Tue', forecast: 180, actual: 170 },
        { period: 'Wed', forecast: 250, actual: 260 },
      ],
    },
    financials: {
      investment: 250000,
      monthlyReturn: 15000,
      annualReturn: 180000,
      profit: 12300,
      profitChange: 8.2,
      profitChangeType: 'increase',
    },
    yearlyComparison: [
      { name: 'Q1', 'Last Year': 10500, 'This Year': 12500 },
      { name: 'Q2', 'Last Year': 15500, 'This Year': 16300 },
      { name: 'Q3', 'Last Year': 14000, 'This Year': 15800 },
      { name: 'Q4', 'Last Year': 16500, 'This Year': 18200 },
    ],
  },
  {
    id: 'rest_2',
    name: 'Uptown Grille',
    inventory: [
      { id: '10', name: 'Artisan Bread', stock: 90, unitCost: 1.5, status: 'In Stock' },
      { id: '11', name: 'Gourmet Patties', stock: 75, unitCost: 2.8, status: 'In Stock' },
      { id: '12', name: 'Arugula', stock: 40, unitCost: 2.0, status: 'Low Stock' },
      { id: '13', name: 'Swiss Cheese', stock: 150, unitCost: 0.8, status: 'In Stock' },
      { id: '14', name: 'Truffle Oil', stock: 10, unitCost: 25, status: 'Low Stock' },
      { id: '15', name: 'Sweet Potato Fries', stock: 80, unitCost: 3.0, status: 'In Stock' },
    ],
    tasks: [
      { id: 101, text: 'Finalize marketing campaign for Uptown', completed: false },
      { id: 102, text: 'Hire new evening shift lead', completed: false },
      { id: 103, text: 'Renegotiate with beverage supplier', completed: true },
    ],
    dishes: [
      {
        id: 'dish_10',
        name: 'Gourmet Truffle Burger',
        ingredients: [
          { inventoryId: '11', quantity: 1 },   // Gourmet Patties
          { inventoryId: '10', quantity: 2 },   // Artisan Bread
          { inventoryId: '13', quantity: 4 },   // Swiss Cheese
          { inventoryId: '12', quantity: 0.2 }, // Arugula
          { inventoryId: '14', quantity: 0.01 },// Truffle Oil
        ],
      },
    ],
    salesData: {
      monthly: [
        { period: 'Jan', forecast: 8000, actual: 8200 },
        { period: 'Feb', forecast: 7500, actual: 7800 },
        { period: 'Mar', forecast: 9000, actual: 8500 },
        { period: 'Apr', forecast: 8800, actual: 9200 },
        { period: 'May', forecast: 9500, actual: 9400 },
        { period: 'Jun', forecast: 9200, actual: 9800 },
      ],
      weekly: [
        { period: 'W1', forecast: 2000, actual: 2100 },
        { period: 'W2', forecast: 1900, actual: 1850 },
        { period: 'W3', forecast: 2200, actual: 2300 },
        { period: 'W4', forecast: 2100, actual: 2000 },
      ],
      daily: [
        { period: 'Mon', forecast: 400, actual: 420 },
        { period: 'Tue', forecast: 380, actual: 370 },
        { period: 'Wed', forecast: 450, actual: 460 },
      ],
    },
    financials: {
      investment: 750000,
      monthlyReturn: 45000,
      annualReturn: 540000,
      profit: 38500,
      profitChange: -1.5,
      profitChangeType: 'decrease',
    },
    yearlyComparison: [
        { name: 'Q1', 'Last Year': 23000, 'This Year': 24500 },
        { name: 'Q2', 'Last Year': 26500, 'This Year': 27100 },
        { name: 'Q3', 'Last Year': 25000, 'This Year': 26500 },
        { name: 'Q4', 'Last Year': 28000, 'This Year': 31000 },
    ],
  },
];