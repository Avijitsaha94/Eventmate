import cloudinary from '../config/cloudinary'

interface UploadOptions {
  folder: string
  width?: number
  height?: number
}

export const uploadToCloudinary = (
  fileBuffer: Buffer,
  options: UploadOptions
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const transformation: any[] = []

    if (options.width && options.height) {
      transformation.push({
        width: options.width,
        height: options.height,
        crop: 'fill',
      })
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        transformation,
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      },
      (error, result) => {
        if (error) return reject(error)
        if (!result) return reject(new Error('Upload failed - no result'))
        resolve(result.secure_url)
      }
    )

    uploadStream.end(fileBuffer)
  })
}