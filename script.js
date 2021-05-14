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

function cartItemClickListener(event) {
  event.target.parentElement.removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price }) {
  const li = document.createElement('li');
  const list = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);

  list.appendChild(li);
  return li;
}

const cartItemsList = document.querySelector('.cart__items');

const onClick = async (id) => {
  const url = `https://api.mercadolibre.com/items/${id}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const newItemToCart = createCartItemElement(data);
      cartItemsList.appendChild(newItemToCart);
    } catch (error) { console.log(`Erro: ${error}`); }
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const getItems = document.querySelector('.items');

  getItems.appendChild(section);
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonAddProduct = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(buttonAddProduct);
  buttonAddProduct.addEventListener('click', () => onClick(sku));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function getProducts() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';

  try {
    const response = await fetch(url);
    const data = await response.json();
    const listOfProducts = data.results;
    listOfProducts.forEach((procuct) => createProductItemElement(procuct));
  } catch (error) { console.log(`Erro: ${error}`); }
}

window.onload = function onload() { 
  getProducts();
};