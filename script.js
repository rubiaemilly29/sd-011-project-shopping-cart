const substituteOlClass = '.cart__items'; // renomear pois foi citada mais de 3 vezes e o lint reclama

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

// requisito 5
const sumItemsPrices = () => {
const sumPrice = document.querySelector('.total-price');
const getLi = [...document.querySelectorAll('.cart__item')];
const sumList = getLi.reduce((acc, curr) => acc + Number(curr.innerText.split('PRICE: $')[1]), 0); // tudo após o number se tornará numero e ocorrerá a soma
sumPrice.innerText = sumList; // atribui a soma desta no card
};

function cartItemClickListener(event, contador) { // declara pois ao remover um item do carrinho, ele também é removido
  localStorage.removeItem(`item ${contador}`); // função remove item do local storage para remover com o click
  event.target.remove();
    sumItemsPrices(); // mais um evento de click
}

function createCartItemElement({ id: sku, title: name, price: salePrice }, contador) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event, contador));
  return li;
}

// /* fonte: https://github.com/tryber/sd-011-project-jest/pull/49/files */
const addproductToCard = () => {
const getOl = document.querySelector(substituteOlClass); // chamando o pai
const buttonAddItems = document.querySelectorAll('.item__add');
buttonAddItems.forEach((eachCarItem) => { // para cada item a ser add no carrinho
  eachCarItem.addEventListener('click', () => {
    const id = eachCarItem.parentElement.firstChild.innerText;
    const contador = getOl.childElementCount; // filhos da Ol add na lista
    fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((data) => getOl.appendChild(createCartItemElement(data, contador))) // console.log aqui mostra tudo no servidor
    .then(() => sumItemsPrices());
    localStorage.setItem(`item ${contador}`, id); // aqui ja esta salvando no local storage com o id
  });
});
};

// /* fonte: https://github.com/tryber/sd-011-project-jest/pull/49/files e https://github.com/tryber/sd-011-project-shopping-cart/pull/8/files */
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
})).then(() => addproductToCard()) // será carregada os items ao ser carregada a pagina, pois devido ao onload isso nao iria aparecer e daria erro
   .then(() => getLocalStorage());
};
// requisito 6 - criar botao que esvazie a ol inteira
const deleteButton = () => {
const getButton = document.querySelector('.empty-cart');
getButton.addEventListener('click', () => {
  document.querySelector(substituteOlClass).innerHTML = '';
localStorage.clear();
});
};

// requisito 7
const load = async (computador) => {
  const api = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${computador}`); // colocada em string pois irá receber diferentes parâmetros
  const data = await api.json();
  document.querySelector('.loading').remove(); // vai removendo a medida que vai passando
  data.results.forEach((element) => createProductItemElement(element));
};

window.onload = () => {
load();
getProduct(); // chama a função, assim ela é criada ao iniciar o site
deleteButton();
};
