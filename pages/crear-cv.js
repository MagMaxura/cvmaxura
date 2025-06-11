import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ClientOnly from '../components/utils/ClientOnly.jsx';

const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false });
import { Progress } from '../components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Edit3, FileText, FileImage as ImageIcon, Award, Languages as LanguagesIcon, Bot, CheckCircle } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import PersonalInfoStep from '../components/cv-form-steps/PersonalInfoStep.jsx';
import ExperienceStep from '../components/cv-form-steps/ExperienceStep.jsx';
import EducationStep from '../components/cv-form-steps/EducationStep.jsx';
import SkillsStep from '../components/cv-form-steps/SkillsStep.jsx';
import ProjectsStep from '../components/cv-form-steps/ProjectsStep.jsx';
import CertificationsStep from '../components/cv-form-steps/CertificationsStep.jsx';
import LanguagesStep from '../components/cv-form-steps/LanguagesStep.jsx';
import ProfilePictureStep from '../components/cv-form-steps/ProfilePictureStep.jsx';
import PreviewStep from '../components/cv-form-steps/PreviewStep.jsx';

import ConversationalEducationStep from '../components/cv-form-steps/conversational-steps/ConversationalEducationStep.jsx';
import ConversationalExperienceStep from '../components/cv-form-steps/conversational-steps/ConversationalExperienceStep.jsx';
import ConversationalSkillsStep from '../components/cv-form-steps/conversational-steps/ConversationalSkillsStep.jsx';
import ConversationalLanguagesStep from '../components/cv-form-steps/conversational-steps/ConversationalLanguagesStep.jsx';
import ConversationalInterestsStep from '../components/cv-form-steps/conversational-steps/ConversationalInterestsStep.jsx';
import ConversationalOtherInfoStep from '../components/cv-form-steps/conversational-steps/ConversationalOtherInfoStep.jsx';

import useCVStore from '../hooks/useCVStore';
import ModeSelection from '../components/home/ModeSelection.jsx';
import StepRenderer from '../components/home/StepRenderer.jsx';
import NavigationControls from '../components/home/NavigationControls.jsx';
import CVProgressSummary from '../components/home/CVProgressSummary.jsx';
import CVGenerator from '../lib/cvGenerator';

const formStepsConfig = [
  { id: 'personalInfo', title: 'Información Personal', icon: Edit3, component: PersonalInfoStep },
  { id: 'profilePicture', title: 'Foto de Perfil', icon: ImageIcon, component: ProfilePictureStep },
  { id: 'experience', title: 'Experiencia Laboral', icon: Edit3, component: ExperienceStep },
  { id: 'education', title: 'Educación', icon: Edit3, component: EducationStep },
  { id: 'skills', title: 'Habilidades', icon: Edit3, component: SkillsStep },
  { id: 'projects', title: 'Proyectos', icon: Edit3, component: ProjectsStep },
  { id: 'certifications', title: 'Certificaciones', icon: Award, component: CertificationsStep },
  { id: 'languages', title: 'Idiomas', icon: LanguagesIcon, component: LanguagesStep },
  { id: 'preview', title: 'Previsualizar y Descargar', icon: FileText, component: PreviewStep },
];

const conversationalStepsConfig = [
  { id: 'personalInfo', title: 'Información Personal', icon: Bot, component: PersonalInfoStep },
  { id: 'profilePicture', title: 'Foto de Perfil', icon: ImageIcon, component: ProfilePictureStep },
  { id: 'conversationalEducation', title: 'Educación (Conversacional)', icon: Bot, component: ConversationalEducationStep },
  { id: 'conversationalExperience', title: 'Experiencia (Conversacional)', icon: Bot, component: ConversationalExperienceStep },
  { id: 'conversationalSkills', title: 'Habilidades (Conversacional)', icon: Bot, component: ConversationalSkillsStep },
  { id: 'conversationalLanguages', title: 'Idiomas (Conversacional)', icon: Bot, component: ConversationalLanguagesStep },
  { id: 'conversationalInterests', title: 'Intereses (Conversacional)', icon: Bot, component: ConversationalInterestsStep },
  { id: 'conversationalOtherInfo', title: 'Otra Información (Conversacional)', icon: Bot, component: ConversationalOtherInfoStep },
  { id: 'preview', title: 'Previsualizar y Descargar', icon: FileText, component: PreviewStep },
];

