'use client';

import { useState, useEffect } from 'react';
import { Users, Bell, TrendingUp, Info, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface User {
  id: number;
  name: string;
  major: string;
  studentId: string;
  avatarUrl?: string;
}

const onlineUsers = [
  { name: 'Sara M.', status: 'En ligne' },
  { name: 'Youssef K.', status: 'En ligne' },
  { name: 'Amina B.', status: 'Il y a 5min' },
];

export default function RightPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingStates, setFollowingStates] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleFollow = async (userId: number) => {
    try {
      const response = await fetch(`/api/users/${userId}/follow`, { method: 'POST' });
      if (response.ok) {
        const { following } = await response.json();
        setFollowingStates(prev => ({ ...prev, [userId]: following }));
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const getAvatarUrl = (user: User) => {
    if (user.avatarUrl) return user.avatarUrl;
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`;
  };

  return (
    <div className="space-y-4">
      {/* About Widget */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-glass p-5 rounded-2xl"
      >
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Info className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-semibold text-sm text-foreground">À propos</h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
          Bienvenue sur le réseau social de votre université. Connectez-vous avec vos camarades et partagez vos expériences.
        </p>
        <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl">
          <img
            src="/images/university-logo.png"
            alt="Logo Université"
            className="h-8 w-8 object-contain"
            crossOrigin="anonymous"
          />
          <div>
            <p className="text-xs font-semibold text-foreground">Université</p>
            <p className="text-[10px] text-muted-foreground">Année universitaire 2025-2026</p>
          </div>
        </div>
      </motion.div>

      {/* Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-glass p-5 rounded-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">Suggestions</h3>
          </div>
          <Link href="/classmates" className="text-xs text-primary font-medium hover:underline transition-colors">
            Voir tout
          </Link>
        </div>
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full skeleton" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-24 skeleton rounded-lg" />
                  <div className="h-2.5 w-16 skeleton rounded-lg" />
                </div>
                <div className="h-7 w-16 skeleton rounded-full" />
              </div>
            ))
          ) : users.length > 0 ? (
            users.slice(0, 5).map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-center gap-3 group"
              >
                <Link href={`/profile/${user.id}`}>
                  <div className="relative">
                    <img
                      src={getAvatarUrl(user)}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-border group-hover:ring-primary/30 transition-all duration-300"
                      crossOrigin="anonymous"
                    />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/profile/${user.id}`} className="text-sm font-medium text-foreground truncate block hover:text-primary transition-colors">
                    {user.name}
                  </Link>
                  <p className="text-[11px] text-muted-foreground truncate">{user.major}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFollow(user.id)}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-300 ${followingStates[user.id]
                      ? 'bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
                      : 'gradient-primary text-white shadow-sm shadow-primary/20'
                    }`}
                >
                  {followingStates[user.id] ? 'Abonné' : 'Suivre'}
                </motion.button>
              </motion.div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground text-center py-2">Aucune suggestion</p>
          )}
        </div>
      </motion.div>

      {/* Trending */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-glass p-5 rounded-2xl"
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-semibold text-sm text-foreground">Tendances</h3>
        </div>
        <div className="space-y-3">
          {[
            { tag: 'ExamsFin2026', posts: 42, color: 'from-purple-500 to-blue-500' },
            { tag: 'ProjetPFE', posts: 28, color: 'from-pink-500 to-purple-500' },
            { tag: 'StageEte', posts: 15, color: 'from-blue-500 to-cyan-500' },
          ].map((trend, i) => (
            <motion.div
              key={trend.tag}
              whileHover={{ x: 4 }}
              className="group cursor-pointer p-2.5 rounded-xl hover:bg-muted/40 transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-0.5">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${trend.color}`} />
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  #{trend.tag}
                </p>
              </div>
              <p className="text-[11px] text-muted-foreground ml-4">{trend.posts} publications</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Online Users */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-glass p-5 rounded-2xl"
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Wifi className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-semibold text-sm text-foreground">En ligne</h3>
          <span className="ml-auto text-[10px] font-bold text-green-500 bg-green-500/10 rounded-full px-2 py-0.5">
            {onlineUsers.length}
          </span>
        </div>
        <div className="space-y-2.5">
          {onlineUsers.map((user, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-xs font-bold text-primary">
                  {user.name.charAt(0)}
                </div>
                {user.status === 'En ligne' && (
                  <div className="absolute -bottom-0.5 -right-0.5 online-dot" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{user.name}</p>
                <p className="text-[10px] text-muted-foreground">{user.status}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Notifications Preview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-glass p-5 rounded-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Bell className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">Notifications</h3>
          </div>
          <span className="notification-badge">3</span>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-primary/5 border border-primary/10">
            <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              N
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">Nouveau message reçu</p>
              <p className="text-[10px] text-muted-foreground">Il y a 2 min</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-primary/5 border border-primary/10">
            <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              C
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">Nouveau cours publié</p>
              <p className="text-[10px] text-muted-foreground">Il y a 1h</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
