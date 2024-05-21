const Postpsicosocial = require('../models/postPsicosocialModel');
const puppeteer = require('puppeteer');
const retests = require('../models/retestsModel');

const validateFields = (body, requiredFields) => {
    for (const field of requiredFields) {
        if (!body[field]) {
            return field;
        }
    }
    return null;
};

const createPostPsicosocial = async (req, res, next) => {
    try {
        const requiredFields = ['names', 'cc', 'test', 'workExperience', 'sanity', 'aptitudes', 'nonVerbal', 'finalReport'];
        const missingField = validateFields(req.body, requiredFields);
        if (missingField) {
            res.status(400);
            return next(new Error(`${missingField} es requerido`));
        }

        const existingEnlistment = await Postpsicosocial.findOne({ cc: req.body.cc });
        if (existingEnlistment) {
            return res.status(400).json({ message: 'Lo sentimos, solo puedes realizar un Reporte Final una sola vez' })
        }

        const dataEnlistment = await Postpsicosocial.create(req.body);

        // const testToUpdate = await Tests.findOne({ cc: req.body.cc });
        // if (testToUpdate) {
        //     testToUpdate.status = 'Concluido';
        //     await testToUpdate.save();
        // }

        const testToUpdate = await retests.findOne({ cc: req.body.cc });
        if (testToUpdate) {
            if (testToUpdate.status === 'Pendiente') {
                testToUpdate.status = 'Concluido';
                await testToUpdate.save();
                console.log(`Test con cc: ${req.body.cc} actualizado a 'Concluido'`);
            } else {
                console.log(`Test con cc: ${req.body.cc} no estaba en estado 'Pendiente'`);
            }
        } else {
            console.log(`No se encontró un Test con cc: ${req.body.cc}`);
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

const updateCompetencias = async (req, res, next) => {
    try {
        const { cc, cCompetence, eCompetence, aydCompetence } = req.body;

        // Verificar si el 'cc' está presente en la solicitud
        if (!cc) {
            return res.status(400).json({ message: 'El campo cc es requerido' });
        }

        // Buscar el enlistment existente
        const existingEnlistment = await Postpsicosocial.findOne({ cc });
        if (!existingEnlistment) {
            return res.status(404).json({ message: 'El enlistment no fue encontrado' });
        }

        // Actualizar los campos solo si se proporcionan en la solicitud
        if (cCompetence !== undefined) {
            existingEnlistment.cCompetence = cCompetence;
        }
        if (eCompetence !== undefined) {
            existingEnlistment.eCompetence = eCompetence;
        }
        if (aydCompetence !== undefined) {
            existingEnlistment.aydCompetence = aydCompetence;
        }
        existingEnlistment.status = 'Concluido';
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



const updateEnlistment = async (req, res, next) => {
    try {
        const { cc, technical } = req.body;

        // Verificar si el enlistment existe
        const existingEnlistment = await Postpsicosocial.findOne({ cc });
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





const getAllPostpsicosocial = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const count = await Postpsicosocial.countDocuments();

        const dataEnlistment = await Postpsicosocial.find()
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);
        if (!dataEnlistment || dataEnlistment.length === 0) {
            return res.status(400).json({ message: 'No se encontraron informes finales.' });
        }

        const totalPages = Math.ceil(count);
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

const getPostpsicosocialByCC = async (req, res, next) => {
    try {
        const cc = req.params.cc;
        const enlistment = await Postpsicosocial.findOne({ cc });
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
        const enlistment = await Postpsicosocial.findOne({ cc });

        if (!enlistment) {
            return res.status(404).json({ message: 'El enlistment no fue encontrado' });
        }

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Enlistment Report</title>
                <style>
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

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(htmlContent);
        const pdfBuffer = await page.pdf({ format: 'A4' });

        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=enlistment_${cc}_${enlistment.names.replace(/\s/g, '_')}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error(error);
        return next(error);
    }
};

module.exports = { createPostPsicosocial, updateEnlistment, getAllPostpsicosocial, getPostpsicosocialByCC, getEnlistmentInfoAndDownloadPDF, updateCompetencias }