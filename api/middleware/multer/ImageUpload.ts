import multer from 'multer';
import crypto from 'crypto';

const storageTypes = {
    local : multer.diskStorage({
        destination : (req,file,cb) => {
            cb(null, "/uploads")
        },
        filename : function (req,file, cb) {
            cb(null);
        }
    })
}

const upload = multer({storageTypes});

export {upload};