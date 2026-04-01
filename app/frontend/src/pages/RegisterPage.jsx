import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { countries } from '../lib/utils';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: searchParams.get('role') || 'user',
    country: '',
  });

  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    // Guardar perfil
    await supabase.from('users').insert([
      {
        id: data.user.id,
        email,
        name,
        role: "user"
      }
    ]);

    toast.success("Cuenta creada 🚀");
  };

  return (
    <div className="min-h-screen bg-culture-black pt-24 pb-16 flex items-center justify-center px-4" data-testid="register-page">
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
            Únete a la frecuencia
          </h1>
          <p className="text-culture-muted">
            Crea tu cuenta y descubre la cultura
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-culture-white">Nombre</Label>
            <Input
              id="name"
              type="text"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              required
              data-testid="register-name"
            />
          </div>

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
              data-testid="register-email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-culture-white">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field pr-12"
                required
                minLength={6}
                data-testid="register-password"
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

          <div className="space-y-3">
            <Label className="text-culture-white">¿Qué tipo de cuenta necesitas?</Label>
            <RadioGroup
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
              className="flex flex-col gap-3"
            >
              <label className={`flex items-center gap-3 p-4 cursor-pointer border transition-colors ${
                formData.role === 'user' 
                  ? 'border-culture-gold bg-culture-gold/10' 
                  : 'border-white/10 hover:border-white/20'
              }`}>
                <RadioGroupItem value="user" id="user" className="border-culture-gold text-culture-gold" />
                <div>
                  <p className="text-culture-white font-medium">Usuario</p>
                  <p className="text-culture-muted text-sm">Descubre y guarda eventos</p>
                </div>
              </label>
              <label className={`flex items-center gap-3 p-4 cursor-pointer border transition-colors ${
                formData.role === 'organizer' 
                  ? 'border-culture-gold bg-culture-gold/10' 
                  : 'border-white/10 hover:border-white/20'
              }`}>
                <RadioGroupItem value="organizer" id="organizer" className="border-culture-gold text-culture-gold" />
                <div>
                  <p className="text-culture-white font-medium">Organizador</p>
                  <p className="text-culture-muted text-sm">Publica y gestiona eventos</p>
                </div>
              </label>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-culture-white">País de origen (opcional)</Label>
            <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
              <SelectTrigger className="w-full input-field" data-testid="register-country">
                <SelectValue placeholder="Selecciona tu país" />
              </SelectTrigger>
              <SelectContent className="bg-culture-gray border-white/10">
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full btn-primary h-12"
            disabled={loading}
            data-testid="register-submit"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>
        </form>

        {/* Login link */}
        <p className="text-center text-culture-muted mt-8">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-culture-gold hover:text-culture-gold-light">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
