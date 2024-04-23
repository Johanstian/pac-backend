const Tests = require('../models/testsModel');

const validateFields = (body, requiredFields) => {
    for (const field of requiredFields) {
        if (!body[field]) {
            return field;
        }
    }
    return null;
};

const createTest = async (req, res, next) => {
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

        const existingTest = await Tests.findOne({ cc: req.body.cc });
        if (existingTest) {
            res.status(400).json({message: 'Lo sentimos, solo puedes hacer este test una sola vez'})
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
        const totalM = tmValues.reduce((total, current) => total + current, 0)
        req.body.totalM = totalM;

        const aydValues = [req.body.ayd1, req.body.ayd2, req.body.ayd3, req.body.ayd4];
        const averageAyd = aydValues.reduce((total, current) => total + current, 0) / aydValues.length;
        const roundedAverageAYD = parseFloat(averageAyd.toFixed(2));
        req.body.averageAyd = roundedAverageAYD;

        const generalData = await Tests.create(req.body);
        res.status(200).json({
            success: true,
            generalData
        });

    } catch (error) {
        console.log(error);
        return next(error);
    }
};

// const getAllTests = async (req, res, next) => {
//     try {
//         const cc = req.query.cc;
//         const generalData = await Tests.findOne({ cc })
//         if (!generalData) {
//             res.status(404);
//             res.status(400).json({message: 'No se encontró el usuario.'})
//         }
//         res.status(200).send(generalData)
//     } catch (error) {
//         console.log(error);
//         return next(error);
//     }
// }

const getAllTests = async (req, res, next) => {
    try {
        // Obtener todos los tests
        const tests = await Tests.find({});
        
        // Verificar si se encontraron tests
        if (!tests || tests.length === 0) {
            res.status(404).json({ message: 'No se encontraron tests.' });
            return; // Termina la ejecución de la función después de enviar la respuesta
        }
        
        // Enviar los tests encontrados como respuesta
        res.status(200).json(tests);
    } catch (error) {
        console.log(error);
        return next(error);
    }
}


const getTestByCC = async (req, res, next) => {
    try {
        const cc = req.params.cc;
        const generalData = await Tests.findOne({ cc });
        if (!generalData) {
            return res.status(404).json({ message: 'No se encontró la entrevista' });
        }
        // res.render('interviewPage', { interview });
        res.status(200).send(generalData)
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

module.exports = {createTest, getAllTests, getTestByCC}