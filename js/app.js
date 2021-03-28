"use strict"
//!----------------------- Variable Start ----------------------------//

let CARS = JSON.parse(DATA)
const carListEl = document.getElementById("carList")
const euroExchange = 0.82
const masonryBtnsEl = document.getElementById("masonryBtns")
const sortSelectEl = document.getElementById("sortSelect")
const searchFormEl = document.getElementById("searchForm")
const filterFormEl = document.getElementById("filterForm")
const filterBtnApplyEl = document.getElementById("filterBtnApply")
const wishListLinkEl = document.getElementById("wishListLink")
const wishlistCounterEl = document.getElementById("wishlistCounter")
const homeLinkEl = document.getElementById("homeLink")
const paginationListEl = document.getElementById("paginationList")

if (!localStorage.getItem("wishList")) {
	localStorage.setItem("wishList", JSON.stringify([]))
}
const wishListLS = JSON.parse(localStorage.getItem("wishList"))

//!----------------------- Variable End ----------------------------//

renderCards(CARS, carListEl)

//*----------------------- A home page link Start ----------------------------//
homeLinkEl.addEventListener("click", event => {
	event.preventDefault()
	CARS = JSON.parse(DATA)
	renderCards(CARS, carListEl, true)
})
//*----------------------- A home page link End ----------------------------//

//*----------------------- Favorites and Comparison Start ----------------------------//

function setValueLink(wishList, wishListLink) {
	if (wishList.length == 0) {
		wishListLink.classList.add("disabled")
	} else wishListLink.classList.remove("disabled")
}

wishlistCounterEl.innerHTML = wishListLS.length
setValueLink(wishListLS, wishListLinkEl)

carListEl.addEventListener("click", event => {
	const btnStarEl = event.target.closest(".card__btn-star")
	const btnCompareEl = event.target.closest(".card__btn-compare")
	if (btnStarEl) {
		const carId = btnStarEl.closest(".car").dataset.id
		const wishedCarIndex = wishListLS.findIndex(id => id === carId)
		if (wishedCarIndex !== -1) {
			wishListLS.splice(wishedCarIndex, 1)
			btnStarEl.classList.remove("active")
		} else {
			wishListLS.push(carId)
			btnStarEl.classList.add("active")
		}
		setValueLink(wishListLS, wishListLinkEl)
		wishlistCounterEl.innerHTML = wishListLS.length
		localStorage.setItem("wishList", JSON.stringify(wishListLS))
	} else if (btnCompareEl) {
		btnCompareEl.classList.toggle("active")
	}
})

wishListLinkEl.addEventListener("click", function (event) {
	event.preventDefault()
	if (wishListLS.length > 0) {
		CARS = JSON.parse(DATA).filter(car => wishListLS.includes(car["id"]))
		renderCards(CARS, carListEl, true)
	}
})

//*----------------------- Favorites and Comparison End ----------------------------//

