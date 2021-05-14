function getLclStorage() {
  const takeOl = document.querySelector('ol');
  const get = localStorage.getItem('listItems');
  takeOl.innerHTML = get;
}

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
  const items = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  items.appendChild(section);
  return items;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

let priceTotal = 0;
function sumSalePrice(price) {
  priceTotal += price;
  const getPprice = document.querySelector('.total-price');
  getPprice.innerText = priceTotal;
}

function cartItemClickListener() {
  const text = this.innerText;
  const result = -parseFloat(text.match(/[0-9.]{4,8}$/));
  sumSalePrice(result);
  this.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  sumSalePrice(salePrice);
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function lclStorage() {
  const getDoc = document.querySelector('ol').innerHTML;
  localStorage.setItem('listItems', getDoc);
}

function getInfos() {
  const get = this.parentNode;
  const id = getSkuFromProductItem(get);
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((r) => r.json())
      .then((r) => {
        const getOl = document.querySelector('ol');
        const { id: sku, title: name, price: salePrice } = r;
        getOl.appendChild(createCartItemElement({ sku, name, salePrice }));
      })
        .then(() => lclStorage());
}

function getApi() {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
      .then((r) => r.json())
      .then((r) => {
        const dados = r.results;
        dados.forEach((pc, i) => {
          const { id: sku, title: name, thumbnail: image } = dados[i];
          createProductItemElement({ sku, name, image });
        });
        const btn = document.querySelectorAll('.item__add');
        btn.forEach((element) => element.addEventListener('click', getInfos));
      })
      .catch(() => 'Any error occurred!');
    setTimeout(() => {
      document.querySelector('.items').firstElementChild.remove();
    }, 3000);
}

function clearCart() {
  const getOl = document.querySelector('ol');
  while (getOl.hasChildNodes()) {
    getOl.removeChild(getOl.firstChild);
  }
  document.querySelector('.total-price').innerText = 0;
}

window.onload = function onload() { 
  getApi();
  getLclStorage();
  const getCart = document.querySelector('.empty-cart');
  getCart.addEventListener('click', clearCart);
};
