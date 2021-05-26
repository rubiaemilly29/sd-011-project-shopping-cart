function createProductImageElement(imageSource) { // Requisito 1 - Cria a tag img dos produtos.
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
// Requisito 1 - Cria as tag span com id, nome e o botão adicionar ao carrinho dos produtos.
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
// Requisito 1 - Cria os componentes HTML referente aos produtos
function createProductItemElement({ id: sku, title: name, thumbnail: image }) { // Plantão do Pablo. Altera parâmetros para receber dados como chegam
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')); // Criação do botão
  return section;
}
// Requisito 2 - retorna o valor do itemID // função original do projeto não utilizada
/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */
/* function removeLocalStorageItem(click) { // Inicia a lógica de remoção no local storage
  const separateItems = JSON.parse(localStorage.getItem('item no carrinho'));
  const index = separateItems.indexOf(click.SKU);
  separateItems.splice(index, 1);
} */

// Requisito 5 - soma do valor total do carrinho
function calculateTotalPrice(valor) {
  const getTotalPrice = document.querySelector('.total-price'); // valor total
  let totalPrice = valor; // valor inicial foi passado como 0 para aparecer na pagina quando não há itens
  const getInfoPrice = document.querySelectorAll('.cart__item'); // lista do carrinho
  getInfoPrice.forEach((item) => {
    const itemPrice = Number(item.innerText.split('$')[1]);
    totalPrice += itemPrice;
  });
    getTotalPrice.innerText = `${totalPrice}`;
}

function cartItemClickListener(event) {
  const clickItem = event.target;
  clickItem.remove();
  calculateTotalPrice(0);
  // removeLocalStorageItem(clickItem.SKU);
}
// Requisito 2 - Cria os componentes HTML referente a um item do carrinho
function createCartItemElement({ id: sku, title: name, price: salePrice }) { // Altera parâmetros para receber dados como chegam
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener); // Inicia a lógica que remove o item do carrinho ao clicar nele
  return li;
}
// Requisito 4 - salvando no local storage
function addLocalStorage() {
  const list = document.querySelector('ol.cart__items').innerHTML;
  const listStorage = JSON.stringify(list); // Plantão do Bernardo, dica para usar: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
  localStorage.setItem('item no carrinho', listStorage);
}

function loadLocalStorage() {
  const cartL = document.querySelector('.cart__items');
  const itensSave = localStorage.getItem('item no carrinho');
  const itemSave = JSON.parse(itensSave);
  cartL.innerHTML = itemSave;
  cartL.addEventListener('click', cartItemClickListener);
}

// Requisito 6 - Botão de limpar o carrinho
function cleanButton() {
  const getCleanButton = document.querySelector('.empty-cart');
  
  getCleanButton.addEventListener('click', () => {
   const items = document.querySelector('ol');
   items.innerHTML = '';
   localStorage.clear();
   calculateTotalPrice(0);
  });
}
// Requisito 7 - texto loading
function loading() {
  const getLoading = document.querySelector('.loading');
  // getLoading.style.display = 'none'; // após carregar a Api a tag com o loading fica escondida
  getLoading.remove(); // HTML DOM method
}
// Requisito 2 - Requisição da API, captura o elemento span com a id, atribui a todos os botões o evento de capturar o span
const addToCart = () => { 
  const getButton = document.querySelectorAll('.item__add');
  const listCart = document.querySelector('ol.cart__items');

  getButton.forEach((button) => {
    button.addEventListener('click', () => { // Quando clicar no item captura o itemID 
    const itemID = button.parentElement.firstChild.innerText; // Referencia: https://developer.mozilla.org/pt-BR/docs/Web/API/Node/parentNode
    fetch(`https://api.mercadolibre.com/items/${itemID}`) // Busca na API pelos valores do itemID clicado
      .then((response) => response.json())
      .then((data) => listCart.appendChild(createCartItemElement(data)))
      .then(() => addLocalStorage())
      .then(() => calculateTotalPrice(0));
    });
  });
};
// Requisito 1 - Requisição da API 
const fetchProduct = () => { 
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => data.results.forEach((computador) => {
        const getItem = document.querySelector('.items');
        getItem.appendChild(createProductItemElement(computador));
      }))
    .then(() => addToCart())
    .then(() => cleanButton())
    .then(() => loading())
    .catch((error) => console.log(error));
};

window.onload = function onload() {
  fetchProduct();
  loadLocalStorage();
  calculateTotalPrice(0);
  cleanButton();
};
