// App.tsx — providers (theme + React Query + lifecycle) and the route table.
// Every screen the navigation facade (useNav) can reach has a real URL here.
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { LifecycleProvider, Toasts } from '@/lib/lifecycle';
import { CollabProvider } from '@/lib/collab';
import { DirectoryPage } from '@/routes/DirectoryPage';
import { RecordPage } from '@/routes/RecordPage';
import { LoginPage } from '@/routes/LoginPage';
import { TrackerPage, ResourcesPage, TrainingPage, CohortPage } from '@/routes/PlaceholderPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 } },
});

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <LifecycleProvider>
          <CollabProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to="/directory/active" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/directory/:view" element={<DirectoryPage />} />
                <Route path="/profile/:id" element={<RecordPage kind="profile" />} />
                <Route path="/application/:id" element={<RecordPage kind="application" />} />
                <Route path="/alumni/:id" element={<RecordPage kind="alumniRecord" />} />
                <Route path="/tracker" element={<TrackerPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/training" element={<TrainingPage />} />
                <Route path="/training/builder" element={<TrainingPage />} />
                <Route path="/training/player/:id" element={<TrainingPage />} />
                <Route path="/cohort" element={<CohortPage />} />
                <Route path="*" element={<Navigate to="/directory/active" replace />} />
              </Routes>
            </BrowserRouter>
          </CollabProvider>
          <Toasts />
        </LifecycleProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
