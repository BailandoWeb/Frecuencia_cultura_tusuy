import { useState, useEffect } from 'react';
import { Search, Users } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { OrganizerCard } from '../components/OrganizerCard';
import { organizersAPI } from '../lib/api';
import { Skeleton } from '../components/ui/skeleton';
import { countries } from '../lib/utils';

export default function OrganizersPage() {
  const [organizers, setOrganizers] = useState([]);
  const [filteredOrganizers, setFilteredOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  useEffect(() => {
    const loadOrganizers = async () => {
      try {
        const response = await organizersAPI.getAll({ limit: 50 });
        setOrganizers(response.data);
        setFilteredOrganizers(response.data);
      } catch (error) {
        console.error('Error loading organizers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrganizers();
  }, []);

  useEffect(() => {
    let filtered = organizers;

    if (search) {
      filtered = filtered.filter(org =>
        org.name.toLowerCase().includes(search.toLowerCase()) ||
        org.bio?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCountry) {
      filtered = filtered.filter(org => org.country === selectedCountry);
    }

    setFilteredOrganizers(filtered);
  }, [search, selectedCountry, organizers]);

  return (
    <div className="min-h-screen bg-culture-black pt-24 pb-16" data-testid="organizers-page">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-culture-white mb-4">
            Organizadores
          </h1>
          <p className="text-culture-muted text-lg">
            Conoce a los creadores de cultura en nuestra comunidad
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-culture-muted" />
            <Input
              type="text"
              placeholder="Buscar organizadores..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-12"
              data-testid="organizers-search"
            />
          </div>
          <Select value={selectedCountry || "all"} onValueChange={(v) => setSelectedCountry(v === "all" ? "" : v)}>
            <SelectTrigger className="w-full sm:w-48 input-field" data-testid="country-filter">
              <SelectValue placeholder="País" />
            </SelectTrigger>
            <SelectContent className="bg-culture-gray border-white/10">
              <SelectItem value="all">Todos los países</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <p className="text-culture-muted text-sm mb-6">
          {filteredOrganizers.length} {filteredOrganizers.length === 1 ? 'organizador' : 'organizadores'}
        </p>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-culture-gray p-6">
                <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-32 mx-auto mb-2" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
            ))}
          </div>
        ) : filteredOrganizers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredOrganizers.map((organizer) => (
              <OrganizerCard key={organizer.id} organizer={organizer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Users className="h-16 w-16 text-culture-muted mx-auto mb-6" />
            <h3 className="font-display text-xl text-culture-white mb-2">
              No se encontraron organizadores
            </h3>
            <p className="text-culture-muted">
              Prueba a cambiar los filtros de búsqueda
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
