const board = document.querySelector('#board')
const SQUARES_NUM = 500
const squaresEls = []
const inputs = document.querySelectorAll('.input')
const tuning = document.querySelector('#tune')
const fixBtn = document.querySelector('.btn')

let isFade = true

const opts = {
	hue: 0,
	bright: 0.4,
	sector: 0.2,
	sectVal: [0, 0],
}

for (let i = 0; i < SQUARES_NUM; i++) {
	squaresEls.push("<div class='square'></div>")
}

board.innerHTML = squaresEls.join(' ')

const els = document.querySelectorAll('.square')

els.forEach((el) => {
	el.addEventListener('pointerleave', onLeave)
	el.addEventListener('pointerover', onHover)
	el.addEventListener('pointerdown', onHover)
})

inputs.forEach((el) => {
	el.addEventListener('input', onInput)
	setColor(el)
})

function onInput(e) {
	const el = e.target
	const id = el.id
	let value = el.value

	opts[id] = (value / el.max).toFixed(4)
	setColor(el)
}

fixBtn.addEventListener('click', fixToggle)
fixBtn.innerHTML = 'Fix Paint'
fixBtn.classList.add('active')

function fixToggle() {
	isFade = isFade ? false : true

	if (isFade) {
		els.forEach((el) => {
			el.style.background = '#1d1d1d'
			el.style.boxShadow = `0 0 2px #000`
		})
		fixBtn.innerHTML = 'Fix Paint'
		fixBtn.classList.add('active')
	} else {
		fixBtn.classList.remove('active')
		fixBtn.innerHTML = 'Fade Paint'
	}
}

function getColor() {
	const hue = getRandom(opts.sectVal)
	const bright = opts.bright * 100
	return `hsl(${hue}, 100%, ${bright}%)`
}

const getRandom = ([min, max]) => {
	return Math.floor(Math.random() * (max - min)) + min
}

function onHover(event) {
	console.log(event)
	const color = getColor()
	event.target.style.background = `${color}`
	event.target.style.boxShadow = `0 0 2px ${color}, 0 0 10px ${color}`
}

function onLeave(event) {
	if (!isFade) return
	event.target.style.background = '#1d1d1d'
	event.target.style.boxShadow = `0 0 2px #000`
}

function setColor(elem) {
	const id = elem.id

	const hue = Math.floor(opts.hue * 360)
	const bright = Math.floor(opts.bright * 100)
	const sector = Math.floor(opts.sector * 360)

	const points = getSecPoints()

	function getSecPoints() {
		const points = [
			hue - sector / 2,
			hue - sector / 4,
			hue,
			hue + sector / 4,
			hue + sector / 2,
		]

		return points
	}

	inputs[1].style.background = `linear-gradient(
    90deg,
    hsl(0, 0%, 5%),
    hsl(0, 0%, 95%)
    )`

	switch (id) {
		case 'hue':
			setHue()
			setSector()
			setBtn()
			break
		case 'bright':
			setHue()
			setSector()
			break
		case 'sector':
			setSector()
		default:
			return
	}

	function setHue() {
		inputs[0].style.background = `hsl(${hue}, 100%, ${bright}%)`
	}

	function setSector() {
		inputs[2].style.background = `linear-gradient(
      90deg,
      hsl(${points[0]}, 100%, ${bright}%),
      hsl(${points[1]}, 100%, ${bright}%),
      hsl(${points[2]}, 100%, ${bright}%),
      hsl(${points[3]}, 100%, ${bright}%),
      hsl(${points[4]}, 100%, ${bright}%)
      )`

		opts.sectVal = [points[0], points[4]]
	}

	function setBtn() {
		fixBtn.style.color = `hsl(${hue}, 80%, 40%)`
	}
}
