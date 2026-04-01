import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, X, Calendar, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../components/ui/sheet';
import { Checkbox } from '../components/ui/checkbox';
import { EventCard } from '../components/EventCard';
import { CategoryChip } from '../components/CategoryChip';
import { supabase } from '../lib/supabase';
import { Skeleton } from '../components/ui/skeleton';

export default function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get('district') || '');
  const [isFreeOnly, setIsFreeOnly] = useState(searchParams.get('free') === 'true');
  const [featuredOnly, setFeaturedOnly] = useState(searchParams.get('featured') === 'true');

  useEffect(() => {
    const loadInitialData = async () => {
      const loadInitialData = async () => {
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*');

  setCategories(categoriesData || []);

  // Distritos los dejamos hardcodeados (como en tu backend)
  setDistricts([
    { id: "centro", name: "Centro" },
    { id: "latina", name: "Latina" },
    { id: "lavapies", name: "Lavapiés" },
    { id: "usera", name: "Usera" },
    { id: "chamberi", name: "Chamberí" },
    { id: "malasana", name: "Malasaña" },
  ]);
};
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (selectedCategory) params.category = selectedCategory;
        if (selectedDistrict) params.district = selectedDistrict;
        if (isFreeOnly) params.is_free = true;
        if (featuredOnly) params.featured = true;

        const response = await eventsAPI.getAll(params);
        setEvents(response.data);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [search, selectedCategory, selectedDistrict, isFreeOnly, featuredOnly]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedDistrict('');
    setIsFreeOnly(false);
    setFeaturedOnly(false);
    setSearchParams({});
  };

  const activeFiltersCount = [
    selectedCategory,
    selectedDistrict,
    isFreeOnly,
    featuredOnly,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-culture-black pt-24 pb-16" data-testid="events-page">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-culture-white mb-4">
            Eventos
          </h1>
          <p className="text-culture-muted text-lg">
            Descubre la agenda cultural de Madrid
          </p>
        </div>

        {/* Search & Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-culture-muted" />
              <Input
                type="text"
                placeholder="Buscar eventos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-12"
                data-testid="events-search-input"
              />
            </div>
            <Button type="submit" className="btn-primary" data-testid="events-search-btn">
              Buscar
            </Button>
          </form>

          {/* Desktop Filters */}
          <div className="hidden md:flex gap-3">
            <Select value={selectedCategory || "all"} onValueChange={(v) => setSelectedCategory(v === "all" ? "" : v)}>
              <SelectTrigger className="w-44 input-field" data-testid="category-filter">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent className="bg-culture-gray border-white/10">
                <SelectItem value="all">Todas</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDistrict || "all"} onValueChange={(v) => setSelectedDistrict(v === "all" ? "" : v)}>
              <SelectTrigger className="w-44 input-field" data-testid="district-filter">
                <SelectValue placeholder="Distrito" />
              </SelectTrigger>
              <SelectContent className="bg-culture-gray border-white/10">
                <SelectItem value="all">Todos</SelectItem>
                {districts.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={isFreeOnly ? 'default' : 'outline'}
              className={isFreeOnly ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setIsFreeOnly(!isFreeOnly)}
              data-testid="free-filter-btn"
            >
              Gratis
            </Button>
          </div>

          {/* Mobile Filter Button */}
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" className="btn-secondary relative" data-testid="mobile-filter-btn">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-culture-gold text-culture-black h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-culture-black border-white/10 rounded-t-2xl h-[70vh]">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-culture-white font-display">Filtros</SheetTitle>
              </SheetHeader>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-culture-muted mb-2 block">Categoría</label>
                  <Select value={selectedCategory || "all"} onValueChange={(v) => setSelectedCategory(v === "all" ? "" : v)}>
                    <SelectTrigger className="w-full input-field">
                      <SelectValue placeholder="Todas las categorías" />
                    </SelectTrigger>
                    <SelectContent className="bg-culture-gray border-white/10">
                      <SelectItem value="all">Todas</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-culture-muted mb-2 block">Distrito</label>
                  <Select value={selectedDistrict || "all"} onValueChange={(v) => setSelectedDistrict(v === "all" ? "" : v)}>
                    <SelectTrigger className="w-full input-field">
                      <SelectValue placeholder="Todos los distritos" />
                    </SelectTrigger>
                    <SelectContent className="bg-culture-gray border-white/10">
                      <SelectItem value="all">Todos</SelectItem>
                      {districts.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="free-mobile"
                    checked={isFreeOnly}
                    onCheckedChange={setIsFreeOnly}
                    className="border-culture-gold data-[state=checked]:bg-culture-gold"
                  />
                  <label htmlFor="free-mobile" className="text-culture-white">
                    Solo eventos gratuitos
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="featured-mobile"
                    checked={featuredOnly}
                    onCheckedChange={setFeaturedOnly}
                    className="border-culture-gold data-[state=checked]:bg-culture-gold"
                  />
                  <label htmlFor="featured-mobile" className="text-culture-white">
                    Solo destacados
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 btn-secondary"
                    onClick={clearFilters}
                  >
                    Limpiar
                  </Button>
                  <Button
                    className="flex-1 btn-primary"
                    onClick={() => setFilterOpen(false)}
                  >
                    Aplicar
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCategory && (
              <Badge className="bg-culture-gold/20 text-culture-gold border-0 px-3 py-1">
                {categories.find(c => c.slug === selectedCategory)?.name}
                <button onClick={() => setSelectedCategory('')} className="ml-2">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedDistrict && (
              <Badge className="bg-culture-gold/20 text-culture-gold border-0 px-3 py-1">
                {districts.find(d => d.id === selectedDistrict)?.name}
                <button onClick={() => setSelectedDistrict('')} className="ml-2">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {isFreeOnly && (
              <Badge className="bg-green-500/20 text-green-400 border-0 px-3 py-1">
                Gratis
                <button onClick={() => setIsFreeOnly(false)} className="ml-2">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {featuredOnly && (
              <Badge className="bg-culture-gold/20 text-culture-gold border-0 px-3 py-1">
                Destacados
                <button onClick={() => setFeaturedOnly(false)} className="ml-2">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <button
              onClick={clearFilters}
              className="text-culture-muted text-sm hover:text-culture-gold transition-colors"
            >
              Limpiar todos
            </button>
          </div>
        )}

        {/* Categories horizontal scroll */}
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-4 mb-8 -mx-4 px-4">
          <button
            onClick={() => setSelectedCategory('')}
            className={`category-chip flex items-center gap-2 px-4 py-2 border whitespace-nowrap transition-all ${
              !selectedCategory
                ? 'border-culture-gold bg-culture-gold/10 text-culture-gold'
                : 'border-white/10 text-culture-white hover:border-culture-gold/50'
            }`}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.slug)}
              className={`category-chip flex items-center gap-2 px-4 py-2 border whitespace-nowrap transition-all ${
                selectedCategory === category.slug
                  ? 'border-culture-gold bg-culture-gold/10 text-culture-gold'
                  : 'border-white/10 text-culture-white hover:border-culture-gold/50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-culture-muted text-sm mb-6">
          {events.length} {events.length === 1 ? 'evento encontrado' : 'eventos encontrados'}
        </p>

        {/* Events Grid */}
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
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-6 bg-culture-gray rounded-full flex items-center justify-center">
              <Calendar className="h-8 w-8 text-culture-muted" />
            </div>
            <h3 className="font-display text-xl text-culture-white mb-2">
              No se encontraron eventos
            </h3>
            <p className="text-culture-muted mb-6">
              Prueba a cambiar los filtros o buscar algo diferente
            </p>
            <Button onClick={clearFilters} className="btn-secondary">
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
