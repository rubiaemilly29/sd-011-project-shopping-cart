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

const cartList = document.querySelector('.cart__items');

const cartSection = document.querySelector('.cart');

const fl = (str) => parseFloat(str);

const rd = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

const numberDots = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:(\.|,)\d+)?$/;

function cartItemClickListener(event) {
  const price = document.querySelector('.total-price');
  let priceNumber = 0;
  if (price) priceNumber = fl(price.innerText);
  // priceRemovalHandling();
  const targetText = event.target.innerText;
  const dollarSignIndex = targetText.indexOf('$');
  const rawValue = targetText.substring(dollarSignIndex + 1);
  const finalValue = fl(rawValue.match(numberDots)[0]);
  const newTotal = rd(priceNumber - finalValue);
  if (price) price.innerText = newTotal;
  event.target.remove();
  localStorage.setItem('list', cartList.innerHTML);
}

const itemsSection = document.querySelector('.items');

const handleProduct = (item) => {
  const productData = {
    sku: item.id,
    name: item.title,
    image: item.thumbnail,
    salePrice: item.price,
  };
  return productData;
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

const startLoading = () => {
  const div = document.createElement('div');
  div.className = 'loading';
  div.innerText = 'Loading...';
  document.body.appendChild(div);
};

const fetchPCs = () => {
  startLoading();
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((resp) => {
      const div = document.querySelector('div');
      div.remove();
      return resp.json();
    })
    .then((resp) => resp.results)
    .then((product) => {
      product
        .map((item) => {
          const finalProd = handleProduct(item);
          return itemsSection.appendChild(createProductItemElement(finalProd));
        });
    });
};

const totalPrice = document.createElement('p');
totalPrice.classList = 'total-price';
let numberPrice = 0;

const priceHandler = ({ salePrice }) => {
  const currentTotal = fl(salePrice);
  numberPrice += currentTotal;
  totalPrice.innerHTML = rd((numberPrice));
  cartSection.appendChild(totalPrice);
};

const fetchId = (id) => {
  let objData;
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((resp) => resp.json())
    .then((object) => {
      const singleProduct = handleProduct(object);
      priceHandler(singleProduct);
      objData = createCartItemElement(singleProduct);
      cartList.appendChild(objData);
      localStorage.setItem('list', cartList.innerHTML);
    });
};

const addToCartBtn = () => {
  itemsSection.addEventListener('click', (event) => {
    const pcId = getSkuFromProductItem(event.target.parentNode);
    fetchId(pcId);
  });
};

const loadCart = () => {
  cartList.innerHTML = localStorage.getItem('list');
};

window.onload = function onload() {
  fetchPCs();
  addToCartBtn();
  loadCart();
};

const ol = document.querySelector('ol');
ol.addEventListener('click', cartItemClickListener);

const delCartBtn = document.querySelector('.empty-cart');

delCartBtn.addEventListener('click', () => {
  cartList.innerHTML = '';
  localStorage.removeItem('list');
});
