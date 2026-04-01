import { useState, useEffect } from 'react';
import { BarChart3, Eye, Heart, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { statsAPI, eventsAPI } from '../lib/api';
import { Skeleton } from '../components/ui/skeleton';

export default function StatsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, eventsRes] = await Promise.all([
          statsAPI.getOrganizerStats(),
          eventsAPI.getAll({ organizer_id: user.id }),
        ]);
        setStats(statsRes.data);
        setEvents(eventsRes.data);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-culture-black pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
        </div>
      </div>
    );
  }

  // Sort events by views
  const topEvents = [...events].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="min-h-screen bg-culture-black pt-24 pb-16" data-testid="stats-page">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-culture-white mb-2">
            Estadísticas
          </h1>
          <p className="text-culture-muted">Analiza el rendimiento de tus eventos</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-culture-gray p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 flex items-center justify-center bg-culture-gold/10 rounded-sm">
                <Calendar className="h-5 w-5 text-culture-gold" />
              </div>
            </div>
            <p className="font-display text-3xl text-culture-white mb-1">{stats?.total_events || 0}</p>
            <p className="text-culture-muted text-sm">Total eventos</p>
          </div>

          <div className="bg-culture-gray p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 flex items-center justify-center bg-blue-500/10 rounded-sm">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
            </div>
            <p className="font-display text-3xl text-culture-white mb-1">{stats?.events_this_month || 0}</p>
            <p className="text-culture-muted text-sm">Este mes</p>
          </div>

          <div className="bg-culture-gray p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 flex items-center justify-center bg-purple-500/10 rounded-sm">
                <Eye className="h-5 w-5 text-purple-400" />
              </div>
            </div>
            <p className="font-display text-3xl text-culture-gold mb-1">{stats?.total_views || 0}</p>
            <p className="text-culture-muted text-sm">Visualizaciones</p>
          </div>

          <div className="bg-culture-gray p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 flex items-center justify-center bg-red-500/10 rounded-sm">
                <Heart className="h-5 w-5 text-red-400" />
              </div>
            </div>
            <p className="font-display text-3xl text-culture-gold mb-1">{stats?.total_saves || 0}</p>
            <p className="text-culture-muted text-sm">Guardados</p>
          </div>
        </div>

        {/* Top Events */}
        <section>
          <h2 className="font-display text-xl font-semibold text-culture-white mb-6">
            Eventos más vistos
          </h2>

          {topEvents.length > 0 ? (
            <div className="space-y-3">
              {topEvents.map((event, index) => (
                <div 
                  key={event.id}
                  className="flex items-center gap-4 p-4 bg-culture-gray border border-white/5"
                >
                  <span className="font-display text-2xl text-culture-gold w-8">{index + 1}</span>
                  <img 
                    src={event.image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100'}
                    alt={event.title}
                    className="w-16 h-16 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-culture-white font-medium truncate">{event.title}</p>
                    <p className="text-culture-muted text-sm">{event.category_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-culture-white font-medium">{event.views}</p>
                    <p className="text-culture-muted text-sm">visitas</p>
                  </div>
                  <div className="text-right">
                    <p className="text-culture-white font-medium">{event.saves}</p>
                    <p className="text-culture-muted text-sm">guardados</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-culture-gray">
              <BarChart3 className="h-12 w-12 text-culture-muted mx-auto mb-4" />
              <p className="text-culture-muted">Aún no tienes datos de rendimiento</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
