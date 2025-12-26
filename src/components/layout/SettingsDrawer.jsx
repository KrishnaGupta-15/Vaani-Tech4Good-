import React from 'react';
import { X, Type, Sun, Moon, Monitor } from 'lucide-react';

function SettingsDrawer({
    isOpen,
    onClose,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast
}) {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div className="relative w-80 bg-white h-full shadow-2xl p-6 flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-800">Accessibility</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={24} />
                    </button>
                </div>

                {/* Text Size Control */}
                <div className="mb-8">
                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                        <Type size={18} />
                        Text Size
                    </label>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        {['small', 'medium', 'large', 'xl'].map((size) => (
                            <button
                                key={size}
                                onClick={() => setFontSize(size)}
                                className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-colors ${fontSize === size
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {size === 'xl' ? 'XL' : size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* High Contrast Control */}
                <div className="mb-8">
                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                        <Monitor size={18} />
                        Display Mode
                    </label>

                    <button
                        onClick={() => setHighContrast(!highContrast)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${highContrast
                                ? 'bg-black border-yellow-400 text-yellow-400'
                                : 'bg-white border-gray-200 text-gray-800 hover:border-blue-400'
                            }`}
                    >
                        <span className="font-bold">High Contrast</span>
                        {highContrast ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                        Increases visibility with high-contrast colors (Yellow on Black).
                    </p>
                </div>

                <div className="mt-auto pt-6 border-t text-center text-xs text-gray-400">
                    Vaani Accessibility Settings
                </div>

            </div>
        </div>
    );
}

export default SettingsDrawer;
