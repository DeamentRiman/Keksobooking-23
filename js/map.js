//Подключение карты Leaflets
import {typeOfHouse} from './create-notice.js';
import {similarMassive} from './create-notice.js';
import {disabledForm,  availableForm} from './form.js';

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


const defaultAddress = document.querySelector('#address');

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
  offer.address ? addCard.querySelector('.popup__text--address').textContent = offer.address : addCard.querySelector('.popup__text--address').classList('hidden');
  offer.price ? addCard.querySelector('.popup__text--price').textContent = `${offer.price} ₽/ночь` : addCard.querySelector('.popup__text--price').classList('hidden');
  offer.type ? addCard.querySelector('.popup__type').textContent = typeOfHouse[offer.type] : addCard.querySelector('.popup__type').classList('hidden');
  offer.rooms || offer.guests ? addCard.querySelector('.popup__text--capacity').textContent = `${offer.rooms} комнаты для ${offer.guests} гостей` : addCard.querySelector('.popup__text--capacity').classList('hidden');
  offer.checkin || offer.checkout ? addCard.querySelector('.popup__text--time').textContent = `Заезд после ${offer.checkin}, выезд до ${offer.checkout}` : addCard.querySelector('.popup__text--time').classList('hidden');
  offer.features ? addCard.querySelector('.popup__features').textContent = offer.features : addCard.querySelector('.popup__features').classList('hidden');
  offer.description ? addCard.querySelector('.popup__description').textContent = offer.description : addCard.querySelector('.popup__description').classList('hidden');
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

//Обработчик для меток с целью их отрисовки на карте
similarMassive.forEach(({author, offer, location}) => {
  createMarker({author, offer, location});
});

export {map};
