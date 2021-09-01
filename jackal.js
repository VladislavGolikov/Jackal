
let allFull=[]; /* главный массив игрового поля!!! */
let allCrew=[]; /* массив команд */

class UnitField {
    constructor(positionX,positionY,entity) {
        this.goldPicture=`url(sprites/columbia.png)`; /* путь к файлу картинки золота на поле */
        this.goldCapacity=0; /* по умолчанию на поле 0 золота */
        this.retention=1; /* текущая задержка ухода */
        this.retentionMax=1; /* обычно у поля нет задержки ухода */
        this.unitFieldCode=`<div class="unit-field">
                              <div class="gold-on-field hidd">${this.goldCapacity}</div>
                              <div class="retention hidd">${this.retention}</div>
                            </div>`; /* код для вставки на страницу */
        this.positionX=positionX; /* местоположение по горизонтали */
        this.positionY=positionY; /* местоположение по вертикали */
        this.entity=entity; /* ключ для смысла поля! */
        this.fieldPicture=`url(sprites-fields/${this.entity}.png)`; /* путь к файлу картинки поля */
        if (this.entity===water) {this.fieldPicture=`url(sprites-fields/${waterDisplay}.png)`}; /* путь к файлу картинки моря */
        this.blinking=false; /* активно ли поле (мигает или нет) */
        this.closedField=true; /* по умолчанию поле закрыто */
        this.closedFieldBackground=`url(sprites/closed-field.jpg)`; /* путь к файлу фона закрытого поля */
        this.whoseField=null; /* кто находится на поле - чья команда - по умолчанию никого */
        this.quantityPirates=0; /* сколько пиратов на поле - по умолчанию никого */
        this.quantityPiratesWithGold=0; /* сколько пиратов на поле с золотом - по умолчанию никого */
        this.createField();
        this.createMaxRetention();
        this.openField(false); /* закрытие поля при старте */
    }
    createField() {
        placePlayingField.insertAdjacentHTML('afterBegin',this.unitFieldCode);
        this.placeUnitField=document.querySelector('.unit-field');

        this.placeUnitField.style.backgroundImage=this.fieldPicture;
        this.placeUnitField.style.gridColumn=this.positionX;
        this.placeUnitField.style.gridRow=this.positionY;
        this.placeUnitField.children[0].style.backgroundImage=this.goldPicture;
    }
    createMaxRetention() {
        if (this.entity=='jungle') {this.retentionMax=2};
        if (this.entity=='desert') {this.retentionMax=3};
        if (this.entity=='swamp') {this.retentionMax=4};
        if (this.entity=='mountains') {this.retentionMax=5};
        if (this.entity=='trap') {this.retentionMax=10000};
        this.retention=this.retentionMax;
    }
    blinkField(direct=true) {
        if (direct) {
            this.placeUnitField.classList.add('blinked');
            this.blinking=true;
        }else{
            this.placeUnitField.classList.remove('blinked');
            this.blinking=false;
        }
    }
    openField(direct=true) {
        if (this.entity==water) {return}; /* если вода закрытия-открытия не происходит */
        if (!direct) {
            this.placeUnitField.style.backgroundImage=this.closedFieldBackground;
            this.closedField=true;
        }else{
            this.placeUnitField.style.backgroundImage=this.fieldPicture;
            this.closedField=false;
        }
    }
    becomesEmptyField() { /* приведение поля к пустому если нужно */
        this.entity='empty'+Math.ceil(Math.random()*4);
        this.fieldPicture=`url(sprites-fields/${this.entity}.png)`;
        this.placeUnitField.style.backgroundImage=this.fieldPicture;
    }
    addGold(n=0) { /* изменение количества золота на поле */
        this.goldCapacity+=n;
        this.placeUnitField.children[0].innerHTML=this.goldCapacity;
        if (this.goldCapacity<1) {this.placeUnitField.children[0].classList.add('hidd')}else{this.placeUnitField.children[0].classList.remove('hidd')}
    }
    updateRetention() {
        this.placeUnitField.children[1].innerHTML=this.retention;
        if (this.retention<=this.retentionMax&&this.retentionMax>1) {
            this.placeUnitField.children[1].classList.remove('hidd');
            if (this.retention===this.retentionMax) {
                this.placeUnitField.children[1].classList.add('retentionGo')
            }else{
                this.placeUnitField.children[1].classList.remove('retentionGo')
            }
        }else{
            this.placeUnitField.children[1].classList.add('hidd');
        }
    }
    changeWater(newWater) {
        if (this.entity===water) {
            this.fieldPicture=`url(sprites-fields/${newWater}.png)`;
            this.placeUnitField.style.backgroundImage=this.fieldPicture;
        }
    }

}

/*------ раздача игрового поля --------------------------------------*/
distributionPlayingField(arrayPrepared);
/*------ раздача игрового поля --------------------------------------*/



