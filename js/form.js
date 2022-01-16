//Активация карты
const addForm = document.querySelector('.ad-form');
const mapFilters = document.querySelector('.map__filters');
const addFormChildren = addForm.querySelectorAll('fieldset');
const mapFilterChildrenSelect = mapFilters.querySelectorAll('select');
const mapFilterChildrenFieldset = mapFilters.querySelectorAll('fieldset');

const disabledForm = function() {
  addForm.classList.add('ad-form--disabled');
  addFormChildren.forEach((fieldset) => {
    fieldset.disabled = true;
  });
  mapFilters.classList.add('ad-form--disabled');
  mapFilterChildrenSelect.forEach((select) => {
    select.disabled = true;
  });
  mapFilterChildrenFieldset.forEach((fieldset) => {
    fieldset.disabled = true;
  });
};

const availableForm = function() {
  addForm.classList.remove('ad-form--disabled');
  addFormChildren.forEach((fieldset) => {
    fieldset.disabled = false;
  });
  mapFilters.classList.remove('ad-form--disabled');
  mapFilterChildrenSelect.forEach((select) => {
    select.disabled = false;
  });
  mapFilterChildrenFieldset.forEach((fieldset) => {
    fieldset.disabled = false;
  });
};

export {disabledForm, availableForm};
