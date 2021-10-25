const bet = document.getElementsByClassName('betChoice');
const reset = document.getElementById("reset")
console.log(reset)
const result = document.getElementById("result")
const whoWon = document.getElementById("winner")

document.querySelector(".resetBtn").addEventListener('click', resetPlayer)

function resetPlayer() {
    document.querySelector('#result').innerText = 0
    document.querySelector('.betAmount').value = 0

}



let revenue = 0
let playeramount = 0

Array.from(bet).forEach(button => {
    button.addEventListener('click', setValue)
});
function setValue(e) {

    let targetValue = e.target.value


    const betValue = document.querySelector('.betValue')

    betValue.value = targetValue
    console.log(betValue.value);

}


document.querySelector('.submitBtn').addEventListener('click', runGame)
// create a function 

function runGame() {
    let amount = document.querySelector('.betAmount').value
    amount = Number(amount)
    console.log(typeof amount)

    let betColor = document.querySelector('.betValue').value
    console.log(betColor)
    fetch('updateGame', {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'color': betColor,
            'amount': amount


        })

    }).then(response => {
        if (response.ok) return response.json()
    })
        .then(data => {
            console.log(data)

        })
    let random = Math.ceil(Math.random() * 37)


    if (random === 1 && betColor === 'green') {
        amount *= 35
        revenue -= amount
        playeramount += amount

        console.log('playerwinner!')
        whoWon.innerText = "YOU WON!"
        result.innerText = " $" + playeramount

    } else if (random >= 2 && random <= 19 && betColor === 'black') {
        amount *= 2
        revenue -= amount
        playeramount += amount
        console.log('playerwinner!')
        whoWon.innerText = "YOU WON!"
        result.innerText = " $" + playeramount

    } else if (random > 19 && betColor === 'red') {
        amount *= 2
        revenue -= amount
        playeramount += amount
        console.log('playerwinner!')
        whoWon.innerText = "YOU WON!"
        result.innerText = " $" + playeramount

    } else {
        revenue += amount
        playeramount -= amount
        console.log('casino wins')
        whoWon.innerText = "YOU LOST!"
        result.innerText = " $" + playeramount
    }

    console.log('random result', random)
    console.log('casino revenue', revenue)

}


reset.addEventListener('click', resetGame)


function resetGame() {
    const objectIdElement = document.querySelector('#objectId')
    if (objectIdElement) {
        let objectId = document.querySelector('#objectId').innerText
        console.log(objectId);
        console.log("working");
        fetch('reset', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'id': objectId

            })


        }).then(response => {
            console.log(response)
            if (response.ok) {
                console.log("window.reload")
                return window.location.reload(true)
            }
        })
    }

};