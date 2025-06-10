import React from 'react';
    import Link from 'next/link'; // Usar Link de Next.js
    import dynamic from 'next/dynamic';

    const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false });
    import { Button } from '../components/ui/button';
    import { ArrowRight, Bot, Edit3, FileText, Sparkles, Star, Zap, Mic, DollarSign, Gift } from 'lucide-react';

    const FeatureCard = ({ icon, title, description, delay }) => {
      const IconComponent = icon;
      return (
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay }}
          className="bg-white dark:bg-slate-800/70 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 hover:shadow-xl transition-shadow duration-300 flex flex-col"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-teal-500 text-white rounded-full mb-4 self-start">
            <IconComponent className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-gray-100">{title}</h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm flex-grow">{description}</p>
        </MotionDiv>
      );
    };

    const TestimonialCard = ({ quote, author, role, delay }) => (
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay }}
          className="bg-slate-100/50 dark:bg-slate-800/50 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/40 glassmorphism"
        >
          <div className="flex mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <p className="text-slate-700 dark:text-slate-200 italic mb-4">"{quote}"</p>
          <div>
            <p className="font-semibold text-slate-800 dark:text-gray-100">{author}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{role}</p>
          </div>
        </MotionDiv>
      );

    const LandingPage = () => {
      return (
        <div className="w-full">
          <MotionDiv
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16 sm:py-24 px-4 relative overflow-hidden"
          >
            <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-slate-900 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#27374D_1px,transparent_1px),linear-gradient(to_bottom,#27374D_1px,transparent_1px)] bg-[size:6rem_4rem]">
              <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C3E0E5,transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,#1A3B5A,transparent)]"></div>
            </div>

            <MotionDiv
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 120 }}
              className="inline-block p-3 bg-gradient-to-r from-primary/20 to-teal-500/20 dark:from-primary/30 dark:to-teal-500/30 rounded-full mb-6"
            >
              <Zap className="h-12 w-12 text-primary dark:text-teal-300" />
            </MotionDiv>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
              Tu <span className="gradient-text">CV Profesional</span> en Menos de 5 Minutos
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10">
              Crea un currículum impactante rápidamente. Elige el <strong className="text-primary dark:text-teal-400">Modo Formulario</strong> (¡incluso con tu voz!) o charla con nuestra <strong className="text-primary dark:text-teal-400">IA en el Modo Conversacional</strong>.
            </p>
            <MotionDiv
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-teal-500 hover:from-primary/90 hover:to-teal-500/90 text-white rounded-lg shadow-lg hover:shadow-primary/40 transition-all duration-300">
                <Link href="/crear-cv">
                  Comenzar Ahora <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </MotionDiv>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">¡Descarga gratis o apoya con $1 USD!</p>
          </MotionDiv>
          {/* Resto de las secciones de la LandingPage */}
          <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900/50 rounded-t-3xl">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-slate-800 dark:text-gray-100">Múltiples Formas de Crear, Múltiples Formas de Apoyar</h2>
              <p className="text-center text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto">
                Diseñado para tu comodidad y flexibilidad. Elige el método de creación que más te guste y cómo quieres obtener tu CV.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <FeatureCard
                  icon={Edit3}
                  title="Modo Formulario Clásico"
                  description="Completa tu CV con una estructura tradicional y campos detallados. Ideal si prefieres un enfoque directo."
                  delay={0.1}
                />
                <FeatureCard
                  icon={Mic}
                  title="Llenado por Voz"
                  description="En el Modo Formulario, dicta tus datos usando el micrófono. ¡Más rápido y accesible!"
                  delay={0.2}
                />
                <FeatureCard
                  icon={Bot}
                  title="Modo Conversacional IA"
                  description="Nuestra IA te hace preguntas para armar tu CV interactivamente. Una experiencia amena y guiada."
                  delay={0.3}
                />
                <FeatureCard
                  icon={Sparkles}
                  title="Diseños Impactantes"
                  description="Tu CV lucirá profesional y moderno, listo para impresionar a cualquier reclutador."
                  delay={0.4}
                />
              </div>
            </div>
          </section>
          
          <section className="py-16 sm:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-800 dark:text-gray-100">Opciones de Descarga Flexibles</h2>
               <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                <FeatureCard
                  icon={DollarSign}
                  title="Apoyo Voluntario ($1 USD)"
                  description="Si la herramienta te es útil, considera un pago único de $1 USD al descargar. ¡Nos ayudas a seguir mejorando!"
                  delay={0.1}
                />
                <FeatureCard
                  icon={Gift}
                  title="Descarga Gratuita"
                  description="También puedes descargar tu CV profesional completamente gratis mirando un breve anuncio publicitario."
                  delay={0.2}
                />
              </div>
            </div>
          </section>

          <section className="py-16 sm:py-20 bg-slate-100/30 dark:bg-slate-800/30">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-800 dark:text-gray-100">Lo que dicen nuestros usuarios</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <TestimonialCard
                  quote="¡Increíblemente fácil de usar! Creé mi CV en 15 minutos y luce muy profesional."
                  author="Ana Pérez"
                  role="Diseñadora Gráfica"
                  delay={0.1}
                />
                <TestimonialCard
                  quote="El modo conversacional es una maravilla. Me ayudó a recordar detalles importantes de mi experiencia."
                  author="Carlos Gómez"
                  role="Desarrollador de Software"
                  delay={0.2}
                />
                <TestimonialCard
                  quote="Conseguí varias entrevistas gracias al CV que hice aquí. ¡Totalmente recomendado!"
                  author="Laura Fernández"
                  role="Especialista en Marketing"
                  delay={0.3}
                />
              </div>
            </div>
          </section>


          <section className="py-16 sm:py-24 bg-gradient-to-br from-primary/10 via-teal-500/10 to-cyan-500/10 dark:from-primary/5 dark:via-teal-500/5 dark:to-cyan-500/5 rounded-b-3xl">
            <div className="container mx-auto text-center px-4">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-slate-800 dark:text-gray-100">¿Listo para Crear el CV de Tus Sueños?</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-10">
                No dejes pasar la oportunidad de destacarte. Comienza a construir tu futuro profesional hoy mismo.
              </p>
              <MotionDiv
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" className="text-lg px-10 py-6 bg-gradient-to-r from-primary to-teal-600 hover:from-primary/90 hover:to-teal-600/90 text-white rounded-lg shadow-xl hover:shadow-primary/50 transition-all duration-300">
                  <Link href="/crear-cv">
                    Empezar a Crear mi CV <Sparkles className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </MotionDiv>
            </div>
          </section>
        </MotionDiv>
      );
    };

    export default LandingPage;