class Crew {
    constructor(shipX,shipY,name,shipPicture='ship1',color='black',piratePicture='pirat1',piratePictureAtSea='rescue-ring') {
        this.name=name; /* название команды */
        this.maxCrew=3; /* начальная и максимальна численность команды */
        this.shipX=shipX; /* x координата корабля */
        this.shipY=shipY; /* y координата корабля */
        this.shipPicture=`url(sprites/${shipPicture}.png)`; /* путь к картинке корабля */
        this.piratePicture=`url(sprites/${piratePicture}.png)`; /* путь к картинке пирата */
        this.piratePictureAtSea=`url(sprites/${piratePictureAtSea}.png)`; /* путь к картинке пирата в море */
        this.shipCode=`<div class="ship"></div>`; /* код для вставки корабля на страницу */
        this.crewColor=color; /* основной цвет команды */
        this.aboard=this.maxCrew; /* число пиратов на борту */
        this.goldOnBoard=0; /* по умолчанию 0 золота на борту */
        this.currentCrew=[]; /* массив всех пиратов команды */

        this.exploredFields=0; /* по умолчанию разведанных командой полей 0 */
        this.attemptedMove=0; /* количество повторений хода за текущий ход */
        this.attemptedMoveMax=7; /* количество максимальных повторений хода до смерти */

        this.createShip();
        this.createPirates(this.maxCrew);
        this.updatePlacePirate(this.currentCrew.length);
    }
    createShip() {
        placePlayingField.insertAdjacentHTML('afterBegin',this.shipCode);
        this.placeShip=document.querySelector('.ship');
        this.placeShip.style.backgroundImage=this.shipPicture;
        this.placeShip.style.gridColumn=this.shipX;
        this.placeShip.style.gridRow=this.shipY;
        this.placeShip.innerHTML=this.aboard;
        allFull[xyTo(this.shipX,this.shipY)].whoseField=this;
    }
    updatePlaceShip() {
        this.placeShip.style.gridColumn=this.shipX;
        this.placeShip.style.gridRow=this.shipY;
    }
    createPirates(max) {
        for (let i=1;i<=max;i++) {
            this.currentCrew.push(new PiratСharacter(this.name,i,this.piratePicture,this.piratePictureAtSea));
            allFull[xyTo(this.shipX,this.shipY)].quantityPirates++;
        }
    }
    blinkField(direct=true) {/* на самом деле мигание для кораблей */
        if (direct) {
            this.placeShip.classList.add('blinked');
        }else{
            this.placeShip.classList.remove('blinked');
        }
    }
    updatePlacePirate(what=this.currentCrew.length) {

        allFull.forEach(function(el){if (el.whoseField===this) {
            let counter1=el.quantityPiratesWithGold;
            for (let i=1;i<=el.quantityPirates;i++) {
                what--;

                if (counter1>0) {
                    this.currentCrew[what].withGold=true;
                    this.currentCrew[what].updateСharacter();
                }else{
                    this.currentCrew[what].withGold=false;
                    this.currentCrew[what].updateСharacter();
                };
                counter1--;
                this.currentCrew[what].moveСharacter(el.positionX,el.positionY);
            }
        }},this);
        this.placeShip.innerHTML=this.aboard;
    }
    diePirate(x,y) {
        this.currentCrew.pop();
        alert('пират умер на '+x+' '+y)
    }

}

class PiratСharacter {
    constructor(team,order,piratePicture,piratePictureAtSea) {
        this.team=team;
        this.order=order;
        this.pirateCode=`<div class="pirate"><div class="withgoldpirate"></div></div>`; /* код для вставки пирата на страницу */
        this.piratePicture=piratePicture; /* путь к картинке пирата */
        this.piratePictureAtSea=piratePictureAtSea; /* путь к картинке пирата в море */
        this.withGold=false; /* по умолчанию пират без золота */
        this.atSea=false; /* по умолчанию пират не в море */
        this.createСharacter(this.order)
    }
    createСharacter(order) {
        placePlayingField.insertAdjacentHTML('afterBegin',this.pirateCode);
        this.placePirate=document.querySelector('.pirate');
        this.placeGold=document.querySelector('.withgoldpirate');
        this.placePirate.classList.add(`order${order}`);
        this.placePirate.style.backgroundImage=this.piratePicture;
    }

    moveСharacter(x,y) {
        this.placePirate.style.gridColumn=x;
        this.placePirate.style.gridRow=y;
        this.updateСharacter(x,y);
    }
    updateСharacter(x,y) {

        if (this.withGold) {this.placeGold.classList.remove(`hidd`)}else{this.placeGold.classList.add(`hidd`)}
        //d воде и с золотом....
    }
    selectedCharacter() {/* выбранный при ходе пират увелич или мигает сам....*/}
}

allCrew.push(new Crew(shipСoordinates[0],shipСoordinates[1],'север','ship1','red','pirat1'));
allCrew.push(new Crew(shipСoordinates[2],shipСoordinates[3],'восток','ship1','yellow','pirat2'));
allCrew.push(new Crew(shipСoordinates[4],shipСoordinates[5],'юг','ship1','blue','pirat3'));
allCrew.push(new Crew(shipСoordinates[6],shipСoordinates[7],'запад','ship1','green','pirat4'));

class StepController {
    static timeLapse=400; /* по умолчанию 100 ходов для 4 команд */
    static indexTeamMove=Math.floor(Math.random()*4); /* выбор команды ходящей первой произволен */
    static teamMove=allCrew[StepController.indexTeamMove]; /* указатель по объекту команды */
    static progressStage='preparation'; /* этап хода 'preparation','begin','end','prolongation' */
    static stepBeginX=null; /* поле начала хода Х */
    static stepBeginY=null; /* поле начала хода Y */
    static stepPreviousX=null; /* поле предыдущего пункта хода X */
    static stepPreviousY=null; /* поле предыдущего пункта хода Y */
    static stepContinuedX=null; /* поле продолжения хода Х */
    static stepContinuedY=null; /* поле продолжения хода Y */
    static actionButton=''; /* по умолчанию действия кнопкой нет */
    static goldTakeButton=false; /* по умолчанию золото взять нельзя */
    static goldDropButton=false; /* по умолчанию золото бросить нельзя */
    static disableShip=false; /* блокировка корабля и движения в воде (технич) */

