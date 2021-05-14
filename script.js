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

async function apiOnload() {
  const fetchRequisicao = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const json = await fetchRequisicao.json();
  json.results.forEach((result) => {
    const section = createProductItemElement(result);
    const sectionItens = document.querySelector('.items');
    sectionItens.appendChild(section);
  });
} 

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function eventAddCart() {
  const btnItems = document.querySelector('.items');
  btnItems.addEventListener('click', async (event) => {
    if (event.target.className === 'item__add') {
      const ItemID = event.target.parentNode.firstChild.innerText;
        const apiReturn = await fetch(`https://api.mercadolibre.com/items/${ItemID}`);
        const jsonApi = await apiReturn.json();
        const li = createCartItemElement(jsonApi);
        const ol = document.querySelector('.cart__items');
        ol.appendChild(li);
      }
    });
}

window.onload = function onload() {
  apiOnload();
  eventAddCart();
};