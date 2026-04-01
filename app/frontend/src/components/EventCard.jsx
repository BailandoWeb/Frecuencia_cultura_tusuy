import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Heart, ExternalLink } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useAuth } from '../lib/auth';
import { favoritesAPI } from '../lib/api';
import { formatShortDate, formatPrice, truncateText } from '../lib/utils';
import { toast } from 'sonner';

export function EventCard({ event, onFavoriteChange, isFavorite: initialFavorite = false }) {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Inicia sesión para guardar eventos');
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite) {
        await favoritesAPI.remove(event.id);
        setIsFavorite(false);
        toast.success('Evento eliminado de guardados');
      } else {
        await favoritesAPI.add(event.id);
        setIsFavorite(true);
        toast.success('Evento guardado');
      }
      onFavoriteChange?.();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al guardar evento');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link 
      to={`/evento/${event.id}`} 
      className="event-card card-event block group"
      data-testid={`event-card-${event.id}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={event.image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'}
          alt={event.title}
          className="event-card-image w-full h-full object-cover"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-culture-black/80 via-transparent to-transparent" />
        
        {/* Category badge */}
        <Badge 
          className="absolute top-3 left-3 bg-culture-black/60 backdrop-blur-sm text-culture-white border-0 text-xs"
        >
          {event.category_name}
        </Badge>

        {/* Featured badge */}
        {event.featured && (
          <Badge 
            className="absolute top-3 right-12 bg-culture-gold text-culture-black border-0 text-xs font-medium"
          >
            Destacado
          </Badge>
        )}

        {/* Favorite button */}
        <button
          onClick={handleFavoriteClick}
          disabled={isLoading}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-culture-black/60 backdrop-blur-sm rounded-full hover:bg-culture-black/80 transition-colors"
          data-testid={`favorite-btn-${event.id}`}
        >
          <Heart 
            className={`h-4 w-4 heart-icon ${isFavorite ? 'saved fill-red-500 text-red-500' : 'text-white'}`}
          />
        </button>

        {/* Price tag */}
        <div className="absolute bottom-3 right-3">
          <span className={`text-sm font-medium px-2 py-1 rounded ${event.is_free ? 'bg-green-500/20 text-green-400' : 'bg-culture-gold/20 text-culture-gold'}`}>
            {formatPrice(event.price)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-culture-white mb-2 group-hover:text-culture-gold transition-colors line-clamp-2">
          {event.title}
        </h3>
        
        <p className="text-culture-muted text-sm mb-3 line-clamp-2">
          {truncateText(event.description, 100)}
        </p>

        <div className="flex flex-col gap-2 text-sm text-culture-muted">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-culture-gold" />
            <span>{formatShortDate(event.date)} · {event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-culture-gold" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Organizer */}
        {event.organizer_name && (
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
            {event.organizer_avatar ? (
              <img 
                src={event.organizer_avatar} 
                alt={event.organizer_name}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-culture-gold/20 flex items-center justify-center">
                <span className="text-xs text-culture-gold font-medium">
                  {event.organizer_name.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-xs text-culture-muted">
              {event.organizer_name}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
