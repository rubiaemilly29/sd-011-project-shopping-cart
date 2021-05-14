//iniciando projeto
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const cart = document.querySelector('.cart__items');
  cart.removeChild(event.target);
}

function createCartItemElement(computer) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${computer.sku} | NAME: ${computer.name} | PRICE: $${computer.price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart(computer) {
   const li = createCartItemElement(computer);
   const cart = document.querySelector('.cart__items');
   cart.appendChild(li);
}

function createProductItemElement(computer) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', computer.sky));
  section.appendChild(createCustomElement('span', 'item__title', computer.name));
  section.appendChild(createProductImageElement(computer.image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => addToCart(computer));
  return section;
}

const fetchComputer = async () => {
  const response = await fetch(
    'https://api.mercadolibre.com/sites/MLB/search?q=computador'
  );
  const computers = await response.json();
  computers.results.forEach((computer) => {
    const myComputer = {
      sku: computer.id,
      name: computer.title,
      image: computer.thumbnail,
      price: computer.price,
    };
    document.querySelector('.items').appendChild(createProductItemElement(myComputer));
  });
};

window.onload = () => {
  fetchComputer();
};
