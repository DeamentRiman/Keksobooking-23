//Функция, возвращающая случайное число с плавающей точкой из переданного диапазона включительно.

function getRandomPartitive(min, max, points) {
  if (min >= 0 && max >= 0 && max >= min) {
    const randomValue = (Math.random() * (max - min)) + min;
    return Number(randomValue.toFixed(points));
  } else {
    if (min > max) {
      return ('Число до меньше числа от');
    } else {
      return ('Минимум одно из чисел отрицательное');
    }
  }
}

export {
  getRandomPartitive
};
