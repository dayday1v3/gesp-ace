import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, BookOpen, FileQuestion, Settings, Bell,
  Plus, Edit, Trash2, X, GraduationCap, Layers, LogOut,
} from 'lucide-react';
import { subjectAPI, type Subject, type SubjectWriteInput } from '@/services/subject';
import { levelAPI, type LevelItem, type LevelWriteInput } from '@/services/level';

const sidebarMenu = [
  { icon: LayoutDashboard, label: '仪表盘', path: '/admin/dashboard' },
  { icon: FileQuestion, label: '题库管理', path: '/admin/questions' },
  { icon: GraduationCap, label: '学科与等级', path: '/admin/curriculum' },
  { icon: Users, label: '用户管理', path: '/admin/users' },
  { icon: BookOpen, label: '知识手册', path: '/admin/handbook' },
  { icon: Bell, label: '每日一题', path: '/admin/daily' },
  { icon: Settings, label: '系统设置', path: '/admin/settings' },
];

type TabKey = 'subjects' | 'levels';

const emptySubject: SubjectWriteInput = {
  code: '',
  name: '',
  description: '',
  sortOrder: 0,
  status: 'active',
};

const emptyLevel = (subjectId: number): LevelWriteInput => ({
  subjectId,
  level: 1,
  name: '',
  description: '',
  stage: '',
  icon: '',
  color: '',
  sortOrder: 0,
  unlockRequirement: 0,
  status: 'locked',
});

