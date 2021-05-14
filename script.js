const olDistribution = '.cart__items';
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

function updatePrice(price) {
  const paragraph = document.querySelector('.total-price');
  if (paragraph.innerHTML !== Number) {
    paragraph.innerText = (price + Number(paragraph.innerHTML));
  } else {
    paragraph.innerText = '0';
  }
  localStorage.setItem('totalprice',paragraph.innerText)
}

function cartItemClickListener(event) {
  event.target.remove(olDistribution);
  const priceToRemove = event.target.innerText.split('$')[1];
  updatePrice(Number(priceToRemove) * -1);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function loadingSite() {
  document.querySelector('.loading').innerHTML = 'loading...'
}

function siteloaded() {
  document.querySelector('.loading').innerHTML = ''
}

function addProductOnShoppingCart(query) {
  const param = { method: 'GET', headers: { Accept: 'application/json' } }; 
  fetch(`https://api.mercadolibre.com/items/${query}`, param)
  .then((response) => response.json())
  .then((data) => {
    const creatElementOl = createCartItemElement({
      sku: data.id,
      name: data.title,
      salePrice: data.price,
    });
    document.querySelector(olDistribution).appendChild(creatElementOl);
    localStorage.setItem('Product', document.querySelector(olDistribution).innerHTML);
    updatePrice(data.price);
  });
}

function getProducts(query) {
  loadingSite()
  const param = { method: 'GET', headers: { Accept: 'application/json' } }; 
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${query}`, param)
  .then((response) => response.json())
  .then((data) => data.results.forEach((value) => {
    const returnOfElement = createProductItemElement({
      sku: value.id, 
      name: value.title, 
      image: value.thumbnail,
    });
    returnOfElement.addEventListener('click', () => {
      addProductOnShoppingCart(value.id);
    });
    document.querySelector('.items').appendChild(returnOfElement);
  }))
  .then(() => siteloaded())
}

function buttonCleanItens() {
  const button = document.querySelector('.empty-cart');
  const olfind = document.querySelector('.cart__items');
  button.addEventListener('click', () => {
    olfind.innerHTML = '';
    localStorage.clear();
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function loadFromLocalStorage() {
  document.querySelector(olDistribution).innerHTML = localStorage.getItem('Product');
  localStorage.getItem('Product');
  const liSelection = document.querySelectorAll('li');
  liSelection.forEach((element) => element.addEventListener('click', cartItemClickListener));
  const paragraph = document.querySelector('.total-price')
  paragraph.innerText = localStorage.getItem('totalprice');
}

window.onload = function onload() {
  getProducts('computador');
  buttonCleanItens();
  loadFromLocalStorage();
};