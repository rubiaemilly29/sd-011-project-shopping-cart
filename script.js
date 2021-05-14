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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  return event.target.remove();
}
  
  function createCartItemElement({ sku, name, salePrice }) {
    const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = () => {
const buttonAddCart = document.querySelectorAll('.item__add');
const carItensAdd = document.querySelector('.cart__items');
buttonAddCart.forEach((element) => { 
   element.addEventListener('click', () => {
   const id = element.parentNode.firstChild.innerText;   
   fetch(`https://api.mercadolibre.com/items/${id}`)
   .then((response) => response.json())
   .then((jsonBody) => {
     const productItenmDetals = {
       sku: jsonBody.id,
       name: jsonBody.title,
       salePrice: jsonBody.price,
    };
      const productAddCart = createCartItemElement(productItenmDetals);      
     carItensAdd.appendChild(productAddCart);  
});
});
});
};

const fetchItens = () => {
   fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
.then((response) => response.json())
.then((jsonBody) => {
  const productContainer = document.querySelector('.items');
  jsonBody.results.forEach((product) => {
    const productDetails = {
      sku: product.id,
      name: product.title,
      image: product.thumbnail };
    const productElement = createProductItemElement(productDetails);
    productContainer.appendChild(productElement);    
  });
})
.then(() => addToCart());
};

window.onload = function onload() {  
fetchItens();
};