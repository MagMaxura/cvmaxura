import React from 'react';
    import { Routes, Route } from 'react-router-dom';
    import HomePage from '@/pages/HomePage';
    import LandingPage from '@/pages/LandingPage'; 
    import Header from '@/components/layout/Header';
    import Footer from '@/components/layout/Footer';

    function App() {
      return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-slate-50 text-slate-800 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:text-gray-100 antialiased">
          <Header />
          <main className="flex-grow container mx-auto px-2 sm:px-4 py-6 sm:py-8 flex justify-center items-center">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/crear-cv" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      );
    }

    export default App;