    constructor(crew) {
        this.constructor.selectStepBegin();
    }

    static changeTeamMove() { /* переход хода */
        allCrew[StepController.indexTeamMove].attemptedMove=0; /* сброс попыток хода команды */
        StepController.indexTeamMove++;
        StepController.timeLapse--;
        if (StepController.indexTeamMove>=allCrew.length) {StepController.indexTeamMove=0};
        StepController.teamMove=allCrew[StepController.indexTeamMove];
        StepController.stepBeginX=null; /* сброс начала хода Х */
        StepController.stepBeginY=null; /* сброс начала хода Y */
        StepController.stepPreviousX=null; /* сброс предыдущего пункта хода X */
        StepController.stepPreviousY=null; /* сброс предыдущего пункта хода Y */
        StepController.stepContinuedX=null; /* сброс продолжения хода Х */
        StepController.stepContinuedY=null; /* сброс продолжения хода Y */
        StepController.disableShip=false; /* сброс запрета хода кораблем-водой */
        StepController.selectStepBegin();
        StepController.nullifyGeneralAction();
        StepController.updateGeneralAction(); /* главная кнопка на предмет высадки */
        StepController.updateGoldAction(1,1,true); /* сброс золотых кнопок*/
        if (StepController.timeLapse<=0) alert('игра закончена!!!');
    }

    static selectStepBegin() {
        StepController.nullifyStepBlinked(); /* сброс предыдущего выделения */

        allFull.forEach(function(el,ind){
            if (el.whoseField===StepController.teamMove&&el.quantityPirates>0) {
                el.blinkField(true); /* если на поле больше 0 пиратов ходящей команды - выбираем! */
                if (allCrew[StepController.indexTeamMove].aboard>0) {allCrew[StepController.indexTeamMove].blinkField(true)}; /* если на борту больше 0 -выбираем! */
            }
        },this)

        StepController.progressStage='begin'; /* этап хода => на начало действия */
    }

