import { HashRouter, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

import { Home } from '@/pages/Home';
import { Daily } from '@/pages/Daily';
import { Practice } from '@/pages/Practice';
import { Mistakes } from '@/pages/Mistakes';
import { Profile } from '@/pages/Profile';
import { Knowledge } from '@/pages/Knowledge';
import { Coding } from '@/pages/Coding';
import { Exam } from '@/pages/Exam';
import { Diagnosis } from '@/pages/Diagnosis';
import { Report } from '@/pages/Report';
import { Favorites } from '@/pages/Favorites';
import { Handbook } from '@/pages/Handbook';
import { HistoryPage } from '@/pages/HistoryPage';
import { TimedPractice } from '@/pages/TimedPractice';
import { PracticeQuestion } from '@/pages/PracticeQuestion';
import { PracticeResult } from '@/pages/PracticeResult';

import { AdminLogin } from '@/pages/admin/AdminLogin';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { QuestionManagement } from '@/pages/admin/QuestionManagement';
import { UserManagement } from '@/pages/admin/UserManagement';
import { AdminHandbook } from '@/pages/admin/AdminHandbook';
import { AdminDaily } from '@/pages/admin/AdminDaily';
import { AdminSettings } from '@/pages/admin/AdminSettings';
import { CurriculumManagement } from '@/pages/admin/CurriculumManagement';

const Loading = () => (
  <div className="min-h-screen bg-bg-primary flex items-center justify-center">
    <div className="text-center space-y-4">
      <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
      <p className="text-text-secondary">加载中...</p>
    </div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/daily" element={<Daily />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/practice/:level" element={<Practice />} />
          <Route path="/mistakes" element={<Mistakes />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/coding/:id" element={<Coding />} />
          <Route path="/coding" element={<Coding />} />
          <Route path="/exam" element={<Exam />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          <Route path="/report" element={<Report />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/handbook" element={<Handbook />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/timed" element={<TimedPractice />} />
          <Route path="/practice/question/:levelId/:topicId" element={<PracticeQuestion />} />
          <Route path="/practice/result" element={<PracticeResult />} />
          
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/questions" element={<QuestionManagement />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/handbook" element={<AdminHandbook />} />
          <Route path="/admin/daily" element={<AdminDaily />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/curriculum" element={<CurriculumManagement />} />
        </Routes>
      </HashRouter>
    </Suspense>
  );
}

export default App;
