// controllers/uploadController.js
const cloudinary = require("../config/cloudinary");

exports.uploadQRCode = async (req, res) => {
  try {
    // Check if file exists in request
    if (!req.files || !req.files.qrCode) {
      return res.status(400).json({ 
        success: false, 
        error: "Please select a QR code image" 
      });
    }

    const file = req.files.qrCode;

    // Validate file type
    if (!file.mimetype.startsWith('image/')) {
      return res.status(400).json({
        success: false,
        error: "Please upload an image file"
      });
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        error: "Image size should be less than 5MB"
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'qrcodes', // Separate folder for QR codes
    });

    res.status(200).json({
      success: true,
      message: "QR code uploaded successfully",
      url: result.secure_url,
      public_id: result.public_id
    });

  } catch (error) {
    console.error("QR code upload error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "An error occurred while uploading the QR code."
    });
  }
};

// Optional: Add method to delete QR code from Cloudinary
exports.deleteQRCode = async (req, res) => {
  try {
    const { public_id } = req.params;

    if (!public_id) {
      return res.status(400).json({
        success: false,
        error: "No public_id provided"
      });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === 'ok') {
      res.status(200).json({
        success: true,
        message: "QR code deleted successfully"
      });
    } else {
      res.status(400).json({
        success: false,
        error: "Failed to delete QR code"
      });
    }

  } catch (error) {
    console.error("QR code deletion error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "An error occurred while deleting the QR code."
    });
  }
};
// *************************************************************

exports.uploadImage = async (req, res) => {
    try {
      if (!req.files || !req.files.image) {
        return res.status(400).json({ 
          success: false, 
          error: "Please select an image" 
        });
      }
  
      const file = req.files.image;
  
      if (!file.mimetype.startsWith('image/')) {
        return res.status(400).json({
          success: false,
          error: "Please upload an image file"
        });
      }
  
      if (file.size > 5 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          error: "Image size should be less than 5MB"
        });
      }
  
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'user-images',
      });
  
      res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        url: result.secure_url,
        public_id: result.public_id
      });
  
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "An error occurred while uploading the image."
      });
    }
  };
  
  exports.deleteImage = async (req, res) => {
    try {
      const { public_id } = req.params;
  
      if (!public_id) {
        return res.status(400).json({
          success: false,
          error: "No public_id provided"
        });
      }
  
      const result = await cloudinary.uploader.destroy(public_id);
  
      if (result.result === 'ok') {
        res.status(200).json({
          success: true,
          message: "Image deleted successfully"
        });
      } else {
        res.status(400).json({
          success: false,
          error: "Failed to delete image"
        });
      }
  
    } catch (error) {
      console.error("Image deletion error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "An error occurred while deleting the image."
      });
    }
  };
  