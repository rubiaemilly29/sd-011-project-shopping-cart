// Cria uma tag img passando a fonte como parametro
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// Cria uma tag conforme passada no primeiro paraemtro com uma classe no segundo e seu conteudo no terceiro
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// Cria utilizando as funções anteriores um produto com discrição, imagem e o botão para adiciconar ao carrinho. Tudo em uma sessão e retorna ela
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchElement = () => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=computador`) 
    .then((response) => response.json())
    .then((response) => response.results.forEach((element) => createProductItemElement(element)))
}

// "https://api.mercadolibre.com/items/$ItemID"

// const buttonAddItem = document.querySelector('.item__add');
// buttonAddItem.addEventListener('click',)



window.onload = function onload() { 
  fetchElement();
};
