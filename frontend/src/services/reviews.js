import Api from '@/services/api/useApi.js'
import { Review } from '@/services/review.js'

export class Reviews {
  centralizedReviews = []
  averageRating = 0
  api = Api.useApi()

  async fetchReviewsByCar(id_Car) {
    try {
      const res = await this.api.get(`/cars/${id_Car}/reviews`)
      console.log(res)
      this.centralizedReviews.push(
        ...res.data.reviews.map((review) => this.createReviewFromApiData(review)),
      )
      this.averageRating =
        this.centralizedReviews.reduce((partialSum, a) => partialSum + a.rating, 0) /
        this.centralizedReviews.length
    } catch (error) {
      console.log(error)
    }
  }

  createReviewFromApiData(reviewApiData) {
    const review = new Review()
    console.log(reviewApiData)
    review.initBySettings({
      id: reviewApiData.id,
      rating: reviewApiData.rating,
      commentary: reviewApiData.comment,
      firstName: reviewApiData.reviewer.firstName,
      lastName: reviewApiData.reviewer.lastName,
      date: reviewApiData.createdAt,
    })
    return review
  }
}
