const APARICION_OWP_Y = -50;
const TOTAL_OWPs = 5;
let owpsOnScreen;
let currentWave;
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

let aState = {
    preload: preloadA,
    create: createA,
    update: updateA
};

function preloadA(){
    game.load.image('typist', 'assets/imgs/X.png');
    game.load.image('owp', 'assets/imgs/owp.png');
}

function createA(){
    points = 100;
    correctLettersTyped = 0;
    owpsDeactivated = 0;
    currentWave = 1;
    //timeElapsed = ??
    owpsOnScreen = TOTAL_OWPs;
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

function createOWP(){
    owps = game.add.group();
    owps.enableBody = true;
    owps.createMultiple(TOTAL_OWPs, 'owp');
    owps.callAll('anchor.setTo', 'anchor', 0.5, 0.5);
    owps.callAll('scale.setTo', 'scale', 0.1, 0.1);
    game.time.events.loop(TIMER_RHYTHM, activateOWP, this);
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
        //timeElapsedText = game.add.text(timeElapsedTextX, allY, 'Time elapsed: ' /* qué hay que poner aquí*/, styleHUD);
        currentWaveText = game.add.text(currentWaveTextX, allY, 'Wave: ' + currentWave, styleHUD);
        currentWaveText.anchor.setTo(1, 0);
}

function updateA(){
    if(owpsOnScreen === 0){
        currentWave += 1;
        owpsOnScreen = TOTAL_OWPs;
        //generar otra wave de enemigos, creo que es activateOWP() pero no estoy seguro
    }
    game.physics.arcade.overlap(owps, typist, killTypist, null,this);
    activateOWP();
}

function activateOWP(){
    if(Math.random() < 0.2){
        let owp = owps.getFirstExists(false);
        if(owp){
            let gameWorldWidth = game.world.width;
            let owpWidth = owp.body.width;
            let spawnWidth = gameWorldWidth - owpWidth;
            let spawnerPoint = Math.floor(Math.random() * spawnWidth);
            let exactPointSpawn = owpWidth/2 + spawnerPoint;
            owp.reset(exactPointSpawn, 0);
            owp.body.velocity.x = 0;
            owp.body.velocity.y = OWP_SPEED + 100;
        }
    }    
}

function killTypist(owps, typist){
    points = 100 * (correctLettersTyped / totalLettersTyped);
    game.state.start('menuEnd');
}