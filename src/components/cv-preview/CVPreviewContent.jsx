import React from 'react';
    import { Card } from '@/components/ui/card';
    import CVHeader from '@/components/cv-preview/CVHeader';
    import CVFooter from '@/components/cv-preview/CVFooter';
    import CVSectionRenderer from '@/components/cv-preview/CVSectionRenderer';
    import { getSectionDefinitions } from '@/components/cv-preview/cvSectionDefinitions';

    const CVPreviewContent = ({ cvData, cvPreviewRef }) => {
      const { 
        personalInfo = {}, 
        educationDetails = {}, 
        experienceDetails = {}, 
        skillsDetails = {}, 
        languageDetails = {}, 
        interests = {}, 
        otherInfo = {} 
      } = cvData || {};
      
      const hasAnyConversationalData = 
        Object.values(educationDetails).some(v => v) ||
        Object.values(experienceDetails).some(v => v) ||
        Object.values(skillsDetails).some(v => v) ||
        Object.values(languageDetails).some(v => v) ||
        Object.values(interests).some(v => v) ||
        Object.values(otherInfo).some(v => v);

      const sections = getSectionDefinitions(cvData);

      return (
        <div id="cv-preview-scroll-container" className="flex-grow overflow-y-auto rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-100/50 dark:bg-slate-800/40 p-1.5">
          <Card id="cv-preview-card" className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-4 md:p-6 shadow-xl w-full min-h-full" ref={cvPreviewRef}>
            <div className="relative p-3 md:p-4 border border-gray-200 dark:border-slate-700 min-h-[297mm_scaled_to_fit] flex flex-col">
              <CVHeader personalInfo={personalInfo} />
              <main className="flex-grow space-y-3 md:space-y-4">
                <CVSectionRenderer sections={sections} />
              </main>
              <CVFooter showConversationalIntro={hasAnyConversationalData}/>
            </div>
          </Card>
        </div>
      );
    };

    export default CVPreviewContent;