let hudState = {
    preload: preloadHUD,
    create: createHUD
};

function preloadHUD(){
    game.load.image('background', 'assets/imgs/background.png');
}

function createHUD(){
    let background = game.add.image(-5, 0, 'background');
    background.scale.setTo(0.75);

    let text = game.add.text(game.world.centerX, game.world.centerY - 140, 'Score: ' + Math.floor(100 * (correctLettersTyped / totalLettersTyped)), {font: '25px Comic Sans MS', fill:'#e3e046', backgroundColor:'#fc9814'});
    text.anchor.setTo(0.5);
    text = game.add.text(game.world.centerX, game.world.centerY - 80, 'Time elapsed: ' + Math.floor(game.time.totalElapsedSeconds()) + ' seconds', {font: '25px Comic Sans MS', fill:'#e3e046', backgroundColor:'#fc9814'});
    text.anchor.setTo(0.5);
    text = game.add.text(game.world.centerX, game.world.centerY - 20, 'Correct letters: ' + correctLettersTyped, {font: '25px Comic Sans MS', fill:'#e3e046', backgroundColor:'#fc9814'});
    text.anchor.setTo(0.5);
    text = game.add.text(game.world.centerX, game.world.centerY + 40, 'Deactivated tucans: ' + owpsDeactivated, {font: '25px Comic Sans MS', fill:'#e3e046', backgroundColor:'#fc9814'});
    text.anchor.setTo(0.5);
    game.time.events.add(4000, backToStage, this);
}

function backToStage(){
    game.world.removeAll();
    game.state.start('nivel' + level);
}