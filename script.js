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
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener() { // deleção do parâmetro da funçãp
}

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

  async function addItemToCart(e) {
    const sku = getSkuFromProductItem(e.target.parentElement);
    const response = await fetch(`https://api.mercadolibre.com/items/${sku}`);
    const { title, price } = await response.json();
    const cartItemElement = createCartItemElement({ sku, name: title, salePrice: price });
    document.querySelector('.cart__items').appendChild(cartItemElement);
  }
  window.onload = async function onload() {
    const itemsSection = document.querySelector('section .items'); // referenciando a class items no HTML
    const queryName = 'computador'; // termo de busca
    const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${queryName}`); // acessando a API assincronamente através do await e do fetch
    const { results } = await response.json(); // do obj results, espera-se uma resposta no formato json
    results.forEach((product) => { // para cada item obtido do results, execute
      const component = createProductItemElement({ // a constante renomeia os parâmetros do obj de acordo com o requisitado
        sku: product.id, // sendo assim, sku = id
        name: product.title, // name = title
        image: product.thumbnail, // image = thumbnail
      });
      itemsSection.appendChild(component); // component torna-se filho de itemsSection, o qual referencia a class items
    });
    const addButtons = document.querySelectorAll('.item__add'); // código para adicionar produtos ao carrinho através do DOM
    addButtons.forEach((element) => element.addEventListener('click', addItemToCart)); // dispara o evento através de um click para adicionar o item ao carrinho
  };

  // Source: consulta ao repositório do Matheus Gaspar = https://github.com/tryber/sd-011-project-shopping-cart/pull/101/

//   fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${queryName}`) // requisição a API do ML
//     .then((response) => response.json()) // a resposta retorna e é convertida em formato json
//     .then(({ results }) => { // no json o que eu quero acessar é o objeto results
//       results.forEach((product) => { // para cada item retornado do results, execute:
//         console.log(product); // imprime item no console
//         const component = createProductItemElement({ //
//           sku: product.id, // sku = id
//           name: product.title, // name = title
//           image: product.thumbnail, // image = thumbnail
//         });
//         itemsSection.appendChild(component); // utiliza as chaves de component para criar filhos na class items no HTML
//       });
//     });
// };

// Source: consulta ao repositório do Matheus Gaspar = https://github.com/tryber/sd-011-project-shopping-cart/pull/101/