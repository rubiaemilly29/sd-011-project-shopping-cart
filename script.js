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
  // console.log(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = async () => {
  const cart = document.querySelector('.cart__items');
  const buttonAdd = document.querySelectorAll('.item__add');
  buttonAdd.forEach((button) => {
    button.addEventListener('click', async () => {
      const finalUrl = button.previousElementSibling.previousElementSibling
        .previousElementSibling.innerText;
      const objtectCarAdd = await fetch(`https://api.mercadolibre.com/items/${finalUrl}`);
      const objtectCarAddJson = await objtectCarAdd.json();
      const objectAddCart = await createCartItemElement(objtectCarAddJson);
      cart.appendChild(objectAddCart);
    });
  });
};

const fetchItems = async (url) => {
  const items = document.querySelector('.items');
  const computers = await fetch(url);
  const computersJson = await computers.json();
  await computersJson.results.forEach((result) => {
    const element = createProductItemElement(result);
    items.appendChild(element);
  });
  await addToCart();
};

window.onload = function onload() {
  fetchItems('https://api.mercadolibre.com/sites/MLB/search?q=computador');
 };
