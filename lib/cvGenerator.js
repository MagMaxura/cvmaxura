import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CVGenerator = {
  downloadCVAsPDF: async (cvPreviewRef, filename = 'cv') => {
    if (!cvPreviewRef || !cvPreviewRef.current) {
      console.error("Referencia del componente de vista previa no encontrada para generar PDF.");
      throw new Error("Elemento de vista previa no disponible.");
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const margin = 10; // Márgenes en mm
    const pdfWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
    const pdfHeight = pdf.internal.pageSize.getHeight() - 2 * margin;

    let yPosition = margin; // Posición Y actual en la página del PDF

    const addPageIfNeeded = (elementHeight) => {
      if (yPosition + elementHeight > pdfHeight) {
        pdf.addPage();
        yPosition = margin; // Reiniciar posición Y para la nueva página
      }
    };

    const captureAndAddElement = async (element) => {
      if (!element) return;

      const canvas = await html2canvas(element, { // Capturar directamente el elemento
        scale: 3, // Aumentar la escala para una mejor calidad
        useCORS: true,
        logging: false,
        windowWidth: element.offsetWidth,
        windowHeight: element.offsetHeight,
        scrollX: 0,
        scrollY: 0,
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      addPageIfNeeded(imgHeight);
      pdf.addImage(imgData, 'JPEG', margin, yPosition, pdfWidth, imgHeight);
      yPosition += imgHeight;
    };

    // Capturar el contenido completo del CV
    const contentElement = cvPreviewRef.current.getContentToDownloadElement();
    if (!contentElement) {
      console.error("Elemento de contenido para descargar no encontrado.");
      throw new Error("Elemento de contenido no disponible.");
    }

    const canvas = await html2canvas(contentElement, {
      scale: 3, // Aumentar la escala para una mejor calidad
      useCORS: true,
      logging: false,
      windowWidth: contentElement.offsetWidth,
      windowHeight: contentElement.offsetHeight,
      scrollX: 0,
      scrollY: 0,
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let currentPage = 1;
    let remainingHeight = imgHeight;
    let currentY = margin;

    while (remainingHeight > 0) {
      if (currentPage > 1) {
        pdf.addPage();
        currentY = margin;
      }

      const pageHeight = pdfHeight;
      const clipHeight = Math.min(remainingHeight, pageHeight);

      pdf.addImage(
        imgData,
        'JPEG',
        margin,
        currentY,
        pdfWidth,
        imgHeight,
        null,
        'NONE',
        0,
        0,
        pdfWidth,
        clipHeight
      );

      remainingHeight -= clipHeight;
      currentPage++;
    }

    pdf.save(`${filename}.pdf`);
  },
};

export default CVGenerator;