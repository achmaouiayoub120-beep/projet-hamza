'use client';

import { useState } from 'react';
import { Send, ImagePlus, FileText, X } from 'lucide-react';
import { UploadDropzone } from '@/lib/uploadthing';
import { motion, AnimatePresence } from 'framer-motion';

interface PostCreatorProps {
  currentUserName: string;
  onPostCreated: () => void;
}

export default function PostCreator({ currentUserName, onPostCreated }: PostCreatorProps) {
  const [content, setContent] = useState('');
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) return;
    try {
      setIsPosting(true);
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, fileUrl: fileUrl || null }),
      });
      if (response.ok) {
        setContent('');
        setFileUrl(null);
        setShowUpload(false);
        onPostCreated();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="card-elevated p-5">
      <div className="flex gap-3">
        <img
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUserName || 'User')}`}
          alt="Votre avatar"
          className="w-10 h-10 rounded-full ring-2 ring-border flex-shrink-0"
          crossOrigin="anonymous"
        />
        <div className="flex-1 min-w-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Partagez vos pensees avec la communaute..."
            className="w-full p-3 bg-muted rounded-xl resize-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card transition-all duration-200 leading-relaxed"
            rows={3}
            disabled={isPosting}
            maxLength={500}
          />

          {/* File Upload */}
          <AnimatePresence>
            {showUpload && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                {fileUrl ? (
                  <div className="relative rounded-xl overflow-hidden bg-muted p-3 flex items-center gap-3">
                    {fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img src={fileUrl} alt="Apercu" className="h-16 w-16 object-cover rounded-lg" crossOrigin="anonymous" />
                    ) : (
                      <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{fileUrl.split('/').pop()}</p>
                      <p className="text-xs text-primary font-medium">Fichier pret</p>
                    </div>
                    <button
                      onClick={() => { setFileUrl(null); setShowUpload(false); }}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <UploadDropzone
                      endpoint="postFile"
                      onClientUploadComplete={(res) => {
                        setIsUploading(false);
                        if (res && res[0]) setFileUrl(res[0].url);
                      }}
                      onUploadError={(error: Error) => {
                        setIsUploading(false);
                        console.error('Upload error:', error);
                        setFileUrl(null);
                      }}
                      onUploadBegin={() => setIsUploading(true)}
                      config={{ mode: "auto" }}
                      className="ut-label:text-xs ut-label:text-muted-foreground ut-button:bg-primary ut-button:text-primary-foreground ut-button:border-0 ut-button:rounded-lg ut-button:text-xs ut-button:hover:opacity-90 ut-allowed-content:text-xs ut-allowed-content:text-muted-foreground border-2 border-dashed border-border rounded-xl"
                    />
                    <button
                      onClick={() => setShowUpload(false)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-card hover:bg-muted transition-colors"
                    >
                      <X className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </div>
                )}
                {isUploading && (
                  <p className="text-xs text-primary font-medium mt-2 animate-pulse">Envoi du fichier en cours...</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions Bar */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowUpload(!showUpload)}
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent transition-all duration-200"
                title="Ajouter une image"
              >
                <ImagePlus className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowUpload(!showUpload)}
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent transition-all duration-200"
                title="Ajouter un document"
              >
                <FileText className="h-4 w-4" />
              </button>
              <span className="ml-2 text-[11px] text-muted-foreground tabular-nums">
                {content.length}/500
              </span>
            </div>
            <button
              onClick={handlePost}
              disabled={!content.trim() || isPosting}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {isPosting ? (
                <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Publier
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
