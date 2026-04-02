import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ArrowRight, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { WaveBackground } from '../components/WaveBackground';
import { EventCard } from '../components/EventCard';
import { OrganizerCard } from '../components/OrganizerCard';
import { CategoryChip, CategoryCard } from '../components/CategoryChip';
import { eventsAPI, categoriesAPI, organizersAPI, seedAPI } from '../lib/api';
import { Skeleton } from '../components/ui/skeleton';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Seed data on first load
        try {
          await seedAPI.seed();
        } catch (e) {
          // Already seeded
        }

        const [featuredRes, upcomingRes, categoriesRes, organizersRes] = await Promise.all([
          eventsAPI.getFeatured(4),
          eventsAPI.getAll({ limit: 6 }),
          categoriesAPI.getAll(),
          organizersAPI.getAll({ limit: 4 }),
        ]);

        setFeaturedEvents(featuredRes.data);
        setUpcomingEvents(upcomingRes.data);
        setCategories(categoriesRes.data);
        setOrganizers(organizersRes.data);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/eventos?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-culture-black" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <WaveBackground className="opacity-30" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-culture-white mb-6 animate-slide-up">
            Sintoniza la <span className="text-culture-gold">cultura</span>
          </h1>
          
          <p className="text-culture-muted text-lg md:text-xl mb-10 max-w-2xl mx-auto animate-slide-up animation-delay-200">
            Descubre eventos culturales independientes. Danza, teatro, música, talleres y más en Madrid.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="animate-slide-up animation-delay-400">
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-culture-muted" />
                <Input
                  type="text"
                  placeholder="¿Qué quieres descubrir hoy?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-12 h-14 text-base"
                  data-testid="home-search-input"
                />
              </div>
              <Button type="submit" className="btn-primary h-14 px-8" data-testid="home-search-btn">
                Explorar
              </Button>
            </div>
          </form>

          {/* Quick stats */}
          <div className="flex justify-center gap-8 md:gap-16 mt-16 animate-slide-up animation-delay-600">
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-culture-gold">{featuredEvents.length + upcomingEvents.length}+</p>
              <p className="text-culture-muted text-sm">Eventos activos</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-culture-gold">{organizers.length}+</p>
              <p className="text-culture-muted text-sm">Organizadores</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-culture-gold">{categories.length}</p>
              <p className="text-culture-muted text-sm">Categorías</p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-culture-gold/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-culture-gold rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 md:py-28 px-4" data-testid="featured-events-section">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-culture-gold text-sm font-medium uppercase tracking-wider mb-2">Destacados</p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-culture-white">
                Eventos destacados
              </h2>
            </div>
            <Link to="/eventos?featured=true" className="hidden md:flex items-center gap-2 text-culture-gold hover:text-culture-gold-light transition-colors">
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-culture-gray">
                  <Skeleton className="aspect-[4/3]" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          <Link to="/eventos?featured=true" className="md:hidden flex items-center justify-center gap-2 text-culture-gold mt-8">
            Ver todos los destacados <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Categories - Horizontal scroll on mobile */}
      <section className="py-16 md:py-24 bg-culture-gray/30" data-testid="categories-section">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-culture-gold text-sm font-medium uppercase tracking-wider mb-2">Explora</p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-culture-white">
                Categorías
              </h2>
            </div>
            <Link to="/categorias" className="hidden md:flex items-center gap-2 text-culture-gold hover:text-culture-gold-light transition-colors">
              Ver todas <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile: Horizontal scroll */}
          <div className="md:hidden flex gap-3 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4">
            {categories.map((category) => (
              <CategoryChip key={category.id} category={category} />
            ))}
          </div>

          {/* Desktop: Grid */}
          <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 md:py-28 px-4" data-testid="upcoming-events-section">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-culture-gold text-sm font-medium uppercase tracking-wider mb-2">Próximamente</p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-culture-white">
                Próximos eventos
              </h2>
            </div>
            <Link to="/eventos" className="hidden md:flex items-center gap-2 text-culture-gold hover:text-culture-gold-light transition-colors">
              Ver agenda completa <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-culture-gray">
                  <Skeleton className="aspect-[4/3]" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          <Link to="/eventos" className="md:hidden flex items-center justify-center gap-2 text-culture-gold mt-8">
            Ver agenda completa <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Organizers */}
      <section className="py-16 md:py-24 bg-culture-gray/30" data-testid="organizers-section">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-culture-gold text-sm font-medium uppercase tracking-wider mb-2">Comunidad</p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-culture-white">
                Organizadores destacados
              </h2>
            </div>
            <Link to="/organizadores" className="hidden md:flex items-center gap-2 text-culture-gold hover:text-culture-gold-light transition-colors">
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {organizers.map((organizer) => (
              <OrganizerCard key={organizer.id} organizer={organizer} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Publish Event */}
      <section className="py-24 md:py-32 px-4" data-testid="cta-section">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-culture-white mb-6">
            ¿Organizas <span className="text-culture-gold">cultura</span>?
          </h2>
          <p className="text-culture-muted text-lg mb-10 max-w-xl mx-auto">
            Amplifica tu frecuencia. Publica tus eventos y conecta con una comunidad cultural activa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/registro?role=organizer">
              <Button className="btn-primary text-base px-10 py-6" data-testid="cta-register-btn">
                Publicar evento
              </Button>
            </Link>
            <Link to="/sobre-nosotros">
              <Button variant="outline" className="btn-secondary text-base px-10 py-6" data-testid="cta-about-btn">
                Saber más
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


