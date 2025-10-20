import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface ImageUploadProps {
    label: string;
    currentImage?: string | null;
    onImageSelect: (file: File | null) => void;
    error?: string;
    className?: string;
}

export default function ImageUpload({ 
    label, 
    currentImage, 
    onImageSelect, 
    error,
    className = ""
}: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [dragActive, setDragActive] = useState(false);

    const handleFileSelect = (file: File | null) => {
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
            if (!validTypes.includes(file.type)) {
                alert('Please select a valid image file (JPEG, PNG, GIF, or SVG)');
                return;
            }

            // Validate file size (2MB limit)
            if (file.size > 2 * 1024 * 1024) {
                alert('File size must be less than 2MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            onImageSelect(file);
        } else {
            setPreview(null);
            onImageSelect(null);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFileSelect(files[0]);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onImageSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={className}>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                {label}
            </Label>
            
            <div className="space-y-4">
                {/* Upload Area */}
                <div
                    onClick={handleClick}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`
                        relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                        ${dragActive 
                            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                            : error 
                            ? 'border-red-300 hover:border-red-400' 
                            : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
                        }
                        ${!preview ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50' : ''}
                    `}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                        className="hidden"
                    />
                    
                    {!preview ? (
                        <div className="space-y-3">
                            <div className="flex justify-center">
                                <Upload className="h-10 w-10 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    JPEG, PNG, GIF or SVG up to 2MB
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            <img
                                src={preview}
                                alt="Preview"
                                className="max-h-48 mx-auto rounded-lg object-contain"
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove();
                                }}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Current Image Display */}
                {currentImage && !preview && (
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Image:
                        </p>
                        <div className="relative inline-block">
                            <img
                                src={currentImage}
                                alt="Current product image"
                                className="h-24 w-24 object-contain rounded-lg border border-gray-200 dark:border-gray-600"
                            />
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}