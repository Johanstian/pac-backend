const ExcelJS = require('exceljs');
const Arls = require('../models/arlModel');

const validateFields = (body, requiredFields) => {
    for (const field of requiredFields) {
        if (!body[field]) {
            return field;
        }
    }
    return null;
};

const createArl = async (req, res, next) => {
    try {
        const requiredFields = [
            'arlName', 'documentType', 'firstName', 'firstSurname', 'birthday', 'sex', 'email', 'address', 'cellphone', 'eps', 'afp', 'city'
        ];
        const missingField = validateFields(req.body, requiredFields);
        if (missingField) {
            res.status(400);
            return next(new Error(`${missingField} es requerido`));
        }
        const existingArl = await Arls.findOne({ cc: req.body.cc });
        if (existingArl) {
            res.status(400).json({ message: 'Lo sentimos, solo puedes afiliarte a la ARL una sola vez' });r
            return;
        }

        const dataArl = await Arls.create(req.body);
        res.status(200).json({
            success: true,
            dataArl
        })


    } catch (error) {
        console.log(error);
        return next(error);
    }
}

const getAllArls = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const count = await Arls.countDocuments();

        const dataArl = await Arls.find()
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);
        if (!dataArl || dataArl.length === 0) {
            return res.status(400).json({ message: 'No se encontraron afiliaciones.' });
        }

        const totalPages = Math.ceil(count);
        res.status(200).json({
            arls: dataArl,
            totalPages,
            currentPage: page
        });
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

const getArlByCc = async (req, res, next) => {
    try {
        const cc = req.params.cc;
        const arl = await Arls.findOne({ cc });
        if (!arl) {
            return res.status(404).json({ message: 'No se encontró la afiliación' });
        }
        res.status(200).send(arl)
    } catch (error) {
        console.log(error);
        return next(error);
    }
}


const exportToExcel = async (req, res, next) => {
    try {
        const dataArl = await Arls.find().sort({ date: -1 });

        if (!dataArl || dataArl.length === 0) {
            return res.status(400).json({ message: 'No se encontraron afiliaciones.' });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('ARLs');

        worksheet.addRow([
            'Tipo de documento',
            'Cédula',
            'Primer apellido',
            'Segundo apellido',
            'Primer nombre',
            'Segundo nombre',
            'Fecha de nacimiento',
            'Género',
            'Correo electrónico',
            '',
            'Ciudad',
            'Dirección',
            'Celular',
            '',
            'EPS',
            'AFP',
            'ARL',
        ]);

        dataArl.forEach(arl => {
            worksheet.addRow([
                arl.documentType,
                arl.cc,
                arl.firstSurname.toUpperCase(),
                arl.secondSurname.toUpperCase(),
                arl.firstName.toUpperCase(),
                arl.secondName.toUpperCase(),
                arl.birthday,
                arl.sex.toUpperCase(),
                arl.email,
                '',
                arl.city,
                arl.address,
                arl.cellphone,
                '',
                arl.eps,
                arl.afp,
                arl.arlName,
            ]);
        });

        const buffer = await workbook.xlsx.writeBuffer();

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=arls.xlsx');
        res.status(200).send(buffer);
    } catch (error) {
        console.log(error);
        return next(error);
    }
};


module.exports = { createArl, getAllArls, getArlByCc, exportToExcel }