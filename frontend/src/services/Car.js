import Api from '@/services/api/useApi.js'

export class Car {
  id
  // Name of the car
  brand
  model
  // Information about the car
  description
  mileage
  price
  date
  images = []
  seller = null
  api = Api.useApi()

  initAllBySettings(carSettings) {
    this.id = carSettings.ID_Car
    this.brand = carSettings.Marque_Car
    this.model = carSettings.Modele_Car
    this.description = carSettings.Description_Car
    this.mileage = carSettings.Kilometrage_Car
    this.price = carSettings.Price_Car
    this.date = carSettings.Date_Car
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
      if (response.data.length > 0) {
        const imagePaths = response.data.map((element) => element.Image_Path)

        this.images.push(...imagePaths)
      }
    } catch (error) {
      console.error('Error fetching car images:', error)
    }
  }

  async create(carData) {
    try {
      const response = await this.api.post(`/cars`, carData)
      console.log(response)
      return response
    } catch (error) {
      this.handleApiError(error, 'creating car')
    }
  }

  async update(carId, carData) {
    try {
      const response = await this.api.put(`/cars/${carId}`, carData)
      console.log(response)
      return response
    } catch (error) {
      this.handleApiError(error, 'updating car')
    }
  }

  async delete(carId) {
    try {
      const response = await this.api.delete(`/cars/${carId}`)
      console.log(response)
      return response
    } catch (error) {
      this.handleApiError(error, 'deleting car')
    }
  }
}
