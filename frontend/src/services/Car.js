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
      console.log(res.data)
      this.initAllBySettings(res.data)
    } catch (error) {
      this.handleApiError(error, 'fetching car by ID')
    }
  }

  async fetchCarImages() {
    try {
      const response = await this.api.get(`/car/${this.id}/images`)
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

  async uploadImages(formData) {
    try {
      console.log('Uploading images for car ID:', this.id)
      const fd = new FormData()
      fd.append('images', formData)
      const response = await this.api.post(`/cars/${this.id}/images`, fd)
      console.log(response)
    } catch (error) {
      this.handleApiError(error, 'uploading car images')
    }
  }

  async updateImages(imageList) {
    try {
      console.log('Updating images for car ID:', this.id)
      const fd = new FormData()

      imageList.forEach((imgObj) => {
        if (imgObj.file instanceof File) {
          // New File: Append as binary. Multer catches 'images'
          fd.append('images', imgObj.file)
        } else if (typeof imgObj.preview === 'string') {
          // Existing Image: Append URL string. Backend parses body.images
          fd.append('images', imgObj.preview)
        }
      })

      // Corrected: Pass fd directly as data.
      // Axios handles Content-Type: multipart/form-data automatically when data is FormData.
      const response = await this.api.put(`/cars/${this.id}/images`, fd)
      console.log('Images updated:', response)
      return response
    } catch (error) {
      this.handleApiError(error, 'updating car images')
    }
  }

  async deleteImage(imageId) {
    try {
      const response = await this.api.delete(`/cars/${this.id}/images/${imageId}`)
      return response
    } catch (error) {
      this.handleApiError(error, 'deleting car image')
    }
  }
}
