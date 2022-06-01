let menuState = {
    preload: preloadMenu,
    create: createMenu,
};

let btnstartA;
let btnstartB;
let btnstartC;
let btnabout;
let background;
let backgroundMusic;
let level;
let points;
let correctLettersTyped;
let totalLettersTyped;
let typistDead;

function preloadMenu(){
    game.load.image('play', 'assets/imgs/startbutton.png');
    game.load.image('about', 'assets/imgs/aboutbutton.png');
    game.load.image('background', 'assets/imgs/background.png');
    game.load.audio('backgroundMusic', 'assets/sounds/backgroundMusic.mp3');
}

function createMenu(){
    background = game.add.image(-5, 0, 'background');
    background.scale.setTo(0.75);

    let text1 = "Monkey Adventure";
    let style1 = {font:'80px Comic Sans MS', fill:'#e3e046', backgroundColor:'#fc9814'};
    let title = game.add.text(game.world.centerX, game.world.centerY - 150, text1, style1);
    title.anchor.set(0.5);

    btnstartA = game.add.button(game.world.centerX, game.world.centerY - 40, 'play', clickStartA);
    btnstartA.scale.setTo(0.15);
    btnstartA.anchor.setTo(0.5);

    /*btnstartB = game.add.button(game.world.centerX, game.world.centerY +the game 60, 'play', clickStartB);
    btnstartB.scale.setTo(0.15);
    btnstartB.anchor.setTo(0.5);

    btnstartC = game.add.button(game.world.centerX, game.world.centerY + 160, 'play', clickStartC);
    btnstartC.scale.setTo(0.15);
    btnstartC.anchor.setTo(0.5);*/


    btnabout = game.add.button(game.world.centerX, game.world.centerY + 250, 'about', clickAbout);
    btnabout.scale.setTo(0.25);
    btnabout.anchor.setTo(0.5);
}

function initializeStage(){
    correctLettersTyped = 0;
    totalLettersTyped = 0;
    owpsDeactivated = 0;
    currentWave = 1;
    points = 100;
    typistDead = false;
    backgroundMusic = game.add.sound('backgroundMusic', 0.5);
    backgroundMusic.play();
    game.time.reset();
}

function clickStartA(){
    level = 'A';
    initializeStage();
    game.state.start('nivelA');
}

function clickStartB(){

}

function clickStartC(){

}

function clickAbout(){
    game.state.start('menuAbout');
}