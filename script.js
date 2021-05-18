// sem este recurso de passar um nome da classe para um const
// devido estar dando erro no lint
const carrinho = document.querySelector('.cart__items');
const valor = '.total-price';
const preco = document.querySelector(valor);

// salva(atualiza) em local storage os itens do carrinho 
function addLocal() {
  localStorage.setItem('cart', carrinho.innerHTML);
}
// usado em createProductItemElement() para gerar um elemento de imagem 
// apartir de um iten da api 
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
// remove um iten do carrinho apartir de um evento de click
function cartItemClickListener(event) {
  // coloque seu código aqui
  (event.target).remove();
  addLocal();
}
// cria um elemento apartir dos itens do parametro
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
// usado para buscar um produto na api do M.livre ,
const buscarMl = async (idX) => {
  const data = await fetch(`https://api.mercadolibre.com/items/${idX}`);
  const resultado = await data.json();
  return resultado;
};
// usado em createProductItemElement() no event do botão para achar os itens do carrinho
// e buscar por eles na api M.L
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
// criando carrinho apartir do localstorage
function createCart() {
  carrinho.innerHTML = localStorage.getItem('cart');
  addLocal();
}  
// usado em createProductItemElement() para gerar os elementos vindos da api
function somaCart(salePrice) {
  preco.innerText = parseFloat(Number(preco.innerText) + salePrice);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  carrinho.appendChild(li).addEventListener('click', () => {
    preco.innerText = parseFloat(Number(preco.innerText) - salePrice);
  });
  somaCart(salePrice);
  return li;
}

function btnClick(data) {
  carrinho.appendChild(createCartItemElement(data));
  addLocal();
  // somaCart(data);
}
// será usado em createhome() para gerar os elemnentos html e add event no botão
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  // criando o btn e acrescentando evento
  const btn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
    btn.addEventListener('click', async () => {
      const data = await buscarMl(getSkuFromProductItem(btn.parentNode));
      btnClick(data);
    });
    // -----------------------------------------------------------
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(btn);

  return section;
}

// busca pelos itens na home(computadores)
const dataMl = async () => {
  const fetchMLivre = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const cleanJson = fetchMLivre.json();
  return cleanJson;
};
// vai pegar os itens vindo da api atraves da função dataMl e criar a home
const createHome = async () => {
  const ol = document.querySelector('section.items');
  try {
    const datas = await dataMl();
    await datas.results.forEach(({ id, title, thumbnail }) => {
      const forAppend = createProductItemElement({ sku: id, name: title, image: thumbnail });
      ol.appendChild(forAppend);     
    });
  } catch (error) {
    return error;
  }
};

function cleanCart() {
  document.querySelector('button.empty-cart').addEventListener('click', () => {
  document.querySelector('section.cart ol').innerText = '';
  document.querySelector('span.total-price').innerText = 0;
  localStorage.removeItem('cart');
  });
}
// quando iniciar 
window.onload = function onload() { 
  createHome();
  createCart();
  cleanCart();
};