Phaser.Physics.ARCADE;

const APARICION_OWP_Y = -50;
const TOTAL_OWPs = 5;
let currentWave;
const MAX_WAVES = 9;
const OWP_ANCHOR_X = 0.5;
const OWP_ANCHOR_Y = 0.5;
const OWP_SPEED = 10;
const TEXT_OFFSET = 5;
let anguloOWP;
let activoOWP;
let typist;
let obj1;
let owps;
let ratio;
let typing;
let muertos;

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
let gameTime;
let owpWord;
let wordsUsed;
let wordsGroup;
let text;
let owpCorrelation;
let lockedOwp;
let lockedOwpLocation;
let waveChange;
let wordList;

let aState = {
    preload: preloadA,
    create: createA,
    update: updateA
};


//PRECARGAR DE IMAGENES LETRAS Y POLLAS
function preloadA(){
    game.load.image('typist', 'assets/imgs/X.png');
    game.load.image('owp', 'assets/imgs/owp.png');
    this.load.text('dictionaryA', 'assets/dictionaries/dictionaryA.json');
}

//INICIALIZAR VARIABLES Y FUNCIONES BÁSICAS
function createA(){
    points = 100;
    correctLettersTyped = 0;
    totalLettersTyped = 0;
    owpsDeactivated = 0;
    currentWave = 0;
    activoOWP = false;
    owpCorrelation = 0;
    waveChange = false;
    lockedOwp = false;
    muertos = 0;

    //COSAS DEL JSON
    levelData = JSON.parse(this.game.cache.getText('dictionaryA'));
    owpWord = levelData.words[Math.floor(Math.random() * 24)].word;
    wordsUsed = [];
    ratio = levelData.ratio[0].R;
    waveSpeedGeneral = levelData.speed[0].S;
    console.log(levelData);
    //wordList = createWordlist();

    //FUNCIONES DE INICIALIZAR COSAS
    createTypist();
    createOWP();
    //createWords();
    createHUD();

    //EVENTO TIMEADO DE CAGAR MARCIANITOS
    let launchOWPs = game.time.events.repeat(Phaser.Timer.SECOND * ratio, TOTAL_OWPs, activateOWP, this);

    game.input.keyboard.onDownCallback = getKeyboardInput;
}

//INICIALIZAR PJ
function createTypist(){
    let posicionJugadorX = game.world.centerX;
    let posicionJugadorY = game.world.height - 50;
    typist = game.add.sprite (posicionJugadorX, posicionJugadorY, 'typist');
    typist.anchor.setTo(0.5, 0.5);
    typist.scale.setTo(0.05, 0.05);
    //game.physics.arcade.enable(typist);

    obj1 = game.add.sprite(posicionJugadorX, posicionJugadorY, 'typist');
    obj1.anchor.setTo(0.5, 0.5);
    obj1.scale.setTo(0.05, 0.05);
    obj1.visible = false;
}

//DECLARAR CLASE OWP
function createOWP(){
    owps = game.add.physicsGroup();
    owps.enableBody = true;
    owps.setAll('Phaser.Physics.ARCADE', true);
    owps.setAll('collideWorldBounds', true);
    owps.setAll('bounce', 1);
    owps.createMultiple(TOTAL_OWPs, 'owp');
    owps.callAll('anchor.setTo', 'anchor', 0.5, 0.5);
    owps.callAll('scale.setTo', 'scale', 0.1, 0.1);
    timer = game.time.create(false);
    timer.start();
}

function createWords(){
    wordsGroup = game.add.group();
    wordsGroup.enableBody = true;
    selectWords();
    wordsGroup.callAll('anchor.setTo', 'anchor', 0.5, 0.5);
    wordsGroup.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetWord);
}

//INICIALIZAR HUD
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




//LO QUE PASA MIENTRAS SE CORRE EL JUEGO (jaja se corre (sin ofender (fav si tu y yo)))
function updateA(){
    gameTime = game.time.totalElapsedSeconds();
    game.physics.arcade.collide(owps, typist, killTypist, null,this);
    timeElapsedText.text = 'Time elapsed: ' + gameTime;
    //updateTextPosition();  
}



//SUPONGO QUE ES LA FUNCION DE QUE TE MUERES
function killTypist(owps, typist){
    currentWave = 0;
    gameTime = 0; //esto hay que verlo
    game.state.start('menuEnd');
}

function getKeyboardInput(e){
    if(e.keyCode >= Phaser.Keyboard.A && e.keyCode <= Phaser.Keyboard.Z){
        console.log(e.key);
        type(e);
    }
}

//CREATE AND LAUNCH OWP
function activateOWP(waveSpeed){
    let owp = owps.getFirstExists(false);
    if(owp){
        let gameWorldWidth = game.world.width;
        let owpWidth = owp.body.width;
        let spawnWidth = gameWorldWidth - owpWidth;
        let spawnerPoint = Math.floor(Math.random() * spawnWidth);
        let exactPointSpawn = owpWidth/2 + spawnerPoint;
        //wordsGroup.children[owpCorrelation].visible = true;
        owp.reset(exactPointSpawn, 0);
        obj1.x = obj1.x + (Math.random() * (50 + 50) - 50);
        game.physics.arcade.moveToObject(owp, obj1, waveSpeed);
        obj1.x = game.world.centerX;
    }
    owpCorrelation++;
}

//RESET DEAD OWP
function resetOWP(item){
    muertos += 1;
    item.kill();
    if(muertos == TOTAL_OWPs){
        changeWave();
        owpCorrelation = 0;
    }
}

//RESET USED WORDS
function resetWord(item){
    console.log('text fuera');
    item.remove();
}

//CHANGE WAVE
function changeWave(){  
    if(currentWave == MAX_WAVES){
        game.state.start('menuEnd');
    }
    else{
        currentWave += 1;
        muertos = 0;
        //selectWords();
        currentWaveText.text = 'Wave: ' + (currentWave + 1);
        waveSpeedGeneral = levelData.speed[currentWave].S;
        ratio = levelData.ratio[currentWave].R;
        let launchOWPs = game.time.events.repeat(Phaser.Timer.SECOND * ratio, TOTAL_OWPs, activateOWP, this);
    }
}

//CREATE AN ARRAY OF WORDS
function createWordlist(jason){
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
        wordsGroup.children[i].x = owps.children[i].x + TEXT_OFFSET;
        wordsGroup.children[i].y = owps.children[i].y + TEXT_OFFSET;
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
    if(e == wordsGroup.children[lockedOwpLocation].text[0]){
        console.log('hola');
        wordsGroup.children[lockedOwpLocation].text = wordsGroup.children[lockedOwpLocation].text.substr(1);
        console.log(wordsGroup.children[lockedOwpLocation].text);
        if(wordsGroup.children[lockedOwpLocation].text.length <= 0){
            owpsDeactivated++;
            lockedOwp = false;
            resetOWP();
        }
        correctLettersTyped++;
        totalLettersTyped++;
    }
    else{
        totalLettersTyped++;
    }
}

//FUNCTION TO SEARCH OBJECTIVE OWP (ALSO USES FUNCTION ABOVE TO CULL THE WORD)
function searchObjective(e){
    for(let i = 0; i < TOTAL_OWPs; i++){
        if(wordsGroup.children[i].text[0] == e){
            lockedOwp = true;
            lockedOwpLocation = i;
            checkKey(e);
            correctLettersTyped++;
            totalLettersTyped++;
        }
    }
    totalLettersTyped++;
    typing = '';
}