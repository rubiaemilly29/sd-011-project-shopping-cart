const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

// Requisito 3
const cartItemClickListener = (event) => {
  event.target.remove();
};

const createCartItemElement = ({ id: sku, title: name, price: salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event));
  return li;
};

// Requisito 2
const addProductToCart = () => {
  document.querySelectorAll('.item__add').forEach((elem) => elem.addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${elem.parentElement.firstChild.innerText}`)
    .then((resp) => resp.json())
    .then((data) => {
      const ol = document.querySelector('ol');
      const count = ol.childElementCount;
      localStorage.setItem('TotalItems', `${count}`);
      localStorage.setItem(`Item${count}`, 
      `SKU: ${data.id} | NAME: ${data.title} | PRICE: $${data.price}`);
      document.querySelector('.cart__items').appendChild(createCartItemElement(data));
    });
  }));
};

// Requisito 1
const apiUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

const listItems = () => {
  fetch(apiUrl)
  .then((response) => response.json())
  .then((response) => response.results.forEach((item) => {
      const itemToFind = { sku: item.id, name: item.title, image: item.thumbnail };
      document.querySelectorAll('.items')[0].appendChild(createProductItemElement(itemToFind));
    })).then(() => addProductToCart())
  .catch((err) => console.log(err));
};

// Requisito 4
const backupListItem = () => {
  if (localStorage.getItem('TotalItems') > 0) {
    for (let i = 0; i <= localStorage.getItem('TotalItems'); i += 1) {
      const li = document.createElement('li');
      li.className = 'cart__item';
      document.querySelector('.cart__items').appendChild(li);
      li.innerText = localStorage.getItem(`Item${i}`);
    }
  }
};

window.onload = function onload() { 
  backupListItem();
  listItems();
};
