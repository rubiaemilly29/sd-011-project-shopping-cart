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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
// getSkuFromProductItem();

function cartItemClickListener(event) {
  return event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getItens = () => {
const buttonCart = document.querySelectorAll('.item__add');
const itensCart = document.querySelector('.cart__items');
buttonCart.forEach((elemento) => elemento.addEventListener('click', () => {
const id = elemento.parentElement.firstChild.innerText;
 fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json())
  .then((data) => itensCart.appendChild(createCartItemElement(data)));
  }));
};

const listOfProducts = () => {
const api = `https://api.mercadolibre.com/sites/MLB/search?q=${'computador'}`;
const myObject = {
  method: 'GET',
  headers: { Accept: 'application/json' },
};
  fetch(api, myObject)
  .then((response) => {
    response.json()
    .then((data) => data.results
    .forEach(({ id, title, thumbnail }) => {
      const sectionItem = document.querySelector('.items');
      const objList = createProductItemElement({ sku: id, name: title, image: thumbnail });
      sectionItem.appendChild(objList);
    })).then(() => getItens());
  });
};
listOfProducts();

window.onload = () => {
listOfProducts();
};