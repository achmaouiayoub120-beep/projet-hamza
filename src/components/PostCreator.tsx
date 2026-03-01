'use client';

import { useState, useRef } from 'react';
import { Send, ImagePlus, FileText, X, Upload } from 'lucide-react';
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
  const [isFocused, setIsFocused] = useState(false);

  const charLimit = 500;
  const charPercent = (content.length / charLimit) * 100;
  const isNearLimit = charPercent > 80;
  const isAtLimit = charPercent >= 100;

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card-glass p-5 rounded-2xl transition-all duration-300 ${isFocused ? 'ring-2 ring-primary/20 shadow-glow-sm' : ''
        }`}
    >
      <div className="flex gap-3">
        <div className="relative flex-shrink-0">
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUserName || 'User')}`}
            alt="Votre avatar"
            className="w-10 h-10 rounded-full ring-2 ring-border"
            crossOrigin="anonymous"
          />
          <div className="absolute -bottom-0.5 -right-0.5 online-dot" />
        </div>
        <div className="flex-1 min-w-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Partagez vos pensées avec la communauté..."
            className="w-full p-3 bg-muted/40 border border-transparent rounded-xl resize-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/20 focus:bg-card/80 transition-all duration-300 leading-relaxed"
            rows={3}
            disabled={isPosting}
            maxLength={charLimit}
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
                  <div className="relative rounded-xl overflow-hidden bg-muted/30 border border-border/50 p-3 flex items-center gap-3">
                    {fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img src={fileUrl} alt="Aperçu" className="h-16 w-16 object-cover rounded-lg" crossOrigin="anonymous" />
                    ) : (
                      <div className="h-16 w-16 gradient-primary rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{fileUrl.split('/').pop()}</p>
                      <p className="text-xs text-primary font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Fichier prêt
                      </p>
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
                      className="ut-label:text-xs ut-label:text-muted-foreground ut-button:gradient-primary ut-button:text-white ut-button:border-0 ut-button:rounded-xl ut-button:text-xs ut-button:hover:opacity-90 ut-button:shadow-glow-sm ut-allowed-content:text-xs ut-allowed-content:text-muted-foreground border-2 border-dashed border-primary/20 rounded-xl bg-primary/5 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
                    />
                    <button
                      onClick={() => setShowUpload(false)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-card/80 hover:bg-muted transition-colors"
                    >
                      <X className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </div>
                )}
                {isUploading && (
                  <p className="text-xs text-primary font-medium mt-2 animate-pulse flex items-center gap-2">
                    <Upload className="h-3 w-3 animate-bounce" />
                    Envoi du fichier en cours...
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions Bar */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowUpload(!showUpload)}
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                title="Ajouter une image"
              >
                <ImagePlus className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowUpload(!showUpload)}
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                title="Ajouter un document"
              >
                <FileText className="h-4 w-4" />
              </motion.button>

              {/* Character counter */}
              <div className="ml-2 flex items-center gap-2">
                <div className="relative w-6 h-6">
                  <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                    <circle
                      cx="12" cy="12" r="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-muted/60"
                    />
                    <circle
                      cx="12" cy="12" r="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray={`${charPercent * 0.628} 62.8`}
                      className={`transition-all duration-300 ${isAtLimit ? 'text-destructive' : isNearLimit ? 'text-amber-500' : 'text-primary'
                        }`}
                    />
                  </svg>
                </div>
                <span className={`text-[11px] tabular-nums font-medium transition-colors ${isAtLimit ? 'text-destructive' : isNearLimit ? 'text-amber-500' : 'text-muted-foreground'
                  }`}>
                  {content.length}/{charLimit}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: content.trim() && !isPosting ? 1.03 : 1 }}
              whileTap={{ scale: content.trim() && !isPosting ? 0.97 : 1 }}
              onClick={handlePost}
              disabled={!content.trim() || isPosting}
              className="flex items-center gap-2 px-5 py-2 gradient-primary text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-glow-sm hover:shadow-glow disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isPosting ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Publier
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
