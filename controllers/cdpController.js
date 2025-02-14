const Cdp = require('../models/cdpModel');
const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

const validateFields = (body, requiredFields) => {
    for (const field of requiredFields) {
        if (!body[field]) {
            return field;
        }
    }
    return null;
};

const createCdp = async (req, res) => {
    try {
        const requiredFields = ['nombres', 'documento', 'autorizacion', 'fecha', 'objeto', 'resumido', 'largo', 'nombrerubro', 'valor',
            'valorletras', 'codigo', 'nombreproyecto',
        ];

        const missingField = validateFields(req.body, requiredFields);
        if (missingField) {
            res.status(400).json({ message: `${missingField} es requerido` });
            return;
        }

        const existingCdp = await Cdp.findOne({ documento: req.body.documento });
        if (existingCdp) {
            return res.status(400).json({ message: 'Lo sentimos, no puedes crear el mismo CDP varias veces' });
        }

        const dataCdp = await Cdp.create(req.body);
        console.log(req.body);
        res.status(201).json({
            success: true,
            data: dataCdp
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al crear el CDP' });
    }
}

const getCdpPaginated = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const count = await Cdp.countDocuments();

        const dataCdp = await Cdp.find()
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);
        if (!dataCdp || dataCdp.length === 0) {
            return res.status(400).json({ message: 'No se encontró el CDP.' });
        }

        const totalPages = Math.ceil(count / limit);
        res.status(200).json({
            cdps: dataCdp,
            totalPages,
            currentPage: page
        });
    } catch (error) {
        console.log(error);
    }
}

const getAllCdps = async (req, res, next) => {
    try {
        const cdps = await Cdp.find({});
        if (!cdps || cdps.length === 0) {
            res.status(404).json({ message: 'No se encontraron cdps.' });
            return;
        }
        res.status(200).json(cdps);
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

const getBySearch = async (req, res) => {
    try {
        const search = req.query.search || ''; // Término de búsqueda
        const sortField = req.query.sortField || 'nombres'; // Campo de ordenación
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1; // Orden ascendente o descendente

        // Crear el filtro de búsqueda
        const query = search
            ? { nombres: { $regex: search, $options: 'i' } } // Búsqueda insensible a mayúsculas/minúsculas
            : {};

        // Buscar los datos con ordenación, sin paginación
        const cdps = await Cdp.find(query).sort({ [sortField]: sortOrder });

        // Enviar la respuesta con los resultados
        res.status(200).json(cdps);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};



const updateCdp = async (req, res, next) => {
    try {
        const { _id } = req.params; // ID enviado como parámetro
        const updates = req.body; // Datos enviados en el cuerpo de la solicitud

        // Verifica si el CDP existe
        const existingCdp = await Cdp.findById(_id);
        if (!existingCdp) {
            return res.status(404).json({ message: 'El CDP no fue encontrado' });
        }

        // Actualiza el CDP directamente
        const updatedCdp = await Cdp.findByIdAndUpdate(_id, updates, { new: true, runValidators: true });

        res.status(200).json({
            success: true,
            message: 'CDP actualizado',
            data: updatedCdp
        });
    } catch (error) {
        console.error('Error al actualizar el CDP:', error);
        return next(error);
    }
};


const getCdpById = async (req, res, next) => {
    try {
        const _id = req.params._id;
        const cdp = await Cdp.findOne({ _id });
        if (!cdp) {
            return res.status(404).json({ message: 'No se encontró el CDP' });
        }
        res.status(200).send(cdp)
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

const loadFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'binary', (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

// Controlador para generar documentos
const generateDocument = async (req, res) => {
    try {
        console.log("📥 Datos recibidos en backend:", req.body);

        const contractor = req.body;
        if (!contractor || Object.keys(contractor).length === 0) {
            return res.status(400).json({ error: "No contractor data provided" });
        }

        // Ruta de la plantilla
        const templatePath = path.resolve(__dirname, '../templates/cdp1.docx');
        console.log("📂 Ruta de la plantilla:", templatePath);

        if (!fs.existsSync(templatePath)) {
            console.error("❌ ERROR: La plantilla no se encuentra en:", templatePath);
            return res.status(500).json({ error: "Plantilla no encontrada en el servidor." });
        }

        const content = await loadFile(templatePath);
        console.log("✅ Archivo leído correctamente");

        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        // Reemplazar variables en la plantilla con los datos del contractor
        doc.render({
            ...contractor // Esto pasa automáticamente todas las variables de `contractor`
        });
        

        console.log("✅ Documento procesado correctamente");

        // Generar el documento como buffer
        const buffer = doc.getZip().generate({ type: 'nodebuffer' });

        // Enviar el archivo directamente al frontend sin guardarlo en el servidor
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': `attachment; filename=${contractor.nombres || 'documento'}.docx`,
        });

        res.send(buffer);
    } catch (error) {
        console.error("❌ ERROR generando documento:", error);
        res.status(500).json({ error: "Error interno en la generación del documento." });
    }
};

const generateDocumentList = async (req, res) => {
    try {
        console.log("📥 Datos recibidos en backend:", req.body);

        const { cdps } = req.body;
        if (!cdps || !Array.isArray(cdps) || cdps.length === 0) {
            return res.status(400).json({ error: "No contractor list provided" });
        }

        // Ruta de la plantilla
        const templatePath = path.resolve(__dirname, '../templates/cdp.docx');
        console.log("📂 Ruta de la plantilla:", templatePath);

        if (!fs.existsSync(templatePath)) {
            console.error("❌ ERROR: La plantilla no se encuentra en:", templatePath);
            return res.status(500).json({ error: "Plantilla no encontrada en el servidor." });
        }

        const content = await loadFile(templatePath);
        console.log("✅ Archivo leído correctamente");

        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        // Reemplazar variables en la plantilla con la lista de contractors
        // doc.render({ cdps });
        doc.render({
            cdps: cdps.map(cdp => ({
                ...cdp  // Esto copia todos los atributos sin necesidad de escribirlos uno por uno
            }))
        });
        
        console.log("Datos enviados a doc.render:", JSON.stringify({ cdps }, null, 2));
        // doc.render({ cdps });


        console.log("✅ Documento procesado correctamente");

        // Generar el documento como buffer
        const buffer = doc.getZip().generate({ type: 'nodebuffer' });

        // Enviar el archivo directamente al frontend sin guardarlo en el servidor
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': 'attachment; filename=Listado_CDPs.docx',
        });

        res.send(buffer);
    } catch (error) {
        console.error("❌ ERROR generando documento:", error);
        res.status(500).json({ error: "Error interno en la generación del documento." });
    }
};



module.exports = { createCdp, getCdpPaginated, getAllCdps, updateCdp, getCdpById, getBySearch, generateDocument, generateDocumentList }