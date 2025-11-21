import Api from '@/services/api/useApi.js'
import { Car } from '@/services/Car.js'

export class Cars {
  centralizedCars = []
  api = Api.useApi()
  constructor() {}

  getLength() {
    return this.centralizedCars.length
  }

  getAllCars() {
    return this.centralizedCars
  }

  async fetchCars(limit = 0) {
    try {
      const res = await this.api.get('/cars', {
        params: {
          index: 0,
          limit: limit,
        },
      })

      this.centralizedCars.push(...res.data.map((car) => this.createCarFromApiData(car)))
      console.log(this.centralizedCars)
    } catch (error) {
      console.log(error)
    }
  }
  async fetchMyCars() {
    try {
      const res = await this.api.get('/cars/mycars')
      console.log(res)

      this.centralizedCars.push(...res.data.map((car) => this.createCarFromApiData(car)))
      console.log(this.centralizedCars)
    } catch (error) {
      console.log(error)
    }
  }

  async searchCars(filters) {
    try {
      console.log('Searching with filters:', filters)
      const res = await this.api.get('/cars/search', {
        params: {
          ...filters,
        },
      })
      this.centralizedCars.push(...res.data.map((car) => this.createCarFromApiData(car)))
      console.log(this.centralizedCars)
    } catch (error) {
      console.error('Error during search:', error)
    }
  }

  async fetchCarAvailable(startDate, endDate) {
    try {
      const res = await this.api.get('/cars/available', {
        params: {
          startDate: startDate,
          endDate: endDate,
        },
      })
      this.centralizedCars.push(...res.data.map((car) => this.createCarFromApiData(car)))
      console.log(this.centralizedCars)
    } catch (error) {
      console.log(error)
    }
  }

  createCarFromApiData(carApiData) {
    const car = new Car()
    car.initAllBySettings({
      ID_Car: carApiData.ID_Car,
      Marque_Car: carApiData.Marque_Car,
      Modele_Car: carApiData.Modele_Car,
      Description_Car: carApiData.Description_Car,
      Kilometrage_Car: carApiData.Kilometrage_Car,
      Price_Car: carApiData.Price_Car,
      Date_Car: carApiData.Date_Car,
    })
    car.fetchCarImages()
    return car
  }
}
