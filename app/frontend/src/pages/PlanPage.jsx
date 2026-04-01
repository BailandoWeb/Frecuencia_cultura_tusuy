import { useState } from 'react';
import { Crown, Check, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../lib/auth';
import { planAPI } from '../lib/api';
import { toast } from 'sonner';

export default function PlanPage() {
  const { user, isPro, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const response = await planAPI.upgrade();
      updateUser({ ...user, plan: 'pro', plan_started: new Date().toISOString() });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al actualizar el plan');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      const response = await planAPI.cancel();
      updateUser({ ...user, plan: 'free', plan_started: null });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al cancelar el plan');
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      name: 'Gratuito',
      price: '0€',
      period: '/mes',
      features: [
        { text: '2 eventos por mes', included: true },
        { text: 'Perfil de organizador', included: true },
        { text: 'Evento destacado', included: false },
        { text: 'Estadísticas avanzadas', included: false },
        { text: 'Prioridad en buscador', included: false },
      ],
      current: !isPro,
    },
    {
      name: 'Pro',
      price: '9€',
      period: '/mes',
      features: [
        { text: 'Eventos ilimitados', included: true },
        { text: 'Perfil de organizador', included: true },
        { text: '1 evento destacado/mes', included: true },
        { text: 'Estadísticas avanzadas', included: true },
        { text: 'Prioridad en buscador', included: true },
      ],
      current: isPro,
      recommended: true,
    },
  ];

  return (
    <div className="min-h-screen bg-culture-black pt-24 pb-16" data-testid="plan-page">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-culture-gold/20 text-culture-gold border-0 mb-4">
            <Crown className="h-3 w-3 mr-1" />
            Planes
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-culture-white mb-4">
            Amplifica tu <span className="text-culture-gold">frecuencia</span>
          </h1>
          <p className="text-culture-muted text-lg max-w-xl mx-auto">
            Elige el plan que mejor se adapte a tus necesidades y empieza a conectar con más público.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 border transition-all ${
                plan.recommended
                  ? 'bg-culture-gray border-culture-gold'
                  : 'bg-culture-gray border-white/10'
              }`}
            >
              {plan.recommended && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-culture-gold text-culture-black border-0">
                  Recomendado
                </Badge>
              )}

              <div className="text-center mb-6">
                <h3 className="font-display text-2xl text-culture-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="font-display text-5xl font-bold text-culture-white">{plan.price}</span>
                  <span className="text-culture-muted ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-culture-muted flex-shrink-0" />
                    )}
                    <span className={feature.included ? 'text-culture-white' : 'text-culture-muted'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.current ? (
                <Button 
                  variant="outline" 
                  className="w-full btn-secondary" 
                  disabled
                  data-testid={`current-plan-${plan.name.toLowerCase()}`}
                >
                  Plan actual
                </Button>
              ) : plan.name === 'Pro' ? (
                <Button 
                  className="w-full btn-primary"
                  onClick={handleUpgrade}
                  disabled={loading}
                  data-testid="upgrade-btn"
                >
                  {loading ? 'Procesando...' : 'Activar Plan Pro'}
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full btn-secondary"
                  onClick={handleCancel}
                  disabled={loading}
                  data-testid="downgrade-btn"
                >
                  Volver al plan gratuito
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="text-center text-culture-muted text-sm">
          <p>Sin permanencia. Puedes cambiar o cancelar en cualquier momento.</p>
          <p className="mt-2">
            <span className="text-culture-gold">*</span> El pago será procesado con Stripe en la versión final.
          </p>
        </div>

        {/* Success message for Pro users */}
        {isPro && (
          <div className="mt-12 p-8 bg-culture-gold/10 border border-culture-gold/30 text-center">
            <Crown className="h-12 w-12 text-culture-gold mx-auto mb-4" />
            <h3 className="font-display text-2xl text-culture-white mb-2">
              Tu frecuencia tiene mayor alcance
            </h3>
            <p className="text-culture-muted">
              Estás disfrutando de todas las ventajas del Plan Pro. ¡Gracias por confiar en nosotros!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
