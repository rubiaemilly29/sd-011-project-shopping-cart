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

function cartItemClickListener(event) { // para remover da lista
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function render(json) {
  json.results.forEach((element) => {
    const newObject = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };
    const newItem = createProductItemElement(newObject);
    const sectionItems = document.querySelector('.items');
    sectionItems.appendChild(newItem);
  });
}

function listOfItems() {
  return document.querySelectorAll('.cart__item');
}

async function emptyCart() {
  const teste = await listOfItems();
  try {
    teste.forEach((item) => item.remove());
  } catch (error) {
    alert('erro ao limpar carrinho');
  }
}

function checkButtonEmptyCart() {
  const butttonEmptyCart = document.querySelectorAll('.empty-cart')[0];
  butttonEmptyCart.addEventListener('click', emptyCart);
}

async function getItem(term) {
  try {
    const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${term}#json`);
    const json = await response.json();
    render(json);
  } catch (error) {
    alert('algo de errado não está certo');
  }
}

async function addItemToCart(event) {
  const currentId = await getSkuFromProductItem((event.target).parentNode);
  try {
    const response = await fetch(`https://api.mercadolibre.com/items/${currentId}`);
    const json = await response.json();
    const objectItem = {
      sku: json.id,
      name: json.title,
      salePrice: json.price,
    };
    const cartItem = createCartItemElement(objectItem);
    const cartItems = document.querySelector('.cart__items');
    cartItems.appendChild(cartItem);  
  } catch (error) {
    alert('ao clicar botão de adicionar ao carrinho');
  }
}

async function createObjectButtons() {
  await getItem('computador');
  try {
    const objectButtonsAdd = document.querySelectorAll('.item__add');
    objectButtonsAdd.forEach((button) => button.addEventListener('click', addItemToCart));
  } catch (error) {
    alert('erro ao criar objeto com os botões adicionar ao carrinho');
  }
}

window.onload = function onload() { 
  createObjectButtons();
  checkButtonEmptyCart();
};