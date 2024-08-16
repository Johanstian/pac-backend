const Comment = require('../models/appCommentModel');
const Products = require('../models/appProductsModel');
const cloudinary = require('../config/cloudinary');
const upload = require('../middlewares/multer');
const Events = require('../models/event');
const Home = require('../models/appHome');

const validateFields = (body, requiredFields) => {
    for (const field of requiredFields) {
        if (!body[field]) {
            return field;
        }
    }
    return null;
};

const createComment = async (req, res, next) => {
    try {
        const requiredFields = [
            'name', 'lastname', 'comment'
        ];
        const missingField = validateFields(req.body, requiredFields);
        if (missingField) {
            res.status(400);
            return next(new Error(`${missingField} es requerido`));
        }
        const dataComment = await Comment.create(req.body);
        res.status(200).json({
            success: true,
            dataComment
        })
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

const getComments = async (req, res, next) => {
    try {
        // Obtener todos los tests
        const comment = await Comment.find({});

        // Verificar si se encontraron tests
        if (!comment || comment.length === 0) {
            res.status(404).json({ message: 'No se encontraron comentarios.' });
            return; // Termina la ejecución de la función después de enviar la respuesta
        }

        // Enviar los tests encontrados como respuesta
        res.status(200).json(comment);
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

const createProduct = async (req, res, next) => {
    try {
        console.log('File:', req.file);
        const requiredFields = [
            'title', 'subtitle', 'phone', 'address', 'products', 'facebook', 'mail'
        ];
        const missingField = validateFields(req.body, requiredFields);
        if (missingField) {
            return res.status(400).json({ error: `${missingField} es requerido` });
        }

        const productData = { ...req.body };

        if (req.file) {
            // Sube la imagen a Cloudinary
            const uploadResult = await cloudinary.uploader.upload(req.file.path);
            productData.avatar = uploadResult.secure_url; // Guarda la URL segura de la imagen
        }

        const newProduct = await Products.create(productData);
        res.status(200).json({
            success: true,
            data: newProduct
        });

    } catch (error) {
        console.log(error);
        return next(error);
    }
}

const getProducts = async (req, res, next) => {
    try {
        // Obtener todos los tests
        const products = await Products.find({});

        // Verificar si se encontraron tests
        if (!products || products.length === 0) {
            res.status(404).json({ message: 'No se encontraron productos.' });
            return; // Termina la ejecución de la función después de enviar la respuesta
        }

        // Enviar los tests encontrados como respuesta
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Products.findById(id);

        if (!product) {
            res.status(404).json({ message: 'Producto no encontrado.' });
            return;
        }

        res.status(200).json(product);
    } catch (error) {
        console.log(error);
        if (error.kind === 'ObjectId') {
            res.status(400).json({ message: 'ID de producto no válido.' });
        } else {
            return next(error);
        }
    }
};

const uploadImage = async (req, res, next) => {
    try {
        // Verifica si se ha subido un archivo
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No se ha proporcionado un archivo"
            });
        }
        // Sube el archivo a Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        res.status(200).json({
            success: true,
            message: "¡Imagen subida con éxito!",
            data: result
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
};

const createEvent = async (req, res, next) => {
    try {
        const requiredFields = [
            'event', 'date'
        ]
        const missingField = validateFields(req.body, requiredFields)
        if (missingField) {
            res.status(400)
            return next(new Error(`${missingField} es requerido`));
        }
        const dataEvent = await Events.create(req.body);
        res.status(200).json({
            success: true,
            dataEvent
        })
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

const getEvent = async (req, res, next) => {
    try {
        const events = await Events.find({})
        if (!events || events.length === 0) {
            res.status(400).json({ message: 'No se encontraron eventos.' });
            return;
        }
        res.status(200).json(events)
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

const createHome = async (req, res, next) => {
    try {
        console.log('File:', req.file);
        const requiredFields = [
            'title'
        ];
        const missingField = validateFields(req.body, requiredFields);
        if (missingField) {
            return res.status(400).json({ error: `${missingField} es requerido` });
        }

        const homeData = { ...req.body };

        if (req.file) {
            // Sube la imagen a Cloudinary
            const uploadResult = await cloudinary.uploader.upload(req.file.path);
            homeData.avatar = uploadResult.secure_url; // Guarda la URL segura de la imagen
        }

        const newHome = await Home.create(homeData);
        res.status(200).json({
            success: true,
            data: newHome
        });

    } catch (error) {
        console.log(error);
        return next(error);
    }
}

const getHome = async (req, res, next) => {
    try {
        // Obtener todos los tests
        const home = await Home.find({});

        // Verificar si se encontraron tests
        if (!home || home.length === 0) {
            res.status(404).json({ message: 'No se encontraron homes.' });
            return; // Termina la ejecución de la función después de enviar la respuesta
        }

        // Enviar los tests encontrados como respuesta
        res.status(200).json(home);
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

const deleteHome = async (req, res, next) => {
    try {
        const { public_id } = req.body;

        if (!public_id) {
            return res.status(400).json({ error: "El public_id es requerido" });
        }

        const result = await cloudinary.uploader.destroy(public_id);

        if (result.result !== "ok") {
            return res.status(400).json({ error: "Error al borrar la imagen" });
        }

        res.status(200).json({
            success: true,
            message: "¡Imagen borrada con éxito!"
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
};


module.exports = { createComment, getComments, createProduct, getProducts, getProductById, uploadImage, createEvent, getEvent, createHome, getHome, deleteHome }