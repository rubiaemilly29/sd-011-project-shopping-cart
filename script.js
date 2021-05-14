const totalPrice = document.createElement('span');
totalPrice.className = 'total-price';
totalPrice.innerHTML = '0';
const cartListClass = 'ol.cart__items';

const appendPriceContainer = async () => {
  const cartSectionParagraph = document.querySelector('section.cart p');
  cartSectionParagraph.appendChild(totalPrice);
};

const createLoading = (container) => {
  const loadingText = document.createElement('span');
  loadingText.className = 'loading';
  loadingText.innerText = 'loading...';
  container.appendChild(loadingText);
};

const deleteLoading = () => {
  const loadingText = document.querySelector('.loading');
  const cartList = loadingText.parentNode;
  cartList.removeChild(loadingText);
};

// Atualiza o preço final
const updateTotalPrice = async () => {
  const prices = document.querySelectorAll('li.cart__item');
  let sum = 0;
  prices.forEach((product) => {
    const prodStrings = product.innerText.split('$');
    sum += Number(prodStrings[1]);
  });
  totalPrice.innerHTML = `${sum}`;
};

const emptyAll = () => {
  const bntClear = document.querySelector('.empty-cart');
  bntClear.addEventListener('click', () => {
    const cartList = document.querySelector(cartListClass);
    cartList.innerHTML = '';
    localStorage.setItem('cart', cartList.innerHTML);
    updateTotalPrice();
  });
};

// Encontra um produto da API pelo seu id
const fetchById = (ItemID) => fetch(`https://api.mercadolibre.com/items/${ItemID}`)
  .then((r) => r.json())
  .then((r) => r);

  // Encontra o id de um produto
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

  // Cria a função que será realizada ao clicar no item da lista de compras
function cartItemClickListener(event) {
  // coloque seu código aqui
  const container = event.target.parentNode;
  container.removeChild(event.target);
  updateTotalPrice();
  localStorage.setItem('cart', container.innerHTML);
}

  // Carrega os itens do carrinho salvos no localStorage
const loadCart = () => {
  const cart = localStorage.getItem('cart');
  if (cart) {
    const cartList = document.querySelector(cartListClass);
    cartList.innerHTML = cart;
    const cartItems = document.querySelectorAll('.cart__items .cart__item');
    cartItems.forEach((item) => item.addEventListener('click', cartItemClickListener));
  }
  updateTotalPrice();
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const btnAddCartEvent = async (event) => {
  const id = getSkuFromProductItem(event.target.parentElement);
  const cart = document.querySelector(cartListClass);
  createLoading(cart);
  const item = await fetchById(id);
  deleteLoading();
  const li = createCartItemElement({ sku: item.id, name: item.title, salePrice: item.price });
  cart.appendChild(li);
  updateTotalPrice();
  localStorage.setItem('cart', cart.innerHTML);
};

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
  const btnAddCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(btnAddCart);
  btnAddCart.addEventListener('click', btnAddCartEvent);

  return section;
}

const fetchProducts = (QUERY) => fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`)
    .then((r) => r.json())
    .then((r) => r.results);

const createList = async () => {
  const section = document.querySelector('section.items');
  createLoading(section);
  const productsArr = await fetchProducts('computador');
  deleteLoading();
  productsArr.forEach(({ id: sku, title: name, thumbnail: image }) => {
    const htmlItems = createProductItemElement({ sku, name, image });
    section.appendChild(htmlItems);
  });
};

window.onload = function onload() {
  createList();
  appendPriceContainer();
  loadCart();
  emptyAll();
};
