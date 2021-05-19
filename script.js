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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

const itemsSection = document.querySelector('.items');

const handleProduct = (item) => {
  const productData = {
    sku: item.id,
    name: item.title,
    image: item.thumbnail,
    salePrice: item.price,
  };
  return productData;
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchPCs = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((resp) => resp.json())
  .then((resp) => resp.results)
  .then((product) => {
  product
  .map((item) => { 
    const finalProd = handleProduct(item);
    return itemsSection.appendChild(createProductItemElement(finalProd));
    });
  });
};

const fetchId = (id) => {
  let objData;
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((resp) => resp.json())
  .then((object) => { 
    objData = createCartItemElement(handleProduct(object));
    const cartList = document.querySelector('.cart__items');
    cartList.appendChild(objData);
    // console.log(objData);
  });
  return objData;
};

const addToCartBtn = () => {
  itemsSection.addEventListener('click', (event) => {
    const pcId = getSkuFromProductItem(event.target.parentNode);
    const test = fetchId(pcId);
    return test;
  });
};

window.onload = function onload() { 
  fetchPCs();
  addToCartBtn();
};