const ExcelJS = require('exceljs');
const Interviews = require('../models/interviewModel');

const validateFields = (body, requiredFields) => {
    for (const field of requiredFields) {
        if (!body[field]) {
            return field;
        }
    }
    return null;
};

const createInterview = async (req, res, next) => {
    try {
        const requiredFields = [
            'date', 'cc', 'names', 'cellphone', 'test', 'review', 'techLead', 'interview', 'observations',
        ];
        const missingField = validateFields(req.body, requiredFields);
        if (missingField) {
            res.status(400);
            return next(new Error(`${missingField} es requerido`));
        }

        const existingInterview = await Interviews.findOne({ cc: req.body.cc });
        if (existingInterview) {
            res.status(400).json({ message: 'Lo sentimos, solo puedes programar esta entrevista una sola vez' })
        }

        const dataInterview = await Interviews.create(req.body);
        res.status(200).json({
            success: true,
            dataInterview
        });

    } catch (error) {
        console.log(error);
        return next(error);
    }
};

const getAll = async (req, res, next) => {
    try {
        const tests = await Interviews.find().sort({ date: -1 });

        if (!tests || tests.length === 0) {
            res.status(404).json({ message: 'No se encontraron tests.' });
            return; // Termina la ejecución de la función después de enviar la respuesta
        }
        // Enviar los tests encontrados como respuesta
        res.status(200).json({
            tests: tests
        });
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

// const getAll = async (req, res, next) => {
//     try {
//         const dataRetests = await Retests.find().sort({ date: -1 });

//         if (!dataRetests || dataRetests.length === 0) {
//             return res.status(400).json({ message: 'No se encontraron post-tests.' });
//         }

//         res.status(200).json({
//             retests: dataRetests
//         });
//     } catch (error) {
//         console.log(error);
//         return next(error);
//     }
// }

const getAllInterviews = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1; // Página solicitada (por defecto 1)
        const limit = parseInt(req.query.limit) || 10; // Cantidad de resultados por página (por defecto 10)

        const skip = (page - 1) * limit; // Calcular cuántos documentos saltar

        const count = await Interviews.countDocuments(); // Obtener el número total de documentos

        const dataInterviews = await Interviews.find()
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);
        if (!dataInterviews || dataInterviews.length === 0) {
            return res.status(400).json({ message: 'No se encontraron entrevistas.' });
        }

        const totalPages = Math.ceil(count); // Calcular el número total de páginas
        res.status(200).json({
            interviews: dataInterviews,
            totalPages,
            currentPage: page
        });
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

const getInterviewByCC = async (req, res, next) => {
    try {
        const cc = req.params.cc;
        const interview = await Interviews.findOne({ cc });
        if (!interview) {
            return res.status(404).json({ message: 'No se encontró la entrevista' });
        }
        res.status(200).send(interview)
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

const updateInterview = async (req, res, next) => {
    try {

        const { cc } = req.params
        const requiredFields = ['date', 'cc', 'names', 'cellphone', 'test', 'review', 'techLead', 'interview', 'observations'];
        const missingField = validateFields(req.body, requiredFields);
        if (missingField) {
            res.status(400);
            return next(new Error(`${missingField} es requerido`));
        }

        let existingInterview = await Interviews.findOne({ cc });
        existingInterview.set(req.body);
        existingInterview = await existingInterview.save();

        res.status(200).json({
            success: true,
            existingInterview
        });

    } catch (error) {
        console.error(error);
        return next(error);
    }
}

const exportToExcel = async (req, res, next) => {
    try {
        const dataRetest = await Interviews.find().sort({ date: -1 });
        if (!dataRetest || dataRetest.length === 0) {
            return res.status(400).json({ message: 'No se encontraron post-tests.' });
        }
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Post-Tests');
        worksheet.addRow([
            'Fecha',
            'Documento',
            'Nombres',
            'Test',
            'Revisor',
            'Lider Técnico',
            'Psicológo/a',
            'Observaciones',
        ]);
        dataRetest.forEach(retest => {
            worksheet.addRow([
                retest.date,
                retest.cc,
                retest.names,
                retest.test,
                retest.review,
                retest.techLead,
                retest.interview,
                retest.observations,
            ]);
        });
        const buffer = await workbook.xlsx.writeBuffer();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=post-tests.xlsx');
        res.status(200).send(buffer);
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

const conclude = async (req, res, next) => {
    try {
        const {cc} = req.params;

        let existingInterview = await Interviews.findOne({ cc });
        if(!existingInterview) {
            return res.status(404).json({message: 'Entrevista no encontrada'});
        }

        existingInterview.status = 'Concluido';
        existingInterview.set(req.body);
        await existingInterview.save();

        res.status(200).json({
            success: true,
            message: 'Entrevista concluída',
            existingInterview
        })
    } catch (error) {
        return next(error);
        
    }
}



module.exports = { createInterview, getAllInterviews, getInterviewByCC, updateInterview, exportToExcel, getAll, conclude }