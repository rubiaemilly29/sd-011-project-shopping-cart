const cartListItems = document.querySelector('.cart__items');

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

function sumPrices() {
  const totalPrice = document.querySelector('.total-price');
  const productsList = document.querySelectorAll('.cart__item');
  let sumPrices = 0;
  productsList.forEach((element) => {
    const value = element.innerText.split('$');
    sumPrices += Number(value[1]);
  });
  totalPrice.innerHTML = `Preço Total: ${sumPrices}`;
}

function cartItemClickListener(event) {
  event.target.parentElement.removeChild(event.target);
  localStorage.setItem('items', cartListItems.innerHTML);
  sumPrices();
}

function createCartItemElement({ id: sku, title: name, price }) {
  const li = document.createElement('li');
  const list = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  console.log(sumPrices(price));
  list.appendChild(li);
  return li;
}

const onClick = async (id) => {
  const url = `https://api.mercadolibre.com/items/${id}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const newItemToCart = createCartItemElement(data);
      cartListItems.appendChild(newItemToCart);
      localStorage.setItem('items', cartListItems.innerHTML);
      sumPrices();
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
  cartListItems.innerHTML = localStorage.getItem('items');
  sumPrices();
};