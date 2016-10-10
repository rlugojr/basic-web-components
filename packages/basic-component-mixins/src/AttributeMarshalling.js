import createSymbol from './createSymbol';
import microtask from '../src/microtask';


// Memoized maps of attribute to property names and vice versa.
const attributeToPropertyNames = {};
const propertyNamesToAttributes = {};


// Symbols for private data members on an element.
const safeToSetAttributesSymbol = createSymbol('constructed');


/* Exported function extends a base class with AttributeMarshalling. */
export default (base) => {

  /**
   * Mixin which marshalls attributes to properties and vice versa.
   *
   * If your component exposes a setter for a property, it's generally a good
   * idea to let devs using your component be able to set that property in HTML
   * via an element attribute. You can code that yourself by writing an
   * `attributeChangedCallback`, or you can use this mixin to get a degree of
   * automatic support.
   *
   * This mixin implements an `attributeChangedCallback` that will attempt to
   * convert a change in an element attribute into a call to the corresponding
   * property setter. Attributes typically follow hyphenated names ("foo-bar"),
   * whereas properties typically use camelCase names ("fooBar"). This mixin
   * respects that convention, automatically mapping the hyphenated attribute
   * name to the corresponding camelCase property name.
   *
   * Example: You define a component using this mixin:
   *
   *     class MyElement extends AttributeMarshalling(HTMLElement) {
   *       get fooBar() { return this._fooBar; }
   *       set fooBar(value) { this._fooBar = value; }
   *     }
   *     customElements.define('my-element', MyElement);
   *
   * If someone then instantiates your component in HTML:
   *
   *     <my-element foo-bar="Hello"></my-element>
   *
   * Then, after the element has been upgraded, the `fooBar` setter will
   * automatically be invoked with the initial value "Hello".
   *
   * For the time being, this mixin only supports string-valued properties.
   * If you'd like to convert string attributes to other types (numbers,
   * booleans), you need to implement `attributeChangedCallback` yourself.
   */
  class AttributeMarshalling extends base {

    constructor() {
      super();
      microtask(() => {
        this[safeToSetAttributesSymbol] = true;
      });
    }

    /*
     * Handle a change to the attribute with the given name.
     */
    attributeChangedCallback(attributeName, oldValue, newValue) {
      if (super.attributeChangedCallback) { super.attributeChangedCallback(); }
      let propertyName = attributeToPropertyName(attributeName);
      // If the attribute name corresponds to a property name, set the property.
      // Ignore standard HTMLElement properties handled by the DOM.
      if (propertyName in this && !(propertyName in HTMLElement.prototype)) {
        this[propertyName] = newValue;
      }
    }

    connectedCallback() {
      if (super.connectedCallback) { super.connectedCallback(); }
      this[safeToSetAttributesSymbol] = true;
    }

    static get observedAttributes() {
      return attributesForClass(this);
    }

    /**
     * Set/unset the attribute with the indicated name.
     *
     * This method exists primarily to handle the case where an element wants to
     * set a default property value that should be reflected as an attribute. An
     * important limitation of custom element consturctors is that they cannot
     * set attributes. A call to `reflectAttribute` during the constructor will
     * be safely deferred until after the constructor has completed.
     *
     * @param {string} attributeName - The name of the *attribute* (not property) to set.
     * @param {object} value - The value to set. If null, the attribute will be removed.
     */
    reflectAttribute(attributeName, value) {
      if (this[safeToSetAttributesSymbol]) {
        // Safe to set attributes immediately.
        reflectAttributeToElement(this, attributeName, value);
      } else {
        // Defer setting attributes.
        microtask(() => reflectAttributeToElement(this, attributeName, value));
      }
    }

  }

  return AttributeMarshalling;
};


// Convert hyphenated foo-bar attribute name to camel case fooBar property name.
function attributeToPropertyName(attributeName) {
  let propertyName = attributeToPropertyNames[attributeName];
  if (!propertyName) {
    // Convert and memoize.
    let hypenRegEx = /-([a-z])/g;
    propertyName = attributeName.replace(hypenRegEx,
        match => match[1].toUpperCase());
    attributeToPropertyNames[attributeName] = propertyName;
  }
  return propertyName;
}

function attributesForClass(classFn) {

  // We treat the element base classes as if they have no attributes, since we
  // don't want to receive attributeChangedCallback for them.
  if (classFn === HTMLElement || classFn === Object) {
    return [];
  }

  // Get attributes for parent class.
  let baseClass = Object.getPrototypeOf(classFn.prototype).constructor;
  let baseAttributes = attributesForClass(baseClass);

  // Get attributes for this class.
  let propertyNames = Object.getOwnPropertyNames(classFn.prototype);
  let setterNames = propertyNames.filter(propertyName =>
    typeof Object.getOwnPropertyDescriptor(
        classFn.prototype, propertyName).set === 'function');
  let attributes = setterNames.map(setterName =>
      propertyNameToAttribute(setterName));

  // Merge.
  let diff = attributes.filter(attribute =>
      baseAttributes.indexOf(attribute) < 0);
  return baseAttributes.concat(diff);
}

// Convert a camel case fooBar property name to a hyphenated foo-bar attribute.
function propertyNameToAttribute(propertyName) {
  let attribute = propertyNamesToAttributes[propertyName];
  if (!attribute) {
    // Convert and memoize.
    let uppercaseRegEx = /([A-Z])/g;
    attribute = propertyName.replace(uppercaseRegEx, '-$1').toLowerCase();
  }
  return attribute;
}

// Reflect the attribute with the given element.
// If the attribute is null, remove the attribute.
function reflectAttributeToElement(element, attributeName, value) {
  if (value === null || typeof value === 'undefined') {
    element.removeAttribute(attributeName);
  } else {
    element.setAttribute(attributeName, value);
  }
}
