const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
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
let currentMoney = 1000000;
let played = false;

$('.main-nav-mobile').onclick = function() {
    $toggle([...$$('.menu-icon'), $('.main-nav-bar-mobile')]);
}

start();

async function start() {
    let prizes = ['', '', '', '', '', '', '', ''];
    acting('.lo input[value="phang"]', '.de input[value="phang"]');

    createScores('input[value="Oánh lại"]', '.xoso', 'input[value="Đặt lại"]', 'input[value="Tắt âm"]');
    let checkPlayDone = setInterval(function() {
        if (played) {
            for (let i = 0; i < 8; i++) {
                prizes[i] = getScores(i);
            }
            checkPlayDone.clearInterval();
        }
    }, 1000)
}

function acting(btnLo, btnDe) {
    let buttonLo = $(btnLo);
    let buttonDe = $(btnDe);

    buttonLo.onclick = function(e) {
        handleActing('lo');
    }
    buttonDe.onclick = function(e) {
        handleActing('de');
    }
}

function handleActing(type) {
    let numberInput = $(`#select-${type}`);
    let moneyInput = $(`#money-${type}`);
    const acting = $(`.acting-${type}`);

    if (numberInput && numberInput) {
        let number = numberInput.value;
        let money = moneyInput.value;

        if (number && money) {
            currentMoney -= money;
            acting.innerHTML += ` <div class="acting-times col">
            <div class="nbr">${number}:</div>
            <div class="mney">${money}</div>
            <div>`;
            return {
                number,
                money
            }
        } else {
            alert('vui lòng nhập đủ cả số đánh và cả tiền');
            return;
        }
    }
}

function calMoneys(prizes) {

}

async function createScores(buttonPlay, musicPlay, buttonReset, buttonStopMusic) {

    const playButton = $(buttonPlay);
    let stopMusicBtn = (buttonStopMusic) ? ($(buttonStopMusic)) : (undefined);
    let musicPlayBtn = (musicPlay) ? ($(musicPlay)) : (undefined);
    let resetScoresBtn = (buttonReset) ? ($(buttonReset)) : (undefined);

    if (stopMusicBtn) {
        stopMusicBtn.onclick = function() {
            if (musicPlay) {
                $(musicPlay).pause();
            }
        };
    }
    if (resetScoresBtn) {
        resetScoresBtn.onclick = function() {
            if (musicPlayBtn) {
                musicPlayBtn.pause();
            }
            for (let i = 7; i >= 0; i--) {
                resetScores(i);
            }
            $('.acting').innerHTML = `
            <div class="flex-item">
                        <div class="acting-lo-title">
                            Danh sách lô đã oánh:
                        </div>
                        <div class="acting-lo"></div>
                    </div>
                    <div class="flex-item">
                        <div class="acting-de-title">
                            Danh sách đề đã oánh:
                        </div>
                        <div class="acting-de"></div>
                    </div>
            `;
            played = false;
        }
    }
    playButton.onclick = async function nope() {
        if (musicPlayBtn) {
            musicPlayBtn.volume = 0.5;
            musicPlayBtn.play();
        }
        for (let i = 7; i >= 0; i--) {
            createScore(i);
            let waitingTime = (i > 2) ? (7000 - Math.abs(4 - i) * 800) : (2000);
            let a = await delay(waitingTime);
        }
        played = true;
    }
}

function getScores(id) {
    let prizes = [];
    const scores = (id == 3 || id == 5) ? (document.getElementById(id).querySelectorAll('.flex-item:not(.title,.score)')) : (document.getElementById(id).querySelectorAll('.flex-item.score'));

    for (const score of scores) {
        prizes.push(score.innerHTML);
    }
    return prizes;
}

async function createScore(id) {
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
        let a = await delay(1000);
    }
    return await new Promise(resolve => {
        resolve()
    });
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

$('input[value="Xem thống kê"]').onclick = function() {
    $('.cal').style.display = 'block';
}