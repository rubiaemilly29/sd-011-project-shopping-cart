function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

/* const sumPrices = () => {
  const totalPrice = document.querySelector('.total-price');

}; */

/* requisito 3 */

function cartItemClickListener(event, contador) {
  localStorage.removeItem(`item ${contador}`);
  event.target.remove();
}

function createCartItemElement({ sku, name, price }) {
  const li = document.createElement('li');
  const ol = document.querySelector('.cart__items');
  const contador = ol.childElementCount;
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  ol.appendChild(li);
  li.addEventListener('click', (event) => cartItemClickListener(event, contador));
  localStorage.setItem(`item ${contador}`, `${sku}|${name}|${price}`);
}

/* requisito 2 */

function createProductItemElement({ id: sku, title: name, thumbnail: image, price }) {
  const itens = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => createCartItemElement({ sku, name, price }));
  
  itens.appendChild((section));
  return section;
}

/* requisito 1 */
function getProduct(obj = 'computador') {
  return new Promise(() => {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${obj}`)
    .then((response) => response.json())
    .then((produtos) => produtos.results.forEach((produtosSelecionado) => {
      createProductItemElement(produtosSelecionado);
    })).then(() => {
      for (let index = 0; index < localStorage.length; index += 1) {
        const itemLocal = localStorage.getItem(`item ${index}`).split('|');
        const a = {
          sku: itemLocal[0], 
          name: itemLocal[1], 
          price: itemLocal[2],
        };
        createCartItemElement(a);
      }
    });
  });
}

window.onload = function onload() { 
  getProduct();
};