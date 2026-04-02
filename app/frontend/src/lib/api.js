/*import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Categories
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
};

// Events
export const eventsAPI = {
  getAll: (params) => api.get('/events', { params }),
  getFeatured: (limit = 6) => api.get('/events/featured', { params: { limit } }),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
};

// Organizers
export const organizersAPI = {
  getAll: (params) => api.get('/organizers', { params }),
  getById: (id) => api.get(`/organizers/${id}`),
};

// Favorites
export const favoritesAPI = {
  getAll: () => api.get('/favorites'),
  add: (eventId) => api.post(`/favorites/${eventId}`),
  remove: (eventId) => api.delete(`/favorites/${eventId}`),
  check: (eventId) => api.get(`/favorites/check/${eventId}`),
};

// Stats
export const statsAPI = {
  getOrganizerStats: () => api.get('/stats/organizer'),
};

// Plan
export const planAPI = {
  upgrade: () => api.post('/plan/upgrade'),
  cancel: () => api.post('/plan/cancel'),
};

// Contact
export const contactAPI = {
  send: (data) => api.post('/contact', data),
};

// Upload
export const uploadAPI = {
  image: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Districts
export const districtsAPI = {
  getAll: () => api.get('/districts'),
};

// Seed
export const seedAPI = {
  seed: () => api.post('/seed'),
};

export default api;*/

// API layer using Supabase directly
import { supabase } from './supabase';

// ================= AUTH =================
export const authAPI = {
  register: async (data) => {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          role: data.role || 'user',
          country: data.country || null,
        },
      },
    });
    if (error) throw error;
    
    // Create profile in profiles table
    if (authData.user) {
      await supabase.from('profiles').insert({
        id: authData.user.id,
        email: data.email,
        name: data.name,
        role: data.role || 'user',
        country: data.country || null,
        plan: 'free',
        created_at: new Date().toISOString(),
      });
    }
    
    return { data: authData };
  },
  
  login: async (data) => {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) throw error;
    return { data: authData };
  },
  
  getMe: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    
    // Get profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    return { data: { ...user, ...profile } };
  },
  
  updateProfile: async (data) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    return { data: profile };
  },
};

// ================= CATEGORIES =================
export const categoriesAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    if (error) throw error;
    return { data: data || [] };
  },
  
  getBySlug: async (slug) => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) throw error;
    return { data };
  },
};

// ================= EVENTS =================
export const eventsAPI = {
  getAll: async (params = {}) => {
    let query = supabase
      .from('events')
      .select(`
        *,
        categories(name),
        profiles!events_organizer_id_fkey(name, avatar_url)
      `)
      .order('date', { ascending: true });
    
    if (params.search) {
      query = query.ilike('title', `%${params.search}%`);
    }
    if (params.category) {
      query = query.eq('category_slug', params.category);
    }
    if (params.district) {
      query = query.eq('district', params.district);
    }
    if (params.is_free) {
      query = query.eq('is_free', true);
    }
    if (params.featured) {
      query = query.eq('featured', true);
    }
    if (params.limit) {
      query = query.limit(params.limit);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    // Transform data to include category_name and organizer info
    const events = (data || []).map(event => ({
      ...event,
      category_name: event.categories?.name,
      organizer_name: event.profiles?.name,
      organizer_avatar: event.profiles?.avatar_url,
    }));
    
    return { data: events };
  },
  
  getFeatured: async (limit = 6) => {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        categories(name),
        profiles!events_organizer_id_fkey(name, avatar_url)
      `)
      .eq('featured', true)
      .order('date', { ascending: true })
      .limit(limit);
    
    if (error) throw error;
    
    const events = (data || []).map(event => ({
      ...event,
      category_name: event.categories?.name,
      organizer_name: event.profiles?.name,
      organizer_avatar: event.profiles?.avatar_url,
    }));
    
    return { data: events };
  },
  
  getById: async (id) => {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        categories(name),
        profiles!events_organizer_id_fkey(id, name, avatar_url, bio, instagram, website)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Increment views
    await supabase
      .from('events')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', id);
    
    return {
      data: {
        ...data,
        category_name: data.categories?.name,
        organizer_name: data.profiles?.name,
        organizer_avatar: data.profiles?.avatar_url,
        organizer: data.profiles,
      },
    };
  },
  
  create: async (eventData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('events')
      .insert({
        ...eventData,
        organizer_id: user.id,
        views: 0,
        saves: 0,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return { data };
  },
  
  update: async (id, eventData) => {
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { data };
  },
  
  delete: async (id) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { data: { success: true } };
  },
};

// ================= ORGANIZERS =================
export const organizersAPI = {
  getAll: async (params = {}) => {
    let query = supabase
      .from('profiles')
      .select('*')
      .eq('role', 'organizer')
      .order('name');
    
    if (params.limit) {
      query = query.limit(params.limit);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    // Get events count for each organizer
    const organizers = await Promise.all(
      (data || []).map(async (org) => {
        const { count } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('organizer_id', org.id);
        return { ...org, events_count: count || 0 };
      })
    );
    
    return { data: organizers };
  },
  
  getById: async (id) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Get organizer's events
    const { data: events } = await supabase
      .from('events')
      .select('*')
      .eq('organizer_id', id)
      .order('date', { ascending: true });
    
    return { data: { ...profile, events: events || [] } };
  },
};

// ================= FAVORITES =================
export const favoritesAPI = {
  getAll: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        events(*)
      `)
      .eq('user_id', user.id);
    
    if (error) throw error;
    return { data: (data || []).map(f => f.events) };
  },
  
  add: async (eventId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        event_id: eventId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Increment saves count
    await supabase.rpc('increment_saves', { event_id: eventId });
    
    return { data };
  },
  
  remove: async (eventId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('event_id', eventId);
    
    if (error) throw error;
    return { data: { success: true } };
  },
  
  check: async (eventId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: { is_favorite: false } };
    
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('event_id', eventId)
      .single();
    
    return { data: { is_favorite: !!data } };
  },
};

