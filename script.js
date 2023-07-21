// accessing html elements
const draggableElements = document.getElementsByClassName('drag')
const symbols = document.getElementsByClassName('symbol')
const columns = document.getElementsByClassName('col')

// defining globel variables
let selectedElement = null
let numOfTurnsLeft = 9
let turn = ''

let table = [
    [0.1, 0.1, 0.1],
    [0.1 , 0.1, 0.1],
    [0.1 , 0.1 ,0.1]
]

// handling resizing
addEventListener('resize', e=>{
    arrangeElements()
    setTimeout(()=>{
        location.reload()
    },100)
})

// arrainging symbols
arrangeElements()
function arrangeElements(){
    for(let element of draggableElements){
        symbolPosition = symbols[element.id.split('-')[1]].getClientRects()[0]
        element.style.top = symbolPosition.top+'px'
        element.style.left = symbolPosition.left+'px'
    }
}

// looping through symbols
for(let element of draggableElements){

    // adding properties to symbols
    element.grabbed = false
    element.placed = false
    element.initialX = element.style.left
    element.initialY = element.style.top

    // adding event to pick the symbol
    element.addEventListener('mousedown', e=>{
        if(e.target.placed == false && e.target.className.includes(turn)){
            selectedElement = element
            selectedElement.grabbed = true
        }
    })
    // adding event to put the symbol
    element.addEventListener('mouseup', e=>{
        selectedElement.style.top = selectedElement.initialY
        selectedElement.style.left = selectedElement.initialX
        selectedElement.grabbed = false
        setTimeout(()=>{
            selectedElement = null
        },50)
    })
}

// adding event to move the symbols
addEventListener('mousemove', e=>{
    if(selectedElement && selectedElement.grabbed){
        const symbolPosition = symbols[selectedElement.id.split('-')[1]].getClientRects()[0]
        selectedElement.style.top = e.clientY-33+'px'
        selectedElement.style.left = e.clientX-33+'px'
    }
})

// looping through table columns
for(let column of columns){

    // adding property to columns
    column.isEmpty = true

    // adding event to fill the column with symbol
    column.addEventListener('mouseover', e=>{
        if(selectedElement!=null && selectedElement.grabbed==false && e.target.isEmpty){
            const columnPosition =  e.target.getClientRects()[0]
            selectedElement.style.top = columnPosition.top+25+'px'
            selectedElement.style.left = columnPosition.left+25+'px'
            e.target.isEmpty = false
            selectedElement.placed = true
            turn = selectedElement.className.includes('circle') ? 'cross' : 'circle'
            updateTable(e.target.id, selectedElement.className.includes('circle'))
            if(numOfTurnsLeft<=0) showWinMessage(null);
        }
    })
}

// updating table 2D array
function updateTable(colID, symbol){
    const [id, y, x] = colID.split('-')
    let rowValue = 0
    let columnValue = 0
    let diagonalValueLeft = 0
    let diagonalValueRight = 0
    table[y][x] = symbol ? 1 : -1
    numOfTurnsLeft -= 1
    for(let i=0; i<table.length; i++){
        for(let j=0; j<table[0].length; j++){
            columnValue += table[i][j]
            rowValue += table[j][i]
            diagonalValueLeft += table[j][j]
            diagonalValueRight += table[j][table.length-j-1]
        }

        if(rowValue%3==0){
            showWinMessage(rowValue>0 ? 'O' : 'X')
            break;
        }
        if(columnValue%3==0){
            showWinMessage(columnValue>0 ? 'O' : 'X')
            break;
        }
        if(diagonalValueLeft%3==0){
            showWinMessage(diagonalValueLeft>0 ? 'O' : 'X')
            break;
        }
        if(diagonalValueRight%3==0){
            showWinMessage(diagonalValueRight>0 ? 'O' : 'X')
            break;
        }

        rowValue = 0
        columnValue = 0
        diagonalValueLeft = 0
        diagonalValueRight = 0
    }

}

function playAgain(){
    location.reload()
}

function showWinMessage(symbol){
    const container = document.getElementsByClassName('container')
    if(symbol==null){
        document.getElementById('win-text').innerText = 'Draw!'
    }
    else{
        document.getElementById('win-player').innerText = symbol
    }
    setTimeout(()=>{
        document.getElementById('win-message').style.display = 'flex'
        document.getElementById('page').style.filter = 'blur(10px)'
    },300)
}