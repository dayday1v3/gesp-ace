import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
      <Router>
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
        </Routes>
      </Router>
    </Suspense>
  );
}

export default App;
