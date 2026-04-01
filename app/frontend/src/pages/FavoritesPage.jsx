import { useState, useEffect } from 'react';
import { Heart, Calendar } from 'lucide-react';
import { EventCard } from '../components/EventCard';
import { favoritesAPI } from '../lib/api';
import { Skeleton } from '../components/ui/skeleton';
import { useAuth } from '../lib/auth';

export default function FavoritesPage() {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      const response = await favoritesAPI.getAll();
      setFavorites(response.data);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-culture-black pt-24 pb-16" data-testid="favorites-page">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-culture-white mb-4">
            Eventos guardados
          </h1>
          <p className="text-culture-muted text-lg">
            Tus eventos favoritos en un solo lugar
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-culture-gray">
                <Skeleton className="aspect-[4/3]" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                isFavorite={true}
                onFavoriteChange={loadFavorites}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-culture-gray">
            <Heart className="h-16 w-16 text-culture-muted mx-auto mb-6" />
            <h3 className="font-display text-xl text-culture-white mb-2">
              No tienes eventos guardados
            </h3>
            <p className="text-culture-muted">
              Explora eventos y guarda los que más te interesen
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
