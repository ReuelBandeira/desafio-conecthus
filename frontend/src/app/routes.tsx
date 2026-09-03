import { CreateUserPage } from '@/features/users/pages/CreateUserPage';
import { EditUserPage } from '@/features/users/pages/EditUserPage';
import { HomePage } from '@/features/users/pages/HomePage';
import { UsersListPage } from '@/features/users/pages/UsersListPage';
import { ViewUserPage } from '@/features/users/pages/ViewUserPage';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/usuarios" element={<UsersListPage />} />
        <Route path="/usuarios/novo" element={<CreateUserPage />} />
        <Route path="/usuarios/:id" element={<ViewUserPage />} />
        <Route path="/usuarios/:id/editar" element={<EditUserPage />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  );
}
