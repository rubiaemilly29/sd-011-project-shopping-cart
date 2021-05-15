window.onload = function onload() { };
const api = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const mainSection = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  mainSection.appendChild(section);

  return section;
}

// 1
const fetchApi = () => {
  const headers = { headers: { Accept: 'application/json' } };
  fetch(api, headers)
  .then((response) => response.json())
  .then((json) => {
    // console.log(json.results);
    const resultJson = json.results;
    const mainSection = document.querySelector('.items');
    resultJson.forEach((computer) => {
      mainSection.appendChild(createProductItemElement(computer));
    });
  });
};
fetchApi();

window.onload = function onnload() { fetchApi(); };

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
