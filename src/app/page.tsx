'use client';

import { useState, useEffect } from 'react';
import { Newspaper } from 'lucide-react';
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
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Newspaper className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Fil d'actualite</h1>
            <p className="text-xs text-muted-foreground">Decouvrez les dernieres publications</p>
          </div>
        </div>
      </div>

      {/* Post Creator */}
      <PostCreator
        currentUserName={currentUserName}
        onPostCreated={fetchPosts}
      />

      {/* Posts Feed */}
      <div className="space-y-4">
        {isLoading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : posts.length === 0 ? (
          <div className="card-elevated p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Newspaper className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Aucune publication</h3>
            <p className="text-sm text-muted-foreground">
              Soyez le premier a partager quelque chose avec la communaute.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={currentUserId}
              currentUserName={currentUserName}
            />
          ))
        )}
      </div>
    </div>
  );
}
