export class PayByCreditCard {
  pay(amount) {
    console.log(`Paying ${amount} using Credit Card`)
    // Logic to process credit card payment
    return true
  }

  register(details) {
    console.log(`Registering Credit Card ending in ${details.cardNumber.slice(-4)}`)
    // Logic to tokenize and save credit card
    return true
  }
}
