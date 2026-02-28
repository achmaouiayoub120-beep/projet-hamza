'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, GraduationCap } from 'lucide-react';

const majors = [
  'Informatique',
  'Genie Civil',
  'Genie Electrique',
  'Genie Mecanique',
  'Genie Industriel',
  'Sciences Mathematiques',
  'Physique',
  'Chimie',
  'Biologie',
  'Economie',
  'Droit',
  'Medecine',
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
      setError('Le mot de passe doit contenir au moins 6 caracteres');
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
        setError(data.error || "L'inscription a echoue");
      }
    } catch {
      setError('Une erreur est survenue. Veuillez reessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f8fafb' }}>
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden" style={{ backgroundColor: '#0c1829' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 80%, rgba(45, 152, 135, 0.15) 0%, transparent 60%)' }} />
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <img
              src="/images/university-logo.png"
              alt="Logo Universite"
              className="h-14 w-14 object-contain"
              crossOrigin="anonymous"
            />
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#ffffff' }}>UniSocial</h1>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Reseau Universitaire</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-md"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8" style={{ backgroundColor: 'rgba(45, 152, 135, 0.15)' }}>
              <GraduationCap className="h-8 w-8" style={{ color: '#2d9887' }} />
            </div>
            <h2 className="text-4xl font-bold leading-tight mb-6" style={{ color: '#ffffff', letterSpacing: '-0.03em' }}>
              Rejoignez la plus grande communaute etudiante.
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Creez votre profil et commencez a echanger avec vos camarades des aujourd'hui.
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xs"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            UniSocial 2026 - Tous droits reserves
          </motion.p>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img
              src="/images/university-logo.png"
              alt="Logo Universite"
              className="h-12 w-12 object-contain"
              crossOrigin="anonymous"
            />
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#0c1829' }}>UniSocial</h1>
              <p className="text-xs" style={{ color: '#6b7a8d' }}>Reseau Universitaire</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#0c1829' }}>Creer un compte</h2>
            <p style={{ color: '#6b7a8d' }}>Remplissez vos informations pour rejoindre UniSocial</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 rounded-xl text-sm font-medium"
                style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}
              >
                {error}
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
                  Nom complet
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ahmed Benali"
                  className="input-modern w-full"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="studentId" className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
                  N. Etudiant
                </label>
                <input
                  id="studentId"
                  name="studentId"
                  type="text"
                  required
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="ETU2026001"
                  className="input-modern w-full"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="ahmed.benali@universite.fr"
                className="input-modern w-full"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="major" className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
                Filiere
              </label>
              <select
                id="major"
                name="major"
                required
                value={formData.major}
                onChange={handleChange}
                className="input-modern w-full appearance-none cursor-pointer"
                disabled={isLoading}
              >
                <option value="">Selectionnez votre filiere</option>
                {majors.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 6 caracteres"
                    className="input-modern w-full pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: '#9ca3af' }}
                    aria-label={showPassword ? 'Masquer' : 'Afficher'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
                  Confirmer
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirmer"
                  className="input-modern w-full"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              style={{
                backgroundColor: '#2d9887',
                color: '#ffffff',
                boxShadow: '0 1px 3px rgba(45, 152, 135, 0.3)',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#257f70';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2d9887';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Creer mon compte
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px" style={{ backgroundColor: '#e5e7eb' }} />
            <span className="text-xs font-medium" style={{ color: '#9ca3af' }}>Deja inscrit ?</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#e5e7eb' }} />
          </div>

          <Link
            href="/login"
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{ backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e5e7eb'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; }}
          >
            Se connecter
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
