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

// REQUISITO 2

const fetchToCartItem = async (event) => {
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
      document.querySelector('.cart__items').appendChild(createCartItemElement(cartItem));
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

window.onload = function onload() { 
  setSearch();
  // const btnItem = document.querySelectorAll('.item__add');
  // btnItem.forEach((itemlist) => itemlist.addEventListener('click', fetchToCartItem));
}