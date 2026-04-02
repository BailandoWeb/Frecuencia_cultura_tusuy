"import { useEffect } from \"react\";
import \"@/App.css\";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from \"react-router-dom\";
import { Toaster } from \"./components/ui/sonner\";
import { AuthProvider, useAuth } from \"./lib/auth\";
import { Navbar } from \"./components/Navbar\";
import { Footer } from \"./components/Footer\";

// Pages
import HomePage from \"./pages/HomePage\";
import EventsPage from \"./pages/EventsPage\";
import EventDetailPage from \"./pages/EventDetailPage\";
import OrganizersPage from \"./pages/OrganizersPage\";
import OrganizerDetailPage from \"./pages/OrganizerDetailPage\";
import CategoriesPage from \"./pages/CategoriesPage\";
import LoginPage from \"./pages/LoginPage\";
import RegisterPage from \"./pages/RegisterPage\";
import DashboardPage from \"./pages/DashboardPage\";
import MyEventsPage from \"./pages/MyEventsPage\";
import CreateEventPage from \"./pages/CreateEventPage\";
import FavoritesPage from \"./pages/FavoritesPage\";
import StatsPage from \"./pages/StatsPage\";
import PlanPage from \"./pages/PlanPage\";
import ProfilePage from \"./pages/ProfilePage\";
import AboutPage from \"./pages/AboutPage\";
import ContactPage from \"./pages/ContactPage\";
import { AvisoLegalPage, PrivacidadPage, CookiesPage, TerminosPage } from \"./pages/LegalPages\";

// Protected Route Component
function ProtectedRoute({ children, requireOrganizer = false }) {
  const { isAuthenticated, isOrganizer, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className=\"min-h-screen bg-culture-black flex items-center justify-center\">
        <div className=\"w-8 h-8 border-2 border-culture-gold border-t-transparent rounded-full animate-spin\" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  if (requireOrganizer && !isOrganizer) {
    return <Navigate to=\"/dashboard\" replace />;
  }

  return children;
}

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Layout wrapper
function Layout({ children, showFooter = true }) {
  return (
    <div className=\"min-h-screen flex flex-col bg-culture-black\">
      <Navbar />
      <main className=\"flex-1\">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path=\"/\" element={<Layout><HomePage /></Layout>} />
      <Route path=\"/eventos\" element={<Layout><EventsPage /></Layout>} />
      <Route path=\"/evento/:id\" element={<Layout><EventDetailPage /></Layout>} />
      <Route path=\"/organizadores\" element={<Layout><OrganizersPage /></Layout>} />
      <Route path=\"/organizador/:id\" element={<Layout><OrganizerDetailPage /></Layout>} />
      <Route path=\"/categorias\" element={<Layout><CategoriesPage /></Layout>} />
      <Route path=\"/sobre-nosotros\" element={<Layout><AboutPage /></Layout>} />
      <Route path=\"/contacto\" element={<Layout><ContactPage /></Layout>} />
      
      {/* Auth Routes */}
      <Route path=\"/login\" element={<Layout showFooter={false}><LoginPage /></Layout>} />
      <Route path=\"/registro\" element={<Layout showFooter={false}><RegisterPage /></Layout>} />

      {/* Protected Routes - User */}
      <Route path=\"/dashboard\" element={
        <ProtectedRoute>
          <Layout><DashboardPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path=\"/guardados\" element={
        <ProtectedRoute>
          <Layout><FavoritesPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path=\"/dashboard/perfil\" element={
        <ProtectedRoute>
          <Layout><ProfilePage /></Layout>
        </ProtectedRoute>
      } />

      {/* Protected Routes - Organizer */}
      <Route path=\"/dashboard/eventos\" element={
        <ProtectedRoute requireOrganizer>
          <Layout><MyEventsPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path=\"/publicar\" element={
        <ProtectedRoute requireOrganizer>
          <Layout><CreateEventPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path=\"/editar-evento/:id\" element={
        <ProtectedRoute requireOrganizer>
          <Layout><CreateEventPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path=\"/dashboard/estadisticas\" element={
        <ProtectedRoute requireOrganizer>
          <Layout><StatsPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path=\"/dashboard/plan\" element={
        <ProtectedRoute requireOrganizer>
          <Layout><PlanPage /></Layout>
        </ProtectedRoute>
      } />

      {/* Legal Pages */}
      <Route path=\"/aviso-legal\" element={<Layout><AvisoLegalPage /></Layout>} />
      <Route path=\"/privacidad\" element={<Layout><PrivacidadPage /></Layout>} />
      <Route path=\"/cookies\" element={<Layout><CookiesPage /></Layout>} />
      <Route path=\"/terminos\" element={<Layout><TerminosPage /></Layout>} />

      {/* 404 Redirect */}
      <Route path=\"*\" element={<Navigate to=\"/\" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <AppRoutes />
        <Toaster 
          position=\"top-right\" 
          toastOptions={{
            style: {
              background: '#1C1C1C',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#F5F5F5',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
"
