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

function cartItemClickListener(event) {
  const removesTheItemFromTheList = event.target;
  removesTheItemFromTheList.parentNode.removeChild(removesTheItemFromTheList);
}

function createCartItemElement({ sku, name, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
  return li;
}

function createProductItemElement({ sku, name, image, price }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => createCartItemElement({ sku, name, price }));
  return section;
}
function getMercadoLivre() {
  const param = { headers: { Accept: 'application/json' } };
  const promise = fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador', param);
  const sectionItems = document.querySelector('.items');
  promise
    .then((response) => {
      response.json().then((data) => {
        data.results.forEach(({ id, title, thumbnail, price }) => {
          sectionItems.appendChild(createProductItemElement(
            { sku: id, name: title, image: thumbnail, price },
            ));
        });
      });
    });
}
window.onload = function onload() {
  getMercadoLivre();
};