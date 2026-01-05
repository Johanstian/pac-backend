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
            res.status(400).json({ message: 'Lo sentimos, solo puedes afiliarte a la ARL una sola vez' });
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
        const searchCc = req.query.cc ? req.query.cc.toString().trim() : null;

        // Construir el filtro de búsqueda
        let filter = {};
        if (searchCc) {
            // Si es un número completo, buscar exacto (más rápido y eficiente)
            const ccNumber = parseInt(searchCc);
            if (!isNaN(ccNumber) && ccNumber.toString() === searchCc) {
                filter.cc = ccNumber; // Búsqueda exacta - usa índices
            } else {
                // Búsqueda parcial - usa expresión simple con $expr
                filter = {
                    $expr: {
                        $regexMatch: {
                            input: { $toString: "$cc" },
                            regex: searchCc
                        }
                    }
                };
            }
        }

        // Contar y buscar documentos con el filtro aplicado
        const count = await Arls.countDocuments(filter);
        const dataArl = await Arls.find(filter)
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(limit);
        
        if (count === 0) {
            const message = searchCc 
                ? `No se encontraron afiliaciones con cédula que contenga "${searchCc}".` 
                : 'No se encontraron afiliaciones.';
            return res.status(400).json({ message });
        }

        const totalPages = Math.ceil(count / limit);
        
        res.status(200).json({
            arls: dataArl,
            totalPages,
            totalDocuments: count,
            currentPage: page,
            searchTerm: searchCc || null
        });
    } catch (error) {
        console.log('❌ Error en getAllArls:', error);
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

const getArlById = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID tenga el formato correcto de MongoDB
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const arl = await Arls.findById(id);
        if (!arl) {
            return res.status(404).json({ message: 'No se encontró la afiliación con el ID proporcionado' });
        }

        res.status(200).json({
            success: true,
            arl
        });
    } catch (error) {
        console.log('❌ Error en getArlById:', error);
        return next(error);
    }
}

const updateArl = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Validar que el ID tenga el formato correcto de MongoDB
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        // Verificar que la ARL existe
        const existingArl = await Arls.findById(id);
        if (!existingArl) {
            return res.status(404).json({ message: 'No se encontró la afiliación con el ID proporcionado' });
        }

        // Si se está actualizando la cédula, verificar que no exista otra ARL con esa cédula
        if (updateData.cc && updateData.cc !== existingArl.cc) {
            const arlWithSameCc = await Arls.findOne({ cc: updateData.cc });
            if (arlWithSameCc && arlWithSameCc._id.toString() !== id) {
                return res.status(400).json({ 
                    message: 'Ya existe otra afiliación con la cédula proporcionada' 
                });
            }
        }

        // Actualizar la ARL
        const updatedArl = await Arls.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Afiliación actualizada correctamente',
            arl: updatedArl
        });
    } catch (error) {
        console.log('❌ Error en updateArl:', error);
        return next(error);
    }
}

const deleteArl = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validar que el ID tenga el formato correcto de MongoDB
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        // Verificar que la ARL existe antes de eliminar
        const existingArl = await Arls.findById(id);
        if (!existingArl) {
            return res.status(404).json({ message: 'No se encontró la afiliación con el ID proporcionado' });
        }

        // Eliminar la ARL
        await Arls.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Afiliación eliminada correctamente',
            deletedArl: {
                id: existingArl._id,
                cc: existingArl.cc,
                nombre: `${existingArl.firstName} ${existingArl.firstSurname}`
            }
        });
    } catch (error) {
        console.log('❌ Error en deleteArl:', error);
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
            'Código DPTO',
            'Cargo',
            'NIT Indervalle'
        ]);

        dataArl.forEach(arl => {
            worksheet.addRow([
                arl.documentType,
                arl.cc,
                String(arl.firstSurname).toUpperCase(),
                String(arl.secondSurname).toUpperCase(),
                String(arl.firstName).toUpperCase(),
                String(arl.secondName).toUpperCase(),
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
                76,
                1388,
                '805012896-4'
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


module.exports = { createArl, getAllArls, getArlByCc, getArlById, updateArl, deleteArl, exportToExcel }