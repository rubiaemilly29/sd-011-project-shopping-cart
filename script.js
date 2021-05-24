window.onload = function onload() {
 };
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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const addToCart = (event) => {
  const teste = (document.querySelector('.cart__items'));
  const idFromEvent = (event.target.parentElement.firstChild.innerText);
  fetch(`https://api.mercadolibre.com/items/${idFromEvent}`)
  .then((response) => response.json())
  .then((json) => {
    teste.appendChild(createCartItemElement({ sku: json.id, name: json.title, salePrice: json.price }));
  });
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  button.addEventListener('click', addToCart);
  section.appendChild(button);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
// const arroz = {
//   sku: 'MLB1608473853',
//   name: 'Pc Computador Cpu Core I5 3470 + Ssd 240gb + 8gb Memória Ram',
//   salePrice: 1649.9,
// };


const computers = () =>
  new Promise((resolve, reject) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((response) => response.json())
      .then((json) => (json.results))
      .then((arrayComputers) => resolve(arrayComputers));
  });

const computersResults = () => 
   new Promise((resolve, reject) => {
    const sectionItems = document.querySelector('.items');
      resolve(computers().then((arrayComputers) => {
        arrayComputers.forEach((computer) => (
          sectionItems.appendChild(createProductItemElement(
            { sku: computer.id, name: computer.title, image: computer.thumbnail },
          ))));
      }));
      reject(Error('Deu erro aqui'));
  });
computersResults();
function teste() {
  return (computers().then((arrayComputers) => {
  (arrayComputers.forEach((computer) => createCartItemElement({ sku: computer.id, name: computer.title, salePrice: computer.price })));
}))};

// console.log(computersResults());

// const teste = {
//   sku: 'MLB982351173',
//   name: 'Pc Gamer Intel/ Core I5/ 8gb/ 1tb/ Radeon Rx 550',
//   image:'http://http2.mlstatic.com/D_802175-MLB45626366133_042021-I.jpg',
// };

const teste1 = document.querySelector('.items');

// teste1.appendChild(createProductItemElement(teste));
// console.log(createProductImageElement('http://http2.mlstatic.com/D_802175-MLB45626366133_042021-I.jpg'));
