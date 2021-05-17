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
  event.target.remove();
}  

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event));
  return li;
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

const getItens = () => {
const buttonCart = document.querySelectorAll('.item__add');
const itensCart = document.querySelector('.cart__items');
buttonCart.forEach((elemento) => elemento.addEventListener('click', () => {
  const id = elemento.parentElement.firstChild.innerText;
 fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json())
  .then((data) => itensCart.appendChild(createCartItemElement(data)));
  }));
};

const getApiList = () => {
  const param = { method: 'GET', headers: { Accept: 'application/json' } };
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador', param)
      .then((response) => response.json())
      .then((json) => json.results.forEach(({ id, title, thumbnail }) => {
        const productContainer = document.querySelector('.items');
        const productDetails = createProductItemElement({
        sku: id,
        name: title,
        image: thumbnail,
      });
      
      productContainer.appendChild(productDetails);
      })).then(() => getItens());
  };

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const removeAll = () => {
const buttonRemove = document.querySelector('.empty-cart');
  buttonRemove.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
  });
};

const loading = async () => {
const load = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador'); 
await load.json();
document.querySelector('.loading').remove();
};

window.onload = function onload() {
  getApiList();
  removeAll();
  loading();
};
