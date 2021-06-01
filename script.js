async function getProducts() {
  const query = 'computador';
 const apiUrl = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
 const data = await apiUrl.json();
 const responseJson = await data.results;
 return responseJson;
}

async function getID(id) {
 const apiUrl = await fetch(`https://api.mercadolibre.com/items/${id}`);
 const data = await apiUrl.json();
 return data;
}

const loading = () => {
  const span = document.createElement('span');
  span.className = 'loading';
  span.innerHTML = 'loading...';
  document.body.appendChild(span);
 };

 const removeLoading = () => {
   document.querySelector('.loading').remove();
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

function createProductItemElement({ sku, name, image }) {
 const section = document.createElement('section');
 section.className = 'item';

 section.appendChild(createCustomElement('span', 'item__sku', sku));
 section.appendChild(createCustomElement('span', 'item__title', name));
 section.appendChild(createProductImageElement(image));
 section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
return section;
}

function getSkuFromProductItem(item) {
 return item.querySelector('span.item__sku').innerText;
} 

// Requisito 1
async function renderProducts() {
  loading();
  const itemProds = await getProducts();
  const itemList = document.querySelector('.items');
  itemProds.forEach((item) => { 
  itemList.appendChild(createProductItemElement({ 
    sku: item.id, name: item.title, image: item.thumbnail,
  }));
  });
  removeLoading();
 }
 
 // Requisito 4
function addLocalStorage() {
  const content = document.querySelector('ol').innerHTML;
  localStorage.setItem('produto', content);
 }
 
// Requisito 5
async function totalPrice() {
 const priceCart = document.querySelectorAll('.cart__item');
 let priceInic = 0;
 await priceCart.forEach((item) => {
   const value = parseFloat(item.innerHTML.split('$')[1]);
   priceInic = value + priceInic;
   console.log(value);
   return Math.round(priceInic.toFixed(2));
 });
 const total = document.querySelector('.total-price');
 total.innerHTML = priceInic;
}

// Requisito 6
function removeItemsFromList() {
  const buttonRemoveItems = document.querySelector('.empty-cart');
  buttonRemoveItems.addEventListener('click', () => {
    document.querySelector('ol').innerHTML = '';
    totalPrice();
  });
 }

// Requisito 3
function cartItemClickListener(event) {
  event.target.remove('');
  totalPrice();
  addLocalStorage();  
}

function createCartItemElement({ sku, name, salePrice }) {
 const li = document.createElement('li');
 li.className = 'cart__item';
 li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
 li.addEventListener('click', cartItemClickListener);
 return li;
}
document.querySelector('ol').innerHTML = localStorage.getItem('produto');

// Requisito 2
function addCart() {
 const buttons = document.querySelectorAll('.item__add');
buttons.forEach((btn) => {
  btn.addEventListener('click', async () => {
   const id = getSkuFromProductItem(btn.parentElement);
   const produto = await getID(id);
   const li = createCartItemElement(
     { sku: produto.id, name: produto.title, salePrice: produto.price },
     );
     const getOl = document.querySelector('ol');
     getOl.appendChild(li);
     totalPrice();
     addLocalStorage();
   });
});
}

window.onload = async function onload() {
  await renderProducts();
 addCart();
 removeItemsFromList();
 totalPrice();
};
;
// Testes locais feitos pelo cypress $(npm bin)/cypress run