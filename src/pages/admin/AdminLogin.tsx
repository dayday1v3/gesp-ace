import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { authAPI } from '@/services/auth';

interface ApiErrorPayload {
  message?: string;
  code?: number;
  errors?: Record<string, string[]>;
}

function describeError(err: unknown): string {
  if (!err) return '登录失败';
  if (typeof err === 'string') return err;
  const payload = err as ApiErrorPayload;
  if (payload.errors && typeof payload.errors === 'object') {
    const detail = Object.entries(payload.errors)
      .map(([k, v]) => `${k}: ${(v as string[]).join('; ')}`)
      .join(' | ');
    if (detail) return detail;
  }
  return payload.message || '登录失败';
}

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login({ username, password });
      // axios interceptor unwraps to response.data; runtime shape is { code, message, data: { token, user } }.
      // Tolerate both envelopes when the interceptor changes.
      const envelope = response as unknown as {
        data?: { token: string; user: { role?: string; username: string } };
        token?: string;
        user?: { role?: string; username: string };
      };
      const token = envelope.data?.token ?? envelope.token;
      const user = envelope.data?.user ?? envelope.user;

      if (!token || !user) {
        setError('登录响应异常，请联系管理员');
        return;
      }

      if (user.role !== 'admin') {
        setError(`账号「${user.username}」不是管理员，请使用管理员账号登录`);
        return;
      }

      localStorage.setItem('token', token);
      // Keep the legacy admin_token so any other code paths that still read it
      // do not break; the source of truth for API calls is `token`.
      localStorage.setItem('admin_token', token);

      navigate('/admin/dashboard');
    } catch (err) {
      setError(describeError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
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
          <h1 className="text-3xl font-bold text-white mb-2">GESP Ace</h1>
          <p className="text-slate-400">管理后台</p>
        </div>

        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                管理员账号
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="请输入管理员账号"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="请输入密码"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full"
            >
              登录
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center space-y-1">
            <p className="text-slate-500 text-xs">
              管理员账号需要在数据库里 <span className="font-mono">UPDATE users SET role='admin' ...</span>
            </p>
          </div>
        </Card>

        <p className="text-center text-slate-500 text-sm mt-6">
          © 2026 GESP Ace - 温暖的代码伙伴
        </p>
      </motion.div>
    </div>
  );
};
