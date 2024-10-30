import React from 'react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";

const PDFDownloadButton = ({ invoiceData }) => {
  const generatePDF = async () => {
    const input = document.getElementById('invoice-content');
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
    pdf.save(`invoice_${invoiceData.invoiceNo}.pdf`);
  };

  return (
    <button
      onClick={generatePDF}
      className="bg-white text-indigo-500 px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-indigo-100 transition duration-300"
    >
      <Download size={18} />
      <span>Download PDF</span>
    </button>
  );
};

export default PDFDownloadButton;




