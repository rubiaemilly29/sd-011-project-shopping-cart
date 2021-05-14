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
// REQUISITO 3

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// REQUISITO 4
// Consulta em https://www.blogson.com.br/carrinho-de-compras-com-localstorage-do-html-5/#:~:text=Gravando%20dados&text=Para%20gravar%20dados%20na%20localStorage,posi%C3%A7%C3%A3o%20do%20produto%20no%20carrinho.
const getCartItems = document.querySelector('.cart__items');

const saveCart = () => {
  const cartList = getCartItems.innerHTML;
  localStorage.setItem('savedCart', cartList);
};

const reloadCart = () => {
  const cartList = getCartItems;
  const loadCart = localStorage.getItem('savedCart');
  cartList.innerHTML = loadCart;
};

// REQUISITO 2

const fetchToCartItem = (event) => {
  const id = getSkuFromProductItem(event.target.parentElement);
  console.log(id);
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((json) => {
        const cartItem = {
         sku: json.id,
         name: json.title,
         salePrice: json.price,
        };
      console.log(cartItem);
      getCartItems.appendChild(createCartItemElement(cartItem));
      saveCart();
  });
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', fetchToCartItem);

  return section;
}

// REQUISITO 1
const createProductList = (term) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${term}`)
   .then((response) => response.json()
   .then((json) => {
     json.results.forEach((products) => {
       const itemInfo = {
        sku: products.id,
        name: products.title,
        image: products.thumbnail,
       };
      document.querySelector('.items').appendChild(createProductItemElement(itemInfo));
     });
    }));
};

const setSearch = () => createProductList('computador');

window.onload = function onload() { 
  setSearch();
  reloadCart();
};