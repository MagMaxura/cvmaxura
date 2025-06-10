import React, { useState, useEffect } from 'react';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';
    import { Label } from '@/components/ui/label';
    import { Button } from '@/components/ui/button';
    import { PlusCircle, Trash2, ChevronRight, Mic, MicOff, Loader2 } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import useSpeechRecognition from '@/hooks/useSpeechRecognition';
    import { useToast } from '@/components/ui/use-toast';
    import AudioVisualizer from '@/components/ui/AudioVisualizer';

    const ExperienceStep = ({ cvData, addListItem, updateListItem, removeListItem, onStepComplete }) => {
      const [experienceEntries, setExperienceEntries] = useState(cvData.experience || [{ company: '', role: '', startDate: '', endDate: '', description: '' }]);
      const { toast } = useToast();
      const {
        isListening,
        isActivating,
        interimTranscript,
        finalTranscript,
        error,
        startListening,
        stopListening,
        hasRecognitionSupport,
        clearFinalTranscript,
        analyserNode,
        audioDataArray,
      } = useSpeechRecognition();
      
      const [activeField, setActiveField] = useState(null);
      const [activeEntryIndex, setActiveEntryIndex] = useState(null);
      const [currentDictationFieldOriginalValue, setCurrentDictationFieldOriginalValue] = useState('');

      const handleEntryChange = (index, field, value) => {
        const updatedEntries = [...experienceEntries];
        updatedEntries[index][field] = value;
        setExperienceEntries(updatedEntries);
        updateListItem('experience', index, updatedEntries[index]);
      };

      const addEntry = () => {
        // Validar la última entrada antes de añadir una nueva
        const lastEntry = experienceEntries[experienceEntries.length - 1];
        if (lastEntry && (!lastEntry.company || !lastEntry.role || !lastEntry.startDate || !lastEntry.description)) {
          toast({
            title: "Campos incompletos",
            description: "Por favor, completa la entrada de experiencia actual antes de añadir una nueva.",
            variant: "destructive",
          });
          return;
        }

        const newEntry = { company: '', role: '', startDate: '', endDate: '', description: '' };
        setExperienceEntries(prev => [...prev, newEntry]);
        addListItem('experience', newEntry);
      };

      const removeEntry = (index) => {
        const updatedEntries = experienceEntries.filter((_, i) => i !== index);
        setExperienceEntries(updatedEntries);
        removeListItem('experience', index);
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        if (isListening || isActivating) stopListening();

        const hasValidEntry = experienceEntries.some(entry =>
          entry.company && entry.role && entry.startDate && entry.description
        );

        if (!hasValidEntry && experienceEntries.length > 0) {
          toast({
            title: "Campos obligatorios incompletos",
            description: "Por favor, completa al menos una entrada de experiencia con Empresa, Puesto, Fecha de Inicio y Descripción.",
            variant: "destructive",
          });
          return;
        }
        
        // No es necesario llamar a updateExperience aquí, ya que las actualizaciones se manejan en handleEntryChange, addEntry y removeEntry
        if(onStepComplete) onStepComplete();
      };

       const handleMicClick = (index, fieldName) => {
        if (!hasRecognitionSupport) {
          toast({ title: "Navegador no compatible", description: "El reconocimiento de voz no es compatible con tu navegador.", variant: "destructive" });
          return;
        }
        const currentlyActive = (isListening || isActivating) && activeEntryIndex === index && activeField === fieldName;
        if (currentlyActive) {
          stopListening();
        } else {
          if(isListening || isActivating) stopListening();
          clearFinalTranscript();
          setActiveEntryIndex(index);
          setActiveField(fieldName);
          setCurrentDictationFieldOriginalValue(experienceEntries[index][fieldName] || '');
          startListening();
        }
      };

      useEffect(() => {
        if (!isListening && !isActivating && finalTranscript && activeField !== null && activeEntryIndex !== null) {
          const newValue = currentDictationFieldOriginalValue ? `${currentDictationFieldOriginalValue} ${finalTranscript}`.trim() : finalTranscript;
          handleEntryChange(activeEntryIndex, activeField, newValue);
          clearFinalTranscript();
          setActiveField(null);
          setActiveEntryIndex(null);
          setCurrentDictationFieldOriginalValue('');
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [finalTranscript, isListening, isActivating, activeField, activeEntryIndex]);

      useEffect(() => {
        if ((isListening || isActivating) && activeField !== null && activeEntryIndex !== null && interimTranscript) {
          const updatedDisplayValue = (currentDictationFieldOriginalValue ? currentDictationFieldOriginalValue + ' ' : '') + interimTranscript;
          const updatedEntries = [...experienceEntries];
          updatedEntries[activeEntryIndex][activeField] = updatedDisplayValue.trim();
          setExperienceEntries(updatedEntries);
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [interimTranscript, isListening, isActivating, activeField, activeEntryIndex]);

      useEffect(() => {
        if (error) {
          toast({ title: "Error de Reconocimiento", description: error, variant: "destructive" });
          if (isListening || isActivating) {
            stopListening();
             if(activeField !== null && activeEntryIndex !== null && currentDictationFieldOriginalValue) {
               const updatedEntries = [...experienceEntries];
               updatedEntries[activeEntryIndex][activeField] = currentDictationFieldOriginalValue;
               setExperienceEntries(updatedEntries);
            }
          }
          setActiveField(null);
          setActiveEntryIndex(null);
          setCurrentDictationFieldOriginalValue('');
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [error, toast]);
      
      const inputClass = "bg-slate-50/70 dark:bg-slate-700/60 border-gray-300 dark:border-slate-600 text-slate-800 dark:text-gray-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-600/90 focus:border-primary dark:focus:border-teal-500 text-base p-2.5 h-11 rounded-lg transition-colors duration-200";
      const labelClass = "text-slate-700 dark:text-gray-200 text-sm mb-1 block font-medium";
      const textareaClass = `${inputClass} min-h-[80px]`;

      const renderInputWithMic = (index, fieldId, placeholder, type = "text") => (
        <div className="relative">
          <Input
            id={`${fieldId}-${index}`}
            type={type}
            value={experienceEntries[index][fieldId] || ''}
            onChange={(e) => handleEntryChange(index, fieldId, e.target.value)}
            placeholder={placeholder}
            className={`${inputClass} pr-10`}
          />
          {hasRecognitionSupport && (type === "text") && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-500 hover:text-primary"
              onClick={() => handleMicClick(index, fieldId)}
              disabled={isActivating && (activeEntryIndex !== index || activeField !== fieldId) && activeField !== null}
            >
              {isActivating && activeEntryIndex === index && activeField === fieldId ? <Loader2 className="h-5 w-5 animate-spin" /> : (isListening && activeEntryIndex === index && activeField === fieldId ? <MicOff className="h-5 w-5 text-red-500" /> : <Mic className="h-5 w-5" />)}
            </Button>
          )}
        </div>
      );
      const renderTextareaWithMic = (index, fieldId, placeholder) => (
        <div className="relative">
          <Textarea
            id={`${fieldId}-${index}`}
            value={experienceEntries[index][fieldId] || ''}
            onChange={(e) => handleEntryChange(index, fieldId, e.target.value)}
            placeholder={placeholder}
            className={`${textareaClass} pr-10`}
            rows={3}
          />
          {hasRecognitionSupport && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-2 h-8 w-8 text-slate-500 hover:text-primary"
              onClick={() => handleMicClick(index, fieldId)}
              disabled={isActivating && (activeEntryIndex !== index || activeField !== fieldId) && activeField !== null}
            >
              {isActivating && activeEntryIndex === index && activeField === fieldId ? <Loader2 className="h-5 w-5 animate-spin" /> : (isListening && activeEntryIndex === index && activeField === fieldId ? <MicOff className="h-5 w-5 text-red-500" /> : <Mic className="h-5 w-5" />)}
            </Button>
          )}
        </div>
      );

      return (
        <motion.form 
            initial={{ opacity: 0, y:5 }}
            animate={{ opacity: 1, y:0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit} className="space-y-6 p-1"
        >
          <AnimatePresence>
            {experienceEntries.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm bg-white/50 dark:bg-slate-800/50 relative space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`company-${index}`} className={labelClass}>Empresa</Label>
                    {renderInputWithMic(index, "company", "Ej: Google Inc.")}
                  </div>
                  <div>
                    <Label htmlFor={`role-${index}`} className={labelClass}>Puesto</Label>
                    {renderInputWithMic(index, "role", "Ej: Desarrollador Frontend")}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`startDateExp-${index}`} className={labelClass}>Fecha de Inicio</Label>
                    {renderInputWithMic(index, "startDate", "Ej: Junio 2020")}
                  </div>
                  <div>
                    <Label htmlFor={`endDateExp-${index}`} className={labelClass}>Fecha de Fin</Label>
                    {renderInputWithMic(index, "endDate", "Ej: Agosto 2023 o Actualidad")}
                  </div>
                </div>
                <div>
                  <Label htmlFor={`descriptionExp-${index}`} className={labelClass}>Descripción de Tareas y Logros</Label>
                  {renderTextareaWithMic(index, "description", "Ej: Desarrollo de nuevas funcionalidades, optimización de rendimiento...")}
                </div>

                {activeEntryIndex === index && (isListening || isActivating) && (
                  <div className="mt-2">
                    <AudioVisualizer analyserNode={analyserNode} audioDataArray={audioDataArray} isListening={isListening || isActivating} />
                  </div>
                )}

                {experienceEntries.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeEntry(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 px-2 py-1 h-auto">
                    <Trash2 className="h-4 w-4 mr-1 sm:mr-0" /> <span className="hidden sm:inline">Eliminar</span>
                  </Button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex justify-start">
            <Button type="button" variant="outline" onClick={addEntry} className="text-primary border-primary/50 hover:bg-primary/10 dark:text-teal-400 dark:border-teal-400/50 dark:hover:bg-teal-400/10">
              <PlusCircle className="h-4 w-4 mr-2" /> Añadir Experiencia
            </Button>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Siguiente Sección <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </motion.form>
      );
    };

    export default ExperienceStep;