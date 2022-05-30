Phaser.Physics.ARCADE;

const TOTAL_OWPs = 5;
const MAX_WAVES = 4;
const TEXT_OFFSET = 15;
const RADIANDS_CONVERSION = 180/Math.PI;
const ANGLE_DEVIATION_TYPIST = 90;
const ANGLE_DEVIATION_OWP = 270;
let typist;
let bullets;
let obj1;
let owps;
let ratio;
let muertos;
let currentWave;
let levelData;
let waveSpeedGeneral;
let wordsGroup;
let lockedOwp;
let lockedOwpLocation;
let wordList;
let bonkSound;
let boomSound;
let typistDeadSound;

let aState = {
    preload: preloadA,
    create: createA,
    update: updateA
};


//PRELOADING ASSETS
function preloadA(){
    game.load.text('dictionaryA', 'assets/dictionaries/dictionaryA.json');
    game.load.image('background', 'assets/imgs/background.png');
    game.load.audio('bonk', 'assets/sounds/bonk.mp3');
    game.load.audio('boom', 'assets/sounds/boom.mp3');
    game.load.audio('typistDead', 'assets/sounds/typistDead.mp3');
    game.load.spritesheet('monkey', 'assets/imgs/Monkey.png',94,128);
    game.load.spritesheet('toucan', 'assets/imgs/Toucan.png', 131,98);
}

//INITIALIZE VARIABLES AND BASIC FUNCTIONS
function createA(){
    let background = game.add.image(-5, 0, 'background');
    background.scale.setTo(0.75);

    lockedOwp = false;

    //WORD JASON
    levelData = JSON.parse(this.game.cache.getText('dictionaryA'));
    initializeWave(currentWave);

    //FUNCTIONS TO INITIALIZE OBJECTS
    createTypist();
    createOWP();
    createWords();
    bullets = game.add.group();

    //SPAWNING OWP TIMED EVENT
    game.time.events.repeat(Phaser.Timer.SECOND * ratio, TOTAL_OWPs, activateOWP, this, waveSpeedGeneral);

    //KEYBOARD INPUTS DECLARATION
    game.input.keyboard.onDownCallback = getKeyboardInput;
}

//INITIALIZE PC
function createTypist(){
    let posicionJugadorX = game.world.centerX;
    let posicionJugadorY = game.world.height - 50;
    typist = game.add.sprite (posicionJugadorX, posicionJugadorY, 'monkey');
    typist.anchor.setTo(0.5);
    typist.scale.setTo(0.5, 0.5);
    game.physics.arcade.enable(typist);
    typist.animations.add('monkey');

    obj1 = game.add.sprite(posicionJugadorX, posicionJugadorY, 'typist');
    obj1.anchor.setTo(0.5, 0.5);
    obj1.scale.setTo(0.05, 0.05);
    obj1.visible = false;
}

//DECLARE OWP CLASS
function createOWP(){
    owps = game.add.physicsGroup();
    owps.createMultiple(TOTAL_OWPs, 'toucan');
    owps.enableBody = true;
    owps.setAll('Phaser.Physics.ARCADE', true);
    owps.setAll('body.collideWorldBounds', true);
    owps.setAll('body.bounce', 0.8);
    owps.callAll('anchor.setTo', 'anchor', 0.5);
    owps.callAll('scale.setTo', 'scale', 0.3, 0.3);
    owps.y = 25;
    timer = game.time.create(false);
    timer.start();
}

//CREATE A GROUP FOR THE WORDS
function createWords(){
    wordsGroup = game.add.group();
    wordsGroup.enableBody = true;
    selectWords();
    wordsGroup.callAll('anchor.setTo', 'anchor', 0.5, 0.5);
    wordsGroup.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetWord);
}

//FUNCTION TO START A WAVE
function initializeWave(w){
    muertos = 0;
    ratio = levelData.ratio[w - 1].R;
    waveSpeedGeneral = levelData.speed[w - 1].S;
    if(w == 1){
        wordList = createWordlist();
    }
}




//ACTUAL GAME FUNCTIONS
function updateA(){
    game.physics.arcade.overlap(owps, typist, killTypist, null,this);
    game.physics.arcade.overlap(bullets.children, owps.children, owpHit, null, this);
    updateTextPosition();  
}



//FUNCTION FOR DYING
function killTypist(owps, typist){
    typistDeadSound = game.add.sound('typistDead', 0.5);
    typistDeadSound.play();
    typistDead = true;
    game.state.start('menuEnd');
}

//GET KEYBOARD INPUTS
function getKeyboardInput(e){
    if(e.keyCode >= Phaser.Keyboard.A && e.keyCode <= Phaser.Keyboard.Z){
        console.log(e.key);
        type(e.key);
    }
}

//CREATE AND LAUNCH OWP
function activateOWP(waveSpeed){
    let owp = owps.getFirstExists(false);
    if(owp){
        owp.animations.add('toucan');
        let gameWorldWidth = game.world.width;
        let owpWidth = owp.body.width;
        let spawnWidth = gameWorldWidth - owpWidth;
        let spawnerPoint = Math.floor(Math.random() * spawnWidth);
        let exactPointSpawn = owpWidth/2 + spawnerPoint;
        wordsGroup.children[owps.children.indexOf(owp)].visible = true;
        owp.reset(exactPointSpawn, 0);
        obj1.x = obj1.x + (Math.random() * (50 + 50) - 50);
        aimOwp(owps.children.indexOf(owp));
        game.physics.arcade.moveToObject(owp, obj1, waveSpeed);
        obj1.x = game.world.centerX;
        owp.play('toucan', 12, true, false);
    }
}

