const Enlistments = require('../models/enlistmentModel');
const Tests = require('../models/testsModel')

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
        const requiredFields = [
            'names', 'cc', 'test', 'finalReport'
        ];
        const missingField = validateFields(req.body, requiredFields);
        if (missingField) {
            res.status(400);
            return next(new Error(`${missingField} es requerido`));
        }

        const existingEnlistment = await Enlistments.findOne({ cc: req.body.cc });
        if (existingEnlistment) {
            res.status(400).json({ message: 'Lo sentimos, solo puedes realizar un Reporte Final una sola vez' })
        }

        const dataEnlistment = await Enlistments.create(req.body);

        const testToUpdate = await Tests.findOne({ cc: req.body.cc });
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

const getAllEnlistment = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1; // Página solicitada (por defecto 1)
        const limit = parseInt(req.query.limit) || 10; // Cantidad de resultados por página (por defecto 10)

        const skip = (page - 1) * limit; // Calcular cuántos documentos saltar

        const count = await Enlistments.countDocuments(); // Obtener el número total de documentos

        const dataEnlistment = await Enlistments.find()
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);
        if (!dataEnlistment || dataEnlistment.length === 0) {
            return res.status(400).json({ message: 'No se encontraron informes finales.' });
        }

        const totalPages = Math.ceil(count); // Calcular el número total de páginas
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

module.exports = { createEnlistment, getAllEnlistment, getEnlistmentByCC }