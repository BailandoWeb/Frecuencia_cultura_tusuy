import { Link } from 'react-router-dom';
import { Instagram, Mail, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-culture-black border-t border-white/5 mt-auto" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="font-display text-2xl font-semibold tracking-tight">
                <span className="text-culture-white">Frecuencia</span>
                <span className="text-culture-gold ml-2">Cultura</span>
              </span>
            </Link>
            <p className="text-culture-muted text-sm leading-relaxed max-w-md mb-6">
              La cultura como señal que conecta personas. Sintoniza la cultura independiente de Madrid y más allá.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/frecuenciacultura"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-culture-gray rounded-full hover:bg-culture-gold/20 transition-colors"
                data-testid="footer-instagram"
              >
                <Instagram className="h-5 w-5 text-culture-white" />
              </a>
              <a
                href="mailto:hola@frecuenciacultura.com"
                className="w-10 h-10 flex items-center justify-center bg-culture-gray rounded-full hover:bg-culture-gold/20 transition-colors"
                data-testid="footer-email"
              >
                <Mail className="h-5 w-5 text-culture-white" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-sm font-semibold text-culture-white mb-4 uppercase tracking-wider">
              Navegación
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/eventos" className="text-culture-muted text-sm hover:text-culture-gold transition-colors" data-testid="footer-eventos">
                  Eventos
                </Link>
              </li>
              <li>
                <Link to="/organizadores" className="text-culture-muted text-sm hover:text-culture-gold transition-colors" data-testid="footer-organizadores">
                  Organizadores
                </Link>
              </li>
              <li>
                <Link to="/categorias" className="text-culture-muted text-sm hover:text-culture-gold transition-colors" data-testid="footer-categorias">
                  Categorías
                </Link>
              </li>
              <li>
                <Link to="/sobre-nosotros" className="text-culture-muted text-sm hover:text-culture-gold transition-colors" data-testid="footer-about">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-culture-muted text-sm hover:text-culture-gold transition-colors" data-testid="footer-contact">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display text-sm font-semibold text-culture-white mb-4 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/aviso-legal" className="text-culture-muted text-sm hover:text-culture-gold transition-colors" data-testid="footer-legal">
                  Aviso legal
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="text-culture-muted text-sm hover:text-culture-gold transition-colors" data-testid="footer-privacy">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-culture-muted text-sm hover:text-culture-gold transition-colors" data-testid="footer-cookies">
                  Política de cookies
                </Link>
              </li>
              <li>
                <Link to="/terminos" className="text-culture-muted text-sm hover:text-culture-gold transition-colors" data-testid="footer-terms">
                  Términos de uso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Manifiesto */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="max-w-2xl">
            <h4 className="font-display text-sm font-semibold text-culture-gold mb-3 uppercase tracking-wider">
              Manifiesto
            </h4>
            <p className="text-culture-muted text-sm leading-relaxed italic">
              "La cultura no es un evento. Es una señal constante. Una vibración que conecta raíces, 
              territorios y personas. Frecuencia Cultura nace para amplificar lo que se mueve."
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-culture-muted text-sm">
            © {new Date().getFullYear()} Frecuencia Cultura. Todos los derechos reservados.
          </p>
          <p className="text-culture-muted text-xs flex items-center gap-1">
            Hecho con amor desde Madrid
            <span className="text-red-500">❤</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
