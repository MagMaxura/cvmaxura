import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { Card } from '@/components/ui/card';
import CVHeader from '@/components/cv-preview/CVHeader';
import CVFooter from '@/components/cv-preview/CVFooter';
import CVSectionRenderer from '@/components/cv-preview/CVSectionRenderer';
import { getSectionDefinitions } from '@/components/cv-preview/cvSectionDefinitions';

const CVPreviewContent = forwardRef(({ cvData }, ref) => {
  const headerRef = useRef(null);
  const mainRef = useRef(null);
  const footerRef = useRef(null);
  const contentToDownloadRef = useRef(null); // Nueva ref para el contenedor principal

  useImperativeHandle(ref, () => ({
    getHeaderElement: () => headerRef.current,
    getMainElement: () => mainRef.current,
    getFooterElement: () => footerRef.current,
    getSectionElements: () => {
      if (mainRef.current) {
        return Array.from(mainRef.current.querySelectorAll('.cv-section'));
      }
      return [];
    },
    getContentToDownloadElement: () => contentToDownloadRef.current // Exponer el elemento principal
  }));

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
      <Card id="cv-preview-card" className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-4 md:p-6 shadow-xl w-full min-h-full print:p-0 print:shadow-none print:border-none">
        <div id="cv-content-to-download" ref={contentToDownloadRef} className="relative p-3 md:p-4 border border-gray-200 dark:border-slate-700 flex flex-col print:border-none print:p-0">
          <CVHeader personalInfo={personalInfo} ref={headerRef} />
          <main ref={mainRef} className="flex-grow space-y-3 md:space-y-4 print:space-y-2">
            <CVSectionRenderer sections={sections} />
          </main>
          <CVFooter showConversationalIntro={hasAnyConversationalData} ref={footerRef} />
        </div>
      </Card>
    </div>
  );
});

CVPreviewContent.displayName = 'CVPreviewContent';

export default CVPreviewContent;