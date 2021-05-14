// function getList() {
//   return new Promise((resolve, reject) =>
//   fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
//   .then((computer) => computer.json())
//   .then((json) => json.results)
//   .then((result) => console.log(result))//resolve(result.forEach((x) => createProductItemElement({sku:[x.id], name:[x.title], image:[x.thumbnail]}))))
//   )
// }

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

  const productsOnScreen = document.querySelector('.items');
  productsOnScreen.appendChild(section);

  return section;
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

function getList() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((computer) => computer.json())
  .then((json) => json.results)
  .then((result) => result.forEach((x) => createProductItemElement(x)));
}

window.onload = function onload() { 
  getList();
};
