import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Edit3, Bot, Sparkles } from 'lucide-react';

    const ModeSelection = ({ onModeSelect }) => {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="w-full max-w-2xl mx-auto"
        >
          <Card className="shadow-2xl bg-white dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700/60">
            <CardHeader className="text-center pb-4">
              <Sparkles className="mx-auto h-12 w-12 text-primary mb-3" />
              <CardTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-500">
                Crea tu CV Inteligente
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300 text-base pt-1">
                Elige cómo quieres completar tu currículum:
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 p-6">
              <Button
                onClick={() => onModeSelect('form')}
                className="w-full sm:w-1/2 py-6 text-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Edit3 className="mr-2 h-5 w-5" /> Modo Formulario
              </Button>
              <Button
                onClick={() => onModeSelect('conversational')}
                className="w-full sm:w-1/2 py-6 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Bot className="mr-2 h-5 w-5" /> Modo Conversacional
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default ModeSelection;