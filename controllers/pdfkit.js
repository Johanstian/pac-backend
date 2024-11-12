// const PDFDocument = require('pdfkit');

// const generatePDF = async (req, res, next) => {
//     try {
//         const doc = new PDFDocument();
//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
//         doc.pipe(res);
//         doc.fontSize(30).text('Hello Worldsss');
//         doc.end();
//     } catch (error) {
//         return next(error);
//     }
// }

// module.exports = { generatePDF };


const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const generatePDF = async (req, res, next) => {
    try {
        const { name, age, address } = req.body;

        // Load an existing PDF from the filesystem (or a template)
        const pdfPath = path.resolve(__dirname, '../templates/invoice_template.pdf');
        const existingPdfBytes = fs.readFileSync(pdfPath);

        // Load the existing PDF into a PDFDocument
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        // Get the first page of the document
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        // Add text fields (e.g., name, age, and address)
        firstPage.drawText(`Name: ${name}`, {
            x: 50,
            y: 700,
            size: 12,
            color: rgb(0, 0, 0),
        });
        firstPage.drawText(`Age: ${age}`, {
            x: 50,
            y: 680,
            size: 12,
            color: rgb(0, 0, 0),
        });
        firstPage.drawText(`Address: ${address}`, {
            x: 50,
            y: 660,
            size: 12,
            color: rgb(0, 0, 0),
        });

        // Serialize the PDFDocument to bytes
        const pdfBytes = await pdfDoc.save();

        // Set response headers to download the modified PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=modified_invoice.pdf');

        // Send the PDF as the response
        res.end(pdfBytes);
    } catch (error) {
        next(error);
    }
};

module.exports = { generatePDF };