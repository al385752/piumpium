let aState = {
    preload: preloadA,
    create: createA,
    update: updateA
};

const APARICION_OWP_Y = -50;
const TOTAL_OWPs = 5;
let owpsOnScreen;
let currentWave;
const MAX_WAVES = 10;
const OWP_ANCHOR_X = 0.5;
const OWP_ANCHOR_Y = 0.5;
const TIMER_RHYTHM = 0.1 * Phaser.Timer.SECOND;
const OWP_SPEED = 10;
let anguloOWP;
let activoOWP;
let typist;
let owps;
//HUD y tal
let points; //para la pantalla de end
let correctLettersTyped;
let correctLettersTypedText;
let totalLettersTyped;
let owpsDeactivated;
let owpsDeactivatedText;
let timeElapsedText;
let currentWaveText;
let levelData;
let waveSpeedGeneral;
//let clock = new Date();
//let initTime = Date.now();

function preloadA(){
    game.load.image('typist', 'assets/imgs/X.png');
    game.load.image('owp', 'assets/imgs/owp.png');
    this.load.text('dictionaryA', 'assets/dictionaries/dictionaryA.json');
}

function createA(){
    points = 100;
    correctLettersTyped = 0;
    owpsDeactivated = 0;
    currentWave = 0;
    //timeElapsed = ??
    owpsOnScreen = TOTAL_OWPs;
    levelData = JSON.parse(this.game.cache.getText('dictionaryA'));
    waveSpeedGeneral = levelData.speed[0].S;
    console.log(levelData);
    createTypist();
    activoOWP = false;
    createOWP();
    createHUD();
}

function createTypist(){
    let posicionJugadorX = game.world.centerX;
    let posicionJugadorY = game.world.height - 50;
    typist = game.add.sprite (posicionJugadorX, posicionJugadorY, 'typist');
    typist.anchor.setTo(0.5, 0.5);
    typist.scale.setTo(0.05, 0.05);
    game.physics.arcade.enable(typist);
}

/*function createOWP(){
    owp = game.add.group();

    owp.enableBody = true;
    owp.createMultiple(TOTAL_OWPs, 'owp');
    owp.callAll();
    owp.body.bounce.setAll(1);
    owp.body.callAll('anchor.setTo', 'anchor', OWP_ANCHOR_X, OWP_ANCHOR_Y);
    owp.body.setAll('checkWorldBounds', true);
    //Ratio de spawn en el JSON
    //Velocidad del mongolo en el JSON
    game.time.events.loop(TIMER_RHYTHM, activateOWP, this);
}*/

function resetOWP(item){
    console.log('muerto');
    owpsOnScreen = owpsOnScreen - 1;
    console.log("quedan: " + owpsOnScreen);
    item.kill();
}

function createOWP(){
    owps = game.add.group();
    owps.enableBody = true;
    owps.createMultiple(TOTAL_OWPs, 'owp');
    owps.callAll('events.onOutOfBounds.add','events.onOutOfBounds', resetOWP);
    owps.callAll('anchor.setTo', 'anchor', 0.5, 0.5);
    owps.callAll('scale.setTo', 'scale', 0.1, 0.1);
    owps.setAll('checkWorldBounds', true);
    //game.time.events.loop(TIMER_RHYTHM, activateOWP, this);
    game.time.events.repeatCount(TIMER_RHYTHM, activateOWP, this);
}

function createHUD(){
        let lettersTypedTextX = 5;
        let owpsDeactivatedTextX = game.world.width / 4;
        let timeElapsedTextX = game.world.width / 2;
        let currentWaveTextX = game.world.width - 5;
        let allY = game.world.height - 25;
        let styleHUD = {fontSize: '18px', fill: '#FFFFFF'}
        
        correctLettersTypedText = game.add.text(lettersTypedTextX, allY, 'Letters: ' + correctLettersTyped, styleHUD);
        owpsDeactivatedText = game.add.text(owpsDeactivatedTextX, allY, 'Deactivated: ' + owpsDeactivated, styleHUD);
        timeElapsedText = game.add.text(timeElapsedTextX, allY, 'Time elapsed: ' + Date.now(), styleHUD);
        currentWaveText = game.add.text(currentWaveTextX, allY, 'Wave: ' + (currentWave + 1), styleHUD);
        currentWaveText.anchor.setTo(1, 0);
}

function updateA(){
    if(owpsOnScreen == 0){
        console.log('entra');
        if(currentWave == MAX_WAVES){
            game.state.start('menuEnd');
        }
        else{
            currentWave += 1;
            owpsOnScreen = TOTAL_OWPs;
            currentWaveText.text = 'Wave: ' + (currentWave + 1);
            //generar otra wave de enemigos, creo que es activateOWP() pero no estoy seguro
            waveSpeedGeneral = levelData.speed[currentWave].S;
            activateOWP(waveSpeedGeneral);
            console.log(waveSpeedGeneral);
        }
    }
    //game.physics.arcade.overlap(owps, typist, killTypist, null,this);
    timeElapsedText.text = 'Time elapsed: ' + game.time.totalElapsedSeconds();
}

function activateOWP(waveSpeed){
    if(Math.random() < 0.2){
        let owp = owps.getFirstExists(false);
        if(owp){
            let gameWorldWidth = game.world.width;
            let owpWidth = owp.body.width;
            let spawnWidth = gameWorldWidth - owpWidth;
            let spawnerPoint = Math.floor(Math.random() * spawnWidth);
            let exactPointSpawn = owpWidth/2 + spawnerPoint;
            owp.reset(exactPointSpawn, 0);
            //owp.body.velocity.x = 0;
            //owp.body.velocity.y = waveSpeed;
            game.physics.arcade.moveToObject(owp, typist, waveSpeed);
        }
    }    
}

function killTypist(owps, typist){
    game.state.start('menuEnd');
}