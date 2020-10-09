// const imgs =["10_tiger.png","1_pig.png",
//              "4_frog.png","7_monkey.png", 
//              "11_penguin.png", "9_chick.png",
//              "2_squirrel.png", "5_fox.png", 
//              "8_panda.png", "12_racoon.png", 
//              "3_rabbit.png", "6_bear.png", 
//             ]

// export const hello = () => {
//     return 'Hello, World!'
// };
const imgs =["1_pig.png","10_tiger.png","8_panda.png"]

const cardTemplate = document.querySelector("#card");
const scoreTemplate = document.querySelector("#score");
const main = document.querySelector("main.cards");
const cardList = main.children;
const winMenu = document.querySelector('#win');
let all_cards_times2 = [];
let start = false;
let counter = document.querySelector('h2.time')
// let scores = JSON.parse(localStorage.getItem('scores'));
// document.querySelector('button.btn-scores').addEventListener('click', function(){localStorage.clear(); location.reload();});

let scores = [];


// if (scores == undefined){
//     scores = [];
// }else{
//     setHighscore(scores)
// }

for(let score of scores){
    insertScore(score)
}

for(let img of imgs){
    all_cards_times2.push(createCard(img, imgs.indexOf(img)))
    all_cards_times2.push(createCard(img, imgs.indexOf(img)))
}

for(let card of shuffle(all_cards_times2)){
    main.appendChild(card)
}

function insertScore(score){
    const clone = scoreTemplate.content.cloneNode(true);
    let li = clone.querySelector('li');
    li.innerHTML = `Time: ${score['time']}, Date: ${score['date']}`

    document.querySelector('ul').prepend(li)
}

function setHighscore(scores){
    let smallest = scores[0];
    
    for(let score of scores){
        if(parseInt(score['time']) < parseInt(smallest['time'])){
            smallest = score;
        }
    }
     
    document.querySelector('h3.currentHighscore').innerHTML = `Time: ${smallest['time']}, Date: ${smallest['date']}`;;
}

function startTimer(){
    let user_timer = setInterval(function(){
        let num = Number(counter.innerHTML) + 0.1;
        counter.innerHTML = Math.round(num * 10)/10;
    }, 100)
    
    window.user_timer = user_timer
}

function cardClick(e){
    if(start == false){
        startTimer()
        start = true;
    }

    e.target.parentElement.classList.toggle('turned_over');
    e.target.parentElement.classList.toggle('turned_up');
    e.target.parentElement.setAttribute('data-face', 'up');
    
    let selectedCards = document.querySelectorAll('[data-face="up"]');
    let unselectedCards = document.querySelectorAll('[data-face="down"]');

    if(unselectedCards.length == 0){
        user_win(user_timer)
    }
    
    if(selectedCards.length == 2){
        console.log('Selected cards are 2')
        if(selectedCards[0].getAttribute('data-pair_handler') == selectedCards[1].getAttribute('data-pair_handler')){
            //match
            console.log('match')
            for(let card of selectedCards){
                setTimeout(() => {
                    card.removeEventListener('click', cardClick)
                    card.setAttribute('data-face','frozen')
                }, 500);
            }
        }else{
            //not match
            for(let card of selectedCards){
                card.setAttribute('data-face','down');

                setTimeout(() => {
                    card.classList.toggle('turned_over')
                    card.classList.toggle('turned_up')
                }, 500);
            }
        }
    }
}

function createCard(img, index){
    const clone = cardTemplate.content.cloneNode(true);
    let card = clone.querySelector('article');

    card.addEventListener('click', cardClick);
    card.setAttribute('data-pair_handler', index); 
    card.setAttribute('data-face', 'down'); 
    card.querySelector('.back').style.backgroundImage = `url('../imgs/${img}')`;

    return clone
}

function shuffle(array){
    let length = array.length - 1;
    for(let  i = length; i > 0; i--){
        const j = Math.floor(Math.random() * i)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }

    return array
}

function user_win(user_timer){
    clearInterval(user_timer);
    let time = counter.innerHTML;
    let d = new Date();

    if(d.getMinutes().toString().length == 1){
        var min = `0${d.getMinutes()}`
    }else{
        var min = d.getMinutes();
    }

    let score = {time: time, date: `${d.getDate()}/${d.getMonth()}-${d.getFullYear()} (${d.getHours()}:${min})`}
    scores.push(score)
    setHighscore(scores)
    insertScore(score)
    setTimeout(() => {
        displayWin(score)
    }, 500);

    localStorage.setItem('scores', JSON.stringify(scores))
}

function displayWin(score){
    const clone = winMenu.content.cloneNode(true);
    clone.querySelector('h3').innerHTML = `Your time was ${score['time']} seconds. Try to beat it!`

    document.querySelector('.wrapper').classList.add('blur');
    document.querySelector('body').appendChild(clone);
    document.querySelector('button.btn-play').addEventListener('click', function(){location.reload();});
}