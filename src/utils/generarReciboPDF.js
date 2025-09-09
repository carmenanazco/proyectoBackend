// utils/generarReciboPDF.js
import PDFDocument from 'pdfkit';
import streamBuffers from 'stream-buffers'; // Para guardar en memoria (sin archivo físico)

export async function generarReciboPDF({ user, productos, total }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = new streamBuffers.WritableStreamBuffer();

    doc.pipe(stream);

    doc.fontSize(20).text('🧾 Recibo de compra', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Cliente: ${user.first_name} (${user.email})`);
    doc.text(`Fecha: ${new Date().toLocaleString()}`);
    doc.moveDown();

    doc.fontSize(12).text('Detalle de productos:');
    productos.forEach(item => {
      doc.text(`• ${item.quantity} x ${item.product.title} - $${item.subtotal.toFixed(2)}`);
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total: $${total.toFixed(2)}`, { align: 'right' });

    doc.end();

    stream.on('finish', () => {
      const buffer = stream.getBuffer();
      resolve(buffer);
    });

    stream.on('error', reject);
  });
}
