import { availableCountries } from 'countrySeeds'

let numOfSquares = 8
let pickedCountry
let countries = []
const squares = document.querySelectorAll(".square")
const messageDisplay = document.querySelector("#message")
const h1 = document.querySelector("h1")
const resetButton = document.querySelector("#reset")
const latitude = document.getElementById('latitude')
const longitude = document.getElementById('longitude')
const heading = document.getElementById('heading')
const openModalButtons = document.querySelectorAll("[data-modal-target]")
const closeModalButtons = document.querySelectorAll("[data-close-button]")
const overlay = document.getElementById("overlay")

// ------------------------------------------- Game Logic --------------------------------------------------------------

const init = () => {
	setUpSquares()
	reset()
}


const setUpSquares = () => {
	for (var i = 0; i < squares.length; i++) {
		squares[i].addEventListener("click", function () {
			var clickedCountry = this.innerHTML
			if (clickedCountry === pickedCountry.name) {
				messageDisplay.textContent = "Correct"
				resetButton.textContent = "Play Again?"
				heading.innerHTML += " " + clickedCountry
				//changeCountry(clickedCountry)
			} else {
				this.style.backgroundColor = "steelblue"
				this.style.border = "none"
				this.style.color = "steelblue"
				messageDisplay.textContent = "Try Again!"
			}
		})
	}
}


const reset = () => {
	countries = generateRandomCountries(numOfSquares)
	//console.log(countries)
	pickedCountry = pickCountry()
	latitude.innerHTML = pickedCountry.latitude.toFixed(3)
	longitude.innerHTML = pickedCountry.longitude.toFixed(3)
	resetButton.innerHTML = "New Countries"
	messageDisplay.innerHTML = ""
	heading.innerHTML = "Name that country?"
	for (let i = 0; i < squares.length; i++) {
		if (countries[i]) {
			squares[i].style.display = "block"
			squares[i].innerHTML = countries[i].name
			squares[i].style.backgroundColor = "gainsboro"
			squares[i].style.color = "black"
			squares[i].style.border = ".1rem solid white"
		} else {
			squares[i].style.display = "none"
		}

	}
	//h1.style.backgroundColor = "steelblue"
}


resetButton.addEventListener("click", function () {
	reset()
})

const generateRandomCountries = (numOfSquares) => {
	let countryList = []
	countryList.push(availableCountries[Math.floor(Math.random() * availableCountries.length)])
	//console.log(countryList[0].name)
	let newCountry
	let found
	for (let i = 1; i < numOfSquares; i++) {
		found = false
		newCountry = availableCountries[Math.floor(Math.random() * availableCountries.length)]
		//console.log(newCountry.name)
		for (let j = 0; j < countryList.length; j++) {
			if (countryList[j].name === newCountry.name) {
				found = true
				break
			}
		}
		if (!found) {
			countryList.push(newCountry)
		}
		else {
			i--
		}
	}
	return countryList
}

const pickCountry = () => {
	return countries[Math.floor(Math.random() * numOfSquares)]
}

// ------------------------------------------- Popup help screen --------------------------------------------------

const openModal = (modal) => {
	if (modal === null) return
	modal.classList.add('active')
	overlay.classList.add('active')
}

const closeModal = (modal) => {
	if (modal === null) return
	modal.classList.remove('active')
	overlay.classList.remove('active')
}

overlay.addEventListener('click', () => {
	const modals = document.querySelectorAll('.modal.active')
	modals.forEach(modal => {
		closeModal(modal)
	})
})

openModalButtons.forEach(button => {
	button.addEventListener('click', () => {
		const modal = document.querySelector(button.dataset.modalTarget)
		openModal(modal)
	})
})

closeModalButtons.forEach(button => {
	button.addEventListener('click', () => {
		const modal = button.closest('.modal')
		closeModal(modal)
	})
})

init()

export { pickedCountry }

