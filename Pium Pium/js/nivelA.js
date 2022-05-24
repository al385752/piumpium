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
const OWP_SPEED = 10;
const TEXT_OFFSET = 5;
let anguloOWP;
let activoOWP;
let typist;
let obj1;
let owps;
let ratio;
let typing;

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
let spawn;
let gameTime;
let owpWord;
let wordsUsed;
let wordsGroup;
let text;
let owpCorrelation;
let lockedOwp;
let lockedOwpLocation;
let waveChange;
let owpsPerWave;
let wordList




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
    owpsDeactivated = 0;
    currentWave = -1;
    owpsOnScreen = 0;
    spawn = true;
    activoOWP = false;
    typing = '';
    owpCorrelation = 0;
    waveChange = false;
    owpsPerWave = 5;

    //COSAS DEL JSON
    levelData = JSON.parse(this.game.cache.getText('dictionaryA'));
    owpWord = levelData.words[Math.floor(Math.random() * 24)].word;
    wordsUsed = [];
    ratio = levelData.ratio[0].R;
    waveSpeedGeneral = levelData.speed[0].S;
    console.log(levelData);
    wordList = createWordlist();

    //FUNCIONES DE INICIALIZAR COSAS
    createTypist();
    createOWP();
    createWords();
    createHUD();

    //EVENTO TIMEADO DE CAGAR MARCIANITOS
    let launchOWP = game.time.events.add(Phaser.Timer.SECOND * ratio, checkActivateOWP, this);
    launchOWP.loop = true;

    game.input.keyboard.onDownCallback = getKeyboardInput;
}

//INICIALIZAR PJ
function createTypist(){
    let posicionJugadorX = game.world.centerX;
    let posicionJugadorY = game.world.height - 50;
    typist = game.add.sprite (posicionJugadorX, posicionJugadorY, 'typist');
    typist.anchor.setTo(0.5, 0.5);
    typist.scale.setTo(0.05, 0.05);
    game.physics.arcade.enable(typist);

    obj1 = game.add.sprite(posicionJugadorX, posicionJugadorY, 'typist');
    obj1.anchor.setTo(0.5, 0.5);
    obj1.scale.setTo(0.05, 0.05);
    obj1.visible = false;
}

//DECLARAR CLASE OWP
function createOWP(){
    owps = game.add.group();
    owps.enableBody = true;
    owps.createMultiple(TOTAL_OWPs, 'owp');
    owps.callAll('events.onOutOfBounds.add','events.onOutOfBounds', resetOWP);
    owps.callAll('anchor.setTo', 'anchor', 0.5, 0.5);
    owps.callAll('scale.setTo', 'scale', 0.1, 0.1);
    owps.setAll('checkWorldBounds', true);
    timer = game.time.create(false);
    timer.start();
}

function createWords(){
    wordsGroup = game.add.group();
    wordsGroup.enableBody = true;
    selectWords();
    wordsGroup.callAll('anchor.setTo', 'anchor', 0.5, 0.5);
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
    updateTextPosition();
    /*if(owpsOnScreen > 0){
        for(let i = 0; i < 5; i++){
            wordsGroup.children[i].x = owps.children[i].x + TEXT_OFFSET;
            wordsGroup.children[i].y = owps.children[i].y;
        }
    }*/
/*    if(typing != ''){
        aimOwp();
    }
    */
}



//SUPONGO QUE ES LA FUNCION DE QUE TE MUERES
function killTypist(owps, typist){
    currentWave = 1;
    gameTime = 0; //esto hay que verlo
    game.state.start('menuEnd');
}

function getKeyboardInput(e){
    if(e.keyCode >= Phaser.Keyboard.A && e.keyCode <= Phaser.Keyboard.Z){
        typing += e.key;
        console.log(typing);
    }
}

