"use strict";
const AGE_STRING = ['год', 'года', 'лет'];
const nameSort = document.querySelector('.sort_by_name');
const name = document.getElementById('name');
const inputNameSearch = document.querySelector('.input_name');
const table = document.querySelector('.main_section_table');
const preview = document.querySelector('.main_section_preview');
const previewButton = document.querySelector('.preview');
const tableViewButton = document.querySelector('.table_view');
const ageButton = document.getElementById('age');
const sortBy = document.querySelector('.sort_by');
const appearance = document.querySelector('.appearance');
const header = document.querySelector('.header');
const sortById = document.querySelector('.sort_by_id');
const sortByAge = document.querySelector('.sort_by_age');
const sortByAsc = document.querySelector('.sort_by_ascending');
const sortByDesc = document.querySelector('.sort_by_descending');
const inputName = document.querySelector('.input_name');

let state = { // общее состояние страницы
    currentSort: 'id',
    currentLanguage: 'ru',
    currentSortType: 'asc',
    currentView: 'table',
    inputValue: '',
    isClickedOnPause: false
};

const getData = async function (url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}!`);
    }
    return await response.json();
};

const declOfNum = (number, titles) => { // алгоритм склонения числительных окончаний
    let cases = [2, 0, 1, 1, 1, 2];
    return number + ' ' + titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
};


const passValueToState = () => { //передаём значение поля ввода в стейт
    state.inputValue = '';
    state.inputValue = inputName.value;
    searchByName();

    console.log(state);
};

const initSearch = (tableFunc, previewFunc) => {
    getData(`http://localhost:3000/users?q=${state.inputValue}`)
        .then((data) => {
            if (state.currentView === 'table') {
                data.forEach(tableFunc);
            } else if (state.currentView === 'preview') {
                data.forEach(previewFunc);
            }
        })
}

const searchByName = () => {
    table.innerHTML = '';
    preview.innerHTML = '';
    state.currentLanguage == 'en' ? initSearch(renderTableEng, renderPreviewEng) : initSearch(renderTable, renderPreview);
};


const getSortedData = (event) => { //сортировка данных в зависимости от состояния стейта
    if (state.currentLanguage == 'ru') {
        if (event.target.id.length > 0) {
            if (event.target.closest('.sort_by')) {
                checkSortBy(event);

            } else if (event.target.closest('.sort_by_asc_desc')) {
                checkSortType(event);
            }
            if (state.currentView == 'table') {
                table.innerHTML = '';
                if (state.inputValue.length >= 3) {
                    getData(`http://localhost:3000/users?q=${state.inputValue}&_sort=${state.currentSort}&_order=${state.currentSortType}`)
                        .then((data) => data.forEach(renderTable))
                } else {
                    getData(`http://localhost:3000/users?_sort=${state.currentSort}&_order=${state.currentSortType}`)
                        .then((data) => data.forEach(renderTable))
                }
            } else if (state.currentView == 'preview') {
                preview.innerHTML = '';
                if (state.inputValue.length >= 3) {
                    getData(`http://localhost:3000/users?q=${state.inputValue}&_sort=${state.currentSort}&_order=${state.currentSortType}`)
                        .then((data) => data.forEach(renderPreview))
                        .then(initAutoplay)
                } else {
                    getData(`http://localhost:3000/users?_sort=${state.currentSort}&_order=${state.currentSortType}`)
                        .then((data) => data.forEach(renderPreview))
                        .then(initAutoplay)
                }
            }
        }
    } else {
        if (event.target.id.length > 0) {
            if (event.target.closest('.sort_by')) {
                checkSortBy(event);

            } else if (event.target.closest('.sort_by_asc_desc')) {
                checkSortType(event);
            }
            if (state.currentView == 'table') {
                table.innerHTML = '';
                if (state.inputValue.length >= 3) {
                    getData(`http://localhost:3000/users?q=${state.inputValue}&_sort=${state.currentSort}&_order=${state.currentSortType}`)
                        .then((data) => data.forEach(renderTableEng))
                } else {
                    getData(`http://localhost:3000/users?_sort=${state.currentSort}&_order=${state.currentSortType}`)
                        .then((data) => data.forEach(renderTableEng))
                }
            } else if (state.currentView == 'preview') {
                preview.innerHTML = '';
                if (state.inputValue.length >= 3) {
                    getData(`http://localhost:3000/users?q=${state.inputValue}&_sort=${state.currentSort}&_order=${state.currentSortType}`)
                        .then((data) => data.forEach(renderPreviewEng))
                        .then(initAutoplay)
                } else {
                    getData(`http://localhost:3000/users?_sort=${state.currentSort}&_order=${state.currentSortType}`)
                        .then((data) => data.forEach(renderPreviewEng))
                        .then(initAutoplay);
                }
            }
        }
    }
    console.log(state);

};

