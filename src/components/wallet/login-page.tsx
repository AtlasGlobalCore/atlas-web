'use client';

import { useState } from 'react';
import { useAuthStore, IS_DEV_MODE } from '@/lib/auth-store';
import { useTranslation } from '@/lib/i18n';
import { Eye, EyeOff, Loader2, Lock, Mail, Terminal, User } from 'lucide-react';
import { Logo3D } from '@/components/ui/logo-3d';
import { LoginGridBackground } from './login-grid-background';
import { Footer } from '@/components/atlas/footer';

/* ─── Login / Register Page ─── */
export default function LoginPage() {
  const { login, register, isLoading, loginError, registerError } = useAuthStore();
  const { t } = useTranslation();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('');

  // Register fields
  const [regIdentifier, setRegIdentifier] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Shared
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSent, setRegistrationSent] = useState(false);

  const switchMode = (newMode: 'login' | 'register') => {
    setRegistrationSent(false);
    setMode(newMode);
    useAuthStore.getState().clearErrors();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier || !regPassword) return;
    await login(loginIdentifier, regPassword);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regPassword || !regConfirmPassword) return;
    if (regPassword !== regConfirmPassword) {
      useAuthStore.setState({ registerError: 'As palavras-passe não coincidem.' });
      return;
    }
    const success = await register(regEmail, regPassword);
    if (success && !useAuthStore.getState().isAuthenticated) {
      setRegistrationSent(true);
    }
  };

  const currentError = mode === 'login' ? loginError : registerError;
  const isLoginFormDisabled = !loginIdentifier || !regPassword;
  const isRegisterFormDisabled = !regEmail || !regPassword || !regConfirmPassword;

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: '#0F1117' }}>
      <LoginGridBackground />

      {/* Radial glow behind card */}
      <div
        className="absolute z-[1] rounded-full"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(0,212,170,0.06) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Auth Content - centered */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="w-full max-w-md mx-4 animate-fade-up">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8 animate-fade-up-1">
            <Logo3D size="lg" spin showRing />
            <div className="mt-4 flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">
                <span className="text-[#FFFFFF]">Atlas</span>{' '}
                <span className="neon-glow" style={{ color: '#00D4AA' }}>Wallet</span>
              </h1>
            </div>
            <p className="nex-mono text-xs mt-1" style={{ color: '#A0A0A0' }}>
              {t('wallet.loginSubtitle')}
            </p>
            {IS_DEV_MODE && (
              <div className="dev-badge mt-3">
                <Terminal className="w-3 h-3" />
                {t('wallet.devBypass')}
              </div>
            )}
          </div>

          {/* Auth Card */}
          <div className="glass-panel p-8 animate-fade-up-2">
            <div className="nex-mono text-[10px] uppercase tracking-widest mb-6" style={{ color: '#606060' }}>
              {mode === 'login' ? t('wallet.loginSectionTitle') : t('wallet.registerSectionTitle')}
            </div>

            {/* Tab Toggle */}
            <div
              className="flex rounded-lg mb-6 p-1"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="flex-1 py-2 rounded-md text-sm font-medium transition-all"
                style={{
                  color: mode === 'login' ? '#00D4AA' : '#A0A0A0',
                  background: mode === 'login' ? 'rgba(0,212,170,0.1)' : 'transparent',
                }}
              >
                {t('wallet.loginTab')}
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="flex-1 py-2 rounded-md text-sm font-medium transition-all"
                style={{
                  color: mode === 'register' ? '#00D4AA' : '#A0A0A0',
                  background: mode === 'register' ? 'rgba(0,212,170,0.1)' : 'transparent',
                }}
              >
                {t('wallet.registerTab')}
              </button>
            </div>

            {/* Registration success message */}
            {registrationSent && (
              <div
                className="animate-fade-up rounded-lg px-4 py-3 text-sm mb-4"
                style={{
                  background: 'rgba(0, 212, 170, 0.08)',
                  border: '1px solid rgba(0, 212, 170, 0.25)',
                  color: '#00D4AA',
                }}
              >
                {t('wallet.accountCreated')}
              </div>
            )}

            {/* ─── LOGIN FORM ─── */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Identifier */}
                <div className="space-y-2">
                  <label className="nex-mono text-[11px] uppercase tracking-wider" style={{ color: '#A0A0A0' }}>
                    {t('wallet.identifier')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#606060' }} />
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="neon-input w-full pl-10 pr-4 py-3 rounded-lg text-sm"
                      placeholder={t('wallet.identifierPlaceholder')}
                      autoComplete='username'
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="nex-mono text-[11px] uppercase tracking-wider" style={{ color: '#A0A0A0' }}>
                    {t('wallet.password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#606060' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="neon-input w-full pl-10 pr-12 py-3 rounded-lg text-sm"
                      placeholder='••••••••••••'
                      autoComplete='current-password'
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded"
                      style={{ color: '#A0A0A0' }}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {currentError && (
                  <div
                    className="animate-fade-up rounded-lg px-4 py-3 text-sm"
                    style={{
                      background: 'rgba(255, 59, 92, 0.08)',
                      border: '1px solid rgba(255, 59, 92, 0.25)',
                      color: '#FF5252',
                    }}
                  >
                    {currentError}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading || isLoginFormDisabled}
                  className="neon-btn-primary w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('wallet.authenticating')}
                    </>
                  ) : (
                    t('wallet.enterPlatform')
                  )}
                </button>
              </form>
            )}

            {/* ─── REGISTER FORM ─── */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-5">
                {/* Identifier */}
                <div className="space-y-2">
                  <label className="nex-mono text-[11px] uppercase tracking-wider" style={{ color: '#A0A0A0' }}>
                    {t('wallet.identifier')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#606060' }} />
                    <input
                      type="text"
                      value={regIdentifier}
                      onChange={(e) => setRegIdentifier(e.target.value)}
                      className="neon-input w-full pl-10 pr-4 py-3 rounded-lg text-sm"
                      placeholder={t('wallet.identifierRegPlaceholder')}
                      autoComplete='username'
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="nex-mono text-[11px] uppercase tracking-wider" style={{ color: '#A0A0A0' }}>
                    {t('wallet.email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#606060' }} />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="neon-input w-full pl-10 pr-4 py-3 rounded-lg text-sm"
                      placeholder={t('wallet.emailPlaceholder')}
                      autoComplete='email'
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="nex-mono text-[11px] uppercase tracking-wider" style={{ color: '#A0A0A0' }}>
                    {t('wallet.password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#606060' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="neon-input w-full pl-10 pr-12 py-3 rounded-lg text-sm"
                      placeholder='••••••••••••'
                      autoComplete='new-password'
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded"
                      style={{ color: '#A0A0A0' }}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="nex-mono text-[10px]" style={{ color: '#606060' }}>
                    {t('wallet.minChars')}
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="nex-mono text-[11px] uppercase tracking-wider" style={{ color: '#A0A0A0' }}>
                    {t('wallet.confirmPassword')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#606060' }} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="neon-input w-full pl-10 pr-12 py-3 rounded-lg text-sm"
                      placeholder='••••••••••••'
                      autoComplete='new-password'
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded"
                      style={{ color: '#A0A0A0' }}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {currentError && (
                  <div
                    className="animate-fade-up rounded-lg px-4 py-3 text-sm"
                    style={{
                      background: 'rgba(255, 59, 92, 0.08)',
                      border: '1px solid rgba(255, 59, 92, 0.25)',
                      color: '#FF5252',
                    }}
                  >
                    {currentError}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading || isRegisterFormDisabled}
                  className="neon-btn-primary w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('wallet.creatingAccount')}
                    </>
                  ) : (
                    t('wallet.createAccount')
                  )}
                </button>
              </form>
            )}

            {/* Secure notice / Dev hint */}
            <div className="mt-6 flex items-center justify-center gap-2 nex-mono text-[10px]" style={{ color: '#606060' }}>
              <Lock className="w-3 h-3" />
              {t('wallet.encrypted')}
            </div>
            {IS_DEV_MODE && (
              <div className="mt-3 flex items-center justify-center gap-1.5 nex-mono text-[10px]" style={{ color: '#FFB800' }}>
                <Terminal className="w-3 h-3" />
                {t('wallet.devBypassActive')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer - same as rest of site */}
      <div className="relative z-10 mt-auto">
        <Footer />
      </div>
    </div>
  );
}
