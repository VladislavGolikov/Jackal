/*------------ печать строки состояния ----------------------------------*/
const greetingMessageArea=document.querySelector('.drivetext');
let buffer=''; /* буфер состояния строки статуса - для сброса предыдущего вызова */

function drawStatusString(text='сообщение отсутствует!',position=0,notFirst=false,rapid=0.5) {
    if (!notFirst) {buffer=text}
    if (position<++text.length&&buffer===text) {

        window.requestAnimationFrame(()=>{drawStatusString(text,position,true)});

        greetingMessageArea.innerText=`${text.slice(0,position)}`;

//        greetingMessageArea.parentNode.scrollTo(0,window.innerHeight); /* прокрутку вниз все время! */
        position+=rapid;
    }
}
/*------------ печать строки состояния ----------------------------------*/

/*-------- преобразование координат в номер массива полей --------------------------*/
function xyTo(xArg,yArg) {
    let x=Number(xArg);
    let y=Number(yArg);

    if (x>playingFieldSize||y>playingFieldSize) {
        x=playingFieldSize;
        y=playingFieldSize;
        drawStatusString('введены неправильные х у');
    }
    return playingFieldSize*(y-1)+x-1;
}
/*-------- преобразование координат в номер массива полей --------------------------*/

/*------ раздача игрового поля --------------------------------------*/
function distributionPlayingField(arr) {
    for (y=1;y<=playingFieldSize;y++) {
        for (x=1;x<=playingFieldSize;x++) {
            allFull.push(new UnitField (x,y,arr[(y-1)*playingFieldSize+x-1]))
        }
    }
    drawStatusString('перезагрузка и раздача произведена...');
}

/*------ раздача игрового поля --------------------------------------*/

/*----------- объект для кнопки general action -----------------*/

const forGenAct={
    ship: 'сойти на берег',

}
/*----------- объект для кнопки general action -----------------*/

