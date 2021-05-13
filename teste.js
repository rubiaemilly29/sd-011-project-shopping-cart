const fetch = require('node-fetch');

const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

const myObj = {
  method: 'GET',
  headers: { Accept: 'application/json' },
};

const response = (el) => el.json();
const printData = (data) => console.log(data.results);

const newProduct = async () => {
  const product = await fetch(API_URL, myObj);
  await response(product);
  printData(product);
};

newProduct();
