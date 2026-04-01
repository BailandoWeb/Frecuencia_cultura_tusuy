import { useState } from 'react';
import { Mail, MapPin, Instagram, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { contactAPI } from '../lib/api';
import { toast } from 'sonner';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await contactAPI.send(formData);
      toast.success('Mensaje enviado. ¡Gracias por contactarnos!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Error al enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-culture-black pt-24 pb-16" data-testid="contact-page">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-culture-white mb-4">
            Contacto
          </h1>
          <p className="text-culture-muted text-lg max-w-xl mx-auto">
            ¿Tienes alguna pregunta o sugerencia? Nos encantaría escucharte.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="font-display text-2xl font-semibold text-culture-white mb-8">
              Información de contacto
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-culture-gold/10 rounded-sm flex-shrink-0">
                  <Mail className="h-5 w-5 text-culture-gold" />
                </div>
                <div>
                  <h3 className="text-culture-white font-medium mb-1">Email</h3>
                  <a href="mailto:hola@frecuenciacultura.com" className="text-culture-muted hover:text-culture-gold transition-colors">
                    hola@frecuenciacultura.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-culture-gold/10 rounded-sm flex-shrink-0">
                  <Instagram className="h-5 w-5 text-culture-gold" />
                </div>
                <div>
                  <h3 className="text-culture-white font-medium mb-1">Instagram</h3>
                  <a 
                    href="https://instagram.com/frecuenciacultura" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-culture-muted hover:text-culture-gold transition-colors"
                  >
                    @frecuenciacultura
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-culture-gold/10 rounded-sm flex-shrink-0">
                  <MapPin className="h-5 w-5 text-culture-gold" />
                </div>
                <div>
                  <h3 className="text-culture-white font-medium mb-1">Ubicación</h3>
                  <p className="text-culture-muted">Madrid, España</p>
                </div>
              </div>
            </div>

            {/* FAQ teaser */}
            <div className="mt-12 p-6 bg-culture-gray border border-white/5">
              <h3 className="font-display text-lg text-culture-white mb-3">
                ¿Eres organizador?
              </h3>
              <p className="text-culture-muted text-sm mb-4">
                Si quieres publicar tus eventos en nuestra plataforma, solo necesitas registrarte 
                como organizador. Es gratis y puedes empezar a publicar inmediatamente.
              </p>
              <a href="/registro?role=organizer" className="text-culture-gold text-sm hover:text-culture-gold-light">
                Registrarme como organizador →
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="font-display text-2xl font-semibold text-culture-white mb-8">
              Envíanos un mensaje
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
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
                    data-testid="contact-name"
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
                    data-testid="contact-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-culture-white">Asunto</Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="¿De qué quieres hablarnos?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="input-field"
                  required
                  data-testid="contact-subject"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-culture-white">Mensaje</Label>
                <Textarea
                  id="message"
                  placeholder="Tu mensaje..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input-field min-h-40 resize-none"
                  required
                  data-testid="contact-message"
                />
              </div>

              <Button
                type="submit"
                className="w-full btn-primary"
                disabled={loading}
                data-testid="contact-submit"
              >
                {loading ? (
                  'Enviando...'
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar mensaje
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