const getTableData = () => {
    getData('http://localhost:3000/users')
        .then((data) => data.forEach(renderTable))
};


const renderTable = ({
    image,
    name,
    age,
    phone,
    id
}) => {
    preview.innerHTML = '';
    const person = document.createElement('div');
    person.innerHTML = `
    <div class="person anim-show">
        <div class="person_name">
            <img class="avatar" src="images/${image}.svg">
            <span>${name.ru}</span>
        </div>
        <span>${declOfNum(age, AGE_STRING)}</span>
        <span>${phone}</span>
        <div>
            <img id="${id}" class="star" src="images/star.svg" alt="Add to favourite">
        </div>
    </div>`;
    append(person, table);
};

const renderPreview = (data) => {
    table.innerHTML = '';
    if (data.hasOwnProperty('video')) {

        const person = document.createElement('div');
        person.innerHTML = ` 
                    <div class="preview_person">
                        <div class="person_header">
                            <div class="preview_avatar">
                                <img class="avatar" src="images/${data.image}.svg" alt="avatar" loading="lazy">
                                <span>${data.name.ru}</span>
                            </div>
                            <div>
                                <img id="${data.id}" class="star" src="images/star.svg" alt="Add to favourite">
                            </div>
                        </div>
                        <span>${declOfNum(data.age, AGE_STRING)}</span>
                        <span>${data.phone}</span>
                        <div class="preview_person_info">
                            <span>${data.phrase.ru}</span>
                        </div>
                    </div>
                    <div class="preview_video">
                    <video class="video" preload="none" width="320px" height="250px" controls loading="lazy">
                        <source src="videos/${data.video}.mp4">
                    </video>
                </div>`;
        person.classList.add('object_wrapper');
        person.classList.add('has_video');
        person.classList.add('anim-show');
        append(person, preview);
        const video = document.querySelectorAll('.video');
    } else {
        const person = document.createElement('div');
        person.innerHTML = ` 
                <div  class="object_wrapper anim-show">
                    <div class="preview_person">
                        <div class="person_header">
                            <div class="preview_avatar">
                                <img class="avatar" src="images/${data.image}.svg" alt="avatar" loading="lazy">
                                <span>${data.name.ru}</span>
                            </div>
                            <div>
                                <img id="${data.id}" class="star" src="images/star.svg" alt="Add to favourite">
                            </div>
                        </div>
                        <span>${declOfNum(data.age, AGE_STRING)}</span>
                        <span>${data.phone}</span>
                        <div class="preview_person_info">
                            <span>${data.phrase.ru}</span>
                        </div>
                    </div>`;
        append(person, preview);
    }
};


const renderTableEng = ({
    image,
    name,
    age,
    phone,
    id
}) => {
    preview.innerHTML = '';
    const person = document.createElement('div');
    person.innerHTML = `
    <div  class="person anim-show">
        <div class="person_name">
            <img class="avatar" src="images/${image}.svg">
            <span>${name.en}</span>
        </div>
        <span>${age} years old</span>
        <span>${phone}</span>
        <div>
            <img id="${id}" class="star" src="images/star.svg" alt="Add to favourite">
        </div>
    </div>`;
    append(person, table);
};

const renderPreviewEng = (data) => {
    table.innerHTML = '';
    if (data.hasOwnProperty('video')) {

        const person = document.createElement('div');
        person.innerHTML = ` 
                    <div class="preview_person">
                        <div class="person_header">
                            <div class="preview_avatar">
                                <img class="avatar" src="images/${data.image}.svg" alt="avatar" loading="lazy">
                                <span>${data.name.en}</span>
                            </div>
                            <div>
                                <img id="${data.id}" class="star" src="images/star.svg" alt="Add to favourite">
                            </div>
                        </div>
                        <span>${data.age} years old</span>
                        <span>${data.phone}</span>
                        <div class="preview_person_info">
                            <span>${data.phrase.en}</span>
                        </div>
                    </div>
                    <div class="preview_video">
                    <video class="video" preload="none" width="320px" height="250px" controls loading="lazy">
                        <source src="videos/${data.video}.mp4">
                    </video>
                </div>`;
        person.classList.add('object_wrapper');
        person.classList.add('has_video');
        person.classList.add('anim-show');
        append(person, preview);
        const video = document.querySelectorAll('.video');
        // video.forEach(autoPlay);

    } else {
        const person = document.createElement('div');
        person.innerHTML = ` 
                <div  class="object_wrapper anim-show">
                    <div class="preview_person">
                        <div class="person_header">
                            <div class="preview_avatar">
                                <img class="avatar" src="images/${data.image}.svg" alt="avatar" loading="lazy">
                                <span>${data.name.en}</span>
                            </div>
                            <div>
                                <img class="star" id="${data.id}" src="images/star.svg" alt="Add to favourite">
                            </div>
                        </div>
                        <span>${data.age} years old</span>
                        <span>${data.phone}</span>
                        <div class="preview_person_info">
                            <span>${data.phrase.en}</span>
                        </div>
                    </div>`;
        append(person, preview);
    }
};


