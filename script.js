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

const cart = '.cart__items';
let totalPrice = 0;

function thePrice() {
  const price = document.querySelector('.total-price');
  price.innerText = totalPrice;
}

// Requisito 3 - Depois de receber o click, o item do carrinho é retirado
function cartItemClickListener(event, price) {
  const clickedItem = event.target;
  totalPrice -= price;
  thePrice();
  clickedItem.remove();
  localStorage.setItem('wishList', document.querySelector(cart).innerHTML);
}

// Requisito 2 - Cria o item no carrinho com o sku, nome e preço
function createCartItemElement({ sku, name, price }) {
  totalPrice += price;
  thePrice();
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  // Requisito 2 - Criação do item no Carrinho
  const shoppingCartItens = document.querySelector(cart);
  shoppingCartItens.appendChild(li);
  // Local Storage - atualização
  localStorage.setItem('wishList', document.querySelector(cart).innerHTML);
  // Requisito 3 - Espera receber o click para tirar da lista do carrinho
  li.addEventListener('click', (event) => cartItemClickListener(event, price));
  return li;
}

// Requisito 2 - Pegar do objeto recebido, os parâmetros de cada um dos itens: SKU, Name, Image e Price serão usados
function createProductItemElement({ id: sku, title: name, thumbnail: image, price }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  // Colocar o AddEventListener para criar o item no carrinho com os atributos pedidos  
    .addEventListener('click', () => createCartItemElement({ sku, name, price }));
    return section;
}

// function getSkuFromProductItem(item) {
//  return item.querySelector('span.item__sku').innerText;
// }

function textLoading() {
  const loading = document.createElement('p');
  loading.className = 'loading';
  loading.innerText = 'Loading...';
  const container = document.querySelector('.container');
  container.appendChild(loading);
}

function removetextLoading() {
  const container = document.querySelector('.container');
  const loading = document.querySelector('.loading');
  container.removeChild(loading);
}

function cleartheShoppingCart() {
  const cleanTheShoppingCart = document.querySelector('.empty-cart');
  cleanTheShoppingCart.addEventListener('click', () => {
    const ShoppingCart = document.querySelector(cart);
    ShoppingCart.innerHTML = '';
    localStorage.removeItem('wishList');
    totalPrice = 0;
    thePrice();
  });
}

function LoadTheStorage() {
  document.querySelector(cart).innerHTML = localStorage.getItem('wishList');
}

const fetchTheAPI = () => (
  new Promise((resolve, reject) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
      .then((response) => {
        response.json()
        .then((data) => {
          const productList = data.results;
          productList.forEach((product) => {
            const sectionItens = document.querySelector('.items');
            sectionItens.appendChild(createProductItemElement(product));
            resolve();
          });
        })
        .catch(() => reject());
      })
      .catch(() => reject());
  })
);

window.onload = function onload() { 
  textLoading();
  LoadTheStorage();
  fetchTheAPI()
    .then(() => {
      removetextLoading();
      cleartheShoppingCart();
      thePrice();
    });
};
