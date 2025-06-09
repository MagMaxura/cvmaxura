import React from 'react';

    const questionMap = {
      studyLocationAndStatus: 'Ubicación y Estado de Estudios',
      studyEnjoyment: 'Motivación en Estudios',
      futureStudies: 'Planes de Estudio Futuros',
      additionalEducationInfo: 'Información Adicional (Educación)',
      currentEmployment: 'Situación Laboral Actual',
      pastExperiences: 'Trayectoria Laboral (Resumen)',
      favoriteJob: 'Trabajo Destacado',
      favoriteJobTasks: 'Tareas Preferidas en Trabajo Destacado',
      naturalTalents: 'Talentos y Fortalezas Naturales',
      toolsAndSkills: 'Herramientas y Habilidades Clave (Conversacional)',
      workStyle: 'Estilo de Trabajo Preferido',
      languageProficiency: 'Competencia Lingüística (Conversacional)',
      idealJob: 'Búsqueda Laboral Ideal',
      workplaceValues: 'Valores en el Entorno Laboral',
      careerPath: 'Aspiraciones Profesionales',
      travelAvailability: 'Disponibilidad para Viajar/Reubicarse',
      computerSkills: 'Habilidades Informáticas Adicionales (Conversacional)',
      drivingLicense: 'Licencia de Conducir y Movilidad',
    };
    
    const ConversationalDetailBlock = ({ detailsObject, isSubtle, sectionTitle }) => {
      if (!detailsObject || Object.values(detailsObject).every(val => !val)) return null;
      
      const entries = Object.entries(detailsObject).filter(([_, value]) => value);
      if (entries.length === 0) return null;

      return (
        <div className={`mt-2 mb-3 p-2.5 rounded-md ${isSubtle ? 'bg-teal-50/50 dark:bg-teal-900/30 border-l-4 border-teal-500/70 dark:border-teal-400/70' : 'bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/50'}`}>
          {sectionTitle && !isSubtle && <h4 className="text-sm md:text-base font-semibold text-teal-700 dark:text-teal-300 mb-1.5">{sectionTitle}</h4>}
          {entries.map(([key, value]) => (
            <div key={key} className="mb-1.5 last:mb-0">
              <p className={`text-xs md:text-sm font-medium ${isSubtle ? 'text-teal-700 dark:text-teal-300' : 'text-slate-500 dark:text-slate-400'}`}>{questionMap[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</p>
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{value}</p>
            </div>
          ))}
        </div>
      );
    };

    export default ConversationalDetailBlock;