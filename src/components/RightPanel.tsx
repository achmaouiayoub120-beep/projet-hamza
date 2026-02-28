'use client';

import { useState, useEffect } from 'react';
import { Users, Bell, TrendingUp, Info } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: number;
  name: string;
  major: string;
  studentId: string;
  avatarUrl?: string;
}

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
      <div className="card-elevated p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Info className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-sm text-foreground">A propos</h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
          Bienvenue sur le reseau social de votre universite. Connectez-vous avec vos camarades et partagez vos experiences.
        </p>
        <div className="flex items-center gap-3">
          <img
            src="/images/university-logo.png"
            alt="Logo Universite"
            className="h-8 w-8 object-contain"
            crossOrigin="anonymous"
          />
          <div>
            <p className="text-xs font-semibold text-foreground">Universite</p>
            <p className="text-[10px] text-muted-foreground">Annee universitaire 2025-2026</p>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="card-elevated p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">Suggestions</h3>
          </div>
          <Link href="/classmates" className="text-xs text-primary font-medium hover:underline">
            Voir tout
          </Link>
        </div>
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full skeleton" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-24 skeleton" />
                  <div className="h-2.5 w-16 skeleton" />
                </div>
                <div className="h-7 w-16 skeleton rounded-full" />
              </div>
            ))
          ) : users.length > 0 ? (
            users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <Link href={`/profile/${user.id}`}>
                  <img
                    src={getAvatarUrl(user)}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-border"
                    crossOrigin="anonymous"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/profile/${user.id}`} className="text-sm font-medium text-foreground truncate block hover:text-primary transition-colors">
                    {user.name}
                  </Link>
                  <p className="text-[11px] text-muted-foreground truncate">{user.major}</p>
                </div>
                <button
                  onClick={() => handleFollow(user.id)}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-200 ${
                    followingStates[user.id]
                      ? 'bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
                      : 'bg-primary text-primary-foreground hover:opacity-90'
                  }`}
                >
                  {followingStates[user.id] ? 'Abonne' : 'Suivre'}
                </button>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground text-center py-2">Aucune suggestion</p>
          )}
        </div>
      </div>

      {/* Trending */}
      <div className="card-elevated p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-sm text-foreground">Tendances</h3>
        </div>
        <div className="space-y-3">
          {[
            { tag: 'ExamsFin2026', posts: 42 },
            { tag: 'ProjetPFE', posts: 28 },
            { tag: 'StageEte', posts: 15 },
          ].map((trend) => (
            <div key={trend.tag} className="group cursor-pointer">
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {'#'}{trend.tag}
              </p>
              <p className="text-[11px] text-muted-foreground">{trend.posts} publications</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications Preview */}
      <div className="card-elevated p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">Notifications</h3>
          </div>
          <span className="w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 p-2.5 rounded-lg bg-accent/50">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold flex-shrink-0">
              N
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">Nouveau message recu</p>
              <p className="text-[10px] text-muted-foreground">Il y a 2 min</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-2.5 rounded-lg bg-accent/50">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold flex-shrink-0">
              C
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">Nouveau cours publie</p>
              <p className="text-[10px] text-muted-foreground">Il y a 1h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
