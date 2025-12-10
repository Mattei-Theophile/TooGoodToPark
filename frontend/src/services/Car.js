import Api from '@/services/api/useApi.js'

export class Car {
  id
  brand
  model
  description
  mileage
  price
  licensePlate = ''
  year
  status = ''
  location = ''
  passenger = 0
  images = []
  api = Api.useApi()

  initAllBySettings(carSettings) {
    this.id = carSettings.ID_Car
    this.brand = carSettings.Brand_Car
    this.model = carSettings.Model_Car
    this.description = carSettings.Description_Car
    this.mileage = carSettings.Mileage_Car
    this.price = carSettings.Price_Car
    this.year = carSettings.Year_Car
    this.licensePlate = carSettings.LicensePlate_Car
    this.location = carSettings.Location_Car
    this.passenger = carSettings.Passenger_Car
    this.status = carSettings.Status_Car
  }

  initById(id) {
    this.id = id
  }

  handleApiError(error, operation) {
    console.error(`Error during ${operation}:`, error)
  }

  async fetchCarById() {
    try {
      const res = await this.api.get(`/car/${this.id}`)
      this.initAllBySettings(res.data)
    } catch (error) {
      this.handleApiError(error, 'fetching car by ID')
    }
  }

  async fetchCarImages() {
    try {
      const response = await this.api.get(`/car/${this.id}/images`)
      this.images = [] // Clear existing before pushing to avoid duplicates
      if (response.data.length > 0) {
        this.images.push(...response.data)
      }
    } catch (error) {
      console.error('Error fetching car images:', error)
    }
  }

  async create(carData) {
    try {
      const response = await this.api.post(`/cars`, carData)
      this.id = response.data.id
    } catch (error) {
      this.handleApiError(error, 'creating car')
    }
  }

  async update(carData) {
    try {
      const response = await this.api.put(`/cars`, carData)
      return response
    } catch (error) {
      this.handleApiError(error, 'updating car')
    }
  }

  async delete() {
    try {
      return await this.api.delete(`/cars/${this.id}`)
    } catch (error) {
      this.handleApiError(error, 'deleting car')
    }
  }

  // Modified to handle single image upload (File, Object, or Base64)
  async uploadImages(imageInput) {
    try {
      console.log('Uploading image for car ID:', this.id)

      // Handle Base64 string (from EditCar new images)
      if (typeof imageInput === 'string' && imageInput.startsWith('data:')) {
        // Send as JSON body for Base64
        await this.api.post(`/cars/${this.id}/images`, {
          images: [imageInput],
        })
        return
      }

      // Handle File object or Wrapper { file: File } (from AddCar)
      const fd = new FormData()
      if (imageInput instanceof File) {
        fd.append('images', imageInput)
      } else if (imageInput.file instanceof File) {
        fd.append('images', imageInput.file)
      } else {
        console.warn('Invalid image format skipped:', imageInput)
        return
      }

      const response = await this.api.post(`/cars/${this.id}/images`, fd)
      console.log('Image uploaded:', response)
    } catch (error) {
      this.handleApiError(error, 'uploading car images')
    }
  }

  // Refactored to perform one-by-one Add/Delete instead of Bulk Replace
  async updateImages(currentVisualList) {
    try {
      console.log('Synchronizing images one-by-one...')

      const currentIds = new Set()
      currentVisualList.forEach((img) => {
        if (img && typeof img === 'object' && img.ID_Image) {
          currentIds.add(img.ID_Image)
        }
      })
      console.log(currentVisualList.length, 'images to be uploaded.')

      for (const originalImg of this.images) {
        if (!currentIds.has(originalImg.ID_Image)) {
          console.log(`Deleting image ID: ${originalImg.ID_Image}`)
          await this.deleteImage(originalImg)
        }
      }
      console.log('Removed images successfully deleted.')
      console.log(currentVisualList.length, 'images to be uploaded.')
      // 2. Identify and Upload New Images
      // New images are either Base64 strings or Objects with a .file property
      for (const img of currentVisualList) {
        console.log('Processing image:', img)
        const isBase64 = typeof img === 'string' && img.startsWith('data:')
        const isFileObj = img && img.file instanceof File

        if (isBase64 || isFileObj) {
          await this.uploadImages(img)
        }
      }

      // Refresh the internal state after sync
      await this.fetchCarImages()
    } catch (error) {
      this.handleApiError(error, 'updating car images')
    }
  }

  async deleteImage(imageUrl) {
    try {
      let imageName = imageUrl.split('/')
      imageName = imageName[imageName.length - 1]
      const response = await this.api.delete(`/cars/${this.id}/images/${imageName}`)
      return response
    } catch (error) {
      this.handleApiError(error, 'deleting car image')
    }
  }
}
