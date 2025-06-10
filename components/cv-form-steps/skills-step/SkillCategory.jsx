import React from 'react';
    import { Input } from '@/components/ui/input';
    import { Button } from '@/components/ui/button';
    import { PlusCircle, X, Mic, MicOff, Loader2 } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Slider } from "@/components/ui/slider";

    const SkillCategory = ({ title, icon, skills, onAdd, onRemove, onChange, onMicClick, activeMic }) => {
      return (
        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm bg-white/50 dark:bg-slate-800/50 space-y-3">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-gray-200 flex items-center">
            {icon} {title}
          </h3>
          <AnimatePresence>
            {skills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                className="flex items-center space-x-2"
              >
                <div className="relative flex-grow">
                  <Input
                    type="text"
                    value={skill.name}
                    onChange={(e) => onChange(index, 'name', e.target.value)}
                    placeholder="Ej: JavaScript"
                    className="bg-slate-50/70 dark:bg-slate-700/60 border-gray-300 dark:border-slate-600 text-slate-800 dark:text-gray-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-600/90 focus:border-primary dark:focus:border-teal-500 text-base p-2.5 h-10 rounded-md pr-10"
                  />
                  {onMicClick && (
                     <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-500 hover:text-primary"
                      onClick={() => onMicClick(index, 'name')}
                      disabled={activeMic && activeMic.type === 'activating' && (activeMic.index !== index || activeMic.field !== 'name')}
                    >
                      {activeMic && activeMic.index === index && activeMic.field === 'name' ? (activeMic.type === 'activating' ? <Loader2 className="h-4 w-4 animate-spin"/> : <MicOff className="h-4 w-4 text-red-500"/>) : <Mic className="h-4 w-4"/>}
                    </Button>
                  )}
                </div>
                <Slider
                  value={[skill.level]}
                  onValueChange={(value) => onChange(index, 'level', value[0])}
                  max={5}
                  step={1}
                  className="w-32"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400 w-10 text-center">
                  {skill.level}/5
                </span>
                <Button type="button" variant="ghost" size="icon" onClick={() => onRemove(index)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500">
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
          <Button type="button" variant="outline" size="sm" onClick={onAdd} className="text-primary border-primary/50 hover:bg-primary/10 dark:text-teal-400 dark:border-teal-400/50 dark:hover:bg-teal-400/10">
            <PlusCircle className="h-4 w-4 mr-2" /> Añadir Habilidad
          </Button>
        </div>
      );
    };

    export default SkillCategory;