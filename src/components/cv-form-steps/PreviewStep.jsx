import React from 'react';
    import { motion } from 'framer-motion';
    import CVPreviewContent from '@/components/cv-preview/CVPreviewContent';
    import CVDownloadButton from '@/components/cv-preview/CVDownloadButton';

    const PreviewStep = ({ cvData, cvPreviewRef, downloadPDF, isDownloading }) => {
      return (
        <motion.div 
          initial={{ opacity: 0, y:5 }}
          animate={{ opacity: 1, y:0 }}
          transition={{ duration: 0.3 }}
          className="space-y-3 p-1.5 max-h-[calc(100vh-420px)] sm:max-h-[calc(100vh-380px)] md:max-h-[calc(100vh-280px)] lg:max-h-[calc(100vh-240px)] xl:max-h-[calc(100vh-200px)] flex flex-col w-full"
        >
          <CVPreviewContent cvData={cvData} cvPreviewRef={cvPreviewRef} />
          <CVDownloadButton 
            downloadPDF={downloadPDF} 
            cvPreviewRef={cvPreviewRef}
            isDownloading={isDownloading}
          />
        </motion.div>
      );
    };

    export default PreviewStep;