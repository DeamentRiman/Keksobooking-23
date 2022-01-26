const OFFERS_VALUE = 10;
const ANY = 'any';

const price = {
  low: 'low',
  middle: 'middle',
  high: 'high',
  minCost:'10000',
  maxCost:'50000',
};

//найдем фильтры на странице
const filterFormMap = document.querySelector('.map__filters');
const housingType = filterFormMap.querySelector('#housing-type');
const housingPrice = filterFormMap.querySelector('#housing-price');
const housingRooms = filterFormMap.querySelector('#housing-rooms');
const housingGuests = filterFormMap.querySelector('#housing-guests');

//найдем выбранное значение типа жилья
const filterMatch = (filterValue, dataField) => filterValue === ANY || String(filterValue) === String(dataField);

//определение выбранного значения цены
const priceMatch = (filterValue, dataField) =>
  filterValue === ANY ||
  (filterValue === price.low && dataField < price.minCost) ||
  (filterValue === price.middle && dataField >= price.minCost && dataField < price.maxCost) ||
  (filterValue === price.high && dataField >= price.maxCost);

//дополнительные опции
const selectFeatures = (filterValue, dataValue) => filterValue.every((feature) => dataValue.includes(feature));

const getFinalFilter = (offers) => {
  const allCheckFeatures = Array.from(filterFormMap.querySelectorAll('.map__checkbox:checked')).map((element) => element.value);
  const filterData = offers.filter((item) => {
    const typeValue = item.offer.type ? item.offer.type : '';
    const priceValue = item.offer.price ? item.offer.price : '';
    const roomsValue = item.offer.rooms ? item.offer.rooms : '';
    const guestsValue = item.offer.guests ? item.offer.guests : '';
    const featuresValue = item.offer.features ? item.offer.features : [];

    return filterMatch(housingType.value, typeValue) &&
    priceMatch(housingPrice.value, priceValue) &&
    filterMatch(housingRooms.value, roomsValue) &&
    filterMatch(housingGuests.value, guestsValue) &&
    selectFeatures(allCheckFeatures, featuresValue);
  });
  return filterData.slice(0, OFFERS_VALUE);
};

export {getFinalFilter, filterFormMap};
