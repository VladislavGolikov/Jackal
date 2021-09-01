/* вначале неплохо бы проверять валидность window.localStorage на корректные значения... возможно это серверным скриптом при отдаче сделать */
class Interface {
    static gameModeOS=window.localStorage.getItem('gameModeOS'); // режим игры остров сокровищ или классика
    static complexFields=new Map(); // набор всех игровых полей и их количество
    static waterDisplay='water'+window.localStorage.getItem('waterCounter'); // вода по умолчанию
    static water='water'; // сущность воды на поле и шаблон вода для переключений воды
    static playingFieldSize=0; // ширина или высота игрового поля
    static arrayPrepared=[]; // готовый массив игровых полей для раздачи
    static placePlayingField=document.querySelector('.playing-field'); // dom место для игрового поля

    constructor() {
        this.water=this.constructor.water;
        this.waterDisplay=this.constructor.waterDisplay;
        this.placePlayingField=this.constructor.placePlayingField;
        this.constructor.toggleGameMode(window.localStorage.getItem('gameModeOS'));
        this.constructor.definitionAllFields(Interface.complexFields);
        this.constructor.toggleWaterDisplay(window.localStorage.getItem('waterCounter'));
        this.arrayPrepared=this.constructor.createPlayingField();
        this.playingFieldSize=this.constructor.playingFieldSize;
        this.shipСoordinates=this.constructor.assignmentShipСoordinates([],this.playingFieldSize); // массив с координатами кораблей
    }

    static toggleGameMode(gameModeOS=0) { // триггер режимов игры классика или остров сокровищ
        const placeToggleGame=document.querySelector('.toggle-game');
            if (gameModeOS==='1') {placeToggleGame.classList.add('toggle-game-on')}

        placeToggleGame.addEventListener('click',()=>{
            if (gameModeOS==='1') {
                gameModeOS='0';
                placeToggleGame.classList.remove('toggle-game-on');
            }else{
                gameModeOS='1';
                placeToggleGame.classList.add('toggle-game-on');
            }
            window.localStorage.setItem('gameModeOS',gameModeOS);
            Interface.gameModeOS=gameModeOS;
        })
    }

    static toggleWaterDisplay(counter) { // переключение отображения воды
        const placeToggleWater=document.querySelector('.toggle-water');
        if (!counter) {counter=1};
        placeToggleWater.addEventListener('click',()=>{
            counter++;
            if (counter>9) {counter=1};
            Interface.waterDisplay=Interface.water+counter;
            window.localStorage.setItem('waterCounter',counter);
            allFull.forEach((el)=>{el.changeWater(Interface.waterDisplay)})
        })
    }

    static definitionAllFields(complexFields) { // определение количества полей для классического варианта
        complexFields.set('airplane',1); complexFields.set('arrow1',3); complexFields.set('arrow2',3);
        complexFields.set('arrow3',3); complexFields.set('arrow4',3); complexFields.set('arrow5',3);
        complexFields.set('arrow6',3); complexFields.set('arrow7',3); complexFields.set('balloon',2);
        complexFields.set('barrelofrum',4); complexFields.set('bengan',0); complexFields.set('boat',0);
        complexFields.set('cannibal',1); complexFields.set('cannon',2); complexFields.set('cannonball',0);
        complexFields.set('caramba',0); complexFields.set('cave',0); complexFields.set('crocodile',4);
        complexFields.set('desert',4); complexFields.set('earthquake',0); complexFields.set('empty1',10);
        complexFields.set('empty2',10); complexFields.set('empty3',10); complexFields.set('empty4',10);
        complexFields.set('fort',2); complexFields.set('fortab',1); complexFields.set('friday',0);
        complexFields.set('gold1',5); complexFields.set('gold2',5); complexFields.set('gold3',3);
        complexFields.set('gold4',2); complexFields.set('gold5',1); complexFields.set('grass',0);
        complexFields.set('horse',2); complexFields.set('ice',6); complexFields.set('jungle',5);
        complexFields.set('lighthouse',0); complexFields.set('map',0); complexFields.set('missionary',0);
        complexFields.set('mountains',1); complexFields.set('rom1',0); complexFields.set('rom2',0);
        complexFields.set('rom3',0); complexFields.set('swamp',2); complexFields.set('thickets',0);
        complexFields.set('trap',3); complexFields.set('treasure',0); complexFields.set('wheelbarrow',0);
        complexFields.set(Interface.water,52);

        if (Interface.gameModeOS==='1') { // переопределение количества полей для острова сокровищ
            complexFields.set('bengan',1); complexFields.set('boat',1); complexFields.set('cannonball',2);
            complexFields.set('caramba',1); complexFields.set('cave',4); complexFields.set('earthquake',1);
            complexFields.set('empty1',9); complexFields.set('empty2',9); complexFields.set('empty3',9);
            complexFields.set('empty4',9); complexFields.set('friday',1); complexFields.set('grass',2);
            complexFields.set('lighthouse',1); complexFields.set('map',1); complexFields.set('missionary',1);
            complexFields.set('rom1',3); complexFields.set('rom2',2); complexFields.set('rom3',1);
            complexFields.set('thickets',3); complexFields.set('treasure',1); complexFields.set('wheelbarrow',1);
            complexFields.set(Interface.water,56);
        }
    }

