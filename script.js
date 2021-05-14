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
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const render = (json) => {
  json.results.forEach((element) => {
    const newObject = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };
    const result = createProductItemElement(newObject);
    const sectionItems = document.querySelector('.items');
    sectionItems.appendChild(result);
  });
};

const getItem = (term) => new Promise((resolve, reject) => {
    // const param = { headers: { Accept: 'application/json' } };
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${term}#json`)
      .then((response) => {
        response.json()
          .then((json) => {
            render(json);
            resolve();
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });

const fecthItems = () => {
  getItem('computador');
};

window.onload = function onload() { 
  fecthItems();
};
