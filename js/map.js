//Подключение карты Leaflets
import {typeOfHouse} from './create-notice.js';
// import {similarMassive} from './create-notice.js';
import {disabledForm,  availableForm} from './form.js';
import {errorUpload} from './fetch-error.js';
import {getFinalFilter, filterFormMap} from './filter-form.js';
import {debounce} from './utils/debounce.js';


const MAP_SCALE = 10;
const TOKIO_LAT = 35.6895000;
const TOKIO_LNG = 139.6917100;
const MAIN_PIN_SIZE_X = 52;
const MAIN_PIN_SIZE_Y = 52;
const MAIN_PIN_POSITION_X = 26;
const MAIN_PIN_POSITION_Y = 26;
const PIN_SIZE_X = 40;
const PIN_SIZE_Y = 40;
const PIN_POSITION_X = 20;
const PIN_POSITION_Y = 40;
const DECIMAL_POINT = 5;
const MAIN_PIN_ICON_IMG = 'img/main-pin.svg';
const PIN_ICON_IMG = 'img/pin.svg';

disabledForm();
let defaultAddress = document.querySelector('#address');

//Инициализация карты
const map = L.map('map-canvas')
  .on('load', () => {
    availableForm();
  })
  .setView({
    lat: TOKIO_LAT,
    lng: TOKIO_LNG,
  }, MAP_SCALE);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

//Описание главной метки
const mainPinIcon = L.icon({
  iconUrl: MAIN_PIN_ICON_IMG,
  iconSize: [MAIN_PIN_SIZE_X, MAIN_PIN_SIZE_Y],
  iconAnchor: [MAIN_PIN_POSITION_X, MAIN_PIN_POSITION_Y],
});

//Добавление главной метки на карту
const mainPinMarker = L.marker(
  {
    lat: TOKIO_LAT,
    lng: TOKIO_LNG,
  },
  {
    draggable: true,
    icon: mainPinIcon,
  },
);
mainPinMarker.addTo(map);

//Задание координат по умолчанию
defaultAddress.value = (`${TOKIO_LAT}, ${TOKIO_LNG}`);

//Событие, срабатывающее при прекращении перемещения главной метки
mainPinMarker.on('moveend', (evt) => {
  defaultAddress.value = (`${Number(evt.target.getLatLng().lat).toFixed(DECIMAL_POINT)}, ${Number(evt.target.getLatLng().lng).toFixed(DECIMAL_POINT)}`);
});

//Создание меток
const pinIcon = L.icon({
  iconUrl: PIN_ICON_IMG,
  iconSize: [PIN_SIZE_X, PIN_SIZE_Y],
  iconAnchor: [PIN_POSITION_X, PIN_POSITION_Y],
});

//Создание попапа
const createCustomPopup = ({author, offer}) => {
  const popupCard = document.querySelector('#card').content.querySelector('.popup');
  const imageCard = document.querySelector('#card').content.querySelector('.popup__photo');
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
  offer.address ? addCard.querySelector('.popup__text--address').textContent = offer.address : addCard.querySelector('.popup__text--address').classList.add('hidden');
  offer.price ? addCard.querySelector('.popup__text--price').textContent = `${offer.price} ₽/ночь` : addCard.querySelector('.popup__text--price').classList.add('hidden');
  offer.type ? addCard.querySelector('.popup__type').textContent = typeOfHouse[offer.type] : addCard.querySelector('.popup__type').classList.add('hidden');
  offer.rooms || offer.guests ? addCard.querySelector('.popup__text--capacity').textContent = `${offer.rooms} комнаты для ${offer.guests} гостей` : addCard.querySelector('.popup__text--capacity').classList.add('hidden');
  offer.checkin || offer.checkout ? addCard.querySelector('.popup__text--time').textContent = `Заезд после ${offer.checkin}, выезд до ${offer.checkout}` : addCard.querySelector('.popup__text--time').classList.add('hidden');
  offer.features ? addCard.querySelector('.popup__features').textContent = offer.features : addCard.querySelector('.popup__features').classList.add('hidden');
  offer.description ? addCard.querySelector('.popup__description').textContent = offer.description : addCard.querySelector('.popup__description').classList.add('hidden');
  offer.photos ? imageInputer() : addCard.querySelector('.popup__photo').classList.add('hidden');
  author.avatar ? addCard.querySelector('.popup__avatar').src = author.avatar : addCard.querySelector('.popup__avatar').classList.add('hidden');
  return addCard;
};

//дополнительный слой на карте для отрисовки меток
const markerGroup = L.layerGroup().addTo(map);

//Функция для отрисовки метки и балуна на карте
const createMarker = ({author, offer, location}) => {
  const {lat, lng} = location;
  const marker = L.marker({
    lat,
    lng,
  },
  {
    icon: pinIcon,
  },
  );
  marker.addTo(markerGroup);
  marker.bindPopup(createCustomPopup({author, offer}),
    {
      keepInView: true,
    });
};

//Обработчик для меток с целью их отрисовки на карте - отрисовка меток с рандомными данными
// similarMassive.forEach(({author, offer, location}) => {
//   createMarker({author, offer, location});
// });

//функция для передачи данных сортировки
const DELAY_TIME = 500;

function dataForFilter (value) {
  filterFormMap.addEventListener('change', () => {
    const getFilterDataForMap = getFinalFilter(value);
    markerGroup.clearLayers();
    getFilterDataForMap.forEach((item) => {
      createMarker(item);
    });
  });
}

