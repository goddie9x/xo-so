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

start();

async function start() {
    createScores('input[value="Oánh lại"]', '.xoso', 'input[value="Tắt âm"]')
        .then(prizes => {
            console.log(prizes)
        })
}


async function createScores(buttonPlay, musicPlay, buttonStopMusic) {
    let prizes = [];
    let waitingTimes = 0;
    if (buttonStopMusic) {
        $(buttonStopMusic).onclick = function() {
            if (musicPlay) {
                $(musicPlay).pause();
            }
        };
    }
    $(buttonPlay).onclick = async function() {
        if (musicPlay) {
            $(musicPlay).volume = 0.5;
            $(musicPlay).play();
        }
        for (let i = 7; i >= 0; i--) {
            getScores(i)
                .then(prize => {
                    prizes.push(prize)
                })
            let waitingTime = (i > 2) ? (7000 - Math.abs(4 - i) * 800) : (2000);
            let a = await delay(waitingTime);
        }
    }
    for (let i = 7; i >= 0; i--) {
        let waitingTime = (i > 2) ? (7000 - Math.abs(4 - i) * 800) : (2000);
        waitingTimes += waitingTime;
    }
    return new Promise(async(resolve) => {
        setTimeout(resolve(prizes), waitingTimes);
    })
}

function deleteScores(buttonReset) {
    $(buttonReset).onclick = function() {
        if (musicPlay) {
            $(musicPlay).pause();
        }
        for (let i = 7; i >= 0; i--) {
            prizes[i] = resetScores(i);
        }
    }
}
async function getScores(id) {
    let prize = [];
    const length = (id < 4) ? (5) : ((id < 6) ? (4) : ((id < 7) ? (3) : (2)));
    const scores = (id == 3 || id == 5) ? (document.getElementById(id).querySelectorAll('.flex-item:not(.title,.score)')) : (document.getElementById(id).querySelectorAll('.flex-item.score'));

    for (const score of scores) {
        let tempScore;
        let times = 0;
        let interval = setInterval(function() {
            if (times > 20) {
                clearInterval(interval);
            }
            tempScore = fRandom(length);
            score.innerHTML = tempScore;
            times++;
        }, 50);
        prize.push(tempScore);
        let a = await delay(1000);
    }
    return Promise.resolve(prize);
}

function resetScores(id) {
    let prize = [];
    const length = (id < 4) ? (5) : ((id < 6) ? (4) : ((id < 7) ? (3) : (2)));
    const scores = (id == 3 || id == 5) ? (document.getElementById(id).querySelectorAll('.flex-item:not(.title,.score)')) : (document.getElementById(id).querySelectorAll('.flex-item.score'));

    scores.forEach(score => {
        let tempScore = '';

        for (let i = 0; i < length; i++) {
            tempScore += 0;
        }
        score.innerHTML = tempScore;
        prize.push(tempScore);
        return Promise.resolve(prize);
    });
}
//hiện random các số trong một giải và render ra


function fRandom(length) {
    let result = '';

    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
}

function delay(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    })
}