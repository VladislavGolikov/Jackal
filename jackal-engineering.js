const forEngineering=document.querySelector('.for-engineering ');
forEngineering.classList.remove('hidd');
function logg(text) {
    forEngineering.innerHTML+=text;
}

/*----------- вектор распределения золота при сдаче -------------------*/
document.addEventListener('keydown',()=>{if (event.code==='KeyO') {

const startX1=shipX1;
const startY1=shipY1;
const startX2=shipX2;
const startY2=shipY2;
const startX3=shipX3;
const startY3=shipY3;
const startX4=shipX4;
const startY4=shipY4;
drawStatusString(`распределение золота по клавише 'O'`);

    allFull.forEach(function(el){




        if (el.entity=='gold5'){
            alert(`расстояние до севера: ${Math.max(Math.abs(startX1-el.positionX),Math.abs(startY1-el.positionY))}`);
            alert(`расстояние до востока: ${Math.max(Math.abs(startX2-el.positionX),Math.abs(startY2-el.positionY))}`);
            alert(`расстояние до юга: ${Math.max(Math.abs(startX3-el.positionX),Math.abs(startY3-el.positionY))}`);
            alert(`расстояние до запада: ${Math.max(Math.abs(startX4-el.positionX),Math.abs(startY4-el.positionY))}`);
        }
    })



}});
/*----------- вектор распределения золота при сдаче -------------------*/







document.addEventListener('keydown',()=>{if (event.code==='KeyR') {
    allCrew[1].movePirates(1,1)
}})

/*
document.addEventListener('keydown',()=>{if (event.code==='KeyU') {
    StepController.selectStepEnd(7,7)
}})

*/



/*------------- открытие закрытие всех полей ---------------------------------------*/
let anchorP=true;
document.addEventListener('keydown',()=>{if (event.code==='KeyP') {
    allFull.forEach(function(el){el.openField(anchorP)});
    anchorP=!anchorP;
    drawStatusString(`открытие-закрытие всех полей по клавише 'P'`);
}})
/*------------- открытие закрытие всех полей ---------------------------------------*/

/*--------- показ значения присутствия пиратов на полях ----------------------------*/

document.addEventListener('keydown',()=>{if (event.code==='KeyS') {
    allFull.forEach(function(el,ind){
        if (el.placeUnitField.innerHTML==='') {el.placeUnitField.innerHTML=el.quantityPirates}else{el.placeUnitField.innerHTML=''}
    })
}})

/*--------- показ значения присутствия пиратов на полях ----------------------------*/

/*---------- переход хода --------------------------------------------*/
document.addEventListener('keydown',()=>{if (event.code==='KeyT') {
    StepController.changeTeamMove();

}})
/*---------- переход хода --------------------------------------------*/



document.addEventListener('keydown',()=>{if (event.code==='KeyU') {




setInterval(()=>{forEngineering.innerHTML=StepController.progressStage},100)

}})
/*----------------------------*/


document.addEventListener('keydown',()=>{if (event.code==='KeyA') {

placeGeneralAction.classList.add('roton');


placeGeneralAction.addEventListener('animationend',()=>{placeGeneralAction.classList.remove('roton');placeGeneralAction.classList.add('rotoff');setTimeout(()=>{placeGeneralAction.classList.remove('rotoff')},1500)})




}})


