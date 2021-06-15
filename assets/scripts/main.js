const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const Oder = ['Đặc biệt', 'Giải nhất', 'Giải nhì', 'Giải ba', 'Giải bốn', 'Giải năm', 'Giải sáu', 'Giải bảy'];

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
$('input[value="Oánh lại"]').onclick = function(e) {
    const scores = document.getElementById(3).querySelectorAll('.flex-item:not(.title,.score)');

    scores.forEach(score => {
        for (let i = 0; i < 10; i++) {
            score.innerHTML = random(5)
        }
    })
}

//hiện random các số trong một giải và render ra


function random(length) {
    result = '';
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
}