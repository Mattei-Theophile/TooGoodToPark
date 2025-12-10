import Api from '@/services/api/useApi.js'
import { Reservation } from '@/services/reservation.js'
export class Reservations {
  centralizedReservations = []
  api = Api.useApi()

  async fetchMyReservation(limit = 0) {
    try {
      const res = await this.api.get(`/cars/myreservations`, {
        query: {
          limit: limit,
        },
      })
      console.log(res)
      this.centralizedReservations.push(
        ...res.data.reservations.map((reservation) =>
          this.createReservationFromApiData(reservation),
        ),
      )
    } catch (error) {
      console.log(error)
    }
  }

  createReservationFromApiData(carApiData) {
    const reservation = new Reservation()
    reservation.initAllBySettings({
      ID_Car: carApiData.car.id,
      id: carApiData.id,
      price: carApiData.price,
      status: carApiData.status,
      start: carApiData.startDate,
      end: carApiData.endDate,
      totalDays: carApiData.totalDays,
    })

    return reservation
  }
}
