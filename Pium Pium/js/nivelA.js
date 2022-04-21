const POSICION_JUGADOR_X = game.world.centerX;
const POSICION_JUGADOR_Y = game.world.height - 50;
const APARICION_OWP_Y = -50;
const TOTAL_OWPs = 100;
const OWP_ANCHOR_X = 0.5;
const OWP_ANCHOR_Y = 0.5;
const TIMER_RHYTHM = 0.1 * Phaser.Timer.SECOND;
let anguloOWP;
let activoOWP;
let typist;
let owp;
let points;

let aState = {
    preload: preloadA,
    create: createA,
    update: updateA
};

function preloadA(){
    game.load.image('typist', 'assets/imgs/X.png');
    game.load.image('owp', 'assets/imgs/activoOWP.png');
}

function createA(){
    createTypist;
    activoOWP = false;
    opw = game.add.group();
}

function createTypist(){
    typist = game.add.sprite (POSICION_JUGADOR_X, POSICION_JUGADOR_Y, 'typist');
    typist.anchor.setTo(0.5, 0.5);
}

function createOWP(){
    owp = game.add.group();
    owp.enableBody = true;
    owp.createMultiple(TOTAL_OWPs, 'owp');
    owp.setBounce(1,1);
    owp.callAll('anchor.setTo', 'anchor', OWP_ANCHOR_X, OWP_ANCHOR_Y);
    owp.setAll('checkWorldBounds', true);
    //Ratio de spawn en el JSON
    //Velocidad del mongolo en el JSON
    game.time.events.loop(TIMER_RHYTHM, activateOWP, this);
}

function activateOWP(){
    let gw = game.world.width;
    let ow = owp.body.width;
    let w = gw-ow;
    let x = Math.floor(Math.random() * w);
    let z = ow/2 + x;
    owp.reset(ow, 0);
}

function updateA(){

}