const HomePage = () => {
  const cvStoreData = useCVStore();
  
  if (!cvStoreData) {
    return <div>Cargando...</div>; 
  }

  const { cvData, resetCVData, updateCVData, updateCVField, addListItem, updateListItem, removeListItem } = cvStoreData;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [mode, setMode] = useState(null);
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    console.log("HomePage - El componente se ha renderizado.");
  }, []);

  const steps = mode === 'form' ? formStepsConfig : (mode === 'conversational' ? conversationalStepsConfig : []);
  
  const handleNext = () => {
    console.log(`HomePage - Navegando de paso ${currentStepIndex + 1} a ${currentStepIndex + 2}. cvData actual:`, cvData);
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      toast({
        title: "¡Completado!",
        description: "Has llegado al final. Revisa tu CV y descárgalo.",
        className: "bg-green-100 dark:bg-green-800 border-green-300 dark:border-green-600",
        action: <CheckCircle className="text-green-500" />,
      });
    }
  };

  const handleBack = () => {
    console.log(`HomePage - Retrocediendo de paso ${currentStepIndex + 1} a ${currentStepIndex}. cvData actual:`, cvData);
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleModeSelection = (selectedMode) => {
    console.log("HomePage - Modo seleccionado:", selectedMode);
    setMode(selectedMode);
    setCurrentStepIndex(0);
  };
  
  const handleReset = () => {
    console.log("HomePage - Reiniciando formulario.");
    resetCVData();
    setCurrentStepIndex(0);
    setMode(null);
    toast({
      title: "Formulario Reiniciado",
      description: "Todos los datos han sido borrados.",
    });
  };

  const downloadPDF = async (element) => {
    if (isDownloading || !element) {
      if (!element) {
        toast({ title: "Error", description: "Vista previa no disponible.", variant: "destructive"});
      }
      return;
    }
    setIsDownloading(true);
    toast({ title: "Preparando PDF...", description: "Esto puede tardar unos segundos." });

    try {
        await new Promise(resolve => setTimeout(resolve, 50));
        await CVGenerator.downloadCVAsPDF(element, cvData.personalInfo.fullName || 'CV');
        toast({
            title: "¡PDF Descargado!",
            description: "Tu CV ha sido guardado.",
            className: "bg-green-100 dark:bg-green-800 border-green-300 dark:border-green-600",
            action: <CheckCircle className="text-green-500" />,
        });
    } catch (error) {
        console.error("Error al generar PDF:", error);
        toast({
            title: "Error al generar PDF",
            description: `Ocurrió un problema: ${error.message || 'Inténtalo de nuevo.'}`,
            variant: "destructive",
        });
    } finally {
        setIsDownloading(false);
    }
  };

  const progress = steps.length > 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  if (!mode) {
    return <ModeSelection onModeSelect={handleModeSelection} />;
  }
  
  const currentStepConfig = steps[currentStepIndex];
  const IconComponent = currentStepConfig?.icon || Edit3;

  return (
    <ClientOnly>
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl mx-auto p-2 sm:p-0 grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        <div className="lg:col-span-2">
          <Card className="shadow-2xl bg-white/80 dark:bg-slate-800/70 backdrop-blur-md border-slate-200 dark:border-slate-700/50 overflow-hidden">
            <CardHeader className="border-b border-slate-200 dark:border-slate-700/50 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <IconComponent className="h-7 w-7 text-primary mr-2.5" />
                  <CardTitle className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-gray-100">
                    {currentStepConfig?.title || 'Paso Actual'}
                  </CardTitle>
                </div>
                <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Paso {currentStepIndex + 1} de {steps.length}
                </span>
              </div>
              <Progress value={progress} className="w-full h-2 [&>div]:bg-gradient-to-r [&>div]:from-teal-400 [&>div]:to-cyan-500" />
            </CardHeader>

            <CardContent className="p-3 sm:p-5 min-h-[300px] sm:min-h-[400px] flex flex-col justify-center items-center">
              <StepRenderer
                currentStepIndex={currentStepIndex}
                CurrentStepComponent={currentStepConfig?.component}
                cvData={cvData}
                updateCVData={updateCVData}
                updateCVField={updateCVField}
                addListItem={addListItem}
                updateListItem={updateListItem}
                removeListItem={removeListItem}
                onStepComplete={handleNext}
                downloadPDF={currentStepConfig?.id === 'preview' ? downloadPDF : undefined}
                isDownloading={currentStepConfig?.id === 'preview' ? isDownloading : undefined}
              />
            </CardContent>

            <NavigationControls
              currentStepIndex={currentStepIndex}
              isLastStep={currentStepConfig?.id === 'preview'}
              onBack={handleBack}
              onNext={handleNext}
              onReset={handleReset}
              disableNext={currentStepConfig?.id.startsWith('preview') && currentStepConfig?.id !== 'preview'}
            />
          </Card>
        </div>
        <div className="hidden lg:block">
          <CVProgressSummary
            cvData={cvData}
            currentStepIndex={currentStepIndex}
            stepsConfig={steps}
          />
        </div>
        <div className="lg:col-span-3 mt-4 p-4 bg-gray-100 dark:bg-slate-700 rounded-lg shadow-inner text-xs text-slate-700 dark:text-slate-200 overflow-auto max-h-60">
          <h3 className="font-bold mb-2">Estado Actual de cvData (Depuración):</h3>
          <pre className="whitespace-pre-wrap break-all">{JSON.stringify(cvData, null, 2)}</pre>
        </div>
      </MotionDiv>
    </ClientOnly>
  );
};

export default HomePage;