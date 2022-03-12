const grid = document.querySelector('.grid')
const resultsDisplay = document.querySelector('.results')

let currentShooterIndex = 224

let width = 15
let direction = 1
let invadersId
let goingRight = true

let aliensRemoved = []
let results = 0

for (let i = 0; i < 225; i++) {
    const square = document.createElement('div')
    grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))
//khởi tạo mảng gồm n phần tử giống nhau từ kết quả trả về của NodeList của querySelectorAll
//https://www.javascripttutorial.net/javascript-dom/javascript-queryselector/
console.log('squares====',squares)
let alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39
//    index 0->29
//    vi trí khởi tạo các block đầu tiên nằm trong grid
]

function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(i)) {
            // i chạy từ 0--> 29;
            // nên nếu có giá trị i nào đã bị push vào mảng alienRemoved --> sẽ không vẽ lại vị trí đó nữa
            squares[alienInvaders[i]].classList.add('invaderStyle')
        }
    }
}
draw()

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove('invaderStyle')
    }
}
function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1
    remove()

    if (rightEdge && goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width+1
            //vì alienInvader +width ---> đồng thời + direction ( đang là -1)
            direction = -1
            goingRight = false
        }
    }

    if (leftEdge && !goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width-1
            direction = 1
            goingRight = true
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction
    }

    draw()

    // if (squares[currentShooterIndex].classList.contains('invaderStyle', 'shooter')) {
    //     //contains(class)	Returns true if an element has the class, otherwise false.
    //     resultsDisplay.innerHTML = 'GAME OVER'
    //     clearInterval(invadersId)
    // }


    for (let i = 0; i < alienInvaders.length; i++) {
        // console.log(alienInvaders[i])
        if (alienInvaders[i] > squares.length-20) {
            resultsDisplay.innerHTML = 'GAME OVER'
            clearInterval(invadersId)
        }
    }
    if (aliensRemoved.length === alienInvaders.length) {
        resultsDisplay.innerHTML = 'YOU WIN'
        clearInterval(invadersId)
    }
}

invadersId = setInterval(moveInvaders, 500)



squares[currentShooterIndex].classList.add('shooter')
// console.log(squares)

function moveShooter(event) {
    squares[currentShooterIndex].classList.remove('shooter')
    switch (event.keyCode) {
        case 65:
        case 37:
            if (currentShooterIndex % width !== 0)
                currentShooterIndex -= 1
            break
        case 68:
        case 39:
            if (currentShooterIndex % width < width - 1)
                currentShooterIndex += 1
            break
    }
    squares[currentShooterIndex].classList.add('shooter')
}

document.addEventListener('keydown', moveShooter)


function shoot(event) {
    let laserId
    let currentLaserIndex = currentShooterIndex

    function moveLaser() {
        squares[currentLaserIndex].classList.remove('laser')
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add('laser')

        if (squares[currentLaserIndex].classList.contains('invaderStyle')) {

            squares[currentLaserIndex].classList.remove('laser')
            squares[currentLaserIndex].classList.remove('invaderStyle')
            squares[currentLaserIndex].classList.add('boom')

            setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300)
            //https://developer.mozilla.org/en-US/docs/Web/API/setTimeout  chức năng không đồng bộ
            clearInterval(laserId)

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
            //tìm kiếm vị trí phần tử bị dính đạn= vị trí currentLaserIndex
            // -> trả về vị trí index trong mảng alienInvader
            aliensRemoved.push(alienRemoved)
            // đưa vị trí bị dính đạn vào alienRemoved
            results++
            resultsDisplay.innerHTML = results
            console.log(aliensRemoved)

        }
    }

    switch (event.keyCode) {
        case 87:
        case 38:
            laserId = setInterval(moveLaser, 100)
    }
}

document.addEventListener('keydown', shoot)