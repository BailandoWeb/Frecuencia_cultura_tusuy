import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, Link as LinkIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { useAuth } from '../lib/auth';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const { user, isPro } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [imagePreview, setImagePreview] = useState('');
  const [useImageUrl, setUseImageUrl] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category_id: '',
    date: '',
    time: '',
    location: '',
    district: '',
    price: 0,
    is_free: true,
    external_link: '',
  });

  useEffect(() => {
    const loadData = async () => {
      const [catRes, distRes] = await Promise.all([
        categoriesAPI.getAll(),
        districtsAPI.getAll(),
      ]);
      setCategories(catRes.data);
      setDistricts(distRes.data);

      // Load existing event if editing
      if (id) {
        try {
          const eventRes = await eventsAPI.getById(id);
          const event = eventRes.data;
          setFormData({
            title: event.title,
            description: event.description,
            image_url: event.image_url || '',
            category_id: event.category_id,
            date: event.date,
            time: event.time,
            location: event.location,
            district: event.district,
            price: event.price,
            is_free: event.is_free,
            external_link: event.external_link || '',
          });
          if (event.image_url) {
            setImagePreview(event.image_url);
            setUseImageUrl(true);
          }
        } catch (error) {
          toast.error('Error al cargar el evento');
          navigate('/dashboard/eventos');
        }
      }
    };

    loadData();
  }, [id, navigate]);

  /* const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen es demasiado grande (máx 5MB)');
      return;
    }

    try {
      const response = await uploadAPI.image(file);
      setFormData({ ...formData, image_url: response.data.url });
      setImagePreview(response.data.url);
      toast.success('Imagen subida');
    } catch (error) {
      toast.error('Error al subir la imagen');
    }
  }; */
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen es demasiado grande (máx 5MB)');
      return;
    }

    try {
      setLoading(true);

      const fileName = `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from('events')
        .upload(fileName, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from('events')
        .getPublicUrl(fileName);

      setFormData({
        ...formData,
        image_url: data.publicUrl,
      });

      setImagePreview(data.publicUrl);

      toast.success('Imagen subida');
    } catch (error) {
      console.error(error);
      toast.error('Error al subir imagen');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category_id) {
      toast.error('Selecciona una categoría');
      return;
    }

    setLoading(true);

    try {
      if (id) {
        await eventsAPI.update(id, formData);
        toast.success('Evento actualizado');
      } else {
        await eventsAPI.create(formData);
        toast.success('¡Evento creado!');
      }
      navigate('/dashboard/eventos');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al guardar el evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-culture-black pt-24 pb-16" data-testid="create-event-page">
      <div className="max-w-3xl mx-auto px-4">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-culture-muted hover:text-culture-gold transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-culture-white mb-2">
            {id ? 'Editar evento' : 'Crear evento'}
          </h1>
          <p className="text-culture-muted">
            {id ? 'Actualiza la información de tu evento' : 'Publica tu evento y conecta con la comunidad'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image */}
          <div className="space-y-4">
            <Label className="text-culture-white">Imagen del evento</Label>
            
            <div className="flex items-center gap-4 mb-4">
              <button
                type="button"
                onClick={() => setUseImageUrl(false)}
                className={`px-4 py-2 text-sm transition-colors ${!useImageUrl ? 'bg-culture-gold text-culture-black' : 'bg-culture-gray text-culture-white'}`}
              >
                Subir imagen
              </button>
              <button
                type="button"
                onClick={() => setUseImageUrl(true)}
                className={`px-4 py-2 text-sm transition-colors ${useImageUrl ? 'bg-culture-gold text-culture-black' : 'bg-culture-gray text-culture-white'}`}
              >
                URL externa
              </button>
            </div>

            {useImageUrl ? (
              <div className="space-y-2">
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-culture-muted" />
                  <Input
                    type="url"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    value={formData.image_url}
                    onChange={(e) => {
                      setFormData({ ...formData, image_url: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    className="input-field pl-12"
                    data-testid="image-url-input"
                  />
                </div>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  data-testid="image-upload"
                />
                <div className="border-2 border-dashed border-white/20 p-8 text-center hover:border-culture-gold/50 transition-colors">
                  <Upload className="h-8 w-8 text-culture-muted mx-auto mb-2" />
                  <p className="text-culture-muted text-sm">
                    Arrastra una imagen o haz clic para seleccionar
                  </p>
                  <p className="text-culture-muted text-xs mt-1">PNG, JPG hasta 5MB</p>
                </div>
              </div>
            )}

            {imagePreview && (
              <div className="relative w-full aspect-video bg-culture-gray">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview('');
                    setFormData({ ...formData, image_url: '' });
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-culture-black/80 flex items-center justify-center rounded-full"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-culture-white">Título *</Label>
            <Input
              id="title"
              type="text"
              placeholder="Nombre del evento"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              required
              data-testid="event-title"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-culture-white">Descripción *</Label>
            <Textarea
              id="description"
              placeholder="Describe tu evento..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field min-h-32 resize-none"
              required
              data-testid="event-description"
            />
          </div>

          {/* Category & District */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-culture-white">Categoría *</Label>
              <Select 
                value={formData.category_id} 
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger className="input-field" data-testid="event-category">
                  <SelectValue placeholder="Selecciona categoría" />
                </SelectTrigger>
                <SelectContent className="bg-culture-gray border-white/10">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-culture-white">Distrito *</Label>
              <Select 
                value={formData.district} 
                onValueChange={(value) => setFormData({ ...formData, district: value })}
              >
                <SelectTrigger className="input-field" data-testid="event-district">
                  <SelectValue placeholder="Selecciona distrito" />
                </SelectTrigger>
                <SelectContent className="bg-culture-gray border-white/10">
                  {districts.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-culture-white">Fecha *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input-field"
                required
                data-testid="event-date"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="text-culture-white">Hora *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="input-field"
                required
                data-testid="event-time"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-culture-white">Ubicación *</Label>
            <Input
              id="location"
              type="text"
              placeholder="Nombre del lugar o dirección"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="input-field"
              required
              data-testid="event-location"
            />
          </div>

          {/* Price */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-culture-white">Evento gratuito</Label>
              <Switch
                checked={formData.is_free}
                onCheckedChange={(checked) => setFormData({ ...formData, is_free: checked, price: checked ? 0 : formData.price })}
                data-testid="event-free-switch"
              />
            </div>

            {!formData.is_free && (
              <div className="space-y-2">
                <Label htmlFor="price" className="text-culture-white">Precio (€)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="input-field"
                  data-testid="event-price"
                />
              </div>
            )}
          </div>

          {/* External Link */}
          <div className="space-y-2">
            <Label htmlFor="external_link" className="text-culture-white">
              Enlace externo (entradas, registro, etc.)
            </Label>
            <Input
              id="external_link"
              type="url"
              placeholder="https://..."
              value={formData.external_link}
              onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
              className="input-field"
              data-testid="event-external-link"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              className="btn-secondary flex-1"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading}
              data-testid="submit-event"
            >
              {loading ? 'Guardando...' : (id ? 'Actualizar evento' : 'Publicar evento')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
