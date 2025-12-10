import { Reservations } from '@/services/reservations.js'
import Api from '@/services/api/useApi.js'

export class ReservationStatistic {
  api = Api.useApi()

  async fetchMyStatisticReservation(limit = 0) {
    try {
      const res = await this.api.get(`/cars/myreservations`, {
        query: {
          limit: limit,
        },
      })
      return res.data
    } catch (error) {
      console.log(error)
    }
  }

  async fetchStatisticReservationByMonth() {
    try {
      const res = await this.api.get(`/cars/myreservations/stats/monthly`)
      console.log(res.data)
      return res.data
    } catch (error) {
      console.log(error)
    }
  }
}
