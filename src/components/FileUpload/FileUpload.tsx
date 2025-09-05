"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = ["audio/mp3", "audio/wav", "audio/m4a", "audio/mpeg", "audio/x-wav"];
  const maxSize = 50 * 1024 * 1024; // 50MB

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a)$/i)) {
      return "Please upload an audio file (MP3, WAV, or M4A)";
    }
    
    if (file.size > maxSize) {
      return "File size must be less than 50MB";
    }
    
    if (file.size < 1024) {
      return "File is too small. Please upload a valid audio file";
    }
    
    return null;
  };

  const handleFiles = (files: FileList | null) => {
    setError(null);
    
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError);
      return;
    }
    
    onFileUpload(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    handleFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          dragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
            : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".mp3,.wav,.m4a"
          onChange={handleInputChange}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-slate-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
          </div>
          
          <div className="space-y-2">
            <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
              {dragActive ? "Drop your audio file here" : "Upload audio file"}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Drag and drop your audio file here, or click to browse
            </p>
          </div>
          
          <Button onClick={openFileDialog} variant="outline">
            Choose File
          </Button>
          
          <div className="text-xs text-slate-500 space-y-1">
            <p>Supported formats: MP3, WAV, M4A</p>
            <p>Maximum file size: 50MB</p>
            <p>Recommended: 30-60 seconds of clear speech</p>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}