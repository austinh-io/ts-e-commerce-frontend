import AppDrawer from './components/navigation/AppDrawer';
import { currentTheme } from './utils/themeManager';
import AppBar from './components/navigation/AppBar.ts';
import { SiteNav } from './components/navigation/SiteNav.ts';

export const app = document.createElement('div');
export const appHTML = document.createElement('template');

const navDrawer = new AppDrawer('Navigation');

const cartDrawer = new AppDrawer('Cart');

const appDrawers: { [key: string]: AppDrawer } = {
  navDrawer: navDrawer,
  cartDrawer: cartDrawer,
};

for (const property in appDrawers) {
  app.append(appDrawers[property]);
}

const appBar = new AppBar();
const siteNav = new SiteNav(appDrawers);

appBar.append(siteNav);
app.append(appBar);

appHTML.innerHTML = /* HTML */ `
  <div>
    <example-component></example-component>
    <div class="btn-group">
      <app-button>Home</app-button>
      <button class="btn btn-secondary">
        <div class="btn-content">
          <box-icon
            type="logo"
            name="facebook-square"
            color=${currentTheme.theme.properties[
              '--color-on-secondary'
            ]}></box-icon>
          Facebook
        </div>
      </button>

      <button class="btn btn-tertiary">
        <div class="btn-content">
          <box-icon
            type="solid"
            name="hot"
            color=${currentTheme.theme.properties[
              '--color-on-tertiary'
            ]}></box-icon>
          Lorem Ipsum
        </div>
      </button>

      <button class="btn btn-primary">
        <div class="btn-content">
          <box-icon
            type="solid"
            name="color"
            color=${currentTheme.theme.properties[
              '--color-on-primary'
            ]}></box-icon>
          Lorem Ipsum
        </div>
      </button>
    </div>

    <light-toggle></light-toggle>
  </div>
`;

const buttonToggleCart = document.createElement('button');
buttonToggleCart.classList.add('btn');
buttonToggleCart.classList.add('btn-primary');
buttonToggleCart.addEventListener('click', () => cartDrawer.toggle());
buttonToggleCart.textContent = 'Toggle Cart';

const buttonToggleNav = document.createElement('button');
buttonToggleNav.classList.add('btn');
buttonToggleNav.classList.add('btn-primary');
buttonToggleNav.addEventListener('click', () => navDrawer.toggle());
buttonToggleNav.textContent = 'Toggle Navigation';

app.appendChild(buttonToggleCart);
app.appendChild(buttonToggleNav);

document
  .querySelector('#open-nav')
  ?.addEventListener('click', () => navDrawer.toggle());

document
  .querySelector('#open-cart')
  ?.addEventListener('click', () => cartDrawer.toggle());
