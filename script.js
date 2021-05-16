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

function cartItemClickListener(event, items, count) {
  event.target.remove();
  localStorage.removeItem(`item${count}`);
}

function createCartItemElement({ sku, name, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  const items = document.querySelector('.cart__items');
  localStorage.setItem(`item${items.childElementCount}`, `${sku}|${name}|${price}`);
  const count = items.childElementCount;
  items.appendChild(li);
  li.addEventListener('click', (event) => cartItemClickListener(event, items, count));
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image, price }) {
  const items = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';  
  items.appendChild(section);
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
   .addEventListener('click', () => createCartItemElement({ sku, name, price }));
  items.appendChild(section);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const fetchAPI = (product = 'computador') => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
  .then((response) => response.json())
    .then((data) => data.results.forEach((item) => (
      createProductItemElement(item))))
        // .then(() => addToCart())
          .then(() => {
            for (let index = 0; index < localStorage.length; index += 1) {
              const [sku, name, price] = (localStorage.getItem(`item${index}`).split('|'));
              const obj = { sku, name, price };
              createCartItemElement(obj);
            }
          });
};

window.onload = function onload() { 
  fetchAPI();
};
