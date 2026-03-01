'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Calendar, Mail, BookOpen, Edit3, UserPlus, Grid3X3, Image, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface ProfileProps {
  profile: {
    id: number;
    name: string;
    email: string;
    studentId: string;
    major: string;
    bio: string | null;
    avatarUrl: string | null;
    createdAt: string;
    posts: Array<{
      id: number;
      content: string;
      fileUrl?: string | null;
      createdAt: string;
      likes: { userId: number }[];
      comments: { id: number }[];
    }>;
  };
  isOwnProfile: boolean;
}

type Tab = 'posts' | 'media' | 'likes';

export default function ProfileClient({ profile, isOwnProfile }: ProfileProps) {
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getAvatarUrl = (name: string) => `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

  const totalLikes = profile.posts.reduce((acc, post) => acc + post.likes.length, 0);
  const totalComments = profile.posts.reduce((acc, post) => acc + post.comments.length, 0);
  const mediaPosts = profile.posts.filter(p => p.fileUrl);

  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }>; count: number }[] = [
    { key: 'posts', label: 'Publications', icon: Grid3X3, count: profile.posts.length },
    { key: 'media', label: 'Médias', icon: Image, count: mediaPosts.length },
    { key: 'likes', label: 'J\'aime', icon: ThumbsUp, count: totalLikes },
  ];

  const displayedPosts = activeTab === 'media' ? mediaPosts : profile.posts;

  const handleFollow = async () => {
    try {
      const response = await fetch(`/api/users/${profile.id}/follow`, { method: 'POST' });
      if (response.ok) {
        const { following } = await response.json();
        setIsFollowing(following);
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  return (
    <div className="max-w-4xl space-y-5">
      {/* Cover & Avatar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-glass rounded-2xl overflow-hidden"
      >
        {/* Cover Image */}
        <div className="relative h-48 sm:h-56 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22p%22%20width%3D%2220%22%20height%3D%2220%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Ccircle%20cx%3D%2210%22%20cy%3D%2210%22%20r%3D%221.5%22%20fill%3D%22rgba(255%2C255%2C255%2C0.08)%22%2F%3E%3C%2Fpattern%3E%3C%2Fdefs%3E%3Crect%20fill%3D%22url(%23p)%22%20width%3D%22100%22%20height%3D%22100%22%2F%3E%3C%2Fsvg%3E')] opacity-60" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 sm:-mt-12">
            <div className="relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 blur-md opacity-50 group-hover:opacity-70 transition-opacity" />
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="relative w-28 h-28 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-card shadow-lg"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="relative w-28 h-28 sm:w-24 sm:h-24 rounded-full gradient-primary ring-4 ring-card shadow-lg flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{profile.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>

            <div className="flex-1 sm:pb-1">
              <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
              <p className="text-sm text-primary font-medium">{profile.major}</p>
            </div>

            <div className="sm:pb-1">
              {isOwnProfile ? (
                <Link
                  href="/settings"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-gradient-outline text-sm"
                >
                  <Edit3 className="h-4 w-4" />
                  Modifier le profil
                </Link>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleFollow}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${isFollowing
                      ? 'bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
                      : 'gradient-primary text-white shadow-glow-sm hover:shadow-glow'
                    }`}
                >
                  <UserPlus className="h-4 w-4" />
                  {isFollowing ? 'Abonné' : 'Suivre'}
                </motion.button>
              )}
            </div>
          </div>

          {/* Bio & Info */}
          <div className="mt-5 space-y-4">
            {profile.bio && (
              <div className="p-4 bg-muted/30 rounded-xl border border-border/30">
                <p className="text-sm text-foreground leading-relaxed">{profile.bio}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-primary/60" />
                <span>{profile.studentId}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-primary/60" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary/60" />
                <span>Inscrit le {formatDate(profile.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        {[
          { label: 'Publications', value: profile.posts.length, gradient: 'from-purple-500 to-blue-500' },
          { label: 'J\'aime reçus', value: totalLikes, gradient: 'from-pink-500 to-rose-500' },
          { label: 'Commentaires', value: totalComments, gradient: 'from-blue-500 to-cyan-500' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.03, y: -2 }}
            className="card-glass rounded-2xl p-5 text-center group cursor-default"
          >
            <div className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground font-medium mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-glass rounded-2xl overflow-hidden"
      >
        <div className="flex border-b border-border/50">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all duration-300 relative ${activeTab === tab.key
                  ? 'text-primary tab-active'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab.key
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground'
                }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-5">
          <AnimatePresence mode="wait">
            {activeTab === 'likes' ? (
              <motion.div
                key="likes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center py-8"
              >
                <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-glow-sm">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <p className="text-lg font-semibold text-foreground">{totalLikes} j&apos;aime</p>
                <p className="text-sm text-muted-foreground mt-1">Total de réactions reçues sur les publications</p>
              </motion.div>
            ) : displayedPosts.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center py-8"
              >
                <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-3">
                  {activeTab === 'media' ? (
                    <Image className="h-6 w-6 text-muted-foreground" />
                  ) : (
                    <Grid3X3 className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {isOwnProfile
                    ? activeTab === 'media'
                      ? "Vous n'avez aucun média partagé."
                      : "Vous n'avez aucune publication."
                    : activeTab === 'media'
                      ? `${profile.name} n'a aucun média partagé.`
                      : `${profile.name} n'a aucune publication.`
                  }
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {displayedPosts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 bg-muted/20 border border-border/30 rounded-xl hover:border-primary/20 hover:bg-muted/30 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
                        {formatDateTime(post.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed mb-3">
                      {post.content}
                    </p>

                    {post.fileUrl && post.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                      <div className="rounded-xl overflow-hidden mb-3">
                        <img
                          src={post.fileUrl}
                          alt="Média"
                          className="w-full max-h-64 object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-2 border-t border-border/30">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Heart className="h-4 w-4" />
                        <span className="text-xs font-medium">{post.likes.length}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">{post.comments.length}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
