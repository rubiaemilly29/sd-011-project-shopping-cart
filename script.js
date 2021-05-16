const price = async () => {
  let sum = 0;
  document.querySelectorAll('li').forEach((element) => {
    sum += +(element.innerText.match(/(?<=\$)\d+\.?\d+/));
  });
  document.querySelector('.total-price').innerText = `${sum}`;
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

function cartItemClickListener(event) {
  event.target.remove();
  price();
}

function emptyCart() {
  const emptyButton = document.querySelector('.empty-cart');
  const cartItems = document.querySelector('.cart__items');

  emptyButton.addEventListener('click', () => { 
    cartItems.innerHTML = ''; 
    price();
  });  
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(li);
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  price();
  return li;
}

function addCartElement() {
  const itemBtn = document.querySelectorAll('.item__add');
  const itemId = document.querySelectorAll('.item__sku');

  for (let i = 0; i < itemBtn.length; i += 1) {
    itemBtn[i].addEventListener('click', () => {
      const myItem = itemId[i].innerText;
      fetch(`https://api.mercadolibre.com/items/${myItem}`)
        .then((response) => response.json())
        .then((json) => createCartItemElement(json));
    });
  }
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  const items = document.querySelector('.items');
  items.appendChild(section);

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

async function getApiML() {
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((json) => json.results.forEach((r) => (createProductItemElement(r))));
  addCartElement();

  document.querySelector('.loading').remove();
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Função para chamar funções quando a página carregar
window.onload = function onload() {
  getApiML();
  addCartElement();
  emptyCart();
  price();
};