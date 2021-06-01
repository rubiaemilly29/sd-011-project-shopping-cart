async function getProdutos() {
  const query = 'computador';
 const apiUrl = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
 const data = await apiUrl.json();
 const responseJson = await data.results;
 return responseJson;


function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

async function getID(id) {
  const apiUrl = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const data = await apiUrl.json();
  return data;

  async function renderProdutos() {
    addloading();
    const itemProds = await getProdutos();
    const itemList = document.querySelector('.items');
    itemProds.forEach((item) => { 
    itemList.appendChild(createProductItemElement({ 
      sku: item.id, name: item.title, image: item.thumbnail,
    }));
    });
    removeLoading();

    function addCart() {
      const buttons = document.querySelectorAll('.item__add');
     buttons.forEach((btn) => {
       btn.addEventListener('click', async () => {
        const id = getSkuFromProductItem(btn.parentElement);
        const produto = await getID(id);
        const li = createCartItemElement(
          { sku: produto.id, name: produto.title, salePrice: produto.price },
          );
          const getOl = document.querySelector('ol');
          getOl.appendChild(li);
          totalPrice();
          addLocalStorage();
        });
     });

     function cartItemClickListener(event) {
      // coloque seu código aqui
       event.target.remove('');
       totalPrice();
       addLocalStorage();  

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}


window.onload = function onload() { };