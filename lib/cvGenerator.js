import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CVGenerator = {
  downloadCVAsPDF: async (element, filename = 'cv') => {
    if (!element) {
      console.error("Elemento de vista previa no encontrado para generar PDF.");
      throw new Error("Elemento de vista previa no disponible.");
    }

    const originalWidth = element.offsetWidth;
    const originalHeight = element.offsetHeight;

    // Escalar el contenido para mejorar la calidad del PDF
    const scale = 2; 
    const scaledWidth = originalWidth * scale;
    const scaledHeight = originalHeight * scale;

    const canvas = await html2canvas(element, {
      scale: scale,
      width: originalWidth,
      height: originalHeight,
      windowWidth: scaledWidth,
      windowHeight: scaledHeight,
      useCORS: true,
      logging: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${filename}.pdf`);
  },
};

export default CVGenerator;