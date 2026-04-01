import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function LegalPage({ title, children }) {
  return (
    <div className="min-h-screen bg-culture-black pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-culture-muted hover:text-culture-gold transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>
        
        <h1 className="font-display text-3xl md:text-4xl font-bold text-culture-white mb-8">
          {title}
        </h1>
        
        <div className="prose prose-invert max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
}

export function AvisoLegalPage() {
  return (
    <LegalPage title="Aviso Legal">
      <p className="text-culture-muted">Última actualización: Enero 2026</p>
      
      <h2 className="text-culture-white">1. Datos identificativos</h2>
      <p className="text-culture-muted">
        En cumplimiento del deber de información recogido en artículo 10 de la Ley 34/2002, 
        de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico, 
        Frecuencia Cultura informa que es titular del sitio web frecuenciacultura.com.
      </p>

      <h2 className="text-culture-white">2. Objeto</h2>
      <p className="text-culture-muted">
        El presente aviso legal regula el uso del sitio web frecuenciacultura.com, 
        plataforma de difusión de eventos culturales.
      </p>

      <h2 className="text-culture-white">3. Condiciones de uso</h2>
      <p className="text-culture-muted">
        La utilización del sitio web atribuye la condición de usuario e implica la aceptación 
        plena de todas las cláusulas y condiciones de uso incluidas en este Aviso Legal.
      </p>

      <h2 className="text-culture-white">4. Propiedad intelectual</h2>
      <p className="text-culture-muted">
        Todos los contenidos del sitio web son propiedad de Frecuencia Cultura o de terceros 
        que han autorizado su uso. Los usuarios se comprometen a respetar los derechos de 
        propiedad intelectual e industrial.
      </p>

      <h2 className="text-culture-white">5. Responsabilidad</h2>
      <p className="text-culture-muted">
        Frecuencia Cultura no se hace responsable de la información publicada por los organizadores 
        en sus eventos. Los organizadores son los únicos responsables de la veracidad de los datos.
      </p>
    </LegalPage>
  );
}

export function PrivacidadPage() {
  return (
    <LegalPage title="Política de Privacidad">
      <p className="text-culture-muted">Última actualización: Enero 2026</p>

      <h2 className="text-culture-white">1. Responsable del tratamiento</h2>
      <p className="text-culture-muted">
        El responsable del tratamiento de los datos personales es Frecuencia Cultura.
      </p>

      <h2 className="text-culture-white">2. Datos que recogemos</h2>
      <p className="text-culture-muted">
        Recogemos los siguientes datos personales:
      </p>
      <ul className="text-culture-muted list-disc pl-6 space-y-2">
        <li>Nombre y apellidos</li>
        <li>Dirección de correo electrónico</li>
        <li>País de origen</li>
        <li>Información del perfil (bio, redes sociales)</li>
      </ul>

      <h2 className="text-culture-white">3. Finalidad del tratamiento</h2>
      <p className="text-culture-muted">
        Los datos personales se utilizan para:
      </p>
      <ul className="text-culture-muted list-disc pl-6 space-y-2">
        <li>Gestionar el registro y acceso a la plataforma</li>
        <li>Permitir la publicación y gestión de eventos</li>
        <li>Enviar comunicaciones relacionadas con el servicio</li>
        <li>Mejorar nuestros servicios</li>
      </ul>

      <h2 className="text-culture-white">4. Derechos del usuario</h2>
      <p className="text-culture-muted">
        Los usuarios pueden ejercer sus derechos de acceso, rectificación, supresión, 
        oposición, limitación y portabilidad contactando en hola@frecuenciacultura.com.
      </p>
    </LegalPage>
  );
}

export function CookiesPage() {
  return (
    <LegalPage title="Política de Cookies">
      <p className="text-culture-muted">Última actualización: Enero 2026</p>

      <h2 className="text-culture-white">¿Qué son las cookies?</h2>
      <p className="text-culture-muted">
        Las cookies son pequeños archivos de texto que se almacenan en su dispositivo 
        cuando visita un sitio web.
      </p>

      <h2 className="text-culture-white">Cookies que utilizamos</h2>
      
      <h3 className="text-culture-gold">Cookies técnicas (necesarias)</h3>
      <p className="text-culture-muted">
        Son necesarias para el funcionamiento del sitio web. Incluyen las cookies de sesión 
        que permiten mantener su sesión iniciada.
      </p>

      <h3 className="text-culture-gold">Cookies de preferencias</h3>
      <p className="text-culture-muted">
        Permiten recordar sus preferencias de usuario, como el idioma o la región.
      </p>

      <h2 className="text-culture-white">Gestión de cookies</h2>
      <p className="text-culture-muted">
        Puede configurar su navegador para bloquear o eliminar las cookies. Sin embargo, 
        algunas funcionalidades del sitio pueden no estar disponibles.
      </p>
    </LegalPage>
  );
}

export function TerminosPage() {
  return (
    <LegalPage title="Términos de Uso">
      <p className="text-culture-muted">Última actualización: Enero 2026</p>

      <h2 className="text-culture-white">1. Aceptación de los términos</h2>
      <p className="text-culture-muted">
        Al utilizar Frecuencia Cultura, aceptas estos términos de uso. Si no estás de acuerdo, 
        no utilices la plataforma.
      </p>

      <h2 className="text-culture-white">2. Descripción del servicio</h2>
      <p className="text-culture-muted">
        Frecuencia Cultura es una plataforma de difusión de eventos culturales que conecta 
        organizadores con público interesado en cultura.
      </p>

      <h2 className="text-culture-white">3. Registro y cuenta</h2>
      <p className="text-culture-muted">
        Para publicar eventos debes registrarte como organizador. Eres responsable de mantener 
        la confidencialidad de tu cuenta y contraseña.
      </p>

      <h2 className="text-culture-white">4. Contenido del usuario</h2>
      <p className="text-culture-muted">
        Los organizadores son responsables del contenido que publican. No está permitido 
        publicar contenido ilegal, ofensivo o que infrinja derechos de terceros.
      </p>

      <h2 className="text-culture-white">5. Planes y pagos</h2>
      <p className="text-culture-muted">
        Ofrecemos planes gratuitos y de pago. Los detalles de cada plan están disponibles 
        en la sección correspondiente. Los pagos se procesan de forma segura.
      </p>

      <h2 className="text-culture-white">6. Limitación de responsabilidad</h2>
      <p className="text-culture-muted">
        Frecuencia Cultura no se hace responsable de los eventos publicados por los organizadores 
        ni de cualquier conflicto que pueda surgir entre organizadores y asistentes.
      </p>
    </LegalPage>
  );
}
