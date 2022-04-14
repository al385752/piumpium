let btnrestart;

let endState = {
    preload: preloadEnd,
    create: createEnd
};

function preloadEnd(){
    game.load.image('restart', 'assets/imgs/backbutton.png');

}

function createEnd(){
    let text ="Has Perdido pringao";
    let style = {font:'50px Arial', fill:'#FFFFFF'}
    let gameover = game.add.text(100, 50, text, style);

    btnrestart = game.add.button(200, 400, 'restart', returnMenu);
    btnrestart.scale.setTo(0.15);
}

function returnMenu(){
    game.state.start('menuInicio');
}