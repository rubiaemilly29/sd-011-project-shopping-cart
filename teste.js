const fetch = require('node-fetch');

const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

const myObj = {
  method: 'GET',
  headers: { Accept: 'application/json' },
};

const newProduct = async () => {
  const parseJson = (el) => el.json();
  const product = await fetch(API_URL, myObj);
  const jsonProduct = await parseJson(product);
  return jsonProduct.results;
};

const getProductKeys = async (product) => {
  const importedProduct = await product();
  importedProduct.forEach((el) => console.log(el.id, el.title, el.thumbnail));
};
// getProductKeys(newProduct);

const productMLArray = async (itemId) => {
  const ML_ITEM = `https://api.mercadolibre.com/items/${itemId}`;
  const parseJson = (el) => el.json();
  const product = await fetch(ML_ITEM, myObj);
  const jsonProduct = await parseJson(product);
  return console.log(jsonProduct);
};
productMLArray('MLB1341706310');
