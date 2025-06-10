import React, { useState, useEffect } from 'react';
    import { Textarea } from '@/components/ui/textarea';
    import { Label } from '@/components/ui/label';
    import { Button } from '@/components/ui/button';
    import { motion, AnimatePresence } from 'framer-motion';
    import { ChevronRight, Mic, MicOff, Loader2 } from 'lucide-react';
    import useSpeechRecognition from '@/hooks/useSpeechRecognition';
    import { useToast } from '@/components/ui/use-toast';
    import AudioVisualizer from '@/components/ui/AudioVisualizer';

    const questions = [
      { id: 'idealJob', label: 'Si pudieras elegir, ¿qué tipo de trabajo te gustaría ahora?', type: 'textarea' },
      { id: 'workplaceValues', label: '¿Qué es lo que más valorás de un lugar para laburar?', type: 'textarea' },
      { id: 'careerPath', label: '¿Te gustaría cambiar de rubro o seguir en lo tuyo?', type: 'textarea' },
    ];

    const ConversationalInterestsStep = ({ cvData, handleChange, onStepComplete }) => {
      const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
      const [answers, setAnswers] = useState(cvData.interests || {});
      const [currentDictationFieldOriginalValue, setCurrentDictationFieldOriginalValue] = useState('');
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

      const currentFieldId = questions[currentQuestionIndex]?.id;

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAnswers(prev => ({ ...prev, [name]: value }));
        handleChange('interests', name, value);
      };

      const handleMicToggle = () => {
        if (!hasRecognitionSupport) {
          toast({ title: "Navegador no compatible", description: "El reconocimiento de voz no es compatible con tu navegador.", variant: "destructive" });
          return;
        }
        if (isListening || isActivating) {
          stopListening();
        } else {
          clearFinalTranscript();
          setCurrentDictationFieldOriginalValue(answers[currentFieldId] || '');
          startListening();
        }
      };

      useEffect(() => {
        if (!isListening && !isActivating && finalTranscript && currentFieldId) {
          const newAnswer = currentDictationFieldOriginalValue ? `${currentDictationFieldOriginalValue} ${finalTranscript}`.trim() : finalTranscript;
          setAnswers(prev => ({ ...prev, [currentFieldId]: newAnswer }));
          handleChange('interests', currentFieldId, newAnswer);
          clearFinalTranscript();
          setCurrentDictationFieldOriginalValue('');
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [finalTranscript, isListening, isActivating, currentFieldId]);

      useEffect(() => {
        if ((isListening || isActivating) && currentFieldId && interimTranscript) {
          const updatedDisplayValue = (currentDictationFieldOriginalValue ? currentDictationFieldOriginalValue + ' ' : '') + interimTranscript;
          setAnswers(prev => ({ ...prev, [currentFieldId]: updatedDisplayValue.trim() }));
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [interimTranscript, isListening, isActivating, currentFieldId]);

      useEffect(() => {
        if (error) {
          toast({ title: "Error de Reconocimiento", description: error, variant: "destructive" });
          if (isListening || isActivating) {
            stopListening();
            if(currentFieldId && currentDictationFieldOriginalValue) {
              setAnswers(prev => ({ ...prev, [currentFieldId]: currentDictationFieldOriginalValue }));
            }
          }
          setCurrentDictationFieldOriginalValue('');
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [error, toast]);

      const handleNextQuestion = (e) => {
        e.preventDefault();
        if(isListening || isActivating) stopListening();

        // Validar que la respuesta actual no esté vacía
        if (!answers[currentFieldId] || answers[currentFieldId].trim() === '') {
          toast({
            title: "Campo incompleto",
            description: "Por favor, ingresa tu respuesta antes de continuar.",
            variant: "destructive",
          });
          return;
        }

        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          clearFinalTranscript();
          setCurrentDictationFieldOriginalValue('');
        } else {
          if(onStepComplete) onStepComplete();
        }
      };
      
      const textareaClass = "bg-slate-50/70 dark:bg-slate-700/60 border-gray-300 dark:border-slate-600 text-slate-800 dark:text-gray-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-600/90 focus:border-primary dark:focus:border-teal-500 text-base p-2.5 min-h-[90px] rounded-lg transition-colors duration-200";
      const labelClass = "text-slate-700 dark:text-gray-200 text-base mb-2 block font-medium";
      
      const currentQuestion = questions[currentQuestionIndex];

      return (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-5 p-1.5 w-full max-w-xl"
        >
          <AnimatePresence mode="wait">
            {currentQuestion && (
              <motion.form
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleNextQuestion}
                className="space-y-3"
              >
                <div>
                  <Label htmlFor={currentQuestion.id} className={labelClass}>
                    {currentQuestion.label}
                  </Label>
                  <div className="relative">
                    <Textarea
                      id={currentQuestion.id}
                      name={currentQuestion.id}
                      value={answers[currentQuestion.id] || ''}
                      onChange={handleInputChange}
                      placeholder="Tu respuesta..."
                      className={`${textareaClass} pr-12`}
                      rows={3}
                    />
                     {hasRecognitionSupport && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-teal-400" 
                        onClick={handleMicToggle}
                        disabled={isActivating && !isListening}
                      >
                        {isActivating ? <Loader2 className="h-5 w-5 animate-spin" /> : (isListening ? <MicOff className="h-5 w-5 text-red-500" /> : <Mic className="h-5 w-5" />)}
                      </Button>
                    )}
                  </div>
                </div>

                {(isListening || isActivating) && <AudioVisualizer analyserNode={analyserNode} audioDataArray={audioDataArray} isListening={isListening || isActivating} />}

                <div className="flex justify-end items-center space-x-2 pt-2">
                  <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    {currentQuestionIndex < questions.length - 1 ? 'Siguiente Pregunta' : 'Finalizar Sección'}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      );
    };

    export default ConversationalInterestsStep;