//Модуль генерации разметки похожих объявлений на основе рандомных данных

import {createValues} from './create-values.js';
const MASSIVE_COUNT = 10; //количество элементов в массиве

//описание типа жилья
const typeOfHouse = {
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
  hotel: 'Отель',
};

// const mapCanvas = document.querySelector('.map__canvas');
const popupCard = document.querySelector('#card').content.querySelector('.popup');
const imageCard = document.querySelector('#card').content.querySelector('.popup__photo');
// const popupPhotos = document.querySelector('#card').content.querySelector('.popup__photos');

//создание необходимого массива с рандомными значениями
const similarMassive = new Array(MASSIVE_COUNT).fill(null).map(() => createValues());

const similarListFragment = document.createDocumentFragment();

similarMassive.forEach(({author, offer}) => {
  const addCard = popupCard.cloneNode(true);
  const popupPhotos = addCard.querySelector('.popup__photos');

  function imageInputer () {
    /*проверка количества изображений в объекте offer*/
    if (offer.photos.length > 1) {
      for (let i = 1; i < offer.photos.length; i++) {
        const imageTemplate = imageCard.cloneNode(false);
        popupPhotos.appendChild(imageTemplate);
      }
    }
    /*добавление каждому изображению значения src атрибута*/
    const imageMassive = addCard.querySelectorAll('.popup__photo');
    for (let i = 0; i < offer.photos.length; i ++){
      imageMassive[i].src = offer.photos[i];
    }
  }
  offer.title ? addCard.querySelector('.popup__title').textContent = offer.title : addCard.querySelector('.popup__title').classList.add('hidden');
  offer.address ? addCard.querySelector('.popup__text--address').textContent = offer.address : addCard.querySelector('.popup__text--address').classList('hidden');
  offer.price ? addCard.querySelector('.popup__text--price').textContent = `${offer.price} ₽/ночь` : addCard.querySelector('.popup__text--price').classList('hidden');
  offer.type ? addCard.querySelector('.popup__type').textContent = typeOfHouse[offer.type] : addCard.querySelector('.popup__type').classList('hidden');
  offer.rooms || offer.guests ? addCard.querySelector('.popup__text--capacity').textContent = `${offer.rooms} комнаты для ${offer.guests} гостей` : addCard.querySelector('.popup__text--capacity').classList('hidden');
  offer.checkin || offer.checkout ? addCard.querySelector('.popup__text--time').textContent = `Заезд после ${offer.checkin}, выезд до ${offer.checkout}` : addCard.querySelector('.popup__text--time').classList('hidden');
  offer.features ? addCard.querySelector('.popup__features').textContent = offer.features : addCard.querySelector('.popup__features').classList('hidden');
  offer.description ? addCard.querySelector('.popup__description').textContent = offer.description : addCard.querySelector('.popup__description').classList('hidden');
  offer.photos ? imageInputer() : addCard.querySelector('.popup__photo').classList.add('hidden');
  author.avatar ? addCard.querySelector('.popup__avatar').src = author.avatar : addCard.querySelector('.popup__avatar').classList.add('hidden');
  similarListFragment.appendChild(addCard);
});

// mapCanvas.appendChild(similarListFragment);
export {similarMassive};
export {typeOfHouse};
// export {mapCanvas};
