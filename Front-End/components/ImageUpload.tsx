'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  className?: string;
}

export default function ImageUpload({ onImageUpload, className = '' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onImageUpload(data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        id="imageUpload"
        disabled={uploading}
      />
      <label
        htmlFor="imageUpload"
        className="cursor-pointer block p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
      >
        {preview ? (
          <div className="relative w-full aspect-video">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-500">
              {uploading ? 'Uploading...' : 'Click to upload image'}
            </p>
          </div>
        )}
      </label>
    </div>
  );
}
