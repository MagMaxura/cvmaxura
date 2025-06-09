import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, CircleDashed } from 'lucide-react';

const CVProgressSummary = ({ cvData, currentStepIndex, stepsConfig }) => {
  const getSectionStatus = (sectionId) => {
    switch (sectionId) {
      case 'personalInfo':
        return cvData.personalInfo.fullName && cvData.personalInfo.email ? 'completed' : 'incomplete';
      case 'profilePicture':
        return cvData.personalInfo.profilePicture ? 'completed' : 'incomplete';
      case 'experience':
      case 'conversationalExperience':
        return cvData.experience && cvData.experience.length > 0 ? 'completed' : 'incomplete';
      case 'education':
      case 'conversationalEducation':
        return cvData.education && cvData.education.length > 0 ? 'completed' : 'incomplete';
      case 'skills':
      case 'conversationalSkills':
        return (cvData.skills?.technical?.length > 0 || cvData.skills?.soft?.length > 0 || cvData.skills?.languages?.length > 0) ? 'completed' : 'incomplete';
      case 'projects':
        return cvData.projects && cvData.projects.length > 0 ? 'completed' : 'incomplete';
      case 'certifications':
        return cvData.certifications && cvData.certifications.length > 0 ? 'completed' : 'incomplete';
      case 'languages':
      case 'conversationalLanguages':
        return cvData.languages && cvData.languages.length > 0 ? 'completed' : 'incomplete';
      case 'conversationalInterests':
        return cvData.interests.idealJob || cvData.interests.workplaceValues || cvData.interests.careerPath ? 'completed' : 'incomplete';
      case 'conversationalOtherInfo':
        return cvData.otherInfo.travelAvailability || cvData.otherInfo.computerSkills || cvData.otherInfo.drivingLicense ? 'completed' : 'incomplete';
      default:
        return 'incomplete';
    }
  };

  return (
    <Card className="shadow-lg bg-white/80 dark:bg-slate-800/70 backdrop-blur-md border-slate-200 dark:border-slate-700/50 h-full">
      <CardHeader className="border-b border-slate-200 dark:border-slate-700/50 p-4">
        <CardTitle className="text-lg font-semibold text-slate-800 dark:text-gray-100">
          Resumen del CV
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {stepsConfig.map((step, index) => {
          if (step.id === 'preview') return null; // No mostrar el paso de previsualización aquí
          const status = getSectionStatus(step.id);
          const isCurrent = index === currentStepIndex;
          const isCompleted = status === 'completed';

          return (
            <div key={step.id} className={`flex items-center text-sm ${isCurrent ? 'font-bold text-primary dark:text-teal-400' : 'text-slate-600 dark:text-slate-300'}`}>
              {isCompleted ? (
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <CircleDashed className="h-4 w-4 mr-2 text-slate-400 dark:text-slate-500" />
              )}
              <span>{step.title}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default CVProgressSummary;