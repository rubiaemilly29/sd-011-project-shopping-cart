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
  return event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItems = () => {
  const btnCart = document.querySelectorAll('.item__add');
  const getItems = document.querySelector('.cart__items');
  btnCart.forEach((items) => {
    items.addEventListener('click', () => {
      const sku = items.parentElement.firstChild.innerText;
      fetch(`https://api.mercadolibre.com/items/${sku}`)
        .then((result) => result.json())
        .then((data) => getItems.appendChild(createCartItemElement(data)));
    });
  });
};

const fetchProduct = () => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${'computador'}`)
    .then((response) => response.json())
    .then((data) => data.results.forEach(({ id, title, thumbnail }) => {
      const selecItem = document.querySelector('.items');
      const list = createProductItemElement({
        sku: id,
        name: title,
        image: thumbnail,
      });
      selecItem.appendChild(list);
    })).then(() => addItems());
};

window.onload = () => {
  fetchProduct();
};