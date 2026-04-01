import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { getInitials } from '../lib/utils';

export function OrganizerCard({ organizer }) {
  return (
    <Link 
      to={`/organizador/${organizer.id}`}
      className="group flex flex-col items-center p-6 bg-culture-gray border border-white/5 hover:border-culture-gold/30 transition-all duration-300"
      data-testid={`organizer-card-${organizer.id}`}
    >
      <div className="relative mb-4">
        <Avatar className="w-24 h-24 border-2 border-transparent group-hover:border-culture-gold transition-colors">
          <AvatarImage src={organizer.avatar_url} alt={organizer.name} />
          <AvatarFallback className="bg-culture-gold/20 text-culture-gold text-xl font-display">
            {getInitials(organizer.name)}
          </AvatarFallback>
        </Avatar>
        {organizer.plan === 'pro' && (
          <Badge className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-culture-gold text-culture-black text-xs border-0">
            PRO
          </Badge>
        )}
      </div>

      <h3 className="font-display text-lg font-semibold text-culture-white text-center group-hover:text-culture-gold transition-colors">
        {organizer.name}
      </h3>
      
      {organizer.country && (
        <p className="text-culture-muted text-sm mt-1">{organizer.country}</p>
      )}
      
      <p className="text-culture-gold text-sm mt-2">
        {organizer.events_count} {organizer.events_count === 1 ? 'evento' : 'eventos'}
      </p>
    </Link>
  );
}
