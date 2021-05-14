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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event, contador) {
  const local = event.target;
  local.parentNode.removeChild(local);
  localStorage.removeItem(`item${contador}`);
}

function createCartItemElement({ sku, name, price }) {
  const li = document.createElement('li');
  const cartItems = document.querySelector('.cart__items');
  const contador = cartItems.childElementCount;
  localStorage.setItem(`item${contador}`, `${sku}|${name}|${price}`);
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  li.addEventListener('click', (event) => cartItemClickListener(event, contador));
  cartItems.appendChild(li);
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

// function sumCart() {
//   let sum = 0;
// }

function fetchProducts() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  const conteinerItems = document.querySelector('.items');
  fetch(endpoint) 
  .then((response) => response.json())
  .then((data) => {
    data.results.forEach(({ id, title, thumbnail, price }) => {
  conteinerItems
  .appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail, price }));
    });
  })
  .then(() => {
    for (let index = 0; index < localStorage.length; index += 1) {
      const [sku, name, price] = localStorage.getItem(`item${index}`).split('|');
      const saveObj = { sku, name, price };
      createCartItemElement(saveObj);
    }
  });
}

window.onload = () => {
  fetchProducts();
};