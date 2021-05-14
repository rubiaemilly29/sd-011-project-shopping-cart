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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const filterJsonData = async () => {
  const rawData = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const json = await rawData.json();
  const resultData = json.results;
  const filteredData = resultData.map((product) => (
    { sku: product.id, name: product.title, image: product.thumbnail }
    ));
  return filteredData;
  };
  console.log(filterJsonData());

const displayProductsOnPage = async () => {
  const filteredData = await filterJsonData();
  filteredData.forEach((data) => {
    const newProduct = createProductItemElement(data);
    document.querySelector('.items').appendChild(newProduct);
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  document.getElementsByClass('cart__items').removeChild(event.target);
  localStorage.removeItem(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  document.getElementsByClass('cart__items').appendChild(li);

  return li;
}

const item = document.querySelectorAll('.item');
for (let i = 0; i < item.length; i += 1) {
  const itemButton = item[i].children[3];
  const itemId = item[i].children[1];

  itemButton.addEventListener('click', async () => {    
    const file = await fetch(`https://api.mercadolibre.com/items/${getSkuFromProductItem(itemId)}`);
    const itemCartDataJson = await file.json();
    const cartItemData = itemCartDataJson.results.map((data) => (
      { id: data.id, title: data.title, price: data.price }));
    createCartItemElement(cartItemData);
  });
}

const clearButtom = document.createElement('button');
clearButtom.classList.add('empty-cart');

window.onload = function onload() {
  filterJsonData();
  displayProductsOnPage();
  // const linha = document.getElementsByClassName('cart__item');
  // linha.innerText = localStorage.getItem();
};
