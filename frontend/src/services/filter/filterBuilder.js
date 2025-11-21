export class FilterBuilder {
  constructor() {
    this.query = {
      term: '',
      filters: {},
    }
  }

  withTerm(term) {
    this.query.term = term
    return this
  }
  withCategory(category) {
    this.query.filters.category = category
    return this
  }

  withPriceRange(min, max) {
    this.query.filters.price = {}
    if (min) {
      this.query.filters.price.min = min
    }
    if (max) {
      this.query.filters.price.max = max
    }
    return this
  }

  build() {
    return this.query
  }
}

const userInput = {
  searchTerm: 'Gaming Laptop',
  category: 'electronics',
  minPrice: 1200,
  inStock: true,
}

const searchFilter = new FilterBuilder()
  .withTerm(userInput.searchTerm)
  .withCategory(userInput.category)
  .withPriceRange(userInput.minPrice, null)
  .build()

console.log(searchFilter)
