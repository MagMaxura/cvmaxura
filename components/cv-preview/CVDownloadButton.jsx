import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Download, Loader2 } from 'lucide-react';

    const CVDownloadButton = ({ downloadPDF, cvPreviewRef, isDownloading }) => {
      console.log("CVDownloadButton - cvPreviewRef:", cvPreviewRef);
      console.log("CVDownloadButton - cvPreviewRef.current:", cvPreviewRef?.current);
      const isButtonDisabled = !cvPreviewRef || !cvPreviewRef.current || isDownloading;

      return (
        <Button 
          onClick={downloadPDF} 
          className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-base h-11 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center justify-center"
          disabled={isButtonDisabled}
        >
          {isDownloading ? (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <Download className="h-5 w-5 mr-2" />
          )}
          {isDownloading ? 'Descargando...' : 'Descargar CV en PDF'}
        </Button>
      );
    };

    export default CVDownloadButton;