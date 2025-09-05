"use client";

interface ProcessingStatusProps {
  step: string;
}

export function ProcessingStatus({ step }: ProcessingStatusProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-ping"></div>
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <p className="font-medium text-slate-900 dark:text-slate-100">
          Processing
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {step}
        </p>
      </div>
      
      <div className="w-64 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}