    static selectStepEnd(x,y) {
        StepController.nullifyStepBlinked(); /* сброс предыдущего выделения */
        if (allCrew[StepController.indexTeamMove].attemptedMove<1) {
            StepController.stepBeginX=x; /* запоминаем координату Х начала хода */
            StepController.stepBeginY=y; /* запоминаем координату Y начала хода */
            StepController.stepPreviousX=StepController.stepBeginX; /* запоминаем предыдущий шаг */
            StepController.stepPreviousY=StepController.stepBeginY; /* запоминаем предыдущий шаг */
        }else{
            StepController.stepPreviousX=StepController.stepContinuedX; /* запоминаем предыдущий шаг */
            StepController.stepPreviousY=StepController.stepContinuedY; /* запоминаем предыдущий шаг */
            StepController.stepContinuedX=x; /* запоминаем координату Х продолжения хода */
            StepController.stepContinuedY=y; /* запоминаем координату Y продолжения хода */
        }
        if (allCrew[StepController.indexTeamMove].attemptedMove===1) { /* на этом шаге континью еще не определено! */
                StepController.stepPreviousX=StepController.stepBeginX; /* запоминаем предыдущий шаг */
                StepController.stepPreviousY=StepController.stepBeginY; /* запоминаем предыдущий шаг */
        }

        if (allFull[xyTo(x,y)].entity==water) {StepController.selectStepEndWater(x,y)}else{StepController.selectStepEndTerra(x,y)}

        if (allFull[xyTo(x,y)].retention<allFull[xyTo(x,y)].retentionMax) {StepController.nullifyStepBlinked()} //если вертушки - сброс!
        StepController.nullifyGeneralAction(); /* сброс главной кнопки */
        if (StepController.teamMove.attemptedMove<=1) {StepController.updateGeneralAction(x,y)}; /* проверка главной кнопки */
        StepController.updateGoldAction(x,y); /* проверка кнопок золота */
        StepController.progressStage='end'; /* этап хода => на конец действия */
    }
    static selectStepEndWater(x,y) { /* ход в воде */
        if (StepController.teamMove.shipX===x&&StepController.teamMove.shipY===y) { /* если ход кораблем */
            if (StepController.indexTeamMove===0||StepController.indexTeamMove===2) {
                if (x>3) {allFull[xyTo(x-1,y)].blinkField(true)};
                if (x<playingFieldSize-2) {allFull[xyTo(+x+1,y)].blinkField(true)}
            }
            if (StepController.indexTeamMove===1||StepController.indexTeamMove===3) {
                if (y>3) {allFull[xyTo(x,y-1)].blinkField(true)};
                if (y<playingFieldSize-2) {allFull[xyTo(x,+y+1)].blinkField(true)}
            }
        return;
        }

        if (x>1&&y>1) {allFull[xyTo(x-1,y-1)].blinkField(true)};
        if (x>1) {allFull[xyTo(x-1,y)].blinkField(true)};
        if (x>1&&y<playingFieldSize) {allFull[xyTo(x-1,+y+1)].blinkField(true)};
        if (y>1) {allFull[xyTo(x,y-1)].blinkField(true)};
        if (y<playingFieldSize) {allFull[xyTo(x,+y+1)].blinkField(true)};
        if (x<playingFieldSize&&y>1) {allFull[xyTo(+x+1,y-1)].blinkField(true)};
        if (x<playingFieldSize) {allFull[xyTo(+x+1,y)].blinkField(true)};
        if (x<playingFieldSize&&y<playingFieldSize) {allFull[xyTo(+x+1,+y+1)].blinkField(true)};
        allFull.forEach(function(el) {if (el.entity!==water) {el.blinkField(false)}}); /* сушу убираем из выбора */

    }
    static selectStepEndTerra(x,y) { /* обычный ход */

        allCrew[StepController.indexTeamMove].attemptedMove++; /* новая попытка хода команды */
        if (allCrew[StepController.indexTeamMove].attemptedMove<=1){ /* обычный ход */
            allFull[xyTo(x-1,y-1)].blinkField(true);
            allFull[xyTo(x-1,y)].blinkField(true);
            allFull[xyTo(x-1,+y+1)].blinkField(true);
            allFull[xyTo(x,y-1)].blinkField(true);
            allFull[xyTo(x,+y+1)].blinkField(true);
            allFull[xyTo(+x+1,y-1)].blinkField(true);
            allFull[xyTo(+x+1,y)].blinkField(true);
            allFull[xyTo(+x+1,+y+1)].blinkField(true);
            allFull.forEach(function(el) {if (el.entity==water) {el.blinkField(false)}}); /* воду убираем из выбора */
            return;
        }
        if (allFull[xyTo(x,y)].entity=='arrow11') {allFull[xyTo(x,y-1)].blinkField(true)}
        if (allFull[xyTo(x,y)].entity=='arrow12') {allFull[xyTo(+x+1,y)].blinkField(true)}
        if (allFull[xyTo(x,y)].entity=='arrow13') {allFull[xyTo(x,+y+1)].blinkField(true)}
        if (allFull[xyTo(x,y)].entity=='arrow14') {allFull[xyTo(x-1,y)].blinkField(true)}
        if (allFull[xyTo(x,y)].entity=='arrow21') {allFull[xyTo(+x+1,y-1)].blinkField(true)}
        if (allFull[xyTo(x,y)].entity=='arrow22') {allFull[xyTo(+x+1,+y+1)].blinkField(true)}
        if (allFull[xyTo(x,y)].entity=='arrow23') {allFull[xyTo(x-1,+y+1)].blinkField(true)}
        if (allFull[xyTo(x,y)].entity=='arrow24') {allFull[xyTo(x-1,y-1)].blinkField(true)}
        if (allFull[xyTo(x,y)].entity=='arrow31') {allFull[xyTo(x,y-1)].blinkField(true);allFull[xyTo(x,+y+1)].blinkField(true)}
        if (allFull[xyTo(x,y)].entity=='arrow32') {allFull[xyTo(+x+1,y)].blinkField(true);allFull[xyTo(x-1,y)].blinkField(true)}
        if (allFull[xyTo(x,y)].entity=='arrow41') {allFull[xyTo(+x+1,+y+1)].blinkField(true);allFull[xyTo(x-1,y-1)].blinkField(true)}
        if (allFull[xyTo(x,y)].entity=='arrow42') {allFull[xyTo(x-1,+y+1)].blinkField(true);allFull[xyTo(+x+1,y-1)].blinkField(true)}
        if (allFull[xyTo(x,y)].entity=='arrow51') {allFull[xyTo(+x+1,y-1)].blinkField(true);allFull[xyTo(x,+y+1)].blinkField(true);
            allFull[xyTo(x-1,y)].blinkField(true)}
        if (allFull[xyTo(x,y)].entity=='arrow52') {allFull[xyTo(+x+1,+y+1)].blinkField(true);allFull[xyTo(x,y-1)].blinkField(true);
            allFull[xyTo(x-1,y)].blinkField(true)}
        if (allFull[xyTo(x,y)].entity=='arrow53') {allFull[xyTo(x-1,+y+1)].blinkField(true);allFull[xyTo(x,y-1)].blinkField(true);
            allFull[xyTo(+x+1,y)].blinkField(true)}
        if (allFull[xyTo(x,y)].entity=='arrow54') {allFull[xyTo(x-1,y-1)].blinkField(true);allFull[xyTo(x,+y+1)].blinkField(true);
            allFull[xyTo(+x+1,y)].blinkField(true)}
        if (allFull[xyTo(x,y)].entity=='arrow6') {allFull[xyTo(x,y-1)].blinkField(true);allFull[xyTo(+x+1,y)].blinkField(true);
            allFull[xyTo(x,+y+1)].blinkField(true);allFull[xyTo(x-1,y)].blinkField(true)}
        if (allFull[xyTo(x,y)].entity=='arrow7') {allFull[xyTo(+x+1,y-1)].blinkField(true);allFull[xyTo(+x+1,+y+1)].blinkField(true);
            allFull[xyTo(x-1,+y+1)].blinkField(true);allFull[xyTo(x-1,y-1)].blinkField(true)}
        if (allFull[xyTo(x,y)].entity=='ice') {allFull[xyTo(x*2-StepController.stepPreviousX,y*2-StepController.stepPreviousY)].blinkField(true)}
        if (allFull[xyTo(x,y)].entity=='crocodile') {allFull[xyTo(StepController.stepPreviousX,StepController.stepPreviousY)].blinkField(true)}
        if (allFull[xyTo(x,y)].entity=='horse') {
            if (y>2){allFull[xyTo(x-1,y-2)].blinkField(true);allFull[xyTo(+x+1,y-2)].blinkField(true)};
            if (x>2){allFull[xyTo(x-2,y-1)].blinkField(true);allFull[xyTo(x-2,+y+1)].blinkField(true)};
            if (y<playingFieldSize-1){allFull[xyTo(x-1,+y+2)].blinkField(true);allFull[xyTo(+x+1,+y+2)].blinkField(true)};
            if (x<playingFieldSize-1){allFull[xyTo(+x+2,y-1)].blinkField(true);allFull[xyTo(+x+2,+y+1)].blinkField(true)};
        }
        if (allFull[xyTo(x,y)].entity=='grass') {
            const course=Math.ceil(Math.random()*8);
            allFull[xyTo(x-Math.round(Math.sin(Math.PI/4*course)),y-Math.round(Math.cos(Math.PI/4*course)))].blinkField(true)}



    }

