export class PaymentStrategy {
  constructor() {
    this.strategy = null
  }

  setStrategy(strategy) {
    this.strategy = strategy
  }

  pay(amount) {
    if (!this.strategy) {
      throw new Error('Payment strategy is not set')
    }
    return this.strategy.pay(amount)
  }

  register(accountDetails) {
    if (!this.strategy) {
      throw new Error('Payment strategy is not set')
    }
    return this.strategy.register(accountDetails)
  }
}
