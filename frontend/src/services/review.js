import Api from '@/services/api/useApi.js'
import { Car } from '@/services/Car.js'

export class Review {
  id
  rating = 0
  commentary = ''
  firstName = ''
  lastName = ''
  date = ''
  api = Api.useApi()

  car = new Car()

  initBySettings(reviewSettings) {
    this.id = reviewSettings.id
    this.rating = reviewSettings.rating
    this.commentary = reviewSettings.commentary
    this.firstName = reviewSettings.firstName
    this.lastName = reviewSettings.lastName
    this.date = reviewSettings.date
  }

  handleApiError(error, operation) {
    console.error(`Error during ${operation}:`, error)
    // Optionally re-throw the error to be caught by the component
    throw error
  }

  /**
   * Creates a new review for the car.
   */
  async createReview() {
    try {
      // The data to send in the request body
      const reviewData = {
        rating: this.rating,
        commentary: this.commentary,
      }

      // POST to the car's review collection
      const res = await this.api.post(
        `/cars/${this.car.id}/reviews`,
        reviewData, // Send data in the body
      )
      console.log(res)
      return res
    } catch (error) {
      this.handleApiError(error, 'creating review')
    }
  }

  /**
   * Updates this specific review.
   */
  async updateReview() {
    try {
      const reviewData = {
        rating: this.rating,
        commentary: this.commentary,
      }

      // PUT to the specific review's endpoint
      const res = await this.api.put(
        `/reviews/${this.id}`,
        reviewData, // Send data in the body
      )
      console.log(res)
      return res
    } catch (error) {
      this.handleApiError(error, 'updating review')
    }
  }

  /**
   * Deletes this specific review.
   */
  async deleteReview() {
    try {
      // DELETE request to the specific review's endpoint
      const res = await this.api.delete(`/reviews/${this.id}`)
      console.log(res)
      return res
    } catch (error) {
      this.handleApiError(error, 'deleting review')
    }
  }
}
