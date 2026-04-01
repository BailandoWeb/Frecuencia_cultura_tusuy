import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Users, Globe, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-culture-black pt-24 pb-16" data-testid="about-page">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-4xl md:text-6xl font-bold text-culture-white mb-6">
          Sobre <span className="text-culture-gold">Frecuencia Cultura</span>
        </h1>
        <p className="text-culture-muted text-xl leading-relaxed max-w-2xl mx-auto">
          La cultura no es un evento. Es una señal constante. Una vibración que conecta raíces, 
          territorios y personas.
        </p>
      </section>

      {/* Manifesto */}
      <section className="bg-culture-gray/30 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-3xl font-semibold text-culture-gold mb-8 text-center">
            Manifiesto
          </h2>
          <div className="prose prose-lg prose-invert max-w-none text-center">
            <p className="text-culture-white text-xl leading-relaxed italic">
              "Frecuencia Cultura nace para amplificar lo que se mueve.<br />
              Para dar espacio a lo independiente.<br />
              Para conectar escenas, ritmos y comunidades.<br /><br />
              No somos una cartelera.<br />
              Somos una red.<br /><br />
              No transmitimos tendencias.<br />
              Transmitimos identidad.<br /><br />
              Aquí la cultura no se consume.<br />
              Se vive. Se comparte. Se expande.<br /><br />
              Sintoniza.<br />
              La frecuencia ya está activa."
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="font-display text-3xl font-semibold text-culture-white mb-12 text-center">
          Nuestros valores
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-8 bg-culture-gray border border-white/5">
            <div className="w-12 h-12 flex items-center justify-center bg-culture-gold/10 rounded-sm mb-4">
              <Heart className="h-6 w-6 text-culture-gold" />
            </div>
            <h3 className="font-display text-xl text-culture-white mb-2">Comunidad</h3>
            <p className="text-culture-muted">
              Creemos en el poder de las conexiones humanas a través del arte y la cultura.
            </p>
          </div>

          <div className="p-8 bg-culture-gray border border-white/5">
            <div className="w-12 h-12 flex items-center justify-center bg-culture-gold/10 rounded-sm mb-4">
              <Users className="h-6 w-6 text-culture-gold" />
            </div>
            <h3 className="font-display text-xl text-culture-white mb-2">Diversidad</h3>
            <p className="text-culture-muted">
              Celebramos todas las expresiones culturales, desde las raíces hasta lo contemporáneo.
            </p>
          </div>

          <div className="p-8 bg-culture-gray border border-white/5">
            <div className="w-12 h-12 flex items-center justify-center bg-culture-gold/10 rounded-sm mb-4">
              <Globe className="h-6 w-6 text-culture-gold" />
            </div>
            <h3 className="font-display text-xl text-culture-white mb-2">Accesibilidad</h3>
            <p className="text-culture-muted">
              La cultura debe ser accesible para todos. Promovemos eventos para todos los públicos.
            </p>
          </div>

          <div className="p-8 bg-culture-gray border border-white/5">
            <div className="w-12 h-12 flex items-center justify-center bg-culture-gold/10 rounded-sm mb-4">
              <Zap className="h-6 w-6 text-culture-gold" />
            </div>
            <h3 className="font-display text-xl text-culture-white mb-2">Independencia</h3>
            <p className="text-culture-muted">
              Apoyamos a artistas y organizadores independientes que hacen cultura desde el corazón.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-culture-gray/30 py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-display text-3xl font-semibold text-culture-white mb-8 text-center">
            Nuestra historia
          </h2>
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-culture-muted leading-relaxed mb-6">
              Frecuencia Cultura nació de una necesidad real: conectar a la comunidad cultural latina 
              en Madrid con los eventos que reflejan sus raíces y pasiones.
            </p>
            <p className="text-culture-muted leading-relaxed mb-6">
              Como profesores de danzas sudamericanas, vimos de primera mano cómo muchos eventos 
              increíbles pasaban desapercibidos por falta de una plataforma que los reuniera. 
              Agrupaciones de danza, compañías de teatro independiente, músicos emergentes... 
              todos creando cultura, pero sin un espacio común donde encontrarse con su público.
            </p>
            <p className="text-culture-muted leading-relaxed">
              Así nació esta frecuencia. Un lugar donde la cultura latina y las expresiones 
              artísticas independientes tienen un hogar. Donde organizadores pueden amplificar 
              su mensaje y donde el público puede descubrir experiencias auténticas.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-3xl font-semibold text-culture-white mb-6">
          ¿Listo para sintonizar?
        </h2>
        <p className="text-culture-muted text-lg mb-8">
          Únete a nuestra comunidad y descubre la cultura que se mueve a tu alrededor.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/eventos">
            <Button className="btn-primary">
              Explorar eventos <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link to="/registro?role=organizer">
            <Button variant="outline" className="btn-secondary">
              Publicar evento
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
