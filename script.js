"use strict";
const AGE_STRING = ['год', 'года', 'лет'];
const nameSort = document.querySelector('.sort_by_name');
const name = document.querySelector('.name');
const inputNameSearch = document.querySelector('.input_name');
const table = document.querySelector('.main_section_table');
const preview = document.querySelector('.main_section_preview');
const previewButton = document.querySelector('.preview');
const tableViewButton = document.querySelector('.table_view');

const getData = async function (url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}!`);
    }
    return await response.json();
};

const declOfNum = (number, titles) => {
    let cases = [2, 0, 1, 1, 1, 2];
    return number + ' ' + titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

const getTableData = () => {
    preview.innerHTML = '';
    previewButton.classList.remove('checked');
    tableViewButton.classList.add('checked');
    getData('http://localhost:3000/users')
        .then((data) => {
            data.forEach(renderTable);
        });
}
const getPreviewData = () => {
    table.innerHTML = '';
    tableViewButton.classList.remove('checked');
    previewButton.classList.add('checked');
    getData('http://localhost:3000/users')
        .then((data) => {
            data.forEach(renderPreview);
        });
}

const renderTable = ({
    image,
    name,
    age,
    phone
}) => {

    const person = `
    <div class="person">
        <div class="person_name">
            <img class="avatar" src="images/${image}.svg">
            <span>${name.ru}</span>
        </div>
        <span>${declOfNum(age, AGE_STRING)}</span>
        <span>${phone}</span>
        <div>
            <img class="star" src="images/star.svg" alt="Add to favourite">
        </div>
    </div>`;
    table.insertAdjacentHTML('afterbegin', person);
};

const renderPreview = (data) => {

    if (data.hasOwnProperty('video')) {
        let person = ` 
            <div class="object_wrapper has_video">
                <div class="preview_person">
                    <div class="person_header">
                        <div class="preview_avatar">
                            <img class="avatar" src="images/${data.image}.svg" alt="avatar" loading="lazy">
                            <span>${data.name.ru}</span>
                        </div>
                        <div>
                            <img class="star" src="images/star.svg" alt="Add to favourite">
                        </div>
                    </div>
                    <span>${declOfNum(data.age, AGE_STRING)}</span>
                    <span>${data.phone}</span>
                    <div class="preview_person_info">
                        <span>${data.phrase.ru}</span>
                    </div>
                </div>
                <div class="preview_video">
                <video class="video" width="320px" height="250px" controls loading="lazy">
                    <source src="videos/${data.video}.mp4">
                </video>
            </div>
            </div>`;
        preview.insertAdjacentHTML('afterbegin', person);

    } else {
        let person = ` 
            <div class="object_wrapper ">
                <div class="preview_person">
                    <div class="person_header">
                        <div class="preview_avatar">
                            <img class="avatar" src="images/${data.image}.svg" alt="avatar" loading="lazy">
                            <span>${data.name.ru}</span>
                        </div>
                        <div>
                            <img class="star" src="images/star.svg" alt="Add to favourite">
                        </div>
                    </div>
                    <span>${declOfNum(data.age, AGE_STRING)}</span>
                    <span>${data.phone}</span>
                    <div class="preview_person_info">
                        <span>${data.phrase.ru}</span>
                    </div>
                </div>`;
        preview.insertAdjacentHTML('afterbegin', person);
    }
}




let showSearchField = event => {
    if (event.target.closest('.name') || event.target.closest('.input_name')) {
        nameSort.classList.add('hidden')
        inputNameSearch.classList.remove('hidden')
    } else {
        inputNameSearch.classList.add('hidden')
        nameSort.classList.remove('hidden')
    }
};

let subscribe = event => event.target.closest('.star') & event.target.classList.toggle('active');

const init = () => {
    document.addEventListener('click', subscribe);
    document.addEventListener('click', showSearchField);
    getTableData();
};
init();