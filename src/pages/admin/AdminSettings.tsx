import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, BookOpen, FileQuestion, Settings, Bell,
  Save, RotateCcw, Shield, Bell as BellIcon, Palette, Database,
  Key, Globe, Mail, Server, AlertTriangle, CheckCircle2,
  Moon, Sun, Monitor, Smartphone, Tablet, Clock, DatabaseBackup,
  Upload, Download, Trash2, RefreshCw, Eye, EyeOff, Plus, X, GraduationCap
} from 'lucide-react';

const sidebarMenu = [
  { icon: LayoutDashboard, label: '仪表盘', path: '/admin/dashboard' },
  { icon: FileQuestion, label: '题库管理', path: '/admin/questions' },
  { icon: GraduationCap, label: '学科与等级', path: '/admin/curriculum' },
  { icon: Users, label: '用户管理', path: '/admin/users' },
  { icon: BookOpen, label: '知识手册', path: '/admin/handbook' },
  { icon: Bell, label: '每日一题', path: '/admin/daily' },
  { icon: Settings, label: '系统设置', path: '/admin/settings' },
];

export const AdminSettings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKey, setShowApiKey] = useState(false);

  const tabs = [
    { id: 'general', label: '基本设置', icon: Settings },
    { id: 'appearance', label: '外观设置', icon: Palette },
    { id: 'notification', label: '通知设置', icon: BellIcon },
    { id: 'security', label: '安全设置', icon: Shield },
    { id: 'system', label: '系统参数', icon: Server },
    { id: 'backup', label: '数据备份', icon: DatabaseBackup },
  ];

  const [settings, setSettings] = useState({
    siteName: 'GESP Ace',
    siteDescription: 'AI-powered GESP Programming Practice Platform',
    contactEmail: 'admin@gespace.edu.cn',
    contactPhone: '400-123-4567',
    address: 'https://gespace.edu.cn',
    icpNumber: '京ICP备XXXXXXXX号-1',
    copyright: '© 2024 GESP Ace. All rights reserved.',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerification: true,
    allowSocialLogin: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireSpecialChar: true,
    enableCaptcha: true,
    backupFrequency: 'daily',
    backupRetention: 30,
    logRetention: 90,
  });

  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState({
    emailNewUser: true,
    emailDailyReport: true,
    emailSystemAlert: true,
    pushNewQuestion: true,
    pushDailyReminder: true,
    pushAchievement: true,
    smsSecurityAlert: false,
    smsMarketing: false,
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            <div>
              <h2 className="font-bold text-gray-900">GESP Ace</h2>
              <p className="text-xs text-gray-500">管理后台</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarMenu.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                item.label === '系统设置'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all">
            <Bell className="w-5 h-5" />
            <span className="font-medium">退出登录</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
              <p className="text-gray-500 text-sm">配置系统参数，管理网站设置</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                恢复默认
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors flex items-center gap-2">
                <Save className="w-5 h-5" />
                保存设置
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="flex gap-8">
            <div className="w-64 shrink-0">
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              {activeTab === 'general' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-6">基本设置</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          网站名称
                        </label>
                        <input
                          type="text"
                          value={settings.siteName}
                          onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          联系邮箱
                        </label>
                        <input
                          type="email"
                          value={settings.contactEmail}
                          onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        网站描述
                      </label>
                      <textarea
                        value={settings.siteDescription}
                        onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          联系电话
                        </label>
                        <input
                          type="text"
                          value={settings.contactPhone}
                          onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          网站地址
                        </label>
                        <input
                          type="url"
                          value={settings.address}
                          onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ICP备案号
                        </label>
                        <input
                          type="text"
                          value={settings.icpNumber}
                          onChange={(e) => setSettings({ ...settings, icpNumber: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          版权信息
                        </label>
                        <input
                          type="text"
                          value={settings.copyright}
                          onChange={(e) => setSettings({ ...settings, copyright: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">维护模式</p>
                          <p className="text-sm text-gray-500">开启后普通用户将无法访问网站</p>
                        </div>
                        <button
                          onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.maintenanceMode ? 'bg-primary' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              settings.maintenanceMode ? 'left-7' : 'left-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">开放注册</p>
                          <p className="text-sm text-gray-500">允许新用户注册账号</p>
                        </div>
                        <button
                          onClick={() => setSettings({ ...settings, registrationEnabled: !settings.registrationEnabled })}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.registrationEnabled ? 'bg-primary' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              settings.registrationEnabled ? 'left-7' : 'left-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">邮箱验证</p>
                          <p className="text-sm text-gray-500">注册时需要验证邮箱</p>
                        </div>
                        <button
                          onClick={() => setSettings({ ...settings, emailVerification: !settings.emailVerification })}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.emailVerification ? 'bg-primary' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              settings.emailVerification ? 'left-7' : 'left-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'appearance' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-6">外观设置</h3>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      主题模式
                    </label>
                    <div className="flex gap-4">
                      {[
                        { id: 'light', label: '浅色', icon: Sun },
                        { id: 'dark', label: '深色', icon: Moon },
                        { id: 'auto', label: '跟随系统', icon: Monitor },
                      ].map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => setTheme(mode.id)}
                          className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                            theme === mode.id
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <mode.icon className={`w-8 h-8 mx-auto mb-2 ${
                            theme === mode.id ? 'text-primary' : 'text-gray-400'
                          }`} />
                          <p className={`text-sm font-medium ${
                            theme === mode.id ? 'text-primary' : 'text-gray-600'
                          }`}>
                            {mode.label}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      主题色
                    </label>
                    <div className="flex gap-4">
                      {[
                        { name: '活力橙', color: 'bg-orange-500' },
                        { name: '科技蓝', color: 'bg-blue-500' },
                        { name: '清新绿', color: 'bg-green-500' },
                        { name: '神秘紫', color: 'bg-purple-500' },
                        { name: '玫瑰红', color: 'bg-pink-500' },
                        { name: '商务灰', color: 'bg-gray-500' },
                      ].map((item) => (
                        <button
                          key={item.name}
                          className={`w-12 h-12 rounded-xl ${item.color} shadow-lg hover:scale-110 transition-transform relative`}
                          title={item.name}
                        >
                          <CheckCircle2 className="absolute top-1 right-1 w-4 h-4 text-white" />
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'notification' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-6">通知设置</h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        邮件通知
                      </h4>
                      <div className="space-y-4 pl-6">
                        {[
                          { key: 'emailNewUser', label: '新用户注册通知', desc: '有新用户注册时发送邮件通知' },
                          { key: 'emailDailyReport', label: '每日数据报告', desc: '每日发送学习数据汇总报告' },
                          { key: 'emailSystemAlert', label: '系统告警通知', desc: '系统出现异常时发送告警邮件' },
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{item.label}</p>
                              <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                            <button
                              onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                              className={`relative w-12 h-6 rounded-full transition-colors ${
                                notifications[item.key as keyof typeof notifications] ? 'bg-primary' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                  notifications[item.key as keyof typeof notifications] ? 'left-7' : 'left-1'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <BellIcon className="w-4 h-4" />
                        推送通知
                      </h4>
                      <div className="space-y-4 pl-6">
                        {[
                          { key: 'pushNewQuestion', label: '新题目提醒', desc: '题库更新时推送通知' },
                          { key: 'pushDailyReminder', label: '每日练习提醒', desc: '提醒用户完成每日练习' },
                          { key: 'pushAchievement', label: '成就达成通知', desc: '用户达成成就时推送通知' },
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{item.label}</p>
                              <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                            <button
                              onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                              className={`relative w-12 h-6 rounded-full transition-colors ${
                                notifications[item.key as keyof typeof notifications] ? 'bg-primary' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                  notifications[item.key as keyof typeof notifications] ? 'left-7' : 'left-1'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-6">安全设置</h3>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          会话超时时间（分钟）
                        </label>
                        <select
                          value={settings.sessionTimeout}
                          onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value={15}>15分钟</option>
                          <option value={30}>30分钟</option>
                          <option value={60}>1小时</option>
                          <option value={120}>2小时</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          最大登录尝试次数
                        </label>
                        <select
                          value={settings.maxLoginAttempts}
                          onChange={(e) => setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value={3}>3次</option>
                          <option value={5}>5次</option>
                          <option value={10}>10次</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          密码最小长度
                        </label>
                        <select
                          value={settings.passwordMinLength}
                          onChange={(e) => setSettings({ ...settings, passwordMinLength: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value={6}>6位</option>
                          <option value={8}>8位</option>
                          <option value={12}>12位</option>
                          <option value={16}>16位</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          API密钥
                        </label>
                        <div className="relative">
                          <input
                            type={showApiKey ? 'text' : 'password'}
                            value="sk-1234567890abcdefghijklmnopqrstuvwxyz"
                            readOnly
                            className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <button
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">密码必须包含特殊字符</p>
                          <p className="text-sm text-gray-500">密码需包含 !@#$%^&* 等特殊字符</p>
                        </div>
                        <button
                          onClick={() => setSettings({ ...settings, requireSpecialChar: !settings.requireSpecialChar })}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.requireSpecialChar ? 'bg-primary' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              settings.requireSpecialChar ? 'left-7' : 'left-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">启用验证码</p>
                          <p className="text-sm text-gray-500">登录和注册时显示验证码</p>
                        </div>
                        <button
                          onClick={() => setSettings({ ...settings, enableCaptcha: !settings.enableCaptcha })}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.enableCaptcha ? 'bg-primary' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              settings.enableCaptcha ? 'left-7' : 'left-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">允许社交账号登录</p>
                          <p className="text-sm text-gray-500">支持微信、QQ等第三方账号登录</p>
                        </div>
                        <button
                          onClick={() => setSettings({ ...settings, allowSocialLogin: !settings.allowSocialLogin })}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.allowSocialLogin ? 'bg-primary' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              settings.allowSocialLogin ? 'left-7' : 'left-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'system' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-6">系统参数</h3>

                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Server className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">系统版本</span>
                        </div>
                        <p className="font-bold text-gray-900">v2.4.1</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Database className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">数据库</span>
                        </div>
                        <p className="font-bold text-gray-900">MySQL 8.0</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">运行环境</span>
                        </div>
                        <p className="font-bold text-gray-900">Node.js 18</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          数据备份频率
                        </label>
                        <select
                          value={settings.backupFrequency}
                          onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="hourly">每小时</option>
                          <option value="daily">每天</option>
                          <option value="weekly">每周</option>
                          <option value="monthly">每月</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          备份保留天数
                        </label>
                        <select
                          value={settings.backupRetention}
                          onChange={(e) => setSettings({ ...settings, backupRetention: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value={7}>7天</option>
                          <option value={14}>14天</option>
                          <option value={30}>30天</option>
                          <option value={90}>90天</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        日志保留天数
                      </label>
                      <select
                        value={settings.logRetention}
                        onChange={(e) => setSettings({ ...settings, logRetention: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value={30}>30天</option>
                        <option value={60}>60天</option>
                        <option value={90}>90天</option>
                        <option value={180}>180天</option>
                      </select>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-yellow-800">系统信息</p>
                          <p className="text-sm text-yellow-700 mt-1">
                            最后登录：2024-01-15 14:32:15 | 当前在线：23人 | 今日请求：12,456次
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'backup' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-6">数据备份</h3>

                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <Database className="w-8 h-8 text-blue-500 mb-2" />
                      <p className="text-sm text-gray-500">数据库大小</p>
                      <p className="text-xl font-bold text-gray-900">256.8 MB</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-xl">
                      <DatabaseBackup className="w-8 h-8 text-green-500 mb-2" />
                      <p className="text-sm text-gray-500">最近备份</p>
                      <p className="text-xl font-bold text-gray-900">2小时前</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-xl">
                      <Clock className="w-8 h-8 text-purple-500 mb-2" />
                      <p className="text-sm text-gray-500">备份文件</p>
                      <p className="text-xl font-bold text-gray-900">15 个</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <button className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                      <Download className="w-5 h-5" />
                      立即备份
                    </button>
                    <button className="w-full py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <Upload className="w-5 h-5" />
                      导入备份
                    </button>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">备份历史</h4>
                    <div className="space-y-2">
                      {[
                        { date: '2024-01-15 12:00', size: '256.8 MB', status: 'success' },
                        { date: '2024-01-14 12:00', size: '254.2 MB', status: 'success' },
                        { date: '2024-01-13 12:00', size: '251.5 MB', status: 'success' },
                        { date: '2024-01-12 12:00', size: '248.9 MB', status: 'success' },
                        { date: '2024-01-11 12:00', size: '246.3 MB', status: 'success' },
                      ].map((backup, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{backup.date}</p>
                              <p className="text-xs text-gray-500">{backup.size}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-white rounded-lg transition-colors" title="下载">
                              <Download className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-white rounded-lg transition-colors" title="还原">
                              <RefreshCw className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="删除">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
