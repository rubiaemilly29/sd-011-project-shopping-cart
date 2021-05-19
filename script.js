
window.onload = function onload() { 

// const fetch = require('node-fetch'); // Isso parece não ser necessário.

async function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

async function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

async function createProductItemElement(sku, name, image) { // Modificado aqui. Parâmetros estavam entre chavez
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(await createCustomElement('span', 'item__sku', sku));
  section.appendChild(await createCustomElement('span', 'item__title', name));
  section.appendChild(await createProductImageElement(image));
  section.appendChild(await createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) { // Pega um nó (parametro) e...  
//   return item.querySelector('span.item__sku').innerText; // ...retorna o texto do elemento (filho entre parenteses)
// } //<< Acho que esse return é passada como dado de pesquisa p/ API do REQUISITO 2

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }



// [Meu CÓDIGO 1 aqui ABAIXO]:>>
function addToCart(aqui) { // Recebe a <section> de class .items
  alert('Entrou na addToCart()'); // TESTE
  console.log("Var de produto recebida baixo:");
  // console.log(aqui.childNodes);
  const btn = aqui.childNodes;
  console.log(btn);

    aqui.addEventListener('click', function (event) { // Ativa escuta de clique em toda a <section> .items
      const clicado = event.target; // Captura o elemento que foi clicado nessa <section>
      if (clicado.className === 'item__add') { // Veririfica se o elemento é um <buttom> de class .item__add  
        const pai = clicado.parentElement; // Se for, captura o <elemento pai> desse botão
        const id = pai.querySelector('.item__sku').innerText; // A partir do <elemento pai> pega o texto do <span> filho, que tem a classe .tem__sku

        console.log('Variavel id:');
        console.log(id);
      alert(`clicou NO item de ID: ${id}`);

      } else {
        alert('clicou FORA do botão :-(');
      }


    });
   
  }// <<:[Meu CÓDIGO 1 aqui ACIMA]


// [Meu CÓDICO 2 aqui ABAIXO]:>>
async function getProductList(productType) { // Criei essa função como PROMISE
  if (productType === 'computador') {
    const param = { headers: { Accept: 'application/json' } };
    return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${productType}`, param) // Obtenção de dados da API
   .then((r) => { 
     r.json()
      .then((resolve) => { // Resposta da APi já transforamda em JSON
        var produto = document.querySelector('.container .items');
        resolve.results.forEach(async (element) => { // Filtra para percorrer apenas o array de objetos que são cada produto.
          const item = await createProductItemElement(element.id, element.title, element.thumbnail);
          produto.appendChild(item);
        }); 
        
        return produto; // TESTANDO.....................RETORNO segundo THEN...

    }) // TESTANDO.....................FIM 2 do segundo THEN...
      .then((proRetorno) => addToCart(proRetorno));  // TESTANDO...................       
    }); // >> Fim do primeiro THEN 
    
    
  }
  throw new Error('Pequisa só com a palavra "computador"');
}
// <<:[Meu CÓDIGO 2 aqui ACIMA]


  // addToCart();
  getProductList('computador');

} // FIM do window.onload
