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
      useCORS: true,
      logging: true,
      // Las siguientes opciones pueden ayudar a asegurar que todo el contenido sea capturado
      // y que el scroll se maneje correctamente si el elemento es más grande que la ventana.
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight,
      scrollX: 0,
      scrollY: -window.scrollY, // Asegura que la captura comienza desde la parte superior de la página visible
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0); // Usar JPEG con alta calidad para reducir tamaño y mejorar renderizado
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    let heightLeft = imgHeight;
    let position = 0;

    // Calcular la relación de aspecto para ajustar la imagen al ancho del PDF
    const ratio = pdfWidth / imgWidth;
    const imgScaledHeight = imgHeight * ratio;

    let pageHeight = pdf.internal.pageSize.getHeight();
    let currentPage = 0;

    while (position < imgScaledHeight) {
      if (currentPage > 0) {
        pdf.addPage();
      }
      pdf.addImage(imgData, 'JPEG', 0, -position, pdfWidth, imgScaledHeight);
      position += pageHeight;
      currentPage++;
    }

    pdf.save(`${filename}.pdf`);
  },
};

export default CVGenerator;