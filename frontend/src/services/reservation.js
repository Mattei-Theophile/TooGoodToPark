import Api from '@/services/api/useApi.js'
import { Car } from '@/services/Car.js'
import { User } from '@/services/User.js'

export class Reservation {
  car = new Car()
  client = new User()

  id = 0
  price = 0
  status = ''
  start = ''
  end = ''
  totalDays = 0
  api = Api.useApi()

  initAllBySettings(reservationSettings) {
    this.id = reservationSettings.id
    this.price = reservationSettings.price
    this.status = reservationSettings.status
    this.start = new Date(reservationSettings.start)
    this.end = new Date(reservationSettings.end)
    this.totalDays = reservationSettings.totalDays
    this.car.initById(reservationSettings.ID_Car)
  }

  fetchReservationById() {
    try {
    } catch (error) {
      console.log(error)
    }
  }

  async fetchDisabledDates() {
    try {
      const res = await this.api.get(`/cars/${this.car.id}/reservations`)
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  async create() {
    const reservation = {
      ID_Car: this.car.id,
      startDate: this.start,
      endDate: this.end,
    }
    console.log(reservation)
    try {
      const res = await this.api.post(`/cars/reservations`, reservation)
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  async update() {
    const reservation = {
      reservationId: this.id,
      ID_Car: this.car.id,
      startDate: this.start,
      endDate: this.end,
      status: this.status,
    }

    console.log(reservation)
    try {
      const res = await this.api.put(`/cars/reservations`, reservation)
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  async delete() {
    const reservation = {
      reservationId: this.id,
      ID_Car: this.car.id,
    }
    console.log(reservation)
    try {
      const res = await this.api.delete(`/cars/reservations`, reservation)
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }
}
