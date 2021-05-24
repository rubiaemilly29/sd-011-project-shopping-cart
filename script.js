const cartList = (document.querySelector('.cart__items'));
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
}

function createCartItemElement({ sku, name, salePrice }) {
 const li = document.createElement('li');
 li.className = 'cart__item';
 li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
 li.addEventListener('click', cartItemClickListener);
 return li;
}

const addToStorage = () => {
  localStorage.setItem('cart', JSON.stringify(cartList.innerHTML));
};

function loadFromLocalStorage() {
  const loadedCart = JSON.parse(localStorage.getItem('cart'));
  cartList.innerHTML = loadedCart;
}

const addToCart = async (event) => {
 const idFromEvent = (event.target.parentElement.firstChild.innerText);
 await fetch(`https://api.mercadolibre.com/items/${idFromEvent}`)
 .then((response) => response.json())
 .then((json) => {
   const newPc = createCartItemElement(
    { sku: json.id, name: json.title, salePrice: json.price },
    );
   cartList.appendChild(newPc);
   addToStorage();
 });
};

function createProductItemElement({ sku, name, image }) {
 const section = document.createElement('section');
 section.className = 'item';
 const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
 section.appendChild(createCustomElement('span', 'item__sku', sku));
 section.appendChild(createCustomElement('span', 'item__title', name));
 section.appendChild(createProductImageElement(image));
 button.addEventListener('click', addToCart);
 section.appendChild(button);
 return section;
}

function getSkuFromProductItem(item) {
 return item.querySelector('span.item__sku').innerText;
}

const computers = () =>
 new Promise((resolve, reject) => {
   fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
     .then((response) => response.json())
     .then((json) => (json.results))
     .then((arrayComputers) => resolve(arrayComputers));
 });

const computersResults = () => 
  new Promise((resolve, reject) => {
   const sectionItems = document.querySelector('.items');
     resolve(computers().then((arrayComputers) => {
       arrayComputers.forEach((computer) => (
         sectionItems.appendChild(createProductItemElement(
           { sku: computer.id, name: computer.title, image: computer.thumbnail },
         ))));
     }));
     reject(Error('Deu erro aqui'));
 });

 const cleanCart = document.querySelector('.empty-cart');
 cleanCart.addEventListener('click', () => {
   cartList.innerHTML = '';
   addToStorage();
 });

 window.onload = function onload() {
  computersResults();
  loadFromLocalStorage();
};