    static nullifyStepBlinked() {
        allFull.forEach(function(el,ind){el.blinkField(false)});
        allCrew.forEach(function(el,ind){el.blinkField(false)});
    }

    static processingStepEnd(x,y) {
        drawStatusString(`ход завершен на поле ${x} ${y}`);
        let stepWithGold=false; /* по умолчанию ход без золота */
        let needGoldDrop=false; /* и бросать золото не нужно */

        const whoBeat=allFull[xyTo(x,y)].whoseField; // команда которая побита
        const howBeat=allFull[xyTo(x,y)].quantityPirates; // сколько пиратов побито
        let howBeatGold=allFull[xyTo(x,y)].quantityPiratesWithGold; // сколько пиратов побито с золотом

        /* здесь бы бонус за побитие пирата! */
        if (!!whoBeat&&whoBeat!==StepController.teamMove) { // если есть кого бить и не свои
            needGoldDrop=true;
            while (howBeatGold) {howBeatGold--;StepController.goldDrop(x,y);}

            allFull[xyTo(x,y)].quantityPirates=0; // побитых пиратов не стало
            allFull[xyTo(x,y)].whoseField=null; // поле стало нечейным
            allFull[xyTo(whoBeat.shipX,whoBeat.shipY)].quantityPirates+=howBeat; // на корабле побитых добавились побитые
            whoBeat.aboard+=howBeat; // добавили и на борт
        }

        if (allCrew[StepController.indexTeamMove].attemptedMove<=1){
            allFull[xyTo(StepController.stepBeginX,StepController.stepBeginY)].quantityPirates--; // на начале хода на пирата меньше
            if (allFull[xyTo(StepController.stepBeginX,StepController.stepBeginY)].quantityPiratesWithGold>0) {stepWithGold=true}
            if (stepWithGold) {allFull[xyTo(StepController.stepBeginX,StepController.stepBeginY)].quantityPiratesWithGold--}
            if (allFull[xyTo(StepController.stepBeginX,StepController.stepBeginY)].quantityPirates<1) {allFull[xyTo(x,y)].whoseField=null}; // если никого, поле нечейное
        }else{
            allFull[xyTo(StepController.stepContinuedX,StepController.stepContinuedY)].quantityPirates--; // на средине хода на пирата меньше
            if (allFull[xyTo(StepController.stepContinuedX,StepController.stepContinuedY)].quantityPiratesWithGold>0) {stepWithGold=true}
            if (stepWithGold) {allFull[xyTo(StepController.stepContinuedX,StepController.stepContinuedY)].quantityPiratesWithGold--}
            if (allFull[xyTo(StepController.stepContinuedX,StepController.stepContinuedY)].quantityPirates<1) {allFull[xyTo(x,y)].whoseField=null}; // если никого, поле нечейное
        }




        if (allFull[xyTo(x,y)].closedField) { // если поле закрыто - открыть и добавить открывшей команде бонус- и ход беззолота
            needGoldDrop=true;
            allFull[xyTo(x,y)].openField();
            allCrew[StepController.indexTeamMove].exploredFields++;
        }
        allFull[xyTo(x,y)].whoseField=StepController.teamMove; // на поле конца новый хозяин
        allFull[xyTo(x,y)].quantityPirates++; //на поле конца на пирата больше
        if (stepWithGold&&!needGoldDrop) {allFull[xyTo(x,y)].quantityPiratesWithGold++} // на поле конца с золотом на пирата больше
        if (stepWithGold&&needGoldDrop) {StepController.goldDrop(StepController.stepBeginX,StepController.stepBeginY)} // бросаем золото на начале



        allCrew.forEach(function(el){el.updatePlacePirate()}); // обновить положение всех команд

        if (allFull[xyTo(x,y)].entity=='jungle'||allFull[xyTo(x,y)].entity=='desert'||
                allFull[xyTo(x,y)].entity=='swamp'||allFull[xyTo(x,y)].entity=='mountains') {
            allFull[xyTo(x,y)].retention=1; // для вертушек
            allFull[xyTo(x,y)].updateRetention(); // для вертушек
        }

        if (allFull[xyTo(x,y)].entity=='arrow11'||allFull[xyTo(x,y)].entity=='arrow12'||allFull[xyTo(x,y)].entity=='ice'||
        allFull[xyTo(x,y)].entity=='arrow13'||allFull[xyTo(x,y)].entity=='arrow14'||allFull[xyTo(x,y)].entity=='arrow21'||
        allFull[xyTo(x,y)].entity=='arrow22'||allFull[xyTo(x,y)].entity=='arrow23'||allFull[xyTo(x,y)].entity=='arrow24'||
        allFull[xyTo(x,y)].entity=='arrow31'||allFull[xyTo(x,y)].entity=='arrow32'||allFull[xyTo(x,y)].entity=='arrow41'||
        allFull[xyTo(x,y)].entity=='arrow42'||allFull[xyTo(x,y)].entity=='arrow51'||allFull[xyTo(x,y)].entity=='arrow52'||
        allFull[xyTo(x,y)].entity=='arrow53'||allFull[xyTo(x,y)].entity=='arrow54'||allFull[xyTo(x,y)].entity=='arrow6'||
        allFull[xyTo(x,y)].entity=='arrow7'||allFull[xyTo(x,y)].entity=='crocodile'||allFull[xyTo(x,y)].entity=='horse'||
        allFull[xyTo(x,y)].entity=='grass') { /* ход не окончен */

            StepController.nullifyGeneralAction();
            StepController.selectStepEnd(x,y);
        }else{

            StepController.changeTeamMove();
        }
    }
    static processingStepShip(x,y) {

        drawStatusString(`движение корабля на поле ${x} ${y}`);
        StepController.teamMove.shipX=x;
        StepController.teamMove.shipY=y;
        if (allFull[xyTo(x,y)].quantityPirates>0&&allFull[xyTo(x,y)].whoseField!==StepController.teamMove) {allFull[xyTo(x,y)].whoseField.diePirate(x,y)} // задавили чужого пирата
        if (allFull[xyTo(x,y)].quantityPirates>0&&allFull[xyTo(x,y)].whoseField===StepController.teamMove) {StepController.teamMove.aboard++} // восхождение на борт
        allFull[xyTo(StepController.stepBeginX,StepController.stepBeginY)].quantityPirates=0; // все пираты переехали со старого места
        allFull[xyTo(StepController.stepBeginX,StepController.stepBeginY)].whoseField=null; // старое место ничейное
        allFull[xyTo(x,y)].quantityPirates=StepController.teamMove.aboard; // все кто на борту переехали на новое место
        allFull[xyTo(x,y)].whoseField=StepController.teamMove; // на новом месте новый хозяин

        StepController.teamMove.updatePlaceShip(); // подвинули корабль
        allCrew.forEach(function(el){el.updatePlacePirate()}); // обновить положение всех команд

        StepController.changeTeamMove();
    }
    static processingStepWater(x,y) {
        if (allCrew[0].shipX===x&&allCrew[0].shipY===y||allCrew[1].shipX===x&&allCrew[1].shipY===y||
        allCrew[2].shipX===x&&allCrew[2].shipY===y||allCrew[3].shipX===x&&allCrew[3].shipY===y) { // попал на корабль

            if (StepController.teamMove.shipX===x&&StepController.teamMove.shipY===y) { // попал на свой - восхождение на корабль

                allFull[xyTo(StepController.stepBeginX,StepController.stepBeginY)].quantityPirates=0; // на старом месте никого
                allFull[xyTo(StepController.stepBeginX,StepController.stepBeginY)].whoseField=null; // старое место ничейное
                StepController.teamMove.aboard++; // добавился в команду
                allFull[xyTo(x,y)].quantityPirates=StepController.teamMove.aboard; // на борту количество увеличилось
                allCrew.forEach(function(el){el.updatePlacePirate()}); // обновить положение всех команд
                StepController.changeTeamMove();
                return;
            }else{ // попал на чужой корабль - умер

                allFull[xyTo(StepController.stepBeginX,StepController.stepBeginY)].quantityPirates=0; // на старом месте никого
                allFull[xyTo(StepController.stepBeginX,StepController.stepBeginY)].whoseField=null; // старое место ничейное
                StepController.teamMove.diePirate(x,y);
                allCrew.forEach(function(el){el.updatePlacePirate()}); // обновить положение всех команд
                StepController.changeTeamMove();
                return;
            }
        }

        if (allFull[xyTo(x,y)].quantityPirates>0) {allFull[xyTo(x,y)].whoseField.diePirate(x,y)} // находящийся на пути пират умер - свой или чужой
        allFull[xyTo(StepController.stepBeginX,StepController.stepBeginY)].quantityPirates=0; // на старом месте никого
        allFull[xyTo(StepController.stepBeginX,StepController.stepBeginY)].whoseField=null; // старое место ничейное

        allFull[xyTo(x,y)].quantityPirates=1; // пират на новое место
        allFull[xyTo(x,y)].whoseField=StepController.teamMove; // на новом месте новый хозяин

        allCrew.forEach(function(el){el.updatePlacePirate()}); // обновить положение всех команд
        StepController.changeTeamMove();
    }

