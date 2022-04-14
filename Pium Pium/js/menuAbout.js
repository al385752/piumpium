let btnback;


let aboutState = {
    preload: preloadAbout,
    create: createAbout
};


function preloadAbout(){
    game.load.image('back', 'assets/imgs/backbutton.png');
}

function createAbout(){

    let text2 = "Juego creado por Real Mandril\n";
    text2 += "Eric Rico Pastor\n";
    text2 += "Santiago Llamas Pereira\n";
    text2 += "Guillem Marrades Torres";
    let style2 = {font:'15px Arial', fill:'#FFFFFF'};
    let subtitle = game.add.text(20, 30, text2, style2);

    btnback = game.add.button(20, 450, 'back', returnMenu);
    btnback.scale.setTo(0.15);

}

function returnMenu(){
    game.state.start('menuInicio');
}
