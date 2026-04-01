import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, PlusCircle, BarChart3, 
  Settings, Crown, Heart, User, ChevronRight, TrendingUp
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { EventCard } from '../components/EventCard';
import { useAuth } from '../lib/auth';
import { eventsAPI, favoritesAPI, statsAPI } from '../lib/api';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, isOrganizer, isPro } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [favResponse] = await Promise.all([
          favoritesAPI.getAll(),
        ]);
        setFavorites(favResponse.data);

        if (isOrganizer) {
          const [eventsResponse, statsResponse] = await Promise.all([
            eventsAPI.getAll({ organizer_id: user.id, limit: 4 }),
            statsAPI.getOrganizerStats(),
          ]);
          setMyEvents(eventsResponse.data);
          setStats(statsResponse.data);
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) loadData();
  }, [user, isOrganizer]);

  if (loading) {
    return (
      <div className="min-h-screen bg-culture-black pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-culture-black pt-24 pb-16" data-testid="dashboard-page">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-culture-white mb-2">
              Hola, {user?.name}
            </h1>
            <p className="text-culture-muted flex items-center gap-2">
              {isOrganizer ? 'Organizador' : 'Usuario'}
              {isPro && (
                <Badge className="bg-culture-gold text-culture-black border-0">
                  <Crown className="h-3 w-3 mr-1" />
                  PRO
                </Badge>
              )}
            </p>
          </div>
          {isOrganizer && (
            <Link to="/publicar">
              <Button className="btn-primary" data-testid="create-event-btn">
                <PlusCircle className="h-4 w-4 mr-2" />
                Crear evento
              </Button>
            </Link>
          )}
        </div>

        {/* Stats Grid (Organizer) */}
        {isOrganizer && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-culture-gray p-6 border border-white/5">
              <p className="text-culture-muted text-sm mb-1">Total eventos</p>
              <p className="font-display text-3xl text-culture-white">{stats.total_events}</p>
            </div>
            <div className="bg-culture-gray p-6 border border-white/5">
              <p className="text-culture-muted text-sm mb-1">Este mes</p>
              <p className="font-display text-3xl text-culture-white">{stats.events_this_month}</p>
              {!isPro && <p className="text-xs text-culture-gold mt-1">{stats.events_this_month}/2 gratis</p>}
            </div>
            <div className="bg-culture-gray p-6 border border-white/5">
              <p className="text-culture-muted text-sm mb-1">Visualizaciones</p>
              <p className="font-display text-3xl text-culture-gold">{stats.total_views}</p>
            </div>
            <div className="bg-culture-gray p-6 border border-white/5">
              <p className="text-culture-muted text-sm mb-1">Guardados</p>
              <p className="font-display text-3xl text-culture-gold">{stats.total_saves}</p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {isOrganizer && (
            <>
              <Link 
                to="/dashboard/eventos"
                className="flex items-center justify-between p-6 bg-culture-gray border border-white/5 hover:border-culture-gold/30 transition-colors group"
                data-testid="my-events-link"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-culture-gold/10 rounded-sm">
                    <Calendar className="h-6 w-6 text-culture-gold" />
                  </div>
                  <div>
                    <p className="text-culture-white font-medium">Mis eventos</p>
                    <p className="text-culture-muted text-sm">{myEvents.length} eventos activos</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-culture-muted group-hover:text-culture-gold transition-colors" />
              </Link>

              <Link 
                to="/dashboard/estadisticas"
                className="flex items-center justify-between p-6 bg-culture-gray border border-white/5 hover:border-culture-gold/30 transition-colors group"
                data-testid="stats-link"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-culture-gold/10 rounded-sm">
                    <BarChart3 className="h-6 w-6 text-culture-gold" />
                  </div>
                  <div>
                    <p className="text-culture-white font-medium">Estadísticas</p>
                    <p className="text-culture-muted text-sm">Analiza tu rendimiento</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-culture-muted group-hover:text-culture-gold transition-colors" />
              </Link>

              <Link 
                to="/dashboard/plan"
                className="flex items-center justify-between p-6 bg-culture-gray border border-white/5 hover:border-culture-gold/30 transition-colors group"
                data-testid="plan-link"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-culture-gold/10 rounded-sm">
                    <Crown className="h-6 w-6 text-culture-gold" />
                  </div>
                  <div>
                    <p className="text-culture-white font-medium">Mi plan</p>
                    <p className="text-culture-muted text-sm">Plan {isPro ? 'Pro' : 'Gratuito'}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-culture-muted group-hover:text-culture-gold transition-colors" />
              </Link>
            </>
          )}

          <Link 
            to="/guardados"
            className="flex items-center justify-between p-6 bg-culture-gray border border-white/5 hover:border-culture-gold/30 transition-colors group"
            data-testid="favorites-link"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-red-500/10 rounded-sm">
                <Heart className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-culture-white font-medium">Guardados</p>
                <p className="text-culture-muted text-sm">{favorites.length} eventos</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-culture-muted group-hover:text-culture-gold transition-colors" />
          </Link>

          <Link 
            to="/dashboard/perfil"
            className="flex items-center justify-between p-6 bg-culture-gray border border-white/5 hover:border-culture-gold/30 transition-colors group"
            data-testid="profile-link"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-culture-gold/10 rounded-sm">
                <User className="h-6 w-6 text-culture-gold" />
              </div>
              <div>
                <p className="text-culture-white font-medium">Mi perfil</p>
                <p className="text-culture-muted text-sm">Editar información</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-culture-muted group-hover:text-culture-gold transition-colors" />
          </Link>
        </div>

        {/* My Events (Organizer) */}
        {isOrganizer && myEvents.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-culture-white">
                Mis eventos recientes
              </h2>
              <Link to="/dashboard/eventos" className="text-culture-gold text-sm hover:text-culture-gold-light">
                Ver todos
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {myEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Favorites */}
        {favorites.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-culture-white">
                Eventos guardados
              </h2>
              <Link to="/guardados" className="text-culture-gold text-sm hover:text-culture-gold-light">
                Ver todos
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {favorites.slice(0, 4).map((event) => (
                <EventCard key={event.id} event={event} isFavorite={true} />
              ))}
            </div>
          </section>
        )}

        {/* Pro Upgrade Banner (if free) */}
        {isOrganizer && !isPro && (
          <div className="mt-10 p-8 bg-gradient-to-r from-culture-gold/20 to-culture-gold/5 border border-culture-gold/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-display text-2xl text-culture-white mb-2">
                  Amplifica tu frecuencia
                </h3>
                <p className="text-culture-muted">
                  Publica eventos ilimitados, destaca en el buscador y accede a estadísticas avanzadas.
                </p>
              </div>
              <Link to="/dashboard/plan">
                <Button className="btn-primary whitespace-nowrap" data-testid="upgrade-btn">
                  <Crown className="h-4 w-4 mr-2" />
                  Ver Plan Pro
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
