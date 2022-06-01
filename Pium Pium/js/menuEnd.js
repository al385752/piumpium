let endState = {
    preload: preloadEnd,
    create: createEnd
};

function preloadEnd(){
    game.load.image('restart', 'assets/imgs/backbutton.png');
    game.load.image('background', 'assets/imgs/background.png');
    game.load.audio('monke', 'assets/sounds/monkeyHappy.mp3');
}

function createEnd(){
    let background = game.add.image(-5, 0, 'background');
    background.scale.setTo(0.75);

    backgroundMusic.stop();

    //IF THE PLAYER HAS BEEN KILLED IN THE GAME, TEXT AND AUDIO WILL CHANGE

    if(typistDead){
        let endText ="Tucans have eaten your banana!!";
        let endStyle = {font:'50px Arial', fill:'#e3e046', backgroundColor:'#fc9814'}
        let gameOver = game.add.text(game.world.centerX, game.world.centerY - 150, endText, endStyle);
        gameOver.anchor.setTo(0.5);
    }
    else{
        let endText = 'Level ' + level + ' completed! Monke happy';
        let endStyle = {font:'50px Comic Sans MS', fill:'#e3e046', backgroundColor:'#fc9814'}
        let gameOver = game.add.text(game.world.centerX, game.world.centerY - 150, endText, endStyle);
        gameOver.anchor.setTo(0.5);
        let monkeyAudio = game.add.audio('monke', 0.8);
        monkeyAudio.play();
    }
    
    if(totalLettersTyped == 0){
        pointsText = 'Accuracy: 0';
    }
    else{
        pointsText = 'Accuracy: ' + Math.floor(100 * (correctLettersTyped / totalLettersTyped));
    }
    let pointsStyle = {font:'25px Comic Sans MS', fill:'#e3e046', backgroundColor:'#fc9814'};
    let finalPoints = game.add.text(game.world.centerX, game.world.centerY, pointsText, pointsStyle);
    finalPoints.anchor.setTo(0.5);

    let btnRestart = game.add.button(game.world.centerX, game.world.centerY + 170, 'restart', returnMenu);
    btnRestart.scale.setTo(0.1);
    btnRestart.anchor.setTo(0.5);
}

function returnMenu(){
    game.state.start('menuInicio');
}