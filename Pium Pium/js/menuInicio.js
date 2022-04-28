let menuState = {
    preload: preloadMenu,
    create: createMenu,
};

let btnstartA;
let btnstartB;
let btnstartC;
let btnabout;

function preloadMenu(){
    game.load.image('play', 'assets/imgs/startbutton.png');
    game.load.image('about', 'assets/imgs/aboutbutton.png');
}

function createMenu(){
    let text1 = "Pium Pium";
    let style1 = {font:'30px Arial', fill:'#FFFFFF'};
    let title = game.add.text(50, 50, text1, style1);

    btnstartA = game.add.button(100, 120, 'play', clickStartA);
    btnstartA.scale.setTo(0.25);

    btnstartB = game.add.button(100, 200, 'play', clickStartB);
    btnstartB.scale.setTo(0.25);

    btnstartC = game.add.button(100, 280, 'play', clickStartC);
    btnstartC.scale.setTo(0.25);


    btnabout = game.add.button(100, 350, 'about', clickAbout);
    btnabout.scale.setTo(0.5);

}

function clickStartA(){
    game.state.start('nivelA');

}

function clickStartB(){

}

function clickStartC(){

}

function clickAbout(){
    game.state.start('menuAbout');
}