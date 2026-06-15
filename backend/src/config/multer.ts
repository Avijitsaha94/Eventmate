import multer from 'multer'

// File filter - শুধু image allow করবো
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only jpg, jpeg, png, webp images are allowed'))
  }
}

// Memory storage - file কে buffer হিসেবে রাখবে (disk এ save হবে না)
const storage = multer.memoryStorage()

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
})