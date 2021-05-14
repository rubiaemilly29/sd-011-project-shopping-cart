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

// cria uma lista de produtos
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const sectionItem = document.querySelector('.items');

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  sectionItem.appendChild(section);
  return section;
}

// captura o sku
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// remove o item do carrinho de compras
function cartItemClickListener(event) {
  // coloque seu código aqui
}

// adiciona o produto ao carrinho de compras
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((response) => response.json())
      .then((json) => {
        json.results.forEach(({ id, title, thumbnail }) => {
          createProductItemElement({ sku: id, name: title, image: thumbnail });
          });
      })
      .catch((e) => window.alert(e));
  };