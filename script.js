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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event, count, computer, cart) {
  cart.removeChild(event.target);
  localStorage.removeItem(`${count}`);
  const spanTotalPrice = document.querySelector('.total-price');
  spanTotalPrice.innerText = Number(spanTotalPrice.innerText) - computer.price;
}

function createCartItemElement(computer) {
  const li = document.createElement('li');
  const { id, title, price } = computer;
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  return li;
}

function addToCart(computer) {
   const li = createCartItemElement(computer);
   const cart = document.querySelector('.cart__items');
   cart.appendChild(li);
   const count = cart.childElementCount;
   li.addEventListener('click', (event) =>
   cartItemClickListener(event, count, computer, cart));
   localStorage.setItem(`${count}`, computer.id);
   const spanTotalPrice = document.querySelector('.total-price');
   spanTotalPrice.innerText = Number(spanTotalPrice.innerText) + computer.price;
   return li;
}

function createProductItemElement(computer) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', computer.id));
  section.appendChild(createCustomElement('span', 'item__title', computer.title));
  section.appendChild(createProductImageElement(computer.thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => addToCart(computer));
  return section;
}

const fetchComputerById = async (id) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const pc = await response.json();
  if (pc) addToCart(pc);
};

const fetchComputer = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const computers = await response.json();
  computers.results.forEach((computer) => {
    document.querySelector('.items').appendChild(createProductItemElement(computer));
  });
  for (let index = 1; index <= localStorage.length; index += 1) {
    const id = localStorage.getItem(`${index}`);
    fetchComputerById(id);   
  }
};

window.onload = () => {
  fetchComputer();
  const clear = document.querySelector('.empty-cart');
  clear.addEventListener('click', () => {
    const list = document.querySelector('.cart__items');
    list.innerText = '';
    localStorage.clear();
  });
};
