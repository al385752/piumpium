const APARICION_OWP_Y = -50;
const TOTAL_OWPs = 5;
const OWP_ANCHOR_X = 0.5;
const OWP_ANCHOR_Y = 0.5;
const TIMER_RHYTHM = 0.1 * Phaser.Timer.SECOND;
const OWP_SPEED = 10;
let anguloOWP;
let activoOWP;
let typist;
let owps;
let points;

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
    createTypist();
    activoOWP = false;
    createOWP();
}

function createTypist(){
    let POSICION_JUGADOR_X = game.world.centerX;
    let POSICION_JUGADOR_Y = game.world.height - 50;
    typist = game.add.sprite (POSICION_JUGADOR_X, POSICION_JUGADOR_Y, 'typist');
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

function updateA(){
    game.physics.arcade.overlap(owps, typist, killTypist, null,this);
    activateOWP();
}

function killTypist(owps, typist){
    game.state.start('menuEnd');
}