    static createPlayingField(arrayWithoutWater=[],water=Interface.water) {
        const arrayRaw=Array.from(Interface.complexFields.entries()); /* создание предварительного массива полей без воды */
        arrayRaw.forEach((el)=> {for (let i=0;i<el[1];i++) {if (el[0]!==Interface.water) arrayWithoutWater.push(el[0])}});

        arrayWithoutWater.forEach(function(el,ind) {/* разворот поворотных полей */
            if (el==='arrow1'||el==='arrow2'||el==='arrow5'||el==='cannon') {arrayWithoutWater.splice(ind,1,el+Math.ceil(Math.random()*4))};
            if (el==='arrow3'||el==='arrow4') {arrayWithoutWater.splice(ind,1,el+Math.ceil(Math.random()*2))};
        });
        Interface.shufflePlayingField(arrayWithoutWater);

        Interface.playingFieldSize=Math.sqrt(arrayWithoutWater.length+Interface.complexFields.get(Interface.water)); // определение размера поля
        if (Interface.playingFieldSize!==Math.round(Interface.playingFieldSize)) {alert('нарушена целостность начальных данных!')};
        const pfs=Interface.playingFieldSize;

        Interface.placePlayingField.style.gridTemplateColumns=`repeat(${pfs}, 1fr)`; // применение размера к полю
        Interface.placePlayingField.style.gridTemplateRows=`repeat(${pfs}, 1fr)`;

        let arrayPrepared=[]; /* создание готового массива полей и заполнение его водой */
        for (let i=0; i<pfs;i++){arrayPrepared[i]=water} /* верхний край */
        for (let i=pfs*(pfs-1); i<pfs*pfs;i++){arrayPrepared[i]=water} /* нижний край */
        for (let i=0; i<pfs*(pfs-1);i+=pfs){arrayPrepared[i]=water} /* левый край */
        for (let i=pfs-1; i<pfs*pfs;i+=pfs){arrayPrepared[i]=water} /* правый край */
        /* около углов */
        arrayPrepared[pfs+1]=water;
        arrayPrepared[pfs-1+pfs-1]=water;
        arrayPrepared[(pfs-1)*(pfs-1)]=water;
        arrayPrepared[(pfs-1)*(pfs)-2]=water;
        let j=0;
        for (let i=0; i<pfs*pfs;i++){if (arrayPrepared[i]!==water){arrayPrepared[i]=arrayWithoutWater[j];j++}}
        return arrayPrepared;
    }

    static shufflePlayingField(arr) {
        for (let i=0; i<arr.length-1;i++) {
            const position=Math.floor(Math.random()*(arr.length-i));
            const buffer=arr.splice(position,1);
            arr.push(buffer);
        }
    }

    static assignmentShipСoordinates(coordinates,pfs) { // массив значений для [shipX1,shipY1 ..... shipY4]
        coordinates.push(Math.ceil(pfs/2)); // shipX1
        coordinates.push(1); // shipY1
        coordinates.push(pfs); // shipX2
        coordinates.push(Math.ceil(pfs/2)); // shipY2
        coordinates.push(Math.ceil(pfs/2)); // shipX3
        coordinates.push(pfs); // shipY3
        coordinates.push(1); // shipX4
        coordinates.push(Math.ceil(pfs/2)); // shipY4
        if (pfs/2===Math.ceil(pfs/2)) {coordinates[0]++;coordinates[3]++} // для симметриии относительно центра при ОС
        return coordinates;
    }
}

const {water,waterDisplay,playingFieldSize,arrayPrepared,shipСoordinates,placePlayingField}=new Interface;

