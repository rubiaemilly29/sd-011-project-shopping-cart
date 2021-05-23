const api = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const itemsCart = '.cart__items';

// criar elemento personalizado, com uma classe e conteudo conforme os parametros
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// criar elemento de imagem do produto
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function storage() {
  const cartStorage = document.querySelector(itemsCart);
  localStorage.setItem('shopCart', cartStorage.innerHTML); // A propriedade innerHTML define ou retorna o conteúdo HTML (HTML interno) de um elemento.
}

// https://forum.scriptbrasil.com.br/topic/120049-somar-valores-carrinho/
// 5 Adicionar os preços
function price() {
  const itemCart = document.querySelectorAll('.cart__item');
  let priceSum = 0;
  itemCart.forEach((item) => {
    priceSum += parseFloat(item.innerHTML.split('$')[1]); // A função parseFloat () analisa uma string e retorna um número de ponto flutuante.
  });
  document.querySelector('.total-price').innerText = priceSum;
}

// 3 clique de item do carrinho, remove item do carrinho
function cartItemClickListener(event) {
  // coloque seu código aqui
  const delItem = document.querySelector(itemsCart);
  delItem.removeChild(event.target); // A propriedade do evento de destino retorna o elemento que disparou o evento.
  price();   
}

// 2 criar elemento de item do carrinho a partir da lista
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const cartItems = document.querySelector(itemsCart);
  cartItems.appendChild(li);
  price(); 
  storage();
  return li;
}

// obter sku do item do produto
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;  
}

// 2 adicionar ao carrinho buscar item do carrinho de API
const fetchApiCartItem = (id) => {
  const API_URL = `https://api.mercadolibre.com/items/${id}`;
  const headers = { headers: { Accept: 'application/json' } };

  fetch(API_URL, headers)
    .then((response) => response.json())
    .then((json) => {
      const cartList = document.querySelector(itemsCart);
      cartList.appendChild(createCartItemElement(json));
    });
  price();
};

// criar elemento de item de produto
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'); // adicionar o carrinho
  button.addEventListener('click', ({ target }) => { 
    fetchApiCartItem(getSkuFromProductItem(target.parentElement));
    price();
    storage();
  });

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(button);

  return section;
}

// 1 Buscar api
const fetchApi = () => {
  const headers = { headers: { Accept: 'application/json' } };
  fetch(api, headers)
  .then((response) => response.json())
  .then((json) => {
    // console.log(json.results);
    const resultJson = json.results;
    const mainSection = document.querySelector('.items');
    resultJson.forEach((computer) => {
      mainSection.appendChild(createProductItemElement(computer));
    });
  });  
};

// 6 Limpa o carrinho
function clearListItens() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    localStorage.clear();
    const listClear = document.querySelector(itemsCart);
    while (listClear.firstChild) { // enquanto
      listClear.removeChild(listClear.firstChild);
    }
    price();
  });
}

 window.onload = function onload() { 
  fetchApi();
  if (localStorage.shopCart) {
    document.querySelector(itemsCart).innerHTML = localStorage.getItem('shopCart'); // pra carregar a pagina do local storage
    document.querySelectorAll('.cart__item').forEach((li) => {
      li.addEventListener('click', cartItemClickListener);
    });
  }
  clearListItens();
  price();
  setTimeout(() => {
    document.querySelector('.loading').remove();
  }, 3000);
};