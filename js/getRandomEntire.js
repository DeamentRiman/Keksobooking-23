//Функция, возвращающая случайное целое число из переданного диапазона включительно.

function getRandomEntire(min, max) {
  if (min >= 0 && max >= 0 && max >= min) {
    min = Math.ceil(min);
    max = Math.floor(max);
    const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomValue;
  } else {
    if (min > max) {
      return ('Число до меньше числа от');
    } else {
      return ('Минимум одно из чисел отрицательное');
    }
  }
}

export {
  getRandomEntire
};
