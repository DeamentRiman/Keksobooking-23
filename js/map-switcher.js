
// работаем с фильтром карты
const mapFiltres = document.querySelector('.map__filters');
const mapFiltresSelect = mapFiltres.querySelectorAll('.map__filter');
const mapFiltresItem = mapFiltres.querySelector('#housing-features');

// работаем с фильтром нового обьявления
const formNotice = document.querySelector('.ad-form');
const formNoticeFielsets = formNotice.querySelectorAll('fieldset');

const deactiveMap = () => {
  mapFiltres.classList.add('map__filters--disabled');
  mapFiltresSelect.forEach((select) => {
    select.setAttribute('disabled', 'disabled');
  });
  mapFiltresItem.setAttribute('disabled', 'disabled');

  formNotice.classList.add('ad-form--disabled');
  formNoticeFielsets.forEach((select) => {
    select.setAttribute('disabled', 'disabled');
  });
};

const activeMapFilters = () => {
  mapFiltres.classList.remove('map__filters--disabled');
  mapFiltresSelect.forEach((select) => {
    select.removeAttribute('disabled');
  });
  mapFiltresItem.removeAttribute('disabled');
};

const activeFormNotice = () => {
  formNotice.classList.remove('ad-form--disabled');
  formNoticeFielsets.forEach((select) => {
    select.removeAttribute('disabled');
  });

};

export {deactiveMap, activeMapFilters, activeFormNotice};


