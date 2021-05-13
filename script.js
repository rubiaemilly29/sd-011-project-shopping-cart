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

function cartItemClickListener(event, cartItems, count, price) {
  // coloque seu código aqui
  localStorage.removeItem(`product${count}`);
  cartItems.removeChild(event.target);
  const total = document.querySelector('.total-price');
  total.innerText = Number((Number(total.innerText) - Number(price)));
}

function createCartItemElement({ sku, name, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  const cartItems = document.querySelector('.cart__items');
  localStorage.setItem(`product${cartItems.childElementCount}`, `${sku}|${name}|${price}`);
  const count = cartItems.childElementCount;
  const total = document.querySelector('.total-price');
  cartItems.appendChild(li);
  li.addEventListener('click', (event) => 
  cartItemClickListener(event, cartItems, count, price));
  total.innerText = Number((Number(total.innerText) + Number(price)));
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image, price }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add',
   'Adicionar ao carrinho!')).addEventListener('click', 
   () => createCartItemElement({ sku, name, price })); 
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);
  return section;
}

const getProduct = (term) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${term}`)
    .then((response) => response.json())
    .then((response) => response.results.forEach((computer) => createProductItemElement(computer)))
    .then(() => {
      for (let index = 0; index < localStorage.length; index += 1) {
        const [sku, name, price] = (localStorage.getItem(`product${index}`).split('|'));
        const objProduct = { sku, name, price };
        createCartItemElement(objProduct);
    }
  });
};

const fetchProduct = () => {
  getProduct('computador');
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = function onload() { 
  fetchProduct();

  const button = document.getElementsByClassName('empty-cart')[0];
  button.addEventListener('click', () => {
    const cartItems = document.querySelector('.cart__items');
    cartItems.innerHTML = '';
    const total = document.querySelector('.total-price');
    total.innerText = 0;
    localStorage.clear();
  });
};
