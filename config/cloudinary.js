const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'drkwdc8vh',
    api_key: '622218788959114',
    api_secret: 'pOxEp94zGWh0pnmtPpgieYoOM5E'
});

module.exports = cloudinary;