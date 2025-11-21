import Api from '@/services/api/useApi.js'

export class User {
  firstName = ''
  lastName = ''
  email = ''
  id = 0
  phone = ''
  api = Api.useApi()

  constructor() {}

  async fetchUserDetails() {
    try {
      const res = await this.api.get('http://localhost:3000/api/account/me', {})
      this.firstName = res.user.prenom
      this.lastName = res.user.nom
      this.email = res.user.email
      this.id = res.user.id
      this.phone = res.user.numeroTelephone
    } catch (error) {
      console.log(error)
    }
  }

  async updateUser(user) {
    try {
      const res = await this.api.put('http://localhost:3000/api/account/me', user)
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  async deleteUser() {
    try {
      const res = await this.api.delete('http://localhost:3000/api/account/me')
    } catch (error) {
      console.log(error)
    }
  }
}
