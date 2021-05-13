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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getProductsFetch = (url) => new Promise((resolve, reject) => {
  const itemSection = document.querySelector('.items');
  if (url === 'https://api.mercadolibre.com/sites/MLB/search?q=computador') {
  fetch(url)
  .then((data) => data.json())
  .then((data) => data.results.map((result) => {
    const elementItem = createProductItemElement(result);
    return itemSection.appendChild(elementItem);
  }));
  resolve();
}
  reject();
});

const clickFetch = (id) => {  
  const olContainer = document.querySelector('.cart__items');
    fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((data) => data.json())
    .then((data) => {
      const createdLi = createCartItemElement(data);
      olContainer.appendChild(createdLi);    
    });
};

const getIdButtom = () => {
  let textId;
  const buttonSection = document.querySelector('.items');
  buttonSection.addEventListener('click', (buttonEvent) => {  
  if (buttonEvent.target.className === 'item__add') {
    textId = buttonEvent.target.parentElement.firstChild.innerText;
    clickFetch(textId);
  }
});
return textId;
};

window.onload = function onload() {
  getProductsFetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  getIdButtom();
};
