function sumTotalPrices(price) {
  const totalPriceStr = document.querySelector('.total-price');
  let totalPrice = Number(totalPriceStr.innerText);
  totalPrice += price;
  totalPriceStr.innerText = totalPrice;
}

function saveLocalStorage() {
  const userCart = document.querySelector('.cart');
  localStorage.userCart = userCart.innerHTML;
}

function loadLocalStorage() {
  const userCart = document.querySelector('.cart');
  if (localStorage.userCart) {
    userCart.innerHTML = localStorage.userCart;
  }
}

function emptyCart() {
  const emptyCartBtn = document.querySelector('.empty-cart');
  emptyCartBtn.addEventListener('click', () => {
    const cartItems = document.querySelector('.cart__items');
    const totalPrice = document.querySelector('.total-price');
    cartItems.innerHTML = '';
    totalPrice.innerHTML = '0';
  });
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

function cartItemClickListener(event) {
  // coloque seu código aqui
  const cartArea = document.querySelector('.cart');
  cartArea.addEventListener(event, (e) => {
    const selectedItem = e.target;
    if (selectedItem.className === 'cart__item') {
      const selecItemIT = selectedItem.innerText;
      const price = Number(selecItemIT.substr(selecItemIT.indexOf('$') + 1));
      sumTotalPrices(-(price));
      selectedItem.parentNode.removeChild(selectedItem);
      saveLocalStorage();
    }
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  sumTotalPrices(salePrice);
  return li;
}

function showLoading() {
  
}

function addToCart() {
  const addItemBtn = document.querySelector('.items');
  addItemBtn.addEventListener('click', (event) => {
  const eventClassName = event.target.className;
    if (eventClassName === 'item__add') {
      const itemSelected = event.target.parentNode;
      const acceptableParams = { headers: { Accept: 'application/json' } };
      const skuItem = getSkuFromProductItem(itemSelected);
      fetch(`https://api.mercadolibre.com/items/${skuItem}`, acceptableParams)
      .then((response) => response.json().then((json) => {
        const cartItems = document.querySelector('.cart__items');
        const objectItem = { sku: json.id, name: json.title, salePrice: json.price };
        cartItems.appendChild(createCartItemElement(objectItem));
        saveLocalStorage();
        }))
      .catch((error) => console.log(error));
    }
    });
  }

function getItemsFromML() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  const acceptableParams = { headers: { Accept: 'application/json' } };
  fetch(endpoint, acceptableParams)
    .then((response) => response.json().then((json) => {  
      json.results.forEach((_, index) => {
        const itemsContainer = document.querySelector('.items');
        const objectItem = { 
          sku: json.results[index].id, 
          name: json.results[index].title,
          salePrice: json.results[index].price,
          image: json.results[index].thumbnail,
        };
        itemsContainer.appendChild(createProductItemElement(objectItem));
      });
    }));
}

window.onload = function onload() {
  loadLocalStorage();
  getItemsFromML();
  addToCart();
  cartItemClickListener('click');
  emptyCart();
};
