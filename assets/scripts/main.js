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
let playing = false;
let playBoard = [];
for (let i = 0; i < 100; i++) {
    playBoard.push([0, 0, 0, 0]);
}
let recentPlay = []
for (let i = 0; i < 10; i++) {
    recentPlay.push([0, 0, 0, 0]);
}
let rollPlay = 0;
let playtime = 0;
let soLo = [];
let soDe = [];
let tienLo = [];
let tienDe = [];

renderCalTable('.history-table', recentPlay, ['Lịch sử 10 lần gần nhất ', 'Lần', 'Thời gian', 'Lô đã đánh', 'Đề đã đánh', 'Tiền lãi'], 1);
renderCalTable('.cal-main', playBoard, ['Số lần quay giải: ', 'Bộ số', 'Số lần ra lô', 'Ra liên tiếp', 'Số vòng chưa ra lô', 'Số lần ra đề']);

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
        if (Array.isArray(tableArray[i])) {
            tableArray[i].forEach(data => {
                html += `<td>${data}</td>`
            });
        } else {
            console.log(tableArray[i]);
        }

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

    acting('.lo input[value="phang"]', '.de input[value="phang"]');
    createScores('input[value="Chơi"]', '.xoso', 'input[value="Đặt lại"]', 'input[value="Tắt âm"]');
    let checkPlayDone = setInterval(function() {
        if (played) {
            //get all prizes
            for (let i = 0; i < 8; i++) {
                prizes[i] = getScores(i);
            }

            delay(800)
                .then((a) => {
                    let playTimes = new Date();
                    let playTime = '' + playTimes.getHours() + ':' + playTimes.getMinutes() + ':' + playTimes.getSeconds() + ' Ngày: ' + playTimes.getDate() + '/' + playTimes.getMonth();
                    let lai = 0;
                    let soVe = [];
                    let notifInterest = $('.notif-interest');
                    let loMinMax = [0, 0];
                    let deMinMax = [0, 0];
                    let khan = 0;
                    let loRois = [];
                    //handle result of lô đề :v
                    let deVe = prizes[0].join().slice(-2);

                    playBoard[+deVe][3]++;

                    soDe.forEach((so, indexDe) => {
                        if (so == deVe) {
                            lai += +tienDe[indexDe] * 70;
                        }
                        lai -= +tienDe[indexDe];
                    });
                    tienLo.forEach(tien => {
                        lai -= +tien;
                    });
                    prizes.forEach((prize) => {
                        prize.forEach((score) => {
                            let loVe = score.slice(-2);
                            //lọc số lô về
                            if (!soVe.includes(loVe)) {
                                soVe.push(+loVe);
                            }
                            //add lô về vào bảng thống kê
                            playBoard[+loVe][0]++;
                            //tính lãi lô
                            soLo.forEach((so, indexLo) => {
                                if (so == loVe) {
                                    lai += +tienLo[indexLo] * 8 / 2.3;
                                }
                            })
                        })
                    });
                    playBoard.forEach((recode, i) => {
                        //lọc số lần ra liên tiếp lô
                        if (soVe.includes(i)) {
                            ++recode[1];
                            recode[2] = 0;
                        } else {
                            recode[1] = 0;
                            ++recode[2];
                        }
                        //lọc lô ra nhiều nhất ít nhất
                        if (recode[0] < playBoard[loMinMax[0]][0]) {
                            loMinMax[0] = i;
                        }
                        if (recode[0] > playBoard[loMinMax[1]][0]) {
                            loMinMax[1] = i;
                        }
                        //lọc đề ra nhiều nhất, ít nhất
                        if (recode[3] < playBoard[deMinMax[0]][3]) {
                            deMinMax[0] = i;
                        }
                        if (recode[3] > playBoard[deMinMax[1]][3]) {
                            deMinMax[1] = i;
                        }
                        //lọc lô khan
                        if (recode[2] > playBoard[khan]) {
                            khan = i;
                        }
                        //lọc lô rơi
                        if (recode[1] > 1) {
                            loRois.push(i);
                        }
                    })
                    lai = Math.floor(lai);
                    loRois = loRois.join(',');

                    //render table
                    renderMiniTableCal(loMinMax[0], loMinMax[1], deMinMax[0], deMinMax[1], khan, loRois);

                    notifInterest.innerHTML = `
                            <div class="flex-item">${(lai>0)?('Lãi'):('Lỗ')}</div>
                            <div class="flex-item">${lai}</div>
                        `;
                    if (lai > 0) {
                        $('.oi-doi-oi').play();
                        currentMoney += lai;
                        $('.current-money').innerHTML = `$${currentMoney}`;
                    } else {
                        $('.con-cai-nit').play();
                    }
                    recentPlay[playtime] = [playTime, soLo.join(' '), soDe.join(' '), lai];
                    playtime++;
                    if (playtime > 9) {
                        playTime = 0;
                    }
                    return '';
                })
                .then(() => {
                    renderCalTable('.history-table', recentPlay, ['Lịch sử 10 lần gần nhất ', 'Lần', 'Thời gian', 'Lô đã đánh', 'Đề đã đánh', 'Tiền lãi'], 1);
                    renderCalTable('.cal-main', playBoard, [`Số lần quay giải: ${rollPlay}`, 'Bộ số', 'Số lần ra lô', 'Ra liên tiếp', 'Số vòng chưa ra lô', 'Số lần ra đề']);

                    if (musicPlay) {
                        musicPlay.pause();
                        musicPlay.currentTime = 0;
                    }
                    played = false;
                    soLo = [];
                    soDe = [];
                    tienLo = [];
                    tienDe = [];
                    $('.acting-lo').innerHTML = '';
                    $('.acting-de').innerHTML = '';

                })
        }
    }, 1000)

}

