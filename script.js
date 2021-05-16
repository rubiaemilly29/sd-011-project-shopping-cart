const carItems = '.cart__items';

function somaCarts() {
  let totalPrice = 0;
  const allLi = document.querySelectorAll('.cart__item');
  allLi.forEach((element) => {
    const myElement = element.innerText.split('$');
    totalPrice += Number(myElement[1]);
  });
  const mySpan = document.querySelector('.total-price');
  mySpan.innerHTML = `${totalPrice}`;
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

function cartItemClickListener(event) {
  const myListCartItem = document.querySelector(carItems);
  myListCartItem.removeChild(event.target);
  localStorage.setItem('carList', document.querySelector(carItems).innerHTML);
  somaCarts();
}

function createCartItemElement({ sku, name, price }) {
  const myCart = document.querySelector(carItems);
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  myCart.appendChild(li);

  localStorage.setItem('cartList', document.querySelector('.cart__items').innerHTML);
  somaCarts();
  
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image, price }) {
  const section = document.createElement('section');
  section.className = 'item';

  const myItem = document.querySelector('.items');

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => createCartItemElement({ sku, name, price }));

  myItem.appendChild(section);

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const createFeatch = async () => {
  const myload = document.querySelector('.loading');
  const myCarts = document.querySelector('.cart');
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador"')
  .then((response) => response.json())
  .then((json) => json.results.forEach((element) => createProductItemElement(element)))
  .then(() => myCarts.removeChild(myload));
};

function clearCart() {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    document.querySelector(carItems).innerHTML = '';
    localStorage.removeItem('cartList');
    somaCarts();
  });
}

window.onload = function onload() {
  createFeatch(); // Chamando a Função  
  document.querySelector(carItems).innerHTML = localStorage.getItem('cartList');
  clearCart();
  somaCarts();
 };
