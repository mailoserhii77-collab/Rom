import React, { useRef, useState } from 'react';
import { UploadCloud, X, Film, AlertCircle } from 'lucide-react';
import { VideoData, MAX_FILE_SIZE_MB } from '../types';

interface VideoUploaderProps {
  onVideoSelected: (data: VideoData | null) => void;
  selectedVideo: VideoData | null;
  isDisabled: boolean;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({ onVideoSelected, selectedVideo, isDisabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    
    // Check file type
    if (!file.type.startsWith('video/')) {
      setError("Please upload a valid video file.");
      return;
    }

    // Check file size (Client-side base64 limitation)
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File is too large. For this browser demo, please use videos under ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Extract raw base64 (remove data:video/mp4;base64, prefix)
      const base64Data = result.split(',')[1];
      
      onVideoSelected({
        file,
        previewUrl: URL.createObjectURL(file),
        base64Data,
        mimeType: file.type
      });
    };
    reader.onerror = () => setError("Failed to read file.");
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const clearVideo = () => {
    if (selectedVideo) {
      URL.revokeObjectURL(selectedVideo.previewUrl);
    }
    onVideoSelected(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setError(null);
  };

  if (selectedVideo) {
    return (
      <div className="w-full bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
        <div className="relative aspect-video bg-black flex items-center justify-center">
          <video 
            src={selectedVideo.previewUrl} 
            controls 
            className="w-full h-full object-contain"
          />
          <button
            onClick={clearVideo}
            disabled={isDisabled}
            className="absolute top-4 right-4 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Remove video"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 bg-slate-800 flex items-center justify-between border-t border-slate-700">
          <div className="flex items-center space-x-3 text-slate-300">
            <Film className="w-5 h-5 text-indigo-400" />
            <span className="font-medium truncate max-w-[200px] sm:max-w-xs">{selectedVideo.file.name}</span>
            <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">
              {(selectedVideo.file.size / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className={`relative w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer
          ${dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-600 hover:border-indigo-400 hover:bg-slate-800/50 bg-slate-800/30'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleChange}
          disabled={isDisabled}
        />
        
        <div className="flex flex-col items-center space-y-4 text-center p-6">
          <div className="p-4 bg-slate-700 rounded-full">
            <UploadCloud className="w-8 h-8 text-indigo-400" />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-medium text-slate-200">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-slate-400">
              Supports MP4, WebM, MOV (Max {MAX_FILE_SIZE_MB}MB)
            </p>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
};