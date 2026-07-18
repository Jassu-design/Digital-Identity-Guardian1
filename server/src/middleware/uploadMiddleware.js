import multer from 'multer'
import fs from 'fs'
import path from 'path'

const uploadDirectory = path.join(process.cwd(), 'uploads')

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {recursive: true})
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDirectory)
  },

  filename: (req, file, callback) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}`

    const extension = path.extname(file.originalname)

    callback(null, `${uniqueSuffix}${extension}`)
  },
})

const fileFilter = (req, file, callback) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ]

  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true)
  } else {
    callback(
      new Error(
        'Only JPG, JPEG, PNG and WEBP image files are allowed.',
      ),
      false,
    )
  }
}

export const uploadImage = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 1,
  },
})