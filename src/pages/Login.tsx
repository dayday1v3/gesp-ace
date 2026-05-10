import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/stores/userStore';

interface ApiErrorPayload {
  message?: string;
  code?: number;
  errors?: Record<string, string[]>;
}

function describeError(err: unknown): string {
  if (!err) return '请求失败';
  if (typeof err === 'string') return err;
  const payload = err as ApiErrorPayload;
  if (payload.errors && typeof payload.errors === 'object') {
    const detail = Object.entries(payload.errors)
      .map(([k, v]) => `${k}: ${(v as string[]).join('; ')}`)
      .join(' | ');
    if (detail) return detail;
  }
  return payload.message || '请求失败';
}

type Mode = 'login' | 'register';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isLoading } = useUserStore();

  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const redirectTo = (location.state as { from?: string } | null)?.from || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }

    try {
      if (mode === 'login') {
        await login(username, password);
      } else {
        await register(username, password, email || undefined);
      }
      navigate(redirectTo);
    } catch (err) {
      setError(describeError(err));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-orange-50 to-amber-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-6xl mb-4"
          >
            🎯
          </motion.div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">GESP Ace</h1>
          <p className="text-text-secondary">{mode === 'login' ? '欢迎回来' : '加入我们'}</p>
        </div>

        <Card>
          <div className="flex bg-bg-secondary rounded-2xl p-1 mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                mode === 'login' ? 'bg-white text-primary shadow-sm' : 'text-text-secondary'
              }`}
            >登录</button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                mode === 'register' ? 'bg-white text-primary shadow-sm' : 'text-text-secondary'
              }`}
            >注册</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-bg-secondary border border-transparent rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="请输入用户名"
                autoComplete="username"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">邮箱（可选）</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-bg-secondary border border-transparent rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-bg-secondary border border-transparent rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder={mode === 'register' ? '至少 8 位，含字母和数字' : '请输入密码'}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-danger/10 border border-danger/30 rounded-xl text-danger text-sm"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              className="w-full"
            >
              {mode === 'login' ? '登录' : '注册并登录'}
            </Button>
          </form>

          <div className="mt-4 text-center text-text-muted text-xs">
            {mode === 'login' ? (
              <>还没有账号？<button onClick={() => { setMode('register'); setError(''); }} className="text-primary hover:underline ml-1">立即注册</button></>
            ) : (
              <>已有账号？<button onClick={() => { setMode('login'); setError(''); }} className="text-primary hover:underline ml-1">直接登录</button></>
            )}
          </div>
        </Card>

        <p className="text-center text-text-muted text-sm mt-6">
          © 2026 GESP Ace - 温暖的代码伙伴
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
