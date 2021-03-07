"use strict"
//!----------------------- Variable Start ----------------------------//

const CARS = [...DATA]
const carListEl = document.getElementById("carList")
const euroExchange = 0.82
const masonryBtnsEl = document.getElementById("masonryBtns")

//!----------------------- Variable End ----------------------------//

renderCards(CARS, carListEl)

//*----------------------- Favorites and Comparison Start ----------------------------//
carListEl.addEventListener("click", (event) => {
	const btnInteractionEl = event.target.closest(".card__btn-interaction")
	if (btnInteractionEl) {
		btnInteractionEl.classList.toggle("active")
	}
})
//*----------------------- Favorites and Comparison End ----------------------------//

//*----------------------- Сhange the content output grid Start ----------------------------//
masonryBtnsEl.addEventListener("click", (event) => {
	const btnMasonryEl = event.target.closest(".btn")
	if (btnMasonryEl) {
		const action = btnMasonryEl.dataset.action
		let carListMasonryCount = ""

		carListEl.classList.forEach((className) => {
			if (className.includes("row-cols-")) {
				let index = className.lastIndexOf("-")
				carListMasonryCount = className.slice(index + 1)
			}
		})
		carListEl.classList.remove(`row-cols-${carListMasonryCount}`)
		carListEl.classList.add(`row-cols-${action}`)
	}

	btnMasonryEl.classList.remove("btn-secondary")
	btnMasonryEl.classList.add("btn-success")
	getSimbildings(btnMasonryEl).forEach((sibling) => {
		sibling.classList.remove("btn-success")
		sibling.classList.add("btn-secondary")
	})
})
//*----------------------- Сhange the content output grid Start ----------------------------//
function renderCards(cars, carList) {
	for (let i = 0; i < cars.length; i++) {
		const car = cars[i]
		const htmlString = createCardHTML(car)
		carList.insertAdjacentHTML("beforeEnd", htmlString)
	}
}

function createCardHTML(car) {
	let starsHtml = ""
	for (let i = 0; i < 5; i++) {
		if (car.rating > i && car.rating != i + 0.5) {
			starsHtml += `<i class="fas fa-star"></i>`
		} else if (car.rating == i + 0.5) {
			starsHtml += `<i class="fas fa-star-half-alt"></i>`
		} else {
			starsHtml += `<i class="far fa-star"></i>`
		}
	}
	return `
	<div class="p-5 border-bottom">
	<div class="row g-0">
		<div class="col-4 card-img-wrap">
			<img class="card-img" src="${car.img}" alt="${car.make} ${
		car.model
	}" loading="lazy" width="1"
				height="1" />
		</div>
		<div class="col-8 card-body-wrap">
			<div class="row card-body">
				<div class="col-7">
					<a href="#" class="card-title fw-bold mb-2">${car.make} ${car.year}(${
		car.color
	})</a>
	<div class="card-rating text-warning mb-3">${starsHtml}</div>
					<ul class="card__properties">
					${
						car.odo
							? `<li class="card__property"><i class="_icon-speed icons-theme-1"></i>${car.odo} km</li>`
							: ""
					}
					${
						car.engine_volume
							? `<li class="card__property"><i class="_icon-fuel icons-theme-1"></i>${car.engine_volume}L., ${car.fuel}</li>`
							: ""
					}
					${
						car.transmission
							? `<li class="card__property"><i class="_icon-broadcast icons-theme-1"></i>${car.transmission}</li>`
							: ""
					}
					
						${
							car.country
								? `<li class="card__property"><i class="_icon-nav icons-theme-1"></i>${car.country}</li>`
								: ""
						}
					</ul>
					<h4 class="card__title">Fuel consumption (l/100 km)</h4>
					<div class="card__fuel">
					<i class="_icon-road">${car.consume?.road || "n/a"}</i>
						<i class="_icon-city">${car.consume?.city || "n/a"}</i>
						<i class="_icon-mix">${car.consume?.mixed || "n/a"}</i>
					</div>
					${car.vin ? `<i class="_icon-vin card__vin">${car.vin}</i>` : ""}
				</div>
				<div class="col-5 card__lbox">
				${
					car.price
						? `<h6 class="car-price text-success" data-euro="${Math.round(
								car.price * euroExchange
						  )}">${car.price}$</h6>`
						: ""
				}
				${
					car.seller
						? `<h4 class="card__saler"><i class="_icon-user icons-theme-1"></i>${car.seller}</h4>`
						: ""
				}
					<div class="card__labels">
					${
						car.bargain || car.bargain == false
							? `<span class="label">${
									car.bargain ? "Bargain" : "Without bargain"
							  }</span>`
							: ""
					}
						${car.exchange ? `<span class="label">Exchange</span>` : ""}
					</div>
					<span class="views">Views ${car.views}</span>
					<span class="date">Created ${car.timestamp}</span>
					<div class="card__interaction">
						<a href="tel:${car.phone}"><i class="_icon-tel"></i></a>
						<button class="card__btn-interaction"><i class="_icon-star"></i></button>
						<button class="card__btn-interaction"><i class="_icon-compare"></i></button>
					</div>
				</div>
			</div>`
}
//------------------------- Utils start--------------------------//

function getSimbildings(domEl) {
	return Array.from(domEl.parentElement.children).filter(
		(value) => value != domEl
	)
}
//------------------------- Utils end--------------------------//
