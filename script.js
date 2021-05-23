window.onload = function onload() {
  const cartItens = document.querySelector('.cart__items');
  const clearButton = document.querySelector('.empty-cart');
  
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
    const object = event.target
    localStorage.removeItem(object.id);
    cartItens.removeChild(object);    
  }
  async function findProducts(key = 'computador') {
    try {
      const queryCompute = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${key}`);
      const json = await queryCompute.json();
      return json.results;
    } catch (error) {
      alert(error);
    }
  }
  function createCartItemElement({ id, title, price }) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
    li.addEventListener('click', cartItemClickListener);
    return li;
  }
  function getSkuFromProductItem(item) {
    return item.querySelector('span.item__sku').innerText;
  }
  async function addToCart(event) {
    const idItem = getSkuFromProductItem(event.path[1]);
    const products = await findProducts();
    const container = products.find((product) => product.id === idItem);
    const itemElement = createCartItemElement(container);
    itemElement.id = cartItens.childNodes.length;
    cartItens.appendChild(itemElement);
    localStorage.setItem(`${itemElement.id}`, itemElement.innerText);
  }
  function createProductItemElement({ id, title, thumbnail }) {
    const section = document.createElement('section');
    section.className = 'item';
    section.appendChild(createCustomElement('span', 'item__sku', id));
    section.appendChild(createCustomElement('span', 'item__title', title));
    section.appendChild(createProductImageElement(thumbnail));
    section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
    section.addEventListener('click', addToCart);
    return section;
  }
  function createsProductContainers() {
    findProducts().then((products) => {
      products.forEach((product) => {
        const itemsSection = document.querySelector('.items');
        itemsSection.appendChild(createProductItemElement(product));
      });
    }).catch((element) => alert(element));
  }
  createsProductContainers();
  function clearCart() {
    localStorage.clear()
    cartItens.innerHTML = '';
  }
  function reloadCart() {  
    for (let index = 0; index < localStorage.length; index += 1) {
    const element = localStorage.key(index);
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = localStorage.getItem(element);
    li.addEventListener('click', cartItemClickListener);
    cartItens.appendChild(li);
    };
  }
  reloadCart();
  clearButton.addEventListener('click', clearCart);
};
