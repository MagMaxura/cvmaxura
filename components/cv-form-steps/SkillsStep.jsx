import React, { useState, useEffect } from 'react';
    import { Button } from '@/components/ui/button';
    import { ChevronRight, Star, MessageSquare, UserCircle2 } from 'lucide-react';
    import { motion } from 'framer-motion';
    import useSpeechRecognition from '@/hooks/useSpeechRecognition';
    import { useToast } from '@/components/ui/use-toast';
    import AudioVisualizer from '@/components/ui/AudioVisualizer';
    import SkillCategory from '@/components/cv-form-steps/skills-step/SkillCategory';

    const SkillsStep = ({ cvData, updateCVData, onStepComplete }) => {
      // Inicializar con al menos un campo vacío si no hay datos
      const [technicalSkills, setTechnicalSkills] = useState(cvData.skills?.technical?.length > 0 ? cvData.skills.technical : [{ id: Date.now(), name: '', level: 3 }]);
      const [softSkills, setSoftSkills] = useState(cvData.skills?.soft?.length > 0 ? cvData.skills.soft : [{ id: Date.now() + 1, name: '', level: 3 }]);
      
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

      const [activeMicCategory, setActiveMicCategory] = useState(null); 
      const [activeMicDetails, setActiveMicDetails] = useState({ index: null, field: null, originalValue: '' });

      const makeUpdater = (setter, categoryKey) => {
        return (index, field, value) => {
          setter(prevSkills => {
            const updatedSkills = prevSkills.map((skill, i) =>
              i === index ? { ...skill, [field]: value } : skill
            );
            updateCVData('skills', { ...cvData.skills, [categoryKey]: updatedSkills });
            return updatedSkills;
          });
        };
      };

      const makeAdder = (setter, categoryKey) => {
        return () => {
          setter(prevSkills => {
            const newSkills = [...prevSkills, { id: Date.now(), name: '', level: 3 }];
            updateCVData('skills', { ...cvData.skills, [categoryKey]: newSkills });
            return newSkills;
          });
        };
      };

      const makeRemover = (setter, categoryKey) => {
        return (index) => {
          setter(prevSkills => {
            const updatedSkills = prevSkills.filter((_, i) => i !== index);
            updateCVData('skills', { ...cvData.skills, [categoryKey]: updatedSkills });
            return updatedSkills;
          });
        };
      };
      
      const handleMicClick = (category, index, fieldName) => {
        if (!hasRecognitionSupport) {
          toast({ title: "Navegador no compatible", description: "El reconocimiento de voz no es compatible con tu navegador.", variant: "destructive" });
          return;
        }

        const currentCategoryState = category === 'technical' ? technicalSkills : softSkills;
        const currentlyActive = (isListening || isActivating) && activeMicCategory === category && activeMicDetails.index === index && activeMicDetails.field === fieldName;

        if (currentlyActive) {
          stopListening();
        } else {
          if (isListening || isActivating) stopListening();
          clearFinalTranscript();
          setActiveMicCategory(category);
          setActiveMicDetails({ index, field: fieldName, originalValue: currentCategoryState[index][fieldName] || '' });
          startListening();
        }
      };

      useEffect(() => {
        if (!isListening && !isActivating && finalTranscript && activeMicCategory && activeMicDetails.index !== null) {
          const { index, field, originalValue } = activeMicDetails;
          const newValue = originalValue ? `${originalValue} ${finalTranscript}`.trim() : finalTranscript;
          
          const updater = activeMicCategory === 'technical' ? makeUpdater(setTechnicalSkills, 'technical') :
                          activeMicCategory === 'soft' ? makeUpdater(setSoftSkills, 'soft') : null;
          updater(index, field, newValue);
          
          clearFinalTranscript();
          setActiveMicCategory(null);
          setActiveMicDetails({ index: null, field: null, originalValue: '' });
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [finalTranscript, isListening, isActivating, activeMicCategory, activeMicDetails]);

       useEffect(() => {
        if ((isListening || isActivating) && activeMicCategory && activeMicDetails.index !== null && interimTranscript) {
            const { index, field, originalValue } = activeMicDetails;
            const updatedDisplayValue = (originalValue ? originalValue + ' ' : '') + interimTranscript;

            const setter = activeMicCategory === 'technical' ? setTechnicalSkills :
                           activeMicCategory === 'soft' ? setSoftSkills : null;
            
            setter(prevSkills => prevSkills.map((skill, i) => 
              i === index ? { ...skill, [field]: updatedDisplayValue.trim() } : skill
            ));
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [interimTranscript, isListening, isActivating, activeMicCategory, activeMicDetails]);


      useEffect(() => {
        if (error) {
          toast({ title: "Error de Reconocimiento", description: error, variant: "destructive" });
          if (isListening || isActivating) {
            stopListening();
            if(activeMicCategory && activeMicDetails.index !== null && activeMicDetails.originalValue) {
                const { index, field, originalValue } = activeMicDetails;
                 const setter = activeMicCategory === 'technical' ? setTechnicalSkills : setSoftSkills;
               if (setter) { // Asegurarse de que el setter no sea nulo
                   setter(prevSkills => prevSkills.map((skill, i) =>
                     i === index ? { ...skill, [field]: originalValue } : skill
                   ));
               }
            }
          }
          setActiveMicCategory(null);
          setActiveMicDetails({ index: null, field: null, originalValue: '' });
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [error, toast]);


      const handleSubmit = (e) => {
        e.preventDefault();
        if (isListening || isActivating) stopListening();

        const hasTechnicalSkills = technicalSkills.some(skill => skill.name);
        const hasSoftSkills = softSkills.some(skill => skill.name);

        if (!hasTechnicalSkills && !hasSoftSkills) {
          toast({
            title: "Campos obligatorios incompletos",
            description: "Por favor, añade al menos una habilidad técnica o blanda.",
            variant: "destructive",
          });
          return;
        }
 
        updateCVData('skills', {
          technical: technicalSkills,
          soft: softSkills,
        });
        if(onStepComplete) onStepComplete();
      };

      const getActiveMicStatus = (category, index, fieldName) => {
        if (activeMicCategory === category && activeMicDetails.index === index && activeMicDetails.field === fieldName) {
          if (isActivating) return { type: 'activating', index, field: fieldName };
          if (isListening) return { type: 'listening', index, field: fieldName };
        }
        return null;
      };

      return (
        <motion.form 
            initial={{ opacity: 0, y:5 }}
            animate={{ opacity: 1, y:0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit} className="space-y-6 p-1"
        >
          <SkillCategory 
            title="Habilidades Técnicas" 
            icon={<Star className="h-5 w-5 mr-2 text-yellow-500" />}
            skills={technicalSkills}
            onAdd={makeAdder(setTechnicalSkills, 'technical')}
            onRemove={makeRemover(setTechnicalSkills, 'technical')}
            onChange={makeUpdater(setTechnicalSkills, 'technical')}
            onMicClick={(index, field) => handleMicClick('technical', index, field)}
            activeMic={getActiveMicStatus('technical', activeMicDetails.index, activeMicDetails.field)}
          />
          <SkillCategory 
            title="Habilidades Blandas" 
            icon={<UserCircle2 className="h-5 w-5 mr-2 text-sky-500" />}
            skills={softSkills}
            onAdd={makeAdder(setSoftSkills, 'soft')}
            onRemove={makeRemover(setSoftSkills, 'soft')}
            onChange={makeUpdater(setSoftSkills, 'soft')}
            onMicClick={(index, field) => handleMicClick('soft', index, field)}
            activeMic={getActiveMicStatus('soft', activeMicDetails.index, activeMicDetails.field)}
          />

          {(isListening || isActivating) && activeMicCategory && (
            <div className="mt-4">
              <AudioVisualizer analyserNode={analyserNode} audioDataArray={audioDataArray} isListening={isListening || isActivating} />
            </div>
          )}
          
          <div className="flex justify-end pt-4">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Siguiente Sección <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </motion.form>
      );
    };

    export default SkillsStep;