    static processingClick() { /* обработка клика по полю */

        if (event.target===event.currentTarget) {return} /* мимо полей не кликать! */

        let source=event.target;
        if (!event.target.style.gridColumn) {source=event.target.parentNode} /* если у клика нету грид стилей, взять их в родительском поле! */

        const x=source.style.gridColumn; /* взяли координату X клика */
        const y=source.style.gridRow; /* взяли координату Y клика */
        drawStatusString(`клик по полю ${x} ${y}`);

        if (StepController.progressStage==='begin'&&allFull[xyTo(x,y)].blinking) {StepController.selectStepEnd(x,y);return}
        if (StepController.progressStage==='end'&&allFull[xyTo(x,y)].blinking) {
            if (StepController.stepBeginX==StepController.teamMove.shipX&&
            StepController.stepBeginY==StepController.teamMove.shipY&&!StepController.disableShip) { /* ход кораблем */
                StepController.processingStepShip(x,y);return
            }
            if (allFull[xyTo(StepController.stepBeginX,StepController.stepBeginY)].entity===water&&!StepController.disableShip) { /* ход в воде */
                StepController.processingStepWater(x,y);return
            }
            StepController.disableShip=true; // ход на суше только!
            StepController.processingStepEnd(x,y);
            return /* ход обычный */
        }
        if (StepController.progressStage==='end'&&StepController.stepBeginX===x&&
        StepController.stepBeginY===y&&allCrew[StepController.indexTeamMove].attemptedMove<=1) { // клик по началу хода - отмена выбора!
            allCrew[StepController.indexTeamMove].attemptedMove=0;
            StepController.nullifyStepBlinked();
            StepController.nullifyGeneralAction();
            StepController.updateGoldAction(StepController.stepBeginX,StepController.stepBeginY,true);
            StepController.progressStage='begin';
            StepController.selectStepBegin();
        }
    }
    static updateGeneralAction(x=playingFieldSize,y=playingFieldSize) {
        const meaning=allFull[xyTo(x,y)].entity; /* значение выделенного поля - для сокращения записи */

        if (StepController.teamMove.aboard>0&&StepController.teamMove.shipX==x&&StepController.teamMove.shipY==y) {
            StepController.actionButton='ship';
            placeGeneralAction.style.backgroundImage=`url(sprites/button/${StepController.actionButton}.png), linear-gradient(180deg, green, green)`;
            placeGeneralAction.innerHTML='сойти на берег';
        }
        if (meaning=='gold1'||meaning=='gold2'||meaning=='gold3'||meaning=='gold4'||meaning=='gold5') {
            StepController.actionButton='gold';
            placeGeneralAction.style.backgroundImage=`url(sprites/button/${StepController.actionButton}.png), linear-gradient(180deg, brown, brown)`;
            placeGeneralAction.innerHTML='откопать клад';
        }
        if (meaning=='jungle'&&allFull[xyTo(x,y)].retention<allFull[xyTo(x,y)].retentionMax) {
            StepController.actionButton='jungle';
            placeGeneralAction.style.backgroundImage=`url(sprites/button/${StepController.actionButton}.png), linear-gradient(180deg, yellow, yellow)`;
            placeGeneralAction.innerHTML='продираться сквозь джунгли';
        }
        if (meaning=='desert'&&allFull[xyTo(x,y)].retention<allFull[xyTo(x,y)].retentionMax) {
            StepController.actionButton='desert';
            placeGeneralAction.style.backgroundImage=`url(sprites/button/${StepController.actionButton}.png), linear-gradient(180deg, green, #008dda)`;
            placeGeneralAction.innerHTML='брести по пустыне';
        }
        if (meaning=='swamp'&&allFull[xyTo(x,y)].retention<allFull[xyTo(x,y)].retentionMax) {
            StepController.actionButton='swamp';
            placeGeneralAction.style.backgroundImage=`url(sprites/button/${StepController.actionButton}.png), linear-gradient(180deg, green, #008dda)`;
            placeGeneralAction.innerHTML='скакать по болоту';
        }
        if (meaning=='mountains'&&allFull[xyTo(x,y)].retention<allFull[xyTo(x,y)].retentionMax) {
            StepController.actionButton='mountains';
            placeGeneralAction.style.backgroundImage=`url(sprites/button/${StepController.actionButton}.png), linear-gradient(180deg, green, #008dda)`;
            placeGeneralAction.innerHTML='лазать по горам';
        }
        if (meaning=='airplane') {
            StepController.actionButton='airplane';
            placeGeneralAction.style.backgroundImage=`url(sprites/button/${StepController.actionButton}.png), linear-gradient(180deg, green, #008dda)`;
            placeGeneralAction.innerHTML='полет самолет';
        }
        if (meaning=='fortab') {
            StepController.actionButton='fortab';
            placeGeneralAction.style.backgroundImage=`url(sprites/button/${StepController.actionButton}.png), linear-gradient(180deg, green, #008dda)`;
            placeGeneralAction.innerHTML='возродить пирата';
        }
        if (meaning=='bengan') {
            StepController.actionButton='bengan';
            placeGeneralAction.style.backgroundImage=`url(sprites/button/${StepController.actionButton}.png), linear-gradient(180deg, green, #008dda)`;
            placeGeneralAction.innerHTML='перепрятать клад';
        }
        if (meaning=='cannonball') {
            StepController.actionButton='cannonball';
            placeGeneralAction.style.backgroundImage=`url(sprites/button/${StepController.actionButton}.png), linear-gradient(180deg, green, #008dda)`;
            placeGeneralAction.innerHTML='разворот пушек';
        }
        if (meaning=='map') {
            StepController.actionButton='map';
            placeGeneralAction.style.backgroundImage=`url(sprites/button/${StepController.actionButton}.png), linear-gradient(180deg, green, #008dda)`;
            placeGeneralAction.innerHTML='посмотреть карту';
        }

    }
    static generalAction() {
        const placeXY=xyTo(StepController.stepBeginX,StepController.stepBeginY);

        if (StepController.actionButton==='ship') { /* высадка на берег */
            StepController.disableShip=true; // ход на суше только!
            StepController.teamMove.attemptedMove++;
            /* через синусы косинусы автоматом считается место высадки! */
            StepController.stepBeginX=Number(StepController.teamMove.shipX); /* запоминаем координату Х начала хода */
            StepController.stepBeginY=Number(StepController.teamMove.shipY); /* запоминаем координату Y начала хода */
            StepController.stepPreviousX=StepController.stepBeginX; /* запоминаем предыдущий шаг */
            StepController.stepPreviousY=StepController.stepBeginY; /* запоминаем предыдущий шаг */
            StepController.stepContinuedX=StepController.stepBeginX-Math.sin(Math.PI/2*StepController.indexTeamMove); /* запоминаем координату Х высадки */
            StepController.stepContinuedY=StepController.stepBeginY+Math.cos(Math.PI/2*StepController.indexTeamMove); /* запоминаем координату Y высадки */
            StepController.teamMove.aboard--; //на поле корабля на пирата меньше
            StepController.processingStepEnd(StepController.stepContinuedX,StepController.stepContinuedY);
        }

        if (StepController.actionButton==='gold') {
            allFull[placeXY].addGold(Number(String(allFull[placeXY].entity).charAt(4)));
            allFull[placeXY].becomesEmptyField();
            StepController.changeTeamMove();
        }

        if (StepController.actionButton==='jungle'||StepController.actionButton==='desert'||
            StepController.actionButton==='swamp'||StepController.actionButton==='mountains') {
            allFull[placeXY].retention++;
            allFull[placeXY].updateRetention();
            StepController.changeTeamMove();
        }

        if (StepController.actionButton==='airplane') {alert('полет самолет')}
        if (StepController.actionButton==='fortab') {alert('возродить пирата')}
        if (StepController.actionButton==='bengan') {alert('перепрятать клад')}
        if (StepController.actionButton==='cannonball') {alert('разворот пушек')}
        if (StepController.actionButton==='map') {alert('посмотреть карту')}
        if (StepController.actionButton==='boat') {alert('грести в лодке')}

    }
    static nullifyGeneralAction() {
        StepController.actionButton='';
        placeGeneralAction.style.backgroundImage=`url(sprites/button/nothing.png), linear-gradient(180deg, grey, gray)`;
        placeGeneralAction.innerHTML='нет действия';
    }
    static updateGoldAction(x,y,nullify=false) {
        if (allFull[xyTo(x,y)].goldCapacity>0&&allFull[xyTo(x,y)].quantityPiratesWithGold<allFull[xyTo(x,y)].quantityPirates&&!nullify) {
            StepController.goldTakeButton=true;
            placeGoldTake.classList.add('goldOrder');
        }else{
            StepController.goldTakeButton=false;
            placeGoldTake.classList.remove('goldOrder');
        }

        if (allFull[xyTo(x,y)].quantityPiratesWithGold>0&&!nullify) {
            StepController.goldDropButton=true;
            placeGoldDrop.classList.add('goldOrder');
        }else{
            StepController.goldDropButton=false;
            placeGoldDrop.classList.remove('goldOrder');
        }
    }

