const Enlistments = require('../models/enlistmentModel');
const Interviews = require('../models/interviewModel');
const PDFDocument = require('pdfkit');
const pdf = require('html-pdf');

const validateFields = (body, requiredFields) => {
    for (const field of requiredFields) {
        if (!body[field]) {
            return field;
        }
    }
    return null;
};

const createEnlistment = async (req, res, next) => {
    try {
        const requiredFields = ['names', 'cc', 'test', 'workExperience', 'sanity', 'aptitudes', 'nonVerbal', 'finalReport'];
        const missingField = validateFields(req.body, requiredFields);
        if (missingField) {
            res.status(400);
            return next(new Error(`${missingField} es requerido`));
        }

        const existingEnlistment = await Enlistments.findOne({ cc: req.body.cc });
        if (existingEnlistment) {
            return res.status(400).json({ message: 'Lo sentimos, solo puedes realizar un Reporte Final una sola vez' })
        }

        const dataEnlistment = await Enlistments.create(req.body);

        const testToUpdate = await Interviews.findOne({ cc: req.body.cc });
        if (testToUpdate) {
            testToUpdate.status = 'Concluido';
            await testToUpdate.save();
        }

        res.status(200).json({
            success: true,
            dataEnlistment
        });

    } catch (error) {
        console.log(error);
        return next(error);
    }
};

const updateEnlistment = async (req, res, next) => {
    try {
        const { cc, technical } = req.body;

        // Verificar si el enlistment existe
        const existingEnlistment = await Enlistments.findOne({ cc });
        if (!existingEnlistment) {
            return res.status(404).json({ message: 'El enlistment no fue encontrado' });
        }

        // Actualizar el campo 'technical' solo si se proporciona en la solicitud
        if (technical !== undefined) {
            existingEnlistment.technical = technical;
        }

        // Guardar los cambios
        await existingEnlistment.save();

        res.status(200).json({
            success: true,
            message: 'Enlistment actualizado exitosamente',
            data: existingEnlistment
        });

    } catch (error) {
        console.log(error);
        return next(error);
    }
};





const getAllEnlistment = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const count = await Enlistments.countDocuments();

        const dataEnlistment = await Enlistments.find()
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);
        if (!dataEnlistment || dataEnlistment.length === 0) {
            return res.status(400).json({ message: 'No se encontraron informes finales.' });
        }

        const totalPages = Math.ceil(count); // Calcular el número 
        res.status(200).json({
            enlistment: dataEnlistment,
            totalPages,
            currentPage: page
        });
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

const getEnlistmentByCC = async (req, res, next) => {
    try {
        const cc = req.params.cc;
        const enlistment = await Enlistments.findOne({ cc });
        if (!enlistment) {
            return res.status(404).json({ message: 'No se encontró el informe final' });
        }
        res.status(200).send(enlistment)
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

// const getEnlistmentInfoAndDownloadPDF = async (req, res, next) => {
//     try {
//         const { cc } = req.params;
//         const enlistment = await Enlistments.findOne({ cc });

//         if (!enlistment) {
//             return res.status(404).json({ message: 'El enlistment no fue encontrado' });
//         }
//         const doc = new PDFDocument();

//         doc.text(`Names: ${enlistment.names}`);
//         doc.text(`CC: ${enlistment.cc}`);
//         doc.text(`Test: ${enlistment.test}`);

//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader('Content-Disposition', `attachment; filename=enlistment_${cc}.pdf`);

//         doc.pipe(res);
//         doc.end();

//     } catch (error) {
//         console.log(error);
//         return next(error);
//     }
// };

const getEnlistmentInfoAndDownloadPDF = async (req, res, next) => {
    try {
        const { cc } = req.params;
        const enlistment = await Enlistments.findOne({ cc });

        if (!enlistment) {
            return res.status(404).json({ message: 'El enlistment no fue encontrado' });
        }

        const styles = `
            .center {
                display: flex;
                justify-content: center;
            }
            .container {
                font-family: Arial, sans-serif;
                margin: 20px;
            }
            .header {
                text-align: center;
                font-size: 24px;
                margin-bottom: 20px;
            }
            .info {
                margin-bottom: 10px;
            }
            .m-l-5 {
                margin-left: 5px;
            }
            /* Agregar más estilos según sea necesario */
        `;

        // Plantilla HTML para el PDF
        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Enlistment Report</title>
                <style>
                    ${styles} /* Agregamos los estilos definidos arriba */
                </style>
            </head>
            <body>
            <div class="container">
                
                
                    <div class="header">
                        <h4><strong>ANÁLISIS DE RESULTADOS</strong></h4>
                    </div><br>
                    <div class="info"><strong>Names:</strong> ${enlistment.names}</div>
                    <div class="info"><strong>CC:</strong> ${enlistment.cc}</div>
                    <div class="info"><strong>Test:</strong> ${enlistment.test}</div>
                    <div class="info"><strong>Experiencia laboral:</strong> ${enlistment.workExperience}</div>
                    <div class="info"><strong>Sensatez (Personal y Laboral):</strong> ${enlistment.sanity}</div>
                    <div class="info"><strong>Aptitudes:</strong> ${enlistment.aptitudes}</div>
                    <div class="info"><strong>Comunicación no Verbal:</strong> ${enlistment.nonVerbal}</div>
                    <div class="info"><strong>Informe Final:</strong> ${enlistment.finalReport}</div>
                    <div class="info"><strong>Informe Técnico:</strong> ${enlistment.technical}</div>
                </div>
            </body>
            </html>
        `;

        const options = {
            format: 'Letter',
            orientation: 'portrait'
        };

        const pdfName = `enlistment_${cc}_${enlistment.names.replace(/\s/g, '_')}.pdf`; // Nombre del PDF

        pdf.create(html, options).toStream((err, stream) => {
            if (err) {
                console.log(err);
                return next(err);
            }
        
            // Configurar los encabezados para la descarga del PDF
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${pdfName}`);
        
            stream.pipe(res);
        });

    } catch (error) {
        console.log(error);
        return next(error);
    }
};

module.exports = { createEnlistment, updateEnlistment, getAllEnlistment, getEnlistmentByCC, getEnlistmentInfoAndDownloadPDF }