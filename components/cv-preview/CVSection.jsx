import React from 'react';

    const CVSection = ({ icon, title, children }) => {
      const IconComponent = icon;
      return (
        <section className="mb-3 md:mb-4 break-before-page">
          <div className="flex items-center mb-2 md:mb-3">
            {IconComponent && <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-teal-600 dark:text-teal-400 mr-2 flex-shrink-0" />}
            <h2 className="text-lg md:text-xl font-semibold text-teal-600 dark:text-teal-400 border-b-2 border-teal-500/50 dark:border-teal-400/50 pb-1 flex-grow">{title}</h2>
          </div>
          {children}
        </section>
      );
    };

    export default CVSection;