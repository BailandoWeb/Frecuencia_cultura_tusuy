import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Eye, Heart, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import { Skeleton } from '../components/ui/skeleton';
import { useAuth } from '../lib/auth';
import { eventsAPI } from '../lib/api';
import { formatShortDate, formatPrice } from '../lib/utils';
import { toast } from 'sonner';

export default function MyEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    try {
      const response = await eventsAPI.getAll({ organizer_id: user.id });
      setEvents(response.data);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadEvents();
  }, [user]);

  const handleDelete = async (eventId) => {
    try {
      await eventsAPI.delete(eventId);
      setEvents(events.filter(e => e.id !== eventId));
      toast.success('Evento eliminado');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al eliminar');
    }
  };

  return (
    <div className="min-h-screen bg-culture-black pt-24 pb-16" data-testid="my-events-page">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-culture-white mb-2">
              Mis eventos
            </h1>
            <p className="text-culture-muted">Gestiona tus eventos publicados</p>
          </div>
          <Link to="/publicar">
            <Button className="btn-primary" data-testid="create-event-btn">
              <PlusCircle className="h-4 w-4 mr-2" />
              Crear evento
            </Button>
          </Link>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <div 
                key={event.id}
                className="flex flex-col md:flex-row gap-4 p-4 bg-culture-gray border border-white/5"
                data-testid={`event-item-${event.id}`}
              >
                {/* Image */}
                <div className="w-full md:w-48 h-32 flex-shrink-0">
                  <img
                    src={event.image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-display text-lg text-culture-white truncate">
                          {event.title}
                        </h3>
                        {event.featured && (
                          <Badge className="bg-culture-gold text-culture-black border-0 text-xs">
                            Destacado
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-culture-muted mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatShortDate(event.date)} · {event.time}
                        </span>
                        <span>{event.location}</span>
                        <span className={event.is_free ? 'text-green-400' : 'text-culture-gold'}>
                          {formatPrice(event.price)}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm text-culture-muted">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {event.views} visitas
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {event.saves} guardados
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link to={`/editar-evento/${event.id}`}>
                        <Button variant="outline" size="sm" className="btn-secondary" data-testid={`edit-${event.id}`}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="btn-secondary text-red-400 hover:bg-red-400/10" data-testid={`delete-${event.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-culture-gray border-white/10">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-culture-white">¿Eliminar evento?</AlertDialogTitle>
                            <AlertDialogDescription className="text-culture-muted">
                              Esta acción no se puede deshacer. El evento "{event.title}" será eliminado permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="btn-secondary">Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(event.id)}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-culture-gray">
            <Calendar className="h-16 w-16 text-culture-muted mx-auto mb-6" />
            <h3 className="font-display text-xl text-culture-white mb-2">
              No tienes eventos publicados
            </h3>
            <p className="text-culture-muted mb-6">
              Crea tu primer evento y empieza a conectar con la comunidad
            </p>
            <Link to="/publicar">
              <Button className="btn-primary">
                <PlusCircle className="h-4 w-4 mr-2" />
                Crear mi primer evento
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
