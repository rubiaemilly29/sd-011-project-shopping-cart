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

function createProductItemElement({ id: sku, title: name, thumbnail: image, price }) {
  const itens = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => {
    // eslint-disable-next-line no-use-before-define
    createCartItemElement({ sku, name, price });
    // eslint-disable-next-line sonarjs/no-duplicate-string
    localStorage.setItem('carrinho', document.querySelector('.cart__items').innerHTML);
  });
  itens.appendChild(section);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // eslint-disable-next-line sonarjs/no-duplicate-string
  const cartItems = document.querySelector('.cart__items');
  cartItems.removeChild(event.target);
  localStorage.setItem('carrinho', cartItems.innerHTML);
}

function createCartItemElement({ sku, name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(li);
  li.addEventListener('click', cartItemClickListener);
  localStorage.setItem('carrinho', cartItems.innerHTML);
  return li;
}

function showItens() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => data.results.forEach((result) => {
      const productItem = createProductItemElement(result);
      const items = document.querySelector('.items');
      items.appendChild(productItem);
    }))
    .catch((error) => console.log(`:( Error ${error}`));
}

const verificaLocalStorage = () => {
  if (localStorage.carrinho) {
    document.querySelector('.cart__items').innerHTML = localStorage.getItem('carrinho');
    const cartItem = document.querySelectorAll('.cart__item');
    cartItem.forEach((element) => {
      element.addEventListener('click', cartItemClickListener);
    });
  }
};

window.onload = function onload() { 
  showItens();
  verificaLocalStorage();
};

console.log(document.querySelector('.cart__items'));
