function getTotalPrice() {
  const totalPrice = document.getElementsByClassName('total-price')[0];
  return totalPrice;
}
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
  getTotalPrice().value = (Number(getTotalPrice().value) - Number(event.target.id)).toFixed(2);
  getTotalPrice().innerText = Number(getTotalPrice().value).toString(10);
  document.getElementsByTagName('ol')[0].removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.id = salePrice;
  getTotalPrice().value = (Number(getTotalPrice().value) + Number(salePrice)).toFixed(2);
  getTotalPrice().innerText = Number(getTotalPrice().value).toString(10);
  return li;
}

function appendProductToCart(event) {
  const product = event.target.parentElement;
  fetch(`https://api.mercadolibre.com/items/${getSkuFromProductItem(product)}`)
  .then((response) => response.json())
  .then((data) => {
    document.getElementsByTagName('ol')[0].appendChild(createCartItemElement(
      ({ sku: data.id,
        name: data.title,
        salePrice: data.price }),
    ));
  });
}

function deleteCartItems() {
  while (document.getElementsByTagName('ol')[0].firstChild) {
    document.getElementsByTagName('ol')[0].removeChild(document
      .getElementsByTagName('ol')[0].firstChild);
  }
  getTotalPrice().value = '0.00';
  getTotalPrice().innerText = '0';
}

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => { 
      for (let index = 0; index < data.paging.limit; index += 1) {
        document.getElementsByClassName('items')[0].appendChild(createProductItemElement(
          ({ sku: data.results[index].id,
            name: data.results[index].title,
            image: data.results[index].thumbnail }),
        ));
      }
    });
  document.getElementsByClassName('items')[0].addEventListener('click', appendProductToCart);
  document.getElementsByClassName('empty-cart')[0].addEventListener('click', deleteCartItems);
};
