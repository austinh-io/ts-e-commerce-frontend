import {
  baseUrl,
  catalogProducts,
} from '/scripts/utilities/commerceUtilities.js';

('use strict');

const tpl_radioFieldset = document.createElement('template');

const tpl_radioFieldsetCSS = `
<style>
    @import url(${baseUrl}/css/main.css);

    .option-fieldset-container {
      display: flex;
    }

    fieldset.option-fieldset {
      display: flex;
      align-items: center;
      justify-content: start;
      flex-wrap: wrap;

      gap: 0.6rem;

      padding-inline: 0;

      border: 0;
    }

    .option-fieldset {
      margin-right: 2.6rem;
    }

    .option-fieldset:last-child {
      margin-right: 0;
    }

    .option-fieldset input[type='radio'] {
      appearance: none;
      width: 1.4rem;
      height: 1.4rem;
      outline-offset: 1px;
      border-radius: 50%;
      cursor: pointer;
      border: 1px solid var(--color-font);

      transition: all 0.1s ease-out;
    }

    .option-fieldset input[type='radio']:hover {
      outline: 3px solid var(--color-accent, currentColor);
      border: none;
    }

    .option-fieldset input[type='radio']:checked {
      outline: 3px solid var(--color-font, currentColor);
      border: none;
    }

    .option-fieldset input[type='radio']:checked:hover {
      outline: 3px solid var(--color-font, currentColor);
      cursor: default;
      border: none;
    }

    .option-fieldset input[type='radio']#light {
      --radio-color: rgb(223, 232, 238);
    }

    .option-fieldset input[type='radio']#dark {
      --radio-color: rgb(23, 28, 32);
    }
</style>
`;

function createAttributeSelectors(product) {
  let html = '';
  let attributes = {};

  // Gather all unique attributes
  product.options.forEach((option) => {
    option.attributes.forEach((attr) => {
      if (!attributes[attr.name]) {
        attributes[attr.name] = { type: attr.type, values: new Set() };
      }
      attributes[attr.name].values.add(attr.value);
    });
  });

  // Create HTML for each attribute
  for (let name in attributes) {
    if (attributes[name].type == 'radio' && attributes[name].values.size > 1) {
      html += `<fieldset class="option-fieldset"><legend>${name}</legend>`;
      attributes[name].values.forEach((value) => {
        html += `<input type="radio" id="${value}" name="${name}" value="${value}">
                   <label for="${value}" class="hidden">${value}</label>`;
      });
      html += `</fieldset>`;
    }
  }

  return html;
}

tpl_radioFieldset.innerHTML = `
${tpl_radioFieldsetCSS}
<div class="option-fieldset-container">
</div>
`;

class radioFieldset extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const clone = tpl_radioFieldset.content.cloneNode(true);
    shadow.append(clone);

    this.productId = this.getAttribute('productid');
    this.optionFieldsetContainer = this.shadowRoot.querySelector(
      '.option-fieldset-container'
    );
  }

  connectedCallback() {
    let product = catalogProducts.find(
      (product) => product.productId == this.productId
    );
    let html = createAttributeSelectors(product);
    this.optionFieldsetContainer.innerHTML = html;

    let radioButtons = this.shadowRoot.querySelectorAll('input[type="radio"]');

    radioButtons.forEach((radioButton) => {
      radioButton.addEventListener('click', function (event) {
        let attributeSelectedEvent = new CustomEvent('attributeSelected', {
          detail: {
            name: this.name,
            value: this.value,
          },
          bubbles: true,
        });
        this.dispatchEvent(attributeSelectedEvent);
        console.log(this.name);
        console.log(this.value);
      });
    });
  }
}

window.customElements.define('radio-fieldset', radioFieldset);