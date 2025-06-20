import React from 'react';

    const Footer = () => {
      const currentYear = new Date().getFullYear();
      return (
        <footer className="py-4 px-4 sm:px-6 text-center text-sm text-slate-500 dark:text-gray-400 border-t border-gray-200 dark:border-slate-700/60 bg-white/90 dark:bg-slate-800/80">
          <p>&copy; {currentYear} CV Builder IA. Todos los derechos reservados.</p>
          <p className="text-xs mt-1">Página realizada por <a href="https://www.cvsmartia.com" target="_blank" rel="noopener noreferrer" className="text-primary dark:text-teal-400">www.cvsmartia.com</a></p>
        </footer>
      );
    };

    export default Footer;