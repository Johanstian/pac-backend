const Contractor = require('../models/contractorsModel');
const Cdp = require('../models/cdpModel');


const validateFields = (body, requiredFields) => {
    for (const field of requiredFields) {
        if (!body[field]) {
            return field;
        }
    }
    return null;
};

const createContractor = async (req, res, next) => {
    try {
        const { documento, contratista, invitacion, identificado, oficio, fechacdp, actividad, tipo, requisitoestudios, requisitoexperiencia, alternativaestudio, alternativaexperiencia } = req.body;

        // Buscar el Cdp por el documento
        const cdp = await Cdp.findOne({ documento });

        if (!cdp) {
            return res.status(404).json({
                message: `No se encontró un CDP con el documento: ${documento}`
            });
        }
        const contractor = new Contractor({
            documento,
            contratista,
            invitacion,
            identificado,
            oficio,
            actividad,
            fechacdp,
            requisitoestudios,
            tipo,
            alternativaestudio,
            requisitoexperiencia,
            alternativaexperiencia,
            cdp: cdp._id,
            cdps: {
                nombres: cdp.nombres,
                documento: cdp.documento,
                autorizacion: cdp.autorizacion,
                fecha: cdp.fecha,
                objeto: cdp.objeto,
                resumido: cdp.resumido,
                largo: cdp.largo,
                nombrerubro: cdp.nombrerubro,
                valor: cdp.valor,
                valorletras: cdp.valorletras,
                codigo: cdp.codigo,
                nombreproyecto: cdp.nombreproyecto
            }
        });

        // Guardar el Contractor en la base de datos
        await contractor.save();

        res.status(201).json(contractor);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const getAllContractors = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const count = await Contractor.countDocuments();

        const dataContractor = await Contractor.find()
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);
        if (!dataContractor || dataContractor.length === 0) {
            return res.status(400).json({ message: 'No se encontraron contratistas.' });
        }

        const totalPages = Math.ceil(count / limit);
        res.status(200).json({
            contractors: dataContractor,
            totalPages,
            currentPage: page
        });


    } catch (error) {
        console.log(error);
        return next(error);
    }
}

const allContractors = async (req, res, next) => {
    try {
        // Encontrar todos los Contractors y poblar la información del Cdp
        const contractors = await Contractor.find({}).populate('cdp');

        if (!contractors || contractors.length === 0) {
            return res.status(404).json({ message: 'No se encontraron contratistas.' });
        }
        // Enviar los Contractors con los datos completos del CDP
        res.status(200).json(contractors);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const getOneContractor = async (req, res, next) => {
    try {
        const documento = req.params.documento;
        const contractor = await Contractor.findOne({ documento });
        if (!contractor) {
            return res.status(404).json({ message: 'No se encontró el contratista' });
        }
        res.status(200).send(contractor)
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

const updateContractor = async (req, res, next) => {
    try {
        const { documento } = req.params
        const requiredFields = ['documento', 'contratista', 'invitacion', 'identificado', 'oficio', 'fechacdp', 'actividad', 'tipo', 'requisitoestudios', 'requisitoexperiencia', 'alternativaestudio', 'alternativaexperiencia'];
        const missingField = validateFields(req.body, requiredFields);
        if (missingField) {
            res.status(400);
            return next(new Error(`${missingField} es requerido`));
        }

        let existingContractor = await Contractor.findOne({ documento });
        existingContractor.set(req.body);
        existingContractor = await existingContractor.save();

        res.status(200).json({
            success: true,
            existingContractor
        });

    } catch (error) {
        console.error(error);
        return next(error);
    }
}

const getBySearch = async (req, res) => {
    try {
        const search = req.query.search || ''; // Término de búsqueda
        const sortField = req.query.sortField || 'contratista'; // Campo de ordenación
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1; // Orden ascendente o descendente

        // Crear el filtro de búsqueda
        const query = search
            ? { contratista: { $regex: search, $options: 'i' } } // Búsqueda insensible a mayúsculas/minúsculas
            : {};

        // Buscar los datos con ordenación, sin paginación
        const contractors = await Contractor.find(query).sort({ [sortField]: sortOrder });

        // Enviar la respuesta con los resultados
        res.status(200).json(contractors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


module.exports = { createContractor, getAllContractors, updateContractor, getOneContractor, allContractors, getBySearch }