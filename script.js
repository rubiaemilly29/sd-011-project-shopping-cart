 const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
 const itemsSection = document.getElementsByClassName('items')[0];
 const cartArea = document.getElementsByClassName('cart__items')[0];
 const totalPrice = document.getElementsByClassName('total-price')[0];
 //
 let fullListStringified = JSON.stringify(cartArea.innerHTML);
 let totalPriceStringified = JSON.stringify(totalPrice.innerHTML);

/// / LOCALSTORAGE
function saveCartData() {
  fullListStringified = JSON.stringify(cartArea.innerHTML);
  localStorage.setItem('Saved Cart List', fullListStringified);
  totalPriceStringified = JSON.stringify(totalPrice.innerHTML);
  localStorage.setItem('Total Price', totalPriceStringified);
}
//

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

/// / REMOVE FROM CART

function cartItemClickListener(event) {
  const crazyObj = Object
    .fromEntries(event.target.innerHTML
      .split(' | ')
        .map((entry) => entry.split(': ')));
  const crazyObjPrice = crazyObj.PRICE.match(/\d+/g).map(Number).join('.');
  const priceSubtraction = parseFloat(totalPrice.innerHTML) - parseFloat(crazyObjPrice);
  totalPrice.innerHTML = Number(priceSubtraction.toFixed(2)).toString();
  console.log('buguei');
  event.target.remove();
  saveCartData();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

/// / ADD TO CART
// FETCH PRODUCT
const fetchProductItem = async (apiKey) => {
  const myObject = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };
  await fetch(apiKey, myObject) // await faz com que seja 'sincrona', esperando ser resolvida pra ler o resto
    .then((response) => response.json())
    .then((product) => {
      cartArea.appendChild(createCartItemElement(product));
      const priceSum = (parseFloat(totalPrice.innerHTML) || 0) + parseFloat(product.price);
      totalPrice.innerHTML = Number(priceSum.toFixed(2)).toString();
    });
  saveCartData();
};

itemsSection.addEventListener(('click'), (e) => {
  let productId = '';
  if (e.target.tagName === 'BUTTON') {
    productId = e.target.parentElement.childNodes[0].innerText;
    const API_PRODUCT = `https://api.mercadolibre.com/items/${productId}`;
  fetchProductItem(API_PRODUCT);
  }
});

/// / FETCH LIST
const fetchProductList = () => {
  const myObject = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };

  fetch(API_URL, myObject)
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach((result) => {
        itemsSection.appendChild(createProductItemElement(result));
      });
    });
};

fetchProductList();

window.onload = function onload() {
  const fullListParsed = JSON.parse(localStorage.getItem('Saved Cart List')); 
  const totalPriceParsed = JSON.parse(localStorage.getItem('Total Price')); 
  totalPrice.innerHTML = totalPriceParsed;
  const cartAreaEspantalho = document.getElementsByClassName('cart__items')[0];
  cartAreaEspantalho.innerHTML = fullListParsed;
  cartAreaEspantalho.addEventListener(('click'), cartItemClickListener);
 };