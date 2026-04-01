import { useState } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useAuth } from '../lib/auth';
import { authAPI, uploadAPI } from '../lib/api';
import { getInitials, countries } from '../lib/utils';
import { toast } from 'sonner';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    country: user?.country || '',
    bio: user?.bio || '',
    instagram: user?.instagram || '',
    website: user?.website || '',
    avatar_url: user?.avatar_url || '',
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const response = await uploadAPI.image(file);
      setFormData({ ...formData, avatar_url: response.data.url });
      toast.success('Imagen subida');
    } catch (error) {
      toast.error('Error al subir la imagen');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.updateProfile(formData);
      updateUser(response.data);
      toast.success('Perfil actualizado');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al actualizar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-culture-black pt-24 pb-16" data-testid="profile-page">
      <div className="max-w-2xl mx-auto px-4">
        {/* Back */}
        <Link 
          to="/dashboard"
          className="inline-flex items-center gap-2 text-culture-muted hover:text-culture-gold transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-culture-white mb-2">
            Mi perfil
          </h1>
          <p className="text-culture-muted">Edita tu información pública</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-24 h-24 border-2 border-culture-gold/30">
              <AvatarImage src={formData.avatar_url} />
              <AvatarFallback className="bg-culture-gold/20 text-culture-gold font-display text-2xl">
                {getInitials(formData.name || 'U')}
              </AvatarFallback>
            </Avatar>
            
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button type="button" variant="outline" className="btn-secondary">
                <Upload className="h-4 w-4 mr-2" />
                Cambiar foto
              </Button>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-culture-white">Nombre</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              data-testid="profile-name"
            />
          </div>

          {/* Email (readonly) */}
          <div className="space-y-2">
            <Label className="text-culture-white">Email</Label>
            <Input
              type="email"
              value={user?.email || ''}
              className="input-field opacity-50"
              disabled
            />
            <p className="text-culture-muted text-xs">El email no se puede cambiar</p>
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label className="text-culture-white">País</Label>
            <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
              <SelectTrigger className="input-field" data-testid="profile-country">
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

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-culture-white">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Cuéntanos sobre ti..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="input-field min-h-24 resize-none"
              data-testid="profile-bio"
            />
          </div>

          {/* Instagram */}
          <div className="space-y-2">
            <Label htmlFor="instagram" className="text-culture-white">Instagram</Label>
            <Input
              id="instagram"
              type="text"
              placeholder="@tuusuario"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              className="input-field"
              data-testid="profile-instagram"
            />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website" className="text-culture-white">Sitio web</Label>
            <Input
              id="website"
              type="url"
              placeholder="https://tusitio.com"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="input-field"
              data-testid="profile-website"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 btn-secondary"
              onClick={() => navigate('/dashboard')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 btn-primary"
              disabled={loading}
              data-testid="profile-submit"
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
