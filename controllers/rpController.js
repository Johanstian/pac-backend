const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Pdf = require('../models/pdfModel');

const validateFields = (data, requiredFields) => {
    for (const field of requiredFields) {
      if (!data[field]) {
        return field;
      }
    }
    return null;
  };

const createPDF = async (req, res, next) => {
    try {

      const requiredFields = ['name', 'age', 'address'];
      const missingField = validateFields(req.body, requiredFields);
      if (missingField) {
        return res.status(400).json({ error: `${missingField} es requerido` });
      }
  

      const { name, age, address } = req.body;
  
      const pdfData = new Pdf({
        name,
        age,
        address
      });
  
      await pdfData.save(); // Save the data to MongoDB
  
      // Create the PDF document
      const doc = new PDFDocument();
  
      // Pipe output to a file
      const pdfPath = path.join(__dirname, 'output.pdf');
      doc.pipe(fs.createWriteStream(pdfPath));
  
      // Add content to the PDF
      doc.fontSize(20).text('Personal Information', { align: 'center' });
      doc.fontSize(16).text(`Name: ${name}`);
      doc.fontSize(16).text(`Age: ${age}`);
      doc.fontSize(16).text(`Address: ${address}`);
  
      // Finalize the PDF file
      doc.end();
  
      // Send the file for download after finishing the PDF generation
      doc.on('finish', () => {
        res.download(pdfPath, 'output.pdf', (err) => {
          if (err) {
            console.error('Error downloading file', err);
            return res.status(500).json({ error: 'Error downloading file' });
          } else {
            console.log('File downloaded successfully');
          }
        });
      });
  
    } catch (error) {
      console.error(error);
      return next(error); // Pass error to Express error handler
    }
  };
  
  module.exports = { createPDF };