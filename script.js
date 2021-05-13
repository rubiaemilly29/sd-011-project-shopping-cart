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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target); // requisito 3
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function localStorageGet() { // requisito 4
  const cart = localStorage.getItem('carrinho');
  document.querySelector('ol').innerHTML = cart;
}

function localStorageSave() {
  localStorage.setItem('carrinho', document.querySelector('.cart__items').innerHTML);
} // requisito 2, o carrinho é a key do localStorageSave, função usada para armazenar os itens no carrinho de compras

function addProduct(event) { // requisito 2
  const product = event.target.parentNode;
  const itemID = getSkuFromProductItem(product);
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then((resolve) => resolve.json())
    .then((data) => {
      const item = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      };
      const itemSelect = document.querySelector('.cart__items');
      itemSelect.appendChild(createCartItemElement(item));
      localStorageSave();
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', addProduct); // requisito 2
  return section;
}

const loading = () => { // req. 7 - criando função loading
  const loadItems = document.querySelector('.loading');
  loadItems.remove(); // remove o texto "Loading..."
};

const productsList = () => { // req.1 - requisição usando fetch
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => {
      loading(); // função loading sendo chamada ao atualizar/ recarregar a página
      data.results.forEach((product) => {
        const object = {
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        };
        document.querySelector('.items').appendChild(createProductItemElement(object));
      });
    });
};

function clearAllItems() { // requisito 6, função auxiliar
  const itemsOl = document.querySelector('ol');
  itemsOl.innerHTML = ''; 
}

function cleanProducts() { // item 6
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => clearAllItems()); // requisito 6
}

window.onload = async () => {
  await productsList();
  localStorageGet();
  cleanProducts();
};