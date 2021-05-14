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

function cartItemClickListener(_event) {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addproductToCard = () => {
const getOl = document.querySelector('.cart__items'); // chamando o pai
const buttonAddItems = document.querySelectorAll('.item__add');
buttonAddItems.forEach((eachCarItem) => {
  eachCarItem.addEventListener('click', () => {
    const id = eachCarItem.parentElement.firstChild.innerText;
    fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((data) => getOl.appendChild(createCartItemElement(data)));
  });
});
};

const getProduct = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q={computador}')
 .then((response) => response.json())
 .then((data) => data.results // retorna os dados
   .forEach(({ id, title, thumbnail }) => { // acha os termos e associa ao create product - quero buscar no array dos produtos - o que esta no array
   const getSection = document.querySelector('.items'); // invoca a classe items, pois nao existe no escopo da fnção
   const toCreate = createProductItemElement({ sku: id, name: title, image: thumbnail }); // associo as chaves aos valores a serem recebidos la do api
   getSection.appendChild(toCreate);
})).then(() => addproductToCard());
};
getProduct();

window.onload = () => {
getProduct(); // chama a função, assim ela é criada ao iniciar o site
};
