
import React, { useState } from 'react';
import { QrCodeIcon, ArrowUpTrayIcon } from '../Icons';

const BulkUpload: React.FC<{ onUpload: (fileName: string) => void }> = ({ onUpload }) => {
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setFileName(file.name);
            onUpload(file.name);
            // In a real app, you would process the file here.
        }
    };
    
    const handleQrScan = () => {
        // This is a simulation. In a real app, this would open a camera view.
        alert("QR Scanner activated! (simulation)\n\nA new product 'Scanned Item' will be added.");
        onUpload("Scanned Item");
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Inventory Update</h3>
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                 <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                />
                <ArrowUpTrayIcon className="h-12 w-12 text-gray-400 mb-2" />
                <label htmlFor="file-upload" className="font-semibold text-brand-primary cursor-pointer hover:underline">
                    Click to upload
                </label>
                <p className="text-xs text-gray-500 mt-1">or drag and drop an Excel/CSV file</p>
                {fileName && <p className="text-sm text-green-600 mt-2">Uploaded: {fileName}</p>}
            </div>
            <p className="text-center text-gray-500 my-4 font-semibold">OR</p>
            <button
                onClick={handleQrScan} 
                className="w-full bg-brand-dark text-white py-3 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                <QrCodeIcon className="h-6 w-6 mr-2" />
                Add Product via QR Scan
            </button>
        </div>
    );
};

export default BulkUpload;
