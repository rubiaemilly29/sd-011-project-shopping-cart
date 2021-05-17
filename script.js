const cartItems = '.cart__items'; 

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// ITEM 5 

const somePrices = () => {
  const itemsCart = document.querySelectorAll('.cart__item');
  let priceTotal = 0;
  itemsCart.forEach((item) => {
    priceTotal += parseFloat(item.innerText.split('$')[1]);
  });
  const priceWindow = document.querySelector('.total-price');
  priceWindow.innerText = priceTotal;
};

// ITEM 4
const saveData = () => {
  const ol = document.querySelector(cartItems).innerHTML;
  localStorage.setItem('addCart', ol);  
};

// ITEM 3
function cartItemClickListener(event) {
  event.target.remove();
  saveData();
  somePrices();
}

function createCartItemElement({ sku, name, salePrice }) {
const li = document.createElement('li');
li.className = 'cart__item';
li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;  
li.addEventListener('click', cartItemClickListener);
return li;
}

// ITEM 2
const addToCart = () => {
  const carItensAdd = document.querySelector(cartItems);
  const buttonAddCart = document.querySelectorAll('.item__add');
  buttonAddCart.forEach((element) => { 
   element.addEventListener('click', () => {
   const id = element.parentNode.firstChild.innerText;   
   fetch(`https://api.mercadolibre.com/items/${id}`)
   .then((response) => response.json()).then((jsonBody) => {
     const productItenmDetals = { sku: jsonBody.id,
       name: jsonBody.title,
       salePrice: jsonBody.price,
    };
     const productAddCart = createCartItemElement(productItenmDetals);
     carItensAdd.appendChild(productAddCart);
     saveData();
     somePrices();
});
});
});
};

// ITEM 1
const fetchItens = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
.then((response) => response.json())
.then((jsonBody) => {
  const loading = document.querySelector('.loading');
  const items = document.querySelector('.items');
  items.removeChild(loading);
 const productContainer = document.querySelector('.items');
 jsonBody.results.forEach((product) => {
   const productDetails = {
     sku: product.id,
     name: product.title,
     image: product.thumbnail };
   const productElement = createProductItemElement(productDetails);
   productContainer.appendChild(productElement);    
 });
})
.then(() => addToCart());
};

// ITEM 6
const clearList = () => {
  const buttonClear = document.querySelector('.empty-cart');
  buttonClear.addEventListener('click', () => {
    const itemsCart = document.querySelector(cartItems);
    itemsCart.innerHTML = '';
    localStorage.clear();
    somePrices();
  });
};

window.onload = function onload() {  
fetchItens();
if (localStorage.addCart) {
  const dadOl = document.querySelector(cartItems);
  const cartOnload = localStorage.getItem('addCart');
  dadOl.innerHTML = cartOnload;
  const childOl = document.querySelectorAll('.cart__item');
  childOl.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
  somePrices();
}
clearList();
};
