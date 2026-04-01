import { Link } from 'react-router-dom';
import { Music, Theater, Mic, Users, BookOpen, Heart } from 'lucide-react';

const iconMap = {
  'music': Music,
  'theater': Theater,
  'mic': Mic,
  'users': Users,
  'book-open': BookOpen,
  'heart': Heart,
};

export function CategoryChip({ category, active = false }) {
  const Icon = iconMap[category.icon] || Music;

  return (
    <Link
      to={`/eventos?category=${category.slug}`}
      className={`category-chip flex items-center gap-2 px-4 py-2 border whitespace-nowrap transition-all ${
        active
          ? 'border-culture-gold bg-culture-gold/10 text-culture-gold'
          : 'border-white/10 text-culture-white hover:border-culture-gold/50 hover:text-culture-gold'
      }`}
      data-testid={`category-chip-${category.slug}`}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{category.name}</span>
    </Link>
  );
}

export function CategoryCard({ category }) {
  const Icon = iconMap[category.icon] || Music;

  return (
    <Link
      to={`/eventos?category=${category.slug}`}
      className="group relative overflow-hidden p-8 bg-culture-gray border border-white/5 hover:border-culture-gold/30 transition-all duration-300"
      data-testid={`category-card-${category.slug}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-culture-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
      
      <div className="relative">
        <div className="w-12 h-12 flex items-center justify-center bg-culture-gold/10 rounded-sm mb-4 group-hover:bg-culture-gold/20 transition-colors">
          <Icon className="h-6 w-6 text-culture-gold" />
        </div>
        
        <h3 className="font-display text-xl font-semibold text-culture-white mb-2 group-hover:text-culture-gold transition-colors">
          {category.name}
        </h3>
        
        {category.description && (
          <p className="text-culture-muted text-sm line-clamp-2">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );
}
