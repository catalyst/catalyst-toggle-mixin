import { catalystLabelableMixin } from '../node_modules/@catalyst-elements/catalyst-labelable-mixin/catalyst-labelable-mixin.js';
import { catalystLazyPropertiesMixin } from '../node_modules/@catalyst-elements/catalyst-lazy-properties-mixin/catalyst-lazy-properties-mixin.js';

const mixinId = Symbol('CatalystToggleMixinID');
const inputElement = Symbol('input element');
const tabindexBeforeDisabled = Symbol('tabindex before element was disabled');

/**
 * Key codes.
 *
 * @enum {number}
 */
const KEYCODE = {
  SPACE: 32,
  ENTER: 13
};

/**
 * `<catalyst-toggle-mixin>` is a mix in funcation that retruns a class that extends the given super class.
 * The returned class will be the same as the super class except it will also have toggle functionality.
 *
 * @mixinFunction
 * @polymer
 *
 * @param {Class} MixWith
 *   The class to extend/apply this mixin to.
 * @returns {Class.<CatalystToggle>}
 */
const catalystToggleMixin = MixWith => {
  // Does this class already have this mixin applied?
  if (MixWith[mixinId] === true) {
    return MixWith;
  }

  // Apply the mixin.
  const SuperClass = catalystLazyPropertiesMixin(
    catalystLabelableMixin(MixWith)
  );
  return class CatalystToggle extends SuperClass {
    /**
     * The attributes on this mixin to observe.
     *
     * @public
     * @readonly
     * @returns {Array.<string>}
     *   The attributes this mixin is observing for changes.
     */
    static get observedAttributes() {
      return [
        'checked',
        'pressed',
        'disabled',
        'required',
        'name',
        'value',
        'form'
      ];
    }

    /**
     * States whether or not this element is checked.
     *
     * @public
     * @default false
     * @returns {boolean}
     */
    get checked() {
      return this.hasAttribute('checked');
    }

    /**
     * Setter for `checked`.
     *
     * @public
     * @param {boolean} value
     *   If truthy, `checked` will be set to true, otherwise `checked` will be set to false.
     */
    set checked(value) {
      const isChecked = Boolean(value);
      if (isChecked) {
        this.setAttribute('checked', '');
      } else {
        this.removeAttribute('checked');
      }
    }

    /**
     * States whether or not this element is pressed.
     *
     * @public
     * @default false
     * @returns {boolean}
     */
    get pressed() {
      return this.hasAttribute('pressed');
    }

    /**
     * Setter for `pressed`.
     *
     * @public
     * @param {boolean} value
     *   If truthy, `pressed` will be set to true, otherwise `pressed` will be set to false.
     */
    set pressed(value) {
      const isPressed = Boolean(value);
      if (isPressed) {
        this.setAttribute('pressed', '');
      } else {
        this.removeAttribute('pressed');
      }
    }

    /**
     * States whether or not this element is disabled.
     *
     * @public
     * @default false
     * @returns {boolean}
     */
    get disabled() {
      return this.hasAttribute('disabled');
    }

    /**
     * Setter for `disabled`.
     *
     * @public
     * @param {boolean} value
     *   If truthy, `disabled` will be set to true, otherwise `disabled` will be set to false.
     */
    set disabled(value) {
      const isDisabled = Boolean(value);
      if (isDisabled) {
        this.setAttribute('disabled', '');
      } else {
        this.removeAttribute('disabled');
      }
    }

    /**
     * States whether or not this element is required.
     *
     * @public
     * @default false
     * @returns {boolean}
     */
    get required() {
      return this.hasAttribute('required');
    }

    /**
     * Setter for `required`.
     *
     * @public
     * @param {boolean} value
     *   If truthy, `required` will be set to true, otherwise `required` will be set to false.
     */
    set required(value) {
      const isRequired = Boolean(value);
      if (isRequired) {
        this.setAttribute('required', '');
      } else {
        this.removeAttribute('required');
      }
    }

    /**
     * The name of this element. Used for forms.
     *
     * @public
     * @returns {string}
     */
    get name() {
      if (this.hasAttribute('name')) {
        return this.getAttribute('name');
      }
      return '';
    }

    /**
     * Setter for `name`.
     *
     * @public
     * @param {string} value
     *   The value to set.
     */
    set name(value) {
      this.setAttribute('name', `${value}`);
    }

    /**
     * The form this element is apart of.
     *
     * @public
     * @readonly
     * @returns {HTMLFormElement}
     */
    get form() {
      if (this.inputElement == null) {
        return null;
      }
      return this.inputElement.form;
    }

    /**
     * The value this element has. Used for forms.
     *
     * @public
     * @returns {string}
     */
    get value() {
      if (this.hasAttribute('value')) {
        return this.getAttribute('value');
      }
      return 'on';
    }

    /**
     * Setter for `value`.
     *
     * @public
     * @param {string} value
     *   The value to set.
     */
    set value(value) {
      this.setAttribute('value', `${value}`);
    }

    /**
     * The input element.
     *
     * @public
     * @readonly
     * @returns {HTMLInputElement}
     */
    get inputElement() {
      return this[inputElement];
    }

    /**
     * Setter for `inputElement`.
     *
     * @protected
     * @param {HTMLInputElement} value
     *   The element to set it to.
     */
    set inputElement(value) {
      this[inputElement] = value;
    }

    /**
     * Construct the mixin.
     *
     * @public
     */
    constructor() {
      super();
      this[mixinId] = true;

      // Create the input element.
      this.inputElement = document.createElement('input');
      this.inputElement.type = 'checkbox';
      this.inputElement.style.display = 'none';

      // The input element needs to be in the lightDom to work with form elements.
      this.appendChild(this.inputElement);
    }

    /**
     * Fires when the element is inserted into the DOM.
     *
     * @protected
     */
    connectedCallback() {
      if (typeof super.connectedCallback === 'function') {
        super.connectedCallback();
      }

      // Upgrade the element's properties.
      this.upgradeProperty('checked');
      this.upgradeProperty('pressed');
      this.upgradeProperty('disabled');
      this.upgradeProperty('required');

      // Set the aria attributes.
      this.setAttribute('aria-disabled', this.disabled);
      this.setAttribute('aria-required', this.required);

      // Set this element's role and tab index if they are not already set.
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'checkbox');
        this.setAttribute('aria-checked', this.checked);
      } else if (this.getAttribute('role') === 'button') {
        this.setAttribute('aria-pressed', this.checked);
      }
      if (!this.hasAttribute('tabindex')) {
        this.setAttribute('tabindex', 0);
      }

      // Add the element's event listeners.
      this.addEventListener('keydown', this.onKeyDown);
      this.addEventListener('click', this.onClick);

      // If using ShadyCSS.
      if (window.ShadyCSS != null) {
        // Style the element.
        window.ShadyCSS.styleElement(this);
      }
    }

    /**
     * Fires when the element is removed from the DOM.
     *
     * @protected
     */
    disconnectedCallback() {
      if (typeof super.disconnectedCallback === 'function') {
        super.disconnectedCallback();
      }
      this.removeEventListener('keydown', this.onKeyDown);
      this.removeEventListener('click', this.onClick);
    }

    /**
     * Fired when any of the attributes in the `observedAttributes` array change.
     *
     * @protected
     * @param {string} name
     *   The name of the attribute that changed.
     * @param {*} oldValue
     *   The original value of the attribute that changed.
     * @param {*} newValue
     *   The new value of the attribute that changed.
     */
    attributeChangedCallback(name, oldValue, newValue) {
      if (typeof super.attributeChangedCallback === 'function') {
        super.attributeChangedCallback(name, oldValue, newValue);
      }

      const hasValue = newValue != null;

      switch (name) {
        case 'checked':
        case 'pressed':
          // Set the aria value.
          if (this.getAttribute('role') === 'button') {
            this.setAttribute('aria-pressed', hasValue);
          } else {
            this.setAttribute('aria-checked', hasValue);
          }

          if (hasValue) {
            this.inputElement.setAttribute('checked', '');
          } else {
            this.inputElement.removeAttribute('checked');
          }
          break;

        case 'disabled':
          // Set the aria value.
          this.setAttribute('aria-disabled', hasValue);

          if (hasValue) {
            this.inputElement.setAttribute('disabled', '');

            // If the tab index is set.
            if (this.hasAttribute('tabindex')) {
              this[tabindexBeforeDisabled] = this.getAttribute('tabindex');
              this.removeAttribute('tabindex');
              this.blur();
            }
          } else {
            this.inputElement.removeAttribute('disabled');

            // If the tab index isn't already set and the previous value is known.
            if (
              !this.hasAttribute('tabindex') &&
              this[tabindexBeforeDisabled] != null
            ) {
              this.setAttribute('tabindex', this[tabindexBeforeDisabled]);
              this[tabindexBeforeDisabled] = null;
            }
          }
          break;

        case 'required':
          // Set the aria attribute.
          this.setAttribute('aria-required', hasValue);

          if (hasValue) {
            this.inputElement.setAttribute('required', '');
          } else {
            this.inputElement.removeAttribute('required');
          }
          break;

        case 'name':
          // Update the input element's name.
          this.inputElement.setAttribute('name', `${newValue}`);
          break;

        case 'value':
          // Update the input element's value.
          this.inputElement.setAttribute('value', `${newValue}`);
          break;

        case 'form':
          // Update the input element's form.
          this.inputElement.setAttribute('form', newValue);
          break;

        // Different attribute changed? Do nothing.
        default:
      }
    }

    /**
     * Called when a key is pressed on this element.
     *
     * @protected
     * @param {KeyboardEvent} event
     *   The keyboard event.
     */
    onKeyDown(event) {
      // Don’t handle modifier shortcuts typically used by assistive technology.
      if (event.altKey) {
        return;
      }

      // What key was pressed?
      switch (event.keyCode) {
        case KEYCODE.SPACE:
        case KEYCODE.ENTER:
          event.preventDefault();
          this.toggleChecked();
          break;

        // Any other key press is ignored and passed back to the browser.
        default:
          return;
      }
    }

    /**
     * Called when this element is clicked.
     *
     * @protected
     */
    onClick() {
      this.toggleChecked();
    }

    /**
     * Called when a label of this element is clicked.
     *
     * @protected
     * @override
     */
    onLabelClick() {
      if (this.getAttribute('role') !== 'button') {
        this.toggleChecked();
      }
    }

    /**
     * `_toggleChecked()` calls the either the `checked` or `pressed` setter and flips its state.
     * Because `_toggleChecked()` is only caused by a user action, it will
     * also dispatch a change event.
     *
     * @fires change
     *
     * @protected
     */
    toggleChecked() {
      // Don't do anything if disabled.
      if (this.disabled) {
        return;
      }

      // The detail of the event.
      let detail;

      if (this.getAttribute('role') === 'button') {
        // Change the value of pressed.
        this.pressed = !this.pressed;
        detail = { pressed: this.pressed };
      } else {
        // Change the value of checked.
        this.checked = !this.checked;
        detail = { checked: this.checked };
      }

      /**
       * Fired when the component's `pressed` value changes due to user interaction.
       *
       * @event change
       */
      this.dispatchEvent(
        new CustomEvent('change', {
          detail: detail,
          bubbles: true
        })
      );
    }
  };
};

export { catalystToggleMixin };
