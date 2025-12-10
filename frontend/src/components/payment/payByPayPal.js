export class PayByPayPal {
  pay(amount) {
    console.log(`Paying ${amount} using PayPal`)
    // Logic to process PayPal payment
    return true
  }

  register(details) {
    console.log(`Registering PayPal account: ${details.email}`)
    // Logic to link PayPal account
    return true
  }
}
