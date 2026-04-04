import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF with autotable for TypeScript
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generateTransactionHistoryPDF = (transactions: any[]) => {
  const doc = new jsPDF();

  // Branding
  doc.setFontSize(22);
  doc.setTextColor(0, 82, 255); // #0052FF
  doc.text('Vertex', 14, 22);
  
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text('Transaction History Report', 14, 30);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 38);

  const tableColumn = ["Date", "Type", "Amount", "Status", "Transaction ID"];
  const tableRows: any[] = [];

  transactions.forEach(tx => {
    const txData = [
      tx.date,
      tx.type,
      tx.amount,
      tx.status,
      tx.id
    ];
    tableRows.push(txData);
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 45,
    theme: 'grid',
    headStyles: { fillColor: [0, 82, 255] },
    alternateRowStyles: { fillColor: [240, 245, 255] },
  });

  doc.save('transaction-history.pdf');
};

export const generatePremiumBreakdownPDF = (details: {
  city: string;
  platform: string;
  basePremium: number;
  riskAdjustment: number;
  bonus: number;
  total: number;
  riskLevel: string;
  weather: string;
}) => {
  const doc = new jsPDF();

  // Branding
  doc.setFontSize(22);
  doc.setTextColor(0, 82, 255);
  doc.text('Vertex', 14, 22);
  
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('Premium Breakdown Analysis', 14, 32);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`City: ${details.city}`, 14, 42);
  doc.text(`Platform: ${details.platform}`, 14, 48);
  doc.text(`Risk Level: ${details.riskLevel}`, 14, 54);
  doc.text(`Current Weather: ${details.weather}`, 14, 60);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 66);

  const tableColumn = ["Item", "Amount"];
  const tableRows = [
    ["Base Premium", `INR ${details.basePremium.toFixed(2)}`],
    ["Risk Adjustment", `+ INR ${details.riskAdjustment.toFixed(2)}`],
    ["Platform Bonus", `- INR ${details.bonus.toFixed(2)}`],
    [{ content: "Total Weekly Premium", styles: { fontStyle: 'bold' } }, { content: `INR ${details.total.toFixed(2)}`, styles: { fontStyle: 'bold' } }]
  ];

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 75,
    theme: 'plain',
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 40, halign: 'right' }
    }
  });

  doc.save('premium-breakdown.pdf');
};
