'use strict'

var gElCanvas
var gCtx
var gKeywordSearchCountMap = {
    'funny': 12,
    'celeb': 11,
    'dog': 11,
    'cat': 16,
    'baby': 2,
    'cute': 5,
}

function onInit() {
    initCanvas()
    renderGallery()
    flashMsg('Welcome!')
}
function renderMeme() {
    //handle img
    const img = new Image()
    img.src = `img/${gMeme.selectedImgId}.jpg`
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        //handle each line        
        const { lines } = getMeme()
        lines.forEach(line => {
            const { x, y } = line.pos
            gCtx.beginPath()
            // NeedToAdd
            gCtx.lineWidth = 2
            //Added
            gCtx.textAlign = line.align
            gCtx.font = `${line.size}px ${line.font}`
            gCtx.fillStyle = line.color
            gCtx.fillText(line.txt, x, y)
            gCtx.strokeStyle = line.borderColor
            gCtx.strokeText(line.txt, x, y)
            gCtx.closePath()
        })
    }
}

function OnResizeCanvas() {
    resizeCanvas()
    renderMeme()
}
function onUpdateCtx(shape) {
    updateCtx(shape)
}
function onImgSelect(imgId) {
    setMemeImg(imgId)
    document.querySelector('.gallery-section').hidden = true
    flashMsg('img selected')
    renderMeme()
}
function onSetLineText(txt) {
    setLineText(txt)
    renderMeme()
}
function toggleMenu() {
    document.body.classList.toggle('menu-opened');
}
function toggleGallery() {
    var elGallery = document.querySelector('.gallery-section')
    elGallery.hidden ? elGallery.hidden = false : elGallery.hidden = true
}

function onMouseOutCanvas() {
    // console.log('onMouseOutCanvas')
    // gCtx.beginPath()
    // gIsDraw = false
}

function getPosByEv(ev) {
    // console.log('ev:', ev)
    const touchEvs = ['touchstart', 'touchmove', 'touchend']
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    // console.log('pos:', pos)
    // console.log('ev.target.clientLeft:', ev.target.clientLeft)
    if (touchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        // Calc pos according to  touch screen
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop
        }
    }
    return pos
}
//* //  ///   /////      Meme btns     \\\\\    \\\  *\\
function onMoveTxtUp() {
    moveTxtUp()
    renderMeme()
}
function onMoveTxtDown() {
    moveTxtDown()
    renderMeme()
}
onAddTxtLine


///////////////////////////////////////////////////////////////////////////////////////////////

// function onDown(ev) {
//     gIsDraw = true
//     let pos = getPosByEv(ev)
//     draw(pos)
// }
// function onUpdateStrokeSize(num) {
//     gStrokeSize = num //? UpdateStrokeSize()?
// }
// function onDraw(ev) {
//     if (gIsDraw) {
//         let pos = getPosByEv(ev)
//         draw(pos)
//     }
// }
// !Delete at the end
const elBody = document.querySelector('body')
let gViewportWidth = window.innerWidth
let state
elBody.onresize = () => {
    gViewportWidth = window.innerWidth;
    if (gViewportWidth > 768 || gViewportWidth < 1020) state = 'Tablet'
    if (gViewportWidth < 520) state = 'Mobile'
    if (gViewportWidth > 1020) state = 'Desktop'
    renderViewPort()
}
elBody.onresize()
function renderViewPort() {
    document.querySelector('.viewport').innerText = `${state}\n${gViewportWidth}px`
}//!