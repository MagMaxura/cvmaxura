import React from 'react';
    import { MessageSquare } from 'lucide-react';

    const CVFooter = ({ showConversationalIntro }) => {
      return (
        <footer className="mt-auto pt-4 md:pt-6 text-center border-t border-gray-200 dark:border-slate-700">
          <p className="text-[10px] md:text-xs text-slate-600 dark:text-slate-300 font-medium">
            ¿Eres reclutador y buscas optimizar tu tiempo?
          </p>
          <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400">
            Descubre cómo <strong className="text-teal-600 dark:text-teal-400">EmploySmart IA</strong> transforma tu proceso de selección.
          </p>
          <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            Visita <a href="http://www.employsmartia.com" target="_blank" rel="noopener noreferrer" className="text-sky-600 dark:text-sky-400 font-semibold hover:underline">www.employsmartia.com</a> y haz de la IA tu mejor aliada.
          </p>
          {showConversationalIntro && (
            <div className="mt-2 pt-2 border-t border-gray-200/70 dark:border-slate-700/70">
              <p className="text-[9px] md:text-[10px] text-sky-700 dark:text-sky-300 italic flex items-center justify-center">
                <MessageSquare className="w-3 h-3 mr-1.5 flex-shrink-0" />
                Este CV incluye reflexiones personales del candidato, obtenidas a través de una conversación, para ofrecer una visión más completa y auténtica de su perfil.
              </p>
            </div>
          )}
        </footer>
      );
    };

    export default CVFooter;