export const CurriculumManagement: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>('subjects');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [levels, setLevels] = useState<LevelItem[]>([]);
  const [activeSubjectId, setActiveSubjectId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [subjectForm, setSubjectForm] = useState<SubjectWriteInput | null>(null);
  const [editingSubjectId, setEditingSubjectId] = useState<number | null>(null);

  const [levelForm, setLevelForm] = useState<LevelWriteInput | null>(null);
  const [editingLevelId, setEditingLevelId] = useState<number | null>(null);

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const response = await subjectAPI.list(true);
      const items = response.data?.subjects ?? [];
      setSubjects(items);
      if (!activeSubjectId && items.length > 0) {
        setActiveSubjectId(items[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadLevels = async (subjectId: number) => {
    setLoading(true);
    try {
      const response = await levelAPI.list({ subjectId });
      setLevels(response.data?.levels ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeSubjectId) loadLevels(activeSubjectId);
  }, [activeSubjectId]);

  const activeSubject = useMemo(
    () => subjects.find((s) => s.id === activeSubjectId) ?? null,
    [subjects, activeSubjectId],
  );

  const openSubjectCreate = () => {
    setEditingSubjectId(null);
    setSubjectForm({ ...emptySubject });
  };

  const openSubjectEdit = (s: Subject) => {
    setEditingSubjectId(s.id);
    setSubjectForm({
      code: s.code,
      name: s.name,
      description: s.description ?? '',
      sortOrder: s.sortOrder,
      status: s.status,
    });
  };

  const submitSubject = async () => {
    if (!subjectForm) return;
    if (editingSubjectId) {
      await subjectAPI.update(editingSubjectId, subjectForm);
    } else {
      await subjectAPI.create(subjectForm);
    }
    setSubjectForm(null);
    setEditingSubjectId(null);
    await loadSubjects();
  };

  const removeSubject = async (s: Subject) => {
    if (!window.confirm(`确认删除学科「${s.name}」？若仍有等级将被自动归档（status=inactive）。`)) {
      return;
    }
    await subjectAPI.remove(s.id);
    await loadSubjects();
  };

  const openLevelCreate = () => {
    if (!activeSubjectId) return;
    setEditingLevelId(null);
    const nextLevel = (levels.reduce((m, l) => Math.max(m, l.level), 0) || 0) + 1;
    setLevelForm({ ...emptyLevel(activeSubjectId), level: nextLevel });
  };

  const openLevelEdit = (l: LevelItem) => {
    setEditingLevelId(l.id);
    setLevelForm({
      subjectId: l.subjectId,
      level: l.level,
      name: l.name,
      description: l.description ?? '',
      stage: l.stage ?? '',
      icon: l.icon ?? '',
      color: l.color ?? '',
      sortOrder: l.sortOrder,
      unlockRequirement: typeof l.unlockRequirement === 'string'
        ? parseFloat(l.unlockRequirement)
        : l.unlockRequirement,
      status: l.status,
    });
  };

  const submitLevel = async () => {
    if (!levelForm) return;
    if (editingLevelId) {
      await levelAPI.update(editingLevelId, levelForm);
    } else {
      await levelAPI.create(levelForm);
    }
    setLevelForm(null);
    setEditingLevelId(null);
    if (activeSubjectId) await loadLevels(activeSubjectId);
  };

  const removeLevel = async (l: LevelItem) => {
    const used = (l._count?.questions ?? 0) + (l._count?.knowledgePoints ?? 0);
    const note = used > 0
      ? '该等级仍被题目或知识点引用，将仅归档为 locked，不会真正删除。'
      : '该等级没有关联数据，将真正删除。';
    if (!window.confirm(`确认操作等级「Lv.${l.level} ${l.name}」？\n${note}`)) return;
    await levelAPI.remove(l.id);
    if (activeSubjectId) await loadLevels(activeSubjectId);
  };

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
                item.path === '/admin/curriculum'
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
            <LogOut className="w-5 h-5" />
            <span className="font-medium">退出登录</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">学科与等级</h1>
              <p className="text-gray-500 text-sm">配置学科（GESP / CSP-J / CSP-S 等）及其等级体系</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTab('subjects')}
                className={`px-4 py-2 rounded-xl text-sm transition-all ${
                  tab === 'subjects' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Layers className="w-4 h-4" /> 学科
                </span>
              </button>
              <button
                onClick={() => setTab('levels')}
                className={`px-4 py-2 rounded-xl text-sm transition-all ${
                  tab === 'levels' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" /> 等级
                </span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-6">
          {tab === 'subjects' && (
            <section className="bg-white rounded-2xl shadow-sm">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">学科列表</h2>
                  <p className="text-sm text-gray-500">学科是等级的容器，删除时若仍有等级会自动归档。</p>
                </div>
                <button
                  onClick={openSubjectCreate}
                  className="px-4 py-2 bg-primary text-white rounded-xl flex items-center gap-2 hover:bg-primary-dark transition-colors"
                >
                  <Plus className="w-4 h-4" /> 新建学科
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="text-left px-6 py-3 font-medium">code</th>
                      <th className="text-left px-6 py-3 font-medium">名称</th>
                      <th className="text-left px-6 py-3 font-medium">描述</th>
                      <th className="text-left px-6 py-3 font-medium">排序</th>
                      <th className="text-left px-6 py-3 font-medium">状态</th>
                      <th className="text-left px-6 py-3 font-medium">等级数</th>
                      <th className="text-right px-6 py-3 font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((s) => (
                      <tr key={s.id} className="border-t border-gray-100">
                        <td className="px-6 py-3 font-mono text-gray-700">{s.code}</td>
                        <td className="px-6 py-3 text-gray-900">{s.name}</td>
                        <td className="px-6 py-3 text-gray-500 max-w-xs truncate">{s.description ?? '-'}</td>
                        <td className="px-6 py-3 text-gray-500">{s.sortOrder}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            s.status === 'active' ? 'bg-green-500/10 text-green-600' : 'bg-gray-200 text-gray-600'
                          }`}>{s.status === 'active' ? '启用' : '已停用'}</span>
                        </td>
                        <td className="px-6 py-3 text-gray-500">{s._count?.levels ?? 0}</td>
                        <td className="px-6 py-3 text-right space-x-2">
                          <button
                            onClick={() => openSubjectEdit(s)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="编辑"
                          ><Edit className="w-4 h-4 text-gray-600" /></button>
                          <button
                            onClick={() => removeSubject(s)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="删除/归档"
                          ><Trash2 className="w-4 h-4 text-red-500" /></button>
                        </td>
                      </tr>
                    ))}
                    {subjects.length === 0 && (
                      <tr><td colSpan={7} className="text-center text-gray-400 py-12">暂无学科，先新建一个吧</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {tab === 'levels' && (
            <section className="bg-white rounded-2xl shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">等级列表</h2>
                  <p className="text-sm text-gray-500">每个学科一套等级；含关联题目时删除会被归档（status=locked）。</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white"
                    value={activeSubjectId ?? ''}
                    onChange={(e) => setActiveSubjectId(parseInt(e.target.value, 10))}
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}（{s.code}）</option>
                    ))}
                  </select>
                  <button
                    onClick={openLevelCreate}
                    disabled={!activeSubjectId}
                    className="px-4 py-2 bg-primary text-white rounded-xl flex items-center gap-2 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" /> 新建等级
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="text-left px-6 py-3 font-medium">Lv</th>
                      <th className="text-left px-6 py-3 font-medium">名称 / 阶段</th>
                      <th className="text-left px-6 py-3 font-medium">描述</th>
                      <th className="text-left px-6 py-3 font-medium">解锁阈值</th>
                      <th className="text-left px-6 py-3 font-medium">题目数</th>
                      <th className="text-left px-6 py-3 font-medium">知识点</th>
                      <th className="text-right px-6 py-3 font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {levels.map((l) => (
                      <tr key={l.id} className="border-t border-gray-100">
                        <td className="px-6 py-3 font-bold text-gray-900">
                          <span className="inline-flex items-center gap-2">
                            <span className="text-lg">{l.icon || '🎯'}</span>
                            Lv.{l.level}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="text-gray-900 font-medium">{l.name}</div>
                          <div className="text-xs text-gray-500">{l.stage || '-'}</div>
                        </td>
                        <td className="px-6 py-3 text-gray-500 max-w-xs truncate">{l.description ?? '-'}</td>
                        <td className="px-6 py-3 text-gray-500">{Number(l.unlockRequirement) * 100}%</td>
                        <td className="px-6 py-3 text-gray-500">{l._count?.questions ?? 0}</td>
                        <td className="px-6 py-3 text-gray-500">{l._count?.knowledgePoints ?? 0}</td>
                        <td className="px-6 py-3 text-right space-x-2">
                          <button
                            onClick={() => openLevelEdit(l)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="编辑"
                          ><Edit className="w-4 h-4 text-gray-600" /></button>
                          <button
                            onClick={() => removeLevel(l)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="删除/归档"
                          ><Trash2 className="w-4 h-4 text-red-500" /></button>
                        </td>
                      </tr>
                    ))}
                    {levels.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center text-gray-400 py-12">
                          {activeSubject ? `「${activeSubject.name}」 暂无等级，点右上角「新建等级」` : '请先新建一个学科'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {loading && (
            <div className="text-center text-gray-400 text-sm">加载中...</div>
          )}
        </div>
      </main>

      {subjectForm && (
        <Modal title={editingSubjectId ? '编辑学科' : '新建学科'} onClose={() => setSubjectForm(null)}>
          <div className="space-y-3">
            <Field label="code（唯一标识，例如 GESP / CSP-J）">
              <input
                value={subjectForm.code}
                onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                disabled={!!editingSubjectId}
                className="w-full border border-gray-200 rounded-xl px-3 py-2"
                placeholder="GESP"
              />
            </Field>
            <Field label="名称">
              <input
                value={subjectForm.name}
                onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2"
                placeholder="GESP 等级考试"
              />
            </Field>
            <Field label="描述">
              <textarea
                value={subjectForm.description ?? ''}
                onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="排序">
                <input
                  type="number"
                  value={subjectForm.sortOrder ?? 0}
                  onChange={(e) => setSubjectForm({ ...subjectForm, sortOrder: parseInt(e.target.value || '0', 10) })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                />
              </Field>
              <Field label="状态">
                <select
                  value={subjectForm.status ?? 'active'}
                  onChange={(e) => setSubjectForm({ ...subjectForm, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                >
                  <option value="active">启用</option>
                  <option value="inactive">停用</option>
                </select>
              </Field>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setSubjectForm(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600">取消</button>
              <button onClick={submitSubject} className="px-4 py-2 rounded-xl bg-primary text-white">保存</button>
            </div>
          </div>
        </Modal>
      )}

      {levelForm && (
        <Modal title={editingLevelId ? '编辑等级' : '新建等级'} onClose={() => setLevelForm(null)}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="级别 (Lv)">
                <input
                  type="number"
                  value={levelForm.level}
                  onChange={(e) => setLevelForm({ ...levelForm, level: parseInt(e.target.value || '1', 10) })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                />
              </Field>
              <Field label="排序">
                <input
                  type="number"
                  value={levelForm.sortOrder ?? 0}
                  onChange={(e) => setLevelForm({ ...levelForm, sortOrder: parseInt(e.target.value || '0', 10) })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                />
              </Field>
            </div>
            <Field label="名称">
              <input
                value={levelForm.name}
                onChange={(e) => setLevelForm({ ...levelForm, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2"
                placeholder="编程入门"
              />
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="阶段">
                <input
                  value={levelForm.stage ?? ''}
                  onChange={(e) => setLevelForm({ ...levelForm, stage: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                  placeholder="小学"
                />
              </Field>
              <Field label="图标 (emoji)">
                <input
                  value={levelForm.icon ?? ''}
                  onChange={(e) => setLevelForm({ ...levelForm, icon: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                  placeholder="🌱"
                />
              </Field>
              <Field label="解锁阈值 (0~1)">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={levelForm.unlockRequirement ?? 0}
                  onChange={(e) => setLevelForm({ ...levelForm, unlockRequirement: parseFloat(e.target.value || '0') })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                />
              </Field>
            </div>
            <Field label="渐变色 (Tailwind classes，例如 from-emerald-500 to-teal-500)">
              <input
                value={levelForm.color ?? ''}
                onChange={(e) => setLevelForm({ ...levelForm, color: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2"
              />
            </Field>
            <Field label="描述">
              <textarea
                value={levelForm.description ?? ''}
                onChange={(e) => setLevelForm({ ...levelForm, description: e.target.value })}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2"
              />
            </Field>
            <Field label="状态">
              <select
                value={levelForm.status ?? 'locked'}
                onChange={(e) => setLevelForm({ ...levelForm, status: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2"
              >
                <option value="locked">未解锁</option>
                <option value="unlocked">已解锁</option>
                <option value="in_progress">进行中</option>
                <option value="mastered">已掌握</option>
                <option value="weak">待加强</option>
              </select>
            </Field>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setLevelForm(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600">取消</button>
              <button onClick={submitLevel} className="px-4 py-2 rounded-xl bg-primary text-white">保存</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-auto"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  </div>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="block text-sm space-y-1">
    <span className="text-gray-600">{label}</span>
    {children}
  </label>
);

export default CurriculumManagement;
