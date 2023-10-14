'use strict';

// const checkoutCartList = document.querySelector('.checkout-cart-items');
const checkoutButton = document.querySelector('.btn-checkout');
const productsList = document.querySelector('.products-list');
const cartItemsList = document.querySelector('.cart-items-container');
const cartIconCounters = document.getElementsByClassName('cart-icon-counter');
const totalCostValueElement = document.querySelector('.total-cost-value');
const catalogProductsButtons = document.getElementsByClassName(
  'button-product button-add'
);

let cartItems = new Array();
let addToCartButtons = new Array();
let products = new Array();

const baseUrlLive = 'simple-ecommerce';
const baseUrlLocal = '.';
const baseUrl = baseUrlLocal;

const catalogItemButtonText_Enabled = 'Add to Cart';
const catalogItemButtonText_Disabled = 'Item in Cart';

function cartItem(id, productId, option, count, totalPrice, title) {
  this.id = id;
  this.productId = productId;
  this.option = option;
  this.count = count;
  this.totalPrice = totalPrice;
  this.title = title;
}

function cardOptionField(product, option) {
  let inputBackground = '';
  if (option.optionVisual.type == 'color') {
    inputBackground = `background-color: ${option.optionVisual.value};`;
  } else if (option.optionVisual.type == 'image') {
    inputBackground = `background-image: url(${baseUrl}/assets/images/productImages/${option.optionVisual.value}.jpg);`;
  }

  return `
  <div>
    <input
      type="radio"
      id="option-${product.productId}-${option.optionId}"
      name="options-item-${product.productId}"
      value="option-${option.optionId}"
      data-productId="${product.productId}"
      data-optionid="${option.optionId}"
      onChange="handleProductOptionChange(event)"
      ${product.options.indexOf(option) == 0 ? 'checked' : ''}
      style="
        ${inputBackground};
      "
    />
    <label
      for="option-${product.productId}-${option.optionId}"
      class="hidden"
      >${option.optionLabel}</label
    >
  </div>
  `;
}

function getOptionStyleSizes(product, option) {
  let optionStyleSizes = [];

  for (let options of product.options) {
    if (
      options.optionVisual.value == option.optionVisual.value &&
      options.optionVisual.value == option.optionVisual.value
    ) {
      optionStyleSizes.push(options);
    }
  }
  return optionStyleSizes;
}

function cardOptionSelection(option) {
  return `
  <option value="${option.optionSize}" data-optionId=${option.optionId}>${option.optionSize}</option>
  `;
}

function cardOptionSelectionGroup(product, option) {
  let optionSelections = '';
  const optionStyleSizes = getOptionStyleSizes(product, option);
  for (let optionSize of optionStyleSizes) {
    optionSelections += cardOptionSelection(optionSize);
  }

  if (optionStyleSizes.length <= 1) {
    return '';
  } else
    return `
  <label for="product-size-select-${product.productId}" class="hidden">Size</label>

  <select
    class="product-size-selection"
    name="sizes"
    id="product-size-select-${product.productId}"
    data-productId=${product.productId}
    onChange="handleProductOptionChange(event)"
  >
    ${optionSelections}
  </select>
  `;
}

function getUniqueOptionStyles(product) {
  let uniqueOptionsByStyle = [];

  product.options.filter((option) => {
    if (
      uniqueOptionsByStyle.find((element) => {
        return (
          option.optionVisual.type == element.optionVisual.type &&
          option.optionVisual.value == element.optionVisual.value
        );
      })
    ) {
      return option;
    } else {
      uniqueOptionsByStyle.push(option);
    }
  });

  return uniqueOptionsByStyle;
}

function getProductFieldset(productOptions, product) {
  let cardOptionsFieldset = undefined;

  if (productOptions.length <= 1) {
    cardOptionsFieldset = '';
  } else {
    let cardProductOptions = '';

    for (let option of productOptions) {
      cardProductOptions += cardOptionField(product, option);
    }

    cardOptionsFieldset = `
    <fieldset class="product-fieldset">
      <legend class="hidden">Variant</legend>

      ${cardProductOptions}

    </fieldset>
    `;
  }

  return cardOptionsFieldset;
}

const productCardTemplate = function (product) {
  let cardOptionsSelections = cardOptionSelectionGroup(
    product,
    product.options[0]
  );
  let uniqueOptionsByStyle = getUniqueOptionStyles(product);
  let cardOptionsFieldset = getProductFieldset(uniqueOptionsByStyle, product);

  return `
  <div class="product" id="product-${product.productId}" data-productId=${
    product.productId
  }>
    <div
      class="product-image-container"
      style="
      background-image: url(${baseUrl}/assets/images/productImages/smaller_alt/${
    product.options[0].imageName
  }_smaller_alt.jpg);"
      >
        <img
        loading="lazy"
        class="product-image"
        src="${baseUrl}/assets/images/productImages/small/${
    product.options[0].imageName
  }_small.webp"
        />
    </div>
    <div class="product-info-container">
        <div class="product-brand">${product.brand}</div>
        <div class="product-title">${product.title}</div>
        <div class="product-description">
          <p>
            ${product.description}
          </p>          
        </div>

        ${cardOptionsFieldset}
        ${cardOptionsSelections}


        <div class="product-price">
          <span class="product-price-value">${formatCurrency(
            product.options[0].price
          )}</span>
        </div>

        <div class="product-button-group" data-productId=${
          product.productId
        } data-optionid=${product.options[0].optionId}>
          <button
            class="button-product button-add"
            id="button-product-${
              product.productId + product.options[0].optionId
            }"
            onclick="addToCart(event); openCartMenu()"
          >
            ${catalogItemButtonText_Enabled}
          </button>
      </div>
    </div>
  </div>
`;
};

