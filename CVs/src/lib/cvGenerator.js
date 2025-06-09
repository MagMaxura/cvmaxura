import html2canvas from 'html2canvas';
    import jsPDF from 'jspdf';

    const CVGenerator = {
      downloadCVAsPDF: async (previewElement, fileName = 'CV_EmploySmartIA') => {
        if (!previewElement) {
          throw new Error("No se pudo encontrar el contenido del CV para descargar.");
        }

        let cvContentElement;
        let originalMinHeight = '';
        let scrollContainer;
        let originalScrollContainerOverflow = '';

        try {
          cvContentElement = previewElement.querySelector('.min-h-\\[297mm_scaled_to_fit\\]');
          scrollContainer = document.getElementById('cv-preview-scroll-container');

          if (cvContentElement) {
            originalMinHeight = cvContentElement.style.minHeight;
            cvContentElement.style.minHeight = 'auto'; 
          }
          if (scrollContainer) {
            originalScrollContainerOverflow = scrollContainer.style.overflowY;
            scrollContainer.style.overflowY = 'visible';
            scrollContainer.scrollTop = 0;
          }
      
          await new Promise(resolve => setTimeout(resolve, 500)); 
          
          const canvas = await html2canvas(previewElement, {
            scale: 2.5, 
            useCORS: true, 
            logging: false, 
            backgroundColor: '#ffffff',
            scrollX: 0,
            scrollY: 0, 
            windowWidth: previewElement.scrollWidth,
            windowHeight: previewElement.scrollHeight,
            x: 0,
            y: 0,
            width: previewElement.offsetWidth,
            height: previewElement.offsetHeight,
          });
          
          if (cvContentElement) {
            cvContentElement.style.minHeight = originalMinHeight;
          }
          if (scrollContainer) {
            scrollContainer.style.overflowY = originalScrollContainerOverflow;
          }
      
          const imgData = canvas.toDataURL('image/png', 1.0); 
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            putOnlyUsedFonts: true,
            floatPrecision: 'smart', 
          });
      
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          
          const imgProps = pdf.getImageProperties(imgData);
          const imgWidth = imgProps.width;
          const imgHeight = imgProps.height;
          
          const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
          
          const imgX = (pdfWidth - imgWidth * ratio) / 2; 
          const imgY = 0; 
      
          pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio, undefined, 'FAST');
          pdf.save(`${fileName}.pdf`);
        } catch (error) {
          if (cvContentElement) {
            cvContentElement.style.minHeight = originalMinHeight;
          }
          if (scrollContainer) {
            scrollContainer.style.overflowY = originalScrollContainerOverflow;
          }
          throw error; 
        }
      }
    };

    export default CVGenerator;