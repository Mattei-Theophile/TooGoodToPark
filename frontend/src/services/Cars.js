import Api from '@/services/api/useApi.js'
import { Car } from '@/services/Car.js'

export class Cars {
  centralizedCars = []
  api = Api.useApi()

  async fetchCars(limit = 0) {
    try {
      const res = await this.api.get('/cars', {
        params: {
          index: 0,
          limit: limit,
        },
      })
      await this.processCarData(res.data)
    } catch (error) {
      this.handleApiError(error, 'fetching cars')
    }
  }

  async fetchMyCars() {
    try {
      const res = await this.api.get('/cars/mycars')
      await this.processCarData(res.data)
    } catch (error) {
      this.handleApiError(error, 'fetching my cars')
    }
  }

  async searchCars(filters) {
    try {
      const res = await this.api.get('/cars/search', {
        params: {
          ...filters,
        },
      })
      await this.processCarData(res.data)
    } catch (error) {
      this.handleApiError(error, 'searching cars')
    }
  }

  async fetchCarAvailable(startDate, endDate, city, passenger) {
    try {
      const res = await this.api.get(
        `/cars/available?startDate=${startDate}&endDate=${endDate}&location=${city}&passenger=${passenger}`,
      )
      if (res) {
        this.centralizedCars = await Promise.all(res.data.map((car) => this.mapApiDataToCar(car)))
      }
    } catch (error) {
      this.handleApiError(error, 'fetching available cars')
    }
  }

  async mapApiDataToCar(carApiData) {
    console.log(carApiData)
    const car = new Car()
    car.initAllBySettings({
      ID_Car: carApiData.ID_Car,
      Brand_Car: carApiData.Brand_Car,
      Model_Car: carApiData.Model_Car,
      Description_Car: carApiData.Description_Car,
      Mileage_Car: carApiData.Mileage_Car,
      Price_Car: carApiData.Price_Car,
      Year_Car: carApiData.Year_Car,
      LicensePlate_Car: carApiData.LicensePlate_Car,
      Passenger_Car: carApiData.Passenger_Car,
      Location_Car: carApiData.Location_Car,
      Status_Car: carApiData.Status_Car,
    })
    console.log(car)
    await car.fetchCarImages()
    return car
  }

  async processCarData(apiData) {
    const cars = await Promise.all(apiData.map((car) => this.mapApiDataToCar(car)))
    this.centralizedCars.push(...cars)
  }

  handleApiError(error, operation) {
    console.error(`Error during ${operation}:`, error)
  }
}
