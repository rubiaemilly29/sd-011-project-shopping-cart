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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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

} 

function createCartItemElement({ sku: id, name: title, salePrice: price }) {
  const li = document.createElement('li');
  const olCar = document.querySelector('.car_items');
  li.className = 'cartItem';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  
  return li;
}
    const getApi = async () => {
    const request = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
    const resolve = await request.json();
    const resolved = await resolve.results;
    resolved.forEach((item) => {
      const returnValue = createProductItemElement(item);
      const raiseChid = document.querySelector('.items');
      raiseChid.appendChild(returnValue);
    });
  };
  
window.onload = function onload() {
  getApi();
  console.log();
}; 