const olclass = 'ol.cart__items';

// ex 05 - Soma valor total
const sumProducts = () => {
  const liItems = [...document.querySelectorAll('li.cart__item')];
  const price = liItems.reduce((acc, li) => Number(li.innerText.split('$')[1]) + acc, 0);
  const totalPrice = document.querySelector('span.total-price');
  totalPrice.innerText = price;
};

// ex 3 - Remove item do carrinho ao clicar
function cartItemClickListener() {
  this.remove();
  const cartList = document.querySelector(olclass);
  localStorage.setItem('olCart', cartList.innerHTML);
  sumProducts();
}

// Cria um item da lista do carrinho e configura
function createCartItemElement({ id: sku, title: name, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  const cartListt = document.querySelector(olclass);
  cartListt.appendChild(li);
  localStorage.setItem('olCart', cartListt.innerHTML);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const appendToCart = async (event) => {
  const itemID = getSkuFromProductItem(event.target.parentElement);
  const itemToAdd = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  const itemJson = await itemToAdd.json();
  createCartItemElement(itemJson);
  sumProducts();
};

// ex 6 - Esvazia o carrinho
const emptyCartButton = document.querySelector('.empty-cart');
emptyCartButton.addEventListener('click', () => {
  const olCart = document.querySelector(olclass);
  olCart.innerText = '';
  sumProducts();
  localStorage.clear();
});

// Cria uma tag img passando a fonte como parametro
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// Cria uma tag conforme passada no primeiro paraemtro com uma classe no segundo e seu conteudo no terceiro
function createCustomElement(element, className, innerText) {
  const newTag = document.createElement(element);
  newTag.className = className;
  newTag.innerText = innerText;
  return newTag;
}

// Cria utilizando as funções anteriores um produto com discrição, imagem e o botão para adiciconar ao carrinho. Tudo em uma sessão e retorna ela
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', appendToCart);
  
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);
}

const fetchElement = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador') 
    .then((response) => response.json())
    .then((response) => response.results.forEach((element) => createProductItemElement(element)))
    .catch((err) => window.alert(err));
};

// Para chegar nessa solução fiz a leitura da PR do aluno Bruno Duarte t11 e revisitei o projeto ToDo list. 
const loadLocalStorage = () => {
  const storage = localStorage.getItem('olCart');
  const olList = document.querySelector(olclass);
  olList.innerHTML = storage;
  const liItem = document.querySelectorAll('li.cart__item');
  liItem.forEach((li) => li.addEventListener('click', cartItemClickListener));
};

window.onload = function onload() { 
  fetchElement();
  loadLocalStorage();
  sumProducts();
};
