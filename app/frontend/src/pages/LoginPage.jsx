import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      toast.success('¡Login correcto! 🚀');

      const redirect = searchParams.get('redirect') || '/dashboard';
      navigate(redirect);

    } catch (error) {
      toast.error(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-culture-black pt-24 pb-16 flex items-center justify-center px-4" data-testid="login-page">
      <div className="w-full max-w-md">
        {/* Back */}
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-culture-muted hover:text-culture-gold transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-culture-white mb-2">
            Bienvenido de nuevo
          </h1>
          <p className="text-culture-muted">
            Inicia sesión para acceder a tu cuenta
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-culture-white">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              required
              data-testid="login-email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-culture-white">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field pr-12"
                required
                data-testid="login-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-culture-muted hover:text-culture-white"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full btn-primary h-12"
            disabled={loading}
            data-testid="login-submit"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </form>

        {/* Demo accounts */}
        <div className="mt-6 p-4 bg-culture-gray border border-white/10">
          <p className="text-culture-muted text-sm mb-3">Cuentas de prueba:</p>
          <div className="space-y-2 text-sm">
            <p className="text-culture-white">
              <span className="text-culture-gold">Organizador Pro:</span> tusuy@frecuenciacultura.com / demo123
            </p>
            <p className="text-culture-white">
              <span className="text-culture-gold">Organizador:</span> raices@frecuenciacultura.com / demo123
            </p>
          </div>
        </div>

        {/* Register link */}
        <p className="text-center text-culture-muted mt-8">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="text-culture-gold hover:text-culture-gold-light">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
