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

      // Clonar el elemento para evitar modificar el DOM visible
      const clonedElement = element.cloneNode(true);
      clonedElement.style.width = `${element.offsetWidth}px`;
      clonedElement.style.height = 'auto';
      clonedElement.style.position = 'absolute';
      clonedElement.style.top = '-9999px'; // Mover fuera de la vista
      clonedElement.style.left = '-9999px'; // Mover fuera de la vista
      clonedElement.style.zIndex = '-1'; // Asegurar que no interfiera con la UI
      clonedElement.style.visibility = 'hidden'; // Ocultar visualmente pero mantener en el flujo de renderizado
      document.body.appendChild(clonedElement);

      // Pequeño retraso para asegurar que el DOM esté listo para html2canvas
      await new Promise(resolve => setTimeout(resolve, 50));

      const canvas = await html2canvas(clonedElement, {
        scale: 3, // Aumentar la escala para una mejor calidad
        useCORS: true,
        logging: false,
        windowWidth: element.offsetWidth,
        windowHeight: element.offsetHeight,
        scrollX: 0,
        scrollY: 0,
      });

      document.body.removeChild(clonedElement);

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      addPageIfNeeded(imgHeight);
      pdf.addImage(imgData, 'JPEG', margin, yPosition, pdfWidth, imgHeight);
      yPosition += imgHeight;
    };

    // Capturar y añadir el encabezado
    await captureAndAddElement(cvPreviewRef.current.getHeaderElement());

    // Capturar y añadir cada sección del cuerpo principal
    const sectionElements = cvPreviewRef.current.getSectionElements();
    for (const section of sectionElements) {
      await captureAndAddElement(section);
    }

    // Capturar y añadir el pie de página
    await captureAndAddElement(cvPreviewRef.current.getFooterElement());

    pdf.save(`${filename}.pdf`);
  },
};

export default CVGenerator;