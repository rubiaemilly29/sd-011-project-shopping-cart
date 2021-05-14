const cartItemsOl = '.cart__items';

// cria um elemento de imagem (img)
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// função que cria um elemento html
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// realizar a requisição para o endpoint:
const getItemByID = async (id) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const data = await response.json();
  return data;
};

// pega o id que está no span de cada item
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// faz a contagem do preço dos items passando por cada li dando split no innerHTML splitando o que tem depois do '$', com isso, no index 1 terá só o número de cada preço, após isso cada preço vai sendo colocado na variável sumPrices e é só colocar no innerHTML do total-price.
const countCart = () => {
  const totalPrice = document.querySelector('.total-price');
  let sumPrices = 0;
  const li = document.querySelectorAll('li');
  li.forEach((e) => {
    const splitted = e.innerText.split('$');
    sumPrices += Number(splitted[1]);
  });
  totalPrice.innerHTML = `${sumPrices}`;
};

// evento para remover cada item ao clicar e ao remover refaz a contagem do total-price
function cartItemClickListener(event) {
  event.target.remove();
  countCart();
}

// parâmetro com destructuring para a cada click criar a li com o SKU, NAME, PRICE.
function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// salva no localStorage o ol do cart__items
const saveCartStorage = () => {
  const cartItems = document.querySelector(cartItemsOl).innerHTML;
  localStorage.setItem('savedCart', cartItems);
};

// função assíncrona pois precisa esperar o acesso ao fetch e pra utilizar o await é preciso o async... o await seria como 'espere encontrar uma resposta'.
// com o getSkuFromProductItem(event.target.parentElement) ele pega o id pelo elemento pai do button, ou seja, ele vai para a section item e dentro dela ela pega o span item__sku.
// com o getItemByID(id) ele usa esse id como busca no fetch.json()
// após isso ele dá o appendChild na ol cartItems e com o createCartItemElement(item) com o destructuring ele pega apenas o id, title e price do item.
// salva o Cart no localStorage
// faz a contagem dos preços do cart
const addItemCart = async (event) => {
  const cartItems = document.querySelector(cartItemsOl);
  const id = await getSkuFromProductItem(event.target.parentElement);
  const item = await getItemByID(id);
  cartItems.appendChild(createCartItemElement(item));
  saveCartStorage();
  countCart();
};

// cria cada item e com o destructuring ele pega apenas o id, title e thumbnail e cria os elementos com a função createCustomElement() e a thumbnail com o createProductImageElement()
// cria um botão já adicionando o addEventListener('click', addItemCart); para em cada elemento ao clicar no botão cada item ser colocado no cart.
function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', addItemCart);

  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);

  return section;
}

// adicionar cada produto da API em cada section item, filha da section items e remove o loading depois de carregar a API.
const searchQuery = async (query) => {
  const fetchApi = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const data = await fetchApi.json();
  document.querySelector('.loading').remove();
  data.results.forEach((data) => createProductItemElement(data));
};

// pega os itens do localStorage setado como savedCart e coloca no innerHTML da ol cart__items
const getItemsFromLocalStorage = () => {
  const ol = document.querySelector(cartItemsOl);
  const savedCart = localStorage.getItem('savedCart');
  ol.innerHTML = savedCart;
};

// adiciona um addEventListener no botão empty-cart para limpar o localStorage , o innerHTML do cartItemsOl e refaz a função countCart para deixar no 0 o total-price.
const emptyButton = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    document.querySelector(cartItemsOl).innerHTML = '';
    localStorage.clear();
    countCart();
  });
};

window.onload = function onload() { 
  searchQuery('computador');
  getItemsFromLocalStorage();
  emptyButton();
  countCart();
};