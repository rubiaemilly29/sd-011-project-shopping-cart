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
  const items = document.querySelector('.items');
  items.appendChild(section);
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function cartItemClickListener(event) {
  // const consultLink = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  // .then((response) => 
  //     response.json()
  //   ).then((data) => 
  //     console.log(data)
  //   )
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchProduct = (product = 'computador') => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
    .then((response) => 
      response.json())
      .then((data) => 
      data.results.forEach((selecProd) => (
        createProductItemElement(selecProd))));
};

window.onload = function onload() { 
  fetchProduct();
};