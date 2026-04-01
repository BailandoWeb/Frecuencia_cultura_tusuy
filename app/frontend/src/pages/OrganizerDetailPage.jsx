import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Instagram, Globe, Mail, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Skeleton } from '../components/ui/skeleton';
import { EventCard } from '../components/EventCard';
import { organizersAPI, eventsAPI } from '../lib/api';
import { getInitials } from '../lib/utils';

export default function OrganizerDetailPage() {
  const { id } = useParams();
  const [organizer, setOrganizer] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [orgResponse, eventsResponse] = await Promise.all([
          organizersAPI.getById(id),
          eventsAPI.getAll({ organizer_id: id }),
        ]);
        setOrganizer(orgResponse.data);
        setEvents(eventsResponse.data);
      } catch (error) {
        console.error('Error loading organizer:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-culture-black pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="w-32 h-32 rounded-full mx-auto mb-6" />
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!organizer) {
    return (
      <div className="min-h-screen bg-culture-black pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl text-culture-white mb-4">Organizador no encontrado</h1>
          <Link to="/organizadores">
            <Button className="btn-primary">Ver organizadores</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-culture-black pt-24 pb-16" data-testid="organizer-detail-page">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back button */}
        <Link 
          to="/organizadores"
          className="inline-flex items-center gap-2 text-culture-muted hover:text-culture-gold transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Todos los organizadores
        </Link>

        {/* Profile Header */}
        <div className="text-center mb-12">
          <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-culture-gold/30">
            <AvatarImage src={organizer.avatar_url} />
            <AvatarFallback className="bg-culture-gold/20 text-culture-gold font-display text-4xl">
              {getInitials(organizer.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-culture-white">
              {organizer.name}
            </h1>
            {organizer.plan === 'pro' && (
              <Badge className="bg-culture-gold text-culture-black border-0">PRO</Badge>
            )}
          </div>

          {organizer.country && (
            <p className="text-culture-gold text-lg mb-4">{organizer.country}</p>
          )}

          {organizer.bio && (
            <p className="text-culture-muted text-lg max-w-xl mx-auto mb-6">
              {organizer.bio}
            </p>
          )}

          {/* Social Links */}
          <div className="flex justify-center gap-4">
            {organizer.instagram && (
              <a
                href={`https://instagram.com/${organizer.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-culture-gray hover:bg-culture-gold/20 transition-colors rounded-full"
                data-testid="organizer-instagram"
              >
                <Instagram className="h-5 w-5 text-culture-white" />
              </a>
            )}
            {organizer.website && (
              <a
                href={organizer.website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-culture-gray hover:bg-culture-gold/20 transition-colors rounded-full"
                data-testid="organizer-website"
              >
                <Globe className="h-5 w-5 text-culture-white" />
              </a>
            )}
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-8 pt-8 border-t border-white/10">
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-culture-gold">{organizer.events_count}</p>
              <p className="text-culture-muted text-sm">Eventos</p>
            </div>
          </div>
        </div>

        {/* Events */}
        <section>
          <h2 className="font-display text-2xl font-semibold text-culture-white mb-6">
            Eventos de {organizer.name}
          </h2>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-culture-gray">
              <Calendar className="h-12 w-12 text-culture-muted mx-auto mb-4" />
              <p className="text-culture-muted">Este organizador aún no tiene eventos publicados</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
