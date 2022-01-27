//функция провальной попытки получения данных с сервера
const mainPage = document.querySelector('main');

function errorUpload (error) {
  const errorMessage = document.createElement('div');
  const errorMessageText = document.createElement('p');
  const errorButton = document.createElement('button');

  errorMessage.classList.add('error__message--fetch');
  errorMessageText.classList.add('error__message-text');
  errorMessageText.textContent = error;
  errorButton.classList.add('error__button');
  errorButton.classList.add('error__button--fetch');
  errorButton.textContent = 'Закрыть';

  errorMessage.appendChild(errorMessageText);
  errorMessage.appendChild(errorButton);
  mainPage.appendChild(errorMessage);

  errorButton.addEventListener('click', (evt) => {
    evt.preventDefault;
    errorMessage.classList.add('hidden');
  });
}

export {errorUpload};
