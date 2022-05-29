let btnBack;


let aboutState = {
    preload: preloadAbout,
    create: createAbout
};


function preloadAbout(){
    game.load.image('back', 'assets/imgs/backbutton.png');
    game.load.image('background', 'assets/imgs/background.png');
}

function createAbout(){
    let background = game.add.image(-5, 0, 'background');
    background.scale.setTo(0.75);

    let text2 = "Juego creado por Real Mandril";
    let style2 = {font:'50px Comic Sans MS', fill:'#e3e046', backgroundColor:'#fc9814'};
    let subtitle = game.add.text(game.world.centerX, game.world.centerY - 150, text2, style2);
    subtitle.anchor.setTo(0.5);

    let text = "Eric Rico Pastor\nSantiago Llamas Pereira\nGuillem Marrades Torres";
    let style = {font:'30px Comic Sans MS', fill:'#fc9814', backgroundColor:'#e3e046', align:'center'};
    let names = game.add.text(game.world.centerX, game.world.centerY, text, style);
    names.anchor.setTo(0.5);

    btnBack = game.add.button(game.world.centerX, game.world.centerY + 170, 'back', returnMenu);
    btnBack.scale.setTo(0.1);
    btnBack.anchor.setTo(0.5);

}

function returnMenu(){
    game.state.start('menuInicio');
}