function renderMiniTableCal(loMin, loMax, deMin, deMax, khan, loRois) {
    //render min table
    $('.few .data-lo').innerHTML = `
                    <td class="table-title">Lô</td>
                            <td>${(loMin<10)?('0'+loMin):(loMin)}</td>
                            <td>${playBoard[loMin][0]}</td>
                    `;

    $('.few .data-de').innerHTML = `
                    <td class="table-title">Đề</td>
                            <td>${(deMin<10)?('0'+deMin):(deMin)}</td>
                            <td>${playBoard[deMin][3]}</td>
                    `;
    //render max table
    $('.many .data-lo').innerHTML = `
                    <td class="table-title">Lô</td>
                            <td>${(loMax<10)?('0'+loMax):(loMax)}</td>
                            <td>${playBoard[loMax][0]}</td>
                    `;

    $('.many .data-de').innerHTML = `
                    <td class="table-title">Đề</td>
                            <td>${(deMax<10)?('0'+deMax):(deMax)}</td>
                            <td>${playBoard[deMax][3]}</td>
                    `;
    //render đề khan
    $('.lo-khan .data-lo').innerHTML = `
                            <td>${(khan<10)?('0'+khan):(khan)}</td>
                            <td>${playBoard[khan][2]}</td>
                    `;
    //render Lô rơi
    if (loRois) {
        $('.lo-roi .data-lo').innerHTML = `<td>${loRois}</td>`;
    }
}

function calMoneys(prizes) {

}

function acting(btnLo, btnDe) {
    let buttonLo = $(btnLo);
    let buttonDe = $(btnDe);

    buttonLo.onclick = function(e) {
        let currentPlay = handleActing('lo');
        if (currentPlay) {

            soLo.push(currentPlay.number);
            tienLo.push(currentPlay.money);
        }
    }
    buttonDe.onclick = function(e) {
        let currentPlay = handleActing('de');
        if (currentPlay) {
            soDe.push(currentPlay.number);
            tienDe.push(currentPlay.money);
        }
    }

}
// handle đánh lô đề :v
function handleActing(type) {
    let numberInput = $(`#select-${type}`);
    let moneyInput = $(`#money-${type}`);
    const acting = $(`.acting-${type}`);
    const currentMny = $('.current-money');

    if (numberInput && numberInput) {
        let number = numberInput.value;
        let money = moneyInput.value;

        if (number && money && number.length < 3 && number >= 0 && number <= 99) {
            if (currentMoney - money <= 0) {
                $('.tham-nam').play();
                alert('Đánh vừa thôi hết tiền rồi');
                return;
            }
            currentMoney -= money;
            acting.innerHTML += ` <div class="acting-times col">
            <div class="nbr">${number}:</div>
            <div class="mney">${money}</div>
            <div>`;

            currentMny.innerHTML = `$${currentMoney}`;
            return {
                number,
                money,
            }
        } else {
            $('.ngu-dot').play();
            alert('Nhập tử tế vào bay êi! số đánh phải từ 00-99, phải có tiền đánh chứ chơi chùa à :v');
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
            if (playing) {
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
        if (playing) {
            alert('số chưa về oánh vội thế');
            return;
        }
        if (musicPlayBtn) {
            musicPlayBtn.volume = 0.5;
            musicPlayBtn.play();
        }
        rollPlay++;
        for (let i = 7; i >= 0; i--) {
            playing = true;
            createScore(i);
            let waitingTime = (i > 2) ? (7000 - Math.abs(4 - i) * 800) : (2000);
            let a = await delay(waitingTime);
        }
        played = true;
        playing = false;
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
    const length = (id < 4) ? (5) : ((id < 6) ? (4) : ((id < 7) ? (3) : (2)));
    const scores = (id == 3 || id == 5) ? (document.getElementById(id).querySelectorAll('.flex-item:not(.title,.score)')) : (document.getElementById(id).querySelectorAll('.flex-item.score'));
    scores.forEach(score => {
        let tempScore = '';
        for (let i = 0; i < length; i++) {
            tempScore += 0;
        }
        score.innerHTML = tempScore;
    });
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