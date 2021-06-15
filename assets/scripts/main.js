const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const Oder = ['Đặc biệt', 'Giải nhất', 'Giải nhì', 'Giải ba', 'Giải bốn', 'Giải năm', 'Giải sáu', 'Giải bảy'];
var prizes = [];

const $AO = function activeOn(elements) {
    elements.forEach(element => {
        element.classList.add('active');
    })
}
const $AOff = function activeOff(elements) {
    elements.forEach(element => {
        element.classList.remove('active');
    })
}
const $toggle = function toggleActiveClass(elements) {
    elements.forEach(element => {
        element.classList.toggle('active');
    })
}

$('.main-nav-mobile').onclick = function() {
    $toggle([...$$('.menu-icon'), $('.main-nav-bar-mobile')]);
}

xoSo('input[value="Oánh lại"]', '.xoso', 'input[value="Tắt âm"]');

function xoSo(button, musicPlay, buttonStopMusic) {
    if (buttonStopMusic) {
        $(buttonStopMusic).onclick = function() {
            $(musicPlay).pause();
        };
    }
    $(button).onclick = function() {
        if (musicPlay) {
            $(musicPlay).play();
        }
        for (let i = 0; i < 8; i++) {
            getScores(i)
        }
    }

}


function getScores(id) {
    let prize = [];
    const length = (id < 4) ? (5) : ((id < 6) ? (4) : ((id < 7) ? (3) : (2)));
    const scores = (id == 3 || id == 5) ? (document.getElementById(id).querySelectorAll('.flex-item:not(.title,.score)')) : (document.getElementById(id).querySelectorAll('.flex-item.score'));

    scores.forEach(score => {
        for (let i = 0; i < 10; i++) {
            let temp = random(length);

            score.innerHTML = temp;
            prize.push(temp)
        }
    })
    return prize;
}

//hiện random các số trong một giải và render ra


function random(length) {
    result = '';
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
}