import React from 'react';
    import { motion, AnimatePresence } from 'framer-motion';

    const StepRenderer = ({ 
      currentStepIndex, 
      CurrentStepComponent, 
      cvStoreData, 
      onStepComplete, 
      cvPreviewRef, 
      downloadPDF,
      isDownloading
    }) => {
      const { cvData, updateCVData, updateCVField, addListItem, updateListItem, removeListItem } = cvStoreData;

      return (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, x: currentStepIndex > 0 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: currentStepIndex > 0 ? -50 : 50 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 100, damping: 20 }}
            className="w-full"
          >
            {CurrentStepComponent && (
              <CurrentStepComponent
                cvData={cvData}
                updateCVData={updateCVData}
                handleChange={updateCVField} 
                addListItem={addListItem}
                updateListItem={updateListItem}
                removeListItem={removeListItem}
                onStepComplete={onStepComplete}
                cvPreviewRef={cvPreviewRef}
                downloadPDF={downloadPDF}
                isDownloading={isDownloading}
              />
            )}
          </motion.div>
        </AnimatePresence>
      );
    };

    export default StepRenderer;