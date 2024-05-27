const ExcelJS = require('exceljs');
const Retests = require('../models/retestsModel');

const validateFields = (body, requiredFields) => {
    for (const field of requiredFields) {
        if (!body[field]) {
            return field;
        }
    }
    return null;
};

const recreateTest = async (req, res, next) => {
    try {
        const requiredFields = [
            'cc', 'names', 'academicTitle', 'complement', 'experienceWork',
            'cc1', 'cc2', 'cc3', 'cc4', 'cc5', 'cc6',
            'ce1', 'ce2', 'ce3', 'ce4', 'ce5', 'ce6', 'ce7',
            'tm1', 'tm2', 'tm3', 'tm4', 'tm5', 'tm6', 'tm7', 'tm8',
            'ayd1', 'ayd2', 'ayd3', 'ayd4',
            'type'
        ];
        const missingField = validateFields(req.body, requiredFields);
        if (missingField) {
            res.status(400);
            return next(new Error(`${missingField} es requerido`));
        }

        const existingTest = await Retests.findOne({ cc: req.body.cc });
        if (existingTest) {
            return res.status(400).json({message: 'Lo sentimos, solo puedes hacer este test una sola vez'})
        }

        const ccValues = [req.body.cc1, req.body.cc2, req.body.cc3, req.body.cc4, req.body.cc5, req.body.cc6];
        const averageCC = ccValues.reduce((total, current) => total + current, 0) / ccValues.length;
        const roundedAverageCC = parseFloat(averageCC.toFixed(2));
        req.body.averageCC = roundedAverageCC;

        const ceValues = [req.body.ce1, req.body.ce2, req.body.ce3, req.body.ce4, req.body.ce5, req.body.ce6, req.body.ce7];
        if (req.body.ce8 !== undefined && !isNaN(req.body.ce8)) {
            ceValues.push(req.body.ce8);
        }
        const averageCE = ceValues.reduce((total, current) => total + current, 0) / ceValues.length;
        const roundedAverageCE = parseFloat(averageCE.toFixed(2));
        req.body.averageCE = roundedAverageCE;

        const tmValues = [req.body.tm1, req.body.tm2, req.body.tm3, req.body.tm4, req.body.tm5, req.body.tm6, req.body.tm7, req.body.tm8];
        const totalM = reCalculateTotal(tmValues);
        req.body.totalM = totalM;

        const aydValues = [req.body.ayd1, req.body.ayd2, req.body.ayd3, req.body.ayd4];
        const averageAyd = aydValues.reduce((total, current) => total + current, 0) / aydValues.length;
        const roundedAverageAYD = parseFloat(averageAyd.toFixed(2));
        req.body.averageAyd = roundedAverageAYD;

        const generalData = await Retests.create(req.body);
        res.status(200).json({
            success: true,
            generalData
        });

    } catch (error) {
        console.log(error);
        return next(error);
    }
};

function reCalculateTotal(values) {
    const total = values.reduce((acc, currentValue) => {
        const numericValue = parseFloat(currentValue);
        if (!isNaN(numericValue)) {
            return acc + numericValue;
        }
        return acc;
    }, 0);
    return total;
}

const getAllRetests = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const count = await Retests.countDocuments();

        const dataRetests = await Retests.find()
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);
        if (!dataRetests || dataRetests.length === 0) {
            return res.status(400).json({ message: 'No se encontraron post-tests.' });
        }

        const totalPages = Math.ceil(count);
        res.status(200).json({
            retests: dataRetests,
            totalPages,
            currentPage: page
        });
    } catch (error) {
        console.log(error);
        return next(error);
    }
}


const getRetestByCC = async (req, res, next) => {
    try {
        const cc = req.params.cc;
        const generalData = await Retests.findOne({ cc });
        if (!generalData) {
            return res.status(404).json({ message: 'No se encontró el post-test' });
        }
        res.status(200).send(generalData)
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

const exportToExcel = async (req, res, next) => {
    try {
        const dataRetest = await Retests.find().sort({ date: -1 });
        if (!dataRetest || dataRetest.length === 0) {
            return res.status(400).json({ message: 'No se encontraron post-tests.' });
        }
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Post-Tests');
        worksheet.addRow([
            'Cédula',
            'Nombres',
            'Test',
        ]);
        dataRetest.forEach(retest => {
            worksheet.addRow([
                retest.cc,
                retest.names,
                retest.type,
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

module.exports = { recreateTest, getAllRetests, getRetestByCC, exportToExcel }