'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, GraduationCap, Sparkles } from 'lucide-react';

const majors = [
  'Informatique',
  'Génie Civil',
  'Génie Electrique',
  'Génie Mécanique',
  'Génie Industriel',
  'Sciences Mathématiques',
  'Physique',
  'Chimie',
  'Biologie',
  'Economie',
  'Droit',
  'Médecine',
  'Architecture',
  'Autre',
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    major: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          studentId: formData.studentId,
          major: formData.major,
          password: formData.password,
        }),
      });

      if (response.ok) {
        router.push('/login');
      } else {
        const data = await response.json();
        setError(data.error || "L'inscription a échoué");
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
      <div className="hidden lg:flex lg:w-[45%] auth-gradient-bg">
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Decorative Orbs */}
          <div className="absolute top-40 right-10 w-80 h-80 rounded-full bg-purple-500/8 blur-3xl animate-orb-1" />
          <div className="absolute bottom-20 left-20 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl animate-orb-2" />

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

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-md"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-white/60">Rejoignez la communauté</span>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center mb-8">
              <GraduationCap className="h-8 w-8 text-purple-400" />
            </div>
            <h2 className="text-4xl font-bold leading-[1.1] mb-6 text-white" style={{ letterSpacing: '-0.03em' }}>
              Rejoignez la plus grande{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                communauté étudiante.
              </span>
            </h2>
            <p className="text-lg leading-relaxed text-white/50">
              Créez votre profil et commencez à échanger avec vos camarades dès aujourd&apos;hui.
            </p>
          </motion.div>

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

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl -z-10" />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
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
              Créer un compte ✨
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground"
            >
              Remplissez vos informations pour rejoindre UniSocial
            </motion.p>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
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

            <div className="grid grid-cols-2 gap-4">
              <div className="floating-label-group">
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder=" "
                  className="input-modern w-full"
                  disabled={isLoading}
                />
                <label htmlFor="reg-name">Nom complet</label>
              </div>
              <div className="floating-label-group">
                <input
                  id="reg-studentId"
                  name="studentId"
                  type="text"
                  required
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder=" "
                  className="input-modern w-full"
                  disabled={isLoading}
                />
                <label htmlFor="reg-studentId">N° Étudiant</label>
              </div>
            </div>

            <div className="floating-label-group">
              <input
                id="reg-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
                className="input-modern w-full"
                disabled={isLoading}
              />
              <label htmlFor="reg-email">Adresse email</label>
            </div>

            <div>
              <label htmlFor="reg-major" className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wider">
                Filière
              </label>
              <select
                id="reg-major"
                name="major"
                required
                value={formData.major}
                onChange={handleChange}
                className="input-modern w-full appearance-none cursor-pointer"
                disabled={isLoading}
              >
                <option value="">Sélectionnez votre filière</option>
                {majors.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="floating-label-group">
                <div className="relative">
                  <input
                    id="reg-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder=" "
                    className="input-modern w-full pr-10"
                    disabled={isLoading}
                  />
                  <label htmlFor="reg-password">Mot de passe</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? 'Masquer' : 'Afficher'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="floating-label-group">
                <input
                  id="reg-confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder=" "
                  className="input-modern w-full"
                  disabled={isLoading}
                />
                <label htmlFor="reg-confirmPassword">Confirmer</label>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.01 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl text-sm font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed gradient-primary shadow-glow hover:shadow-glow-lg mt-2"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Créer mon compte
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="mt-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs font-medium text-muted-foreground">Déjà inscrit ?</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <Link
              href="/login"
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-semibold bg-secondary text-secondary-foreground border border-border hover:bg-muted hover:border-primary/20 transition-all duration-300 block"
            >
              Se connecter
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