//RESET DEAD OWP
function resetOWP(item){
    boomSound = game.add.sound('boom', 0.1);
    boomSound.play();
    muertos += 1;
    let i = owps.children.indexOf(item);
    let word = wordsGroup.children[i];
    word.destroy();
    item.destroy();
    if(muertos == TOTAL_OWPs){
        changeWave();
    }
}

//RESET USED WORDS
function resetWord(item){
    item.remove();
}

//CHANGE WAVE
function changeWave(){  
    if(currentWave == MAX_WAVES){
        game.state.start('menuEnd');
    }
    else{
        currentWave++;
        game.state.start('HUD');
    }
}

//CREATE AN ARRAY OF WORDS
function createWordlist(){
    let wordsArray = [];
    for(i=0; i < 24; i++){
        wordsArray.push(levelData.words[i].word);
    }
    //RANDOMIZE ARRAY (JAVASCRIPT DOESN'T HAVE RANDOMSORT, WE USE FISHER YATES)
    for(let i = wordsArray.length-1; i > 0; i--){
        let j = Math.floor(Math.random() * i);
        let k = wordsArray[i];
        wordsArray[i]= wordsArray[j];
        wordsArray[j]=k;
    }
    return wordsArray;
}

//GETS 5 WORDS AND ASSIGN THEM TO A GROUP 
function selectWords(){
    for(let i = 0; i < TOTAL_OWPs; i++){
        let word = wordList.pop();
        wordsGroup.addChild(game.add.text(0, 0, word, {fontSize: '18px', fill: '#FFFFFF'}));
        wordsGroup.children[i].visible = false;
    }
}

//MAKE TEXT FOLLOW THE OWP
function updateTextPosition(){
    for(let i = 0; i < TOTAL_OWPs; i++){
        if(owps.children[i]){
            wordsGroup.children[i].x = owps.children[i].x + TEXT_OFFSET;
            wordsGroup.children[i].y = owps.children[i].y + TEXT_OFFSET;
        }
    }
}

//FUNCTION TO CHECK WHICH FUNCTION USE
function type(e){
    if(lockedOwp == true){
        checkKey(e);
    }
    else{
        searchObjective(e);
    }
}

//FUNCTION TO CHECK IF THE KEY PRESSED IS THE ONE WE NEED AND CULL THE WORD
function checkKey(e){
    totalLettersTyped++;
    if(e == wordsGroup.children[lockedOwpLocation].text[0]){
        wordsGroup.children[lockedOwpLocation].setText(wordsGroup.children[lockedOwpLocation].text.substr(1));
        aimTypist(lockedOwpLocation);
        createBullet(owps.children[lockedOwpLocation]); 
        typist.play('monkey', 20);
        if(wordsGroup.children[lockedOwpLocation].text.length <= 0){
            owpsDeactivated++;
            lockedOwp = false;
            resetOWP(owps.children[lockedOwpLocation]);
            resetAimTypist();
        }
        correctLettersTyped++;
    }
}

//FUNCTION TO SEARCH OBJECTIVE OWP (ALSO USES FUNCTION ABOVE TO CULL THE WORD)
function searchObjective(e){
    for(let i = 0; i < TOTAL_OWPs; i++){
        if(wordsGroup.children[i].text[0] == e){
            lockedOwp = true;
            lockedOwpLocation = i;
            checkKey(e);
            break;
        }
    }
}

//ROTATE TYPIST TO AIM AT OWPS
function aimTypist(position){
    let owp = owps.children[position];
    let x = owp.x - typist.x;
    let y = owp.y - typist.y;
    let typistAngle = Math.atan2(y, x) * RADIANDS_CONVERSION;
    typist.angle = typistAngle + ANGLE_DEVIATION_TYPIST;
}

//SEEK WICH OWP ARE YOU AIMING
function aimOwp(position){
    let owp = owps.children[position];
    let x = typist.x - owp.x;
    let y = typist.y - owp.y;
    let owpAngle = Math.atan2(y, x) * RADIANDS_CONVERSION;
    owp.angle = owpAngle + ANGLE_DEVIATION_OWP;
}

//RESETS BACK THE TYPIST
function resetAimTypist(){
    typist.angle = 0;
}

//CREATE A BULLET TO SHOOT AT OWP
function createBullet(target){
    let bullet = game.add.sprite(typist.x, typist.y, 'bullet');
    bullet.anchor.setTo(0.5);
    bullet.scale.setTo(0.5);
    game.physics.enable(bullet, Phaser.Physics.ARCADE);
    bullets.addChild(bullet);
    game.physics.arcade.moveToObject(bullet, target, waveSpeedGeneral * 100);
}

//BULLET COLIDES WITH OWPS
function owpHit(bullet, target){
    bonkSound = game.add.sound('bonk', 0.5);
    bonkSound.play();
    bullets.removeChild(bullet);
    bullet.destroy();
}