window.onload = function onload() { };

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

const pageLoading = () => {
  const loading = document.querySelector('.loading');
  loading.innerText = 'loading page...';
};

const pageLoaded = () => {
  const loading = document.querySelector('.loading');
  loading.remove();
};

function cartItemClickListener() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')  
  .then((response) => response.json())
  .then((data) =>
  data.results.forEach((element) => {
    const htmlElement = createProductItemElement({
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    });
    document.querySelector('.items').appendChild(htmlElement);
  }))
  .then(() => setTimeout(() => pageLoaded(), 700));
  pageLoading();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
