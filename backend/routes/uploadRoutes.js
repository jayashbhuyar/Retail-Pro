// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// Route to handle QR code upload
router.post('/qr-code', uploadController.uploadQRCode);

// Route to delete QR code (optional)
router.delete('/qr-code/:public_id', uploadController.deleteQRCode);

// **************************************************************************
router.post('/image', uploadController.uploadImage);
router.delete('/image/:public_id', uploadController.deleteImage);

module.exports = router;