'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, BookOpen, Users, Zap, Sparkles } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Partagez vos connaissances',
    description: 'Publiez des cours, articles et ressources avec toute la communauté.',
  },
  {
    icon: Users,
    title: 'Connectez-vous',
    description: 'Retrouvez vos camarades et créez un réseau professionnel solide.',
  },
  {
    icon: Zap,
    title: 'Restez informé',
    description: "Suivez l'actualité universitaire et les événements en temps réel.",
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push('/');
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || 'Identifiants invalides');
      }
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 auth-gradient-bg">
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Decorative Orbs */}
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl animate-orb-1" />
          <div className="absolute bottom-40 left-10 w-96 h-96 rounded-full bg-blue-500/8 blur-3xl animate-orb-2" />

          {/* Logo & Brand */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-lg" />
              <img
                src="/images/university-logo.png"
                alt="Logo Université"
                className="relative h-14 w-14 object-contain"
                crossOrigin="anonymous"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">UniSocial</h1>
              <p className="text-sm text-white/40">Réseau Universitaire</p>
            </div>
          </motion.div>

          {/* Main Copy */}
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-white/60">Plateforme universitaire #1</span>
              </div>
              <h2 className="text-4xl xl:text-5xl font-bold leading-[1.1] mb-6 text-white" style={{ letterSpacing: '-0.03em' }}>
                Connectez, partagez et{' '}
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  collaborez
                </span>{' '}
                avec votre communauté.
              </h2>
              <p className="text-lg leading-relaxed mb-12 text-white/50">
                Rejoignez des milliers d&apos;étudiants qui partagent, apprennent et grandissent ensemble sur UniSocial.
              </p>
            </motion.div>

            {/* Features */}
            <div className="space-y-5">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.15 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                    <feature.icon className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1 text-white">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-white/40">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xs text-white/25"
          >
            © UniSocial 2026 — Tous droits réservés
          </motion.p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-blue-500/5 blur-3xl -z-10" />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <img
              src="/images/university-logo.png"
              alt="Logo Université"
              className="h-12 w-12 object-contain"
              crossOrigin="anonymous"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">UniSocial</h1>
              <p className="text-xs text-muted-foreground">Réseau Universitaire</p>
            </div>
          </div>

          <div className="mb-8">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold mb-2 text-foreground"
            >
              Bon retour 👋
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground"
            >
              Connectez-vous pour retrouver votre communauté
            </motion.p>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="px-4 py-3 rounded-2xl text-sm font-medium bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30"
              >
                {error}
              </motion.div>
            )}

            {/* Email */}
            <div className="floating-label-group">
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className="input-modern w-full"
                disabled={isLoading}
              />
              <label htmlFor="login-email">Adresse email</label>
            </div>

            {/* Password */}
            <div className="floating-label-group">
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  className="input-modern w-full pr-12"
                  disabled={isLoading}
                />
                <label htmlFor="login-password">Mot de passe</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.01 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl text-sm font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed gradient-primary shadow-glow hover:shadow-glow-lg"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex items-center gap-4"
          >
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-medium text-muted-foreground">Nouveau ici ?</span>
            <div className="flex-1 h-px bg-border" />
          </motion.div>

          {/* Register Link */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              href="/register"
              className="mt-5 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-semibold bg-secondary text-secondary-foreground border border-border hover:bg-muted hover:border-primary/20 transition-all duration-300 block"
            >
              Créer un compte
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
