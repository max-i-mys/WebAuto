"use strict";
const CARS = [...DATA];
const carListEl = document.getElementById("carList");

// {
//     "id": "89aed5b8c686ebd713a62873e4cd756abab7a106",
//     "make": "BMW",
//     "model": "M3",
//     "year": 2010,
//     "img": "http://dummyimage.com/153x232.jpg/cc0000/ffffff",
//     "color": "Goldenrod",
//     "vin": "1G6DW677550624991",
//     "country": "United States",
//     "rating": 1,
//     "price": 2269,
//     "views": 5,
//     "seller": "Ellery Girardin",
//     "vip": true,
//     "top": false,
//     "timestamp": "1601652988000",
//     "phone": "+1 (229) 999-8553",
//     "fuel": "Benzin",
//     "engine_volume": 1.4,
//     "transmission": "CVT",
//     "odo": 394036,
//     "consume": { "road": 4.8, "city": 12.3, "mixed": 8.4 }
//   }
renderCards(CARS, carListEl);

function renderCards(cars, carList) {
	for (let i = 0; i < cars.length; i++) {
		const car = cars[i];
		const htmlString = createCardHTML(car);
		carList.insertAdjacentHTML("beforeEnd", htmlString);
	}
}

function createCardHTML(car) {
	return `<div class="card mb-3">
    <div class="row g-0">
      <div class="col-4">
        <img class="card-img" src="${car.img}" alt="${car.make} ${car.model}" loading="lazy" width="1" height="1" />
      </div>
      <div class="col-8">
        <div class="card-body">
          <h5 class="card-title text-primary">${car.make} ${car.model} ${car.engine_volume} (${car.year})</h5>
          <h6 class="car-price text-success">${car.price}$</h6>
          <a href="tel:${car.phone}" class="btn btn-success">Call</a>
        </div>
      </div>
      <div class="col-12 card-footer text-muted d-flex justify-content-between">
          <small class="text-muted">${car.timestamp}</small>
          <small class="text-muted">${car.views}</small>
        </div>
    </div>
  </div>`;
}
