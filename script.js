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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = function onload() { // executa função ao abrir página
  const itemsSection = document.querySelector('section .items'); // referenciando a class items no HTML
  const queryName = 'computador'; // termo de busca

  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${queryName}`) // requisição a API do ML
    .then((response) => response.json()) // a resposta retorna e é convertida em formato json
    .then(({ results }) => { // no json o que eu quero acessar é o objeto results
      results.forEach((product) => { // para cada item retornado do results, execute:
        console.log(product); // imprime item no console
        const component = createProductItemElement({ // renomeia os parâmetros da função de acordo com o requisitado
          sku: product.id, // sku = id
          name: product.title, // name = title
          image: product.thumbnail, // image = thumbnail
        });
        itemsSection.appendChild(component); // utiliza as chaves de component para criar filhos na class items no HTML
      });
    });
};

// Source: consulta ao repositório do Matheus Gaspar = https://github.com/tryber/sd-011-project-shopping-cart/pull/101/