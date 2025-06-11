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

    const totalPages = Math.ceil(imgHeight / pdfHeight);
    let yOffset = 0; // Desplazamiento vertical dentro de la imagen original

    for (let i = 0; i < totalPages; i++) {
      if (i > 0) {
        pdf.addPage();
      }
      // La posición Y en la página del PDF para la imagen.
      // Comienza en `margin` para la primera página.
      // Para las páginas subsiguientes, se vuelve negativa para "desplazar" la imagen hacia arriba.
      const yPosOnPage = margin - yOffset;

      // Dibujar la imagen completa, pero su posición en la página hará que solo una porción sea visible.
      pdf.addImage(imgData, 'JPEG', margin, yPosOnPage, pdfWidth, imgHeight);

      yOffset += pdfHeight; // Mover a la siguiente sección de la imagen para la próxima página.
    }

    pdf.save(`${filename}.pdf`);
  },
};

export default CVGenerator;