import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import AllBlogsPage from './pages/AllBlogsPage';
import CategoryPage from './pages/CategoryPage';
import BlogDetailsPage from './pages/BlogDetailsPage';
import CreateBlogPage from './pages/CreateBlogPage';
import EditBlogPage from './pages/EditBlogPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/blogs" element={<AllBlogsPage />} />
        <Route path="/blogs/:slug" element={<BlogDetailsPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/create" element={<CreateBlogPage />} />
        <Route path="/admin/edit/:slug" element={<EditBlogPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}