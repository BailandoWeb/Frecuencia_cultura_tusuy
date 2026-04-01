import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, LogOut, LayoutDashboard, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAuth } from '../lib/auth';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isOrganizer, logout } = useAuth();

  const navLinks = [
    { href: '/eventos', label: 'Eventos' },
    { href: '/organizadores', label: 'Organizadores' },
    { href: '/categorias', label: 'Categorías' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav h-20" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" data-testid="navbar-logo">
          <span className="font-display text-xl md:text-2xl font-semibold tracking-tight">
            <span className="text-culture-white">Frecuencia</span>
            <span className="text-culture-gold ml-2">Cultura</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`font-body text-sm font-medium transition-colors hover:text-culture-gold ${
                isActive(link.href) ? 'text-culture-gold' : 'text-culture-white/80'
              }`}
              data-testid={`nav-link-${link.href.slice(1)}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/eventos">
            <Button variant="ghost" size="icon" className="text-culture-white/80 hover:text-culture-gold" data-testid="nav-search-btn">
              <Search className="h-5 w-5" />
            </Button>
          </Link>

          {isAuthenticated ? (
            <>
              {isOrganizer && (
                <Link to="/publicar">
                  <Button className="btn-primary text-sm" data-testid="nav-publish-btn">
                    Publicar evento
                  </Button>
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-culture-white/80 hover:text-culture-gold" data-testid="nav-user-menu">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-culture-gray border-white/10">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-culture-white">{user?.name}</p>
                    <p className="text-xs text-culture-muted">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer" data-testid="nav-dashboard-link">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/guardados" className="cursor-pointer" data-testid="nav-favorites-link">
                      <Heart className="mr-2 h-4 w-4" />
                      Guardados
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-400" data-testid="nav-logout-btn">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/login">
              <Button className="btn-primary text-sm" data-testid="nav-login-btn">
                Iniciar sesión
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-culture-white" data-testid="mobile-menu-btn">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-culture-black border-white/10 p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <span className="font-display text-xl font-semibold">
                  <span className="text-culture-white">Frecuencia</span>
                  <span className="text-culture-gold ml-2">Cultura</span>
                </span>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} data-testid="mobile-menu-close">
                  <X className="h-5 w-5 text-culture-white" />
                </Button>
              </div>
              
              <nav className="flex flex-col p-6 gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`py-3 px-4 text-lg font-medium transition-colors rounded-sm ${
                      isActive(link.href)
                        ? 'text-culture-gold bg-culture-gold/10'
                        : 'text-culture-white hover:bg-white/5'
                    }`}
                    data-testid={`mobile-nav-${link.href.slice(1)}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto p-6 border-t border-white/10 space-y-3">
                {isAuthenticated ? (
                  <>
                    <div className="mb-4">
                      <p className="text-culture-white font-medium">{user?.name}</p>
                      <p className="text-culture-muted text-sm">{user?.email}</p>
                    </div>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full btn-secondary" data-testid="mobile-dashboard-btn">
                        Dashboard
                      </Button>
                    </Link>
                    {isOrganizer && (
                      <Link to="/publicar" onClick={() => setIsOpen(false)}>
                        <Button className="w-full btn-primary" data-testid="mobile-publish-btn">
                          Publicar evento
                        </Button>
                      </Link>
                    )}
                    <Button 
                      variant="ghost" 
                      className="w-full text-red-400 hover:bg-red-400/10"
                      onClick={() => { handleLogout(); setIsOpen(false); }}
                      data-testid="mobile-logout-btn"
                    >
                      Cerrar sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button className="w-full btn-primary" data-testid="mobile-login-btn">
                        Iniciar sesión
                      </Button>
                    </Link>
                    <Link to="/registro" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full btn-secondary" data-testid="mobile-register-btn">
                        Registrarse
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
