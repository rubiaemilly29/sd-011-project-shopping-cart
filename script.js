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

// Filtra relatório JSON.

const filterJsonData = async () => {
  const rawData = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const json = await rawData.json();
  const resultData = json.results;
  const filteredData = resultData.map((product) => (
    { sku: product.id, name: product.title, image: product.thumbnail }
    ));
  return filteredData;
  };
  filterJsonData();

  function cartItemClickListener(event) {
    document.getElementsByClass('cart__items').removeChild(event.target);
    localStorage.removeItem(event.target);
  }

  function createCartItemElement({ sku, name, salePrice }) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.addEventListener('click', cartItemClickListener);
  
    return li;
  }
  
  function getSkuFromProductItem(item) {
    return item.querySelector('span.item__sku').innerText;
  }

  const addToCart = async (event) => {
    const id = getSkuFromProductItem(event.target.parentElement);
    const file = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const data = await file.json(); console.log(data);
    const filteredData = { sku: data.id, name: data.title, salePrice: data.price };
    document.querySelector('.cart__items').appendChild(createCartItemElement(filteredData));
  };

const displayProductsOnPage = async () => {
  const filteredData = await filterJsonData();
  filteredData.forEach((data) => {
    const newProduct = createProductItemElement(data);
    document.querySelector('.items').appendChild(newProduct);
    const button = newProduct.children[3];
    button.addEventListener('click', addToCart);
  });
};

// const item = document.querySelectorAll('.item');
// for (let i = 0; i < item.length; i += 1) {
//   const itemButton = item[i].children[3];
//   const itemId = item[i].children[1];

const clearButtom = document.createElement('button');
clearButtom.classList.add('empty-cart');

window.onload = function onload() {
  filterJsonData();
  displayProductsOnPage();
  // const linha = document.getElementsByClassName('cart__item');
  // linha.innerText = localStorage.getItem();
};
