"use client";

import React, { useState } from "react";
import { Upload, X, Eye, FileText } from "lucide-react";
import { compressImage } from "@/lib/imageCompressor";
import { Button } from "@/components/ui/Button";

interface ImageUploaderProps {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  onViewProof?: (url: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  onViewProof,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setLoading(true);

    try {
      // Compress client-side
      const compressedDataUrl = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.75,
      });
      onChange(compressedDataUrl);
    } catch (err: any) {
      setError(err.message || "Failed to compress and load image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
        Attachment Proof (Receipt / Bill)
      </label>

      {value ? (
        <div className="relative rounded-2xl border border-emerald-200 bg-emerald-50/40 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-white border border-emerald-200 overflow-hidden shrink-0 flex items-center justify-center">
              {value.startsWith("data:image") || value.startsWith("http") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={value} alt="Proof preview" className="w-full h-full object-cover" />
              ) : (
                <FileText className="w-6 h-6 text-emerald-600" />
              )}
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-emerald-800 block truncate">
                ✓ Receipt Proof Attached
              </span>
              <span className="text-[10px] text-emerald-600 font-medium block">
                Compressed & Ready
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {onViewProof && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onViewProof(value)}
                className="text-emerald-700 hover:bg-emerald-100"
                title="View Receipt Image"
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange(undefined)}
              className="text-rose-600 hover:bg-rose-100"
              title="Remove Attachment"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-emerald-50/30 transition-colors">
          <Upload className="w-6 h-6 text-slate-400 mb-1" />
          <span className="text-xs font-bold text-slate-700">
            {loading ? "Compressing image..." : "Upload Proof (Receipt/Bill/Invoice)"}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">
            JPG, PNG, WEBP (Auto-compressed)
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={loading}
            className="hidden"
          />
        </label>
      )}

      {error && <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
};
