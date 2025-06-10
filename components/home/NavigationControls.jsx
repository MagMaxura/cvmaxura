import React from 'react';
    import { Button } from '@/components/ui/button';
    import { ChevronLeft, ChevronRight } from 'lucide-react';

    const NavigationControls = ({ currentStepIndex, isLastStep, onBack, onNext, onReset, disableNext }) => {
      return (
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-5 border-t border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/40">
          <Button
            onClick={onBack}
            disabled={currentStepIndex === 0}
            variant="outline"
            className="mb-2 sm:mb-0 w-full sm:w-auto border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <ChevronLeft className="h-4 w-4 mr-1.5" /> Anterior
          </Button>
          
          <Button onClick={onReset} variant="ghost" className="text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 text-xs sm:absolute sm:left-1/2 sm:-translate-x-1/2">
            Reiniciar Formulario
          </Button>

          {!isLastStep && (
            <Button onClick={onNext} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground" disabled={disableNext}>
              Siguiente
              <ChevronRight className="h-4 w-4 ml-1.5" />
            </Button>
          )}
        </div>
      );
    };

    export default NavigationControls;