const addAnimation = (element) => {
    if (!element.classList.contains('anim-show')) {
        element.classList.add('anim-show');
    }
};

const append = (createdElement, renderPlace) => { //вставляет новый элемент в разметку
    renderPlace.appendChild(createdElement);
};


const isInViewport = (elem) => {//проверяет находится ли элемент во вьюпорте
    let bounding = elem.getBoundingClientRect();
    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};
const initAutoplay = () => {// функционал автоплея
    const videos = document.querySelectorAll('.video');
    videos[0].play();
    window.addEventListener('scroll', function (event) {
        videos.forEach((video) => {
            video.onpause = () => {
                state.isClickedOnPause = true;
            }
            if (isInViewport(video)) {
                if (state.isClickedOnPause) return null;
                video.play();
            } else {
                video.onpause = null;
                video.pause();
            }
        });
    })

};


let showSearchField = () => {
    if (state.currentSort === 'name') {
        nameSort.classList.add('hidden')
        inputNameSearch.classList.remove('hidden')
    } else {
        inputNameSearch.classList.add('hidden')
        nameSort.classList.remove('hidden')
    }
};


const selectAppearanceType = (event) => { //добавляет бэкграунд на кнопки  Таблица / Превью, и передаёт в стейт текущий выбор
    let currentAppearanceId = event.target.id;
    if (currentAppearanceId.length > 0) {
        state.currentView = currentAppearanceId;
        if (currentAppearanceId === 'table') {
            tableViewButton.classList.add('checked');
            previewButton.classList.remove('checked');
        } else if (currentAppearanceId === 'preview') {
            tableViewButton.classList.remove('checked');
            previewButton.classList.add('checked');
        }
    }
};


const checkSortBy = (event) => { //добавляет бэкграунд на кнопки  Айди / Возраст, и передаёт в стейт текущий выбор
    let currentSort = event.target.id;
    if (currentSort.length > 0) {
        state.currentSort = currentSort;
        if (state.currentSort === 'id') {
            sortById.classList.add('checked');
            sortByAge.classList.remove('checked');
        } else if (state.currentSort === 'age') {
            sortByAge.classList.add('checked');
            sortById.classList.remove('checked');
        } else if (state.currentSort === 'name') {
            sortById.classList.remove('checked');
            sortByAge.classList.remove('checked');
            showSearchField(event);
        }
    }
};

const checkSortType = (event) => { //добавляет бэкграунд на кнопки  По возрастанию / по убыванию, и передаёт в стейт текущий выбор
    let currentSortType = event.target.id;
    let asc = 'asc';
    let desc = 'desc';
    if (currentSortType.length > 0) {
        state.currentSortType = event.target.id
        if (state.currentSortType === asc) {
            sortByAsc.classList.add('checked');
            sortByDesc.classList.remove('checked');
        } else if (state.currentSortType === desc) {
            sortByAsc.classList.remove('checked');
            sortByDesc.classList.add('checked');
        }
    }
};

let subscribe = event => event.target.closest('.star') & event.target.classList.toggle('active');

let ru = {
    Sort: 'Сортировка',
    appearance: 'Вид',
    table: 'Таблица',
    preview: 'Превью',
    name: 'Имя',
    age: 'Возраст',
    ascending: 'По возрастанию',
    descending: 'По убыванию'
};

let en = {
    Sort: 'Sort by',
    appearance: 'View',
    table: 'Table',
    preview: 'Preview',
    name: 'Name',
    age: 'Age',
    ascending: 'Ascending',
    descending: 'Descending'
};

const changeLagnuage = () => {
    let language = lang.checked ? en : ru;
    lang.checked ? state.currentLanguage = 'en' : state.currentLanguage = 'ru';
    document.querySelectorAll('[text]').forEach(el => {
        el.innerHTML = language[el.getAttribute('text')];
    })
};

console.log(state);


const init = () => {
    document.addEventListener('click', subscribe);
    appearance.addEventListener('click', selectAppearanceType);
    getTableData();
    changeLagnuage();
    header.addEventListener('click', getSortedData);
    inputName.addEventListener('keyup', (event) => {
        if (event.keyCode === 13) {
            passValueToState();
        }
    });
    // debugger;
};
init()