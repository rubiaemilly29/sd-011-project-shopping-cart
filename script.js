// =======================================================================>
// constantes
const urlcomp = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
const param = { method: 'GET', headers: { Accept: 'application/json' } }; 
const cartList = document.querySelector('.cart__items');
// =======================================================================>
// passado a imagem por parametro cria o elemento img e retorna a imagem com a classe item__image
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
// =======================================================================>
// cria um elemento => passado por parametro o elemento, o nome da classe e o texto interno
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
// =======================================================================>
// cria uma sessão que ira receber os produtos => recebe como parametro o sku (id), name (title) e image (thumbnail) retorna a sessão
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}
// =========================================================================>
// retorna o texto dentro de .item.sku
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
// =========================================================================>

function loading() {
  const load = document.querySelector('.loading');
  if (!load) {
    const item = document.createElement('h5');
    item.innerText = 'loading';
    item.className = 'loading';
    cartList.appendChild(item);
  } else {
    load.remove();
  }
}
// =======================================================================>
// soma os preços dos itens quando o são adicionados , removidos e quando o carrinho é esvaziado
async function sumCartPrices() {
  let price = 0;
  let result = 0;
  let numPrice;
  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach((item) => {
    [, price] = item.innerText.split('$');
    numPrice = Number(price);
    result += numPrice;
  });
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerText = result;
}
// =======================================================================>
// Ao clicar no botao ja criado esvaziar carrinho remove todos os elemento com o forEach da ol cart
function emptyCart() {
  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach((item) => item.remove());
  sumCartPrices();
}
const buttonEmptyCart = document.querySelector('.empty-cart');
buttonEmptyCart.addEventListener('click', emptyCart);

// =======================================================================>
// remove os items do carrino quando clicar em cima deles
function cartItemClickListener(event) {
  event.target.remove();
  sumCartPrices();
}
// =======================================================================>
// cria uma um item da lista onde serão armazenados uma string contendo o sku(id) o nome() e o preço(price) do produto dentro
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// =======================================================================>
// recebe como parametro os produtos recuperados pelo fecth e um foreach na função abaixo getProductList e então usa a função createProductItemElement para criar os produtos buscados faz um descontructuring nos elementos mudando suas chaves para se adequar a chamada da função
function creatItem(item) {
  const itemSection = document.querySelector('.items');
  const result = createProductItemElement({ 
    sku: item.id, 
    name: item.title, 
    image: item.thumbnail,
  });
  itemSection.appendChild(result);
}
// =======================================================================>
// função assincrona que busca os dados do item de uma api pelo parametro passado item
async function fetchItemId(idItem) {
  return fetch(`https://api.mercadolibre.com/items/${idItem}`, param)
    .then((response) => response.json());
}
// =======================================================================>
// função que tem como objetivo colocar o item no carrinho de comprar => recebe como parametro o click do botao da função abaixo 
// -> precisa ser assincrona pois é necessario primiro o carregamento dos itens na pagina para que possa ocorrer o click 
// -> recebe o id da função fetchItemId() recupera e faz um desconstructurig nas propiedades name(title) e salesPrice(price)
// -> por fim faz introduz o elemento usando a função createCartItemElement()usando como parametro os item decuperdados
async function addElementToCart(event) {
  const buttonTarget = event.target;
  const id = buttonTarget.parentNode.firstChild.innerText;
  loading();
  const fetchResult = await fetchItemId(id);
  loading();
  const { title: name, price: salePrice } = fetchResult;
  cartList.appendChild(createCartItemElement({ sku: id, name, salePrice }));
  await sumCartPrices();
}
// função que adiciona um evento ao botao para incluir o item ao carrinho
function clickButtonAddCart() {
  const sectionButton = document.querySelectorAll('.item__add');
  sectionButton.forEach((item) => item.addEventListener('click', addElementToCart));

  // OBS:Apesar de NodeList não ser um Array, é possível ser iterada usando o método forEach(). Muitos navegadores antigos ainda não implementaram este método.
  // usando o querySelectorAll na classe.item__add temos como retorno um node list onde a HOF forEach que somente percorre arrays consegue percorrer a node List
}
// =======================================================================>
// usando a url como e outro parametro escpecificativos essa função busca em uma api os 50 primeiros items de um determinado produto e retorna seus dados.
function getProductList() {
  loading();
  fetch(urlcomp, param)
    .then((response) => response.json())
    .then((data) => data.results.forEach((item) => { 
      creatItem(item);
    }))
    .then(() => clickButtonAddCart())
    .then(() => loading());
}
// =======================================================================>
window.onload = function onload() { 
  getProductList();
};

// REQUISITO 4 -> função que Carregue o carrinho de compras através do **LocalStorage** ao iniciar a página
