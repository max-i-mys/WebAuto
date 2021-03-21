"use strict"
//!----------------------- Variable Start ----------------------------//

let CARS = JSON.parse(DATA)
const carListEl = document.getElementById("carList")
const euroExchange = 0.82
const masonryBtnsEl = document.getElementById("masonryBtns")
const sortSelectEl = document.getElementById("sortSelect")
const searchFormEl = document.getElementById("searchForm")
const filterFormEl = document.getElementById("filterForm")
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
//*----------------------- Sort Start ----------------------------//
sortSelectEl.addEventListener("change", function (event) {
	const [key, order] = this.value.split("/")
	CARS.sort((a, b) => {
		if (typeof a[key] != "string") {
			return (a[key] - b[key]) * order
		} else {
			return a[key].localeCompare(b[key]) * order
		}
	})
	renderCards(CARS, carListEl)
})
//*----------------------- Sort End ----------------------------//

//*----------------------- Search Start ----------------------------//
searchFormEl.addEventListener("submit", function (event) {
	event.preventDefault()
	const query = this.search.value
		.trim()
		.toLowerCase()
		.split(" ")
		.filter((word) => !!word)
	const searchFields = ["make", "model", "year"]

	CARS = JSON.parse(DATA).filter((car) => {
		return query.every((word) => {
			return searchFields.some((field) => {
				return String(car[field]).trim().toLowerCase().includes(word)
			})
		})
	})

	renderCards(CARS, carListEl)
})
//*----------------------- Search End ----------------------------//
let i = 0
//*----------------------- Filter Start ----------------------------//

renderFilterForm(CARS, filterFormEl)

function renderFilterForm(cars, filterForm) {
	filterForm.insertAdjacentHTML("afterBegin", createFilterForm(cars))
}

function createFilterForm(cars) {
	const filterFields = ["make", "fuel", "transmission"]
	let fieldsetsHtml = ""
	filterFields.forEach((field) => {
		const values = new Set(cars.map((car) => car[field]).sort())
		fieldsetsHtml += createFilterFieldset(field, values)
	})
	return fieldsetsHtml
}

function createFilterFieldset(field, values) {
	let inputsHtml = ""
	values.forEach((value) => (inputsHtml += createFilterCheckbox(field, value)))
	return `<fieldset class="mb-3 filter__fildset">
				<legend class="mb-3 filter__legend">${field}</legend>
				<div class="inputs-list" data-count="${i++}">
					${inputsHtml}
				</div>
			</fieldset>`
}
function createFilterCheckbox(field, value) {
	return `<label class="d-flex filter__label">
		<input type="checkbox" name="${field}" value="${value}" class="filter__checkbox">
		<span>${value}</span>
	</label>`
}

//*----------------------- Filter End ----------------------------//
//*----------------------- Сhange the content output grid Start ----------------------------//
function renderCards(cars, carList) {
	carList.innerHTML = ""
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
	<div class="py-5 border-bottom">
	<div class="row g-0">
		<div class="col-4 card-img-wrap d-flex position-relative">
			<img class="card-img" src="${car.img}" alt="${car.make} ${
		car.model
	}" loading="lazy" width="1"
				height="1" />
				${
					car.vip
						? `<div class="vip__card-wrap">
						<div class="card__vip"><span>V</span><span>I</span><span>P</span></div>
						</div>`
						: ""
				}
		</div>
		<div class="col-8 card-body-wrap">
			<div class="row card-body">
				<div class="col-7">
					<a href="#" class="card-title fw-bold mb-2">${car.make} ${car.model} ${
		car.year
	}(${car.color})</a>
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

let divsListEl = filterFormEl.querySelectorAll(".inputs-list")

const heightDivsList = Array.from(divsListEl).map((item) => item.clientHeight)

divsListEl.forEach((item) => item.setAttribute("style", "height: 0"))

filterFormEl.addEventListener("click", (event) => {
	const filterLegendEl = event.target.closest(".filter__legend")

	if (filterLegendEl) {
		filterLegendEl.classList.toggle("active")

		const divListEl = event.target
			.closest(".filter__fildset")
			.querySelector(".inputs-list")

		const heightDivList = heightDivsList[divListEl.dataset.count]

		if (filterLegendEl.classList.contains("active")) {
			if (heightDivList > 600 && heightDivList < 1000) {
				divListEl.setAttribute(
					"style",
					`height: ${heightDivList}px; transition: 1s`
				)
			} else if (heightDivList > 1000) {
				divListEl.setAttribute(
					"style",
					`height: ${heightDivList}px; transition: 1.5s`
				)
			} else divListEl.setAttribute("style", `height: ${heightDivList}px`)
		} else {
			divListEl.style.height = "0"
		}
		console.log(heightDivList)
	} else return
})
