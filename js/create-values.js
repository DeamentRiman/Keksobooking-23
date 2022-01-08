// Функция, которая возвращает объект со значениями
import {AVATAR_COUNTS_MIN, AVATAR_COUNT_MAX, MIN_PRICE, MAX_PRICE, TYPE, MIN_ROOMS_QUANTITY, MAX_ROOMS_QUANTITY, MIN_GUESTS, MAX_GUESTS,MIN_LAT, MAX_LAT, MIN_LNG, MAX_LNG, FEATURES, CHECKIN, CHECKOUT, TITLES, DESCRIPTION, PHOTOS, ACCURACY} from './variables.js';
import {getRandomEntire} from './getRandomEntire.js';
import {getRandomPartitive} from './getRandomPartitive.js';

//Объект с одним рандомным значением объявления
function createValues() {
  const generateLat = getRandomPartitive(MIN_LAT, MAX_LAT, ACCURACY);
  const generateLNG = getRandomPartitive(MIN_LNG, MAX_LNG, ACCURACY);
  return {
    author: {
      avatar: `img/avatars/user0${getRandomEntire(AVATAR_COUNTS_MIN, AVATAR_COUNT_MAX)}.png`,
    },
    offer: {
      title: TITLES[getRandomEntire(0, TITLES.length-1)],
      address: `Координаты места раположения: ${generateLat}, ${generateLNG}`,
      price: getRandomEntire(MIN_PRICE, MAX_PRICE),
      type: TYPE[getRandomEntire(0, TYPE.length-1)],
      rooms: getRandomEntire(MIN_ROOMS_QUANTITY, MAX_ROOMS_QUANTITY),
      guests: getRandomEntire(MIN_GUESTS, MAX_GUESTS),
      checkin: CHECKIN[getRandomEntire(0, CHECKIN.length-1)],
      checkout: CHECKOUT[getRandomEntire(0, CHECKOUT.length-1)],
      features: FEATURES.slice(getRandomEntire(1, FEATURES.length-1)),
      description: DESCRIPTION[getRandomEntire(0, DESCRIPTION.length-1)],
      photos: PHOTOS.slice(0,getRandomEntire(1,PHOTOS.length)),
    },
    location: {
      lat: generateLat,
      lng: generateLNG,
    },
  };
}

export {createValues};
