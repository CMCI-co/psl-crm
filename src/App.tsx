// src/App.tsx
// App composition root: providers (React Query, Theme, Role, Router) + the route
// table mapping the prototype's route names to real URLs. Toasts render once at
// the root so any screen's collab action surfaces a confirmation.

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { RoleProvider } from '@/auth/RoleContext';
import { Toasts } from '@/components/collab/Chrome';
import DirectoryPage from '@/features/directory/DirectoryPage';
import ProfilePage from '@/features/profile/ProfilePage';
import { TrackerPage, ResourcesPage, TrainingPage, ApplicationPage } from '@/features/Stubs';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RoleProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/directory/active" replace />} />
              <Route path="/directory" element={<Navigate to="/directory/active" replace />} />
              <Route path="/directory/:view" element={<DirectoryPage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/application/:id" element={<ApplicationPage />} />
              <Route path="/tracker" element={<TrackerPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/training" element={<TrainingPage />} />
              <Route path="*" element={<Navigate to="/directory/active" replace />} />
            </Routes>
            <Toasts />
          </BrowserRouter>
        </RoleProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
