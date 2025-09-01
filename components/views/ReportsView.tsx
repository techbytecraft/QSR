import React, { useState, useCallback, useMemo } from 'react';
import { InventoryItem, ForecastData, Task, Dish, YearlyComparisonData } from '../../types';
import { generateBusinessReport } from '../../services/geminiService';
import { SparklesIcon } from '../Icons';

interface ReportsViewProps {
    inventory: InventoryItem[];
    sales: ForecastData[];
    tasks: Task[];
    dishes: Dish[];
    yearlyComparison: YearlyComparisonData[];
}

// Helper function to parse a markdown-like text into a safe HTML string.
// This function correctly renders headings, bullet points (including nested lists), bold text, and preserves formatting in code blocks.
const parseReportToHtml = (text: string): string => {
    if (!text) return '';

    const blocks = text.split(/\n\s*\n/);

    const htmlBlocks = blocks.map(block => {
        const trimmedBlock = block.trim();
        if (!trimmedBlock) return '';

        // Code blocks
        if (trimmedBlock.startsWith('```') && trimmedBlock.endsWith('```')) {
            // Preserve whitespace and indentation within the code block
            const code = trimmedBlock.substring(3, trimmedBlock.length - 3);
            const encodedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return `<pre><code>${encodedCode}</code></pre>`;
        }
        
        // H2 Headings, e.g., "1. **Executive Summary:**"
        if (trimmedBlock.match(/^\d+\.\s*\*\*(.*?)\*\*/)) {
            return `<h2>${trimmedBlock.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '')}</h2>`;
        }

        // H3 Headings, e.g., "**Inventory Management Review:**"
        if (trimmedBlock.match(/^\*\*(.*?)\*\*/)) {
            return `<h3>${trimmedBlock.replace(/\*\*/g, '')}</h3>`;
        }

        // Unordered Lists (with nested list support)
        if (trimmedBlock.match(/^(\s*[\*\-]\s)/m)) {
            const lines = trimmedBlock.split('\n');
            let html = '';
            let depth = -1;

            lines.forEach(line => {
                const match = line.match(/^(\s*)([\*\-]\s)(.*)$/);
                // Skip lines that are not list items (e.g., empty lines within the block)
                if (!match) return;
                
                const indent = match[1].length;
                const content = match[3].replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

                // Assuming 2-space indentation for nesting
                const newDepth = Math.floor(indent / 2);

                if (newDepth > depth) {
                    // Open new list(s)
                    for (let i = depth; i < newDepth; i++) {
                        html += '<ul>';
                    }
                } else if (newDepth < depth) {
                    // Close list(s) and list item(s)
                    for (let i = depth; i > newDepth; i--) {
                        html += '</li></ul>';
                    }
                    html += '</li>';
                } else {
                    // Same level, close previous list item
                    if (depth > -1) html += '</li>';
                }
                
                html += `<li>${content}`;
                depth = newDepth;
            });

            // Close any remaining open tags at the end of the block
            for (let i = depth; i >= 0; i--) {
                html += '</li></ul>';
            }

            return html;
        }

        // Paragraphs
        return `<p>${trimmedBlock.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
    });

    return htmlBlocks.join('');
};


const ReportsView: React.FC<ReportsViewProps> = ({ inventory, sales, tasks, dishes, yearlyComparison }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [report, setReport] = useState('');

    const handleGenerateReport = useCallback(async () => {
        setIsLoading(true);
        setReport('');
        try {
            const result = await generateBusinessReport({ inventory, sales, tasks, dishes, yearlyComparison });
            setReport(result);
        } catch (error) {
            console.error(error);
            setReport('Failed to generate the business report.');
        } finally {
            setIsLoading(false);
        }
    }, [inventory, sales, tasks, dishes, yearlyComparison]);

    const reportHtml = useMemo(() => parseReportToHtml(report), [report]);

    return (
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
            <div className="bg-white p-6 rounded-2xl shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div className="flex-grow">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                            <SparklesIcon className="h-6 w-6 mr-3 text-brand-primary" />
                            AI-Powered Business Report
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Generate a comprehensive summary of your business performance and get actionable insights.
                        </p>
                    </div>
                    <button
                        onClick={handleGenerateReport}
                        disabled={isLoading}
                        className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                    >
                        {isLoading ? 'Generating Report...' : 'Generate Business Summary'}
                    </button>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 min-h-[50vh]">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-600">Generating your business report, please wait...</p>
                        </div>
                    ) : report ? (
                        <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: reportHtml }} />

                    ) : (
                        <div className="text-center text-gray-500 flex flex-col items-center justify-center h-full min-h-[40vh]">
                            <SparklesIcon className="h-12 w-12 mb-4 text-gray-400" />
                            <p className="max-w-md">Your generated business report will appear here. Click the button above to start the AI analysis.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default ReportsView;