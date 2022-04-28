let btnrestart;

let endState = {
    preload: preloadEnd,
    create: createEnd
};

function preloadEnd(){
    game.load.image('restart', 'assets/imgs/backbutton.png');

}

function createEnd(){
    let endText ="Has Perdido pringao";
    let endStyle = {font:'50px Arial', fill:'#FFFFFF'}
    let gameover = game.add.text(100, 50, endText, endStyle);

    let pointsText = points;
    let pointsStyle = {font:'25px Arial', fill:'#FFFFFF'}
    let finalPoints = game.add.text(100, 200, pointsText, pointsStyle);

    btnrestart = game.add.button(200, 400, 'restart', returnMenu);
    btnrestart.scale.setTo(0.15);
}

function returnMenu(){
    game.state.start('menuInicio');
}