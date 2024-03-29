const GAME_STAGE_WIDTH = 800;
const GAME_STAGE_HEIGHT = 600;

let game = new Phaser.Game(GAME_STAGE_WIDTH, GAME_STAGE_HEIGHT, Phaser.CANVAS, 'gamestage');

window.onload = startGame;

function startGame(){
    game.state.add('menuInicio', menuState);
    game.state.add('menuAbout', aboutState);
    game.state.add('menuEnd', endState);
    game.state.add('HUD', hudState);
    game.state.add('nivelA', aState);
    //game.state.add('nivelB', bState);
    //game.state.add('nivelC', cState);

    game.state.start('menuInicio');

}