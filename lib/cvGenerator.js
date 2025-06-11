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

    const scale = 3; // Aumentar la escala para una mejor calidad
    const margin = 10; // Márgenes en mm
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth() - 2 * margin; // Ancho del PDF con márgenes
    const pdfHeight = pdf.internal.pageSize.getHeight() - 2 * margin; // Alto del PDF con márgenes

    // Clonar el elemento para aplicar estilos de impresión si es necesario
    const printElement = element.cloneNode(true);
    printElement.style.width = `${originalWidth}px`; // Asegurar el ancho original
    printElement.style.height = 'auto'; // Permitir que la altura se ajuste
    printElement.style.position = 'absolute';
    printElement.style.top = '-9999px'; // Mover fuera de la vista
    document.body.appendChild(printElement);

    const canvas = await html2canvas(printElement, {
      scale: scale,
      useCORS: true,
      logging: false,
      windowWidth: originalWidth,
      windowHeight: originalHeight,
      scrollX: 0,
      scrollY: 0,
    });

    document.body.removeChild(printElement); // Eliminar el elemento clonado

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = margin; // Posición inicial con margen superior

    while (heightLeft > 0) {
      pdf.addImage(imgData, 'JPEG', margin, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
      position -= pdfHeight;
      if (heightLeft > 0) {
        pdf.addPage();
        position = margin; // Reiniciar posición con margen superior para la nueva página
      }
    }

    pdf.save(`${filename}.pdf`);
  },
};

export default CVGenerator;