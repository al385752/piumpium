let hudState = {
    preload: preloadHUD,
    create: createHUD
};

function preloadHUD(){

}

function createHUD(){
    let text = game.add.text(game.world.centerX, game.world.centerY, 'aquí va el score', {font: 'Arial', fontSize: '75px', fill:'#FFFFFF'});
    text = game.add.text(game.world.centerX, game.world.centerY + 100, 'aquí va el tiempo elapsado', {font: 'Arial', fontSize: '75px', fill:'#FFFFFF'});
    text = game.add.text(game.world.centerX, game.world.centerY + 180, 'aquí van las letras acertadas', {font: 'Arial', fontSize: '75px', fill:'#FFFFFF'});
    text = game.add.text(game.world.centerX, game.world.centerY + 260, 'aquí van los owp desactivados', {font: 'Arial', fontSize: '75px', fill:'#FFFFFF'});
    game.time.events.add(4000, backToStage, this);
}

function backToStage(){
    game.world.removeAll();
    game.state.start('nivel' + stage);
}