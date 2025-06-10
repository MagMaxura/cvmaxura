import React from 'react';
    import Link from 'next/link'; // Usar Link de Next.js
    import { useRouter } from 'next/router'; // Usar useRouter de Next.js
    import { FileText, PlusCircle } from 'lucide-react';
    import { Button } from '@/components/ui/button';

    const Header = () => {
      const router = useRouter(); // Usar useRouter
      return (
        <header className="py-4 px-4 sm:px-6 shadow-lg bg-white/90 dark:bg-slate-800/80 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-200 dark:border-slate-700/60">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2.5">
              <FileText className="h-8 w-8 text-primary dark:text-teal-400" />
              <h1 className="text-2xl font-bold gradient-text">CV Builder IA</h1>
            </Link>
            <nav>
              {router.pathname === '/' && ( // Usar router.pathname
                <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-400/10 transition-colors duration-200">
                  <Link href="/crear-cv"> {/* Usar href en lugar de to */}
                    <PlusCircle className="mr-2 h-4 w-4" /> Crear CV
                  </Link>
                </Button>
              )}
            </nav>
          </div>
        </header>
      );
    };

    export default Header;