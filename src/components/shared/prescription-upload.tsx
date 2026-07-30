"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileImage, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface PrescriptionUploadProps {
  onUploadComplete?: (url: string) => void;
  medicineName?: string;
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function PrescriptionUpload({ onUploadComplete, medicineName }: PrescriptionUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((f: File): string | null => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      return "Please upload an image file (JPEG, PNG, WebP, or GIF).";
    }
    if (f.size > MAX_FILE_SIZE) {
      return "File size must be less than 5MB.";
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (f: File) => {
      const validationError = validateFile(f);
      if (validationError) {
        setError(validationError);
        setStatus("error");
        toast.error(validationError);
        return;
      }

      setError(null);
      setFile(f);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(f);

      setStatus("uploading");

      setTimeout(() => {
        const mockUrl = URL.createObjectURL(f);
        setStatus("success");
        toast.success("Prescription uploaded successfully!");
        onUploadComplete?.(mockUrl);
      }, 1500);
    },
    [validateFile, onUploadComplete]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setStatus("idle");
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {status === "idle" || (status === "error" && !file) ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 transition-all duration-200 cursor-pointer",
              isDragOver
                ? "border-primary/50 bg-primary/5 scale-[1.02]"
                : "border-border/60 hover:border-primary/30 hover:bg-primary/[0.02] bg-card/30"
            )}
          >
            <div
              className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200",
                isDragOver ? "gradient-primary shadow-lg shadow-primary/20" : "bg-muted/50"
              )}
            >
              <Upload
                className={cn(
                  "w-6 h-6 transition-colors",
                  isDragOver ? "text-white" : "text-muted-foreground"
                )}
              />
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                Drop prescription here{" "}
                <span className="text-muted-foreground">or click to upload</span>
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">JPEG, PNG, WebP or GIF (max 5MB)</p>
            </div>

            {medicineName && (
              <p className="text-xs text-muted-foreground/50">
                For: <span className="font-medium text-foreground/70">{medicineName}</span>
              </p>
            )}

            {status === "error" && error && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-xs text-destructive"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </motion.div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleInputChange}
            />
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative rounded-2xl border border-border/60 overflow-hidden bg-card/30"
          >
            <div className="relative aspect-[4/3] bg-muted/20 flex items-center justify-center">
              {preview && (
                <img
                  src={preview}
                  alt="Prescription preview"
                  className="w-full h-full object-contain p-4"
                />
              )}

              <AnimatePresence>
                {status === "uploading" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3"
                  >
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">Uploading...</p>
                      <p className="text-xs text-muted-foreground">Please wait</p>
                    </div>
                  </motion.div>
                )}

                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-3 right-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between gap-3 p-3 border-t border-border/50">
              <div className="flex items-center gap-2 min-w-0">
                <FileImage className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm font-medium truncate">{file?.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  ({((file?.size || 0) / 1024).toFixed(1)} KB)
                </span>
              </div>

              <button
                onClick={handleRemove}
                className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {status === "error" && error && (
              <div className="flex items-center gap-1.5 px-3 pb-3 text-xs text-destructive">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