const cartItemTemplate = function (item) {
  return `
        <div
          class="cart-item-container"
          data-productId="${item.productId}"
          data-optionid="${item.option.optionId}"
          id="cart-item-${item.productId + item.option.optionId}"
        >
          <div class="cart-item-col1">
            <img
              src="/assets/images/productImages/small/${
                item.option.imageName
              }_small.webp/"
              class="cart-item-image"
            />
          </div>
          <div class="cart-item-col2">
            <div class="cart-item-title">${item.title}</div>
            <div class="cart-item-option-label">Style: ${
              item.option.optionStyle
            }</div>
            <div class="cart-item-option-label">Size: ${
              item.option.optionSize
            }</div>

            <div
              class="cart-item-buttons-container"
            >
              <button
                class="button-cart button-add"
                onclick="addToCart(event)"
                data-productId="${item.productId}"
                data-optionid="${item.option.optionId}"
              >
              <span class="material-symbols-outlined button-cart-icon">
              add
              </span>
              </button>

              <div class="cart-item-count">${item.count}</div>

              <button
                class="button-cart button-subtract"
                onclick="subtractFromCart(event)"
                data-productId="${item.productId}"
                data-optionid="${item.option.optionId}"
              >
              <span class="material-symbols-outlined button-cart-icon">
              remove
              </span>
              </button>
            </div>
          </div>
          <div class="cart-item-col3">
            <button
              class="button-cart button-remove"
              data-productId="${item.productId}"
              data-optionid="${item.option.optionId}"
              onclick="removeFromCart(event)"
            >
              <span class="material-symbols-outlined"> delete </span>
            </button>

            <div class="cart-item-price">
              <span>${formatCurrency(item.totalPrice)}</span>
            </div>
          </div>
        </div>
  `;
};

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

function findItem(_itemList, _productId, _optionId) {
  return _itemList.find((item) => {
    if (item.productId == _productId && item.option.optionId == _optionId)
      return item;
  });
}

function addToCart(event) {
  let eventTarget = event.target.parentElement;

  let productId = eventTarget.dataset.productid;

  let productOptionId = eventTarget.dataset.optionid;

  let targetProduct = products.find(
    (product) => product.productId == productId
  );

  let productOptionToAdd = targetProduct.options.find(
    (productOption) => productOption.optionId == productOptionId
  );

  let cartItemToAdd = findItem(cartItems, productId, productOptionId);

  if (cartItemToAdd) {
    cartItemToAdd.count += 1;
    cartItemToAdd.totalPrice = cartItemToAdd.count * cartItemToAdd.option.price;
    updateCartItem(cartItemToAdd);
  } else {
    const newItem = new cartItem(
      productId + productOptionId,
      productId,
      productOptionToAdd,
      1,
      productOptionToAdd.price,
      targetProduct.title
    );
    cartItems.push(newItem);
    addCartItem(newItem);
  }

  updateUi();
}

function subtractFromCart(event) {
  const productId = event.target.parentElement.dataset.productid;
  const optionId = event.target.parentElement.dataset.optionid;

  let itemToRemove = findItem(cartItems, productId, optionId);

  if (itemToRemove) {
    if (itemToRemove.count > 1) {
      itemToRemove.count -= 1;
      itemToRemove.totalPrice = itemToRemove.count * itemToRemove.option.price;
      updateCartItem(itemToRemove);
    } else {
      removeFromCart(itemToRemove);
    }
  }

  updateUi(); //Note: this function can be redundant since it is also called in removeFromCart() sometimes.
  //If updateUi() begins to affect performance, then I should find a way to only call this only once as opposed to twice
  //Or only update the UI elements that are necessary
}

function removeFromCart(event) {
  if (event.target) {
    const targetProductId = event.target.parentElement.dataset.productid;
    const targetOptionId = event.target.parentElement.dataset.optionid;

    clearCartItem(targetProductId, targetOptionId);

    let targetItem = findItem(cartItems, targetProductId, targetOptionId);
    cartItems.splice(cartItems.indexOf(targetItem), 1);
  } else {
    clearCartItem(event.productId, event.option.optionId);
    cartItems.splice(cartItems.indexOf(event), 1);
  }

  updateUi();
}

