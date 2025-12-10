import Api from '@/services/api/useApi.js'

export class User {
  firstName = ''
  lastName = ''
  email = ''
  id = 0
  phone = ''
  address = {
    street: '',
    city: '',
    zipCode: '',
    country: '',
  }
  api = Api.useApi()

  constructor() {}

  async fetchUserDetails() {
    try {
      const res = await this.api.get('http://localhost:3000/api/account/me', {})
      console.log(res)
      this.firstName = res.user.name
      this.lastName = res.user.surname
      this.email = res.user.email
      this.id = res.user.id
      this.phone = res.user.phonenumber
      this.address = {
        street: res.user.street,
        city: res.user.city,
        zipCode: res.user.zipcode,
        country: res.user.country,
      }
    } catch (error) {
      console.log(error)
    }
  }

  async update(user) {
    try {
      const res = await this.api.put('http://localhost:3000/api/account/me', user)
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  async delete() {
    try {
      const res = await this.api.delete('http://localhost:3000/api/account/me')
    } catch (error) {
      console.log(error)
    }
  }
}
