const lintGritando = '.cart__items';

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function storage() {
  const cartStorage = document.querySelector(lintGritando);
  localStorage.setItem('shopCart', cartStorage.innerHTML);
}

function cartItemClickListener(event) {
  const delItem = document.querySelector(lintGritando);
  delItem.removeChild(event.target);
  storage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const cartItems = document.querySelector(lintGritando);
  cartItems.appendChild(li);
  return li;
}

function createProductItemElement({ sku, name, image, salePrice }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => {
      createCartItemElement({ sku, name, salePrice });
      storage();
    });

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// requisito 1 - Você deve criar uma listagem de produtos que devem ser consultados através da API do Mercado Livre.
// const param = { method: 'GET' , headers: { Accept: 'application/json' } };
function getProductList(query) {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach((item) => {
        const itemElement = createProductItemElement({
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
          salePrice: item.price,
        });
        document.querySelector('.items').appendChild(itemElement);
      });
    });
}

// Requisito 6 - Crie um botão para limpar carrinho de compras
function clearListItems() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    localStorage.clear();
    const listChild = document.querySelector('.cart__items');
    while (listChild.firstChild) {
      listChild.removeChild(listChild.firstChild);
    }
  });
}

window.onload = function onload() {
  getProductList('computador');
  if (localStorage.shopCart) {
    document.querySelector(lintGritando).innerHTML = localStorage.getItem('shopCart');
    document.querySelectorAll('.cart__item').forEach((li) => {
      li.addEventListener('click', cartItemClickListener);
    });
  }
  clearListItems();
  // references: https://www.w3schools.com/jsref/met_win_settimeout.asp; https://pt.stackoverflow.com/questions/4605/remover-elemento-da-p%C3%A1gina-com-javascript;
  setTimeout(() => {
    document.querySelector('.loading').remove();
  }, 500);
};

// // Percorrer todas as LIs do carrinho com for each, usar o split com o $, somar a ultima posição do array com parseInt
// <p> innerHTML =  soma da função acima </p>