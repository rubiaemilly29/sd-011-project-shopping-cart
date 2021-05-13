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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const cart = document.querySelector('.cart__items');
  cart.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function searchItems(search) {
  const section = document.querySelector('.items');
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${search}`;
  fetch(endpoint)
  .then((response) => response.json())
  .then((object) => { 
    if (object.error) {
      throw new Error(object.error);
    }
    object.results.forEach((value) => {
      const item = { sku: value.id, name: value.title, image: value.thumbnail };
      section.appendChild(createProductItemElement(item));
    });
  })
  .catch((error) => {
    window.alert(error);
  });
}

const addItemCart = () => {
  const buttom = document.querySelector('.items');
  buttom.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const id = event.target.parentElement.firstElementChild.innerText;
      const listCart = document.querySelector('.cart__items');
      const endpoint = `https://api.mercadolibre.com/items/${id}`;
      fetch(endpoint)
      .then((response) => response.json())
      .then((object) => { 
        const item = { sku: object.id, name: object.title, salePrice: object.price };
        listCart.appendChild(createCartItemElement(item));
      })
      .catch((error) => {
        window.alert(error);
      });
    }
  });
};

window.onload = function onload() {
  const search = 'computador';
  searchItems(search);
  addItemCart();
};