// ================= STATS =================
export const statsAPI = {
  getOrganizerStats: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    // Get all events for this organizer
    const { data: events } = await supabase
      .from('events')
      .select('views, saves, created_at')
      .eq('organizer_id', user.id);
    
    const total_events = events?.length || 0;
    const total_views = events?.reduce((sum, e) => sum + (e.views || 0), 0) || 0;
    const total_saves = events?.reduce((sum, e) => sum + (e.saves || 0), 0) || 0;
    
    // Events this month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const events_this_month = events?.filter(e => e.created_at >= firstDayOfMonth).length || 0;
    
    return {
      data: {
        total_events,
        total_views,
        total_saves,
        events_this_month,
      },
    };
  },
};

// ================= PLAN =================
export const planAPI = {
  upgrade: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('profiles')
      .update({
        plan: 'pro',
        plan_started: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    return { data: { success: true, plan: 'pro' } };
  },
  
  cancel: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('profiles')
      .update({
        plan: 'free',
        plan_started: null,
      })
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    return { data: { success: true, plan: 'free' } };
  },
};

// ================= CONTACT =================
export const contactAPI = {
  send: async (data) => {
    const { error } = await supabase
      .from('contact_messages')
      .insert({
        ...data,
        created_at: new Date().toISOString(),
      });
    
    if (error) throw error;
    return { data: { success: true } };
  },
};

// ================= DISTRICTS =================
export const districtsAPI = {
  getAll: async () => {
    return {
      data: [
        { id: 'centro', name: 'Centro' },
        { id: 'latina', name: 'Latina' },
        { id: 'lavapies', name: 'Lavapiés' },
        { id: 'usera', name: 'Usera' },
        { id: 'chamberi', name: 'Chamberí' },
        { id: 'malasana', name: 'Malasaña' },
        { id: 'chueca', name: 'Chueca' },
        { id: 'salamanca', name: 'Salamanca' },
        { id: 'retiro', name: 'Retiro' },
        { id: 'tetuan', name: 'Tetuán' },
      ],
    };
  },
};

// ================= SEED (for demo data) =================
export const seedAPI = {
  seed: async () => {
    // Check if already seeded
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .limit(1);
    
    if (existing && existing.length > 0) {
      return { data: { message: 'Already seeded' } };
    }
    
    // Seed categories
    const categories = [
      { id: 'cat-1', name: 'Danza', slug: 'danza', icon: '💃', description: 'Baile y danza contemporánea' },
      { id: 'cat-2', name: 'Teatro', slug: 'teatro', icon: '🎭', description: 'Obras teatrales y performance' },
      { id: 'cat-3', name: 'Música', slug: 'musica', icon: '🎵', description: 'Conciertos y jam sessions' },
      { id: 'cat-4', name: 'Talleres', slug: 'talleres', icon: '🎨', description: 'Cursos y workshops' },
      { id: 'cat-5', name: 'Exposiciones', slug: 'exposiciones', icon: '🖼️', description: 'Arte visual y fotografía' },
      { id: 'cat-6', name: 'Cine', slug: 'cine', icon: '🎬', description: 'Proyecciones y cinefórums' },
    ];
    
    await supabase.from('categories').insert(categories);
    
    return { data: { message: 'Seeded successfully' } };
  },
};

// ================= UPLOAD =================
export const uploadAPI = {
  image: async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `events/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file);
    
    if (error) throw error;
    
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);
    
    return { data: { url: urlData.publicUrl } };
  },
};

export default {
  authAPI,
  categoriesAPI,
  eventsAPI,
  organizersAPI,
  favoritesAPI,
  statsAPI,
  planAPI,
  contactAPI,
  districtsAPI,
  seedAPI,
  uploadAPI,
};
