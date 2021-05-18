const cart = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');

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

function cartItemClickListener(event, price) {
  cart.removeChild(event.target);
  totalPrice.innerText = parseFloat(Number(totalPrice.innerText) - price);
}

function createCartItemElement({ id: sku, title: name, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  localStorage.setItem(`Produto${cart.childElementCount}`, `${sku}|${name}|${price}`);
  li.addEventListener('click', (event) => cartItemClickListener(event, price));
  totalPrice.innerText = parseFloat(Number(totalPrice.innerText) + price);
  console.log(totalPrice);
  return li;
}

function getProductList() {
  const sectionItems = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((r) => r.json())
    .then((json) => {
      json.results.forEach((result) => {
        sectionItems.appendChild(createProductItemElement(result));
      });
    })
    .then(() => {
      for (let index = 0; index < localStorage.length; index += 1) {
        const [id, title, price] = localStorage.getItem(`Produto${index}`).split('|');
        const resultado = { id, title, price };
        cart.appendChild(createCartItemElement(resultado));
      }
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function addItem(event) {
  if (event.target.className === 'item__add') {
    const itemID = getSkuFromProductItem(event.target.parentNode);
    fetch(`https://api.mercadolibre.com/items/${itemID}`)
      .then((r) => r.json())
      .then((json) => {
      const itemsList = document.querySelector('.cart__items');
      itemsList.appendChild(createCartItemElement(json));
      });
  }
}

window.onload = function onload() {
  getProductList();
  const items = document.querySelector('.items');
  items.addEventListener('click', addItem);
  const botao = document.querySelector('.empty-cart');
  botao.addEventListener('click', () => {
    cart.innerHTML = '';
    totalPrice.innerText = '0';
    localStorage.clear();
  });
};
