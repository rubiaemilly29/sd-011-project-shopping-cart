
const addToCart = async (event) => {
  const itemID = getSkuFromProductItem(event.target.parentElement);
  const itemToAdd = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  const itemJson = await itemToAdd.json();
  createCartItemElement(itemJson);
  sumProducts();
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const newTag = document.createElement(element);
  newTag.className = className;
  newTag.innerText = innerText;
  return newTag;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', addToCart);
  
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const dataApi = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((json) => {
    document.querySelector('.loading').remove();
    json.results.forEach((element) => createProductItemElement(element));
  })
  .catch((err) => window.alert(err));
};

const somaProd = () => {
  const liItems = [...document.querySelectorAll('li.cart__item')];
  const price = liItems.reduce((acc, li) => Number(li.innerText.split('$')[1]) + acc, 0);
  const totalPrice = Document.querySelector('span.total-price');
  totalPrice.innerText =  price;
};

window.onload = function onload() { 
  dataApi();
  somaProd();
};
