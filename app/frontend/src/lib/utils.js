import { clsx } from \"clsx"\;
import { twMerge } from \"tailwind-merge"\;

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function formatShortDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short'
  });
}

export function formatTime(timeString) {
  return timeString;
}

export function formatPrice(price) {
  if (price === 0) return 'Gratis';
  return `${price}€`;
}

export function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getInitials(name) {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export const categoryIcons = {
  'danza': 'Music',
  'teatro': 'Theater',
  'musica': 'Mic',
  'casting': 'Users',
  'talleres': 'BookOpen',
  'comunidad': 'Heart',
};

export const countries = [
  'España',
  'Argentina',
  'Perú',
  'Bolivia',
  'Ecuador',
  'Chile',
  'Uruguay',
  'Colombia',
  'Paraguay',
  'México',
  'Venezuela',
  'Otro'
];
