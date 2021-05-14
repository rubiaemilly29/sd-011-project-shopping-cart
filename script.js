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
  const cart = document.querySelector('.cart__items');
  cart.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addItensToShoppingCart() {
  const buttom = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttom.addEventListener('click', (event) => {
    const productId = event.target.parentNode.firstChild.innerText;
    const cartItems = document.querySelector('.cart__items');
  
    fetch(`https://api.mercadolibre.com/items/${productId}`)
    .then((result) => result.json())
    .then((json) => {
      cartItems.appendChild(
        createCartItemElement({ sku: json.id, name: json.title, salePrice: json.price }),
        );
    });
  });

  return buttom;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(addItensToShoppingCart());

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function getMercadoLivreItens() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((json) => {
      json.results.map((itens) => {
        const listItems = { sku: itens.id, name: itens.title, image: itens.thumbnail };
        return listItems;
      }).forEach((products) => {
        document.querySelector('.items')
        .appendChild(createProductItemElement(products));
      });
    });
}

window.onload = function onload() { 
  getMercadoLivreItens();
};