//Модуль получения и отправления данных на сервер
const getDataUrl = 'https://23.javascript.pages.academy/keksobooking/data';
const sendDataUrl = 'https://23.javascript.pages.academy/keksobooking/';
const OFFERS_QUANTITY = 10;

//функция успешного получения данных с сервера
function successfulUpload(value) {
  dataForFilter(value);
  const generateNewOfferList = value.slice(0, OFFERS_QUANTITY);
  generateNewOfferList.forEach(({author, offer, location}) => {
    createMarker({author, offer, location});
  });
}

const getData = fetch(getDataUrl)
  .then((response) => (response.ok) ? (response.json()) : (() => {throw new Error (`Упс, что то пошло не так. Ошибка ${response.status}, так досадно не получить данные с сервера.`);})())
  .then((offer) => successfulUpload(offer))
  .catch((error) => errorUpload(error));


//Отправка данных с формы на сервер
const adForm = document.querySelector('.ad-form');
const main = document.querySelector('main');
const removeButton = document.querySelector('.ad-form__reset');

const failSendMessage = document.querySelector('#error').content.querySelector('.error');
const failSendPopup = failSendMessage.cloneNode(true);
const failSendButton = failSendPopup.querySelector('.error__button');
failSendPopup.classList.add('hidden');
main.appendChild(failSendPopup);

const successfullSendMessage = document.querySelector('#success').content.querySelector('.success');
const successfullPopup = successfullSendMessage.cloneNode(true);
successfullPopup.classList.add('hidden');
main.appendChild(successfullPopup);

//Очистка формы
function removeFormData () {
  const formSend = document.querySelector('.ad-form');
  formSend.reset();
  mainPinMarker.setLatLng({
    lat: TOKIO_LAT,
    lng: TOKIO_LNG,
  });
  filterFormMap.reset();
  defaultAddress.defaultValue = (`${TOKIO_LAT}, ${TOKIO_LNG}`);
}

removeButton.addEventListener('click', () => {
  removeFormData();
});

//Закрытие окно при помощи мыши или клавиатуры
window.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape' || evt.key === 'Esc'){
    if (successfullPopup.classList.contains('hidden') === false) {
      successfullPopup.classList.add('hidden');
      removeFormData();
    } else {
      failSendPopup.classList.add('hidden');
    }
  }
});

successfullPopup.addEventListener('mousedown', () => {
  successfullPopup.classList.add('hidden');
  removeFormData();
});

//Обработка ошибки отправки
function failSend () {
  failSendPopup.classList.remove('hidden');
}

failSendButton.addEventListener('click', () => {
  failSendPopup.classList.add('hidden');
});

failSendPopup.addEventListener('mousedown', () => {
  failSendPopup.classList.add('hidden');
});

//Обработка успешно отправленных данных
function successfullSend () {
  successfullPopup.classList.remove('hidden');
}

adForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const sendData = fetch(sendDataUrl,
    {
      method: 'POST',
      body: new FormData(adForm),
    },
  )
    .then((response) => (response.ok) ? successfullSend() : (() => {throw new Error (`Упс, что то пошло не так. Ошибка ${response.status}, так досадно, что не получилось отправить данные на сервер.`);})())
    .catch((error) => failSend(error));
});


// const OFFERS_VALUE = 10;
// const ANY = 'any';

// const price = {
//   low: 'low',
//   middle: 'middle',
//   high: 'high',
//   minCost:'10000',
//   maxCost:'50000',
// };

// //найдем фильтры на странице
// const filterFormMap = document.querySelector('.map__filters');
// const housingType = filterFormMap.querySelector('#housing-type');
// const housingPrice = filterFormMap.querySelector('#housing-price');
// const housingRooms = filterFormMap.querySelector('#housing-rooms');
// const housingGuests = filterFormMap.querySelector('#housing-guests');

// //найдем выбранное значение типа жилья
// const filterMatch = (filterValue, dataField) => filterValue === ANY || String(filterValue) === String(dataField);

// //определение выбранного значения цены
// const priceMatch = (filterValue, dataField) =>
//   filterValue === ANY ||
//   (filterValue === price.low && dataField < price.minCost) ||
//   (filterValue === price.middle && dataField >= price.minCost && dataField < price.maxCost) ||
//   (filterValue === price.high && dataField >= price.maxCost);

// //дополнительные опции
// const selectFeatures = (filterValue, dataValue) => filterValue.every((feature) => dataValue.includes(feature));

// const getFinalFilter = (offers) => {
//   console.log(offers);
//   const allCheckFeatures = Array.from(filterFormMap.querySelectorAll('.map__checkbox:checked')).map((element) => element.value);
//   const filterData = offers.filter((item) => {
//     const typeValue = item.offer.type ? item.offer.type : '';
//     const priceValue = item.offer.price ? item.offer.price : '';
//     const roomsValue = item.offer.rooms ? item.offer.rooms : '';
//     const guestsValue = item.offer.guests ? item.offer.guests : '';
//     const featuresValue = item.offer.features ? item.offer.features : [];

//     return filterMatch(housingType.value, typeValue) &&
//     priceMatch(housingPrice.value, priceValue) &&
//     filterMatch(housingRooms.value, roomsValue) &&
//     filterMatch(housingGuests.value, guestsValue) &&
//     selectFeatures(allCheckFeatures, featuresValue);
//   });
//   return filterData.slice(0, OFFERS_VALUE);
// };

export {map};
