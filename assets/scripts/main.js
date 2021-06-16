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
let playBoard = [];
for (let i = 0; i < 100; i++) {
    playBoard.push([0, 0, 0, 0]);
}
let recentPlay = [];
for (let i = 0; i < 10; i++) {
    recentPlay.push([0, 0, 0, 0]);
}

renderCalTable('.history-table', recentPlay, ['Lịch sử 10 lần gần nhất ', 'Lần', 'Thời gian', 'Lô đã đánh', 'Đề đã đánh', 'Tiền lãi'], 1);
renderCalTable('.cal-main', playBoard, ['Số lần quay giải: ', 'Bộ số', 'Số lần ra lô', 'Ra liên tiếp', 'Số lần chưa ra lô', 'Số lần ra đề']);

function renderCalTable(tableTarget, tableArray, tableTitleArray, deviationTableIndex = 0) {
    const calMainTable = $(tableTarget);
    let tableArrayLength = tableArray.length;
    let tableTitleArrayLength = tableTitleArray.length;
    //create header table
    let html = `
    <th colspan=100%>
        <div class="head-table">
        ${tableTitleArray[0]}
        </div>
    </th>
    <tr class="table-title">
    `;
    //render table title
    for (i = 1; i < tableTitleArrayLength; i++) {
        html += `<td>${tableTitleArray[i]}</td>`;
    }
    html += `</tr>`;
    //render table data
    for (let i = 0; i < tableArrayLength; i++) {
        let tempNumber = (i + deviationTableIndex < 10) ? ('0' + (i + deviationTableIndex)) : (i + deviationTableIndex + '');
        html += `
        <tr class="table-row-${i}">
        <td>${tempNumber}</td>
        `;
        tableArray[i].forEach(data => {
            html += `<td>${data}</td>`
        });
        html += `</>`;
    }
    calMainTable.innerHTML = html;
}

$('.main-nav-mobile').onclick = function() {
    $toggle([...$$('.menu-icon'), $('.main-nav-bar-mobile')]);
}
start();

async function start() {
    let musicPlay = $('.xoso');
    let prizes = ['', '', '', '', '', '', '', ''];
    playBoard.push(acting('.lo input[value="phang"]', '.de input[value="phang"]'));

    createScores('input[value="Oánh lại"]', '.xoso', 'input[value="Đặt lại"]', 'input[value="Tắt âm"]');
    let checkPlayDone = setInterval(function() {
        if (played) {
            for (let i = 0; i < 8; i++) {
                prizes[i] = getScores(i);
            }

            delay(800)
                .then(() => {
                    console.log(playBoard);
                    if (musicPlay) {
                        musicPlay.pause();
                        musicPlay.currentTime = 0;
                    }
                    played = false;
                })
        }
    }, 1000)

}

function calMoneys(prizes) {

}

function acting(btnLo, btnDe) {
    let buttonLo = $(btnLo);
    let buttonDe = $(btnDe);
    let soLo = [];
    let soDe = [];
    let tien = 0;

    buttonLo.onclick = function(e) {
        let currentPlay = handleActing('lo');
        soLo.push(currentPlay.number);
        tien += currentPlay.money;
    }
    buttonDe.onclick = function(e) {
        let currentPlay = handleActing('de');
        soDe.push(currentPlay.number);
        tien += currentPlay.money;
    }

    let playTime = new Date();
    return {
        playTime,
        soLo,
        soDe,
        tien
    }
}

function handleActing(type) {
    let numberInput = $(`#select-${type}`);
    let moneyInput = $(`#money-${type}`);
    const acting = $(`.acting-${type}`);
    const currentMny = $('.current-money');

    if (numberInput && numberInput) {
        let number = numberInput.value;
        let money = moneyInput.value;

        if (number && money) {
            if (currentMoney - money <= 0) {
                alert('Đánh vừa thôi hết tiền rồi');
                return;
            }
            currentMoney -= money;
            acting.innerHTML += ` <div class="acting-times col">
            <div class="nbr">${number}:</div>
            <div class="mney">${money}</div>
            <div>`;

            currentMny.innerHTML = `${currentMoney}`;
            return {
                number,
                money,
            }
        } else {
            alert('vui lòng nhập đủ cả số đánh và cả tiền');
            return;
        }
    }
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
                musicPlay.currentTime = 0;
            }
        };
    }
    if (resetScoresBtn) {
        resetScoresBtn.onclick = function() {
            if (!played) {
                alert('số chưa về reset cái giề');
                return;
            }
            if (musicPlayBtn) {
                musicPlayBtn.pause();
                musicPlayBtn.currentTime = 0;
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
        wait = 1000;
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