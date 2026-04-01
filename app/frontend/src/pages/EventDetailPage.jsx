import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, MapPin, Clock, Heart, ExternalLink, Share2, 
  ChevronLeft, User, ArrowRight 
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Skeleton } from '../components/ui/skeleton';
import { EventCard } from '../components/EventCard';
import { eventsAPI, favoritesAPI } from '../lib/api';
import { useAuth } from '../lib/auth';
import { formatDate, formatPrice, getInitials } from '../lib/utils';
import { toast } from 'sonner';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const response = await eventsAPI.getById(id);
        setEvent(response.data);

        // Check if favorited
        if (isAuthenticated) {
          try {
            const favResponse = await favoritesAPI.check(id);
            setIsFavorite(favResponse.data.is_favorite);
          } catch (e) {}
        }

        // Load related events
        const relatedResponse = await eventsAPI.getAll({
          category: response.data.category_id,
          limit: 3,
        });
        setRelatedEvents(relatedResponse.data.filter(e => e.id !== id).slice(0, 3));
      } catch (error) {
        console.error('Error loading event:', error);
        toast.error('Error al cargar el evento');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id, isAuthenticated]);

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Inicia sesión para guardar eventos');
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await favoritesAPI.remove(id);
        setIsFavorite(false);
        toast.success('Evento eliminado de guardados');
      } else {
        await favoritesAPI.add(id);
        setIsFavorite(true);
        toast.success('Evento guardado');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al guardar');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Enlace copiado al portapapeles');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-culture-black pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="aspect-video w-full mb-6" />
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-6" />
              <Skeleton className="h-40 w-full" />
            </div>
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-culture-black pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl text-culture-white mb-4">Evento no encontrado</h1>
          <Button onClick={() => navigate('/eventos')} className="btn-primary">
            Ver todos los eventos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-culture-black pt-24 pb-16" data-testid="event-detail-page">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-culture-muted hover:text-culture-gold transition-colors mb-6"
          data-testid="back-btn"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Image */}
            <div className="relative aspect-video overflow-hidden mb-6">
              <img
                src={event.image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className="bg-culture-black/60 backdrop-blur-sm text-culture-white border-0">
                  {event.category_name}
                </Badge>
                {event.featured && (
                  <Badge className="bg-culture-gold text-culture-black border-0">
                    Destacado
                  </Badge>
                )}
              </div>
            </div>

            {/* Title & Meta */}
            <h1 className="font-display text-3xl md:text-4xl font-bold text-culture-white mb-4">
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-4 mb-8 text-culture-muted">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-culture-gold" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-culture-gold" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-culture-gold" />
                <span>{event.location}</span>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-invert max-w-none mb-8">
              <h3 className="font-display text-xl text-culture-white mb-4">Sobre el evento</h3>
              <p className="text-culture-muted leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Organizer */}
            <div className="border-t border-white/10 pt-8">
              <h3 className="font-display text-xl text-culture-white mb-4">Organizador</h3>
              <Link 
                to={`/organizador/${event.organizer_id}`}
                className="flex items-center gap-4 p-4 bg-culture-gray hover:bg-culture-surface transition-colors"
                data-testid="organizer-link"
              >
                <Avatar className="w-16 h-16">
                  <AvatarImage src={event.organizer_avatar} />
                  <AvatarFallback className="bg-culture-gold/20 text-culture-gold font-display text-xl">
                    {getInitials(event.organizer_name || 'O')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-display text-lg text-culture-white">{event.organizer_name}</p>
                  <p className="text-culture-muted text-sm">Ver perfil y otros eventos</p>
                </div>
                <ArrowRight className="h-5 w-5 text-culture-gold ml-auto" />
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-culture-gray border border-white/5 p-6">
              {/* Price */}
              <div className="text-center mb-6">
                <p className="text-culture-muted text-sm mb-1">Precio</p>
                <p className={`font-display text-4xl font-bold ${event.is_free ? 'text-green-400' : 'text-culture-gold'}`}>
                  {formatPrice(event.price)}
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {event.external_link ? (
                  <a href={event.external_link} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full btn-primary flex items-center justify-center gap-2" data-testid="tickets-btn">
                      <ExternalLink className="h-4 w-4" />
                      Conseguir entradas
                    </Button>
                  </a>
                ) : (
                  <Button className="w-full btn-primary" data-testid="tickets-btn">
                    Reservar plaza
                  </Button>
                )}

                <Button
                  variant="outline"
                  className={`w-full ${isFavorite ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'btn-secondary'}`}
                  onClick={handleFavorite}
                  disabled={favoriteLoading}
                  data-testid="save-event-btn"
                >
                  <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Guardado' : 'Guardar evento'}
                </Button>

                <Button
                  variant="outline"
                  className="w-full btn-secondary"
                  onClick={handleShare}
                  data-testid="share-btn"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="font-display text-2xl text-culture-white">{event.views}</p>
                  <p className="text-culture-muted text-sm">Visitas</p>
                </div>
                <div>
                  <p className="font-display text-2xl text-culture-white">{event.saves}</p>
                  <p className="text-culture-muted text-sm">Guardados</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <section className="mt-16 pt-16 border-t border-white/10">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-culture-gold text-sm font-medium uppercase tracking-wider mb-2">
                  También te puede interesar
                </p>
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-culture-white">
                  Eventos relacionados
                </h2>
              </div>
              <Link 
                to={`/eventos?category=${event.category_id}`}
                className="hidden md:flex items-center gap-2 text-culture-gold hover:text-culture-gold-light"
              >
                Ver más <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedEvents.map((relEvent) => (
                <EventCard key={relEvent.id} event={relEvent} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-culture-black border-t border-white/10 p-4 flex gap-3 md:hidden sticky-bottom-bar">
        <Button
          variant="outline"
          size="icon"
          className={isFavorite ? 'bg-red-500/10 border-red-500/50' : 'btn-secondary'}
          onClick={handleFavorite}
          disabled={favoriteLoading}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
        {event.external_link ? (
          <a href={event.external_link} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button className="w-full btn-primary">
              Entradas · {formatPrice(event.price)}
            </Button>
          </a>
        ) : (
          <Button className="flex-1 btn-primary">
            Reservar · {formatPrice(event.price)}
          </Button>
        )}
      </div>
    </div>
  );
}
