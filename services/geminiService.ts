


import { GoogleGenAI, Type } from "@google/genai";
import { InventoryItem, ForecastData, Timeframe, Task, Dish, YearlyComparisonData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getCostOptimizationInsights = async (inventory: InventoryItem[]): Promise<string> => {
  if (!API_KEY) return "API Key not configured. Please set the API_KEY environment variable.";
  
  const prompt = `
    You are an expert supply chain analyst for a Quick Service Restaurant (QSR). 
    Based on the following inventory data, provide actionable insights to optimize costs for food production. 
    Focus on high-cost items, items with low stock which might indicate supply chain issues, and suggest potential areas for waste reduction or supplier renegotiation.
    Format the response as a professional analysis with a title and bullet points.

    Inventory Data:
    ${JSON.stringify(inventory.slice(0, 10), null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching cost optimization insights:", error);
    return "An error occurred while generating AI insights. Please check the console for details.";
  }
};

export const getForecastAnalysis = async (forecastData: ForecastData[], timeframe: Timeframe): Promise<string> => {
  if (!API_KEY) return "API Key not configured. Please set the API_KEY environment variable.";
  
  const prompt = `
    As a QSR business analyst, analyze the following ${timeframe} sales data. 
    'forecast' is the expected sales revenue, and 'actual' is the revenue that occurred.
    Identify key trends, highlight periods with significant deviation (positive or negative), and suggest potential reasons for these variances. 
    Provide a concise summary of your findings.

    Sales Data (${timeframe}):
    ${JSON.stringify(forecastData, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching forecast analysis:", error);
    return "An error occurred while generating AI analysis. Please check the console for details.";
  }
};

export const generateBusinessReport = async (data: {
    inventory: InventoryItem[],
    sales: ForecastData[],
    tasks: Task[],
    dishes: Dish[],
    yearlyComparison: YearlyComparisonData[],
}): Promise<string> => {
    if (!API_KEY) return "API Key not configured. Please set the API_KEY environment variable.";

    // Pre-process data for a more effective prompt
    const inventoryMap = new Map(data.inventory.map(item => [item.id, item]));
    const dishCostSummary = data.dishes.map(dish => {
        const ingredientsCost = dish.ingredients.map(ingredient => {
            const item = inventoryMap.get(ingredient.inventoryId);
            return {
                name: item ? item.name : 'Unknown Ingredient',
                cost: item ? item.unitCost * ingredient.quantity : 0,
            };
        });
        const totalCost = ingredientsCost.reduce((sum, ing) => sum + ing.cost, 0);
        return {
            dishName: dish.name,
            totalCost: parseFloat(totalCost.toFixed(2)),
            ingredients: ingredientsCost.map(ic => ({ ...ic, cost: parseFloat(ic.cost.toFixed(2))})),
        };
    });

    const prompt = `
      You are a senior business consultant for a Quick Service Restaurant (QSR).
      Analyze the following comprehensive business data snapshot and generate a professional summary report.

      The report should include:
      1.  **Executive Summary:** A brief overview of the business's current state.
      2.  **Sales Performance Analysis:** For each period in the sales data, compare the actual sales to the forecasted sales. Calculate the variance (both absolute and percentage). Highlight any periods with significant deviations (e.g., more than 15% variance) and suggest possible reasons.
      3.  **Inventory Management Review:** Comments on stock levels, potential risks (out-of-stock items), and high-value inventory.
      4.  **Operational Task Status:** Provide a summary of the task list, including the total number of tasks, the number of completed tasks, and the number of pending tasks. Comment on the potential impact of uncompleted tasks.
      5.  **Dish Costing Summary:** Analyze the production cost for each dish. Identify high-cost dishes and suggest potential cost-saving measures, such as ingredient substitution or supplier renegotiation for high-cost components.
      6.  **Year-over-Year Performance:** Compare this year's revenue against last year's based on the provided quarterly data. Highlight trends and significant changes.
      7.  **Strategic Recommendations:** Actionable advice based on all the data to improve profitability, efficiency, and reduce costs.

      Here is the data:

      **1. Sales Data (Monthly Actuals vs. Forecast):**
      ${JSON.stringify(data.sales, null, 2)}

      **2. Current Inventory Status (Top 15 items):**
      ${JSON.stringify(data.inventory.slice(0, 15), null, 2)}

      **3. Current Task List:**
      ${JSON.stringify(data.tasks, null, 2)}
      
      **4. Dish Production Costs:**
      ${JSON.stringify(dishCostSummary, null, 2)}

      **5. Year-over-Year Revenue Comparison:**
      ${JSON.stringify(data.yearlyComparison, null, 2)}

      Please provide a well-structured and insightful report.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating business report:", error);
        return "An error occurred while generating the AI business report. Please check the console for details.";
    }
};

export const parseInvoiceForIngredients = async (
  invoiceFile: { mimeType: string; data: string }
): Promise<Omit<InventoryItem, 'id' | 'status'>[]> => {
  if (!API_KEY) {
    console.error("API Key not configured.");
    return [];
  }

  const prompt = `
    You are an intelligent inventory management assistant for a restaurant.
    Your task is to analyze the provided invoice image and extract all food items or ingredients listed.
    For each item, you must identify its name, the quantity purchased, and the cost per unit.

    - 'name': The clear, concise name of the item.
    - 'stock': The numerical quantity of the item purchased.
    - 'unitCost': The price for a single unit of the item.

    Strictly return the data ONLY as a JSON array of objects, adhering to the provided schema. Do not include any explanatory text, greetings, or markdown formatting.
    If the image is not an invoice, is unreadable, or contains no valid food items, return an empty JSON array: [].
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: invoiceFile.mimeType,
              data: invoiceFile.data,
            },
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: 'The name of the ingredient.',
              },
              stock: {
                type: Type.INTEGER,
                description: 'The quantity of the item purchased.',
              },
              unitCost: {
                type: Type.NUMBER,
                description: 'The cost per single unit of the item.',
              },
            },
            required: ["name", "stock", "unitCost"],
          },
        },
      },
    });

    const text = response.text.trim();

    // The model can sometimes add conversational text or markdown.
    // Find the JSON array within the response.
    const jsonStartIndex = text.indexOf('[');
    const jsonEndIndex = text.lastIndexOf(']');

    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
        console.warn("AI response did not contain a valid JSON array.", { responseText: text });
        return [];
    }
    
    const jsonString = text.substring(jsonStartIndex, jsonEndIndex + 1);

    // Now, parse the extracted string
    const parsedData = JSON.parse(jsonString);

    if (Array.isArray(parsedData)) {
      // Validate the structure of the parsed data to prevent malformed objects
      return parsedData.filter(item => 
        item &&
        typeof item.name === 'string' &&
        typeof item.stock === 'number' &&
        typeof item.unitCost === 'number'
      );
    }
    
    console.warn("Parsed data is not an array.", { parsedData });
    return [];

  } catch (error) {
    console.error("Error parsing invoice with AI:", error);
    return [];
  }
};