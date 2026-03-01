'use client';

import { useState, useEffect } from 'react';
import { Newspaper, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import PostCreator from '@/components/PostCreator';
import PostCard from '@/components/PostCard';
import PostSkeleton from '@/components/PostSkeleton';

interface Post {
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

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const query = urlParams.get('q');
      const url = query ? `/api/posts?q=${encodeURIComponent(query)}` : '/api/posts';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const user = await response.json();
        setCurrentUserId(user.id);
        setCurrentUserName(user.name);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchPosts();
  }, []);

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-1"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow-sm">
            <Newspaper className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Fil d&apos;actualité</h1>
            <p className="text-xs text-muted-foreground">Découvrez les dernières publications</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">{posts.length} posts</span>
        </div>
      </motion.div>

      {/* Post Creator */}
      <PostCreator
        currentUserName={currentUserName}
        onPostCreated={fetchPosts}
      />

      {/* Posts Feed */}
      <div className="space-y-5">
        {isLoading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-glass p-12 text-center rounded-2xl"
          >
            <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow-sm">
              <Newspaper className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Aucune publication</h3>
            <p className="text-sm text-muted-foreground">
              Soyez le premier à partager quelque chose avec la communauté.
            </p>
          </motion.div>
        ) : (
          posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <PostCard
                post={post}
                currentUserId={currentUserId}
                currentUserName={currentUserName}
              />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
