const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath;

        console.log('Incoming request path:', req.path);

        if (req.path.includes('add')) {
            uploadPath = path.join(__dirname, '../../uploads/recipes');
            console.log('Set upload path for recipes:', uploadPath);
        } else if (req.path.includes('skill')) {
            const userId = req.params.userId;
            if (!userId) {
                return cb(new Error('User ID is required for skill uploads'));
            }
            uploadPath = path.join(__dirname, '../../uploads/justificatif', userId);
            console.log('Set upload path for skill:', uploadPath);
        } else if (req.path.includes('tickets')) {
            uploadPath = path.join(__dirname, '../../uploads/tickets');
            console.log('Set upload path for ticket:', uploadPath);
        } else {
            console.error('Invalid upload path for request path:', req.path);
            return cb(new Error('Invalid upload path'));
        }

        // Assurez-vous que le répertoire existe
        if (!fs.existsSync(uploadPath)) {
            console.log('Directory does not exist, creating:', uploadPath);
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        let filename;

        if (req.path.includes('add')) {
            filename = `${Date.now()}${path.extname(file.originalname)}`;
            console.log('Generated filename for recipes:', filename);
        } else if (req.path.includes('skill')) {
            filename = `${req.body.skill_id}${path.extname(file.originalname)}`;
            console.log('Generated filename for skill:', filename);
        } else if (req.path.includes('tickets')) {
            filename = `${Date.now()}${path.extname(file.originalname)}`;
            console.log('Generated filename for ticket:', filename);
        } else {
            filename = `${Date.now()}${path.extname(file.originalname)}`;
            console.log('Generated fallback filename:', filename);
        }

        cb(null, filename);
    }
});

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Error: Only images are allowed!'));
    }
}

const upload = multer({
    storage: storage,
    limits: {fileSize: 5000000},  // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
});

function checkFileProvided(req, res, next) {
    if (!req.file) {
        return res.status(400).json({message: 'No file uploaded'});
    }
    next();
}

module.exports = {
    upload,
    checkFileProvided
};
