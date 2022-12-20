'use strict'

// Init Controllers
function onInit() {
    // MainController 
    window.gMainController = {
        activePageStr: 'gallery',
        isMenuOpen: false,
        audio: {},
        domEls: {
            elUserMsg: document.querySelector('.user-msg'),
            elMainNav: document.querySelector('.main-nav'),
            elBtnToggleNav: document.querySelector('.btn-toggle-menu'),
            elModal: document.querySelector('.modal'),
            links: {
                elLinkGallery: document.querySelector('.link-gallery'),
                elLinkEdit: document.querySelector('.link-edit'),
                elLinkAbout: document.querySelector('.link-about'),
                elLinkSaved: document.querySelector('.link-saved'),
            },
            pages: {
                elPageGallery: document.querySelector('.main-gallery-container'),
                elPageEdit: document.querySelector('.main-edit-container'),
                elPageAbout: document.querySelector('.main-about-container')
            },
            inputs: {
                elImgInput: document.querySelector('input[name="img"]'),
            },
        },
    }
    // Gallery
    GALLERY_CONTROLLER.initGalleryController('meme')
    GALLERY_CONTROLLER.renderGallery()
    GALLERY_CONTROLLER.renderKeywordsOpts()
    GALLERY_CONTROLLER.renderKeywordsBtns()

    // Meme
    MEME_CONTROLLER.initMemeController()

    // i18
    I18_SERVICE.setUserDefaultLang(navigator.languages[1])
    const userLang = I18_SERVICE.getLangStr()
    // add class to html and body
    document.documentElement.setAttribute("lang", userLang)
    document.body.classList.add(userLang)
    // Set the right Select on
    document.querySelector('[name="select-lang"]').selectedOptions.value === userLang
    // transDocument()

    // User-Msg
    flashMsg('Welcome!')
    setTimeout(() => {
        if (document.body.classList.contains('page-gallery')) flashMsg('Choose Meme Background!')
    }, 5000)
}

// get current lang and translate Dom
function transDocument() {

    // const elsText = document.querySelectorAll('[data-trans]')
    // elsText.forEach(el => {
    //     el.innerText = gTrans[el.dataset.trans][gUserLang]
    // })
    // const elsPlaceholder = document.querySelectorAll('[data-placeholdertrans]')
    // elsPlaceholder.forEach(el => {
    //     el.placeholder = gTrans[el.dataset.placeholdertrans][gUserLang]
    // })
    // const elsTitle = document.querySelectorAll('[data-titletrans]')
    // elsTitle.forEach(el => {
    //     el.title = gTrans[el.dataset.titletrans][gUserLang]
    // })
}

// Navigation
function onNav(navToStr) {
    !navToStr ? navToStr = 'gallery' : navToStr

    // Capitalize using methods 
    const _capitalize = (str) => str[0].toUpperCase() + str.substring(1)

    // Set Mobile menu Bar
    if (document.body.classList.contains('mobile-menu-open')) onToggleMenu()

    // Set .active class
    const { links } = gMainController.domEls
    // Get First (and only) .active class and remove it
    document.querySelector('.active').classList.remove('active')
    // Add .active to current Link Page
    links[`elLink${_capitalize(navToStr)}`].classList.add('active')

    // Set body page class
    const curClassStr = Object.values(document.body.classList)
        .find(classStr => /page-/.test(classStr))
    document.body.classList.remove(`${curClassStr}`)
    document.body.classList.add(`page-${navToStr}`)

    playAudio('click')
    // Hide all pages On CSS for animation
    // const elPages = document.querySelectorAll('.page')
    // elPages.forEach(elPage => elPage.hidden = true)

    // Reveal current page 
    // const { pages } = gMainController.domEls
    // const elActivePage = pages[`elPage${_capitalize(navToStr)}`]
    // elActivePage.hidden = false
}

// Black screen
function onTouchScreen() {
    event.stopPropagation()
    if (document.body.classList.contains('mobile-menu-open')) {
        console.log(`🚀 ~ mobile-menu-open`)
        onToggleMenu()
        return
    }
    onTouchModal(true)
}

// Mobile Menu ☰
function onToggleMenu() {
    const { elBtnToggleNav } = gMainController.domEls
    document.body.classList.toggle('mobile-menu-open') // notify elScreen 
    elBtnToggleNav.classList.toggle('nav-open') // menuBar animation
    gMainController.isMenuOpen = !gMainController.isMenuOpen
}

// User Msg 
function flashMsg(str) {
    const { elUserMsg } = gMainController.domEls
    elUserMsg.innerText = str
    elUserMsg.classList.add('user-msg-open')
    setTimeout(() => elUserMsg.classList.remove('user-msg-open'), 3000)
}

// Play audio
function playAudio(audioKey) {
    const { audio } = gMainController
    if (audio[audioKey]) audio[audioKey].pause()
    return new Promise((resolve, reject) => { // return a promise
        audio[audioKey] = new Audio()         // create audio wo/ src
        audio[audioKey].preload = "auto"    // intend to play through
        audio[audioKey].autoplay = true    // autoplay when loaded
        // onlySong overLoop when loaded
        if (/music/.test(audioKey)) {
            audio[audioKey].loop = true
            audio[audioKey].volume = 0.4
        }
        audio[audioKey].src = `assets/audio/${audioKey}.mp3`
        audio[audioKey].onerror = reject   // on error, reject
        audio[audioKey].onended = resolve  // when done, resolve
    })
}

// Show Modal
function openModal(ev, msg) {
    const { elModal } = gMainController.domEls
    // set Modal pos
    const { clientX, clientY } = ev
    const { style } = elModal
    style.left = `${clientX}px`
    style.top = `${clientY}px`
    // Set txt 
    elModal.innerHTML = msg
    // Notify screen  
    document.body.classList.add('modal-open')
}

// Hide Modal
function onTouchModal(isClose) {
    const touchPos = getEvPos(event)
    if (isClose ||
        touchPos.x <= 20 && touchPos.y <= 20) {// click on X
        const { elModal } = gMainController.domEls
        // set Modal pos
        const { style } = elModal
        style.left = '-101vw'
        style.top = '-101vh'
        // Notify screen  
        document.body.classList.remove('modal-open')
        // Todo: add hidden make sure impassible to see
    }
}

// return current click Pos
function getEvPos(ev) {
    const pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    const touchEvs = ['touchstart', 'touchmove', 'touchend']
    if (touchEvs.includes(ev.type)) {
        ev.preventDefault()
        // Take 1 Mobile touch {Pos} in case of multi fingers clicking
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft,
            y: ev.pageY - ev.target.offsetTop
        }
    }
    return pos
}

// The linking Func between GalleryController to  MemeService
function onImgSelect() {
    flashMsg(`Image\n selected.`)
    const meme = {
        aspectRatio: event.target.style.aspectRatio,
        src: event.target.src,
        keywords: event.target.dataset.keyword.split(','),
    }
    setMeme(meme)
    renderMeme()
    onNav('edit')
}