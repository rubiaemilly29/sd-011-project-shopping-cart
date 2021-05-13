const fetch = require('node-fetch');

const myPromise = () => new Promise(() => {
  const myObject = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };

  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador', myObject)
    .then((response) => response.json())
    .then((elements) => console.log(elements.results))
    .catch((error) => console.log(error));
});
myPromise();