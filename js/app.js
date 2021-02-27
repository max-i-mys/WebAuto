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

let euroExchange = 0.82;
renderCards(CARS, carListEl);

function renderCards(cars, carList) {
	for (let i = 0; i < cars.length; i++) {
		const car = cars[i];
		const htmlString = createCardHTML(car);
		carList.insertAdjacentHTML("beforeEnd", htmlString);
	}
}

function createCardHTML(car) {
	const not = document.querySelectorAll("[data-car=not]");
	for (let key of not) {
		key.remove();
	}
	return `
	<div class="card mb-4 p-5">
	<div class="row g-0">
		<div class="col-4">
			<img class="card-img" src="${car.img}" alt="${car.make} ${
		car.model
	}" loading="lazy" width="1"
				height="1" />
		</div>
		<div class="col-8">
			<div class="row card-body">
				<div class="col-7">
					<a href="#" class="card-title fw-bold mb-4">${car.make} ${car.year}(${
		car.color
	})</a>
					<ul class="card__properties">
						<li class="card__property" data-car="${
							car.odo || "not"
						}"><i class="_icon-speed icons-theme-1"></i>${car.odo} km</li>
						<li class="card__property" data-car="${
							car.engine_volume || "not"
						}"><i class="_icon-fuel icons-theme-1"></i>${
		car.engine_volume
	}L., ${car.fuel}</li>
						<li class="card__property" data-car="${
							car.transmission || "not"
						}"><i class="_icon-broadcast icons-theme-1"></i>${
		car.transmission
	}</li>
						<li class="card__property" data-car="${
							car.country || "not"
						}"><i class="_icon-nav icons-theme-1"></i>${car.country}</li>
					</ul>
					<h4 class="card__title">Fuel consumption (l/100 km)</h4>
					<div class="card__fuel">
					<i class="_icon-road"}">${car?.consume?.road || "n/a"}</i>
						<i class="_icon-city"}">${car?.consume?.city || "n/a"}</i>
						<i class="_icon-mix" }">${car?.consume?.mixed || "n/a"}</i>
					</div>
					<i class="_icon-vin card__vin" data-car="${car.vin || "not"}">${car.vin}</i>
				</div>
				<div class="col-5 card__lbox">
					<h6 class="car-price text-success" data-car="${
						car.price || "not"
					}" data-euro="${Math.round(car.price * euroExchange)}">${
		car.price
	} $</h6>
					<h4 class="card__saler" data-car="${
						car.seller || "not"
					}"><i class="_icon-user icons-theme-1"></i>${car.seller}</h4>
					<div class="card__labels">
						<span class="label" data-car="${
							car.bargain || car.bargain == false || "not"
						}">${car.bargain ? "Bargain" : "Without bargain"}</span>
						<span class="label" data-car="${car.exchange || "not"}">Exchange</span>
					</div>
					<span class="views">Views ${car.views}</span>
					<span class="date">Created ${car.timestamp}</span>
					<div class="card__interaction">
						<a href="tel:${car.phone}"><i class="_icon-tel"></i></a>
						<button id="userStar"><i class="_icon-star"></i></button>
						<button id="userCompare"><i class="_icon-compare"></i></button>
					</div>
				</div>
			</div>`;
}

userStar.onclick = () => userStar.classList.toggle("active");
userCompare.onclick = () => userCompare.classList.toggle("active");
