import React, { useEffect, useState } from 'react';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Button } from '@/components/ui/button';
    import { motion } from 'framer-motion';
    import { ChevronRight, Mic, MicOff, Loader2 } from 'lucide-react';
    import useSpeechRecognition from '@/hooks/useSpeechRecognition';
    import { useToast } from '@/components/ui/use-toast';
    import AudioVisualizer from '@/components/ui/AudioVisualizer';

    const PersonalInfoStep = ({ cvData, handleChange, onStepComplete }) => {
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
      const [fieldValues, setFieldValues] = useState(cvData.personalInfo);
      const [currentDictationFieldOriginalValue, setCurrentDictationFieldOriginalValue] = useState('');


      useEffect(() => {
        setFieldValues(cvData.personalInfo);
      }, [cvData.personalInfo]);


      const inputClass = "bg-slate-50/70 dark:bg-slate-700/60 border-gray-300 dark:border-slate-600 text-slate-800 dark:text-gray-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-600/90 focus:border-primary dark:focus:border-teal-500 text-base p-2.5 h-11 rounded-lg transition-colors duration-200";
      const labelClass = "text-slate-700 dark:text-gray-200 text-base mb-1 block font-medium";

      const handleSubmit = (e) => {
        e.preventDefault();
        if (isListening || isActivating) stopListening();
        Object.keys(fieldValues).forEach(key => {
            if(fieldValues[key] !== cvData.personalInfo[key]) {
                 handleChange('personalInfo', key, fieldValues[key]);
            }
        });
        if (onStepComplete) onStepComplete();
      };

      const handleLocalInputChange = (fieldName, value) => {
        setFieldValues(prev => ({ ...prev, [fieldName]: value }));
      };
      
      const handleInputBlur = (fieldName) => {
        handleChange('personalInfo', fieldName, fieldValues[fieldName]);
      };


      const handleMicClick = (fieldName) => {
        if (!hasRecognitionSupport) {
          toast({ title: "Navegador no compatible", description: "El reconocimiento de voz no es compatible con tu navegador.", variant: "destructive" });
          return;
        }

        const currentlyActive = (isListening || isActivating) && activeField === fieldName;

        if (currentlyActive) {
          stopListening();
        } else {
          if(isListening || isActivating) { 
            stopListening(); 
          }
          clearFinalTranscript();
          setActiveField(fieldName);
          setCurrentDictationFieldOriginalValue(fieldValues[fieldName] || '');
          startListening();
        }
      };
      
      useEffect(() => {
        if (!isListening && !isActivating && finalTranscript && activeField) {
          const newValue = currentDictationFieldOriginalValue ? `${currentDictationFieldOriginalValue} ${finalTranscript}`.trim() : finalTranscript;
          handleLocalInputChange(activeField, newValue);
          handleChange('personalInfo', activeField, newValue); 
          clearFinalTranscript();
          setActiveField(null); 
          setCurrentDictationFieldOriginalValue('');
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [finalTranscript, isListening, isActivating, activeField]);

      useEffect(() => {
        if ((isListening || isActivating) && activeField && interimTranscript) {
            const updatedDisplayValue = (currentDictationFieldOriginalValue ? currentDictationFieldOriginalValue + ' ' : '') + interimTranscript;
            setFieldValues(prev => ({ ...prev, [activeField]: updatedDisplayValue.trim() }));
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [interimTranscript, isListening, isActivating, activeField]);


      useEffect(() => {
        if (error) {
          toast({ title: "Error de Reconocimiento", description: error, variant: "destructive" });
          if (isListening || isActivating) {
            stopListening();
            if(activeField && currentDictationFieldOriginalValue) {
              setFieldValues(prev => ({ ...prev, [activeField]: currentDictationFieldOriginalValue }));
            }
          }
          setActiveField(null);
          setCurrentDictationFieldOriginalValue('');
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [error, toast]);

      const renderInputWithMic = (id, placeholder, type = "text") => (
        <div className="space-y-1">
          <div className="relative">
            <Input 
              id={id} 
              name={id} 
              type={type} 
              value={fieldValues[id] || ''} 
              onChange={(e) => handleLocalInputChange(id, e.target.value)}
              onBlur={() => handleInputBlur(id)}
              placeholder={placeholder} 
              className={`${inputClass} pr-10`} 
            />
            {hasRecognitionSupport && (type === "text" || type === "email" || type === "tel" || type === "url") && (
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-500 hover:text-primary" 
                onClick={() => handleMicClick(id)} 
                disabled={isActivating && activeField !== id && activeField !== null}
              >
                {isActivating && activeField === id ? <Loader2 className="h-5 w-5 animate-spin" /> : (isListening && activeField === id ? <MicOff className="h-5 w-5 text-red-500" /> : <Mic className="h-5 w-5" />)}
              </Button>
            )}
          </div>
          {activeField === id && (isListening || isActivating) && (
            <AudioVisualizer analyserNode={analyserNode} audioDataArray={audioDataArray} isListening={isListening || isActivating} />
          )}
        </div>
      );


      return (
        <motion.form
          initial={{ opacity: 0, y:5 }}
          animate={{ opacity: 1, y:0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 p-1.5"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName" className={labelClass}>Nombre Completo</Label>
              {renderInputWithMic("fullName", "Ej: Juan Pérez")}
            </div>
            <div>
              <Label htmlFor="email" className={labelClass}>Correo Electrónico</Label>
              {renderInputWithMic("email", "Ej: juan.perez@example.com", "email")}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone" className={labelClass}>Teléfono</Label>
              {renderInputWithMic("phone", "Ej: +54 9 11 12345678", "tel")}
            </div>
            <div>
              <Label htmlFor="nationality" className={labelClass}>Nacionalidad</Label>
              {renderInputWithMic("nationality", "Ej: Argentino/a")}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currentLocation" className={labelClass}>Localidad Actual</Label>
              {renderInputWithMic("currentLocation", "Ej: Buenos Aires")}
            </div>
            <div>
              <Label htmlFor="address" className={labelClass}>Dirección</Label>
              {renderInputWithMic("address", "Ej: Av. Corrientes 1234")}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age" className={labelClass}>Edad</Label>
              <Input 
                id="age" 
                type="number" 
                value={fieldValues.age || ''} 
                onChange={(e) => handleLocalInputChange('age', e.target.value)} 
                onBlur={() => handleInputBlur('age')}
                placeholder="Ej: 30" 
                className={inputClass} 
              />
            </div>
            <div>
              <Label htmlFor="maritalStatus" className={labelClass}>Estado Civil</Label>
              {renderInputWithMic("maritalStatus", "Ej: Soltero/a, Casado/a")}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="linkedin" className={labelClass}>Perfil de LinkedIn (URL)</Label>
              {renderInputWithMic("linkedin", "https://linkedin.com/in/...", "url")}
            </div>
            <div>
              <Label htmlFor="otherSocialProfile" className={labelClass}>Otro Perfil Social (URL)</Label>
              {renderInputWithMic("otherSocialProfile", "https://twitter.com/...", "url")}
            </div>
          </div>
          <div>
            <Label htmlFor="portfolio" className={labelClass}>Portfolio Personal (URL)</Label>
            {renderInputWithMic("portfolio", "https://tuportfolio.com", "url")}
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Siguiente Sección
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </motion.form>
      );
    };

    export default PersonalInfoStep;