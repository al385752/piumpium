let hudState = {
    preload: preloadHUD,
    create: createHUD
};

function preloadHUD(){

}

function createHUD(){
    let text = game.add.text(0, 0, 'aquí va el score', {font: 'Arial', fontSize: '25px', fill:'#FFFFFF'});
    text = game.add.text(0, 0 + 60, 'aquí va el tiempo elapsado', {font: 'Arial', fontSize: '25px', fill:'#FFFFFF'});
    text = game.add.text(0, 0 + 120, 'aquí van las letras acertadas', {font: 'Arial', fontSize: '25px', fill:'#FFFFFF'});
    text = game.add.text(0, 0 + 180, 'aquí van los owp desactivados', {font: 'Arial', fontSize: '25px', fill:'#FFFFFF'});
    game.time.events.add(4000, backToStage, this);
}

function backToStage(){
    game.world.removeAll();
    game.state.start('nivel' + stage);
}