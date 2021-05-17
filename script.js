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

const calculatingTotalPrice = () => {
  const productsOnCart = document.querySelectorAll('.cart__item');

  let calculatePrice = 0;
  productsOnCart.forEach((element) => {
    const price = element.innerHTML.split('$')[1];
    calculatePrice += Number(price);
    calculatePrice = Math.round(calculatePrice * 100) / 100;
  });

  const calculatedTotalPrice = document.querySelector('.total-price');
  calculatedTotalPrice.innerHTML = calculatePrice; 
}; 

function cartItemClickListener(event, count) {
  const clickLocation = event.target;
  clickLocation.parentNode.removeChild(clickLocation);
  localStorage.removeItem(`item${count}`);
  calculatingTotalPrice();
}

const buttonClearCart = () => {
  const itemOnCart = document.querySelectorAll('.cart__item');
  const orderedListOfItems = document.querySelector('ol');
  itemOnCart.forEach((element) => {
    orderedListOfItems.removeChild(element);
  });
  calculatingTotalPrice();
};

function createCartItemElement({ sku, name, price }) {
  const li = document.createElement('li');
  const itemsOnCart = document.querySelector('.cart__items');
  const count = itemsOnCart.childElementCount;
  localStorage.setItem(`item${count}`, `${sku}|${name}|${price}`);
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  li.addEventListener('click', (event) => cartItemClickListener(event, count));
  itemsOnCart.appendChild(li);
  calculatingTotalPrice();
  return li;
}

function createProductItemElement({ sku, name, image, price }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => createCartItemElement({ sku, name, price }));
  
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const fetchApi = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const items = document.querySelector('.items');
  fetch(endpoint)
  .then((response) => response.json())
  .then((data) => {
    document.querySelector('.loading').remove();
    data.results.forEach(({ id, title, thumbnail, price }) => {
      items
      .appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail, price }));
    });
  })
  .then(() => {
    Object.keys(localStorage).forEach((element, index) => {
      const [sku, name, price] = localStorage.getItem(`item${index}`).split('|');
      createCartItemElement({ sku, name, price });
    });
  });
};

window.onload = function onload() { 
  fetchApi();
  const cart = document.querySelector('.empty-cart');
  cart.addEventListener('click', buttonClearCart);
};
