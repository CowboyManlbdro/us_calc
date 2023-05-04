const questionnaires = document.querySelectorAll(".questionnaire__wrapper"),
    pacient = document.querySelector("#pacient"),
    modal = document.querySelector('.modal'),
    first = document.querySelector("#first_level"),
    second = document.querySelector("#second_level");

const today = document.querySelector('#today');
let date = new Date();
let output = String(date.getDate()).padStart(2, '0') + '.' + String(date.getMonth() + 1).padStart(2, '0') + '.' + date.getFullYear();
today.textContent = output;

const fadeIn = (el, timeout, display) => {
    el.style.opacity = 0;
    el.style.display = display || 'block';
    el.style.transition = `opacity ${timeout}ms`;
    setTimeout(() => {
        el.style.opacity = 1;
    }, 10);
};

const fadeOut = (el, timeout) => {
    el.style.opacity = 1;
    el.style.transition = `opacity ${timeout}ms`;
    el.style.opacity = 0;
    setTimeout(() => {
        el.style.display = 'none';
    }, timeout);
};

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

let name_p = getRandomIntInclusive(100,300);
let lastname = getRandomIntInclusive(100,300);
pacient.textContent = name_p + "" + lastname;

function questionnaireSubmit() {

    let P, z, age, oki, oki_sympt, oki_six, orvi_six, anemia;

    age = document.querySelector('#age').value;
    oki_sympt = document.querySelector('input[name="OKI"]:checked').value;
    oki_six = document.querySelector('input[name="OKI6"]:checked').value;
    orvi_six = document.querySelector('input[name="ORVI6"]:checked').value;
    anemia = document.querySelector('input[name="anemia"]:checked').value;

    if ((oki_sympt == 1) || (oki_six == 1)) {
        oki = 1;
    } else {
        oki = 0;
    }
        
    z = -4.593 + 1.926 * oki + 1.844 * orvi_six + 1.473 * anemia + 0.226 * age;
    P = (1/(1 + Math.exp(-z))) * 100;
    
    let conclusion;

    if (P > 12) {
        conclusion = "У пациента имеется высокий риск развития острого повреждения почек (р=" + P/100 + "). Рекомендуется оценка скорости клубочковой фильтрации, уровня креатинина сыворотки крови, уровня цистатина С и липокалина-2";
    } 
    else {
        conclusion = "У пациента имеется низкий риск развития острого повреждения почек (р=" + P/100 + "). Рекомендуется оценка уровня креатинина сыворотки крови через 3 дня";
    }

    let resultModal = document.getElementById("modal__body");
    resultModal.innerText = conclusion;

    fadeIn(modal,500);
}


function questionnaireSKFSubmit() {

    let SKF_Schwartz, SKF_Bedside, SKF_Cistatin, height, creatinin, unit_creatinin, unit_cistatin, cistatin, lipokalin;

    height = document.querySelector('#height').value.replace(',', ".");
    creatinin = document.querySelector('#creatinin').value.replace(',', ".");
    cistatin = document.querySelector('#cistatin').value.replace(',', ".");
    lipokalin = document.querySelector('#lipokalin').value.replace(',', ".");

    console.log(creatinin);

    unit_creatinin = document.querySelector('input[name="unit_creatinin"]:checked').value;
    unit_cistatin = document.querySelector('input[name="unit_cistatin"]:checked').value;

    if (unit_creatinin == 'l') {
        SKF_Schwartz = ((height * 88.4)/creatinin) * 0.55;
        SKF_Bedside = ((height * 88.4)/creatinin) * 0.413;
    } else {
        SKF_Schwartz = (height/creatinin) * 0.55;
        SKF_Bedside = (height/creatinin) * 0.413;
    }

    if (unit_cistatin == 'l') {
        SKF_Cistatin =  70.69 * Math.pow(cistatin, -0.931);
    } else {
        SKF_Cistatin =  70.69 * Math.pow((cistatin * 0.001), -0.931);
    }

    let conclusion;

    if (((SKF_Schwartz < 80) || (SKF_Bedside < 80)) || 
        ((unit_creatinin == 'l') && (creatinin > 26.5)) || 
        ((unit_creatinin == 'ml') && (creatinin > 0.3)) || 
        ((unit_cistatin == 'l') && (cistatin > 0.956)) || 
        ((unit_cistatin == 'ml') && (cistatin > 956)) || 
        (lipokalin > 136.2) ) {

            conclusion = "Выявлено острое повреждение почек I стадии по KDIGO \n(СКФ по формуле Шварца = " + SKF_Schwartz.toFixed(2) + "(мл/мин/1,73м²),\n СКФ по 'Bedside' (прикроватной) формуле Шварца (2009г) = " + SKF_Bedside.toFixed(2) + "(мл/мин/1,73м²),\n СКФ на основе содержания Цистатина С в сыровотке крови = " + SKF_Cistatin.toFixed(2) + "(мл/мин/1,73м²)";

    } 
    
    if (((SKF_Schwartz < 80) || (SKF_Bedside < 80)) && (((unit_creatinin == 'l') && (creatinin > 353.6)) || 
    ((unit_creatinin == 'ml') && (creatinin > 4)))){
        conclusion = "Выявлено острое повреждение почек III стадии по KDIGO";
    }

    let resultModal = document.getElementById("modal__body");
    resultModal.innerText = conclusion;

    fadeIn(modal,500);
}

document.querySelector('.questionnaire__link').addEventListener('click', function () {
    fadeOut(first,500);
    setTimeout(function (){
        fadeIn(second,500);
    },500);
    
});

document.querySelector('.back').addEventListener('click', function () {
    fadeOut(second,500);
    setTimeout(function (){
        fadeIn(first,500);
    },500);
    
});

document
    .querySelector(".modal__btn-close")
    .addEventListener("click", () => fadeOut(modal,500));
document
    .querySelector(".close")
    .addEventListener("click", () => fadeOut(modal,500));
