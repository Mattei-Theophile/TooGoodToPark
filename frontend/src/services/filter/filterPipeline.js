export const filterFunctions = {
  byMileage: (cars, order = 'asc') => {
    let results = cars
    if (order === 'asc') {
      results = results.sort((a, b) => a.mileage - b.mileage)
    } else {
      results = results.sort((a, b) => b.mileage - a.mileage)
    }
    return results
  },

  byPrice: (cars, order = 'asc') => {
    let results = cars
    if (order === 'asc') {
      results = results.sort((a, b) => a.price - b.price)
    } else {
      results = results.sort((a, b) => b.price - a.price)
    }
    return results
  },

  byRating: (cars, order = 'asc') => {
    let results = cars
    if (order === 'asc') {
      results = cars.sort((a, b) => a.Average_Rating - b.Average_Rating)
    } else {
      results = cars.sort((a, b) => b.Average_Rating - a.Average_Rating)
    }
    return results
  },
  byBrand: (cars, brand) => {
    return cars.filter((cars) => cars.brand === brand)
  },
  byModel: (cars, model) => {
    return cars.filter((cars) => cars.Modele_Car === model)
  },
  byLocation: (cars, location) => {
    return cars.filter((cars) => cars.Location_car === location)
  },

  byYearOfCreation: (cars, year, order = 'asc') => {
    let results = cars
    if (order === 'asc') {
      results = cars.sort((a, b) => a.Annee_Car - b.Annee_Car)
    } else {
      results = cars.sort((a, b) => b.Annee_Car - a.Annee_Car)
    }
    return results
  },
}