//*----------------------- Сhange the content output grid Start ----------------------------//
masonryBtnsEl.addEventListener("click", event => {
	const btnMasonryEl = event.target.closest(".btn")
	if (btnMasonryEl) {
		const action = btnMasonryEl.dataset.action
		let carListMasonryCount = ""

		carListEl.classList.forEach(className => {
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
	getSimbildings(btnMasonryEl).forEach(sibling => {
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
	renderCards(CARS, carListEl, true)
})
//*----------------------- Sort End ----------------------------//

//*----------------------- Search Start ----------------------------//
searchFormEl.addEventListener("submit", function (event) {
	event.preventDefault()
	const query = this.search.value
		.trim()
		.toLowerCase()
		.split(" ")
		.filter(word => !!word)
	const searchFields = ["make", "model", "year"]

	CARS = JSON.parse(DATA).filter(car => {
		return query.every(word => {
			return searchFields.some(field => {
				return String(car[field]).trim().toLowerCase().includes(word)
			})
		})
	})

	renderCards(CARS, carListEl, true)
})
//*----------------------- Search End ----------------------------//
//*----------------------- Filter Start ----------------------------//

//----------------------- Filter Counter Start -----------------//
filterFormEl.addEventListener("click", function (event) {
	const inputsEl = event.target.closest(".filter__checkbox")
	const accWrapEl = event.target.closest(".acc-wrap")
	const accHeadEl = event.target.closest(".acc-head")
	const btnResetEl = event.target.closest(".btn-reset")
	if (inputsEl) {
		const inputCheck = Array.from(this).some(item => item.checked)
		if (inputCheck) {
			filterBtnApplyEl.innerHTML = `Show (${filtering(this)})`
			filterBtnApplyEl.disabled = false
			this.querySelector(".btn-reset").disabled = false
		} else {
			filterBtnApplyEl.innerHTML = `Filter`
			filterBtnApplyEl.disabled = true
			this.querySelector(".btn-reset").disabled = true
		}
	} else if (accHeadEl) {
		accordeon(accWrapEl)
	} else if (btnResetEl) {
		filterBtnApplyEl.innerHTML = `Filter`
		filterBtnApplyEl.disabled = true
	}
})
//----------------------- Filter Counter End -----------------//

filterFormEl.addEventListener("submit", function (event) {
	event.preventDefault()
	filtering(this)
	renderCards(CARS, carListEl, true)
})

function filtering(formEl) {
	const query = []
	const filterFields = [
		"make",
		"model",
		"year",
		"color",
		"country",
		"fuel",
		"transmission",
	]

	filterFields.forEach(field => {
		const inputs =
			formEl[field].length > 0 ? Array.from(formEl[field]) : [formEl[field]]
		query.push(
			inputs.reduce((acc, input) => {
				if (input.checked) {
					return [...acc, input.value]
				} else {
					return acc
				}
			}, [])
		)
	})
	CARS = JSON.parse(DATA).filter(car => {
		return query.every((values, i) => {
			return values.length == 0
				? true
				: values.includes(String(car[filterFields[i]]))
		})
	})
	return CARS.length
}

renderFilterForm(CARS, filterFormEl)

function renderFilterForm(cars, filterForm) {
	filterForm.insertAdjacentHTML("afterBegin", createFilterForm(cars))
}

function createFilterForm(cars) {
	const filterFields = [
		"make",
		"model",
		"year",
		"color",
		"country",
		"fuel",
		"transmission",
	]
	let fieldsetsHtml = ""
	filterFields.forEach(field => {
		const values = new Set(cars.map(car => car[field]).sort())
		fieldsetsHtml += createFilterFieldset(field, values)
	})
	return fieldsetsHtml
}

function createFilterFieldset(field, values) {
	let inputsHtml = ""
	values.forEach(value => (inputsHtml += createFilterCheckbox(field, value)))
	return `<fieldset class="mb-3 filter__fildset acc-wrap">
				<legend class="mb-3 filter__legend acc-head">${field}<i class="fas fa-caret-right"></i></legend>
				<div class="inputs-list-wrap acc-collapse">
					<div class="inputs-list acc-body">
						${inputsHtml}
					</div>
				</div>
			</fieldset>`
}
function createFilterCheckbox(field, value) {
	return `<label class="d-flex filter__label">
		<input type="checkbox" name="${field}" value="${value}" class="filter__checkbox">
		<span class="title-checkbox">${value}</span>
	</label>`
}
//*----------------------- Filter End ----------------------------//

//*----------------------- Filter Accordeon Menu Start ----------------------------//
function accordeon(wrapEl) {
	if (!wrapEl.classList.contains("active")) {
		wrapEl.classList.add("active")
		wrapEl.querySelector(".acc-collapse").style.height =
			wrapEl.querySelector(".acc-body").getBoundingClientRect().height + "px"
	} else {
		wrapEl.classList.remove("active")
		wrapEl.querySelector(".acc-collapse").style.height = 0
	}
}
//*----------------------- Filter Accordeon Menu End ----------------------------//

//*----------------------- Сhange the content output grid Start ----------------------------//
function renderCards(cars, carList, clear) {
	clear && (carList.innerHTML = "")
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
	<div class="car py-5 border-bottom" data-id="${car.id}">
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
						<button class="card__btn-interaction card__btn-star ${
							wishListLS.includes(car.id) ? "active" : ""
						}"><i class="_icon-star"></i></button>
						<button class="card__btn-interaction card__btn-compare"><i class="_icon-compare"></i></button>
					</div>
				</div>
			</div>`
}
//------------------------- Utils start--------------------------//

function getSimbildings(domEl) {
	return Array.from(domEl.parentElement.children).filter(
		value => value != domEl
	)
}
//------------------------- Utils end--------------------------//

//*----------------------- Pagination Start ----------------------------//
renderPaginItem(paginationListEl)

function createPaginItem(cars, numberCarPage) {
	let listsHtml = ""
	for (let i = 1; i <= Math.floor(cars.length / numberCarPage); i++) {
		listsHtml += `<li class="page-nav__item" data-item="${i}"><a href="#" class="page-nav__link" >${i}</a></li>`
	}
	return listsHtml
}
function renderPaginItem(paginationList) {
	paginationList.insertAdjacentHTML("afterBegin", createPaginItem(CARS, 6))
}

//-----------------------------------------------------------------------//

paginationListEl.firstElementChild.classList.add("active")

function addClassSiblings(pageItem) {
	if (pageItem.previousElementSibling && pageItem.nextElementSibling) {
		pageItem.previousElementSibling.classList.add("visible")
		pageItem.nextElementSibling.classList.add("visible")
		if (
			pageItem.previousElementSibling.previousElementSibling &&
			pageItem.nextElementSibling.nextElementSibling
		) {
			pageItem.previousElementSibling.previousElementSibling.classList.add(
				"visible"
			)
			pageItem.nextElementSibling.nextElementSibling.classList.add("visible")
		}
	} else if (pageItem.nextElementSibling) {
		pageItem.nextElementSibling.classList.add("visible")
		if (pageItem.nextElementSibling.nextElementSibling) {
			pageItem.nextElementSibling.nextElementSibling.classList.add("visible")
		}
	} else if (pageItem.previousElementSibling) {
		pageItem.previousElementSibling.classList.add("visible")
		if (pageItem.previousElementSibling.previousElementSibling)
			pageItem.previousElementSibling.previousElementSibling.classList.add(
				"visible"
			)
	}
}

addClassSiblings(paginationListEl.firstElementChild)

paginationListEl.addEventListener("click", function (event) {
	event.preventDefault()
	const pageItemActive = event.target.closest(".page-nav__item")

	if (pageItemActive) {
		Array.from(this.children).forEach(item => {
			item.classList.remove("active")
			item.classList.remove("visible")
		})
		pageItemActive.classList.add("active")
		addClassSiblings(pageItemActive)
	}
})

//*----------------------- Pagination End ----------------------------//
