import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import CVPreviewContent from '../../components/cv-preview/CVPreviewContent';
import CVDownloadButton from '../../components/cv-preview/CVDownloadButton';

const PreviewStep = ({ cvData, downloadPDF, isDownloading }) => {
  const localCvPreviewRef = useRef(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col items-center justify-center p-4"
    >
      <h2 className="text-2xl font-bold text-slate-800 dark:text-gray-100 mb-6">Previsualización de tu CV</h2>
      <div ref={localCvPreviewRef} className="w-full max-w-a4 mx-auto shadow-lg rounded-lg overflow-hidden bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        <CVPreviewContent cvData={cvData} />
      </div>
      <div className="mt-8">
        <CVDownloadButton
          onDownload={() => downloadPDF(localCvPreviewRef.current)}
          isDownloading={isDownloading}
        />
      </div>
    </motion.div>
  );
};

export default PreviewStep;