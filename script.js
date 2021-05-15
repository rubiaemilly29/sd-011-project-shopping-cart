const substituteOlClass = '.cart__items';

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

// function getSkuFromProductItem(item) {
//   // return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event, contador) { // declara pois ao remover um item do carrinho, ele também é removido
  localStorage.removeItem(`item ${contador}`); // função remove item do local storage para remover com o click
  return event.target.remove();
}

// const sumItems = () => {
// const sum = document.querySelector('.total-price');
// const getItemstoSum = document.querySelectorAll('.cart__items');
// }

function createCartItemElement({ id: sku, title: name, price: salePrice }, contador) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event, contador));
  return li;
}

const addproductToCard = () => {
const getOl = document.querySelector(substituteOlClass); // chamando o pai
const buttonAddItems = document.querySelectorAll('.item__add');
buttonAddItems.forEach((eachCarItem) => { // para cada item a ser add no carrinho
  eachCarItem.addEventListener('click', () => {
    const id = eachCarItem.parentElement.firstChild.innerText;
    const contador = getOl.childElementCount; // filhos da Ol add na lista
    fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((data) => getOl.appendChild(createCartItemElement(data, contador)));
    localStorage.setItem(`item ${contador}`, id); // aqui ja esta salvando no local storage com o id
  });
});
};

// para recuperar o Local Storage -requisito 4
const getLocalStorage = () => {
  const getOl = document.querySelector(substituteOlClass); // para limpar o ol
  for (let index = 0; index < localStorage.length; index += 1) {
    const getItemLocal = localStorage.getItem(`item ${index}`); // pega os itens e guarda
    fetch(`https://api.mercadolibre.com/items/${getItemLocal}`)
    .then((response) => response.json())
    .then((data) => getOl.appendChild(createCartItemElement(data, index)));
  }
};
 
const getProduct = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q={computador}')
 .then((response) => response.json())
 .then((data) => data.results // retorna os dados
   .forEach(({ id, title, thumbnail }) => { // acha os termos e associa ao create product - quero buscar no array dos produtos - o que esta no array
   const getSection = document.querySelector('.items'); // invoca a classe items, pois nao existe no escopo da fnção
   const toCreate = createProductItemElement({ sku: id, name: title, image: thumbnail }); // associo as chaves aos valores a serem recebidos la do api
   getSection.appendChild(toCreate);
})).then(() => addproductToCard())
   .then(() => getLocalStorage());
};

window.onload = () => {
getProduct(); // chama a função, assim ela é criada ao iniciar o site
};
