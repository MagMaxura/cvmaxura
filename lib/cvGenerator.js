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

    const scale = 2; // Escalar para mejorar la calidad del PDF

    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      logging: false,
      windowWidth: originalWidth,
      windowHeight: originalHeight,
      scrollX: 0,
      scrollY: 0,
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    while (heightLeft > 0) {
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
      position -= pdfHeight;
      if (heightLeft > 0) {
        pdf.addPage();
      }
    }

    pdf.save(`${filename}.pdf`);
  },
};

export default CVGenerator;