function handleProductOptionChange(event) {
  let productId = event.target.dataset.productid;
  let productOptionId = event.target.dataset.optionid;
  if (!productOptionId) {
    productOptionId =
      event.target.options[event.target.selectedIndex].dataset.optionid;
  }

  let targetProduct = products.find(
    (product) => product.productId == productId
  );

  let targetProductOption = targetProduct.options.find(
    (productOption) => productOption.optionId == productOptionId
  );

  const targetElement = document.getElementById(
    `product-${event.target.dataset.productid}`
  );

  const imageContainer = targetElement.querySelector(
    '.product-image-container'
  );
  const image = targetElement.querySelector('.product-image');
  const price = targetElement.querySelector('.product-price-value');
  const targetButtonGroup = targetElement.querySelector(
    '.product-button-group'
  );
  const targetButton = targetButtonGroup.children[0];
  const targetSizeSelections = targetElement.querySelector(
    `#product-size-select-${productId}`
  );

  image.src = `${baseUrl}/assets/images/productImages/small/${targetProductOption.imageName}_small.webp `;
  price.innerText = formatCurrency(targetProductOption.price);
  targetButtonGroup.dataset.optionid = productOptionId;
  targetButton.dataset.productid = productId;
  targetButton.dataset.optionid = productOptionId;
  imageContainer.style = `background-image: url(${baseUrl}/assets/images/productImages/smaller_alt/${targetProductOption.imageName}_smaller_alt.jpg);`;

  let cardOptionsSelections = cardOptionSelectionGroup(
    targetProduct,
    targetProductOption
  );

  if (
    !(event.target.classList[0] == 'product-size-selection') &&
    cardOptionsSelections
  ) {
    targetSizeSelections.innerHTML = cardOptionsSelections;
  }

  updateUi();
}

function updateCatalogItemsCartButtons() {
  for (let i = 0; i < catalogProductsButtons.length; i++) {
    if (
      findItem(
        cartItems,
        catalogProductsButtons[i].parentElement.dataset.productid,
        catalogProductsButtons[i].parentElement.dataset.optionid
      )
    ) {
      catalogProductsButtons[i].disabled = true;
      catalogProductsButtons[i].innerText = catalogItemButtonText_Disabled;
    } else {
      catalogProductsButtons[i].disabled = false;
      catalogProductsButtons[i].innerText = catalogItemButtonText_Enabled;
    }
  }
}

function updateUi() {
  updateCartItemsCount();
  updateCartSubtotal();
  updateCatalogItemsCartButtons();
  setCartLocalStorage();
}

function updateCartItemsCount() {
  let totalItems = cartItems.reduce((sum, cur) => sum + cur.count, 0);

  for (let i = 0; i < cartIconCounters.length; i++) {
    cartIconCounters[i].innerText = totalItems;
  }

  if (cartItems.length > 0) {
    for (let i = 0; i < cartIconCounters.length; i++) {
      cartIconCounters[i].classList.remove('hidden');
    }
  } else {
    for (let i = 0; i < cartIconCounters.length; i++) {
      cartIconCounters[i].classList.add('hidden');
    }
  }
}

function updateCartSubtotal() {
  let totalCost = cartItems.reduce((sum, cur) => sum + cur.totalPrice, 0);
  totalCostValueElement.innerText = formatCurrency(totalCost);
}

function updateCartItem(cartItem) {
  let cartItemElement = document.getElementById(
    `cart-item-${cartItem.productId + cartItem.option.optionId}`
  );
  cartItemElement.querySelector('.cart-item-count').innerText = cartItem.count;
}

function addCartItem(cartItem) {
  cartItemsList.insertAdjacentHTML('afterbegin', cartItemTemplate(cartItem));
}

function clearCartItem(productId, optionId) {
  let targetCartItem = document.getElementById(
    `cart-item-${productId + optionId}`
  );
  cartItemsList.removeChild(targetCartItem);
}

function clearCartList() {
  while (cartItemsList.firstChild) {
    cartItemsList.removeChild(cartItemsList.lastChild);
  }
}

function setCartLocalStorage() {
  localStorage.setItem('localCart', JSON.stringify(cartItems));
  // let i = localStorage.getItem('localCart');
  // console.log(JSON.parse(i));
}

function getCartLocalStorage() {
  let localCartItems = localStorage.getItem('localCart');
  cartItems = JSON.parse(localCartItems);
  updateUi();
  fillCartList();
}

function fillCartList() {
  cartItems.forEach((cartListItem) => {
    cartItemsList.insertAdjacentHTML(
      'afterbegin',
      cartItemTemplate(cartListItem)
    );
  });
}

async function catchProductList() {
  const response = await fetch(`${baseUrl}/data/products.json`);
  const productsObj = await response.json();
  products = [...productsObj];
}

async function initializeProducts() {
  await catchProductList();

  if (productsList) {
    for (const productObject of products) {
      productsList.insertAdjacentHTML(
        'beforeend',
        productCardTemplate(productObject)
      );
    }
  }

  cartItems.forEach((cartListItem) => {
    checkoutCartList.insertAdjacentHTML(
      'afterbegin',
      cartItemTemplate(cartListItem)
    );
  });
}

async function initializePage() {
  await initializeProducts();
  getCartLocalStorage();
}

document.addEventListener('DOMContentLoaded', initializePage);
