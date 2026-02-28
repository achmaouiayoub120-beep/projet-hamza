'use client';

import { useState } from 'react';
import { Heart, MessageCircle, ExternalLink, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface PostData {
  id: number;
  content: string;
  fileUrl: string | null;
  createdAt: string;
  author: {
    id: number;
    name: string;
    email: string;
    major: string;
    studentId: string;
    avatarUrl?: string;
  };
  likes: { userId: number }[];
  comments: { id: number }[];
}

interface CommentData {
  id: number;
  content: string;
  createdAt: string;
  user: { id: number; name: string };
}

interface PostCardProps {
  post: PostData;
  currentUserId: number | null;
  currentUserName: string;
}

export default function PostCard({ post, currentUserId, currentUserName }: PostCardProps) {
  const [likes, setLikes] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comments?.length || 0);

  const isLiked = currentUserId ? likes.some(l => l.userId === currentUserId) : false;

  const formatDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "A l'instant";
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const handleLike = async () => {
    if (!currentUserId) return;
    setIsLikeAnimating(true);
    setTimeout(() => setIsLikeAnimating(false), 600);

    // Optimistic update
    const wasLiked = isLiked;
    setLikes(wasLiked
      ? likes.filter(l => l.userId !== currentUserId)
      : [...likes, { userId: currentUserId }]
    );

    try {
      await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id }),
      });
    } catch {
      // Revert on error
      setLikes(wasLiked
        ? [...likes, { userId: currentUserId }]
        : likes.filter(l => l.userId !== currentUserId)
      );
    }
  };

  const toggleComments = async () => {
    const next = !showComments;
    setShowComments(next);
    if (next && comments.length === 0) {
      try {
        const res = await fetch(`/api/posts/${post.id}/comments`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    }
  };

  const handleComment = async () => {
    const trimmed = commentInput.trim();
    if (!trimmed) return;
    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id, content: trimmed }),
      });
      if (res.ok) {
        setCommentInput('');
        setCommentCount(c => c + 1);
        const commentsRes = await fetch(`/api/posts/${post.id}/comments`);
        if (commentsRes.ok) {
          const data = await commentsRes.json();
          setComments(data);
        }
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const getAvatarUrl = (name: string) => `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card-elevated overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 pb-0">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.author.id}`}>
            <img
              src={post.author.avatarUrl || getAvatarUrl(post.author.name)}
              alt={post.author.name}
              className="w-10 h-10 rounded-full ring-2 ring-border object-cover transition-transform hover:scale-105"
              crossOrigin="anonymous"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Link href={`/profile/${post.author.id}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                {post.author.name}
              </Link>
              <span className="text-[11px] text-muted-foreground">{formatDate(post.createdAt)}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">{post.author.major}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-3 pb-4">
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>

        {/* File Display */}
        {post.fileUrl && (
          <div className="mt-3">
            {post.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <div className="relative group rounded-xl overflow-hidden cursor-pointer" onClick={() => post.fileUrl && window.open(post.fileUrl, '_blank')}>
                <img
                  src={post.fileUrl}
                  alt="Image jointe"
                  className="w-full max-h-80 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-card/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg">
                      <ExternalLink className="h-4 w-4 text-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <a
                href={post.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-muted rounded-xl hover:bg-accent transition-colors group"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{post.fileUrl.split('/').pop() || 'Document'}</p>
                  <p className="text-[11px] text-muted-foreground">Cliquez pour ouvrir</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-5 py-3 border-t border-border flex items-center gap-6">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 text-sm group"
        >
          <div className={`p-1.5 rounded-full transition-colors ${isLiked ? 'bg-red-50 dark:bg-red-950/30' : 'group-hover:bg-muted'}`}>
            <Heart
              className={`h-[18px] w-[18px] transition-all duration-200 ${
                isLiked
                  ? 'fill-red-500 text-red-500'
                  : 'text-muted-foreground group-hover:text-red-500'
              } ${isLikeAnimating ? 'animate-heart' : ''}`}
            />
          </div>
          <span className={`font-medium tabular-nums ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}>
            {likes.length}
          </span>
        </button>

        <button
          onClick={toggleComments}
          className="flex items-center gap-2 text-sm group"
        >
          <div className={`p-1.5 rounded-full transition-colors ${showComments ? 'bg-primary/10' : 'group-hover:bg-muted'}`}>
            <MessageCircle
              className={`h-[18px] w-[18px] transition-colors ${
                showComments ? 'text-primary fill-primary/10' : 'text-muted-foreground group-hover:text-primary'
              }`}
            />
          </div>
          <span className={`font-medium tabular-nums ${showComments ? 'text-primary' : 'text-muted-foreground'}`}>
            {commentCount}
          </span>
        </button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border overflow-hidden"
          >
            <div className="p-5 space-y-4">
              {/* Comment Input */}
              <div className="flex gap-3">
                <img
                  src={getAvatarUrl(currentUserName || 'User')}
                  alt="Votre avatar"
                  className="w-8 h-8 rounded-full ring-1 ring-border flex-shrink-0"
                  crossOrigin="anonymous"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                    placeholder="Ecrire un commentaire..."
                    className="w-full px-3 py-2 bg-muted rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card transition-all"
                  />
                </div>
              </div>

              {/* Comments List */}
              {comments.length > 0 ? (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <img
                        src={getAvatarUrl(comment.user?.name || 'User')}
                        alt={comment.user?.name || 'User'}
                        className="w-7 h-7 rounded-full ring-1 ring-border flex-shrink-0"
                        crossOrigin="anonymous"
                      />
                      <div className="flex-1 bg-muted rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-foreground">{comment.user?.name}</span>
                          <span className="text-[10px] text-muted-foreground">{formatDate(comment.createdAt)}</span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{comment.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-2">Aucun commentaire. Soyez le premier !</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
