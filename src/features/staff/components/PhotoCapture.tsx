'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, X, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface PhotoCaptureProps {
  orderId: string;
  onUploadComplete?: (urls: string[]) => void;
}

export function PhotoCapture({ orderId, onUploadComplete }: PhotoCaptureProps) {
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const valid = files.filter(file => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert(`"${file.name}" is not an allowed image type. Use JPEG, PNG, or WebP.`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert(`"${file.name}" exceeds the 10MB size limit.`);
        return false;
      }
      return true;
    });
    const newPhotos = valid.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const uploadAll = async () => {
    if (photos.length === 0) return;
    setUploading(true);

    const supabase = createClient();
    const urls: string[] = [];

    for (const photo of photos) {
      const safeName = photo.file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const fileName = `orders/${orderId}/${Date.now()}-${safeName}`;
      const { data, error: _uploadError } = await supabase.storage
        .from('order-photos')
        .upload(fileName, photo.file);

      if (data) {
        const { data: urlData } = supabase.storage
          .from('order-photos')
          .getPublicUrl(fileName);
        urls.push(urlData.publicUrl);
      }
    }

    setUploading(false);
    setUploaded(true);
    onUploadComplete?.(urls);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          <Camera className="h-4 w-4" /> Take Photo
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          onChange={handleCapture}
          className="hidden"
        />
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-border">
              <img src={photo.preview} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
              <button
                onClick={() => removePhoto(i)}
                className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {photos.length > 0 && !uploaded && (
        <button
          onClick={uploadAll}
          disabled={uploading}
          className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : (
            <span className="flex items-center justify-center gap-2">
              <Upload className="h-4 w-4" /> Upload {photos.length} Photo{photos.length > 1 ? 's' : ''}
            </span>
          )}
        </button>
      )}

      {uploaded && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-800">
          <Check className="h-4 w-4" /> Photos uploaded successfully
        </div>
      )}
    </div>
  );
}
