import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { EmployeeFormPage } from '@/pages/employee-form.page';
import { EmployeesListPage } from '@/pages/employees-list.page';
import { EntriesListPage } from '@/pages/entries-list.page';
import { EntryCreatePage } from '@/pages/entry-create.page';
import { EntryEditPage } from '@/pages/entry-edit.page';
import { SiteFormPage } from '@/pages/site-form.page';
import { SitesListPage } from '@/pages/sites-list.page';
import { WorkTypeFormPage } from '@/pages/work-type-form.page';
import { WorkTypesListPage } from '@/pages/work-types-list.page';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/sites" replace />} />
            <Route path="sites" element={<SitesListPage />} />
            <Route path="sites/new" element={<SiteFormPage />} />
            <Route path="sites/:id/edit" element={<SiteFormPage />} />
            <Route path="sites/:siteId" element={<EntriesListPage />} />
            <Route path="sites/:siteId/entries/new" element={<EntryCreatePage />} />
            <Route path="sites/:siteId/entries/:id/edit" element={<EntryEditPage />} />
            <Route path="employees" element={<EmployeesListPage />} />
            <Route path="employees/new" element={<EmployeeFormPage />} />
            <Route path="employees/:id/edit" element={<EmployeeFormPage />} />
            <Route path="work-types" element={<WorkTypesListPage />} />
            <Route path="work-types/new" element={<WorkTypeFormPage />} />
            <Route path="work-types/:id/edit" element={<WorkTypeFormPage />} />
            <Route path="entries/*" element={<Navigate to="/sites" replace />} />
            <Route path="*" element={<Navigate to="/sites" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
