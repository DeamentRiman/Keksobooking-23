// Проверка формы на валидность данных

const MIN_TITLE_LENGTH = 30;
const MAX_TITLE_LENGTH = 100;
const form = document.querySelector('form');
// const submitValues = document.querySelector('.ad-form__submit');

function formValidator() {
  //Валидность заголовка объявления
  const noticeTitle = document.querySelector('#title');

  noticeTitle.addEventListener('input', () => {
    const noticeLength = noticeTitle.value.length;
    if (noticeLength < MIN_TITLE_LENGTH) {
      noticeTitle.setCustomValidity('Заголовок объявления должен быть длиннее 30 символов');
    } else if (noticeLength > MAX_TITLE_LENGTH) {
      noticeTitle.setCustomValidity('Заголовок объявления должен быть короче 100 символов');
    } else if (noticeLength === 0) {
      noticeTitle.setCustomValidity('Поле обязательно для заполнения');
    } else {
      noticeTitle.setCustomValidity('');
    }
    noticeTitle.reportValidity();
  });

  //Валидность значения цены за ночь проживания
  const MIN_PRICE_PER_NIGTH = 0;
  const MAX_PRICE_PER_NIGTH = 1000000;
  const pricePerNigth = document.querySelector('#price');

  pricePerNigth.addEventListener('input', () => {
    const priceLength = pricePerNigth.value;
    if (priceLength > MAX_PRICE_PER_NIGTH) {
      pricePerNigth.setCustomValidity('Слишком высокая стоимость проживания');
    } else if (priceLength < MIN_PRICE_PER_NIGTH) {
      pricePerNigth.setCustomValidity('Cтоимость не может быть отрицательной');
    } else {
      pricePerNigth.setCustomValidity('');
    }
    pricePerNigth.reportValidity();
  });

  let roomNumber = document.querySelector('#room_number');
  let capacity = document.querySelector('#capacity');
  const addValidatorForRooms = function () {
    roomNumber = document.querySelector('#room_number');
    capacity = document.querySelector('#capacity');
    Number(roomNumber);
    Number(capacity);
    let message = '';
    if (roomNumber.value == 1 && capacity.value > 1) {
      message = 'В номере с 1 комнатой может разместиться только 1 гость';
    } else if (roomNumber.value == 2 && capacity.value > 2) {
      message = 'В номере с 2 комнатами могут разместиться максимум 2 гостя';
    } else if (roomNumber.value == 3 && capacity.value > 3) {
      message = 'В номере с 3 комнатами могут разместиться максимум 3 гостя';
    } else if (roomNumber.value == 100 && !capacity.value == 0) {
      message = 'Номер не предназначен для гостей';
    }
    roomNumber.setCustomValidity(message);
    roomNumber.reportValidity();
    capacity.setCustomValidity(message);
    capacity.reportValidity();
  };

  roomNumber.addEventListener('change', addValidatorForRooms);
  capacity.addEventListener('change', addValidatorForRooms);

  // //Тип жилья
  const habitation = document.querySelector('#type');
  const pricePerType = document.querySelector('#price');
  const priceForHabitation = {
    'bungalow': 0,
    'flat': 1000,
    'hotel': 3000,
    'house': 5000,
    'palace': 10000,
  };
  const minPrice = () => {
    const minimalPrice = priceForHabitation[habitation.value];
    pricePerType.min = minimalPrice;
    pricePerType.placeholder = minimalPrice;
    pricePerType.addEventListener('keypress', () => {
      if (pricePerType < minimalPrice) {
        pricePerType.setCustomValidity('Минимальная стоимость проживания за ночь ' + minimalPrice + ' руб.');
      }
    });
  };
  habitation.addEventListener('change', minPrice);

  //Время заезда
  const timeIn = document.querySelector('#timein');
  const timeOut = document.querySelector('#timeout');

  timeIn.addEventListener('click', () => {
    timeOut.value = timeIn.value;
  });
  timeOut.addEventListener('click', () => {
    timeIn.value = timeOut.value;
  });

  //Отправка формы
  form.addEventListener('submit', addValidatorForRooms);
}

export {formValidator};
