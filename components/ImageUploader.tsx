import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { UploadedFile } from '../types';

interface ImageUploaderProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ files, onFilesChange, maxFiles = 2 }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Explicitly cast file to File since Array.from on FileList might infer unknown
      const newFiles: UploadedFile[] = Array.from(e.target.files).map((file) => ({
        file: file as File,
        previewUrl: URL.createObjectURL(file as File),
      }));
      
      const combinedFiles = [...files, ...newFiles].slice(0, maxFiles);
      onFilesChange(combinedFiles);
    }
    // Reset input so same file can be selected again if needed (though we handle preview)
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (indexToRemove: number) => {
    onFilesChange(files.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-slate-300">
          Reference Images (Analysis Source)
        </label>
        <span className="text-xs text-slate-500">{files.length} / {maxFiles}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {files.map((file, index) => (
          <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-700 h-48 bg-black">
            <img 
              src={file.previewUrl} 
              alt={`preview-${index}`} 
              className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <button
              onClick={() => removeFile(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
            >
              <X size={16} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-xs truncate text-slate-300">
              {file.file.name}
            </div>
          </div>
        ))}

        {files.length < maxFiles && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="h-48 rounded-lg border-2 border-dashed border-slate-700 hover:border-blue-500 hover:bg-slate-800/30 flex flex-col items-center justify-center cursor-pointer transition-all group"
          >
            <div className="p-3 bg-slate-800 rounded-full mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-400" />
            </div>
            <span className="text-sm text-slate-400 group-hover:text-slate-200">Click to upload</span>
            <span className="text-xs text-slate-600 mt-1">PNG, JPG, WEBP</span>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;