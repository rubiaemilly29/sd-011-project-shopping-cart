// cria a imagem dos produtos
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// configura o elemento criado
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// remove o item do carrinho de compras
function cartItemClickListener(event) {
  const eventTg = event.target;
  eventTg.remove();
}

// adiciona o produto ao carrinho de compras
function createCartItemElement({ sku: id, name: title, salePrice: price }) {
  const li = document.createElement('li');
  const cartOl = document.querySelector('.cart__items');

  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);

  cartOl.appendChild(li);
  return li;
}

// cria uma lista de produtos
function createProductItemElement({ sku, name, image, salePrice }) {
  const section = document.createElement('section');
  section.className = 'item';
  const sectionItem = document.querySelector('.items');

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => createCartItemElement({ sku, name, salePrice }));

  sectionItem.appendChild(section);
  return section;
}

// captura o sku
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// const buttonAddToCart = document.getElementsByClassName('item__add');
// console.log(buttonAddToCart);

// buttonAddToCart.forEach((button) => {
//   button.addEventListener('click', (event) => {
//     const getEvent = event.target;
//     console.log(getEvent);
//   //   fetch(`https://api.mercadolibre.com/items/${ItemID}`)
//   //     .them((response) => response.json())
//   //     .then((json) => )
//   })
// });

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((json) => {
      json.results.forEach(({ id, title, thumbnail, price }) => {
        createProductItemElement({ sku: id, name: title, image: thumbnail, salePrice: price });
      });
    })
    .catch((e) => window.alert(e));
};
