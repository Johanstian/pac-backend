// const multer = require('multer');
// const path = require('path');
// const File = require('../models/fileModel');


// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}${path.extname(file.originalname)}`);
//     }
// });


// const fileFilter = (req, file, cb) => {
//     const filetypes = /jpeg|jpg|png|gif/;
//     const mimetype = filetypes.test(file.mimetype);
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

//     if (mimetype && extname) {
//         return cb(null, true);
//     } else {
//         cb(new Error('Error: Solo se permiten imágenes!'));
//     }
// };

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 1024 * 1024 * 2 },
//     fileFilter: fileFilter
// });

// module.exports = upload;


const express = require("express")
const multer = require("multer")
const { GridFsStorage } = require("multer-gridfs-storage")
require("dotenv").config();

const storage = new GridFsStorage({
    url,
    file: (req, file) => {
      //If it is an image, save to photos bucket
      if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        return {
          bucketName: "photos",
          filename: `${Date.now()}_${file.originalname}`,
        }
      } else {
        //Otherwise save to default bucket
        return `${Date.now()}_${file.originalname}`
      }
    },
  })

  const upload = multer({ storage })

  app.post("/upload/image", upload.single("avatar"), (req, res) => {
    const file = req.file
    // Respond with the file details
    res.send({
      message: "Uploaded",
      id: file.id,
      name: file.filename,
      contentType: file.contentType,
    })
  })