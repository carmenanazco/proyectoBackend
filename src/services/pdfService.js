import PDFDocument from "pdfkit";
import fs from "fs";
import QRCode from "qrcode";
import path from "path";

class PdfService {
    async generateReceipt(ticket) {
        const receiptsDir = path.join(__dirname, "../public/receipts");
        if (!fs.existsSync(receiptsDir)) {
            fs.mkdirSync(receiptsDir, { recursive: true });
        }
        const filePath = path.join(receiptsDir, `receipt_${ticket._id}.pdf`);
        const doc = new PDFDocument();

        // Crear stream para escribir el archivo
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Encabezado del recibo
        doc.fontSize(18).text("Recibo de Compra", { align: "center" });
        doc.moveDown();
        doc.fontSize(12).text(`Pedido ID: ${ticket._id}`);
        doc.text(`Cliente: ${ticket.purchaser}`);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`);
        doc.moveDown();

        // Tabla de productos
        doc.fontSize(14).text("Detalles del pedido:");
        doc.moveDown();
        ticket.items.forEach(item => {
        doc.fontSize(12).text(`${item.title} - ${item.quantity} x $${item.price}`);
        });
        doc.moveDown();
        doc.fontSize(14).text(`Total: $${ticket.items.reduce((sum, item) => sum + item.price * item.quantity, 0)}`);
        doc.moveDown();

        // Generar el código QR con la URL del pedido
        const orderUrl = `https://tu-ecommerce.com/ticket/${ticket._id}`;
        const qrImage = await QRCode.toDataURL(orderUrl);

        doc.fontSize(14).text("Verifica tu pedido escaneando este QR:");
        doc.image(qrImage, { fit: [150, 150], align: "center" });
        doc.end();

        return `/receipts/receipt_${ticket._id}.pdf`; // Retorna la URL relativa del recibo
    }

}

export default new PdfService();