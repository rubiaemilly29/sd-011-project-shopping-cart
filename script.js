function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener() {
  // coloque seu código aqui
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const buscarMl = async (idX) => {
  const data = await fetch(`https://api.mercadolibre.com/items/${idX}`);
  const resultado = await data.json();
  return resultado;
};
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const btn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
    btn.addEventListener('click', async () => {
      const data = await buscarMl(getSkuFromProductItem(btn.parentNode));
      document.querySelector('.cart__items').appendChild(createCartItemElement(data));
    });
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(btn);

  return section;
}

const dataMl = async () => {
  const fetchMLivre = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const cleanJson = fetchMLivre.json();
  return cleanJson;
};
const createHome = async () => {
  const ol = document.querySelector('section.items');
  try {
    const datas = await dataMl();
    await datas.results.forEach(({ id, title, thumbnail }) => {
      const forAppend = createProductItemElement({ sku: id, name: title, image: thumbnail });
      ol.appendChild(forAppend);
    });
  } catch (error) {
    return error;
  }
};

window.onload = function onload() { 
  createHome();
};
