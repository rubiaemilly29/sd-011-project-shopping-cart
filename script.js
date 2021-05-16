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

function cartItemClickListener() {
  this.remove()
};

const randerCartItem = (li) => {
  const cartList = document.querySelector('.cart__items');
  li.addEventListener('click', cartItemClickListener);
  cartList.appendChild(li);
};

// Cria um item da lista do carrinho
function createCartItemElement({ id: sku, title: name, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}


function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const appendToCart = async (event) => {
  const itemID = getSkuFromProductItem(event.target.parentElement);
console.log(itemID);
  const itemToAdd = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  const itemJson = await itemToAdd.json();
  const liToCart = createCartItemElement(itemJson);
  randerCartItem(liToCart);
};

// Cria utilizando as funções anteriores um produto com discrição, imagem e o botão para adiciconar ao carrinho. Tudo em uma sessão e retorna ela
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', appendToCart);

  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);
}

const fetchElement = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador') 
    .then((response) => response.json())
    .then((response) => response.results.forEach((element) => createProductItemElement(element)))
    .catch((err) => window.alert(err));
};

window.onload = function onload() { 
  fetchElement();
};
