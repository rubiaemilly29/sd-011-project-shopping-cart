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

function cartItemClickListener(event, count) {
  const cart = document.querySelector('.cart__items');
  cart.removeChild(event.target);
  localStorage.removeItem(`${count}`);
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
   cartItemClickListener(event, count));
   localStorage.setItem(`${count}`, computer.id);
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
  return pc;
};

const fetchComputer = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const computers = await response.json();
  computers.results.forEach((computer) => {
    document.querySelector('.items').appendChild(createProductItemElement(computer));
  });
  for (let index = 1; index <= localStorage.length; index += 1) {
    const id = localStorage.getItem(`${index}`);
    const pc = fetchComputerById(id);
    if (pc) addToCart(pc);
  }
};

window.onload = () => {
  fetchComputer();
  const cartSection = document.querySelector('.cart');
  const totalPrice = document.createElement('span');
  totalPrice.className = 'total-price';
  cartSection.appendChild(totalPrice);
};