    static goldTake(x,y) {
        allFull[xyTo(x,y)].quantityPiratesWithGold++;
        allFull[xyTo(x,y)].addGold(-1);
        allCrew.forEach(function(el){el.updatePlacePirate()}); // обновить положение всех команд
        StepController.updateGoldAction(x,y);
    }

    static goldDrop(x,y) {
        allFull[xyTo(x,y)].quantityPiratesWithGold--;
        if (allFull[xyTo(x,y)].entity=='airplane'||allFull[xyTo(x,y)].entity=='barrelofrum'||allFull[xyTo(x,y)].entity=='bengan'||
        allFull[xyTo(x,y)].entity=='boat'||allFull[xyTo(x,y)].entity=='cannonball'||allFull[xyTo(x,y)].entity=='caramba'||
        allFull[xyTo(x,y)].entity=='cave'||allFull[xyTo(x,y)].entity=='earthquake'||allFull[xyTo(x,y)].entity=='empty1'||
        allFull[xyTo(x,y)].entity=='empty2'||allFull[xyTo(x,y)].entity=='empty3'||allFull[xyTo(x,y)].entity=='empty4'||
        allFull[xyTo(x,y)].entity=='friday'||allFull[xyTo(x,y)].entity=='gold1'||allFull[xyTo(x,y)].entity=='gold2'||
        allFull[xyTo(x,y)].entity=='gold3'||allFull[xyTo(x,y)].entity=='gold4'||allFull[xyTo(x,y)].entity=='gold5'||
        allFull[xyTo(x,y)].entity=='lighthouse'||allFull[xyTo(x,y)].entity=='map'||allFull[xyTo(x,y)].entity=='rom1'||
        allFull[xyTo(x,y)].entity=='rom2'||allFull[xyTo(x,y)].entity=='rom3'||allFull[xyTo(x,y)].entity=='trap'||
        allFull[xyTo(x,y)].entity=='treasure'||allFull[xyTo(x,y)].entity=='wheelbarrow') {allFull[xyTo(x,y)].addGold(1)}

        allCrew.forEach(function(el){el.updatePlacePirate()}); // обновить положение всех команд
        StepController.updateGoldAction(x,y);

    }
    static updateDrinkAction() {}
    static drinkAction() {}

}


new StepController;
placePlayingField.addEventListener('click',StepController.processingClick); /* клик по игровому полю */

const placeGeneralAction=document.querySelector('.generalAction'); /* главная кнопка */
placeGeneralAction.addEventListener('click',StepController.generalAction);
const placeGoldTake=document.querySelector('.goldTake'); /* кнопка золото взять */
placeGoldTake.addEventListener('click',()=>{if (StepController.goldTakeButton) {StepController.goldTake(StepController.stepBeginX,StepController.stepBeginY)}});
const placeGoldDrop=document.querySelector('.golgDrop'); /* кнопка золото бросить */
placeGoldDrop.addEventListener('click',()=>{if (StepController.goldDropButton) {StepController.goldDrop(StepController.stepBeginX,StepController.stepBeginY)}});
const placeDrink=document.querySelector('.drink'); /* выпить ром */
placeDrink.addEventListener('click',StepController.drinkAction);

StepController.updateGeneralAction(); /* запуск высадки после формирования кнопки высадки */

//alert(Reflect.has(StepController,'disableShip'))