//COMPRUEBA SI EL TIMER DEBE O NO TIRAR LOS OWP
function checkActivateOWP (){
    if(owpsOnScreen == 0){
        changeWave();
        owpCorrelation = 0;
        /*for(let i = 0; i < TOTAL_OWPs; i++){
            console.log(wordsGroup.children[i]);
            wordsGroup.remove(wordsGroup.children[i]);
        }*/
    }
    if(spawn){
        activateOWP(waveSpeedGeneral);
        owpsOnScreen +=1;
        owpsPerWave -= 1;
        waveChange = false;
        if(owpsPerWave = 0){
            spawn = false;
            waveChange = true;
            owpsPerWave = 5;
        }
    }
}

//FUNCIÓN QUE CREA LOS OWP Y LOS TIRA
function activateOWP(waveSpeed){
    
    let owp = owps.getFirstExists(false);
    if(owp){
        let gameWorldWidth = game.world.width;
        let owpWidth = owp.body.width;
        let spawnWidth = gameWorldWidth - owpWidth;
        let spawnerPoint = Math.floor(Math.random() * spawnWidth);
        let exactPointSpawn = owpWidth/2 + spawnerPoint;
        wordsGroup.children[owpCorrelation].visible = true;
        owp.reset(exactPointSpawn, 0);
        //generar posición y palabra
/*        owpWord = levelData.words[Math.floor(Math.random() * 24)].word;
        while(wordsUsed.includes(owpWord)){
            owpWord = levelData.words[Math.floor(Math.random() * 24)].word;
        }
        wordsGroup.add(game.add.text(owps.children[owpCorrelation].x + TEXT_OFFSET, owps.children[owpCorrelation].y, owpWord, {fontSize: '18px', fill: '#FFFFFF'}));
        game.physics.arcade.moveToObject(wordsGroup.children[owpCorrelation], obj1, waveSpeed);
        wordsUsed.push(owpWord);
        console.log(wordsGroup.children);
        fin*/
        obj1.x = obj1.x + (Math.random() * (50 + 50) - 50);
        game.physics.arcade.moveToObject(owp, obj1, waveSpeed);
        obj1.x = game.world.centerX;
    }
    owpCorrelation++;
}

//RESETEA LOS OWP QUE MUEREN
function resetOWP(item){
    owpsOnScreen = owpsOnScreen - 1;
    item.kill();
}


function resetWord(item){
    console.log('text fuera');
    item.destroy();
}

function changeWave(){  
    if(waveChange){
        if(currentWave == MAX_WAVES){
            game.state.start('menuEnd');
        }
        else{
            spawn = true;
            currentWave += 1;
            selectWords();
            currentWaveText.text = 'Wave: ' + (currentWave + 1);
            waveSpeedGeneral = levelData.speed[currentWave].S;
            ratio = levelData.ratio[currentWave].R;
        }
    }  
}

/*function aimOwp(){
    let i = 0;
    while(i < TOTAL_OWPs){
        if(typing == wordsGroup.children[i].text[0]){
            lockedOwpLocation = i;
            wordsGroup.children[i].text.slice(1);
            typing = '';
            i = TOTAL_OWPs;
        }
        i++;
    }
    if(lockedOwpLocation != null){
        let owpLength = wordsGroup.children[lockedOwpLocation].text.length;
        while(owpLength < 0){
            if(typing == wordsGroup.children[lockedOwpLocation].text[0]){
                typing = '';
                lockedOwp.text.slice(1);
                owpLength--;
            }
            else{
                typing = '';
            }
        }
    }
    resetOWP(owps.children[lockedOwpLocation]);
}*/

function createWordlist(jason){
    let wordsArray = [];
    for(i=0; i < 24; i++){
        wordsArray.push(levelData.words[i].word);
    }
    //RANDOMIZAR EL ARRAY (JAVASCRIPT NO TIENE RANDOMSORT, USAMOS FISHER YATES)
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

function updateTextPosition(){
    for(let i = 0; i < TOTAL_OWPs; i++){
        wordsGroup.children[i].x = owps.children[i].x + TEXT_OFFSET;
        wordsGroup.children[i].y = owps.children[i].y + TEXT_OFFSET;
    }
    
}