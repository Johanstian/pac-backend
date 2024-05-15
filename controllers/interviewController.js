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

        // const testToUpdate = await Tests.findOne({ cc: req.body.cc });
        // if (testToUpdate) {
        //     testToUpdate.status = 'Concluido';
        //     await testToUpdate.save();
        // }

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

// const getAllInterviews = async (req, res, next) => {
//     try {
//         const dataInterviews = await Interviews.find();
//         if (!dataInterviews || !dataInterviews.length === 0) {
//             // res.status(404);
//             res.status(400).json({ message: 'No se encontraron entrevistas.' })
//             // return next(new Error('General data not found for the provider cc'));
//         }
//         res.status(200).send(dataInterviews)
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


module.exports = { createInterview, getAllInterviews, getInterviewByCC }