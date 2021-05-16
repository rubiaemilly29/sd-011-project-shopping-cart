const cartItemsOl = '.cart__items';

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

// Requisito 5: Somar total de todos os itens do carrinho de compras. Essa função será acionada a cada adição ou remoção no carrinho
function countCartTotalPrice() {
  const totalPrice = document.querySelector('.total-price');
  const allListItems = document.querySelectorAll('li');
  let sumPrice = 0;

  allListItems.forEach((item) => {
    const itemPrice = item.innerText.split('$');
    sumPrice += Number(itemPrice[1]);
  });

  totalPrice.innerHTML = sumPrice;
}

// Requisito 4 (parte 1): Salvar o contúdo do carrinho de compras no localstorage. Obs: As partes precisaram ficar separadas porque são utilizadas em momentos diferentes.
function saveCartOnStorage() {
  const cartList = document.querySelector(cartItemsOl).innerHTML;
  localStorage.setItem('savedCart', cartList);  
}

// Requisito 3: Remover o item do carrinho de compras ao clicar nele. A cada remoção o valor total do carrinho precisa ser atualizado.
function cartItemClickListener(event) {
  event.target.remove();
  countCartTotalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getItemByID(id) {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const itemData = await response.json();
  return itemData;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Requisito 2: Adicionar o item clicado ao carrinho de compras. A cada item adicionado é preciso atualizar o localstorage e o valor total do carrinho
async function addItemToCart(event) {
  const cartList = document.querySelector(cartItemsOl);
  const id = await getSkuFromProductItem(event.target.parentElement);
  const item = await getItemByID(id);
  cartList.appendChild(createCartItemElement(item))
  .addEventListener('click', cartItemClickListener);
  saveCartOnStorage();
  countCartTotalPrice();
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', addItemToCart);
  return section;
}

// Requisito 1: Acessar a API do mercado livre e criar a listagem de produtos na página
function render() {
  const itemSection = document.querySelector('section .items');

  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((json) => {
      json.results.forEach((product) => {
        const item = createProductItemElement({
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        });
        itemSection.appendChild(item);
      });
    });
}

// Requisito 4 (parte 2): Carregar o conteúdo do localstorage para a página.
function loadStorageCartToHTML() {
  const storageCart = localStorage.getItem('savedCart');
  const cartList = document.querySelector(cartItemsOl);
  cartList.innerHTML = storageCart;
  cartList.addEventListener('click', cartItemClickListener);
}

// Requisito 6: Adicionar funcionalidade para limpar o carrinho de compras
function clearCart() {
  localStorage.clear();
  loadStorageCartToHTML();
  countCartTotalPrice();
}

const clearCartButton = document.querySelector('.empty-cart');
clearCartButton.addEventListener('click', clearCart);

window.onload = function onload() { 
 render();
 loadStorageCartToHTML();
 countCartTotalPrice();
}; 
