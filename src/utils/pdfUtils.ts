import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";

export interface TransaccionesPdf {
  fecha: Timestamp; // Cambiado a Timestamp
  motivo: string;
  montoTotal: number;
  montoPagado: number;
  tipo: string;
}

export const generarPDF = (transacciones: TransaccionesPdf[], nombreCliente: String, balance: number): jsPDF => {
  const doc = new jsPDF();

  // Título del documento
  doc.text("Reporte de Transacciones", 14, 22);
  doc.text("Cliente: "+nombreCliente, 14, 32);
  doc.text("Balance: "+balance, 14, 42);

  // Crear una tabla con los datos de las transacciones
  const tableColumn = ["Fecha", "Motivo", "MontoTotal", "MontoPagado", "Tipo"];
  const tableRows: string[][] = [];

  transacciones.forEach(transaccion => {
    // Convertir Timestamp a Date
    const fecha = transaccion.fecha.toDate();
    

    // Formatear la fecha
    const fechaFormateada = format(fecha, "dd/MM/yyyy HH:mm");

    const transaccionData = [
      fechaFormateada,
      transaccion.motivo,
      transaccion.montoTotal.toString(),
      transaccion.montoPagado.toString(),
      transaccion.tipo,
    ];
    tableRows.push(transaccionData);
  });

  // Añadir tabla al documento
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 50,
  });
  const currentDate = new Date();
  doc.save("reporte_" + currentDate.toISOString() + ".pdf");

  return doc;
};
