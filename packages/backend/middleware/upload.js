import multer from 'multer';

// Multer storage configuration
const storage = multer.memoryStorage(); // Store files in memory

// Define multer upload configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true); // Accept images only
        } else {
            cb(new Error("Invalid file type. Only images are allowed."), false); // Reject non-image files
        }   
    },
});

// Middleware to handle file upload
const uploadSingleFile = (fieldName) => {
    return (req, res, next) => {
        const uploadSingle = upload.single(fieldName);
        uploadSingle(req, res, (err) => {
            if (err) {
                // Handle errors inside the same middleware
                if (err instanceof multer.MulterError) {
                    // Handle Multer-specific errors
                    switch (err.code) {
                        case 'LIMIT_FILE_SIZE':
                            return res.status(400).json({
                                error: 'File too large. Max size is 5MB.',
                            });
                        case 'LIMIT_UNEXPECTED_FILE':
                            return res.status(400).json({
                                error: 'Unexpected file field. Make sure the field name is correct.',
                            });
                        default:
                            return res.status(400).json({
                                error: err.message,
                            });
                    }
                } else if (err) {
                    // Handle other errors (e.g., invalid file type)
                    return res.status(400).json({
                        error: err.message,
                    });
                }
            }
            // Continue if no error
            next();
        });
    };
};

// Export the uploadSingleFile middleware
export { uploadSingleFile };
