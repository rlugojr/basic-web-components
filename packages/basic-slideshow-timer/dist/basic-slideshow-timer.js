(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _safeAttributes = require('./safeAttributes');

var _safeAttributes2 = _interopRequireDefault(_safeAttributes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Memoized maps of attribute to property names and vice versa.
var attributeToPropertyNames = {};
var propertyNamesToAttributes = {};

/* Exported function extends a base class with AttributeMarshalling. */

exports.default = function (base) {

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
  var AttributeMarshalling = function (_base) {
    _inherits(AttributeMarshalling, _base);

    function AttributeMarshalling() {
      _classCallCheck(this, AttributeMarshalling);

      return _possibleConstructorReturn(this, (AttributeMarshalling.__proto__ || Object.getPrototypeOf(AttributeMarshalling)).apply(this, arguments));
    }

    _createClass(AttributeMarshalling, [{
      key: 'attributeChangedCallback',


      /*
       * Handle a change to the attribute with the given name.
       */
      value: function attributeChangedCallback(attributeName, oldValue, newValue) {
        if (_get(AttributeMarshalling.prototype.__proto__ || Object.getPrototypeOf(AttributeMarshalling.prototype), 'attributeChangedCallback', this)) {
          _get(AttributeMarshalling.prototype.__proto__ || Object.getPrototypeOf(AttributeMarshalling.prototype), 'attributeChangedCallback', this).call(this);
        }
        var propertyName = attributeToPropertyName(attributeName);
        // If the attribute name corresponds to a property name, set the property.
        // Ignore standard HTMLElement properties handled by the DOM.
        if (propertyName in this && !(propertyName in HTMLElement.prototype)) {
          this[propertyName] = newValue;
        }
      }
    }, {
      key: 'connectedCallback',
      value: function connectedCallback() {
        if (_get(AttributeMarshalling.prototype.__proto__ || Object.getPrototypeOf(AttributeMarshalling.prototype), 'connectedCallback', this)) {
          _get(AttributeMarshalling.prototype.__proto__ || Object.getPrototypeOf(AttributeMarshalling.prototype), 'connectedCallback', this).call(this);
        }
        _safeAttributes2.default.connected(this);
      }
    }, {
      key: 'reflectAttribute',


      /**
       * Set/unset the attribute with the indicated name.
       *
       * This method exists primarily to handle the case where an element wants to
       * set a default property value that should be reflected as an attribute. An
       * important limitation of custom element consturctors is that they cannot
       * set attributes. A call to `reflectAttribute` during the constructor will
       * be deferred until the element is connected to the document.
       *
       * @param {string} attribute - The name of the *attribute* (not property) to set.
       * @param {object} value - The value to set. If null, the attribute will be removed.
       */
      value: function reflectAttribute(attribute, value) {
        return _safeAttributes2.default.setAttribute(this, attribute, value);
      }

      /**
       * Set/unset the class with the indicated name.
       *
       * This method exists primarily to handle the case where an element wants to
       * set a default property value that should be reflected as as class. An
       * important limitation of custom element consturctors is that they cannot
       * set attributes, including the `class` attribute. A call to
       * `reflectClass` during the constructor will be deferred until the element
       * is connected to the document.
       *
       * @param {string} className - The name of the class to set.
       * @param {object} value - True to set the class, false to remove it.
       */

    }, {
      key: 'reflectClass',
      value: function reflectClass(className, value) {
        return _safeAttributes2.default.toggleClass(this, className, value);
      }
    }], [{
      key: 'observedAttributes',
      get: function get() {
        return attributesForClass(this);
      }
    }]);

    return AttributeMarshalling;
  }(base);

  return AttributeMarshalling;
};

// Convert hyphenated foo-bar attribute name to camel case fooBar property name.


function attributeToPropertyName(attributeName) {
  var propertyName = attributeToPropertyNames[attributeName];
  if (!propertyName) {
    // Convert and memoize.
    var hypenRegEx = /-([a-z])/g;
    propertyName = attributeName.replace(hypenRegEx, function (match) {
      return match[1].toUpperCase();
    });
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
  var baseClass = Object.getPrototypeOf(classFn.prototype).constructor;
  var baseAttributes = attributesForClass(baseClass);

  // Get attributes for this class.
  var propertyNames = Object.getOwnPropertyNames(classFn.prototype);
  var setterNames = propertyNames.filter(function (propertyName) {
    return typeof Object.getOwnPropertyDescriptor(classFn.prototype, propertyName).set === 'function';
  });
  var attributes = setterNames.map(function (setterName) {
    return propertyNameToAttribute(setterName);
  });

  // Merge.
  var diff = attributes.filter(function (attribute) {
    return baseAttributes.indexOf(attribute) < 0;
  });
  return baseAttributes.concat(diff);
}

// Convert a camel case fooBar property name to a hyphenated foo-bar attribute.
function propertyNameToAttribute(propertyName) {
  var attribute = propertyNamesToAttributes[propertyName];
  if (!attribute) {
    // Convert and memoize.
    var uppercaseRegEx = /([A-Z])/g;
    attribute = propertyName.replace(uppercaseRegEx, '-$1').toLowerCase();
  }
  return attribute;
}

},{"./safeAttributes":17}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A group of elements that have been associated for the purpose of
 * accomplishing some collective behavior, e.g., keyboard handling.
 *
 * There are certain components that want to cooperatively handle the keyboard.
 * For example, the basic-arrow-selection and basic-page-dots components are
 * optional components that can augment the appearance and behavior of an inner
 * basic-carousel, adding arrow buttons and dot buttons, respectively. When
 * these components are nested together, they form an implicit unit called a
 * *collective*:
 *
 *     <basic-arrow-selection>
 *       <basic-page-dots>
 *         <basic-carousel>
 *           ... images, etc. ...
 *         </basic-carousel>
 *       </basic-page-dots>
 *     </basic-arrow-selection>
 *
 * In this configuration, the three components will all have a `this.collective`
 * reference that refers to a shared instance of the `Collective` class.
 *
 * The [Keyboard](Keyboard.md) mixin they use is sensitive to the presence of
 * the collective. Among other things, it will ensure that only the outermost
 * element above — the basic-arrow-selection — will be a tab stop that can
 * receive the keyboard focus. This lets the user perceive the component
 * arrangement above as a single unit. The Keyboard mixin will also give each
 * element in the collective a chance to process any keyboard events. So, even
 * though the basic-arrow-selection element will have the focus, the standard
 * keyboard navigation provided by basic-carousel will continue to work.
 *
 * The [SelectionAriaActive](SelectionAriaActive.md) mixin also respects
 * collectives when using the `aria-activedescendant` and `role` attributes.
 * Those will be applied to the outermost element (basic-arrow-selection, above)
 * so that ARIA can correctly understand the arrangement of the elements.
 *
 * You can put elements into collectives yourself, or you can use the
 * [TargetInCollective](TargetInCollective.md) mixin.
 */
var Collective = function () {

  /**
   * Create a collective.
   *
   * @param {HTMLELement[]} [elements] - Initial elements to add.
   */
  function Collective() {
    var _this = this;

    _classCallCheck(this, Collective);

    /**
     * The elements in the collective.
     *
     * @type {HTMLElement[]}
     */
    this.elements = [];

    for (var _len = arguments.length, elements = Array(_len), _key = 0; _key < _len; _key++) {
      elements[_key] = arguments[_key];
    }

    elements.forEach(function (element) {
      return _this.assimilate(element);
    });
  }

  /**
   * Add the indicated target to the collective.
   *
   * By convention, if two elements wants to participate in a collective, and
   * one element is an ancestor of the other in the DOM, the ancestor should
   * assimilate the descendant instead of the other way around.
   *
   * After assimilation, any element in the collective that defines a
   * `collectiveChanged` method will have that method invoked. This allows
   * the collective's elements to respond to changes in the collective.
   *
   * @param {(HTMLElement|Collective)} target - The element or collective to add.
   */


  _createClass(Collective, [{
    key: 'assimilate',
    value: function assimilate(target) {
      var collectiveChanged = void 0;
      if (target instanceof Collective) {
        collectiveChanged = assimilateCollective(this, target);
      } else if (target.collective) {
        // Target is already part of a collective, assimilate it.
        collectiveChanged = assimilateCollective(this, target.collective);
      } else {
        // Assimilate an individual element.
        collectiveChanged = assimilateElement(this, target);
      }

      if (collectiveChanged) {
        this.invokeMethod('collectiveChanged');
      }
    }

    /**
     * Invoke a method on all elements in the collective.
     *
     * @param {string} method - The name of the method to invoke on all elements.
     * @param {object[]} [args] - The arguments to the method
     */

  }, {
    key: 'invokeMethod',
    value: function invokeMethod(method) {
      // Invoke from innermost to outermost.
      var elements = this.elements;

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      for (var i = elements.length - 1; i >= 0; i--) {
        var element = elements[i];
        if (element[method]) {
          element[method].apply(element, args);
        }
      }
    }

    /**
     * The outermost element in the collective.
     * By convention, this is the first element in the `elements` array.
     */

  }, {
    key: 'outermostElement',
    get: function get() {
      return this.elements[0];
    }
  }]);

  return Collective;
}();

// The first collective assimilates the second.


function assimilateCollective(collective1, collective2) {
  if (collective1 === collective2) {
    // Collectives are same; ignore.
    return false;
  }

  var elements = collective2.elements;

  // Old collective will no longer have any elements of its own.
  collective2.elements = [];

  elements.forEach(function (element) {
    assimilateElement(collective1, element);
  });

  return true;
}

// Assimilate the indicated element.
function assimilateElement(collective, element) {
  if (element.collective === collective) {
    // Already part of this collective.
    return false;
  }
  element.collective = collective;
  collective.elements.push(element);
  return true;
}

exports.default = Collective;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* Exported function extends a base class with Composable. */
exports.default = function (base) {

  /**
   * Mixin to make a class more easily composable with other mixins.
   *
   * This mixin contributes a `compose` method that applies a set of mixin
   * functions and returns the resulting new class. This sugar can make the
   * application of many mixins at once easier to read.
   */
  var Composable = function (_base) {
    _inherits(Composable, _base);

    function Composable() {
      _classCallCheck(this, Composable);

      return _possibleConstructorReturn(this, (Composable.__proto__ || Object.getPrototypeOf(Composable)).apply(this, arguments));
    }

    _createClass(Composable, null, [{
      key: 'compose',


      /**
       * Apply a set of mixin functions or mixin objects to the present class and
       * return the new class.
       *
       * Instead of writing:
       *
       *     let MyClass = Mixin1(Mixin2(Mixin3(Mixin4(Mixin5(BaseClass)))));
       *
       * You can write:
       *
       *     let MyClass = Composable(BaseClass).compose(
       *       Mixin1,
       *       Mixin2,
       *       Mixin3,
       *       Mixin4,
       *       Mixin5
       *     );
       *
       * This function can also take mixin objects. A mixin object is just a
       * shorthand for a mixin function that creates a new subclass with the given
       * members. The mixin object's members are *not* copied directly onto the
       * prototype of the base class, as with traditional mixins.
       *
       * In addition to providing syntactic sugar, this mixin can be used to
       * define a class in ES5, which lacks ES6's `class` keyword.
       *
       * @param {...mixins} mixins - A set of mixin functions or objects to apply.
       */
      value: function compose() {
        for (var _len = arguments.length, mixins = Array(_len), _key = 0; _key < _len; _key++) {
          mixins[_key] = arguments[_key];
        }

        // We create a new subclass for each mixin in turn. The result becomes
        // the base class extended by any subsequent mixins. It turns out that
        // we can use Array.reduce() to concisely express this, using the current
        // object as the seed for reduce().
        return mixins.reduce(composeClass, this);
      }
    }]);

    return Composable;
  }(base);

  return Composable;
};

// Properties defined by Object that we don't want to mixin.


var NON_MIXABLE_OBJECT_PROPERTIES = ['constructor'];

/*
 * Apply the mixin to the given base class to return a new class.
 * The mixin can either be a function that returns the modified class, or a
 * plain object whose members will be copied to the new class' prototype.
 */
function composeClass(base, mixin) {
  if (typeof mixin === 'function') {
    // Mixin function
    return mixin(base);
  } else {
    // Mixin object
    var Subclass = function (_base2) {
      _inherits(Subclass, _base2);

      function Subclass() {
        _classCallCheck(this, Subclass);

        return _possibleConstructorReturn(this, (Subclass.__proto__ || Object.getPrototypeOf(Subclass)).apply(this, arguments));
      }

      return Subclass;
    }(base);

    copyOwnProperties(mixin, Subclass.prototype, NON_MIXABLE_OBJECT_PROPERTIES);
    return Subclass;
  }
}

/*
 * Copy the given properties/methods to the target.
 * Return the updated target.
 */
function copyOwnProperties(source, target) {
  var ignorePropertyNames = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  Object.getOwnPropertyNames(source).forEach(function (name) {
    if (ignorePropertyNames.indexOf(name) < 0) {
      var descriptor = Object.getOwnPropertyDescriptor(source, name);
      Object.defineProperty(target, name, descriptor);
    }
  });
  return target;
}

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createSymbol = require('./createSymbol');

var _createSymbol2 = _interopRequireDefault(_createSymbol);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Symbols for private data members on an element.
var targetSymbol = (0, _createSymbol2.default)('target');

/* Exported function extends a base class with ContentFirstChildTarget. */

exports.default = function (base) {

  /**
   * Mixin that defines the target of a component — the element the component is
   * managing or somehow responsible for — as its first child.
   *
   * Some components serve to decorate or modify other elements. A common
   * pattern is to have one component wrap another, and have the outer, parent
   * component implicitly modify the child. This mixin facilitates this by
   * implicitly taking an element's first child as its "target".
   *
   * Example:
   *
   *     <outer-element>
   *       <inner-element></inner-element>
   *     </outer-element>
   *
   * If `outer-element` uses this mixin, then its `target` property will be
   * set to point to the `inner-element`, because that is its first child.
   *
   * This mixin expects a `content` property that returns the element's content.
   * You can implement that yourself, or use the
   * [DistributedChildrenAsContent](DistributedChildrenAsContent.md) mixin.
   *
   * This mixin can be combined with the
   * [TargetInCollective](TargetInCollective.md) mixin to have a component
   * participate in collective keyboard handling.
   */
  var ContentFirstChildTarget = function (_base) {
    _inherits(ContentFirstChildTarget, _base);

    function ContentFirstChildTarget() {
      _classCallCheck(this, ContentFirstChildTarget);

      return _possibleConstructorReturn(this, (ContentFirstChildTarget.__proto__ || Object.getPrototypeOf(ContentFirstChildTarget)).apply(this, arguments));
    }

    _createClass(ContentFirstChildTarget, [{
      key: 'contentChanged',
      value: function contentChanged() {
        if (_get(ContentFirstChildTarget.prototype.__proto__ || Object.getPrototypeOf(ContentFirstChildTarget.prototype), 'contentChanged', this)) {
          _get(ContentFirstChildTarget.prototype.__proto__ || Object.getPrototypeOf(ContentFirstChildTarget.prototype), 'contentChanged', this).call(this);
        }
        var content = this.content;
        var target = content && content[0];
        // A component using a target will likely do a bunch of work when the
        // target changes, so only set the target if it's actually changed.
        if (target && target !== this.target) {
          this.target = target;
        }
      }

      /**
       * Gets/sets the current target of the component.
       *
       * @type {HTMLElement}
       */

    }, {
      key: 'target',
      get: function get() {
        return this[targetSymbol];
      },
      set: function set(element) {
        this[targetSymbol] = element;
        if ('target' in base.prototype) {
          _set(ContentFirstChildTarget.prototype.__proto__ || Object.getPrototypeOf(ContentFirstChildTarget.prototype), 'target', element, this);
        }
      }
    }]);

    return ContentFirstChildTarget;
  }(base);

  return ContentFirstChildTarget;
};

},{"./createSymbol":15}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* Exported function extends a base class with DistributedChildren. */
exports.default = function (base) {

  /**
   * Mixin which defines helpers for accessing a component's distributed
   * children as a flattened array or string.
   *
   * The standard DOM API provides several ways of accessing child content:
   * `children`, `childNodes`, and `textContent`. None of these functions are
   * Shadow DOM aware. This mixin defines variations of those functions that
   * *are* Shadow DOM aware.
   *
   * Example: you create a component `<count-children>` that displays a number
   * equal to the number of children placed inside that component. If someone
   * instantiates your component like:
   *
   *     <count-children>
   *       <div></div>
   *       <div></div>
   *       <div></div>
   *     </count-children>
   *
   * Then the component should show "3", because there are three children. To
   * calculate the number of children, the component can just calculate
   * `this.children.length`. However, suppose someone instantiates your
   * component inside one of their own components, and puts a `<slot>` element
   * inside your component:
   *
   *     <count-children>
   *       <slot></slot>
   *     </count-children>
   *
   * If your component only looks at `this.children`, it will always see exactly
   * one child — the `<slot>` element. But the user looking at the page will
   * *see* any nodes distributed to that slot. To match what the user sees, your
   * component should expand any `<slot>` elements it contains.
   *
   * That is the problem this mixin solves. After applying this mixin, your
   * component code has access to `this.distributedChildren`, whose `length`
   * will return the total number of all children distributed to your component
   * in the composed tree.
   *
   * Note: The latest Custom Elements API design calls for a new function,
   * `getAssignedNodes` that takes an optional `deep` parameter, that will solve
   * this problem at the API level.
   */
  var DistributedChildren = function (_base) {
    _inherits(DistributedChildren, _base);

    function DistributedChildren() {
      _classCallCheck(this, DistributedChildren);

      return _possibleConstructorReturn(this, (DistributedChildren.__proto__ || Object.getPrototypeOf(DistributedChildren)).apply(this, arguments));
    }

    _createClass(DistributedChildren, [{
      key: 'distributedChildren',


      /**
       * An in-order collection of distributed children, expanding any slot
       * elements. Like the standard children property, this skips text nodes.
       *
       * @type {HTMLElement[]}
       */
      get: function get() {
        return expandContentElements(this.children, false);
      }

      /**
       * An in-order collection of distributed child nodes, expanding any slot
       * elements. Like the standard childNodes property, this includes text
       * nodes.
       *
       * @type {Node[]}
       */

    }, {
      key: 'distributedChildNodes',
      get: function get() {
        return expandContentElements(this.childNodes, true);
      }

      /**
       * The concatenated text content of all distributed child nodes, expanding
       * any slot elements.
       *
       * @type {string}
       */

    }, {
      key: 'distributedTextContent',
      get: function get() {
        var strings = this.distributedChildNodes.map(function (child) {
          return child.textContent;
        });
        return strings.join('');
      }
    }]);

    return DistributedChildren;
  }(base);

  return DistributedChildren;
};

/*
 * Given a array of nodes, return a new array with any content elements expanded
 * to the nodes distributed to that content element. This rule is applied
 * recursively.
 *
 * If includeTextNodes is true, text nodes will be included, as in the
 * standard childNodes property; by default, this skips text nodes, like the
 * standard children property.
 */


function expandContentElements(nodes, includeTextNodes) {
  var _ref;

  var expanded = Array.prototype.map.call(nodes, function (node) {
    // We want to see if the node is an instanceof HTMLSlotELement, but
    // that class won't exist if the browser that doesn't support native
    // Shadow DOM and if the Shadow DOM polyfill hasn't been loaded. Instead,
    // we do a simplistic check to see if the tag name is "slot".
    var isSlot = typeof HTMLSlotElement !== 'undefined' ? node instanceof HTMLSlotElement : node.localName === 'slot';
    if (isSlot) {
      // Use the nodes assigned to this node instead.
      var assignedNodes = node.assignedNodes({ flatten: true });
      return assignedNodes ? expandContentElements(assignedNodes, includeTextNodes) : [];
    } else if (node instanceof HTMLElement) {
      // Plain element; use as is.
      return [node];
    } else if (node instanceof Text && includeTextNodes) {
      // Text node.
      return [node];
    } else {
      // Comment, processing instruction, etc.; skip.
      return [];
    }
  });
  var flattened = (_ref = []).concat.apply(_ref, _toConsumableArray(expanded));
  return flattened;
}

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _microtask = require('./microtask');

var _microtask2 = _interopRequireDefault(_microtask);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* Exported function extends a base class with DistributedChildrenAsContent. */
exports.default = function (base) {

  /**
   * Mixin which defines a component's content as its children, expanding any
   * nodes distributed to the component's slots.
   *
   * This also provides notification of changes to a component's content. It
   * will invoke a `contentChanged` method when the component is first
   * instantiated, and whenever its distributed children change. This is an
   * easy way to satisfy the Gold Standard checklist item for monitoring
   * [Content Changes](https://github.com/webcomponents/gold-standard/wiki/Content-Changes).
   *
   * Example:
   *
   * ```
   * let base = DistributedChildrenAsContent(DistributedChildren(HTMLElement));
   * class CountingElement extends base {
   *
   *   constructor() {
   *     super();
   *     let root = this.attachShadow({ mode: 'open' });
   *     root.innerHTML = `<slot></slot>`;
   *   }
   *
   *   contentChanged() {
   *     // Count the component's children, both initially and when changed.
   *     this.count = this.distributedChildren.length;
   *   }
   *
   * }
   * ```
   *
   * Note that content change detection depends upon the element having at least
   * one `slot` element in its shadow subtree.
   *
   * This mixin is intended for use with the
   * [DistributedChildren](DistributedChildren.md) mixin. See that mixin for a
   * discussion of how that works. This DistributedChildrenAsContent mixin
   * provides an easy way of defining the "content" of a component as the
   * component's distributed children. That in turn lets mixins like
   * [ContentAsItems](ContentAsItems.md) manipulate the children as list items.
   */
  var DistributedChildrenAsContent = function (_base) {
    _inherits(DistributedChildrenAsContent, _base);

    function DistributedChildrenAsContent() {
      _classCallCheck(this, DistributedChildrenAsContent);

      var _this = _possibleConstructorReturn(this, (DistributedChildrenAsContent.__proto__ || Object.getPrototypeOf(DistributedChildrenAsContent)).call(this));

      if (_this.shadowRoot) {
        // Listen to changes on all slots.
        var slots = _this.shadowRoot.querySelectorAll('slot');
        slots.forEach(function (slot) {
          return slot.addEventListener('slotchange', function (event) {
            _this.contentChanged();
          });
        });
      }

      // Make an initial call to contentChanged() so that the component can do
      // initialization that it normally does when content changes.
      //
      // This will invoke contentChanged() handlers in other mixins. In order
      // that those mixins have a chance to complete their own initialization,
      // we add the contentChanged() call to the microtask queue.
      (0, _microtask2.default)(function () {
        return _this.contentChanged();
      });
      return _this;
    }

    /**
     * Invoked when the contents of the component (including distributed
     * children) have changed.
     *
     * This method is also invoked when a component is first instantiated; the
     * contents have essentially "changed" from being nothing. This allows the
     * component to perform initial processing of its children.
     */


    _createClass(DistributedChildrenAsContent, [{
      key: 'contentChanged',
      value: function contentChanged() {
        if (_get(DistributedChildrenAsContent.prototype.__proto__ || Object.getPrototypeOf(DistributedChildrenAsContent.prototype), 'contentChanged', this)) {
          _get(DistributedChildrenAsContent.prototype.__proto__ || Object.getPrototypeOf(DistributedChildrenAsContent.prototype), 'contentChanged', this).call(this);
        }
        var event = new CustomEvent('content-changed');
        this.dispatchEvent(event);
      }

      /**
       * The content of this component, defined to be the flattened array of
       * children distributed to the component.
       *
       * @type {HTMLElement[]}
       */

    }, {
      key: 'content',
      get: function get() {
        return this.distributedChildren;
      },
      set: function set(value) {
        if ('content' in base.prototype) {
          _set(DistributedChildrenAsContent.prototype.__proto__ || Object.getPrototypeOf(DistributedChildrenAsContent.prototype), 'content', value, this);
        }
        // TODO: Set the children to the given value (which should be an array of
        // elements)?
      }

      /**
       * This event is raised when the component's contents (including distributed
       * children) have changed.
       *
       * @memberof DistributedChildrenAsContent
       * @event content-changed
       */

    }]);

    return DistributedChildrenAsContent;
  }(base);

  return DistributedChildrenAsContent;
};

},{"./microtask":16}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createSymbol = require('./createSymbol');

var _createSymbol2 = _interopRequireDefault(_createSymbol);

var _safeAttributes = require('./safeAttributes');

var _safeAttributes2 = _interopRequireDefault(_safeAttributes);

var _symbols = require('./symbols');

var _symbols2 = _interopRequireDefault(_symbols);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Symbols for private data members on an element.
var keydownListenerSymbol = (0, _createSymbol2.default)('keydownListener');

/* Exported function extends a base class with Keyboard. */

exports.default = function (base) {

  /**
   * Mixin which manages the keydown handling for a component.
   *
   * This mixin handles several keyboard-related features.
   *
   * First, it wires up a single keydown event handler that can be shared by
   * multiple mixins on a component. The event handler will invoke a `keydown`
   * method with the event object, and any mixin along the prototype chain that
   * wants to handle that method can do so.
   *
   * If a mixin wants to indicate that keyboard event has been handled, and that
   * other mixins should *not* handle it, the mixin's `keydown` handler should
   * return a value of true. The convention that seems to work well is that a
   * mixin should see if it wants to handle the event and, if not, then ask the
   * superclass to see if it wants to handle the event. This has the effect of
   * giving the mixin that was applied last the first chance at handling a
   * keyboard event.
   *
   * Example:
   *
   *     [symbols.keydown](event) {
   *       let handled;
   *       switch (event.keyCode) {
   *         // Handle the keys you want, setting handled = true if appropriate.
   *       }
   *       // Prefer mixin result if it's defined, otherwise use base result.
   *       return handled || (super[symbols.keydown] && super[symbols.keydown](event));
   *     }
   *
   * A second feature provided by this mixin is that it implicitly makes the
   * component a tab stop if it isn't already, by setting `tabIndex` to 0. This
   * has the effect of adding the component to the tab order in document order.
   *
   * Finally, this mixin is designed to work with the optional
   * [Collective](Collective.md) class via a mixin like
   * [TargetInCollective](TargetInCollective.md). This allows a set of related
   * component instances to cooperatively handle the keyboard. See the
   * Collective class for details.
   */
  var Keyboard = function (_base) {
    _inherits(Keyboard, _base);

    function Keyboard() {
      _classCallCheck(this, Keyboard);

      // Assume this component is going to handle the keyboard on its own.
      // REVIEW: Move to connectedCallback?
      var _this = _possibleConstructorReturn(this, (Keyboard.__proto__ || Object.getPrototypeOf(Keyboard)).call(this));

      startListeningToKeydown(_this);
      return _this;
    }

    /*
     * If we're now the outermost element of the collective, set up to receive
     * keyboard events. If we're no longer the outermost element, stop
     * listening.
     */


    _createClass(Keyboard, [{
      key: 'collectiveChanged',
      value: function collectiveChanged() {
        var _this2 = this;

        if (_get(Keyboard.prototype.__proto__ || Object.getPrototypeOf(Keyboard.prototype), 'collectiveChanged', this)) {
          _get(Keyboard.prototype.__proto__ || Object.getPrototypeOf(Keyboard.prototype), 'collectiveChanged', this).call(this);
        }

        if (this.collective.outermostElement !== this) {
          // We're no longer the outermost element; stop listening.
          if (isListeningToKeydown(this)) {
            stopListeningToKeydown(this);
          }
          return;
        }

        if (!this.getAttribute('aria-label')) {
          // Since we're going to handle the keyboard, see if we can adopt an ARIA
          // label from an inner element of the collective.
          var label = getCollectiveAriaLabel(this.collective);
          if (label) {
            _safeAttributes2.default.setAttribute(this, 'aria-label', label);
            // Remove any labels from inner elements.
            this.collective.elements.forEach(function (element) {
              if (element !== _this2) {
                element.removeAttribute('aria-label');
              }
            });
          }
        }

        if (!isListeningToKeydown(this)) {
          startListeningToKeydown(this);
        }
      }
    }, {
      key: 'connectedCallback',
      value: function connectedCallback() {
        if (_get(Keyboard.prototype.__proto__ || Object.getPrototypeOf(Keyboard.prototype), 'connectedCallback', this)) {
          _get(Keyboard.prototype.__proto__ || Object.getPrototypeOf(Keyboard.prototype), 'connectedCallback', this).call(this);
        }
        _safeAttributes2.default.connected(this);
        // Set a default tab index of 0 (document order) if no tab index exists.
        // MS Edge requires we explicitly check for presence of tabindex attribute.
        if (this.getAttribute('tabindex') == null || this.tabIndex < 0) {
          this.setAttribute('tabindex', '0');
        }
      }

      /**
       * Handle the indicated keyboard event.
       *
       * The default implementation of this method does nothing. This will
       * typically be handled by other mixins.
       *
       * @param {KeyboardEvent} event - the keyboard event
       * @return {boolean} true if the event was handled
       */

    }, {
      key: _symbols2.default.keydown,
      value: function value(event) {
        if (_get(Keyboard.prototype.__proto__ || Object.getPrototypeOf(Keyboard.prototype), _symbols2.default.keydown, this)) {
          return _get(Keyboard.prototype.__proto__ || Object.getPrototypeOf(Keyboard.prototype), _symbols2.default.keydown, this).call(this, event);
        }
      }
    }]);

    return Keyboard;
  }(base);

  return Keyboard;
};

// Fire the keydown() method on the element or (if it belongs to a collective)
// all elements in the collective.
//
// Note: the value of 'this' is bound to the element which received the event.


function keydown(event) {

  var handled = false;

  if (this.collective) {
    // Give collective elements a shot at the event, working from innermost to
    // outermost (this element).
    var elements = this.collective.elements;
    for (var i = elements.length - 1; i >= 0; i--) {
      var element = elements[i];
      handled = element[_symbols2.default.keydown] && element[_symbols2.default.keydown](event);
      if (handled) {
        break;
      }
    }
  } else {
    // Component is handling the keyboard on its own.
    handled = this[_symbols2.default.keydown](event);
  }

  if (handled) {
    event.preventDefault();
    event.stopPropagation();
  }
}

// Return the first ARIA label defined by the collective.
function getCollectiveAriaLabel(collective) {
  var labels = collective.elements.map(function (element) {
    return element.getAttribute('aria-label');
  });
  // Would prefer to use Array.prototype.find here, but IE 11 doesn't have it.
  var nonNullLabels = labels.filter(function (label) {
    return label != null;
  });
  return nonNullLabels[0];
}

function isListeningToKeydown(element) {
  return element[keydownListenerSymbol] != null;
}

function startListeningToKeydown(element) {
  element[keydownListenerSymbol] = keydown.bind(element);
  element.addEventListener('keydown', element[keydownListenerSymbol]);
}

function stopListeningToKeydown(element) {
  element.removeEventListener('keydown', element[keydownListenerSymbol]);
  element[keydownListenerSymbol] = null;
  element.removeAttribute('tabindex');
}

},{"./createSymbol":15,"./safeAttributes":17,"./symbols":18}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createSymbol = require('./createSymbol');

var _createSymbol2 = _interopRequireDefault(_createSymbol);

var _symbols = require('./symbols');

var _symbols2 = _interopRequireDefault(_symbols);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Symbols for private data members on an element.
var navigationAxisSymbol = (0, _createSymbol2.default)('navigationAxis');

/* Exported function extends a base class with KeyboardDirection. */

exports.default = function (base) {

  /**
   * Mixin which maps direction keys (Left, Right, etc.) to direction semantics
   * (go left, go right, etc.).
   *
   * This mixin expects the component to invoke a `keydown` method when a key is
   * pressed. You can use the [Keyboard](Keyboard.md) mixin for that purpose, or
   * wire up your own keyboard handling and call `keydown` yourself.
   *
   * This mixin calls methods such as `goLeft` and `goRight`. You can define
   * what that means by implementing those methods yourself. If you want to use
   * direction keys to navigate a selection, use this mixin with the
   * [DirectionSelection](DirectionSelection.md) mixin.
   */
  var KeyboardDirection = function (_base) {
    _inherits(KeyboardDirection, _base);

    function KeyboardDirection() {
      _classCallCheck(this, KeyboardDirection);

      // Set defaults.
      var _this = _possibleConstructorReturn(this, (KeyboardDirection.__proto__ || Object.getPrototypeOf(KeyboardDirection)).call(this));

      if (typeof _this.navigationAxis === 'undefined') {
        _this.navigationAxis = _this[_symbols2.default.defaults].navigationAxis;
      }
      return _this;
    }

    _createClass(KeyboardDirection, [{
      key: _symbols2.default.goDown,


      /**
       * Invoked when the user wants to go/navigate down.
       * The default implementation of this method does nothing.
       */
      value: function value() {
        if (_get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.goDown, this)) {
          return _get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.goDown, this).call(this);
        }
      }

      /**
       * Invoked when the user wants to go/navigate to the end (e.g., of a list).
       * The default implementation of this method does nothing.
       */

    }, {
      key: _symbols2.default.goEnd,
      value: function value() {
        if (_get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.goEnd, this)) {
          return _get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.goEnd, this).call(this);
        }
      }

      /**
       * Invoked when the user wants to go/navigate left.
       * The default implementation of this method does nothing.
       */

    }, {
      key: _symbols2.default.goLeft,
      value: function value() {
        if (_get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.goLeft, this)) {
          return _get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.goLeft, this).call(this);
        }
      }

      /**
       * Invoked when the user wants to go/navigate right.
       * The default implementation of this method does nothing.
       */

    }, {
      key: _symbols2.default.goRight,
      value: function value() {
        if (_get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.goRight, this)) {
          return _get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.goRight, this).call(this);
        }
      }

      /**
       * Invoked when the user wants to go/navigate to the start (e.g., of a
       * list). The default implementation of this method does nothing.
       */

    }, {
      key: _symbols2.default.goStart,
      value: function value() {
        if (_get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.goStart, this)) {
          return _get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.goStart, this).call(this);
        }
      }

      /**
       * Invoked when the user wants to go/navigate up.
       * The default implementation of this method does nothing.
       */

    }, {
      key: _symbols2.default.goUp,
      value: function value() {
        if (_get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.goUp, this)) {
          return _get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.goUp, this).call(this);
        }
      }

      /**
       * Indicates the direction of permitted navigation with the keyboard.
       *
       * Accepted values are "horizontal", "vertical", or "both" (the default).
       * If this property is "horizontal", the Up Arrow and Down Arrow keys will
       * be ignored. Conversely, if this is "vertical", the Left Arrow and Right
       * Arrow keys will be ignored.
       *
       * @type {string}
       */

    }, {
      key: _symbols2.default.keydown,
      value: function value(event) {
        var handled = void 0;

        var axis = this.navigationAxis;
        var horizontal = axis === 'horizontal' || axis === 'both';
        var vertical = axis === 'vertical' || axis === 'both';

        // Ignore Left/Right keys when metaKey or altKey modifier is also pressed,
        // as the user may be trying to navigate back or forward in the browser.
        switch (event.keyCode) {
          case 35:
            // End
            handled = this[_symbols2.default.goEnd]();
            break;
          case 36:
            // Home
            handled = this[_symbols2.default.goStart]();
            break;
          case 37:
            // Left
            if (horizontal && !event.metaKey && !event.altKey) {
              handled = this[_symbols2.default.goLeft]();
            }
            break;
          case 38:
            // Up
            if (vertical) {
              handled = event.altKey ? this[_symbols2.default.goStart]() : this[_symbols2.default.goUp]();
            }
            break;
          case 39:
            // Right
            if (horizontal && !event.metaKey && !event.altKey) {
              handled = this[_symbols2.default.goRight]();
            }
            break;
          case 40:
            // Down
            if (vertical) {
              handled = event.altKey ? this[_symbols2.default.goEnd]() : this[_symbols2.default.goDown]();
            }
            break;
        }
        // Prefer mixin result if it's defined, otherwise use base result.
        return handled || _get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.keydown, this) && _get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.keydown, this).call(this, event);
      }
    }, {
      key: _symbols2.default.defaults,
      get: function get() {
        var defaults = _get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.defaults, this) || {};
        defaults.navigationAxis = 'both';
        return defaults;
      }
    }, {
      key: 'navigationAxis',
      get: function get() {
        return this[navigationAxisSymbol];
      },
      set: function set(value) {
        this[navigationAxisSymbol] = value;
        if ('navigationAxis' in base.prototype) {
          _set(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), 'navigationAxis', value, this);
        }
      }
    }]);

    return KeyboardDirection;
  }(base);

  return KeyboardDirection;
};

},{"./createSymbol":15,"./symbols":18}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* Exported function extends a base class with ShadowElementReferences. */
exports.default = function (base) {

  /**
   * Mixin to create references to elements in a component's Shadow DOM subtree.
   *
   * This adds a member on the component called `this.$` that can be used to
   * reference shadow elements with IDs. E.g., if component's shadow contains an
   * element `<button id="foo">`, then this mixin will create a member
   * `this.$.foo` that points to that button.
   *
   * Such references simplify a component's access to its own elements. In
   * exchange, this mixin trades off a one-time cost of querying all elements in
   * the shadow tree instead of paying an ongoing cost to query for an element
   * each time the component wants to inspect or manipulate it.
   *
   * This mixin expects the component to define a Shadow DOM subtree. You can
   * create that tree yourself, or make use of the
   * [ShadowTemplate](ShadowTemplate.md) mixin.
   *
   * This mixin is inspired by Polymer's [automatic
   * node finding](https://www.polymer-project.org/1.0/docs/devguide/local-dom.html#node-finding)
   * feature.
   */
  var ShadowElementReferences = function (_base) {
    _inherits(ShadowElementReferences, _base);

    function ShadowElementReferences() {
      _classCallCheck(this, ShadowElementReferences);

      var _this = _possibleConstructorReturn(this, (ShadowElementReferences.__proto__ || Object.getPrototypeOf(ShadowElementReferences)).call(this));

      if (_this.shadowRoot) {
        // Look for elements in the shadow subtree that have id attributes.
        // An alternatively implementation of this mixin would be to just define
        // a this.$ getter that lazily does this search the first time someone
        // tries to access this.$. That might introduce some complexity – if the
        // the tree changed after it was first populated, the result of
        // searching for a node might be somewhat unpredictable.
        _this.$ = {};
        var nodesWithIds = _this.shadowRoot.querySelectorAll('[id]');
        [].forEach.call(nodesWithIds, function (node) {
          var id = node.getAttribute('id');
          _this.$[id] = node;
        });
      }
      return _this;
    }

    /**
     * The collection of references to the elements with IDs in a component's
     * Shadow DOM subtree.
     *
     * @type {object}
     * @member $
     */


    return ShadowElementReferences;
  }(base);

  return ShadowElementReferences;
};

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* Exported function extends a base class with ShadowTemplate. */
exports.default = function (base) {

  /**
   * Mixin for stamping a template into a Shadow DOM subtree upon component
   * instantiation.
   *
   * To use this mixin, define a `template` property as a string or HTML
   * `<template>` element:
   *
   *     class MyElement extends ShadowTemplate(HTMLElement) {
   *       get template() {
   *         return `Hello, <em>world</em>.`;
   *       }
   *     }
   *
   * When your component class is instantiated, a shadow root will be created on
   * the instance, and the contents of the template will be cloned into the
   * shadow root. If your component does not define a `template` property, this
   * mixin has no effect.
   *
   * For the time being, this extension retains support for Shadow DOM v0. That
   * will eventually be deprecated as browsers (and the Shadow DOM polyfill)
   * implement Shadow DOM v1.
   */
  var ShadowTemplate = function (_base) {
    _inherits(ShadowTemplate, _base);

    /*
     * If the component defines a template, a shadow root will be created on the
     * component instance, and the template stamped into it.
     */
    function ShadowTemplate() {
      _classCallCheck(this, ShadowTemplate);

      var _this = _possibleConstructorReturn(this, (ShadowTemplate.__proto__ || Object.getPrototypeOf(ShadowTemplate)).call(this));

      var template = _this.template;
      // TODO: Save the processed template with the component's class prototype
      // so it doesn't need to be processed with every instantiation.
      if (template) {

        if (typeof template === 'string') {
          // Upgrade plain string to real template.
          template = createTemplateWithInnerHTML(template);
        }

        if (window.ShadowDOMPolyfill) {
          shimTemplateStyles(template, _this.localName);
        }

        var root = _this.attachShadow({ mode: 'open' });
        var clone = document.importNode(template.content, true);
        root.appendChild(clone);
      }
      return _this;
    }

    return ShadowTemplate;
  }(base);

  return ShadowTemplate;
};

// Convert a plain string of HTML into a real template element.


function createTemplateWithInnerHTML(innerHTML) {
  var template = document.createElement('template');
  // REVIEW: Is there an easier way to do this?
  // We'd like to just set innerHTML on the template content, but since it's
  // a DocumentFragment, that doesn't work.
  var div = document.createElement('div');
  div.innerHTML = innerHTML;
  while (div.childNodes.length > 0) {
    template.content.appendChild(div.childNodes[0]);
  }
  return template;
}

// Invoke basic style shimming with ShadowCSS.
function shimTemplateStyles(template, tag) {
  window.WebComponents.ShadowCSS.shimStyling(template.content, tag);
}

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createSymbol = require('./createSymbol');

var _createSymbol2 = _interopRequireDefault(_createSymbol);

var _microtask = require('./microtask');

var _microtask2 = _interopRequireDefault(_microtask);

var _symbols = require('./symbols');

var _symbols2 = _interopRequireDefault(_symbols);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Symbols for private data members on an element.
var canSelectNextSymbol = (0, _createSymbol2.default)('canSelectNext');
var canSelectPreviousSymbol = (0, _createSymbol2.default)('canSelectPrevious');
var selectedItemSymbol = (0, _createSymbol2.default)('selectedItem');
var selectionRequiredSymbol = (0, _createSymbol2.default)('selectionRequired');
var selectionWrapsSymbol = (0, _createSymbol2.default)('selectionWraps');

/* Exported function extends a base class with SingleSelection. */

exports.default = function (base) {

  /**
   * Mixin which manages single-selection semantics for items in a list.
   *
   * This mixin expects a component to provide an `items` array of all elements
   * in the list. A standard way to do that with is the
   * [ContentAsItems](ContentAsItems.md) mixin, which takes a component's
   * content (typically its distributed children) as the set of list items; see
   * that mixin for details.
   *
   * This mixin tracks a single selected item in the list, and provides means to
   * get and set that state by item position (`selectedIndex`) or item identity
   * (`selectedItem`). The selection can be moved in the list via the methods
   * `selectFirst`, `selectLast`, `selectNext`, and `selectPrevious`.
   *
   * This mixin does not produce any user-visible effects to represent
   * selection. Other mixins, such as
   * [SelectionAriaActive](SelectionAriaActive.md),
   * [SelectionHighlight](SelectionHighlight.md) and
   * [SelectionInView](SelectionInView.md), modify the selected item in common
   * ways to let the user know a given item is selected or not selected.
   */
  var SingleSelection = function (_base) {
    _inherits(SingleSelection, _base);

    function SingleSelection() {
      _classCallCheck(this, SingleSelection);

      // Set defaults.
      var _this = _possibleConstructorReturn(this, (SingleSelection.__proto__ || Object.getPrototypeOf(SingleSelection)).call(this));

      if (typeof _this.selectionRequired === 'undefined') {
        _this.selectionRequired = _this[_symbols2.default.defaults].selectionRequired;
      }
      if (typeof _this.selectionWraps === 'undefined') {
        _this.selectionWraps = _this[_symbols2.default.defaults].selectionWraps;
      }
      return _this;
    }

    /**
     * Apply the indicate selection state to the item.
     *
     * The default implementation of this method does nothing. User-visible
     * effects will typically be handled by other mixins.
     *
     * @param {HTMLElement} item - the item being selected/deselected
     * @param {boolean} selected - true if the item is selected, false if not
     */


    _createClass(SingleSelection, [{
      key: _symbols2.default.applySelection,
      value: function value(item, selected) {
        if (_get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), _symbols2.default.applySelection, this)) {
          _get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), _symbols2.default.applySelection, this).call(this, item, selected);
        }
      }

      /**
       * True if the selection can be moved to the next item, false if not (the
       * selected item is the last item in the list).
       *
       * @type {boolean}
       */

    }, {
      key: _symbols2.default.itemAdded,


      /**
       * Handle a new item being added to the list.
       *
       * The default implementation of this method simply sets the item's
       * selection state to false.
       *
       * @param {HTMLElement} item - the item being added
       */
      value: function value(item) {
        if (_get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), _symbols2.default.itemAdded, this)) {
          _get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), _symbols2.default.itemAdded, this).call(this, item);
        }
        this[_symbols2.default.applySelection](item, item === this.selectedItem);
      }
    }, {
      key: 'itemsChanged',
      value: function itemsChanged() {
        var _this2 = this;

        if (_get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'itemsChanged', this)) {
          _get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'itemsChanged', this).call(this);
        }

        if (this.selectionRequired) {
          // Ensure selection, but do this in the next tick to give other mixins a
          // chance to do their own itemsChanged work.
          (0, _microtask2.default)(function () {
            ensureSelection(_this2);
          });
        }

        // The change in items may have affected which navigations are possible.
        updatePossibleNavigations(this);
      }

      /**
       * The index of the item which is currently selected.
       *
       * If `selectionWraps` is false, the index is -1 if there is no selection.
       * In that case, setting the index to -1 will deselect any
       * currently-selected item.
       *
       * @type {number}
       */

    }, {
      key: 'selectFirst',


      /**
       * Select the first item in the list.
       */
      value: function selectFirst() {
        if (_get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectFirst', this)) {
          _get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectFirst', this).call(this);
        }
        return selectIndex(this, 0);
      }

      /**
       * True if the list should always have a selection (if it has items).
       *
       * @type {boolean}
       * @default false
       */

    }, {
      key: 'selectLast',


      /**
       * Select the last item in the list.
       */
      value: function selectLast() {
        if (_get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectLast', this)) {
          _get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectLast', this).call(this);
        }
        return selectIndex(this, this.items.length - 1);
      }

      /**
       * Select the next item in the list.
       */

    }, {
      key: 'selectNext',
      value: function selectNext() {
        if (_get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectNext', this)) {
          _get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectNext', this).call(this);
        }
        return selectIndex(this, this.selectedIndex + 1);
      }

      /**
       * Select the previous item in the list.
       *
       * If the list has no selection, the last item will be selected.
       */

    }, {
      key: 'selectPrevious',
      value: function selectPrevious() {
        if (_get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectPrevious', this)) {
          _get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectPrevious', this).call(this);
        }
        var newIndex = this.selectedIndex < 0 ? this.items.length - 1 : // No selection yet; select last item.
        this.selectedIndex - 1;
        return selectIndex(this, newIndex);
      }

      /**
       * True if selection navigations wrap from last to first, and vice versa.
       *
       * @type {boolean}
       * @default false
       */

    }, {
      key: 'canSelectNext',
      get: function get() {
        return this[canSelectNextSymbol];
      },
      set: function set(canSelectNext) {
        this[canSelectNextSymbol] = canSelectNext;
        if ('canSelectNext' in base.prototype) {
          _set(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'canSelectNext', canSelectNext, this);
        }
      }

      /**
       * True if the selection can be moved to the previous item, false if not
       * (the selected item is the first one in the list).
       *
       * @type {boolean}
       */

    }, {
      key: 'canSelectPrevious',
      get: function get() {
        return this[canSelectPreviousSymbol];
      },
      set: function set(canSelectPrevious) {
        this[canSelectPreviousSymbol] = canSelectPrevious;
        if ('canSelectPrevious' in base.prototype) {
          _set(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'canSelectPrevious', canSelectPrevious, this);
        }
      }
    }, {
      key: _symbols2.default.defaults,
      get: function get() {
        var defaults = _get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), _symbols2.default.defaults, this) || {};
        defaults.selectionRequired = false;
        defaults.selectionWraps = false;
        return defaults;
      }
    }, {
      key: 'selectedIndex',
      get: function get() {
        var selectedItem = this.selectedItem;

        // TODO: If selection wasn't found, most likely cause is that the DOM was
        // manipulated from underneath us. Once we track content changes, turn
        // this into a warning.
        // TODO: Memoize
        return selectedItem ? this.items.indexOf(selectedItem) : -1;
      },
      set: function set(index) {
        // TODO: Pull setting of selectedItem above super() call. */
        if ('selectedIndex' in base.prototype) {
          _set(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectedIndex', index, this);
        }
        var items = this.items;
        var item = index < 0 || items.length === 0 ? null : items[index];
        this.selectedItem = item;

        var event = new CustomEvent('selected-index-changed', {
          detail: {
            selectedIndex: index,
            value: index // for Polymer binding
          }
        });
        this.dispatchEvent(event);
      }

      /**
       * The currently selected item, or null if there is no selection.
       *
       * Setting this property to null deselects any currently-selected item.
       *
       * @type {object}
       */

    }, {
      key: 'selectedItem',
      get: function get() {
        return this[selectedItemSymbol] || null;
      },
      set: function set(item) {
        var previousItem = this[selectedItemSymbol];
        // TODO: Confirm item is actually in the list before selecting.
        this[selectedItemSymbol] = item;

        if ('selectedItem' in base.prototype) {
          _set(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectedItem', item, this);
        }
        if (previousItem) {
          if (item === previousItem) {
            // The indicated item is already the selected item.
            return;
          }
          // Remove previous selection.
          this[_symbols2.default.applySelection](previousItem, false);
        }

        if (item) {
          this[_symbols2.default.applySelection](item, true);
        }

        // TODO: Rationalize with selectedIndex so we're not recalculating item
        // or index in each setter.
        updatePossibleNavigations(this);

        var event = new CustomEvent('selected-item-changed', {
          detail: {
            selectedItem: item,
            previousItem: previousItem,
            value: item // for Polymer binding
          }
        });
        this.dispatchEvent(event);
      }
    }, {
      key: 'selectionRequired',
      get: function get() {
        return this[selectionRequiredSymbol];
      },
      set: function set(selectionRequired) {
        this[selectionRequiredSymbol] = selectionRequired;
        if ('selectionRequired' in base.prototype) {
          _set(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectionRequired', selectionRequired, this);
        }
        if (selectionRequired) {
          ensureSelection(this);
        }
      }
    }, {
      key: 'selectionWraps',
      get: function get() {
        return this[selectionWrapsSymbol];
      },
      set: function set(value) {
        this[selectionWrapsSymbol] = String(value) === 'true';
        if ('selectionWraps' in base.prototype) {
          _set(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectionWraps', value, this);
        }
        updatePossibleNavigations(this);
      }

      /**
       * Fires when the selectedItem property changes.
       *
       * @memberof SingleSelection
       * @event selected-item-changed
       * @param {HTMLElement} detail.selectedItem The new selected item.
       * @param {HTMLElement} detail.previousItem The previously selected item.
       */

      /**
       * Fires when the selectedIndex property changes.
       *
       * @memberof SingleSelection
       * @event selected-index-changed
       * @param {number} detail.selectedIndex The new selected index.
       */

    }]);

    return SingleSelection;
  }(base);

  return SingleSelection;
};

// If no item is selected, select a default item.


function ensureSelection(element) {
  var index = element.selectedIndex;
  if (index < 0) {
    // Selected item is no longer in the current set of items.
    if (element.items && element.items.length > 0) {
      // Select the first item.
      // TODO: If the previously-selected item has been deleted, try to select
      // an item adjacent to the position it held.
      element.selectedIndex = 0;
    } else {
      // No items for us to select, but we can at least signal that there's no
      // longer a selection.
      element.selectedItem = null;
    }
  }
}

// Ensure the given index is within bounds, and select it if it's not already
// selected.
function selectIndex(element, index) {
  var count = element.items.length;

  var boundedIndex = element.selectionWraps ?
  // JavaScript mod doesn't handle negative numbers the way we want to wrap.
  // See http://stackoverflow.com/a/18618250/76472
  (index % count + count) % count :

  // Keep index within bounds of array.
  Math.max(Math.min(index, count - 1), 0);

  var previousIndex = element.selectedIndex;
  if (previousIndex !== boundedIndex) {
    element.selectedIndex = boundedIndex;
    return true;
  } else {
    return false;
  }
}

// Following a change in selection, report whether it's now possible to
// go next/previous from the given index.
function updatePossibleNavigations(element) {
  var canSelectNext = void 0;
  var canSelectPrevious = void 0;
  var items = element.items;
  if (items == null || items.length === 0) {
    // No items to select.
    canSelectNext = false;
    canSelectPrevious = false;
  }if (element.selectionWraps) {
    // Since there are items, can always go next/previous.
    canSelectNext = true;
    canSelectPrevious = true;
  } else {
    var index = element.selectedIndex;
    if (index < 0 && items.length > 0) {
      // Special case. If there are items but no selection, declare that it's
      // always possible to go next/previous to create a selection.
      canSelectNext = true;
      canSelectPrevious = true;
    } else {
      // Normal case: we have an index in a list that has items.
      canSelectPrevious = index > 0;
      canSelectNext = index < items.length - 1;
    }
  }
  element.canSelectNext = canSelectNext;
  element.canSelectPrevious = canSelectPrevious;
}

},{"./createSymbol":15,"./microtask":16,"./symbols":18}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Collective = require('./Collective');

var _Collective2 = _interopRequireDefault(_Collective);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* Exported function extends a base class with TargetInCollective. */
exports.default = function (base) {

  /**
   * Mixin which allows a component to provide aggregate behavior with other
   * elements, e.g., for keyboard handling.
   *
   * This mixin implicitly creates a collective for a component so that it can
   * participate in collective keyboard handling. See the
   * [Collective](Collective.md) class for details.
   *
   * You can use this mixin in conjunction with
   * [ContentFirstChildTarget](ContentFirstChildTarget.md) to automatically have
   * the component's collective extended to its first child.
   */
  var TargetInCollective = function (_base) {
    _inherits(TargetInCollective, _base);

    function TargetInCollective() {
      _classCallCheck(this, TargetInCollective);

      var _this = _possibleConstructorReturn(this, (TargetInCollective.__proto__ || Object.getPrototypeOf(TargetInCollective)).call(this));

      _this.collective = new _Collective2.default(_this);
      return _this;
    }

    /**
     * Gets/sets the current target of the component.
     *
     * Set this to point to another element. That target element will be
     * implicitly added to the component's collective. That is, the component
     * and its target will share responsibility for handling keyboard events.
     *
     * You can set this property yourself, or you can use the
     * ContentFirstChildTarget mixin to automatically set the target to the
     * component's first child.
     *
     * @type {HTMLElement}
     */


    _createClass(TargetInCollective, [{
      key: 'target',
      get: function get() {
        return _get(TargetInCollective.prototype.__proto__ || Object.getPrototypeOf(TargetInCollective.prototype), 'target', this);
      },
      set: function set(element) {
        if ('target' in base.prototype) {
          _set(TargetInCollective.prototype.__proto__ || Object.getPrototypeOf(TargetInCollective.prototype), 'target', element, this);
        }
        this.collective.assimilate(element);
      }
    }]);

    return TargetInCollective;
  }(base);

  return TargetInCollective;
};

},{"./Collective":2}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createSymbol = require('./createSymbol');

var _createSymbol2 = _interopRequireDefault(_createSymbol);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Symbols for private data members on an element.
var itemsChangedListenerSymbol = (0, _createSymbol2.default)('itemsChangedListener');
var selectedItemChangedListenerSymbol = (0, _createSymbol2.default)('selectedItemChangedListener');

/* Exported function extends a base class with TargetSelection. */

exports.default = function (base) {

  /**
   * Mixin which allows a component to delegate its own selection semantics to a
   * target element.
   *
   * This is useful when defining components that act as optional features for a
   * component that acts like a list. See basic-arrow-selection and
   * basic-page-dots for examples of components used as optional features for
   * components like basic-carousel. A typical usage might be:
   *
   *     <basic-arrow-selection>
   *       <basic-carousel>
   *         ... images, etc. ...
   *       </basic-carousel>
   *     </basic-arrow-selection>
   *
   * Because basic-arrow-selection uses the
   * [TargetSelection](TargetSelection.md) mixin, it exposes members to access a
   * selection: `selectNext`, `selectPrevious`, `selectedIndex`, etc. These are
   * all delegated to the child component (here, a basic-carousel).
   *
   * This mixin expects a `target` property to be set to the element actually
   * managing the selection. You can set that property yourself, or you can use
   * the [ContentFirstChildTarget](ContentFirstChildTarget.md) mixin to
   * implicitly take the component's first child as the target. This is what
   * basic-arrow-selection (above) does.
   */
  var TargetSelection = function (_base) {
    _inherits(TargetSelection, _base);

    function TargetSelection() {
      _classCallCheck(this, TargetSelection);

      return _possibleConstructorReturn(this, (TargetSelection.__proto__ || Object.getPrototypeOf(TargetSelection)).apply(this, arguments));
    }

    _createClass(TargetSelection, [{
      key: 'itemsChanged',


      /**
       * This method is invoked when the underlying contents change. It is also
       * invoked on component initialization – since the items have "changed" from
       * being nothing.
       */
      value: function itemsChanged() {
        if (_get(TargetSelection.prototype.__proto__ || Object.getPrototypeOf(TargetSelection.prototype), 'itemsChanged', this)) {
          _get(TargetSelection.prototype.__proto__ || Object.getPrototypeOf(TargetSelection.prototype), 'itemsChanged', this).call(this);
        }
        this.dispatchEvent(new CustomEvent('items-changed'));
      }
    }, {
      key: 'selectedItemChanged',


      // This method exists so wrapping components can handle a change in the
      // selection without potentially re-invoking the selectedItem setter. This
      // is kind of unsatisfying, though. It'd be nicer to let such components
      // just implement the getter/setter for selectedItem, but have a way to
      // know whether they need to also that property getter/setter for the target
      // component.
      value: function selectedItemChanged() {
        if (_get(TargetSelection.prototype.__proto__ || Object.getPrototypeOf(TargetSelection.prototype), 'selectedItemChanged', this)) {
          _get(TargetSelection.prototype.__proto__ || Object.getPrototypeOf(TargetSelection.prototype), 'selectedItemChanged', this).call(this);
        }
        this.dispatchEvent(new CustomEvent('selected-item-changed'));
      }

      /**
       * True if selection navigations wrap from last to first, and vice versa.
       *
       * @type {boolean}
       * @default {false}
       */

    }, {
      key: 'items',


      /**
       * The current set of items in the list.
       *
       * @type {HTMLElement[]}
       */
      get: function get() {
        var target = this.target;
        var items = target && target.items;
        return items || [];
      }
    }, {
      key: 'selectedFraction',
      get: function get() {
        var target = this.target;
        return target && target.selectedFraction;
      },
      set: function set(fraction) {
        if ('selectedFraction' in base.prototype) {
          _set(TargetSelection.prototype.__proto__ || Object.getPrototypeOf(TargetSelection.prototype), 'selectedFraction', fraction, this);
        }
        var target = this.target;
        if (target && target.selectedFraction !== fraction) {
          target.selectedFraction = fraction;
        }
      }

      /**
       * The currently selected item, or null if there is no selection.
       *
       * @type {HTMLElement}
       */

    }, {
      key: 'selectedItem',
      get: function get() {
        var target = this.target;
        return target && target.selectedItem;
      },
      set: function set(item) {
        if ('selectedItem' in base.prototype) {
          _set(TargetSelection.prototype.__proto__ || Object.getPrototypeOf(TargetSelection.prototype), 'selectedItem', item, this);
        }
        var target = this.target;
        if (target) {
          target.selectedItem = item;
        }
      }
    }, {
      key: 'selectionWraps',
      get: function get() {
        var target = this.target;
        return target && target.selectionWraps;
      },
      set: function set(value) {
        if ('selectionWraps' in base.prototype) {
          _set(TargetSelection.prototype.__proto__ || Object.getPrototypeOf(TargetSelection.prototype), 'selectionWraps', value, this);
        }
        var target = this.target;
        if (target) {
          target.selectionWraps = value;
        }
      }

      /**
       * Gets/sets the target element to which this component will delegate
       * selection actions.
       *
       * @type {HTMLElement}
       */

    }, {
      key: 'target',
      get: function get() {
        return _get(TargetSelection.prototype.__proto__ || Object.getPrototypeOf(TargetSelection.prototype), 'target', this);
      },
      set: function set(element) {
        var _this2 = this;

        if ('target' in base.prototype) {
          _set(TargetSelection.prototype.__proto__ || Object.getPrototypeOf(TargetSelection.prototype), 'target', element, this);
        }
        if (this[itemsChangedListenerSymbol]) {
          this.removeEventListener('items-changed', this[itemsChangedListenerSymbol]);
        }
        if (this[selectedItemChangedListenerSymbol]) {
          this.removeEventListener('selected-item-changed', this[selectedItemChangedListenerSymbol]);
        }
        this[itemsChangedListenerSymbol] = element.addEventListener('items-changed', function (event) {
          _this2.itemsChanged();
        });
        this[selectedItemChangedListenerSymbol] = element.addEventListener('selected-item-changed', function (event) {
          // REVIEW: Components applying TargetSelection both listen to this
          // event (on the target), and raise it themselves. In theory, they're
          // expected to *not* catch the events they raise themselves, but Chrome
          // (at least) appears to violate that expectation. That is, it's
          // possible to have event.target === this. More confusingly, the guard
          // below, which is intended to avoid recursive calls to
          // selectedItemChanged, doesn't work as expected. Even if the debugger
          // shows event.target === this, the contents of the "if" statement will
          // be executed.
          if (event.target !== _this2) {
            // Let the component know the target's selection changed, but without
            // re-invoking the selectIndex/selectedItem setter.
            _this2.selectedItemChanged();
          }
        });
        // Force initial refresh.
        this.itemsChanged();
      }
    }]);

    return TargetSelection;
  }(base);

  return TargetSelection;
};

},{"./createSymbol":15}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createSymbol = require('./createSymbol');

var _createSymbol2 = _interopRequireDefault(_createSymbol);

var _symbols = require('./symbols');

var _symbols2 = _interopRequireDefault(_symbols);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var playingSymbol = (0, _createSymbol2.default)('playing');
var selectionTimerDurationSymbol = (0, _createSymbol2.default)('selectionTimerDuration');
var timerTimeoutSymbol = (0, _createSymbol2.default)('timerTimeout');

/* Exported function extends a base class with TimerSelection. */

exports.default = function (base) {

  /**
   * Mixin which provides for automatic timed changes in selection.
   *
   * This mixin is useful for creating slideshow-like elements.
   *
   * This mixin expects the component to define an `items` property, as well as
   * `selectFirst` and `selectNext` methods. You can implement those yourself,
   * or use the [ContentAsItems](ContentAsItems.md) and
   * [SingleSelection](SingleSelection.md) mixins.
   */
  var TimerSelection = function (_base) {
    _inherits(TimerSelection, _base);

    function TimerSelection() {
      _classCallCheck(this, TimerSelection);

      // Set defaults.
      var _this = _possibleConstructorReturn(this, (TimerSelection.__proto__ || Object.getPrototypeOf(TimerSelection)).call(this));

      if (typeof _this.playing === 'undefined') {
        _this.playing = _this[_symbols2.default.defaults].playing;
      }
      if (typeof _this.selectionTimerDuration === 'undefined') {
        _this.selectionTimerDuration = _this[_symbols2.default.defaults].selectionTimerDuration;
      }
      return _this;
    }

    _createClass(TimerSelection, [{
      key: 'contentChanged',
      value: function contentChanged() {
        if (_get(TimerSelection.prototype.__proto__ || Object.getPrototypeOf(TimerSelection.prototype), 'contentChanged', this)) {
          _get(TimerSelection.prototype.__proto__ || Object.getPrototypeOf(TimerSelection.prototype), 'contentChanged', this).call(this);
        }
        restartTimer(this);
      }
    }, {
      key: 'play',


      /**
       * Begin automatic progression of the selection.
       */
      value: function play() {
        if (_get(TimerSelection.prototype.__proto__ || Object.getPrototypeOf(TimerSelection.prototype), 'play', this)) {
          _get(TimerSelection.prototype.__proto__ || Object.getPrototypeOf(TimerSelection.prototype), 'play', this).call(this);
        }
        startTimer(this);
        this[playingSymbol] = true;
      }

      /**
       * Pause automatic progression of the selection.
       */

    }, {
      key: 'pause',
      value: function pause() {
        if (_get(TimerSelection.prototype.__proto__ || Object.getPrototypeOf(TimerSelection.prototype), 'pause', this)) {
          _get(TimerSelection.prototype.__proto__ || Object.getPrototypeOf(TimerSelection.prototype), 'pause', this).call(this);
        }
        clearTimer(this);
        this[playingSymbol] = false;
      }

      /**
       * True if the selection is being automatically advanced.
       *
       * @type {boolean}
       * @default false
       */

    }, {
      key: 'selectedItemChanged',


      // In case this mixin is being used with TargetSelection.
      value: function selectedItemChanged() {
        if (_get(TimerSelection.prototype.__proto__ || Object.getPrototypeOf(TimerSelection.prototype), 'selectedItemChanged', this)) {
          _get(TimerSelection.prototype.__proto__ || Object.getPrototypeOf(TimerSelection.prototype), 'selectedItemChanged', this).call(this);
        }
        restartTimer(this);
      }

      /**
       * The time in milliseconds that will elapse after the selection changes
       * before the selection will be advanced to the next item in the list.
       *
       * @type {number} - Time in milliseconds
       * @default 1000 (1 second)
       */

    }, {
      key: _symbols2.default.defaults,
      get: function get() {
        var defaults = _get(TimerSelection.prototype.__proto__ || Object.getPrototypeOf(TimerSelection.prototype), _symbols2.default.defaults, this) || {};
        defaults.playing = false;
        defaults.selectionTimerDuration = 1000;
        return defaults;
      }
    }, {
      key: 'playing',
      get: function get() {
        return this[playingSymbol];
      },
      set: function set(playing) {
        var previousPlaying = this[playingSymbol];
        var parsed = String(playing) === 'true'; // Cast to boolean
        if ('playing' in base.prototype) {
          _set(TimerSelection.prototype.__proto__ || Object.getPrototypeOf(TimerSelection.prototype), 'playing', playing, this);
        }
        if (parsed !== previousPlaying) {
          if (playing) {
            this.play();
          } else {
            this.pause();
          }
        }
      }

      /*
       * When the selected item changes (because of something this mixin did, or
       * was changed by an outside agent like the user), we wait before advancing
       * to the next item. By triggering the next item this way, we implicitly get
       * a desirable behavior: if the user changes the selection (e.g., in a
       * carousel), we let them see that selection state for a while before
       * advancing the selection ourselves.
       */

    }, {
      key: 'selectedItem',
      get: function get() {
        return _get(TimerSelection.prototype.__proto__ || Object.getPrototypeOf(TimerSelection.prototype), 'selectedItem', this);
      },
      set: function set(item) {
        if ('selectedItem' in base.prototype) {
          _set(TimerSelection.prototype.__proto__ || Object.getPrototypeOf(TimerSelection.prototype), 'selectedItem', item, this);
        }
        restartTimer(this);
      }
    }, {
      key: 'selectionTimerDuration',
      get: function get() {
        return this[selectionTimerDurationSymbol];
      },
      set: function set(value) {
        this[selectionTimerDurationSymbol] = parseInt(value);
        if ('selectionTimerDuration' in base.prototype) {
          _set(TimerSelection.prototype.__proto__ || Object.getPrototypeOf(TimerSelection.prototype), 'selectionTimerDuration', value, this);
        }
      }
    }]);

    return TimerSelection;
  }(base);

  return TimerSelection;
};

function clearTimer(element) {
  if (element[timerTimeoutSymbol]) {
    clearTimeout(element[timerTimeoutSymbol]);
    element[timerTimeoutSymbol] = null;
  }
}

function restartTimer(element) {
  clearTimer(element);
  if (element.playing && element.items && element.items.length > 0) {
    startTimer(element);
  }
}

function startTimer(element) {
  // If play() is called more than once, cancel any existing timer.
  clearTimer(element);
  element[timerTimeoutSymbol] = setTimeout(function () {
    selectNextWithWrap(element);
  }, element.selectionTimerDuration);
}

// Select the next item, wrapping to first item if necessary.
function selectNextWithWrap(element) {
  var items = element.items;
  if (items && items.length > 0) {
    if (element.selectedIndex == null || element.selectedIndex === items.length - 1) {
      element.selectFirst();
    } else {
      element.selectNext();
    }
  }
}

},{"./createSymbol":15,"./symbols":18}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSymbol;
/**
 * Helper function to create a symbol that can be used for associating private
 * data with an element.
 *
 * Mixins and component classes often want to associate private data with an
 * element instance, but JavaScript does not have direct support for true
 * private properties. One approach is to use the
 * [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
 * data type to set and retrieve data on an element.
 *
 * Unfortunately, the Symbol type is not available in Internet Explorer 11. The
 * `createSymbol` helper function exists as a workaround for IE 11. Rather than
 * returning a true Symbol, it simply returns an underscore-prefixed string.
 *
 * Usage:
 *
 *     const fooSymbol = createSymbol('foo');
 *
 *     class MyElement extends HTMLElement {
 *       get foo() {
 *         return this[fooSymbol];
 *       }
 *       set foo(value) {
 *         this[fooSymbol] = value;
 *       }
 *     }
 *
 * In IE 11, this sample will "hide" data behind an instance property this._foo.
 * The use of the underscore is meant to reduce (not eliminate) the potential
 * for name conflicts, and discourage (not prevent) external access to this
 * data. In modern browsers, the above code will eliminate the potential of
 * naming conflicts, and better hide the data behind a real Symbol.
 *
 * @function createSymbol
 * @param {string} description - A string to identify the symbol when debugging
 */
function createSymbol(description) {
  return typeof Symbol === 'function' ? Symbol(description) : '_' + description;
}

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = microtask;
/*
 * Microtask helper for IE 11.
 *
 * Executing a function as a microtask is trivial in browsers that support
 * promises, whose then() clauses use microtask timing. IE 11 doesn't support
 * promises, but does support MutationObservers, which are also executed as
 * microtasks. So this helper uses an MutationObserver to achieve microtask
 * timing.
 *
 * See https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
 *
 * Inspired by Polymer's async() function.
 */

// The queue of pending callbacks to be executed as microtasks.
var callbacks = [];

// Create an element that we will modify to force observable mutations.
var element = document.createTextNode('');

// A monotonically-increasing value.
var counter = 0;

/**
 * Add a callback to the microtask queue.
 *
 * This uses a MutationObserver so that it works on IE 11.
 *
 * NOTE: IE 11 may actually use timeout timing with MutationObservers. This
 * needs more investigation.
 *
 * @function microtask
 * @param {function} callback
 */
function microtask(callback) {
  callbacks.push(callback);
  // Force a mutation.
  element.textContent = ++counter;
}

// Execute any pending callbacks.
function executeCallbacks() {
  while (callbacks.length > 0) {
    var callback = callbacks.shift();
    callback();
  }
}

// Create the observer.
var observer = new MutationObserver(executeCallbacks);
observer.observe(element, {
  characterData: true
});

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createSymbol = require('./createSymbol');

var _createSymbol2 = _interopRequireDefault(_createSymbol);

var _toggleClass2 = require('./toggleClass');

var _toggleClass3 = _interopRequireDefault(_toggleClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Symbols for private data members on an element.
var safeToSetAttributesSymbol = (0, _createSymbol2.default)('safeToSetAttributes');
var pendingAttributesSymbol = (0, _createSymbol2.default)('pendingAttributes');
var pendingClassesSymbol = (0, _createSymbol2.default)('pendingClasses');

/**
 * Helper functions for updating attributes, including the `class` attribute.
 */
exports.default = {

  /**
   * Perform any pending updates to attributes and classes.
   *
   * This writes any `setAttribute` or `toggleClass` values that were performed
   * before an element was attached to the document for the first time.
   *
   * This method should be called by mixins/components in their
   * `connectedCallback`. If mulitple mixins/components invoke this during the
   * same `connectedCallback`, only the first call will have any effect. The
   * subsequent calls will be harmless.
   *
   * @param {HTMLElement} element - The element being added to the document.
   */
  connected: function connected(element) {
    element[safeToSetAttributesSymbol] = true;

    // Set any pending attributes.
    if (element[pendingAttributesSymbol]) {
      for (var attribute in element[pendingAttributesSymbol]) {
        var value = element[pendingAttributesSymbol][attribute];
        setAttributeToElement(element, attribute, value);
      }
      element[pendingAttributesSymbol] = null;
    }

    // Set any pending classes.
    if (element[pendingClassesSymbol]) {
      for (var className in element[pendingClassesSymbol]) {
        var _value = element[pendingClassesSymbol][className];
        (0, _toggleClass3.default)(element, className, _value);
      }
      element[pendingClassesSymbol] = null;
    }
  },


  /**
   * Set/unset the attribute with the indicated name.
   *
   * This method exists primarily to handle the case where an element wants to
   * set a default property value that should be reflected as an attribute. An
   * important limitation of custom element consturctors is that they cannot
   * set attributes. A call to `setAttribute` during the constructor will
   * be deferred until the element is connected to the document.
   *
   * @param {string} attribute - The name of the *attribute* (not property) to set.
   * @param {object} value - The value to set. If null, the attribute will be removed.
   */
  setAttribute: function setAttribute(element, attribute, value) {
    if (element[safeToSetAttributesSymbol]) {
      // Safe to set attributes immediately.
      setAttributeToElement(element, attribute, value);
    } else {
      // Defer setting attributes until the first time we're connected.
      if (!element[pendingAttributesSymbol]) {
        element[pendingAttributesSymbol] = {};
      }
      element[pendingAttributesSymbol][attribute] = value;
    }
  },


  /**
   * Set/unset the class with the indicated name.
   *
   * This method exists primarily to handle the case where an element wants to
   * set a default property value that should be reflected as as class. An
   * important limitation of custom element consturctors is that they cannot
   * set attributes, including the `class` attribute. A call to
   * `toggleClass` during the constructor will be deferred until the element
   * is connected to the document.
   *
   * @param {string} className - The name of the class to set.
   * @param {object} value - True to set the class, false to remove it.
   */
  toggleClass: function toggleClass(element, className, value) {
    if (element[safeToSetAttributesSymbol]) {
      // Safe to set class immediately.
      (0, _toggleClass3.default)(element, className, value);
    } else {
      // Defer setting class until the first time we're connected.
      if (!element[pendingClassesSymbol]) {
        element[pendingClassesSymbol] = {};
      }
      element[pendingClassesSymbol][className] = value;
    }
  }
};

// Reflect the attribute to the given element.
// If the value is null, remove the attribute.

function setAttributeToElement(element, attributeName, value) {
  if (value === null || typeof value === 'undefined') {
    element.removeAttribute(attributeName);
  } else {
    element.setAttribute(attributeName, value);
  }
}

},{"./createSymbol":15,"./toggleClass":19}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createSymbol = require('./createSymbol');

var _createSymbol2 = _interopRequireDefault(_createSymbol);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A collection of Symbol objects for standard component properties and methods.
 *
 * These Symbol objects are used to allow mixins and a component to internally
 * communicate, without exposing these properties and methods in the component's
 * public API.
 *
 * To use these Symbol objects in your own component, include this module and
 * then create a property or method whose key is the desired Symbol.
 *
 *     import 'SingleSelection' from 'basic-component-mixins/src/SingleSelection';
 *     import 'symbols' from 'basic-component-mixins/src/symbols';
 *
 *     class MyElement extends SingleSelection(HTMLElement) {
 *       [symbols.applySelection](item, selected) {
 *         // This will be invoked whenever an item is selected/deselected.
 *       }
 *     }
 *
 * @module symbols
 */
var symbols = {

  /**
   * Symbol for the `applySelection` method.
   *
   * This method applies the indicated selection state to an item.
   *
   * @function applySelection
   * @param {HTMLElement} item - the item being selected/deselected
   * @param {boolean} selected - true if the item is selected, false if not
   */
  applySelection: (0, _createSymbol2.default)('applySelection'),

  /**
   * Symbol for the `defaults` property.
   *
   * This property can be used to set or override defaults that will be applied
   * to a new component instance. When implementing this property, take care to
   * first acquire any defaults defined by the superclass. The standard idiom is
   * as follows:
   *
   *     get [symbols.defaults]() {
   *       const defaults = super[symbols.defaults] || {};
   *       // Set or override default values here
   *       defaults.customProperty = false;
   *       return defaults;
   *     }
   *
   * @var {object} defaults
   */
  defaults: (0, _createSymbol2.default)('defaults'),

  /**
   * Symbol for the `dragging` property.
   *
   * Components like carousels often define animated CSS transitions for
   * sliding effects. Such a transition should usually *not* be applied while
   * the user is dragging, because a CSS animation will introduce a lag that
   * makes the swipe feel sluggish. Instead, as long as the user is dragging
   * with their finger down, the transition should be suppressed. When the
   * user releases their finger, the transition can be restored, allowing the
   * animation to show the carousel sliding into its final position.
   *
   * @type {boolean} true if a drag is in progress, false if not.
   */
  dragging: (0, _createSymbol2.default)('dragging'),

  /**
   * Symbol for the `goDown` method.
   *
   * This method is invoked when the user wants to go/navigate down.
   *
   * @function goDown
   */
  goDown: (0, _createSymbol2.default)('goDown'),

  /**
   * Symbol for the `goEnd` method.
   *
   * This method is invoked when the user wants to go/navigate to the end (e.g.,
   * of a list).
   *
   * @function goEnd
   */
  goEnd: (0, _createSymbol2.default)('goEnd'),

  /**
   * Symbol for the `goLeft` method.
   *
   * This method is invoked when the user wants to go/navigate left.
   *
   * @function goLeft
   */
  goLeft: (0, _createSymbol2.default)('goLeft'),

  /**
   * Symbol for the `goRight` method.
   *
   * This method is invoked when the user wants to go/navigate right.
   *
   * @function goRight
   */
  goRight: (0, _createSymbol2.default)('goRight'),

  /**
   * Symbol for the `goStart` method.
   *
   * This method is invoked when the user wants to go/navigate to the start
   * (e.g., of a list).
   *
   * @function goStart
   */
  goStart: (0, _createSymbol2.default)('goStart'),

  /**
   * Symbol for the `goUp` method.
   *
   * This method is invoked when the user wants to go/navigate up.
   *
   * @function goUp
   */
  goUp: (0, _createSymbol2.default)('goUp'),

  /**
   * Symbol for the `itemAdded` method.
   *
   * This method is invoked when a new item is added to a list.
   *
   * @function itemAdded
   * @param {HTMLElement} item - the item being selected/deselected
   */
  itemAdded: (0, _createSymbol2.default)('itemAdded'),

  /**
   * Symbol for the `keydown` method.
   *
   * This method is invoked when an element receives a `keydown` event.
   *
   * @function keydown
   * @param {KeyboardEvent} event - the event being processed
   */
  keydown: (0, _createSymbol2.default)('keydown')
};

exports.default = symbols;

},{"./createSymbol":15}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toggleClass;
/**
 * Helper function for standard classList.toggle() behavior on old browsers,
 * namely IE 11.
 *
 * The standard
 * [classlist](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)
 * object has a `toggle()` function that supports a second Boolean parameter
 * that can be used to succinctly turn a class on or off. This feature is often
 * useful in designing custom elements, which may want to externally reflect
 * component state in a CSS class that can be used for styling purposes.
 *
 * Unfortunately, IE 11 does not support the Boolean parameter to
 * `classList.toggle()`. This helper function behaves like the standard
 * `toggle()`, including support for the Boolean parameter, so that it can be
 * used even on IE 11.
 *
 * @function toggleClass
 * @param {HTMLElement} element - The element to modify
 * @param {string} className - The class to add/remove
 * @param {boolean} [force] - Force the class to be added (if true) or removed
 *                            (if false)
 */
function toggleClass(element, className, force) {
  var classList = element.classList;
  var addClass = typeof force === 'undefined' ? !classList.contains(className) : force;
  if (addClass) {
    classList.add(className);
  } else {
    classList.remove(className);
  }
  return addClass;
}

},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Composable = require('../../basic-component-mixins/src/Composable');

var _Composable2 = _interopRequireDefault(_Composable);

var _ShadowTemplate = require('../../basic-component-mixins/src/ShadowTemplate');

var _ShadowTemplate2 = _interopRequireDefault(_ShadowTemplate);

var _ShadowElementReferences = require('../../basic-component-mixins/src/ShadowElementReferences');

var _ShadowElementReferences2 = _interopRequireDefault(_ShadowElementReferences);

var _AttributeMarshalling = require('../../basic-component-mixins/src/AttributeMarshalling');

var _AttributeMarshalling2 = _interopRequireDefault(_AttributeMarshalling);

var _DistributedChildren = require('../../basic-component-mixins/src/DistributedChildren');

var _DistributedChildren2 = _interopRequireDefault(_DistributedChildren);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A sample general-purpose base class for defining custom elements that mixes
 * in some common features: template stamping into a shadow root, shadow element
 * references, marshalling attributes to properties, and retrieving the children
 * distributed to a component.
 *
 * This base class is not special in any way, and is defined only as a
 * convenient shorthand for applying the mixins listed above. You can use this
 * class as a base class for your own elements, or easily create your own base
 * class by applying the same set of mixins.
 *
 * The ElementBase base class does not register itself as a custom element with
 * the browser, and hence cannot be independently instantiated.
 *
 * @mixes AttributeMarshalling 
 * @mixes Composable
 * @mixes DistributedChildren
 * @mixes ShadowElementReferences
 * @mixes ShadowTemplate
 */
var ElementBase = function (_Composable$compose) {
  _inherits(ElementBase, _Composable$compose);

  function ElementBase() {
    _classCallCheck(this, ElementBase);

    return _possibleConstructorReturn(this, (ElementBase.__proto__ || Object.getPrototypeOf(ElementBase)).apply(this, arguments));
  }

  _createClass(ElementBase, [{
    key: 'log',


    /*
     * Debugging utility: logs a message, prefixed by the component's tag.
     */
    value: function log(text) {
      if (_get(ElementBase.prototype.__proto__ || Object.getPrototypeOf(ElementBase.prototype), 'log', this)) {
        _get(ElementBase.prototype.__proto__ || Object.getPrototypeOf(ElementBase.prototype), 'log', this).call(this, text);
      }
      console.log(this.localName + ': ' + text);
    }
  }]);

  return ElementBase;
}((0, _Composable2.default)(HTMLElement).compose(_ShadowTemplate2.default, // before node finding, so shadow root is populated
_ShadowElementReferences2.default, // before marshalling, so properties can use refs
_AttributeMarshalling2.default, _DistributedChildren2.default));

exports.default = ElementBase;

},{"../../basic-component-mixins/src/AttributeMarshalling":1,"../../basic-component-mixins/src/Composable":3,"../../basic-component-mixins/src/DistributedChildren":5,"../../basic-component-mixins/src/ShadowElementReferences":9,"../../basic-component-mixins/src/ShadowTemplate":10}],21:[function(require,module,exports){
'use strict';

var _SlideshowTimer = require('./src/SlideshowTimer');

var _SlideshowTimer2 = _interopRequireDefault(_SlideshowTimer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.Basic = window.Basic || {}; /*
                                    * This file is transpiled to create an ES5-compatible distribution in which
                                    * the package's main feature(s) are available via the window.Basic global.
                                    * If you're already using ES6 yourself, ignore this file, and instead import
                                    * the source file(s) you want from the src folder.
                                    */

window.Basic.SlideshowTimer = _SlideshowTimer2.default;

},{"./src/SlideshowTimer":22}],22:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _ElementBase = require('../../basic-element-base/src/ElementBase');

var _ElementBase2 = _interopRequireDefault(_ElementBase);

var _ContentFirstChildTarget = require('../../basic-component-mixins/src/ContentFirstChildTarget');

var _ContentFirstChildTarget2 = _interopRequireDefault(_ContentFirstChildTarget);

var _DistributedChildrenAsContent = require('../../basic-component-mixins/src/DistributedChildrenAsContent');

var _DistributedChildrenAsContent2 = _interopRequireDefault(_DistributedChildrenAsContent);

var _SingleSelection = require('../../basic-component-mixins/src/SingleSelection');

var _SingleSelection2 = _interopRequireDefault(_SingleSelection);

var _Keyboard = require('../../basic-component-mixins/src/Keyboard');

var _Keyboard2 = _interopRequireDefault(_Keyboard);

var _KeyboardDirection = require('../../basic-component-mixins/src/KeyboardDirection');

var _KeyboardDirection2 = _interopRequireDefault(_KeyboardDirection);

var _symbols = require('../../basic-component-mixins/src/symbols');

var _symbols2 = _interopRequireDefault(_symbols);

var _TargetInCollective = require('../../basic-component-mixins/src/TargetInCollective');

var _TargetInCollective2 = _interopRequireDefault(_TargetInCollective);

var _TargetSelection = require('../../basic-component-mixins/src/TargetSelection');

var _TargetSelection2 = _interopRequireDefault(_TargetSelection);

var _TimerSelection = require('../../basic-component-mixins/src/TimerSelection');

var _TimerSelection2 = _interopRequireDefault(_TimerSelection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var base = _ElementBase2.default.compose(_ContentFirstChildTarget2.default, _DistributedChildrenAsContent2.default, _SingleSelection2.default, _Keyboard2.default, _KeyboardDirection2.default, _TargetInCollective2.default, _TargetSelection2.default, _TimerSelection2.default);

/**
 * Auxiliary component to advance a selection with a timer.
 *
 * This component is generally used to wrap a component like
 * [basic-carousel](../basic-carousel) or the simpler
 * [basic-sliding-carousel](../basic-sliding-carousel) to add slideshow
 * behavior. For a standalone slideshow component, see
 * [basic-slideshow](../basic-slideshow).
 *
 * Example:
 *
 *     <basic-slideshow-timer>
 *       <basic-carousel>
 *         ... images or other elements ...
 *       </basic-carousel>
 *     </basic-slideshow-timer>
 *
 * The basic-slideshow-timer component provides no visible user interface
 * elements, and exists chiefly as a convenience for use in scenarios like the
 * one above. If you're developing a component that will always want to provide
 * slideshow semantics, consider directly applying the
 * [TimerSelection](../basic-component-mixins/docs/TimerSelection.md) mixin
 * to your component.
 *
 * @extends ElementBase
 */

var SlideshowTimer = function (_base) {
  _inherits(SlideshowTimer, _base);

  function SlideshowTimer() {
    _classCallCheck(this, SlideshowTimer);

    return _possibleConstructorReturn(this, (SlideshowTimer.__proto__ || Object.getPrototypeOf(SlideshowTimer)).apply(this, arguments));
  }

  _createClass(SlideshowTimer, [{
    key: _symbols2.default.defaults,
    get: function get() {
      var defaults = _get(SlideshowTimer.prototype.__proto__ || Object.getPrototypeOf(SlideshowTimer.prototype), _symbols2.default.defaults, this) || {};
      defaults.playing = true;
      defaults.selectionAnimationDuration = 500;
      defaults.selectionRequired = true;
      defaults.selectionTimerDuration = 3000;
      return defaults;
    }
  }, {
    key: 'template',
    get: function get() {
      return '\n      <style>\n      :host {\n        position: relative;\n      }\n      </style>\n      <slot></slot>\n    ';
    }
  }]);

  return SlideshowTimer;
}(base);

customElements.define('basic-slideshow-timer', SlideshowTimer);

},{"../../basic-component-mixins/src/ContentFirstChildTarget":4,"../../basic-component-mixins/src/DistributedChildrenAsContent":6,"../../basic-component-mixins/src/Keyboard":7,"../../basic-component-mixins/src/KeyboardDirection":8,"../../basic-component-mixins/src/SingleSelection":11,"../../basic-component-mixins/src/TargetInCollective":12,"../../basic-component-mixins/src/TargetSelection":13,"../../basic-component-mixins/src/TimerSelection":14,"../../basic-component-mixins/src/symbols":18,"../../basic-element-base/src/ElementBase":20}]},{},[21])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwYWNrYWdlcy9iYXNpYy1jb21wb25lbnQtbWl4aW5zL3NyYy9BdHRyaWJ1dGVNYXJzaGFsbGluZy5qcyIsInBhY2thZ2VzL2Jhc2ljLWNvbXBvbmVudC1taXhpbnMvc3JjL0NvbGxlY3RpdmUuanMiLCJwYWNrYWdlcy9iYXNpYy1jb21wb25lbnQtbWl4aW5zL3NyYy9Db21wb3NhYmxlLmpzIiwicGFja2FnZXMvYmFzaWMtY29tcG9uZW50LW1peGlucy9zcmMvQ29udGVudEZpcnN0Q2hpbGRUYXJnZXQuanMiLCJwYWNrYWdlcy9iYXNpYy1jb21wb25lbnQtbWl4aW5zL3NyYy9EaXN0cmlidXRlZENoaWxkcmVuLmpzIiwicGFja2FnZXMvYmFzaWMtY29tcG9uZW50LW1peGlucy9zcmMvRGlzdHJpYnV0ZWRDaGlsZHJlbkFzQ29udGVudC5qcyIsInBhY2thZ2VzL2Jhc2ljLWNvbXBvbmVudC1taXhpbnMvc3JjL0tleWJvYXJkLmpzIiwicGFja2FnZXMvYmFzaWMtY29tcG9uZW50LW1peGlucy9zcmMvS2V5Ym9hcmREaXJlY3Rpb24uanMiLCJwYWNrYWdlcy9iYXNpYy1jb21wb25lbnQtbWl4aW5zL3NyYy9TaGFkb3dFbGVtZW50UmVmZXJlbmNlcy5qcyIsInBhY2thZ2VzL2Jhc2ljLWNvbXBvbmVudC1taXhpbnMvc3JjL1NoYWRvd1RlbXBsYXRlLmpzIiwicGFja2FnZXMvYmFzaWMtY29tcG9uZW50LW1peGlucy9zcmMvU2luZ2xlU2VsZWN0aW9uLmpzIiwicGFja2FnZXMvYmFzaWMtY29tcG9uZW50LW1peGlucy9zcmMvVGFyZ2V0SW5Db2xsZWN0aXZlLmpzIiwicGFja2FnZXMvYmFzaWMtY29tcG9uZW50LW1peGlucy9zcmMvVGFyZ2V0U2VsZWN0aW9uLmpzIiwicGFja2FnZXMvYmFzaWMtY29tcG9uZW50LW1peGlucy9zcmMvVGltZXJTZWxlY3Rpb24uanMiLCJwYWNrYWdlcy9iYXNpYy1jb21wb25lbnQtbWl4aW5zL3NyYy9jcmVhdGVTeW1ib2wuanMiLCJwYWNrYWdlcy9iYXNpYy1jb21wb25lbnQtbWl4aW5zL3NyYy9taWNyb3Rhc2suanMiLCJwYWNrYWdlcy9iYXNpYy1jb21wb25lbnQtbWl4aW5zL3NyYy9zYWZlQXR0cmlidXRlcy5qcyIsInBhY2thZ2VzL2Jhc2ljLWNvbXBvbmVudC1taXhpbnMvc3JjL3N5bWJvbHMuanMiLCJwYWNrYWdlcy9iYXNpYy1jb21wb25lbnQtbWl4aW5zL3NyYy90b2dnbGVDbGFzcy5qcyIsInBhY2thZ2VzL2Jhc2ljLWVsZW1lbnQtYmFzZS9zcmMvRWxlbWVudEJhc2UuanMiLCJwYWNrYWdlcy9iYXNpYy1zbGlkZXNob3ctdGltZXIvZ2xvYmFscy5qcyIsInBhY2thZ2VzL2Jhc2ljLXNsaWRlc2hvdy10aW1lci9zcmMvU2xpZGVzaG93VGltZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7OztBQUdBO0FBQ0EsSUFBTSwyQkFBMkIsRUFBakM7QUFDQSxJQUFNLDRCQUE0QixFQUFsQzs7QUFHQTs7a0JBQ2UsVUFBQyxJQUFELEVBQVU7O0FBRXZCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUZ1QixNQXFDakIsb0JBckNpQjtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOzs7QUF1Q3JCOzs7QUF2Q3FCLCtDQTBDSSxhQTFDSixFQTBDbUIsUUExQ25CLEVBMEM2QixRQTFDN0IsRUEwQ3VDO0FBQzFELHVKQUFvQztBQUFFO0FBQW1DO0FBQ3pFLFlBQU0sZUFBZSx3QkFBd0IsYUFBeEIsQ0FBckI7QUFDQTtBQUNBO0FBQ0EsWUFBSSxnQkFBZ0IsSUFBaEIsSUFBd0IsRUFBRSxnQkFBZ0IsWUFBWSxTQUE5QixDQUE1QixFQUFzRTtBQUNwRSxlQUFLLFlBQUwsSUFBcUIsUUFBckI7QUFDRDtBQUNGO0FBbERvQjtBQUFBO0FBQUEsMENBb0REO0FBQ2xCLGdK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Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBR0EsSUFBTSxPQUFPLHNCQUFZLE9BQVosME9BQWI7O0FBWUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTBCTSxjOzs7Ozs7Ozs7O1NBRUMsa0JBQVEsUTt3QkFBWTtBQUN2QixVQUFNLFdBQVcsNEZBQU0sa0JBQVEsUUFBZCxXQUEyQixFQUE1QztBQUNBLGVBQVMsT0FBVCxHQUFtQixJQUFuQjtBQUNBLGVBQVMsMEJBQVQsR0FBc0MsR0FBdEM7QUFDQSxlQUFTLGlCQUFULEdBQTZCLElBQTdCO0FBQ0EsZUFBUyxzQkFBVCxHQUFrQyxJQUFsQztBQUNBLGFBQU8sUUFBUDtBQUNEOzs7d0JBRWM7QUFDYjtBQVFEOzs7O0VBcEIwQixJOztBQXlCN0IsZUFBZSxNQUFmLENBQXNCLHVCQUF0QixFQUErQyxjQUEvQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgc2FmZUF0dHJpYnV0ZXMgZnJvbSAnLi9zYWZlQXR0cmlidXRlcyc7XG5cblxuLy8gTWVtb2l6ZWQgbWFwcyBvZiBhdHRyaWJ1dGUgdG8gcHJvcGVydHkgbmFtZXMgYW5kIHZpY2UgdmVyc2EuXG5jb25zdCBhdHRyaWJ1dGVUb1Byb3BlcnR5TmFtZXMgPSB7fTtcbmNvbnN0IHByb3BlcnR5TmFtZXNUb0F0dHJpYnV0ZXMgPSB7fTtcblxuXG4vKiBFeHBvcnRlZCBmdW5jdGlvbiBleHRlbmRzIGEgYmFzZSBjbGFzcyB3aXRoIEF0dHJpYnV0ZU1hcnNoYWxsaW5nLiAqL1xuZXhwb3J0IGRlZmF1bHQgKGJhc2UpID0+IHtcblxuICAvKipcbiAgICogTWl4aW4gd2hpY2ggbWFyc2hhbGxzIGF0dHJpYnV0ZXMgdG8gcHJvcGVydGllcyBhbmQgdmljZSB2ZXJzYS5cbiAgICpcbiAgICogSWYgeW91ciBjb21wb25lbnQgZXhwb3NlcyBhIHNldHRlciBmb3IgYSBwcm9wZXJ0eSwgaXQncyBnZW5lcmFsbHkgYSBnb29kXG4gICAqIGlkZWEgdG8gbGV0IGRldnMgdXNpbmcgeW91ciBjb21wb25lbnQgYmUgYWJsZSB0byBzZXQgdGhhdCBwcm9wZXJ0eSBpbiBIVE1MXG4gICAqIHZpYSBhbiBlbGVtZW50IGF0dHJpYnV0ZS4gWW91IGNhbiBjb2RlIHRoYXQgeW91cnNlbGYgYnkgd3JpdGluZyBhblxuICAgKiBgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrYCwgb3IgeW91IGNhbiB1c2UgdGhpcyBtaXhpbiB0byBnZXQgYSBkZWdyZWUgb2ZcbiAgICogYXV0b21hdGljIHN1cHBvcnQuXG4gICAqXG4gICAqIFRoaXMgbWl4aW4gaW1wbGVtZW50cyBhbiBgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrYCB0aGF0IHdpbGwgYXR0ZW1wdCB0b1xuICAgKiBjb252ZXJ0IGEgY2hhbmdlIGluIGFuIGVsZW1lbnQgYXR0cmlidXRlIGludG8gYSBjYWxsIHRvIHRoZSBjb3JyZXNwb25kaW5nXG4gICAqIHByb3BlcnR5IHNldHRlci4gQXR0cmlidXRlcyB0eXBpY2FsbHkgZm9sbG93IGh5cGhlbmF0ZWQgbmFtZXMgKFwiZm9vLWJhclwiKSxcbiAgICogd2hlcmVhcyBwcm9wZXJ0aWVzIHR5cGljYWxseSB1c2UgY2FtZWxDYXNlIG5hbWVzIChcImZvb0JhclwiKS4gVGhpcyBtaXhpblxuICAgKiByZXNwZWN0cyB0aGF0IGNvbnZlbnRpb24sIGF1dG9tYXRpY2FsbHkgbWFwcGluZyB0aGUgaHlwaGVuYXRlZCBhdHRyaWJ1dGVcbiAgICogbmFtZSB0byB0aGUgY29ycmVzcG9uZGluZyBjYW1lbENhc2UgcHJvcGVydHkgbmFtZS5cbiAgICpcbiAgICogRXhhbXBsZTogWW91IGRlZmluZSBhIGNvbXBvbmVudCB1c2luZyB0aGlzIG1peGluOlxuICAgKlxuICAgKiAgICAgY2xhc3MgTXlFbGVtZW50IGV4dGVuZHMgQXR0cmlidXRlTWFyc2hhbGxpbmcoSFRNTEVsZW1lbnQpIHtcbiAgICogICAgICAgZ2V0IGZvb0JhcigpIHsgcmV0dXJuIHRoaXMuX2Zvb0JhcjsgfVxuICAgKiAgICAgICBzZXQgZm9vQmFyKHZhbHVlKSB7IHRoaXMuX2Zvb0JhciA9IHZhbHVlOyB9XG4gICAqICAgICB9XG4gICAqICAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ215LWVsZW1lbnQnLCBNeUVsZW1lbnQpO1xuICAgKlxuICAgKiBJZiBzb21lb25lIHRoZW4gaW5zdGFudGlhdGVzIHlvdXIgY29tcG9uZW50IGluIEhUTUw6XG4gICAqXG4gICAqICAgICA8bXktZWxlbWVudCBmb28tYmFyPVwiSGVsbG9cIj48L215LWVsZW1lbnQ+XG4gICAqXG4gICAqIFRoZW4sIGFmdGVyIHRoZSBlbGVtZW50IGhhcyBiZWVuIHVwZ3JhZGVkLCB0aGUgYGZvb0JhcmAgc2V0dGVyIHdpbGxcbiAgICogYXV0b21hdGljYWxseSBiZSBpbnZva2VkIHdpdGggdGhlIGluaXRpYWwgdmFsdWUgXCJIZWxsb1wiLlxuICAgKlxuICAgKiBGb3IgdGhlIHRpbWUgYmVpbmcsIHRoaXMgbWl4aW4gb25seSBzdXBwb3J0cyBzdHJpbmctdmFsdWVkIHByb3BlcnRpZXMuXG4gICAqIElmIHlvdSdkIGxpa2UgdG8gY29udmVydCBzdHJpbmcgYXR0cmlidXRlcyB0byBvdGhlciB0eXBlcyAobnVtYmVycyxcbiAgICogYm9vbGVhbnMpLCB5b3UgbmVlZCB0byBpbXBsZW1lbnQgYGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFja2AgeW91cnNlbGYuXG4gICAqL1xuICBjbGFzcyBBdHRyaWJ1dGVNYXJzaGFsbGluZyBleHRlbmRzIGJhc2Uge1xuXG4gICAgLypcbiAgICAgKiBIYW5kbGUgYSBjaGFuZ2UgdG8gdGhlIGF0dHJpYnV0ZSB3aXRoIHRoZSBnaXZlbiBuYW1lLlxuICAgICAqL1xuICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyaWJ1dGVOYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAgIGlmIChzdXBlci5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2spIHsgc3VwZXIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKCk7IH1cbiAgICAgIGNvbnN0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgLy8gSWYgdGhlIGF0dHJpYnV0ZSBuYW1lIGNvcnJlc3BvbmRzIHRvIGEgcHJvcGVydHkgbmFtZSwgc2V0IHRoZSBwcm9wZXJ0eS5cbiAgICAgIC8vIElnbm9yZSBzdGFuZGFyZCBIVE1MRWxlbWVudCBwcm9wZXJ0aWVzIGhhbmRsZWQgYnkgdGhlIERPTS5cbiAgICAgIGlmIChwcm9wZXJ0eU5hbWUgaW4gdGhpcyAmJiAhKHByb3BlcnR5TmFtZSBpbiBIVE1MRWxlbWVudC5wcm90b3R5cGUpKSB7XG4gICAgICAgIHRoaXNbcHJvcGVydHlOYW1lXSA9IG5ld1ZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgaWYgKHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKSB7IHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7IH1cbiAgICAgIHNhZmVBdHRyaWJ1dGVzLmNvbm5lY3RlZCh0aGlzKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcbiAgICAgIHJldHVybiBhdHRyaWJ1dGVzRm9yQ2xhc3ModGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0L3Vuc2V0IHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgaW5kaWNhdGVkIG5hbWUuXG4gICAgICpcbiAgICAgKiBUaGlzIG1ldGhvZCBleGlzdHMgcHJpbWFyaWx5IHRvIGhhbmRsZSB0aGUgY2FzZSB3aGVyZSBhbiBlbGVtZW50IHdhbnRzIHRvXG4gICAgICogc2V0IGEgZGVmYXVsdCBwcm9wZXJ0eSB2YWx1ZSB0aGF0IHNob3VsZCBiZSByZWZsZWN0ZWQgYXMgYW4gYXR0cmlidXRlLiBBblxuICAgICAqIGltcG9ydGFudCBsaW1pdGF0aW9uIG9mIGN1c3RvbSBlbGVtZW50IGNvbnN0dXJjdG9ycyBpcyB0aGF0IHRoZXkgY2Fubm90XG4gICAgICogc2V0IGF0dHJpYnV0ZXMuIEEgY2FsbCB0byBgcmVmbGVjdEF0dHJpYnV0ZWAgZHVyaW5nIHRoZSBjb25zdHJ1Y3RvciB3aWxsXG4gICAgICogYmUgZGVmZXJyZWQgdW50aWwgdGhlIGVsZW1lbnQgaXMgY29ubmVjdGVkIHRvIHRoZSBkb2N1bWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGUgLSBUaGUgbmFtZSBvZiB0aGUgKmF0dHJpYnV0ZSogKG5vdCBwcm9wZXJ0eSkgdG8gc2V0LlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBzZXQuIElmIG51bGwsIHRoZSBhdHRyaWJ1dGUgd2lsbCBiZSByZW1vdmVkLlxuICAgICAqL1xuICAgIHJlZmxlY3RBdHRyaWJ1dGUoYXR0cmlidXRlLCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHNhZmVBdHRyaWJ1dGVzLnNldEF0dHJpYnV0ZSh0aGlzLCBhdHRyaWJ1dGUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQvdW5zZXQgdGhlIGNsYXNzIHdpdGggdGhlIGluZGljYXRlZCBuYW1lLlxuICAgICAqXG4gICAgICogVGhpcyBtZXRob2QgZXhpc3RzIHByaW1hcmlseSB0byBoYW5kbGUgdGhlIGNhc2Ugd2hlcmUgYW4gZWxlbWVudCB3YW50cyB0b1xuICAgICAqIHNldCBhIGRlZmF1bHQgcHJvcGVydHkgdmFsdWUgdGhhdCBzaG91bGQgYmUgcmVmbGVjdGVkIGFzIGFzIGNsYXNzLiBBblxuICAgICAqIGltcG9ydGFudCBsaW1pdGF0aW9uIG9mIGN1c3RvbSBlbGVtZW50IGNvbnN0dXJjdG9ycyBpcyB0aGF0IHRoZXkgY2Fubm90XG4gICAgICogc2V0IGF0dHJpYnV0ZXMsIGluY2x1ZGluZyB0aGUgYGNsYXNzYCBhdHRyaWJ1dGUuIEEgY2FsbCB0b1xuICAgICAqIGByZWZsZWN0Q2xhc3NgIGR1cmluZyB0aGUgY29uc3RydWN0b3Igd2lsbCBiZSBkZWZlcnJlZCB1bnRpbCB0aGUgZWxlbWVudFxuICAgICAqIGlzIGNvbm5lY3RlZCB0byB0aGUgZG9jdW1lbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGNsYXNzIHRvIHNldC5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdmFsdWUgLSBUcnVlIHRvIHNldCB0aGUgY2xhc3MsIGZhbHNlIHRvIHJlbW92ZSBpdC5cbiAgICAgKi9cbiAgICByZWZsZWN0Q2xhc3MoY2xhc3NOYW1lLCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHNhZmVBdHRyaWJ1dGVzLnRvZ2dsZUNsYXNzKHRoaXMsIGNsYXNzTmFtZSwgdmFsdWUpO1xuICAgIH1cblxuICB9XG5cbiAgcmV0dXJuIEF0dHJpYnV0ZU1hcnNoYWxsaW5nO1xufTtcblxuXG4vLyBDb252ZXJ0IGh5cGhlbmF0ZWQgZm9vLWJhciBhdHRyaWJ1dGUgbmFtZSB0byBjYW1lbCBjYXNlIGZvb0JhciBwcm9wZXJ0eSBuYW1lLlxuZnVuY3Rpb24gYXR0cmlidXRlVG9Qcm9wZXJ0eU5hbWUoYXR0cmlidXRlTmFtZSkge1xuICBsZXQgcHJvcGVydHlOYW1lID0gYXR0cmlidXRlVG9Qcm9wZXJ0eU5hbWVzW2F0dHJpYnV0ZU5hbWVdO1xuICBpZiAoIXByb3BlcnR5TmFtZSkge1xuICAgIC8vIENvbnZlcnQgYW5kIG1lbW9pemUuXG4gICAgY29uc3QgaHlwZW5SZWdFeCA9IC8tKFthLXpdKS9nO1xuICAgIHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZU5hbWUucmVwbGFjZShoeXBlblJlZ0V4LFxuICAgICAgICBtYXRjaCA9PiBtYXRjaFsxXS50b1VwcGVyQ2FzZSgpKTtcbiAgICBhdHRyaWJ1dGVUb1Byb3BlcnR5TmFtZXNbYXR0cmlidXRlTmFtZV0gPSBwcm9wZXJ0eU5hbWU7XG4gIH1cbiAgcmV0dXJuIHByb3BlcnR5TmFtZTtcbn1cblxuZnVuY3Rpb24gYXR0cmlidXRlc0ZvckNsYXNzKGNsYXNzRm4pIHtcblxuICAvLyBXZSB0cmVhdCB0aGUgZWxlbWVudCBiYXNlIGNsYXNzZXMgYXMgaWYgdGhleSBoYXZlIG5vIGF0dHJpYnV0ZXMsIHNpbmNlIHdlXG4gIC8vIGRvbid0IHdhbnQgdG8gcmVjZWl2ZSBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sgZm9yIHRoZW0uXG4gIGlmIChjbGFzc0ZuID09PSBIVE1MRWxlbWVudCB8fCBjbGFzc0ZuID09PSBPYmplY3QpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICAvLyBHZXQgYXR0cmlidXRlcyBmb3IgcGFyZW50IGNsYXNzLlxuICBjb25zdCBiYXNlQ2xhc3MgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY2xhc3NGbi5wcm90b3R5cGUpLmNvbnN0cnVjdG9yO1xuICBjb25zdCBiYXNlQXR0cmlidXRlcyA9IGF0dHJpYnV0ZXNGb3JDbGFzcyhiYXNlQ2xhc3MpO1xuXG4gIC8vIEdldCBhdHRyaWJ1dGVzIGZvciB0aGlzIGNsYXNzLlxuICBjb25zdCBwcm9wZXJ0eU5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoY2xhc3NGbi5wcm90b3R5cGUpO1xuICBjb25zdCBzZXR0ZXJOYW1lcyA9IHByb3BlcnR5TmFtZXMuZmlsdGVyKHByb3BlcnR5TmFtZSA9PlxuICAgIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFxuICAgICAgICBjbGFzc0ZuLnByb3RvdHlwZSwgcHJvcGVydHlOYW1lKS5zZXQgPT09ICdmdW5jdGlvbicpO1xuICBjb25zdCBhdHRyaWJ1dGVzID0gc2V0dGVyTmFtZXMubWFwKHNldHRlck5hbWUgPT5cbiAgICAgIHByb3BlcnR5TmFtZVRvQXR0cmlidXRlKHNldHRlck5hbWUpKTtcblxuICAvLyBNZXJnZS5cbiAgY29uc3QgZGlmZiA9IGF0dHJpYnV0ZXMuZmlsdGVyKGF0dHJpYnV0ZSA9PlxuICAgICAgYmFzZUF0dHJpYnV0ZXMuaW5kZXhPZihhdHRyaWJ1dGUpIDwgMCk7XG4gIHJldHVybiBiYXNlQXR0cmlidXRlcy5jb25jYXQoZGlmZik7XG59XG5cbi8vIENvbnZlcnQgYSBjYW1lbCBjYXNlIGZvb0JhciBwcm9wZXJ0eSBuYW1lIHRvIGEgaHlwaGVuYXRlZCBmb28tYmFyIGF0dHJpYnV0ZS5cbmZ1bmN0aW9uIHByb3BlcnR5TmFtZVRvQXR0cmlidXRlKHByb3BlcnR5TmFtZSkge1xuICBsZXQgYXR0cmlidXRlID0gcHJvcGVydHlOYW1lc1RvQXR0cmlidXRlc1twcm9wZXJ0eU5hbWVdO1xuICBpZiAoIWF0dHJpYnV0ZSkge1xuICAgIC8vIENvbnZlcnQgYW5kIG1lbW9pemUuXG4gICAgY29uc3QgdXBwZXJjYXNlUmVnRXggPSAvKFtBLVpdKS9nO1xuICAgIGF0dHJpYnV0ZSA9IHByb3BlcnR5TmFtZS5yZXBsYWNlKHVwcGVyY2FzZVJlZ0V4LCAnLSQxJykudG9Mb3dlckNhc2UoKTtcbiAgfVxuICByZXR1cm4gYXR0cmlidXRlO1xufVxuIiwiLyoqXG4gKiBBIGdyb3VwIG9mIGVsZW1lbnRzIHRoYXQgaGF2ZSBiZWVuIGFzc29jaWF0ZWQgZm9yIHRoZSBwdXJwb3NlIG9mXG4gKiBhY2NvbXBsaXNoaW5nIHNvbWUgY29sbGVjdGl2ZSBiZWhhdmlvciwgZS5nLiwga2V5Ym9hcmQgaGFuZGxpbmcuXG4gKlxuICogVGhlcmUgYXJlIGNlcnRhaW4gY29tcG9uZW50cyB0aGF0IHdhbnQgdG8gY29vcGVyYXRpdmVseSBoYW5kbGUgdGhlIGtleWJvYXJkLlxuICogRm9yIGV4YW1wbGUsIHRoZSBiYXNpYy1hcnJvdy1zZWxlY3Rpb24gYW5kIGJhc2ljLXBhZ2UtZG90cyBjb21wb25lbnRzIGFyZVxuICogb3B0aW9uYWwgY29tcG9uZW50cyB0aGF0IGNhbiBhdWdtZW50IHRoZSBhcHBlYXJhbmNlIGFuZCBiZWhhdmlvciBvZiBhbiBpbm5lclxuICogYmFzaWMtY2Fyb3VzZWwsIGFkZGluZyBhcnJvdyBidXR0b25zIGFuZCBkb3QgYnV0dG9ucywgcmVzcGVjdGl2ZWx5LiBXaGVuXG4gKiB0aGVzZSBjb21wb25lbnRzIGFyZSBuZXN0ZWQgdG9nZXRoZXIsIHRoZXkgZm9ybSBhbiBpbXBsaWNpdCB1bml0IGNhbGxlZCBhXG4gKiAqY29sbGVjdGl2ZSo6XG4gKlxuICogICAgIDxiYXNpYy1hcnJvdy1zZWxlY3Rpb24+XG4gKiAgICAgICA8YmFzaWMtcGFnZS1kb3RzPlxuICogICAgICAgICA8YmFzaWMtY2Fyb3VzZWw+XG4gKiAgICAgICAgICAgLi4uIGltYWdlcywgZXRjLiAuLi5cbiAqICAgICAgICAgPC9iYXNpYy1jYXJvdXNlbD5cbiAqICAgICAgIDwvYmFzaWMtcGFnZS1kb3RzPlxuICogICAgIDwvYmFzaWMtYXJyb3ctc2VsZWN0aW9uPlxuICpcbiAqIEluIHRoaXMgY29uZmlndXJhdGlvbiwgdGhlIHRocmVlIGNvbXBvbmVudHMgd2lsbCBhbGwgaGF2ZSBhIGB0aGlzLmNvbGxlY3RpdmVgXG4gKiByZWZlcmVuY2UgdGhhdCByZWZlcnMgdG8gYSBzaGFyZWQgaW5zdGFuY2Ugb2YgdGhlIGBDb2xsZWN0aXZlYCBjbGFzcy5cbiAqXG4gKiBUaGUgW0tleWJvYXJkXShLZXlib2FyZC5tZCkgbWl4aW4gdGhleSB1c2UgaXMgc2Vuc2l0aXZlIHRvIHRoZSBwcmVzZW5jZSBvZlxuICogdGhlIGNvbGxlY3RpdmUuIEFtb25nIG90aGVyIHRoaW5ncywgaXQgd2lsbCBlbnN1cmUgdGhhdCBvbmx5IHRoZSBvdXRlcm1vc3RcbiAqIGVsZW1lbnQgYWJvdmUg4oCUwqB0aGUgYmFzaWMtYXJyb3ctc2VsZWN0aW9uIOKAlMKgd2lsbCBiZSBhIHRhYiBzdG9wIHRoYXQgY2FuXG4gKiByZWNlaXZlIHRoZSBrZXlib2FyZCBmb2N1cy4gVGhpcyBsZXRzIHRoZSB1c2VyIHBlcmNlaXZlIHRoZSBjb21wb25lbnRcbiAqIGFycmFuZ2VtZW50IGFib3ZlIGFzIGEgc2luZ2xlIHVuaXQuIFRoZSBLZXlib2FyZCBtaXhpbiB3aWxsIGFsc28gZ2l2ZSBlYWNoXG4gKiBlbGVtZW50IGluIHRoZSBjb2xsZWN0aXZlIGEgY2hhbmNlIHRvIHByb2Nlc3MgYW55IGtleWJvYXJkIGV2ZW50cy4gU28sIGV2ZW5cbiAqIHRob3VnaCB0aGUgYmFzaWMtYXJyb3ctc2VsZWN0aW9uIGVsZW1lbnQgd2lsbCBoYXZlIHRoZSBmb2N1cywgdGhlIHN0YW5kYXJkXG4gKiBrZXlib2FyZCBuYXZpZ2F0aW9uIHByb3ZpZGVkIGJ5IGJhc2ljLWNhcm91c2VsIHdpbGwgY29udGludWUgdG8gd29yay5cbiAqXG4gKiBUaGUgW1NlbGVjdGlvbkFyaWFBY3RpdmVdKFNlbGVjdGlvbkFyaWFBY3RpdmUubWQpIG1peGluIGFsc28gcmVzcGVjdHNcbiAqIGNvbGxlY3RpdmVzIHdoZW4gdXNpbmcgdGhlIGBhcmlhLWFjdGl2ZWRlc2NlbmRhbnRgIGFuZCBgcm9sZWAgYXR0cmlidXRlcy5cbiAqIFRob3NlIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgb3V0ZXJtb3N0IGVsZW1lbnQgKGJhc2ljLWFycm93LXNlbGVjdGlvbiwgYWJvdmUpXG4gKiBzbyB0aGF0IEFSSUEgY2FuIGNvcnJlY3RseSB1bmRlcnN0YW5kIHRoZSBhcnJhbmdlbWVudCBvZiB0aGUgZWxlbWVudHMuXG4gKlxuICogWW91IGNhbiBwdXQgZWxlbWVudHMgaW50byBjb2xsZWN0aXZlcyB5b3Vyc2VsZiwgb3IgeW91IGNhbiB1c2UgdGhlXG4gKiBbVGFyZ2V0SW5Db2xsZWN0aXZlXShUYXJnZXRJbkNvbGxlY3RpdmUubWQpIG1peGluLlxuICovXG5jbGFzcyBDb2xsZWN0aXZlIHtcblxuICAvKipcbiAgICogQ3JlYXRlIGEgY29sbGVjdGl2ZS5cbiAgICpcbiAgICogQHBhcmFtIHtIVE1MRUxlbWVudFtdfSBbZWxlbWVudHNdIC0gSW5pdGlhbCBlbGVtZW50cyB0byBhZGQuXG4gICAqL1xuICBjb25zdHJ1Y3RvciguLi5lbGVtZW50cykge1xuICAgIC8qKlxuICAgICAqIFRoZSBlbGVtZW50cyBpbiB0aGUgY29sbGVjdGl2ZS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtIVE1MRWxlbWVudFtdfVxuICAgICAqL1xuICAgIHRoaXMuZWxlbWVudHMgPSBbXTtcbiAgICBlbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4gdGhpcy5hc3NpbWlsYXRlKGVsZW1lbnQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdGhlIGluZGljYXRlZCB0YXJnZXQgdG8gdGhlIGNvbGxlY3RpdmUuXG4gICAqXG4gICAqIEJ5IGNvbnZlbnRpb24sIGlmIHR3byBlbGVtZW50cyB3YW50cyB0byBwYXJ0aWNpcGF0ZSBpbiBhIGNvbGxlY3RpdmUsIGFuZFxuICAgKiBvbmUgZWxlbWVudCBpcyBhbiBhbmNlc3RvciBvZiB0aGUgb3RoZXIgaW4gdGhlIERPTSwgdGhlIGFuY2VzdG9yIHNob3VsZFxuICAgKiBhc3NpbWlsYXRlIHRoZSBkZXNjZW5kYW50IGluc3RlYWQgb2YgdGhlIG90aGVyIHdheSBhcm91bmQuXG4gICAqXG4gICAqIEFmdGVyIGFzc2ltaWxhdGlvbiwgYW55IGVsZW1lbnQgaW4gdGhlIGNvbGxlY3RpdmUgdGhhdCBkZWZpbmVzIGFcbiAgICogYGNvbGxlY3RpdmVDaGFuZ2VkYCBtZXRob2Qgd2lsbCBoYXZlIHRoYXQgbWV0aG9kIGludm9rZWQuIFRoaXMgYWxsb3dzXG4gICAqIHRoZSBjb2xsZWN0aXZlJ3MgZWxlbWVudHMgdG8gcmVzcG9uZCB0byBjaGFuZ2VzIGluIHRoZSBjb2xsZWN0aXZlLlxuICAgKlxuICAgKiBAcGFyYW0geyhIVE1MRWxlbWVudHxDb2xsZWN0aXZlKX0gdGFyZ2V0IC0gVGhlIGVsZW1lbnQgb3IgY29sbGVjdGl2ZSB0byBhZGQuXG4gICAqL1xuICBhc3NpbWlsYXRlKHRhcmdldCkge1xuICAgIGxldCBjb2xsZWN0aXZlQ2hhbmdlZDtcbiAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgQ29sbGVjdGl2ZSkge1xuICAgICAgY29sbGVjdGl2ZUNoYW5nZWQgPSBhc3NpbWlsYXRlQ29sbGVjdGl2ZSh0aGlzLCB0YXJnZXQpO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0LmNvbGxlY3RpdmUpIHtcbiAgICAgIC8vIFRhcmdldCBpcyBhbHJlYWR5IHBhcnQgb2YgYSBjb2xsZWN0aXZlLCBhc3NpbWlsYXRlIGl0LlxuICAgICAgY29sbGVjdGl2ZUNoYW5nZWQgPSBhc3NpbWlsYXRlQ29sbGVjdGl2ZSh0aGlzLCB0YXJnZXQuY29sbGVjdGl2ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEFzc2ltaWxhdGUgYW4gaW5kaXZpZHVhbCBlbGVtZW50LlxuICAgICAgY29sbGVjdGl2ZUNoYW5nZWQgPSBhc3NpbWlsYXRlRWxlbWVudCh0aGlzLCB0YXJnZXQpO1xuICAgIH1cblxuICAgIGlmIChjb2xsZWN0aXZlQ2hhbmdlZCkge1xuICAgICAgdGhpcy5pbnZva2VNZXRob2QoJ2NvbGxlY3RpdmVDaGFuZ2VkJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEludm9rZSBhIG1ldGhvZCBvbiBhbGwgZWxlbWVudHMgaW4gdGhlIGNvbGxlY3RpdmUuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2QgLSBUaGUgbmFtZSBvZiB0aGUgbWV0aG9kIHRvIGludm9rZSBvbiBhbGwgZWxlbWVudHMuXG4gICAqIEBwYXJhbSB7b2JqZWN0W119IFthcmdzXSAtIFRoZSBhcmd1bWVudHMgdG8gdGhlIG1ldGhvZFxuICAgKi9cbiAgaW52b2tlTWV0aG9kKG1ldGhvZCwgLi4uYXJncykge1xuICAgIC8vIEludm9rZSBmcm9tIGlubmVybW9zdCB0byBvdXRlcm1vc3QuXG4gICAgY29uc3QgZWxlbWVudHMgPSB0aGlzLmVsZW1lbnRzO1xuICAgIGZvciAobGV0IGkgPSBlbGVtZW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgZWxlbWVudCA9IGVsZW1lbnRzW2ldO1xuICAgICAgaWYgKGVsZW1lbnRbbWV0aG9kXSkge1xuICAgICAgICBlbGVtZW50W21ldGhvZF0uYXBwbHkoZWxlbWVudCwgYXJncyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBvdXRlcm1vc3QgZWxlbWVudCBpbiB0aGUgY29sbGVjdGl2ZS5cbiAgICogQnkgY29udmVudGlvbiwgdGhpcyBpcyB0aGUgZmlyc3QgZWxlbWVudCBpbiB0aGUgYGVsZW1lbnRzYCBhcnJheS5cbiAgICovXG4gIGdldCBvdXRlcm1vc3RFbGVtZW50KCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnRzWzBdO1xuICB9XG5cbn1cblxuXG4vLyBUaGUgZmlyc3QgY29sbGVjdGl2ZSBhc3NpbWlsYXRlcyB0aGUgc2Vjb25kLlxuZnVuY3Rpb24gYXNzaW1pbGF0ZUNvbGxlY3RpdmUoY29sbGVjdGl2ZTEsIGNvbGxlY3RpdmUyKSB7XG4gIGlmIChjb2xsZWN0aXZlMSA9PT0gY29sbGVjdGl2ZTIpIHtcbiAgICAvLyBDb2xsZWN0aXZlcyBhcmUgc2FtZTsgaWdub3JlLlxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGVsZW1lbnRzID0gY29sbGVjdGl2ZTIuZWxlbWVudHM7XG5cbiAgLy8gT2xkIGNvbGxlY3RpdmUgd2lsbCBubyBsb25nZXIgaGF2ZSBhbnkgZWxlbWVudHMgb2YgaXRzIG93bi5cbiAgY29sbGVjdGl2ZTIuZWxlbWVudHMgPSBbXTtcblxuICBlbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgIGFzc2ltaWxhdGVFbGVtZW50KGNvbGxlY3RpdmUxLCBlbGVtZW50KTtcbiAgfSk7XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cblxuLy8gQXNzaW1pbGF0ZSB0aGUgaW5kaWNhdGVkIGVsZW1lbnQuXG5mdW5jdGlvbiBhc3NpbWlsYXRlRWxlbWVudChjb2xsZWN0aXZlLCBlbGVtZW50KSB7XG4gIGlmIChlbGVtZW50LmNvbGxlY3RpdmUgPT09IGNvbGxlY3RpdmUpIHtcbiAgICAvLyBBbHJlYWR5IHBhcnQgb2YgdGhpcyBjb2xsZWN0aXZlLlxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBlbGVtZW50LmNvbGxlY3RpdmUgPSBjb2xsZWN0aXZlO1xuICBjb2xsZWN0aXZlLmVsZW1lbnRzLnB1c2goZWxlbWVudCk7XG4gIHJldHVybiB0cnVlO1xufVxuXG5cbmV4cG9ydCBkZWZhdWx0IENvbGxlY3RpdmU7XG4iLCIvKiBFeHBvcnRlZCBmdW5jdGlvbiBleHRlbmRzIGEgYmFzZSBjbGFzcyB3aXRoIENvbXBvc2FibGUuICovXG5leHBvcnQgZGVmYXVsdCAoYmFzZSkgPT4ge1xuXG4gIC8qKlxuICAgKiBNaXhpbiB0byBtYWtlIGEgY2xhc3MgbW9yZSBlYXNpbHkgY29tcG9zYWJsZSB3aXRoIG90aGVyIG1peGlucy5cbiAgICpcbiAgICogVGhpcyBtaXhpbiBjb250cmlidXRlcyBhIGBjb21wb3NlYCBtZXRob2QgdGhhdCBhcHBsaWVzIGEgc2V0IG9mIG1peGluXG4gICAqIGZ1bmN0aW9ucyBhbmQgcmV0dXJucyB0aGUgcmVzdWx0aW5nIG5ldyBjbGFzcy4gVGhpcyBzdWdhciBjYW4gbWFrZSB0aGVcbiAgICogYXBwbGljYXRpb24gb2YgbWFueSBtaXhpbnMgYXQgb25jZSBlYXNpZXIgdG8gcmVhZC5cbiAgICovXG4gIGNsYXNzIENvbXBvc2FibGUgZXh0ZW5kcyBiYXNlIHtcblxuICAgIC8qKlxuICAgICAqIEFwcGx5IGEgc2V0IG9mIG1peGluIGZ1bmN0aW9ucyBvciBtaXhpbiBvYmplY3RzIHRvIHRoZSBwcmVzZW50IGNsYXNzIGFuZFxuICAgICAqIHJldHVybiB0aGUgbmV3IGNsYXNzLlxuICAgICAqXG4gICAgICogSW5zdGVhZCBvZiB3cml0aW5nOlxuICAgICAqXG4gICAgICogICAgIGxldCBNeUNsYXNzID0gTWl4aW4xKE1peGluMihNaXhpbjMoTWl4aW40KE1peGluNShCYXNlQ2xhc3MpKSkpKTtcbiAgICAgKlxuICAgICAqIFlvdSBjYW4gd3JpdGU6XG4gICAgICpcbiAgICAgKiAgICAgbGV0IE15Q2xhc3MgPSBDb21wb3NhYmxlKEJhc2VDbGFzcykuY29tcG9zZShcbiAgICAgKiAgICAgICBNaXhpbjEsXG4gICAgICogICAgICAgTWl4aW4yLFxuICAgICAqICAgICAgIE1peGluMyxcbiAgICAgKiAgICAgICBNaXhpbjQsXG4gICAgICogICAgICAgTWl4aW41XG4gICAgICogICAgICk7XG4gICAgICpcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGNhbiBhbHNvIHRha2UgbWl4aW4gb2JqZWN0cy4gQSBtaXhpbiBvYmplY3QgaXMganVzdCBhXG4gICAgICogc2hvcnRoYW5kIGZvciBhIG1peGluIGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIG5ldyBzdWJjbGFzcyB3aXRoIHRoZSBnaXZlblxuICAgICAqIG1lbWJlcnMuIFRoZSBtaXhpbiBvYmplY3QncyBtZW1iZXJzIGFyZSAqbm90KiBjb3BpZWQgZGlyZWN0bHkgb250byB0aGVcbiAgICAgKiBwcm90b3R5cGUgb2YgdGhlIGJhc2UgY2xhc3MsIGFzIHdpdGggdHJhZGl0aW9uYWwgbWl4aW5zLlxuICAgICAqXG4gICAgICogSW4gYWRkaXRpb24gdG8gcHJvdmlkaW5nIHN5bnRhY3RpYyBzdWdhciwgdGhpcyBtaXhpbiBjYW4gYmUgdXNlZCB0b1xuICAgICAqIGRlZmluZSBhIGNsYXNzIGluIEVTNSwgd2hpY2ggbGFja3MgRVM2J3MgYGNsYXNzYCBrZXl3b3JkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHsuLi5taXhpbnN9IG1peGlucyAtIEEgc2V0IG9mIG1peGluIGZ1bmN0aW9ucyBvciBvYmplY3RzIHRvIGFwcGx5LlxuICAgICAqL1xuICAgIHN0YXRpYyBjb21wb3NlKC4uLm1peGlucykge1xuICAgICAgLy8gV2UgY3JlYXRlIGEgbmV3IHN1YmNsYXNzIGZvciBlYWNoIG1peGluIGluIHR1cm4uIFRoZSByZXN1bHQgYmVjb21lc1xuICAgICAgLy8gdGhlIGJhc2UgY2xhc3MgZXh0ZW5kZWQgYnkgYW55IHN1YnNlcXVlbnQgbWl4aW5zLiBJdCB0dXJucyBvdXQgdGhhdFxuICAgICAgLy8gd2UgY2FuIHVzZSBBcnJheS5yZWR1Y2UoKSB0byBjb25jaXNlbHkgZXhwcmVzcyB0aGlzLCB1c2luZyB0aGUgY3VycmVudFxuICAgICAgLy8gb2JqZWN0IGFzIHRoZSBzZWVkIGZvciByZWR1Y2UoKS5cbiAgICAgIHJldHVybiBtaXhpbnMucmVkdWNlKGNvbXBvc2VDbGFzcywgdGhpcyk7XG4gICAgfVxuXG4gIH1cblxuICByZXR1cm4gQ29tcG9zYWJsZTtcbn07XG5cblxuLy8gUHJvcGVydGllcyBkZWZpbmVkIGJ5IE9iamVjdCB0aGF0IHdlIGRvbid0IHdhbnQgdG8gbWl4aW4uXG5jb25zdCBOT05fTUlYQUJMRV9PQkpFQ1RfUFJPUEVSVElFUyA9IFtcbiAgJ2NvbnN0cnVjdG9yJ1xuXTtcblxuLypcbiAqIEFwcGx5IHRoZSBtaXhpbiB0byB0aGUgZ2l2ZW4gYmFzZSBjbGFzcyB0byByZXR1cm4gYSBuZXcgY2xhc3MuXG4gKiBUaGUgbWl4aW4gY2FuIGVpdGhlciBiZSBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgbW9kaWZpZWQgY2xhc3MsIG9yIGFcbiAqIHBsYWluIG9iamVjdCB3aG9zZSBtZW1iZXJzIHdpbGwgYmUgY29waWVkIHRvIHRoZSBuZXcgY2xhc3MnIHByb3RvdHlwZS5cbiAqL1xuZnVuY3Rpb24gY29tcG9zZUNsYXNzKGJhc2UsIG1peGluKSB7XG4gIGlmICh0eXBlb2YgbWl4aW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBNaXhpbiBmdW5jdGlvblxuICAgIHJldHVybiBtaXhpbihiYXNlKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBNaXhpbiBvYmplY3RcbiAgICBjbGFzcyBTdWJjbGFzcyBleHRlbmRzIGJhc2Uge31cbiAgICBjb3B5T3duUHJvcGVydGllcyhtaXhpbiwgU3ViY2xhc3MucHJvdG90eXBlLCBOT05fTUlYQUJMRV9PQkpFQ1RfUFJPUEVSVElFUyk7XG4gICAgcmV0dXJuIFN1YmNsYXNzO1xuICB9XG59XG5cblxuLypcbiAqIENvcHkgdGhlIGdpdmVuIHByb3BlcnRpZXMvbWV0aG9kcyB0byB0aGUgdGFyZ2V0LlxuICogUmV0dXJuIHRoZSB1cGRhdGVkIHRhcmdldC5cbiAqL1xuZnVuY3Rpb24gY29weU93blByb3BlcnRpZXMoc291cmNlLCB0YXJnZXQsIGlnbm9yZVByb3BlcnR5TmFtZXMgPSBbXSkge1xuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2UpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgaWYgKGlnbm9yZVByb3BlcnR5TmFtZXMuaW5kZXhPZihuYW1lKSA8IDApIHtcbiAgICAgIGNvbnN0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwgbmFtZSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gdGFyZ2V0O1xufVxuIiwiaW1wb3J0IGNyZWF0ZVN5bWJvbCBmcm9tICcuL2NyZWF0ZVN5bWJvbCc7XG5cblxuLy8gU3ltYm9scyBmb3IgcHJpdmF0ZSBkYXRhIG1lbWJlcnMgb24gYW4gZWxlbWVudC5cbmNvbnN0IHRhcmdldFN5bWJvbCA9IGNyZWF0ZVN5bWJvbCgndGFyZ2V0Jyk7XG5cblxuLyogRXhwb3J0ZWQgZnVuY3Rpb24gZXh0ZW5kcyBhIGJhc2UgY2xhc3Mgd2l0aCBDb250ZW50Rmlyc3RDaGlsZFRhcmdldC4gKi9cbmV4cG9ydCBkZWZhdWx0IChiYXNlKSA9PiB7XG5cbiAgLyoqXG4gICAqIE1peGluIHRoYXQgZGVmaW5lcyB0aGUgdGFyZ2V0IG9mIGEgY29tcG9uZW50IOKAlCB0aGUgZWxlbWVudCB0aGUgY29tcG9uZW50IGlzXG4gICAqIG1hbmFnaW5nIG9yIHNvbWVob3cgcmVzcG9uc2libGUgZm9yIOKAlCBhcyBpdHMgZmlyc3QgY2hpbGQuXG4gICAqXG4gICAqIFNvbWUgY29tcG9uZW50cyBzZXJ2ZSB0byBkZWNvcmF0ZSBvciBtb2RpZnkgb3RoZXIgZWxlbWVudHMuIEEgY29tbW9uXG4gICAqIHBhdHRlcm4gaXMgdG8gaGF2ZSBvbmUgY29tcG9uZW50IHdyYXAgYW5vdGhlciwgYW5kIGhhdmUgdGhlIG91dGVyLCBwYXJlbnRcbiAgICogY29tcG9uZW50IGltcGxpY2l0bHkgbW9kaWZ5IHRoZSBjaGlsZC4gVGhpcyBtaXhpbiBmYWNpbGl0YXRlcyB0aGlzIGJ5XG4gICAqIGltcGxpY2l0bHkgdGFraW5nIGFuIGVsZW1lbnQncyBmaXJzdCBjaGlsZCBhcyBpdHMgXCJ0YXJnZXRcIi5cbiAgICpcbiAgICogRXhhbXBsZTpcbiAgICpcbiAgICogICAgIDxvdXRlci1lbGVtZW50PlxuICAgKiAgICAgICA8aW5uZXItZWxlbWVudD48L2lubmVyLWVsZW1lbnQ+XG4gICAqICAgICA8L291dGVyLWVsZW1lbnQ+XG4gICAqXG4gICAqIElmIGBvdXRlci1lbGVtZW50YCB1c2VzIHRoaXMgbWl4aW4sIHRoZW4gaXRzIGB0YXJnZXRgIHByb3BlcnR5IHdpbGwgYmVcbiAgICogc2V0IHRvIHBvaW50IHRvIHRoZSBgaW5uZXItZWxlbWVudGAsIGJlY2F1c2UgdGhhdCBpcyBpdHMgZmlyc3QgY2hpbGQuXG4gICAqXG4gICAqIFRoaXMgbWl4aW4gZXhwZWN0cyBhIGBjb250ZW50YCBwcm9wZXJ0eSB0aGF0IHJldHVybnMgdGhlIGVsZW1lbnQncyBjb250ZW50LlxuICAgKiBZb3UgY2FuIGltcGxlbWVudCB0aGF0IHlvdXJzZWxmLCBvciB1c2UgdGhlXG4gICAqIFtEaXN0cmlidXRlZENoaWxkcmVuQXNDb250ZW50XShEaXN0cmlidXRlZENoaWxkcmVuQXNDb250ZW50Lm1kKSBtaXhpbi5cbiAgICpcbiAgICogVGhpcyBtaXhpbiBjYW4gYmUgY29tYmluZWQgd2l0aCB0aGVcbiAgICogW1RhcmdldEluQ29sbGVjdGl2ZV0oVGFyZ2V0SW5Db2xsZWN0aXZlLm1kKSBtaXhpbiB0byBoYXZlIGEgY29tcG9uZW50XG4gICAqIHBhcnRpY2lwYXRlIGluIGNvbGxlY3RpdmUga2V5Ym9hcmQgaGFuZGxpbmcuXG4gICAqL1xuICBjbGFzcyBDb250ZW50Rmlyc3RDaGlsZFRhcmdldCBleHRlbmRzIGJhc2Uge1xuXG4gICAgY29udGVudENoYW5nZWQoKSB7XG4gICAgICBpZiAoc3VwZXIuY29udGVudENoYW5nZWQpIHsgc3VwZXIuY29udGVudENoYW5nZWQoKTsgfVxuICAgICAgY29uc3QgY29udGVudCA9IHRoaXMuY29udGVudDtcbiAgICAgIGNvbnN0IHRhcmdldCA9IGNvbnRlbnQgJiYgY29udGVudFswXTtcbiAgICAgIC8vIEEgY29tcG9uZW50IHVzaW5nIGEgdGFyZ2V0IHdpbGwgbGlrZWx5IGRvIGEgYnVuY2ggb2Ygd29yayB3aGVuIHRoZVxuICAgICAgLy8gdGFyZ2V0IGNoYW5nZXMsIHNvIG9ubHkgc2V0IHRoZSB0YXJnZXQgaWYgaXQncyBhY3R1YWxseSBjaGFuZ2VkLlxuICAgICAgaWYgKHRhcmdldCAmJiB0YXJnZXQgIT09IHRoaXMudGFyZ2V0KSB7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMvc2V0cyB0aGUgY3VycmVudCB0YXJnZXQgb2YgdGhlIGNvbXBvbmVudC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtIVE1MRWxlbWVudH1cbiAgICAgKi9cbiAgICBnZXQgdGFyZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXNbdGFyZ2V0U3ltYm9sXTtcbiAgICB9XG4gICAgc2V0IHRhcmdldChlbGVtZW50KSB7XG4gICAgICB0aGlzW3RhcmdldFN5bWJvbF0gPSBlbGVtZW50O1xuICAgICAgaWYgKCd0YXJnZXQnIGluIGJhc2UucHJvdG90eXBlKSB7IHN1cGVyLnRhcmdldCA9IGVsZW1lbnQ7IH1cbiAgICB9XG5cbiAgfVxuXG4gIHJldHVybiBDb250ZW50Rmlyc3RDaGlsZFRhcmdldDtcbn07XG4iLCIvKiBFeHBvcnRlZCBmdW5jdGlvbiBleHRlbmRzIGEgYmFzZSBjbGFzcyB3aXRoIERpc3RyaWJ1dGVkQ2hpbGRyZW4uICovXG5leHBvcnQgZGVmYXVsdCAoYmFzZSkgPT4ge1xuXG4gIC8qKlxuICAgKiBNaXhpbiB3aGljaCBkZWZpbmVzIGhlbHBlcnMgZm9yIGFjY2Vzc2luZyBhIGNvbXBvbmVudCdzIGRpc3RyaWJ1dGVkXG4gICAqIGNoaWxkcmVuIGFzIGEgZmxhdHRlbmVkIGFycmF5IG9yIHN0cmluZy5cbiAgICpcbiAgICogVGhlIHN0YW5kYXJkIERPTSBBUEkgcHJvdmlkZXMgc2V2ZXJhbCB3YXlzIG9mIGFjY2Vzc2luZyBjaGlsZCBjb250ZW50OlxuICAgKiBgY2hpbGRyZW5gLCBgY2hpbGROb2Rlc2AsIGFuZCBgdGV4dENvbnRlbnRgLiBOb25lIG9mIHRoZXNlIGZ1bmN0aW9ucyBhcmVcbiAgICogU2hhZG93IERPTSBhd2FyZS4gVGhpcyBtaXhpbiBkZWZpbmVzIHZhcmlhdGlvbnMgb2YgdGhvc2UgZnVuY3Rpb25zIHRoYXRcbiAgICogKmFyZSogU2hhZG93IERPTSBhd2FyZS5cbiAgICpcbiAgICogRXhhbXBsZTogeW91IGNyZWF0ZSBhIGNvbXBvbmVudCBgPGNvdW50LWNoaWxkcmVuPmAgdGhhdCBkaXNwbGF5cyBhIG51bWJlclxuICAgKiBlcXVhbCB0byB0aGUgbnVtYmVyIG9mIGNoaWxkcmVuIHBsYWNlZCBpbnNpZGUgdGhhdCBjb21wb25lbnQuIElmIHNvbWVvbmVcbiAgICogaW5zdGFudGlhdGVzIHlvdXIgY29tcG9uZW50IGxpa2U6XG4gICAqXG4gICAqICAgICA8Y291bnQtY2hpbGRyZW4+XG4gICAqICAgICAgIDxkaXY+PC9kaXY+XG4gICAqICAgICAgIDxkaXY+PC9kaXY+XG4gICAqICAgICAgIDxkaXY+PC9kaXY+XG4gICAqICAgICA8L2NvdW50LWNoaWxkcmVuPlxuICAgKlxuICAgKiBUaGVuIHRoZSBjb21wb25lbnQgc2hvdWxkIHNob3cgXCIzXCIsIGJlY2F1c2UgdGhlcmUgYXJlIHRocmVlIGNoaWxkcmVuLiBUb1xuICAgKiBjYWxjdWxhdGUgdGhlIG51bWJlciBvZiBjaGlsZHJlbiwgdGhlIGNvbXBvbmVudCBjYW4ganVzdCBjYWxjdWxhdGVcbiAgICogYHRoaXMuY2hpbGRyZW4ubGVuZ3RoYC4gSG93ZXZlciwgc3VwcG9zZSBzb21lb25lIGluc3RhbnRpYXRlcyB5b3VyXG4gICAqIGNvbXBvbmVudCBpbnNpZGUgb25lIG9mIHRoZWlyIG93biBjb21wb25lbnRzLCBhbmQgcHV0cyBhIGA8c2xvdD5gIGVsZW1lbnRcbiAgICogaW5zaWRlIHlvdXIgY29tcG9uZW50OlxuICAgKlxuICAgKiAgICAgPGNvdW50LWNoaWxkcmVuPlxuICAgKiAgICAgICA8c2xvdD48L3Nsb3Q+XG4gICAqICAgICA8L2NvdW50LWNoaWxkcmVuPlxuICAgKlxuICAgKiBJZiB5b3VyIGNvbXBvbmVudCBvbmx5IGxvb2tzIGF0IGB0aGlzLmNoaWxkcmVuYCwgaXQgd2lsbCBhbHdheXMgc2VlIGV4YWN0bHlcbiAgICogb25lIGNoaWxkIOKAlMKgdGhlIGA8c2xvdD5gIGVsZW1lbnQuIEJ1dCB0aGUgdXNlciBsb29raW5nIGF0IHRoZSBwYWdlIHdpbGxcbiAgICogKnNlZSogYW55IG5vZGVzIGRpc3RyaWJ1dGVkIHRvIHRoYXQgc2xvdC4gVG8gbWF0Y2ggd2hhdCB0aGUgdXNlciBzZWVzLCB5b3VyXG4gICAqIGNvbXBvbmVudCBzaG91bGQgZXhwYW5kIGFueSBgPHNsb3Q+YCBlbGVtZW50cyBpdCBjb250YWlucy5cbiAgICpcbiAgICogVGhhdCBpcyB0aGUgcHJvYmxlbSB0aGlzIG1peGluIHNvbHZlcy4gQWZ0ZXIgYXBwbHlpbmcgdGhpcyBtaXhpbiwgeW91clxuICAgKiBjb21wb25lbnQgY29kZSBoYXMgYWNjZXNzIHRvIGB0aGlzLmRpc3RyaWJ1dGVkQ2hpbGRyZW5gLCB3aG9zZSBgbGVuZ3RoYFxuICAgKiB3aWxsIHJldHVybiB0aGUgdG90YWwgbnVtYmVyIG9mIGFsbCBjaGlsZHJlbiBkaXN0cmlidXRlZCB0byB5b3VyIGNvbXBvbmVudFxuICAgKiBpbiB0aGUgY29tcG9zZWQgdHJlZS5cbiAgICpcbiAgICogTm90ZTogVGhlIGxhdGVzdCBDdXN0b20gRWxlbWVudHMgQVBJIGRlc2lnbiBjYWxscyBmb3IgYSBuZXcgZnVuY3Rpb24sXG4gICAqIGBnZXRBc3NpZ25lZE5vZGVzYCB0aGF0IHRha2VzIGFuIG9wdGlvbmFsIGBkZWVwYCBwYXJhbWV0ZXIsIHRoYXQgd2lsbCBzb2x2ZVxuICAgKiB0aGlzIHByb2JsZW0gYXQgdGhlIEFQSSBsZXZlbC5cbiAgICovXG4gIGNsYXNzIERpc3RyaWJ1dGVkQ2hpbGRyZW4gZXh0ZW5kcyBiYXNlIHtcblxuICAgIC8qKlxuICAgICAqIEFuIGluLW9yZGVyIGNvbGxlY3Rpb24gb2YgZGlzdHJpYnV0ZWQgY2hpbGRyZW4sIGV4cGFuZGluZyBhbnkgc2xvdFxuICAgICAqIGVsZW1lbnRzLiBMaWtlIHRoZSBzdGFuZGFyZCBjaGlsZHJlbiBwcm9wZXJ0eSwgdGhpcyBza2lwcyB0ZXh0IG5vZGVzLlxuICAgICAqXG4gICAgICogQHR5cGUge0hUTUxFbGVtZW50W119XG4gICAgICovXG4gICAgZ2V0IGRpc3RyaWJ1dGVkQ2hpbGRyZW4oKSB7XG4gICAgICByZXR1cm4gZXhwYW5kQ29udGVudEVsZW1lbnRzKHRoaXMuY2hpbGRyZW4sIGZhbHNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbiBpbi1vcmRlciBjb2xsZWN0aW9uIG9mIGRpc3RyaWJ1dGVkIGNoaWxkIG5vZGVzLCBleHBhbmRpbmcgYW55IHNsb3RcbiAgICAgKiBlbGVtZW50cy4gTGlrZSB0aGUgc3RhbmRhcmQgY2hpbGROb2RlcyBwcm9wZXJ0eSwgdGhpcyBpbmNsdWRlcyB0ZXh0XG4gICAgICogbm9kZXMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Tm9kZVtdfVxuICAgICAqL1xuICAgIGdldCBkaXN0cmlidXRlZENoaWxkTm9kZXMoKSB7XG4gICAgICByZXR1cm4gZXhwYW5kQ29udGVudEVsZW1lbnRzKHRoaXMuY2hpbGROb2RlcywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGNvbmNhdGVuYXRlZCB0ZXh0IGNvbnRlbnQgb2YgYWxsIGRpc3RyaWJ1dGVkIGNoaWxkIG5vZGVzLCBleHBhbmRpbmdcbiAgICAgKiBhbnkgc2xvdCBlbGVtZW50cy5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0IGRpc3RyaWJ1dGVkVGV4dENvbnRlbnQoKSB7XG4gICAgICBjb25zdCBzdHJpbmdzID0gdGhpcy5kaXN0cmlidXRlZENoaWxkTm9kZXMubWFwKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgIHJldHVybiBjaGlsZC50ZXh0Q29udGVudDtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHN0cmluZ3Muam9pbignJyk7XG4gICAgfVxuXG4gIH1cblxuICByZXR1cm4gRGlzdHJpYnV0ZWRDaGlsZHJlbjtcbn07XG5cblxuLypcbiAqIEdpdmVuIGEgYXJyYXkgb2Ygbm9kZXMsIHJldHVybiBhIG5ldyBhcnJheSB3aXRoIGFueSBjb250ZW50IGVsZW1lbnRzIGV4cGFuZGVkXG4gKiB0byB0aGUgbm9kZXMgZGlzdHJpYnV0ZWQgdG8gdGhhdCBjb250ZW50IGVsZW1lbnQuIFRoaXMgcnVsZSBpcyBhcHBsaWVkXG4gKiByZWN1cnNpdmVseS5cbiAqXG4gKiBJZiBpbmNsdWRlVGV4dE5vZGVzIGlzIHRydWUsIHRleHQgbm9kZXMgd2lsbCBiZSBpbmNsdWRlZCwgYXMgaW4gdGhlXG4gKiBzdGFuZGFyZCBjaGlsZE5vZGVzIHByb3BlcnR5OyBieSBkZWZhdWx0LCB0aGlzIHNraXBzIHRleHQgbm9kZXMsIGxpa2UgdGhlXG4gKiBzdGFuZGFyZCBjaGlsZHJlbiBwcm9wZXJ0eS5cbiAqL1xuZnVuY3Rpb24gZXhwYW5kQ29udGVudEVsZW1lbnRzKG5vZGVzLCBpbmNsdWRlVGV4dE5vZGVzKSB7XG4gIGNvbnN0IGV4cGFuZGVkID0gQXJyYXkucHJvdG90eXBlLm1hcC5jYWxsKG5vZGVzLCBub2RlID0+IHtcbiAgICAvLyBXZSB3YW50IHRvIHNlZSBpZiB0aGUgbm9kZSBpcyBhbiBpbnN0YW5jZW9mIEhUTUxTbG90RUxlbWVudCwgYnV0XG4gICAgLy8gdGhhdCBjbGFzcyB3b24ndCBleGlzdCBpZiB0aGUgYnJvd3NlciB0aGF0IGRvZXNuJ3Qgc3VwcG9ydCBuYXRpdmVcbiAgICAvLyBTaGFkb3cgRE9NIGFuZCBpZiB0aGUgU2hhZG93IERPTSBwb2x5ZmlsbCBoYXNuJ3QgYmVlbiBsb2FkZWQuIEluc3RlYWQsXG4gICAgLy8gd2UgZG8gYSBzaW1wbGlzdGljIGNoZWNrIHRvIHNlZSBpZiB0aGUgdGFnIG5hbWUgaXMgXCJzbG90XCIuXG4gICAgY29uc3QgaXNTbG90ID0gdHlwZW9mIEhUTUxTbG90RWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcgP1xuICAgICAgbm9kZSBpbnN0YW5jZW9mIEhUTUxTbG90RWxlbWVudCA6XG4gICAgICBub2RlLmxvY2FsTmFtZSA9PT0gJ3Nsb3QnO1xuICAgIGlmIChpc1Nsb3QpIHtcbiAgICAgIC8vIFVzZSB0aGUgbm9kZXMgYXNzaWduZWQgdG8gdGhpcyBub2RlIGluc3RlYWQuXG4gICAgICBjb25zdCBhc3NpZ25lZE5vZGVzID0gbm9kZS5hc3NpZ25lZE5vZGVzKHsgZmxhdHRlbjogdHJ1ZSB9KTtcbiAgICAgIHJldHVybiBhc3NpZ25lZE5vZGVzID9cbiAgICAgICAgZXhwYW5kQ29udGVudEVsZW1lbnRzKGFzc2lnbmVkTm9kZXMsIGluY2x1ZGVUZXh0Tm9kZXMpIDpcbiAgICAgICAgW107XG4gICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgIC8vIFBsYWluIGVsZW1lbnQ7IHVzZSBhcyBpcy5cbiAgICAgIHJldHVybiBbbm9kZV07XG4gICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgVGV4dCAmJiBpbmNsdWRlVGV4dE5vZGVzKSB7XG4gICAgICAvLyBUZXh0IG5vZGUuXG4gICAgICByZXR1cm4gW25vZGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBDb21tZW50LCBwcm9jZXNzaW5nIGluc3RydWN0aW9uLCBldGMuOyBza2lwLlxuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgfSk7XG4gIGNvbnN0IGZsYXR0ZW5lZCA9IFtdLmNvbmNhdCguLi5leHBhbmRlZCk7XG4gIHJldHVybiBmbGF0dGVuZWQ7XG59XG4iLCJpbXBvcnQgbWljcm90YXNrIGZyb20gJy4vbWljcm90YXNrJztcblxuXG4vKiBFeHBvcnRlZCBmdW5jdGlvbiBleHRlbmRzIGEgYmFzZSBjbGFzcyB3aXRoIERpc3RyaWJ1dGVkQ2hpbGRyZW5Bc0NvbnRlbnQuICovXG5leHBvcnQgZGVmYXVsdCAoYmFzZSkgPT4ge1xuXG4gIC8qKlxuICAgKiBNaXhpbiB3aGljaCBkZWZpbmVzIGEgY29tcG9uZW50J3MgY29udGVudCBhcyBpdHMgY2hpbGRyZW4sIGV4cGFuZGluZyBhbnlcbiAgICogbm9kZXMgZGlzdHJpYnV0ZWQgdG8gdGhlIGNvbXBvbmVudCdzIHNsb3RzLlxuICAgKlxuICAgKiBUaGlzIGFsc28gcHJvdmlkZXMgbm90aWZpY2F0aW9uIG9mIGNoYW5nZXMgdG8gYSBjb21wb25lbnQncyBjb250ZW50LiBJdFxuICAgKiB3aWxsIGludm9rZSBhIGBjb250ZW50Q2hhbmdlZGAgbWV0aG9kIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBmaXJzdFxuICAgKiBpbnN0YW50aWF0ZWQsIGFuZCB3aGVuZXZlciBpdHMgZGlzdHJpYnV0ZWQgY2hpbGRyZW4gY2hhbmdlLiBUaGlzIGlzIGFuXG4gICAqIGVhc3kgd2F5IHRvIHNhdGlzZnkgdGhlIEdvbGQgU3RhbmRhcmQgY2hlY2tsaXN0IGl0ZW0gZm9yIG1vbml0b3JpbmdcbiAgICogW0NvbnRlbnQgQ2hhbmdlc10oaHR0cHM6Ly9naXRodWIuY29tL3dlYmNvbXBvbmVudHMvZ29sZC1zdGFuZGFyZC93aWtpL0NvbnRlbnQtQ2hhbmdlcykuXG4gICAqXG4gICAqIEV4YW1wbGU6XG4gICAqXG4gICAqIGBgYFxuICAgKiBsZXQgYmFzZSA9IERpc3RyaWJ1dGVkQ2hpbGRyZW5Bc0NvbnRlbnQoRGlzdHJpYnV0ZWRDaGlsZHJlbihIVE1MRWxlbWVudCkpO1xuICAgKiBjbGFzcyBDb3VudGluZ0VsZW1lbnQgZXh0ZW5kcyBiYXNlIHtcbiAgICpcbiAgICogICBjb25zdHJ1Y3RvcigpIHtcbiAgICogICAgIHN1cGVyKCk7XG4gICAqICAgICBsZXQgcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pO1xuICAgKiAgICAgcm9vdC5pbm5lckhUTUwgPSBgPHNsb3Q+PC9zbG90PmA7XG4gICAqICAgfVxuICAgKlxuICAgKiAgIGNvbnRlbnRDaGFuZ2VkKCkge1xuICAgKiAgICAgLy8gQ291bnQgdGhlIGNvbXBvbmVudCdzIGNoaWxkcmVuLCBib3RoIGluaXRpYWxseSBhbmQgd2hlbiBjaGFuZ2VkLlxuICAgKiAgICAgdGhpcy5jb3VudCA9IHRoaXMuZGlzdHJpYnV0ZWRDaGlsZHJlbi5sZW5ndGg7XG4gICAqICAgfVxuICAgKlxuICAgKiB9XG4gICAqIGBgYFxuICAgKlxuICAgKiBOb3RlIHRoYXQgY29udGVudCBjaGFuZ2UgZGV0ZWN0aW9uIGRlcGVuZHMgdXBvbiB0aGUgZWxlbWVudCBoYXZpbmcgYXQgbGVhc3RcbiAgICogb25lIGBzbG90YCBlbGVtZW50IGluIGl0cyBzaGFkb3cgc3VidHJlZS5cbiAgICpcbiAgICogVGhpcyBtaXhpbiBpcyBpbnRlbmRlZCBmb3IgdXNlIHdpdGggdGhlXG4gICAqIFtEaXN0cmlidXRlZENoaWxkcmVuXShEaXN0cmlidXRlZENoaWxkcmVuLm1kKSBtaXhpbi4gU2VlIHRoYXQgbWl4aW4gZm9yIGFcbiAgICogZGlzY3Vzc2lvbiBvZiBob3cgdGhhdCB3b3Jrcy4gVGhpcyBEaXN0cmlidXRlZENoaWxkcmVuQXNDb250ZW50IG1peGluXG4gICAqIHByb3ZpZGVzIGFuIGVhc3kgd2F5IG9mIGRlZmluaW5nIHRoZSBcImNvbnRlbnRcIiBvZiBhIGNvbXBvbmVudCBhcyB0aGVcbiAgICogY29tcG9uZW50J3MgZGlzdHJpYnV0ZWQgY2hpbGRyZW4uIFRoYXQgaW4gdHVybiBsZXRzIG1peGlucyBsaWtlXG4gICAqIFtDb250ZW50QXNJdGVtc10oQ29udGVudEFzSXRlbXMubWQpIG1hbmlwdWxhdGUgdGhlIGNoaWxkcmVuIGFzIGxpc3QgaXRlbXMuXG4gICAqL1xuICBjbGFzcyBEaXN0cmlidXRlZENoaWxkcmVuQXNDb250ZW50IGV4dGVuZHMgYmFzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG5cbiAgICAgIGlmICh0aGlzLnNoYWRvd1Jvb3QpIHtcbiAgICAgICAgLy8gTGlzdGVuIHRvIGNoYW5nZXMgb24gYWxsIHNsb3RzLlxuICAgICAgICBjb25zdCBzbG90cyA9IHRoaXMuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yQWxsKCdzbG90Jyk7XG4gICAgICAgIHNsb3RzLmZvckVhY2goc2xvdCA9PiBzbG90LmFkZEV2ZW50TGlzdGVuZXIoJ3Nsb3RjaGFuZ2UnLCBldmVudCA9PiB7XG4gICAgICAgICAgdGhpcy5jb250ZW50Q2hhbmdlZCgpO1xuICAgICAgICB9KSk7XG4gICAgICB9XG5cbiAgICAgIC8vIE1ha2UgYW4gaW5pdGlhbCBjYWxsIHRvIGNvbnRlbnRDaGFuZ2VkKCkgc28gdGhhdCB0aGUgY29tcG9uZW50IGNhbiBkb1xuICAgICAgLy8gaW5pdGlhbGl6YXRpb24gdGhhdCBpdCBub3JtYWxseSBkb2VzIHdoZW4gY29udGVudCBjaGFuZ2VzLlxuICAgICAgLy9cbiAgICAgIC8vIFRoaXMgd2lsbCBpbnZva2UgY29udGVudENoYW5nZWQoKSBoYW5kbGVycyBpbiBvdGhlciBtaXhpbnMuIEluIG9yZGVyXG4gICAgICAvLyB0aGF0IHRob3NlIG1peGlucyBoYXZlIGEgY2hhbmNlIHRvIGNvbXBsZXRlIHRoZWlyIG93biBpbml0aWFsaXphdGlvbixcbiAgICAgIC8vIHdlIGFkZCB0aGUgY29udGVudENoYW5nZWQoKSBjYWxsIHRvIHRoZSBtaWNyb3Rhc2sgcXVldWUuXG4gICAgICBtaWNyb3Rhc2soKCkgPT4gdGhpcy5jb250ZW50Q2hhbmdlZCgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZva2VkIHdoZW4gdGhlIGNvbnRlbnRzIG9mIHRoZSBjb21wb25lbnQgKGluY2x1ZGluZyBkaXN0cmlidXRlZFxuICAgICAqIGNoaWxkcmVuKSBoYXZlIGNoYW5nZWQuXG4gICAgICpcbiAgICAgKiBUaGlzIG1ldGhvZCBpcyBhbHNvIGludm9rZWQgd2hlbiBhIGNvbXBvbmVudCBpcyBmaXJzdCBpbnN0YW50aWF0ZWQ7IHRoZVxuICAgICAqIGNvbnRlbnRzIGhhdmUgZXNzZW50aWFsbHkgXCJjaGFuZ2VkXCIgZnJvbSBiZWluZyBub3RoaW5nLiBUaGlzIGFsbG93cyB0aGVcbiAgICAgKiBjb21wb25lbnQgdG8gcGVyZm9ybSBpbml0aWFsIHByb2Nlc3Npbmcgb2YgaXRzIGNoaWxkcmVuLlxuICAgICAqL1xuICAgIGNvbnRlbnRDaGFuZ2VkKCkge1xuICAgICAgaWYgKHN1cGVyLmNvbnRlbnRDaGFuZ2VkKSB7IHN1cGVyLmNvbnRlbnRDaGFuZ2VkKCk7IH1cbiAgICAgIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdjb250ZW50LWNoYW5nZWQnKTtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGNvbnRlbnQgb2YgdGhpcyBjb21wb25lbnQsIGRlZmluZWQgdG8gYmUgdGhlIGZsYXR0ZW5lZCBhcnJheSBvZlxuICAgICAqIGNoaWxkcmVuIGRpc3RyaWJ1dGVkIHRvIHRoZSBjb21wb25lbnQuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7SFRNTEVsZW1lbnRbXX1cbiAgICAgKi9cbiAgICBnZXQgY29udGVudCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc3RyaWJ1dGVkQ2hpbGRyZW47XG4gICAgfVxuICAgIHNldCBjb250ZW50KHZhbHVlKSB7XG4gICAgICBpZiAoJ2NvbnRlbnQnIGluIGJhc2UucHJvdG90eXBlKSB7IHN1cGVyLmNvbnRlbnQgPSB2YWx1ZTsgfVxuICAgICAgLy8gVE9ETzogU2V0IHRoZSBjaGlsZHJlbiB0byB0aGUgZ2l2ZW4gdmFsdWUgKHdoaWNoIHNob3VsZCBiZSBhbiBhcnJheSBvZlxuICAgICAgLy8gZWxlbWVudHMpP1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgZXZlbnQgaXMgcmFpc2VkIHdoZW4gdGhlIGNvbXBvbmVudCdzIGNvbnRlbnRzIChpbmNsdWRpbmcgZGlzdHJpYnV0ZWRcbiAgICAgKiBjaGlsZHJlbikgaGF2ZSBjaGFuZ2VkLlxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIERpc3RyaWJ1dGVkQ2hpbGRyZW5Bc0NvbnRlbnRcbiAgICAgKiBAZXZlbnQgY29udGVudC1jaGFuZ2VkXG4gICAgICovXG4gIH1cblxuICByZXR1cm4gRGlzdHJpYnV0ZWRDaGlsZHJlbkFzQ29udGVudDtcbn07XG4iLCJpbXBvcnQgY3JlYXRlU3ltYm9sIGZyb20gJy4vY3JlYXRlU3ltYm9sJztcbmltcG9ydCBzYWZlQXR0cmlidXRlcyBmcm9tICcuL3NhZmVBdHRyaWJ1dGVzJztcbmltcG9ydCBzeW1ib2xzIGZyb20gJy4vc3ltYm9scyc7XG5cblxuLy8gU3ltYm9scyBmb3IgcHJpdmF0ZSBkYXRhIG1lbWJlcnMgb24gYW4gZWxlbWVudC5cbmNvbnN0IGtleWRvd25MaXN0ZW5lclN5bWJvbCA9IGNyZWF0ZVN5bWJvbCgna2V5ZG93bkxpc3RlbmVyJyk7XG5cblxuLyogRXhwb3J0ZWQgZnVuY3Rpb24gZXh0ZW5kcyBhIGJhc2UgY2xhc3Mgd2l0aCBLZXlib2FyZC4gKi9cbmV4cG9ydCBkZWZhdWx0IChiYXNlKSA9PiB7XG5cbiAgLyoqXG4gICAqIE1peGluIHdoaWNoIG1hbmFnZXMgdGhlIGtleWRvd24gaGFuZGxpbmcgZm9yIGEgY29tcG9uZW50LlxuICAgKlxuICAgKiBUaGlzIG1peGluIGhhbmRsZXMgc2V2ZXJhbCBrZXlib2FyZC1yZWxhdGVkIGZlYXR1cmVzLlxuICAgKlxuICAgKiBGaXJzdCwgaXQgd2lyZXMgdXAgYSBzaW5nbGUga2V5ZG93biBldmVudCBoYW5kbGVyIHRoYXQgY2FuIGJlIHNoYXJlZCBieVxuICAgKiBtdWx0aXBsZSBtaXhpbnMgb24gYSBjb21wb25lbnQuIFRoZSBldmVudCBoYW5kbGVyIHdpbGwgaW52b2tlIGEgYGtleWRvd25gXG4gICAqIG1ldGhvZCB3aXRoIHRoZSBldmVudCBvYmplY3QsIGFuZCBhbnkgbWl4aW4gYWxvbmcgdGhlIHByb3RvdHlwZSBjaGFpbiB0aGF0XG4gICAqIHdhbnRzIHRvIGhhbmRsZSB0aGF0IG1ldGhvZCBjYW4gZG8gc28uXG4gICAqXG4gICAqIElmIGEgbWl4aW4gd2FudHMgdG8gaW5kaWNhdGUgdGhhdCBrZXlib2FyZCBldmVudCBoYXMgYmVlbiBoYW5kbGVkLCBhbmQgdGhhdFxuICAgKiBvdGhlciBtaXhpbnMgc2hvdWxkICpub3QqIGhhbmRsZSBpdCwgdGhlIG1peGluJ3MgYGtleWRvd25gIGhhbmRsZXIgc2hvdWxkXG4gICAqIHJldHVybiBhIHZhbHVlIG9mIHRydWUuIFRoZSBjb252ZW50aW9uIHRoYXQgc2VlbXMgdG8gd29yayB3ZWxsIGlzIHRoYXQgYVxuICAgKiBtaXhpbiBzaG91bGQgc2VlIGlmIGl0IHdhbnRzIHRvIGhhbmRsZSB0aGUgZXZlbnQgYW5kLCBpZiBub3QsIHRoZW4gYXNrIHRoZVxuICAgKiBzdXBlcmNsYXNzIHRvIHNlZSBpZiBpdCB3YW50cyB0byBoYW5kbGUgdGhlIGV2ZW50LiBUaGlzIGhhcyB0aGUgZWZmZWN0IG9mXG4gICAqIGdpdmluZyB0aGUgbWl4aW4gdGhhdCB3YXMgYXBwbGllZCBsYXN0IHRoZSBmaXJzdCBjaGFuY2UgYXQgaGFuZGxpbmcgYVxuICAgKiBrZXlib2FyZCBldmVudC5cbiAgICpcbiAgICogRXhhbXBsZTpcbiAgICpcbiAgICogICAgIFtzeW1ib2xzLmtleWRvd25dKGV2ZW50KSB7XG4gICAqICAgICAgIGxldCBoYW5kbGVkO1xuICAgKiAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICogICAgICAgICAvLyBIYW5kbGUgdGhlIGtleXMgeW91IHdhbnQsIHNldHRpbmcgaGFuZGxlZCA9IHRydWUgaWYgYXBwcm9wcmlhdGUuXG4gICAqICAgICAgIH1cbiAgICogICAgICAgLy8gUHJlZmVyIG1peGluIHJlc3VsdCBpZiBpdCdzIGRlZmluZWQsIG90aGVyd2lzZSB1c2UgYmFzZSByZXN1bHQuXG4gICAqICAgICAgIHJldHVybiBoYW5kbGVkIHx8IChzdXBlcltzeW1ib2xzLmtleWRvd25dICYmIHN1cGVyW3N5bWJvbHMua2V5ZG93bl0oZXZlbnQpKTtcbiAgICogICAgIH1cbiAgICpcbiAgICogQSBzZWNvbmQgZmVhdHVyZSBwcm92aWRlZCBieSB0aGlzIG1peGluIGlzIHRoYXQgaXQgaW1wbGljaXRseSBtYWtlcyB0aGVcbiAgICogY29tcG9uZW50IGEgdGFiIHN0b3AgaWYgaXQgaXNuJ3QgYWxyZWFkeSwgYnkgc2V0dGluZyBgdGFiSW5kZXhgIHRvIDAuIFRoaXNcbiAgICogaGFzIHRoZSBlZmZlY3Qgb2YgYWRkaW5nIHRoZSBjb21wb25lbnQgdG8gdGhlIHRhYiBvcmRlciBpbiBkb2N1bWVudCBvcmRlci5cbiAgICpcbiAgICogRmluYWxseSwgdGhpcyBtaXhpbiBpcyBkZXNpZ25lZCB0byB3b3JrIHdpdGggdGhlIG9wdGlvbmFsXG4gICAqIFtDb2xsZWN0aXZlXShDb2xsZWN0aXZlLm1kKSBjbGFzcyB2aWEgYSBtaXhpbiBsaWtlXG4gICAqIFtUYXJnZXRJbkNvbGxlY3RpdmVdKFRhcmdldEluQ29sbGVjdGl2ZS5tZCkuIFRoaXMgYWxsb3dzIGEgc2V0IG9mIHJlbGF0ZWRcbiAgICogY29tcG9uZW50IGluc3RhbmNlcyB0byBjb29wZXJhdGl2ZWx5IGhhbmRsZSB0aGUga2V5Ym9hcmQuIFNlZSB0aGVcbiAgICogQ29sbGVjdGl2ZSBjbGFzcyBmb3IgZGV0YWlscy5cbiAgICovXG4gIGNsYXNzIEtleWJvYXJkIGV4dGVuZHMgYmFzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICAvLyBBc3N1bWUgdGhpcyBjb21wb25lbnQgaXMgZ29pbmcgdG8gaGFuZGxlIHRoZSBrZXlib2FyZCBvbiBpdHMgb3duLlxuICAgICAgLy8gUkVWSUVXOiBNb3ZlIHRvIGNvbm5lY3RlZENhbGxiYWNrP1xuICAgICAgc3RhcnRMaXN0ZW5pbmdUb0tleWRvd24odGhpcyk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBJZiB3ZSdyZSBub3cgdGhlIG91dGVybW9zdCBlbGVtZW50IG9mIHRoZSBjb2xsZWN0aXZlLCBzZXQgdXAgdG8gcmVjZWl2ZVxuICAgICAqIGtleWJvYXJkIGV2ZW50cy4gSWYgd2UncmUgbm8gbG9uZ2VyIHRoZSBvdXRlcm1vc3QgZWxlbWVudCwgc3RvcFxuICAgICAqIGxpc3RlbmluZy5cbiAgICAgKi9cbiAgICBjb2xsZWN0aXZlQ2hhbmdlZCgpIHtcbiAgICAgIGlmIChzdXBlci5jb2xsZWN0aXZlQ2hhbmdlZCkgeyBzdXBlci5jb2xsZWN0aXZlQ2hhbmdlZCgpOyB9XG5cbiAgICAgIGlmICh0aGlzLmNvbGxlY3RpdmUub3V0ZXJtb3N0RWxlbWVudCAhPT0gdGhpcykge1xuICAgICAgICAvLyBXZSdyZSBubyBsb25nZXIgdGhlIG91dGVybW9zdCBlbGVtZW50OyBzdG9wIGxpc3RlbmluZy5cbiAgICAgICAgaWYgKGlzTGlzdGVuaW5nVG9LZXlkb3duKHRoaXMpKSB7XG4gICAgICAgICAgc3RvcExpc3RlbmluZ1RvS2V5ZG93bih0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKSkge1xuICAgICAgICAvLyBTaW5jZSB3ZSdyZSBnb2luZyB0byBoYW5kbGUgdGhlIGtleWJvYXJkLCBzZWUgaWYgd2UgY2FuIGFkb3B0IGFuIEFSSUFcbiAgICAgICAgLy8gbGFiZWwgZnJvbSBhbiBpbm5lciBlbGVtZW50IG9mIHRoZSBjb2xsZWN0aXZlLlxuICAgICAgICBjb25zdCBsYWJlbCA9IGdldENvbGxlY3RpdmVBcmlhTGFiZWwodGhpcy5jb2xsZWN0aXZlKTtcbiAgICAgICAgaWYgKGxhYmVsKSB7XG4gICAgICAgICAgc2FmZUF0dHJpYnV0ZXMuc2V0QXR0cmlidXRlKHRoaXMsICdhcmlhLWxhYmVsJywgbGFiZWwpO1xuICAgICAgICAgIC8vIFJlbW92ZSBhbnkgbGFiZWxzIGZyb20gaW5uZXIgZWxlbWVudHMuXG4gICAgICAgICAgdGhpcy5jb2xsZWN0aXZlLmVsZW1lbnRzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICBpZiAoZWxlbWVudCAhPT0gdGhpcykge1xuICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNMaXN0ZW5pbmdUb0tleWRvd24odGhpcykpIHtcbiAgICAgICAgc3RhcnRMaXN0ZW5pbmdUb0tleWRvd24odGhpcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICBpZiAoc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2spIHsgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTsgfVxuICAgICAgc2FmZUF0dHJpYnV0ZXMuY29ubmVjdGVkKHRoaXMpO1xuICAgICAgLy8gU2V0IGEgZGVmYXVsdCB0YWIgaW5kZXggb2YgMCAoZG9jdW1lbnQgb3JkZXIpIGlmIG5vIHRhYiBpbmRleCBleGlzdHMuXG4gICAgICAvLyBNUyBFZGdlIHJlcXVpcmVzIHdlIGV4cGxpY2l0bHkgY2hlY2sgZm9yIHByZXNlbmNlIG9mIHRhYmluZGV4IGF0dHJpYnV0ZS5cbiAgICAgIGlmICh0aGlzLmdldEF0dHJpYnV0ZSgndGFiaW5kZXgnKSA9PSBudWxsIHx8IHRoaXMudGFiSW5kZXggPCAwKSB7XG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICcwJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIHRoZSBpbmRpY2F0ZWQga2V5Ym9hcmQgZXZlbnQuXG4gICAgICpcbiAgICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGlzIG1ldGhvZCBkb2VzIG5vdGhpbmcuIFRoaXMgd2lsbFxuICAgICAqIHR5cGljYWxseSBiZSBoYW5kbGVkIGJ5IG90aGVyIG1peGlucy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgLSB0aGUga2V5Ym9hcmQgZXZlbnRcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoZSBldmVudCB3YXMgaGFuZGxlZFxuICAgICAqL1xuICAgIFtzeW1ib2xzLmtleWRvd25dKGV2ZW50KSB7XG4gICAgICBpZiAoc3VwZXJbc3ltYm9scy5rZXlkb3duXSkgeyByZXR1cm4gc3VwZXJbc3ltYm9scy5rZXlkb3duXShldmVudCk7IH1cbiAgICB9XG5cbiAgfVxuXG4gIHJldHVybiBLZXlib2FyZDtcbn07XG5cblxuLy8gRmlyZSB0aGUga2V5ZG93bigpIG1ldGhvZCBvbiB0aGUgZWxlbWVudCBvciAoaWYgaXQgYmVsb25ncyB0byBhIGNvbGxlY3RpdmUpXG4vLyBhbGwgZWxlbWVudHMgaW4gdGhlIGNvbGxlY3RpdmUuXG4vL1xuLy8gTm90ZTogdGhlIHZhbHVlIG9mICd0aGlzJyBpcyBib3VuZCB0byB0aGUgZWxlbWVudCB3aGljaCByZWNlaXZlZCB0aGUgZXZlbnQuXG5mdW5jdGlvbiBrZXlkb3duKGV2ZW50KSB7XG5cbiAgbGV0IGhhbmRsZWQgPSBmYWxzZTtcblxuICBpZiAodGhpcy5jb2xsZWN0aXZlKSB7XG4gICAgLy8gR2l2ZSBjb2xsZWN0aXZlIGVsZW1lbnRzIGEgc2hvdCBhdCB0aGUgZXZlbnQsIHdvcmtpbmcgZnJvbSBpbm5lcm1vc3QgdG9cbiAgICAvLyBvdXRlcm1vc3QgKHRoaXMgZWxlbWVudCkuXG4gICAgY29uc3QgZWxlbWVudHMgPSB0aGlzLmNvbGxlY3RpdmUuZWxlbWVudHM7XG4gICAgZm9yIChsZXQgaSA9IGVsZW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gZWxlbWVudHNbaV07XG4gICAgICBoYW5kbGVkID0gZWxlbWVudFtzeW1ib2xzLmtleWRvd25dICYmIGVsZW1lbnRbc3ltYm9scy5rZXlkb3duXShldmVudCk7XG4gICAgICBpZiAoaGFuZGxlZCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gQ29tcG9uZW50IGlzIGhhbmRsaW5nIHRoZSBrZXlib2FyZCBvbiBpdHMgb3duLlxuICAgIGhhbmRsZWQgPSB0aGlzW3N5bWJvbHMua2V5ZG93bl0oZXZlbnQpO1xuICB9XG5cbiAgaWYgKGhhbmRsZWQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICB9XG59XG5cblxuLy8gUmV0dXJuIHRoZSBmaXJzdCBBUklBIGxhYmVsIGRlZmluZWQgYnkgdGhlIGNvbGxlY3RpdmUuXG5mdW5jdGlvbiBnZXRDb2xsZWN0aXZlQXJpYUxhYmVsKGNvbGxlY3RpdmUpIHtcbiAgY29uc3QgbGFiZWxzID0gY29sbGVjdGl2ZS5lbGVtZW50cy5tYXAoZWxlbWVudCA9PiBlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpKTtcbiAgLy8gV291bGQgcHJlZmVyIHRvIHVzZSBBcnJheS5wcm90b3R5cGUuZmluZCBoZXJlLCBidXQgSUUgMTEgZG9lc24ndCBoYXZlIGl0LlxuICBjb25zdCBub25OdWxsTGFiZWxzID0gbGFiZWxzLmZpbHRlcihsYWJlbCA9PiBsYWJlbCAhPSBudWxsKTtcbiAgcmV0dXJuIG5vbk51bGxMYWJlbHNbMF07XG59XG5cblxuZnVuY3Rpb24gaXNMaXN0ZW5pbmdUb0tleWRvd24oZWxlbWVudCkge1xuICByZXR1cm4gZWxlbWVudFtrZXlkb3duTGlzdGVuZXJTeW1ib2xdICE9IG51bGw7XG59XG5cblxuZnVuY3Rpb24gc3RhcnRMaXN0ZW5pbmdUb0tleWRvd24oZWxlbWVudCkge1xuICBlbGVtZW50W2tleWRvd25MaXN0ZW5lclN5bWJvbF0gPSBrZXlkb3duLmJpbmQoZWxlbWVudCk7XG4gIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGVsZW1lbnRba2V5ZG93bkxpc3RlbmVyU3ltYm9sXSk7XG59XG5cblxuZnVuY3Rpb24gc3RvcExpc3RlbmluZ1RvS2V5ZG93bihlbGVtZW50KSB7XG4gIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGVsZW1lbnRba2V5ZG93bkxpc3RlbmVyU3ltYm9sXSk7XG4gIGVsZW1lbnRba2V5ZG93bkxpc3RlbmVyU3ltYm9sXSA9IG51bGw7XG4gIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpO1xufVxuIiwiaW1wb3J0IGNyZWF0ZVN5bWJvbCBmcm9tICcuL2NyZWF0ZVN5bWJvbCc7XG5pbXBvcnQgc3ltYm9scyBmcm9tICcuL3N5bWJvbHMnO1xuXG5cbi8vIFN5bWJvbHMgZm9yIHByaXZhdGUgZGF0YSBtZW1iZXJzIG9uIGFuIGVsZW1lbnQuXG5jb25zdCBuYXZpZ2F0aW9uQXhpc1N5bWJvbCA9IGNyZWF0ZVN5bWJvbCgnbmF2aWdhdGlvbkF4aXMnKTtcblxuXG4vKiBFeHBvcnRlZCBmdW5jdGlvbiBleHRlbmRzIGEgYmFzZSBjbGFzcyB3aXRoIEtleWJvYXJkRGlyZWN0aW9uLiAqL1xuZXhwb3J0IGRlZmF1bHQgKGJhc2UpID0+IHtcblxuICAvKipcbiAgICogTWl4aW4gd2hpY2ggbWFwcyBkaXJlY3Rpb24ga2V5cyAoTGVmdCwgUmlnaHQsIGV0Yy4pIHRvIGRpcmVjdGlvbiBzZW1hbnRpY3NcbiAgICogKGdvIGxlZnQsIGdvIHJpZ2h0LCBldGMuKS5cbiAgICpcbiAgICogVGhpcyBtaXhpbiBleHBlY3RzIHRoZSBjb21wb25lbnQgdG8gaW52b2tlIGEgYGtleWRvd25gIG1ldGhvZCB3aGVuIGEga2V5IGlzXG4gICAqIHByZXNzZWQuIFlvdSBjYW4gdXNlIHRoZSBbS2V5Ym9hcmRdKEtleWJvYXJkLm1kKSBtaXhpbiBmb3IgdGhhdCBwdXJwb3NlLCBvclxuICAgKiB3aXJlIHVwIHlvdXIgb3duIGtleWJvYXJkIGhhbmRsaW5nIGFuZCBjYWxsIGBrZXlkb3duYCB5b3Vyc2VsZi5cbiAgICpcbiAgICogVGhpcyBtaXhpbiBjYWxscyBtZXRob2RzIHN1Y2ggYXMgYGdvTGVmdGAgYW5kIGBnb1JpZ2h0YC4gWW91IGNhbiBkZWZpbmVcbiAgICogd2hhdCB0aGF0IG1lYW5zIGJ5IGltcGxlbWVudGluZyB0aG9zZSBtZXRob2RzIHlvdXJzZWxmLiBJZiB5b3Ugd2FudCB0byB1c2VcbiAgICogZGlyZWN0aW9uIGtleXMgdG8gbmF2aWdhdGUgYSBzZWxlY3Rpb24sIHVzZSB0aGlzIG1peGluIHdpdGggdGhlXG4gICAqIFtEaXJlY3Rpb25TZWxlY3Rpb25dKERpcmVjdGlvblNlbGVjdGlvbi5tZCkgbWl4aW4uXG4gICAqL1xuICBjbGFzcyBLZXlib2FyZERpcmVjdGlvbiBleHRlbmRzIGJhc2Uge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgLy8gU2V0IGRlZmF1bHRzLlxuICAgICAgaWYgKHR5cGVvZiB0aGlzLm5hdmlnYXRpb25BeGlzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aGlzLm5hdmlnYXRpb25BeGlzID0gdGhpc1tzeW1ib2xzLmRlZmF1bHRzXS5uYXZpZ2F0aW9uQXhpcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgW3N5bWJvbHMuZGVmYXVsdHNdKCkge1xuICAgICAgY29uc3QgZGVmYXVsdHMgPSBzdXBlcltzeW1ib2xzLmRlZmF1bHRzXSB8fCB7fTtcbiAgICAgIGRlZmF1bHRzLm5hdmlnYXRpb25BeGlzID0gJ2JvdGgnO1xuICAgICAgcmV0dXJuIGRlZmF1bHRzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludm9rZWQgd2hlbiB0aGUgdXNlciB3YW50cyB0byBnby9uYXZpZ2F0ZSBkb3duLlxuICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIHRoaXMgbWV0aG9kIGRvZXMgbm90aGluZy5cbiAgICAgKi9cbiAgICBbc3ltYm9scy5nb0Rvd25dKCkge1xuICAgICAgaWYgKHN1cGVyW3N5bWJvbHMuZ29Eb3duXSkgeyByZXR1cm4gc3VwZXJbc3ltYm9scy5nb0Rvd25dKCk7IH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZva2VkIHdoZW4gdGhlIHVzZXIgd2FudHMgdG8gZ28vbmF2aWdhdGUgdG8gdGhlIGVuZCAoZS5nLiwgb2YgYSBsaXN0KS5cbiAgICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGlzIG1ldGhvZCBkb2VzIG5vdGhpbmcuXG4gICAgICovXG4gICAgW3N5bWJvbHMuZ29FbmRdKCkge1xuICAgICAgaWYgKHN1cGVyW3N5bWJvbHMuZ29FbmRdKSB7IHJldHVybiBzdXBlcltzeW1ib2xzLmdvRW5kXSgpOyB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52b2tlZCB3aGVuIHRoZSB1c2VyIHdhbnRzIHRvIGdvL25hdmlnYXRlIGxlZnQuXG4gICAgICogVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBtZXRob2QgZG9lcyBub3RoaW5nLlxuICAgICAqL1xuICAgIFtzeW1ib2xzLmdvTGVmdF0oKSB7XG4gICAgICBpZiAoc3VwZXJbc3ltYm9scy5nb0xlZnRdKSB7IHJldHVybiBzdXBlcltzeW1ib2xzLmdvTGVmdF0oKTsgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludm9rZWQgd2hlbiB0aGUgdXNlciB3YW50cyB0byBnby9uYXZpZ2F0ZSByaWdodC5cbiAgICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGlzIG1ldGhvZCBkb2VzIG5vdGhpbmcuXG4gICAgICovXG4gICAgW3N5bWJvbHMuZ29SaWdodF0oKSB7XG4gICAgICBpZiAoc3VwZXJbc3ltYm9scy5nb1JpZ2h0XSkgeyByZXR1cm4gc3VwZXJbc3ltYm9scy5nb1JpZ2h0XSgpOyB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52b2tlZCB3aGVuIHRoZSB1c2VyIHdhbnRzIHRvIGdvL25hdmlnYXRlIHRvIHRoZSBzdGFydCAoZS5nLiwgb2YgYVxuICAgICAqIGxpc3QpLiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGlzIG1ldGhvZCBkb2VzIG5vdGhpbmcuXG4gICAgICovXG4gICAgW3N5bWJvbHMuZ29TdGFydF0oKSB7XG4gICAgICBpZiAoc3VwZXJbc3ltYm9scy5nb1N0YXJ0XSkgeyByZXR1cm4gc3VwZXJbc3ltYm9scy5nb1N0YXJ0XSgpOyB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52b2tlZCB3aGVuIHRoZSB1c2VyIHdhbnRzIHRvIGdvL25hdmlnYXRlIHVwLlxuICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIHRoaXMgbWV0aG9kIGRvZXMgbm90aGluZy5cbiAgICAgKi9cbiAgICBbc3ltYm9scy5nb1VwXSgpIHtcbiAgICAgIGlmIChzdXBlcltzeW1ib2xzLmdvVXBdKSB7IHJldHVybiBzdXBlcltzeW1ib2xzLmdvVXBdKCk7IH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbmRpY2F0ZXMgdGhlIGRpcmVjdGlvbiBvZiBwZXJtaXR0ZWQgbmF2aWdhdGlvbiB3aXRoIHRoZSBrZXlib2FyZC5cbiAgICAgKlxuICAgICAqIEFjY2VwdGVkIHZhbHVlcyBhcmUgXCJob3Jpem9udGFsXCIsIFwidmVydGljYWxcIiwgb3IgXCJib3RoXCIgKHRoZSBkZWZhdWx0KS5cbiAgICAgKiBJZiB0aGlzIHByb3BlcnR5IGlzIFwiaG9yaXpvbnRhbFwiLCB0aGUgVXAgQXJyb3cgYW5kIERvd24gQXJyb3cga2V5cyB3aWxsXG4gICAgICogYmUgaWdub3JlZC4gQ29udmVyc2VseSwgaWYgdGhpcyBpcyBcInZlcnRpY2FsXCIsIHRoZSBMZWZ0IEFycm93IGFuZCBSaWdodFxuICAgICAqIEFycm93IGtleXMgd2lsbCBiZSBpZ25vcmVkLlxuICAgICAqXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXQgbmF2aWdhdGlvbkF4aXMoKSB7XG4gICAgICByZXR1cm4gdGhpc1tuYXZpZ2F0aW9uQXhpc1N5bWJvbF07XG4gICAgfVxuICAgIHNldCBuYXZpZ2F0aW9uQXhpcyh2YWx1ZSkge1xuICAgICAgdGhpc1tuYXZpZ2F0aW9uQXhpc1N5bWJvbF0gPSB2YWx1ZTtcbiAgICAgIGlmICgnbmF2aWdhdGlvbkF4aXMnIGluIGJhc2UucHJvdG90eXBlKSB7IHN1cGVyLm5hdmlnYXRpb25BeGlzID0gdmFsdWU7IH1cbiAgICB9XG5cbiAgICBbc3ltYm9scy5rZXlkb3duXShldmVudCkge1xuICAgICAgbGV0IGhhbmRsZWQ7XG5cbiAgICAgIGNvbnN0IGF4aXMgPSB0aGlzLm5hdmlnYXRpb25BeGlzO1xuICAgICAgY29uc3QgaG9yaXpvbnRhbCA9IChheGlzID09PSAnaG9yaXpvbnRhbCcgfHwgYXhpcyA9PT0gJ2JvdGgnKTtcbiAgICAgIGNvbnN0IHZlcnRpY2FsID0gKGF4aXMgPT09ICd2ZXJ0aWNhbCcgfHwgYXhpcyA9PT0gJ2JvdGgnKTtcblxuICAgICAgLy8gSWdub3JlIExlZnQvUmlnaHQga2V5cyB3aGVuIG1ldGFLZXkgb3IgYWx0S2V5IG1vZGlmaWVyIGlzIGFsc28gcHJlc3NlZCxcbiAgICAgIC8vIGFzIHRoZSB1c2VyIG1heSBiZSB0cnlpbmcgdG8gbmF2aWdhdGUgYmFjayBvciBmb3J3YXJkIGluIHRoZSBicm93c2VyLlxuICAgICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICAgIGNhc2UgMzU6IC8vIEVuZFxuICAgICAgICAgIGhhbmRsZWQgPSB0aGlzW3N5bWJvbHMuZ29FbmRdKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzY6IC8vIEhvbWVcbiAgICAgICAgICBoYW5kbGVkID0gdGhpc1tzeW1ib2xzLmdvU3RhcnRdKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzc6IC8vIExlZnRcbiAgICAgICAgICBpZiAoaG9yaXpvbnRhbCAmJiAhZXZlbnQubWV0YUtleSAmJiAhZXZlbnQuYWx0S2V5KSB7XG4gICAgICAgICAgICBoYW5kbGVkID0gdGhpc1tzeW1ib2xzLmdvTGVmdF0oKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzg6IC8vIFVwXG4gICAgICAgICAgaWYgKHZlcnRpY2FsKSB7XG4gICAgICAgICAgICBoYW5kbGVkID0gZXZlbnQuYWx0S2V5ID8gdGhpc1tzeW1ib2xzLmdvU3RhcnRdKCkgOiB0aGlzW3N5bWJvbHMuZ29VcF0oKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzk6IC8vIFJpZ2h0XG4gICAgICAgICAgaWYgKGhvcml6b250YWwgJiYgIWV2ZW50Lm1ldGFLZXkgJiYgIWV2ZW50LmFsdEtleSkge1xuICAgICAgICAgICAgaGFuZGxlZCA9IHRoaXNbc3ltYm9scy5nb1JpZ2h0XSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA0MDogLy8gRG93blxuICAgICAgICAgIGlmICh2ZXJ0aWNhbCkge1xuICAgICAgICAgICAgaGFuZGxlZCA9IGV2ZW50LmFsdEtleSA/IHRoaXNbc3ltYm9scy5nb0VuZF0oKSA6IHRoaXNbc3ltYm9scy5nb0Rvd25dKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgLy8gUHJlZmVyIG1peGluIHJlc3VsdCBpZiBpdCdzIGRlZmluZWQsIG90aGVyd2lzZSB1c2UgYmFzZSByZXN1bHQuXG4gICAgICByZXR1cm4gaGFuZGxlZCB8fCAoc3VwZXJbc3ltYm9scy5rZXlkb3duXSAmJiBzdXBlcltzeW1ib2xzLmtleWRvd25dKGV2ZW50KSk7XG4gICAgfVxuXG4gIH1cblxuICByZXR1cm4gS2V5Ym9hcmREaXJlY3Rpb247XG59O1xuIiwiLyogRXhwb3J0ZWQgZnVuY3Rpb24gZXh0ZW5kcyBhIGJhc2UgY2xhc3Mgd2l0aCBTaGFkb3dFbGVtZW50UmVmZXJlbmNlcy4gKi9cbmV4cG9ydCBkZWZhdWx0IChiYXNlKSA9PiB7XG5cbiAgLyoqXG4gICAqIE1peGluIHRvIGNyZWF0ZSByZWZlcmVuY2VzIHRvIGVsZW1lbnRzIGluIGEgY29tcG9uZW50J3MgU2hhZG93IERPTSBzdWJ0cmVlLlxuICAgKlxuICAgKiBUaGlzIGFkZHMgYSBtZW1iZXIgb24gdGhlIGNvbXBvbmVudCBjYWxsZWQgYHRoaXMuJGAgdGhhdCBjYW4gYmUgdXNlZCB0b1xuICAgKiByZWZlcmVuY2Ugc2hhZG93IGVsZW1lbnRzIHdpdGggSURzLiBFLmcuLCBpZiBjb21wb25lbnQncyBzaGFkb3cgY29udGFpbnMgYW5cbiAgICogZWxlbWVudCBgPGJ1dHRvbiBpZD1cImZvb1wiPmAsIHRoZW4gdGhpcyBtaXhpbiB3aWxsIGNyZWF0ZSBhIG1lbWJlclxuICAgKiBgdGhpcy4kLmZvb2AgdGhhdCBwb2ludHMgdG8gdGhhdCBidXR0b24uXG4gICAqXG4gICAqIFN1Y2ggcmVmZXJlbmNlcyBzaW1wbGlmeSBhIGNvbXBvbmVudCdzIGFjY2VzcyB0byBpdHMgb3duIGVsZW1lbnRzLiBJblxuICAgKiBleGNoYW5nZSwgdGhpcyBtaXhpbiB0cmFkZXMgb2ZmIGEgb25lLXRpbWUgY29zdCBvZiBxdWVyeWluZyBhbGwgZWxlbWVudHMgaW5cbiAgICogdGhlIHNoYWRvdyB0cmVlIGluc3RlYWQgb2YgcGF5aW5nIGFuIG9uZ29pbmcgY29zdCB0byBxdWVyeSBmb3IgYW4gZWxlbWVudFxuICAgKiBlYWNoIHRpbWUgdGhlIGNvbXBvbmVudCB3YW50cyB0byBpbnNwZWN0IG9yIG1hbmlwdWxhdGUgaXQuXG4gICAqXG4gICAqIFRoaXMgbWl4aW4gZXhwZWN0cyB0aGUgY29tcG9uZW50IHRvIGRlZmluZSBhIFNoYWRvdyBET00gc3VidHJlZS4gWW91IGNhblxuICAgKiBjcmVhdGUgdGhhdCB0cmVlIHlvdXJzZWxmLCBvciBtYWtlIHVzZSBvZiB0aGVcbiAgICogW1NoYWRvd1RlbXBsYXRlXShTaGFkb3dUZW1wbGF0ZS5tZCkgbWl4aW4uXG4gICAqXG4gICAqIFRoaXMgbWl4aW4gaXMgaW5zcGlyZWQgYnkgUG9seW1lcidzIFthdXRvbWF0aWNcbiAgICogbm9kZSBmaW5kaW5nXShodHRwczovL3d3dy5wb2x5bWVyLXByb2plY3Qub3JnLzEuMC9kb2NzL2Rldmd1aWRlL2xvY2FsLWRvbS5odG1sI25vZGUtZmluZGluZylcbiAgICogZmVhdHVyZS5cbiAgICovXG4gIGNsYXNzIFNoYWRvd0VsZW1lbnRSZWZlcmVuY2VzIGV4dGVuZHMgYmFzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBpZiAodGhpcy5zaGFkb3dSb290KSB7XG4gICAgICAgIC8vIExvb2sgZm9yIGVsZW1lbnRzIGluIHRoZSBzaGFkb3cgc3VidHJlZSB0aGF0IGhhdmUgaWQgYXR0cmlidXRlcy5cbiAgICAgICAgLy8gQW4gYWx0ZXJuYXRpdmVseSBpbXBsZW1lbnRhdGlvbiBvZiB0aGlzIG1peGluIHdvdWxkIGJlIHRvIGp1c3QgZGVmaW5lXG4gICAgICAgIC8vIGEgdGhpcy4kIGdldHRlciB0aGF0IGxhemlseSBkb2VzIHRoaXMgc2VhcmNoIHRoZSBmaXJzdCB0aW1lIHNvbWVvbmVcbiAgICAgICAgLy8gdHJpZXMgdG8gYWNjZXNzIHRoaXMuJC4gVGhhdCBtaWdodCBpbnRyb2R1Y2Ugc29tZSBjb21wbGV4aXR5IOKAkyBpZiB0aGVcbiAgICAgICAgLy8gdGhlIHRyZWUgY2hhbmdlZCBhZnRlciBpdCB3YXMgZmlyc3QgcG9wdWxhdGVkLCB0aGUgcmVzdWx0IG9mXG4gICAgICAgIC8vIHNlYXJjaGluZyBmb3IgYSBub2RlIG1pZ2h0IGJlIHNvbWV3aGF0IHVucHJlZGljdGFibGUuXG4gICAgICAgIHRoaXMuJCA9IHt9O1xuICAgICAgICBjb25zdCBub2Rlc1dpdGhJZHMgPSB0aGlzLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvckFsbCgnW2lkXScpO1xuICAgICAgICBbXS5mb3JFYWNoLmNhbGwobm9kZXNXaXRoSWRzLCBub2RlID0+IHtcbiAgICAgICAgICBjb25zdCBpZCA9IG5vZGUuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgICAgICAgIHRoaXMuJFtpZF0gPSBub2RlO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY29sbGVjdGlvbiBvZiByZWZlcmVuY2VzIHRvIHRoZSBlbGVtZW50cyB3aXRoIElEcyBpbiBhIGNvbXBvbmVudCdzXG4gICAgICogU2hhZG93IERPTSBzdWJ0cmVlLlxuICAgICAqXG4gICAgICogQHR5cGUge29iamVjdH1cbiAgICAgKiBAbWVtYmVyICRcbiAgICAgKi9cbiAgfVxuXG4gIHJldHVybiBTaGFkb3dFbGVtZW50UmVmZXJlbmNlcztcbn07XG4iLCIvKiBFeHBvcnRlZCBmdW5jdGlvbiBleHRlbmRzIGEgYmFzZSBjbGFzcyB3aXRoIFNoYWRvd1RlbXBsYXRlLiAqL1xuZXhwb3J0IGRlZmF1bHQgKGJhc2UpID0+IHtcblxuICAvKipcbiAgICogTWl4aW4gZm9yIHN0YW1waW5nIGEgdGVtcGxhdGUgaW50byBhIFNoYWRvdyBET00gc3VidHJlZSB1cG9uIGNvbXBvbmVudFxuICAgKiBpbnN0YW50aWF0aW9uLlxuICAgKlxuICAgKiBUbyB1c2UgdGhpcyBtaXhpbiwgZGVmaW5lIGEgYHRlbXBsYXRlYCBwcm9wZXJ0eSBhcyBhIHN0cmluZyBvciBIVE1MXG4gICAqIGA8dGVtcGxhdGU+YCBlbGVtZW50OlxuICAgKlxuICAgKiAgICAgY2xhc3MgTXlFbGVtZW50IGV4dGVuZHMgU2hhZG93VGVtcGxhdGUoSFRNTEVsZW1lbnQpIHtcbiAgICogICAgICAgZ2V0IHRlbXBsYXRlKCkge1xuICAgKiAgICAgICAgIHJldHVybiBgSGVsbG8sIDxlbT53b3JsZDwvZW0+LmA7XG4gICAqICAgICAgIH1cbiAgICogICAgIH1cbiAgICpcbiAgICogV2hlbiB5b3VyIGNvbXBvbmVudCBjbGFzcyBpcyBpbnN0YW50aWF0ZWQsIGEgc2hhZG93IHJvb3Qgd2lsbCBiZSBjcmVhdGVkIG9uXG4gICAqIHRoZSBpbnN0YW5jZSwgYW5kIHRoZSBjb250ZW50cyBvZiB0aGUgdGVtcGxhdGUgd2lsbCBiZSBjbG9uZWQgaW50byB0aGVcbiAgICogc2hhZG93IHJvb3QuIElmIHlvdXIgY29tcG9uZW50IGRvZXMgbm90IGRlZmluZSBhIGB0ZW1wbGF0ZWAgcHJvcGVydHksIHRoaXNcbiAgICogbWl4aW4gaGFzIG5vIGVmZmVjdC5cbiAgICpcbiAgICogRm9yIHRoZSB0aW1lIGJlaW5nLCB0aGlzIGV4dGVuc2lvbiByZXRhaW5zIHN1cHBvcnQgZm9yIFNoYWRvdyBET00gdjAuIFRoYXRcbiAgICogd2lsbCBldmVudHVhbGx5IGJlIGRlcHJlY2F0ZWQgYXMgYnJvd3NlcnMgKGFuZCB0aGUgU2hhZG93IERPTSBwb2x5ZmlsbClcbiAgICogaW1wbGVtZW50IFNoYWRvdyBET00gdjEuXG4gICAqL1xuICBjbGFzcyBTaGFkb3dUZW1wbGF0ZSBleHRlbmRzIGJhc2Uge1xuXG4gICAgLypcbiAgICAgKiBJZiB0aGUgY29tcG9uZW50IGRlZmluZXMgYSB0ZW1wbGF0ZSwgYSBzaGFkb3cgcm9vdCB3aWxsIGJlIGNyZWF0ZWQgb24gdGhlXG4gICAgICogY29tcG9uZW50IGluc3RhbmNlLCBhbmQgdGhlIHRlbXBsYXRlIHN0YW1wZWQgaW50byBpdC5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBsZXQgdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlO1xuICAgICAgLy8gVE9ETzogU2F2ZSB0aGUgcHJvY2Vzc2VkIHRlbXBsYXRlIHdpdGggdGhlIGNvbXBvbmVudCdzIGNsYXNzIHByb3RvdHlwZVxuICAgICAgLy8gc28gaXQgZG9lc24ndCBuZWVkIHRvIGJlIHByb2Nlc3NlZCB3aXRoIGV2ZXJ5IGluc3RhbnRpYXRpb24uXG4gICAgICBpZiAodGVtcGxhdGUpIHtcblxuICAgICAgICBpZiAodHlwZW9mIHRlbXBsYXRlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIC8vIFVwZ3JhZGUgcGxhaW4gc3RyaW5nIHRvIHJlYWwgdGVtcGxhdGUuXG4gICAgICAgICAgdGVtcGxhdGUgPSBjcmVhdGVUZW1wbGF0ZVdpdGhJbm5lckhUTUwodGVtcGxhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHdpbmRvdy5TaGFkb3dET01Qb2x5ZmlsbCkge1xuICAgICAgICAgIHNoaW1UZW1wbGF0ZVN0eWxlcyh0ZW1wbGF0ZSwgdGhpcy5sb2NhbE5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pO1xuICAgICAgICBjb25zdCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgcmV0dXJuIFNoYWRvd1RlbXBsYXRlO1xufTtcblxuXG4vLyBDb252ZXJ0IGEgcGxhaW4gc3RyaW5nIG9mIEhUTUwgaW50byBhIHJlYWwgdGVtcGxhdGUgZWxlbWVudC5cbmZ1bmN0aW9uIGNyZWF0ZVRlbXBsYXRlV2l0aElubmVySFRNTChpbm5lckhUTUwpIHtcbiAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAvLyBSRVZJRVc6IElzIHRoZXJlIGFuIGVhc2llciB3YXkgdG8gZG8gdGhpcz9cbiAgLy8gV2UnZCBsaWtlIHRvIGp1c3Qgc2V0IGlubmVySFRNTCBvbiB0aGUgdGVtcGxhdGUgY29udGVudCwgYnV0IHNpbmNlIGl0J3NcbiAgLy8gYSBEb2N1bWVudEZyYWdtZW50LCB0aGF0IGRvZXNuJ3Qgd29yay5cbiAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5pbm5lckhUTUwgPSBpbm5lckhUTUw7XG4gIHdoaWxlIChkaXYuY2hpbGROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgdGVtcGxhdGUuY29udGVudC5hcHBlbmRDaGlsZChkaXYuY2hpbGROb2Rlc1swXSk7XG4gIH1cbiAgcmV0dXJuIHRlbXBsYXRlO1xufVxuXG4vLyBJbnZva2UgYmFzaWMgc3R5bGUgc2hpbW1pbmcgd2l0aCBTaGFkb3dDU1MuXG5mdW5jdGlvbiBzaGltVGVtcGxhdGVTdHlsZXModGVtcGxhdGUsIHRhZykge1xuICB3aW5kb3cuV2ViQ29tcG9uZW50cy5TaGFkb3dDU1Muc2hpbVN0eWxpbmcodGVtcGxhdGUuY29udGVudCwgdGFnKTtcbn1cbiIsImltcG9ydCBjcmVhdGVTeW1ib2wgZnJvbSAnLi9jcmVhdGVTeW1ib2wnO1xuaW1wb3J0IG1pY3JvdGFzayBmcm9tICcuL21pY3JvdGFzayc7XG5pbXBvcnQgc3ltYm9scyBmcm9tICcuL3N5bWJvbHMnO1xuXG5cbi8vIFN5bWJvbHMgZm9yIHByaXZhdGUgZGF0YSBtZW1iZXJzIG9uIGFuIGVsZW1lbnQuXG5jb25zdCBjYW5TZWxlY3ROZXh0U3ltYm9sID0gY3JlYXRlU3ltYm9sKCdjYW5TZWxlY3ROZXh0Jyk7XG5jb25zdCBjYW5TZWxlY3RQcmV2aW91c1N5bWJvbCA9IGNyZWF0ZVN5bWJvbCgnY2FuU2VsZWN0UHJldmlvdXMnKTtcbmNvbnN0IHNlbGVjdGVkSXRlbVN5bWJvbCA9IGNyZWF0ZVN5bWJvbCgnc2VsZWN0ZWRJdGVtJyk7XG5jb25zdCBzZWxlY3Rpb25SZXF1aXJlZFN5bWJvbCA9IGNyZWF0ZVN5bWJvbCgnc2VsZWN0aW9uUmVxdWlyZWQnKTtcbmNvbnN0IHNlbGVjdGlvbldyYXBzU3ltYm9sID0gY3JlYXRlU3ltYm9sKCdzZWxlY3Rpb25XcmFwcycpO1xuXG5cbi8qIEV4cG9ydGVkIGZ1bmN0aW9uIGV4dGVuZHMgYSBiYXNlIGNsYXNzIHdpdGggU2luZ2xlU2VsZWN0aW9uLiAqL1xuZXhwb3J0IGRlZmF1bHQgKGJhc2UpID0+IHtcblxuICAvKipcbiAgICogTWl4aW4gd2hpY2ggbWFuYWdlcyBzaW5nbGUtc2VsZWN0aW9uIHNlbWFudGljcyBmb3IgaXRlbXMgaW4gYSBsaXN0LlxuICAgKlxuICAgKiBUaGlzIG1peGluIGV4cGVjdHMgYSBjb21wb25lbnQgdG8gcHJvdmlkZSBhbiBgaXRlbXNgIGFycmF5IG9mIGFsbCBlbGVtZW50c1xuICAgKiBpbiB0aGUgbGlzdC4gQSBzdGFuZGFyZCB3YXkgdG8gZG8gdGhhdCB3aXRoIGlzIHRoZVxuICAgKiBbQ29udGVudEFzSXRlbXNdKENvbnRlbnRBc0l0ZW1zLm1kKSBtaXhpbiwgd2hpY2ggdGFrZXMgYSBjb21wb25lbnQnc1xuICAgKiBjb250ZW50ICh0eXBpY2FsbHkgaXRzIGRpc3RyaWJ1dGVkIGNoaWxkcmVuKSBhcyB0aGUgc2V0IG9mIGxpc3QgaXRlbXM7IHNlZVxuICAgKiB0aGF0IG1peGluIGZvciBkZXRhaWxzLlxuICAgKlxuICAgKiBUaGlzIG1peGluIHRyYWNrcyBhIHNpbmdsZSBzZWxlY3RlZCBpdGVtIGluIHRoZSBsaXN0LCBhbmQgcHJvdmlkZXMgbWVhbnMgdG9cbiAgICogZ2V0IGFuZCBzZXQgdGhhdCBzdGF0ZSBieSBpdGVtIHBvc2l0aW9uIChgc2VsZWN0ZWRJbmRleGApIG9yIGl0ZW0gaWRlbnRpdHlcbiAgICogKGBzZWxlY3RlZEl0ZW1gKS4gVGhlIHNlbGVjdGlvbiBjYW4gYmUgbW92ZWQgaW4gdGhlIGxpc3QgdmlhIHRoZSBtZXRob2RzXG4gICAqIGBzZWxlY3RGaXJzdGAsIGBzZWxlY3RMYXN0YCwgYHNlbGVjdE5leHRgLCBhbmQgYHNlbGVjdFByZXZpb3VzYC5cbiAgICpcbiAgICogVGhpcyBtaXhpbiBkb2VzIG5vdCBwcm9kdWNlIGFueSB1c2VyLXZpc2libGUgZWZmZWN0cyB0byByZXByZXNlbnRcbiAgICogc2VsZWN0aW9uLiBPdGhlciBtaXhpbnMsIHN1Y2ggYXNcbiAgICogW1NlbGVjdGlvbkFyaWFBY3RpdmVdKFNlbGVjdGlvbkFyaWFBY3RpdmUubWQpLFxuICAgKiBbU2VsZWN0aW9uSGlnaGxpZ2h0XShTZWxlY3Rpb25IaWdobGlnaHQubWQpIGFuZFxuICAgKiBbU2VsZWN0aW9uSW5WaWV3XShTZWxlY3Rpb25JblZpZXcubWQpLCBtb2RpZnkgdGhlIHNlbGVjdGVkIGl0ZW0gaW4gY29tbW9uXG4gICAqIHdheXMgdG8gbGV0IHRoZSB1c2VyIGtub3cgYSBnaXZlbiBpdGVtIGlzIHNlbGVjdGVkIG9yIG5vdCBzZWxlY3RlZC5cbiAgICovXG4gIGNsYXNzIFNpbmdsZVNlbGVjdGlvbiBleHRlbmRzIGJhc2Uge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgLy8gU2V0IGRlZmF1bHRzLlxuICAgICAgaWYgKHR5cGVvZiB0aGlzLnNlbGVjdGlvblJlcXVpcmVkID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aGlzLnNlbGVjdGlvblJlcXVpcmVkID0gdGhpc1tzeW1ib2xzLmRlZmF1bHRzXS5zZWxlY3Rpb25SZXF1aXJlZDtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5zZWxlY3Rpb25XcmFwcyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25XcmFwcyA9IHRoaXNbc3ltYm9scy5kZWZhdWx0c10uc2VsZWN0aW9uV3JhcHM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXBwbHkgdGhlIGluZGljYXRlIHNlbGVjdGlvbiBzdGF0ZSB0byB0aGUgaXRlbS5cbiAgICAgKlxuICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIHRoaXMgbWV0aG9kIGRvZXMgbm90aGluZy4gVXNlci12aXNpYmxlXG4gICAgICogZWZmZWN0cyB3aWxsIHR5cGljYWxseSBiZSBoYW5kbGVkIGJ5IG90aGVyIG1peGlucy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGl0ZW0gLSB0aGUgaXRlbSBiZWluZyBzZWxlY3RlZC9kZXNlbGVjdGVkXG4gICAgICogQHBhcmFtIHtib29sZWFufSBzZWxlY3RlZCAtIHRydWUgaWYgdGhlIGl0ZW0gaXMgc2VsZWN0ZWQsIGZhbHNlIGlmIG5vdFxuICAgICAqL1xuICAgIFtzeW1ib2xzLmFwcGx5U2VsZWN0aW9uXShpdGVtLCBzZWxlY3RlZCkge1xuICAgICAgaWYgKHN1cGVyW3N5bWJvbHMuYXBwbHlTZWxlY3Rpb25dKSB7IHN1cGVyW3N5bWJvbHMuYXBwbHlTZWxlY3Rpb25dKGl0ZW0sIHNlbGVjdGVkKTsgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRydWUgaWYgdGhlIHNlbGVjdGlvbiBjYW4gYmUgbW92ZWQgdG8gdGhlIG5leHQgaXRlbSwgZmFsc2UgaWYgbm90ICh0aGVcbiAgICAgKiBzZWxlY3RlZCBpdGVtIGlzIHRoZSBsYXN0IGl0ZW0gaW4gdGhlIGxpc3QpLlxuICAgICAqXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgZ2V0IGNhblNlbGVjdE5leHQoKSB7XG4gICAgICByZXR1cm4gdGhpc1tjYW5TZWxlY3ROZXh0U3ltYm9sXTtcbiAgICB9XG4gICAgc2V0IGNhblNlbGVjdE5leHQoY2FuU2VsZWN0TmV4dCkge1xuICAgICAgdGhpc1tjYW5TZWxlY3ROZXh0U3ltYm9sXSA9IGNhblNlbGVjdE5leHQ7XG4gICAgICBpZiAoJ2NhblNlbGVjdE5leHQnIGluIGJhc2UucHJvdG90eXBlKSB7IHN1cGVyLmNhblNlbGVjdE5leHQgPSBjYW5TZWxlY3ROZXh0OyB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVHJ1ZSBpZiB0aGUgc2VsZWN0aW9uIGNhbiBiZSBtb3ZlZCB0byB0aGUgcHJldmlvdXMgaXRlbSwgZmFsc2UgaWYgbm90XG4gICAgICogKHRoZSBzZWxlY3RlZCBpdGVtIGlzIHRoZSBmaXJzdCBvbmUgaW4gdGhlIGxpc3QpLlxuICAgICAqXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgZ2V0IGNhblNlbGVjdFByZXZpb3VzKCkge1xuICAgICAgcmV0dXJuIHRoaXNbY2FuU2VsZWN0UHJldmlvdXNTeW1ib2xdO1xuICAgIH1cbiAgICBzZXQgY2FuU2VsZWN0UHJldmlvdXMoY2FuU2VsZWN0UHJldmlvdXMpIHtcbiAgICAgIHRoaXNbY2FuU2VsZWN0UHJldmlvdXNTeW1ib2xdID0gY2FuU2VsZWN0UHJldmlvdXM7XG4gICAgICBpZiAoJ2NhblNlbGVjdFByZXZpb3VzJyBpbiBiYXNlLnByb3RvdHlwZSkgeyBzdXBlci5jYW5TZWxlY3RQcmV2aW91cyA9IGNhblNlbGVjdFByZXZpb3VzOyB9XG4gICAgfVxuXG4gICAgZ2V0IFtzeW1ib2xzLmRlZmF1bHRzXSgpIHtcbiAgICAgIGNvbnN0IGRlZmF1bHRzID0gc3VwZXJbc3ltYm9scy5kZWZhdWx0c10gfHwge307XG4gICAgICBkZWZhdWx0cy5zZWxlY3Rpb25SZXF1aXJlZCA9IGZhbHNlO1xuICAgICAgZGVmYXVsdHMuc2VsZWN0aW9uV3JhcHMgPSBmYWxzZTtcbiAgICAgIHJldHVybiBkZWZhdWx0cztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgYSBuZXcgaXRlbSBiZWluZyBhZGRlZCB0byB0aGUgbGlzdC5cbiAgICAgKlxuICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIHRoaXMgbWV0aG9kIHNpbXBseSBzZXRzIHRoZSBpdGVtJ3NcbiAgICAgKiBzZWxlY3Rpb24gc3RhdGUgdG8gZmFsc2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBpdGVtIC0gdGhlIGl0ZW0gYmVpbmcgYWRkZWRcbiAgICAgKi9cbiAgICBbc3ltYm9scy5pdGVtQWRkZWRdKGl0ZW0pIHtcbiAgICAgIGlmIChzdXBlcltzeW1ib2xzLml0ZW1BZGRlZF0pIHsgc3VwZXJbc3ltYm9scy5pdGVtQWRkZWRdKGl0ZW0pOyB9XG4gICAgICB0aGlzW3N5bWJvbHMuYXBwbHlTZWxlY3Rpb25dKGl0ZW0sIGl0ZW0gPT09IHRoaXMuc2VsZWN0ZWRJdGVtKTtcbiAgICB9XG5cbiAgICBpdGVtc0NoYW5nZWQoKSB7XG4gICAgICBpZiAoc3VwZXIuaXRlbXNDaGFuZ2VkKSB7IHN1cGVyLml0ZW1zQ2hhbmdlZCgpOyB9XG5cbiAgICAgIGlmICh0aGlzLnNlbGVjdGlvblJlcXVpcmVkKSB7XG4gICAgICAgIC8vIEVuc3VyZSBzZWxlY3Rpb24sIGJ1dCBkbyB0aGlzIGluIHRoZSBuZXh0IHRpY2sgdG8gZ2l2ZSBvdGhlciBtaXhpbnMgYVxuICAgICAgICAvLyBjaGFuY2UgdG8gZG8gdGhlaXIgb3duIGl0ZW1zQ2hhbmdlZCB3b3JrLlxuICAgICAgICBtaWNyb3Rhc2soKCkgPT4ge1xuICAgICAgICAgIGVuc3VyZVNlbGVjdGlvbih0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBjaGFuZ2UgaW4gaXRlbXMgbWF5IGhhdmUgYWZmZWN0ZWQgd2hpY2ggbmF2aWdhdGlvbnMgYXJlIHBvc3NpYmxlLlxuICAgICAgdXBkYXRlUG9zc2libGVOYXZpZ2F0aW9ucyh0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgaW5kZXggb2YgdGhlIGl0ZW0gd2hpY2ggaXMgY3VycmVudGx5IHNlbGVjdGVkLlxuICAgICAqXG4gICAgICogSWYgYHNlbGVjdGlvbldyYXBzYCBpcyBmYWxzZSwgdGhlIGluZGV4IGlzIC0xIGlmIHRoZXJlIGlzIG5vIHNlbGVjdGlvbi5cbiAgICAgKiBJbiB0aGF0IGNhc2UsIHNldHRpbmcgdGhlIGluZGV4IHRvIC0xIHdpbGwgZGVzZWxlY3QgYW55XG4gICAgICogY3VycmVudGx5LXNlbGVjdGVkIGl0ZW0uXG4gICAgICpcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldCBzZWxlY3RlZEluZGV4KCkge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRJdGVtID0gdGhpcy5zZWxlY3RlZEl0ZW07XG5cbiAgICAgIC8vIFRPRE86IElmIHNlbGVjdGlvbiB3YXNuJ3QgZm91bmQsIG1vc3QgbGlrZWx5IGNhdXNlIGlzIHRoYXQgdGhlIERPTSB3YXNcbiAgICAgIC8vIG1hbmlwdWxhdGVkIGZyb20gdW5kZXJuZWF0aCB1cy4gT25jZSB3ZSB0cmFjayBjb250ZW50IGNoYW5nZXMsIHR1cm5cbiAgICAgIC8vIHRoaXMgaW50byBhIHdhcm5pbmcuXG4gICAgICAvLyBUT0RPOiBNZW1vaXplXG4gICAgICByZXR1cm4gc2VsZWN0ZWRJdGVtID9cbiAgICAgICAgdGhpcy5pdGVtcy5pbmRleE9mKHNlbGVjdGVkSXRlbSkgOlxuICAgICAgICAtMTtcbiAgICB9XG4gICAgc2V0IHNlbGVjdGVkSW5kZXgoaW5kZXgpIHtcbiAgICAgIC8vIFRPRE86IFB1bGwgc2V0dGluZyBvZiBzZWxlY3RlZEl0ZW0gYWJvdmUgc3VwZXIoKSBjYWxsLiAqL1xuICAgICAgaWYgKCdzZWxlY3RlZEluZGV4JyBpbiBiYXNlLnByb3RvdHlwZSkgeyBzdXBlci5zZWxlY3RlZEluZGV4ID0gaW5kZXg7IH1cbiAgICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5pdGVtcztcbiAgICAgIGNvbnN0IGl0ZW0gPSAoaW5kZXggPCAwIHx8IGl0ZW1zLmxlbmd0aCA9PT0gMCkgP1xuICAgICAgICBudWxsIDpcbiAgICAgICAgaXRlbXNbaW5kZXhdO1xuICAgICAgdGhpcy5zZWxlY3RlZEl0ZW0gPSBpdGVtO1xuXG4gICAgICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudCgnc2VsZWN0ZWQtaW5kZXgtY2hhbmdlZCcsIHtcbiAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgc2VsZWN0ZWRJbmRleDogaW5kZXgsXG4gICAgICAgICAgdmFsdWU6IGluZGV4IC8vIGZvciBQb2x5bWVyIGJpbmRpbmdcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgaXRlbSwgb3IgbnVsbCBpZiB0aGVyZSBpcyBubyBzZWxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBTZXR0aW5nIHRoaXMgcHJvcGVydHkgdG8gbnVsbCBkZXNlbGVjdHMgYW55IGN1cnJlbnRseS1zZWxlY3RlZCBpdGVtLlxuICAgICAqXG4gICAgICogQHR5cGUge29iamVjdH1cbiAgICAgKi9cbiAgICBnZXQgc2VsZWN0ZWRJdGVtKCkge1xuICAgICAgcmV0dXJuIHRoaXNbc2VsZWN0ZWRJdGVtU3ltYm9sXSB8fCBudWxsO1xuICAgIH1cbiAgICBzZXQgc2VsZWN0ZWRJdGVtKGl0ZW0pIHtcbiAgICAgIGNvbnN0IHByZXZpb3VzSXRlbSA9IHRoaXNbc2VsZWN0ZWRJdGVtU3ltYm9sXTtcbiAgICAgIC8vIFRPRE86IENvbmZpcm0gaXRlbSBpcyBhY3R1YWxseSBpbiB0aGUgbGlzdCBiZWZvcmUgc2VsZWN0aW5nLlxuICAgICAgdGhpc1tzZWxlY3RlZEl0ZW1TeW1ib2xdID0gaXRlbTtcblxuICAgICAgaWYgKCdzZWxlY3RlZEl0ZW0nIGluIGJhc2UucHJvdG90eXBlKSB7IHN1cGVyLnNlbGVjdGVkSXRlbSA9IGl0ZW07IH1cbiAgICAgIGlmIChwcmV2aW91c0l0ZW0pIHtcbiAgICAgICAgaWYgKGl0ZW0gPT09IHByZXZpb3VzSXRlbSkge1xuICAgICAgICAgIC8vIFRoZSBpbmRpY2F0ZWQgaXRlbSBpcyBhbHJlYWR5IHRoZSBzZWxlY3RlZCBpdGVtLlxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZW1vdmUgcHJldmlvdXMgc2VsZWN0aW9uLlxuICAgICAgICB0aGlzW3N5bWJvbHMuYXBwbHlTZWxlY3Rpb25dKHByZXZpb3VzSXRlbSwgZmFsc2UpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbSkge1xuICAgICAgICB0aGlzW3N5bWJvbHMuYXBwbHlTZWxlY3Rpb25dKGl0ZW0sIHRydWUpO1xuICAgICAgfVxuXG4gICAgICAvLyBUT0RPOiBSYXRpb25hbGl6ZSB3aXRoIHNlbGVjdGVkSW5kZXggc28gd2UncmUgbm90IHJlY2FsY3VsYXRpbmcgaXRlbVxuICAgICAgLy8gb3IgaW5kZXggaW4gZWFjaCBzZXR0ZXIuXG4gICAgICB1cGRhdGVQb3NzaWJsZU5hdmlnYXRpb25zKHRoaXMpO1xuXG4gICAgICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudCgnc2VsZWN0ZWQtaXRlbS1jaGFuZ2VkJywge1xuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICBzZWxlY3RlZEl0ZW06IGl0ZW0sXG4gICAgICAgICAgcHJldmlvdXNJdGVtOiBwcmV2aW91c0l0ZW0sXG4gICAgICAgICAgdmFsdWU6IGl0ZW0gLy8gZm9yIFBvbHltZXIgYmluZGluZ1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VsZWN0IHRoZSBmaXJzdCBpdGVtIGluIHRoZSBsaXN0LlxuICAgICAqL1xuICAgIHNlbGVjdEZpcnN0KCkge1xuICAgICAgaWYgKHN1cGVyLnNlbGVjdEZpcnN0KSB7IHN1cGVyLnNlbGVjdEZpcnN0KCk7IH1cbiAgICAgIHJldHVybiBzZWxlY3RJbmRleCh0aGlzLCAwKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcnVlIGlmIHRoZSBsaXN0IHNob3VsZCBhbHdheXMgaGF2ZSBhIHNlbGVjdGlvbiAoaWYgaXQgaGFzIGl0ZW1zKS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICovXG4gICAgZ2V0IHNlbGVjdGlvblJlcXVpcmVkKCkge1xuICAgICAgcmV0dXJuIHRoaXNbc2VsZWN0aW9uUmVxdWlyZWRTeW1ib2xdO1xuICAgIH1cbiAgICBzZXQgc2VsZWN0aW9uUmVxdWlyZWQoc2VsZWN0aW9uUmVxdWlyZWQpIHtcbiAgICAgIHRoaXNbc2VsZWN0aW9uUmVxdWlyZWRTeW1ib2xdID0gc2VsZWN0aW9uUmVxdWlyZWQ7XG4gICAgICBpZiAoJ3NlbGVjdGlvblJlcXVpcmVkJyBpbiBiYXNlLnByb3RvdHlwZSkgeyBzdXBlci5zZWxlY3Rpb25SZXF1aXJlZCA9IHNlbGVjdGlvblJlcXVpcmVkOyB9XG4gICAgICBpZiAoc2VsZWN0aW9uUmVxdWlyZWQpIHtcbiAgICAgICAgZW5zdXJlU2VsZWN0aW9uKHRoaXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlbGVjdCB0aGUgbGFzdCBpdGVtIGluIHRoZSBsaXN0LlxuICAgICAqL1xuICAgIHNlbGVjdExhc3QoKSB7XG4gICAgICBpZiAoc3VwZXIuc2VsZWN0TGFzdCkgeyBzdXBlci5zZWxlY3RMYXN0KCk7IH1cbiAgICAgIHJldHVybiBzZWxlY3RJbmRleCh0aGlzLCB0aGlzLml0ZW1zLmxlbmd0aCAtIDEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlbGVjdCB0aGUgbmV4dCBpdGVtIGluIHRoZSBsaXN0LlxuICAgICAqL1xuICAgIHNlbGVjdE5leHQoKSB7XG4gICAgICBpZiAoc3VwZXIuc2VsZWN0TmV4dCkgeyBzdXBlci5zZWxlY3ROZXh0KCk7IH1cbiAgICAgIHJldHVybiBzZWxlY3RJbmRleCh0aGlzLCB0aGlzLnNlbGVjdGVkSW5kZXggKyAxKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZWxlY3QgdGhlIHByZXZpb3VzIGl0ZW0gaW4gdGhlIGxpc3QuXG4gICAgICpcbiAgICAgKiBJZiB0aGUgbGlzdCBoYXMgbm8gc2VsZWN0aW9uLCB0aGUgbGFzdCBpdGVtIHdpbGwgYmUgc2VsZWN0ZWQuXG4gICAgICovXG4gICAgc2VsZWN0UHJldmlvdXMoKSB7XG4gICAgICBpZiAoc3VwZXIuc2VsZWN0UHJldmlvdXMpIHsgc3VwZXIuc2VsZWN0UHJldmlvdXMoKTsgfVxuICAgICAgY29uc3QgbmV3SW5kZXggPSB0aGlzLnNlbGVjdGVkSW5kZXggPCAwID9cbiAgICAgICAgdGhpcy5pdGVtcy5sZW5ndGggLSAxIDogICAgIC8vIE5vIHNlbGVjdGlvbiB5ZXQ7IHNlbGVjdCBsYXN0IGl0ZW0uXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCAtIDE7XG4gICAgICByZXR1cm4gc2VsZWN0SW5kZXgodGhpcywgbmV3SW5kZXgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRydWUgaWYgc2VsZWN0aW9uIG5hdmlnYXRpb25zIHdyYXAgZnJvbSBsYXN0IHRvIGZpcnN0LCBhbmQgdmljZSB2ZXJzYS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICovXG4gICAgZ2V0IHNlbGVjdGlvbldyYXBzKCkge1xuICAgICAgcmV0dXJuIHRoaXNbc2VsZWN0aW9uV3JhcHNTeW1ib2xdO1xuICAgIH1cbiAgICBzZXQgc2VsZWN0aW9uV3JhcHModmFsdWUpIHtcbiAgICAgIHRoaXNbc2VsZWN0aW9uV3JhcHNTeW1ib2xdID0gU3RyaW5nKHZhbHVlKSA9PT0gJ3RydWUnO1xuICAgICAgaWYgKCdzZWxlY3Rpb25XcmFwcycgaW4gYmFzZS5wcm90b3R5cGUpIHsgc3VwZXIuc2VsZWN0aW9uV3JhcHMgPSB2YWx1ZTsgfVxuICAgICAgdXBkYXRlUG9zc2libGVOYXZpZ2F0aW9ucyh0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaXJlcyB3aGVuIHRoZSBzZWxlY3RlZEl0ZW0gcHJvcGVydHkgY2hhbmdlcy5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBTaW5nbGVTZWxlY3Rpb25cbiAgICAgKiBAZXZlbnQgc2VsZWN0ZWQtaXRlbS1jaGFuZ2VkXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZGV0YWlsLnNlbGVjdGVkSXRlbSBUaGUgbmV3IHNlbGVjdGVkIGl0ZW0uXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZGV0YWlsLnByZXZpb3VzSXRlbSBUaGUgcHJldmlvdXNseSBzZWxlY3RlZCBpdGVtLlxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogRmlyZXMgd2hlbiB0aGUgc2VsZWN0ZWRJbmRleCBwcm9wZXJ0eSBjaGFuZ2VzLlxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIFNpbmdsZVNlbGVjdGlvblxuICAgICAqIEBldmVudCBzZWxlY3RlZC1pbmRleC1jaGFuZ2VkXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRldGFpbC5zZWxlY3RlZEluZGV4IFRoZSBuZXcgc2VsZWN0ZWQgaW5kZXguXG4gICAgICovXG5cbiAgfVxuXG4gIHJldHVybiBTaW5nbGVTZWxlY3Rpb247XG59O1xuXG5cbi8vIElmIG5vIGl0ZW0gaXMgc2VsZWN0ZWQsIHNlbGVjdCBhIGRlZmF1bHQgaXRlbS5cbmZ1bmN0aW9uIGVuc3VyZVNlbGVjdGlvbihlbGVtZW50KSB7XG4gIGNvbnN0IGluZGV4ID0gZWxlbWVudC5zZWxlY3RlZEluZGV4O1xuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgLy8gU2VsZWN0ZWQgaXRlbSBpcyBubyBsb25nZXIgaW4gdGhlIGN1cnJlbnQgc2V0IG9mIGl0ZW1zLlxuICAgIGlmIChlbGVtZW50Lml0ZW1zICYmIGVsZW1lbnQuaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgLy8gU2VsZWN0IHRoZSBmaXJzdCBpdGVtLlxuICAgICAgLy8gVE9ETzogSWYgdGhlIHByZXZpb3VzbHktc2VsZWN0ZWQgaXRlbSBoYXMgYmVlbiBkZWxldGVkLCB0cnkgdG8gc2VsZWN0XG4gICAgICAvLyBhbiBpdGVtIGFkamFjZW50IHRvIHRoZSBwb3NpdGlvbiBpdCBoZWxkLlxuICAgICAgZWxlbWVudC5zZWxlY3RlZEluZGV4ID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTm8gaXRlbXMgZm9yIHVzIHRvIHNlbGVjdCwgYnV0IHdlIGNhbiBhdCBsZWFzdCBzaWduYWwgdGhhdCB0aGVyZSdzIG5vXG4gICAgICAvLyBsb25nZXIgYSBzZWxlY3Rpb24uXG4gICAgICBlbGVtZW50LnNlbGVjdGVkSXRlbSA9IG51bGw7XG4gICAgfVxuICB9XG59XG5cbi8vIEVuc3VyZSB0aGUgZ2l2ZW4gaW5kZXggaXMgd2l0aGluIGJvdW5kcywgYW5kIHNlbGVjdCBpdCBpZiBpdCdzIG5vdCBhbHJlYWR5XG4vLyBzZWxlY3RlZC5cbmZ1bmN0aW9uIHNlbGVjdEluZGV4KGVsZW1lbnQsIGluZGV4KSB7XG4gIGNvbnN0IGNvdW50ID0gZWxlbWVudC5pdGVtcy5sZW5ndGg7XG5cbiAgY29uc3QgYm91bmRlZEluZGV4ID0gKGVsZW1lbnQuc2VsZWN0aW9uV3JhcHMpID9cbiAgICAvLyBKYXZhU2NyaXB0IG1vZCBkb2Vzbid0IGhhbmRsZSBuZWdhdGl2ZSBudW1iZXJzIHRoZSB3YXkgd2Ugd2FudCB0byB3cmFwLlxuICAgIC8vIFNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xODYxODI1MC83NjQ3MlxuICAgICgoaW5kZXggJSBjb3VudCkgKyBjb3VudCkgJSBjb3VudCA6XG5cbiAgICAvLyBLZWVwIGluZGV4IHdpdGhpbiBib3VuZHMgb2YgYXJyYXkuXG4gICAgTWF0aC5tYXgoTWF0aC5taW4oaW5kZXgsIGNvdW50IC0gMSksIDApO1xuXG4gIGNvbnN0IHByZXZpb3VzSW5kZXggPSBlbGVtZW50LnNlbGVjdGVkSW5kZXg7XG4gIGlmIChwcmV2aW91c0luZGV4ICE9PSBib3VuZGVkSW5kZXgpIHtcbiAgICBlbGVtZW50LnNlbGVjdGVkSW5kZXggPSBib3VuZGVkSW5kZXg7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8vIEZvbGxvd2luZyBhIGNoYW5nZSBpbiBzZWxlY3Rpb24sIHJlcG9ydCB3aGV0aGVyIGl0J3Mgbm93IHBvc3NpYmxlIHRvXG4vLyBnbyBuZXh0L3ByZXZpb3VzIGZyb20gdGhlIGdpdmVuIGluZGV4LlxuZnVuY3Rpb24gdXBkYXRlUG9zc2libGVOYXZpZ2F0aW9ucyhlbGVtZW50KSB7XG4gIGxldCBjYW5TZWxlY3ROZXh0O1xuICBsZXQgY2FuU2VsZWN0UHJldmlvdXM7XG4gIGNvbnN0IGl0ZW1zID0gZWxlbWVudC5pdGVtcztcbiAgaWYgKGl0ZW1zID09IG51bGwgfHwgaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgLy8gTm8gaXRlbXMgdG8gc2VsZWN0LlxuICAgIGNhblNlbGVjdE5leHQgPSBmYWxzZTtcbiAgICBjYW5TZWxlY3RQcmV2aW91cyA9IGZhbHNlO1xuICB9IGlmIChlbGVtZW50LnNlbGVjdGlvbldyYXBzKSB7XG4gICAgLy8gU2luY2UgdGhlcmUgYXJlIGl0ZW1zLCBjYW4gYWx3YXlzIGdvIG5leHQvcHJldmlvdXMuXG4gICAgY2FuU2VsZWN0TmV4dCA9IHRydWU7XG4gICAgY2FuU2VsZWN0UHJldmlvdXMgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGluZGV4ID0gZWxlbWVudC5zZWxlY3RlZEluZGV4O1xuICAgIGlmIChpbmRleCA8IDAgJiYgaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgLy8gU3BlY2lhbCBjYXNlLiBJZiB0aGVyZSBhcmUgaXRlbXMgYnV0IG5vIHNlbGVjdGlvbiwgZGVjbGFyZSB0aGF0IGl0J3NcbiAgICAgIC8vIGFsd2F5cyBwb3NzaWJsZSB0byBnbyBuZXh0L3ByZXZpb3VzIHRvIGNyZWF0ZSBhIHNlbGVjdGlvbi5cbiAgICAgIGNhblNlbGVjdE5leHQgPSB0cnVlO1xuICAgICAgY2FuU2VsZWN0UHJldmlvdXMgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBOb3JtYWwgY2FzZTogd2UgaGF2ZSBhbiBpbmRleCBpbiBhIGxpc3QgdGhhdCBoYXMgaXRlbXMuXG4gICAgICBjYW5TZWxlY3RQcmV2aW91cyA9IChpbmRleCA+IDApO1xuICAgICAgY2FuU2VsZWN0TmV4dCA9IChpbmRleCA8IGl0ZW1zLmxlbmd0aCAtIDEpO1xuICAgIH1cbiAgfVxuICBlbGVtZW50LmNhblNlbGVjdE5leHQgPSBjYW5TZWxlY3ROZXh0O1xuICBlbGVtZW50LmNhblNlbGVjdFByZXZpb3VzID0gY2FuU2VsZWN0UHJldmlvdXM7XG59XG4iLCJpbXBvcnQgQ29sbGVjdGl2ZSBmcm9tICcuL0NvbGxlY3RpdmUnO1xuXG5cbi8qIEV4cG9ydGVkIGZ1bmN0aW9uIGV4dGVuZHMgYSBiYXNlIGNsYXNzIHdpdGggVGFyZ2V0SW5Db2xsZWN0aXZlLiAqL1xuZXhwb3J0IGRlZmF1bHQgKGJhc2UpID0+IHtcblxuICAvKipcbiAgICogTWl4aW4gd2hpY2ggYWxsb3dzIGEgY29tcG9uZW50IHRvIHByb3ZpZGUgYWdncmVnYXRlIGJlaGF2aW9yIHdpdGggb3RoZXJcbiAgICogZWxlbWVudHMsIGUuZy4sIGZvciBrZXlib2FyZCBoYW5kbGluZy5cbiAgICpcbiAgICogVGhpcyBtaXhpbiBpbXBsaWNpdGx5IGNyZWF0ZXMgYSBjb2xsZWN0aXZlIGZvciBhIGNvbXBvbmVudCBzbyB0aGF0IGl0IGNhblxuICAgKiBwYXJ0aWNpcGF0ZSBpbiBjb2xsZWN0aXZlIGtleWJvYXJkIGhhbmRsaW5nLiBTZWUgdGhlXG4gICAqIFtDb2xsZWN0aXZlXShDb2xsZWN0aXZlLm1kKSBjbGFzcyBmb3IgZGV0YWlscy5cbiAgICpcbiAgICogWW91IGNhbiB1c2UgdGhpcyBtaXhpbiBpbiBjb25qdW5jdGlvbiB3aXRoXG4gICAqIFtDb250ZW50Rmlyc3RDaGlsZFRhcmdldF0oQ29udGVudEZpcnN0Q2hpbGRUYXJnZXQubWQpIHRvIGF1dG9tYXRpY2FsbHkgaGF2ZVxuICAgKiB0aGUgY29tcG9uZW50J3MgY29sbGVjdGl2ZSBleHRlbmRlZCB0byBpdHMgZmlyc3QgY2hpbGQuXG4gICAqL1xuICBjbGFzcyBUYXJnZXRJbkNvbGxlY3RpdmUgZXh0ZW5kcyBiYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMuY29sbGVjdGl2ZSA9IG5ldyBDb2xsZWN0aXZlKHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMvc2V0cyB0aGUgY3VycmVudCB0YXJnZXQgb2YgdGhlIGNvbXBvbmVudC5cbiAgICAgKlxuICAgICAqIFNldCB0aGlzIHRvIHBvaW50IHRvIGFub3RoZXIgZWxlbWVudC4gVGhhdCB0YXJnZXQgZWxlbWVudCB3aWxsIGJlXG4gICAgICogaW1wbGljaXRseSBhZGRlZCB0byB0aGUgY29tcG9uZW50J3MgY29sbGVjdGl2ZS4gVGhhdCBpcywgdGhlIGNvbXBvbmVudFxuICAgICAqIGFuZCBpdHMgdGFyZ2V0IHdpbGwgc2hhcmUgcmVzcG9uc2liaWxpdHkgZm9yIGhhbmRsaW5nIGtleWJvYXJkIGV2ZW50cy5cbiAgICAgKlxuICAgICAqIFlvdSBjYW4gc2V0IHRoaXMgcHJvcGVydHkgeW91cnNlbGYsIG9yIHlvdSBjYW4gdXNlIHRoZVxuICAgICAqIENvbnRlbnRGaXJzdENoaWxkVGFyZ2V0IG1peGluIHRvIGF1dG9tYXRpY2FsbHkgc2V0IHRoZSB0YXJnZXQgdG8gdGhlXG4gICAgICogY29tcG9uZW50J3MgZmlyc3QgY2hpbGQuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7SFRNTEVsZW1lbnR9XG4gICAgICovXG4gICAgZ2V0IHRhcmdldCgpIHtcbiAgICAgIHJldHVybiBzdXBlci50YXJnZXQ7XG4gICAgfVxuICAgIHNldCB0YXJnZXQoZWxlbWVudCkge1xuICAgICAgaWYgKCd0YXJnZXQnIGluIGJhc2UucHJvdG90eXBlKSB7IHN1cGVyLnRhcmdldCA9IGVsZW1lbnQ7IH1cbiAgICAgIHRoaXMuY29sbGVjdGl2ZS5hc3NpbWlsYXRlKGVsZW1lbnQpO1xuICAgIH1cblxuICB9XG5cbiAgcmV0dXJuIFRhcmdldEluQ29sbGVjdGl2ZTtcbn07XG4iLCJpbXBvcnQgY3JlYXRlU3ltYm9sIGZyb20gJy4vY3JlYXRlU3ltYm9sJztcblxuXG4vLyBTeW1ib2xzIGZvciBwcml2YXRlIGRhdGEgbWVtYmVycyBvbiBhbiBlbGVtZW50LlxuY29uc3QgaXRlbXNDaGFuZ2VkTGlzdGVuZXJTeW1ib2wgPSBjcmVhdGVTeW1ib2woJ2l0ZW1zQ2hhbmdlZExpc3RlbmVyJyk7XG5jb25zdCBzZWxlY3RlZEl0ZW1DaGFuZ2VkTGlzdGVuZXJTeW1ib2wgPSBjcmVhdGVTeW1ib2woJ3NlbGVjdGVkSXRlbUNoYW5nZWRMaXN0ZW5lcicpO1xuXG5cbi8qIEV4cG9ydGVkIGZ1bmN0aW9uIGV4dGVuZHMgYSBiYXNlIGNsYXNzIHdpdGggVGFyZ2V0U2VsZWN0aW9uLiAqL1xuZXhwb3J0IGRlZmF1bHQgKGJhc2UpID0+IHtcblxuICAvKipcbiAgICogTWl4aW4gd2hpY2ggYWxsb3dzIGEgY29tcG9uZW50IHRvIGRlbGVnYXRlIGl0cyBvd24gc2VsZWN0aW9uIHNlbWFudGljcyB0byBhXG4gICAqIHRhcmdldCBlbGVtZW50LlxuICAgKlxuICAgKiBUaGlzIGlzIHVzZWZ1bCB3aGVuIGRlZmluaW5nIGNvbXBvbmVudHMgdGhhdCBhY3QgYXMgb3B0aW9uYWwgZmVhdHVyZXMgZm9yIGFcbiAgICogY29tcG9uZW50IHRoYXQgYWN0cyBsaWtlIGEgbGlzdC4gU2VlIGJhc2ljLWFycm93LXNlbGVjdGlvbiBhbmRcbiAgICogYmFzaWMtcGFnZS1kb3RzIGZvciBleGFtcGxlcyBvZiBjb21wb25lbnRzIHVzZWQgYXMgb3B0aW9uYWwgZmVhdHVyZXMgZm9yXG4gICAqIGNvbXBvbmVudHMgbGlrZSBiYXNpYy1jYXJvdXNlbC4gQSB0eXBpY2FsIHVzYWdlIG1pZ2h0IGJlOlxuICAgKlxuICAgKiAgICAgPGJhc2ljLWFycm93LXNlbGVjdGlvbj5cbiAgICogICAgICAgPGJhc2ljLWNhcm91c2VsPlxuICAgKiAgICAgICAgIC4uLiBpbWFnZXMsIGV0Yy4gLi4uXG4gICAqICAgICAgIDwvYmFzaWMtY2Fyb3VzZWw+XG4gICAqICAgICA8L2Jhc2ljLWFycm93LXNlbGVjdGlvbj5cbiAgICpcbiAgICogQmVjYXVzZSBiYXNpYy1hcnJvdy1zZWxlY3Rpb24gdXNlcyB0aGVcbiAgICogW1RhcmdldFNlbGVjdGlvbl0oVGFyZ2V0U2VsZWN0aW9uLm1kKSBtaXhpbiwgaXQgZXhwb3NlcyBtZW1iZXJzIHRvIGFjY2VzcyBhXG4gICAqIHNlbGVjdGlvbjogYHNlbGVjdE5leHRgLCBgc2VsZWN0UHJldmlvdXNgLCBgc2VsZWN0ZWRJbmRleGAsIGV0Yy4gVGhlc2UgYXJlXG4gICAqIGFsbCBkZWxlZ2F0ZWQgdG8gdGhlIGNoaWxkIGNvbXBvbmVudCAoaGVyZSwgYSBiYXNpYy1jYXJvdXNlbCkuXG4gICAqXG4gICAqIFRoaXMgbWl4aW4gZXhwZWN0cyBhIGB0YXJnZXRgIHByb3BlcnR5IHRvIGJlIHNldCB0byB0aGUgZWxlbWVudCBhY3R1YWxseVxuICAgKiBtYW5hZ2luZyB0aGUgc2VsZWN0aW9uLiBZb3UgY2FuIHNldCB0aGF0IHByb3BlcnR5IHlvdXJzZWxmLCBvciB5b3UgY2FuIHVzZVxuICAgKiB0aGUgW0NvbnRlbnRGaXJzdENoaWxkVGFyZ2V0XShDb250ZW50Rmlyc3RDaGlsZFRhcmdldC5tZCkgbWl4aW4gdG9cbiAgICogaW1wbGljaXRseSB0YWtlIHRoZSBjb21wb25lbnQncyBmaXJzdCBjaGlsZCBhcyB0aGUgdGFyZ2V0LiBUaGlzIGlzIHdoYXRcbiAgICogYmFzaWMtYXJyb3ctc2VsZWN0aW9uIChhYm92ZSkgZG9lcy5cbiAgICovXG4gIGNsYXNzIFRhcmdldFNlbGVjdGlvbiBleHRlbmRzIGJhc2Uge1xuXG4gICAgLyoqXG4gICAgICogVGhlIGN1cnJlbnQgc2V0IG9mIGl0ZW1zIGluIHRoZSBsaXN0LlxuICAgICAqXG4gICAgICogQHR5cGUge0hUTUxFbGVtZW50W119XG4gICAgICovXG4gICAgZ2V0IGl0ZW1zKCkge1xuICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy50YXJnZXQ7XG4gICAgICBjb25zdCBpdGVtcyA9IHRhcmdldCAmJiB0YXJnZXQuaXRlbXM7XG4gICAgICByZXR1cm4gaXRlbXMgfHwgW107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhpcyBtZXRob2QgaXMgaW52b2tlZCB3aGVuIHRoZSB1bmRlcmx5aW5nIGNvbnRlbnRzIGNoYW5nZS4gSXQgaXMgYWxzb1xuICAgICAqIGludm9rZWQgb24gY29tcG9uZW50IGluaXRpYWxpemF0aW9uIOKAkyBzaW5jZSB0aGUgaXRlbXMgaGF2ZSBcImNoYW5nZWRcIiBmcm9tXG4gICAgICogYmVpbmcgbm90aGluZy5cbiAgICAgKi9cbiAgICBpdGVtc0NoYW5nZWQoKSB7XG4gICAgICBpZiAoc3VwZXIuaXRlbXNDaGFuZ2VkKSB7IHN1cGVyLml0ZW1zQ2hhbmdlZCgpOyB9XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdpdGVtcy1jaGFuZ2VkJykpO1xuICAgIH1cblxuICAgIGdldCBzZWxlY3RlZEZyYWN0aW9uKCkge1xuICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy50YXJnZXQ7XG4gICAgICByZXR1cm4gdGFyZ2V0ICYmIHRhcmdldC5zZWxlY3RlZEZyYWN0aW9uO1xuICAgIH1cbiAgICBzZXQgc2VsZWN0ZWRGcmFjdGlvbihmcmFjdGlvbikge1xuICAgICAgaWYgKCdzZWxlY3RlZEZyYWN0aW9uJyBpbiBiYXNlLnByb3RvdHlwZSkgeyBzdXBlci5zZWxlY3RlZEZyYWN0aW9uID0gZnJhY3Rpb247IH1cbiAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMudGFyZ2V0O1xuICAgICAgaWYgKHRhcmdldCAmJiB0YXJnZXQuc2VsZWN0ZWRGcmFjdGlvbiAhPT0gZnJhY3Rpb24pIHtcbiAgICAgICAgdGFyZ2V0LnNlbGVjdGVkRnJhY3Rpb24gPSBmcmFjdGlvbjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY3VycmVudGx5IHNlbGVjdGVkIGl0ZW0sIG9yIG51bGwgaWYgdGhlcmUgaXMgbm8gc2VsZWN0aW9uLlxuICAgICAqXG4gICAgICogQHR5cGUge0hUTUxFbGVtZW50fVxuICAgICAqL1xuICAgIGdldCBzZWxlY3RlZEl0ZW0oKSB7XG4gICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLnRhcmdldDtcbiAgICAgIHJldHVybiB0YXJnZXQgJiYgdGFyZ2V0LnNlbGVjdGVkSXRlbTtcbiAgICB9XG4gICAgc2V0IHNlbGVjdGVkSXRlbShpdGVtKSB7XG4gICAgICBpZiAoJ3NlbGVjdGVkSXRlbScgaW4gYmFzZS5wcm90b3R5cGUpIHsgc3VwZXIuc2VsZWN0ZWRJdGVtID0gaXRlbTsgfVxuICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy50YXJnZXQ7XG4gICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgIHRhcmdldC5zZWxlY3RlZEl0ZW0gPSBpdGVtO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoaXMgbWV0aG9kIGV4aXN0cyBzbyB3cmFwcGluZyBjb21wb25lbnRzIGNhbiBoYW5kbGUgYSBjaGFuZ2UgaW4gdGhlXG4gICAgLy8gc2VsZWN0aW9uIHdpdGhvdXQgcG90ZW50aWFsbHkgcmUtaW52b2tpbmcgdGhlIHNlbGVjdGVkSXRlbSBzZXR0ZXIuIFRoaXNcbiAgICAvLyBpcyBraW5kIG9mIHVuc2F0aXNmeWluZywgdGhvdWdoLiBJdCdkIGJlIG5pY2VyIHRvIGxldCBzdWNoIGNvbXBvbmVudHNcbiAgICAvLyBqdXN0IGltcGxlbWVudCB0aGUgZ2V0dGVyL3NldHRlciBmb3Igc2VsZWN0ZWRJdGVtLCBidXQgaGF2ZSBhIHdheSB0b1xuICAgIC8vIGtub3cgd2hldGhlciB0aGV5IG5lZWQgdG8gYWxzbyB0aGF0IHByb3BlcnR5IGdldHRlci9zZXR0ZXIgZm9yIHRoZSB0YXJnZXRcbiAgICAvLyBjb21wb25lbnQuXG4gICAgc2VsZWN0ZWRJdGVtQ2hhbmdlZCgpIHtcbiAgICAgIGlmIChzdXBlci5zZWxlY3RlZEl0ZW1DaGFuZ2VkKSB7IHN1cGVyLnNlbGVjdGVkSXRlbUNoYW5nZWQoKTsgfVxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnc2VsZWN0ZWQtaXRlbS1jaGFuZ2VkJykpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRydWUgaWYgc2VsZWN0aW9uIG5hdmlnYXRpb25zIHdyYXAgZnJvbSBsYXN0IHRvIGZpcnN0LCBhbmQgdmljZSB2ZXJzYS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBkZWZhdWx0IHtmYWxzZX1cbiAgICAgKi9cbiAgICBnZXQgc2VsZWN0aW9uV3JhcHMoKSB7XG4gICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLnRhcmdldDtcbiAgICAgIHJldHVybiB0YXJnZXQgJiYgdGFyZ2V0LnNlbGVjdGlvbldyYXBzO1xuICAgIH1cbiAgICBzZXQgc2VsZWN0aW9uV3JhcHModmFsdWUpIHtcbiAgICAgIGlmICgnc2VsZWN0aW9uV3JhcHMnIGluIGJhc2UucHJvdG90eXBlKSB7IHN1cGVyLnNlbGVjdGlvbldyYXBzID0gdmFsdWU7IH1cbiAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMudGFyZ2V0O1xuICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICB0YXJnZXQuc2VsZWN0aW9uV3JhcHMgPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzL3NldHMgdGhlIHRhcmdldCBlbGVtZW50IHRvIHdoaWNoIHRoaXMgY29tcG9uZW50IHdpbGwgZGVsZWdhdGVcbiAgICAgKiBzZWxlY3Rpb24gYWN0aW9ucy5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtIVE1MRWxlbWVudH1cbiAgICAgKi9cbiAgICBnZXQgdGFyZ2V0KCkge1xuICAgICAgcmV0dXJuIHN1cGVyLnRhcmdldDtcbiAgICB9XG4gICAgc2V0IHRhcmdldChlbGVtZW50KSB7XG4gICAgICBpZiAoJ3RhcmdldCcgaW4gYmFzZS5wcm90b3R5cGUpIHsgc3VwZXIudGFyZ2V0ID0gZWxlbWVudDsgfVxuICAgICAgaWYgKHRoaXNbaXRlbXNDaGFuZ2VkTGlzdGVuZXJTeW1ib2xdKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignaXRlbXMtY2hhbmdlZCcsIHRoaXNbaXRlbXNDaGFuZ2VkTGlzdGVuZXJTeW1ib2xdKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzW3NlbGVjdGVkSXRlbUNoYW5nZWRMaXN0ZW5lclN5bWJvbF0pIHtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKCdzZWxlY3RlZC1pdGVtLWNoYW5nZWQnLCB0aGlzW3NlbGVjdGVkSXRlbUNoYW5nZWRMaXN0ZW5lclN5bWJvbF0pO1xuICAgICAgfVxuICAgICAgdGhpc1tpdGVtc0NoYW5nZWRMaXN0ZW5lclN5bWJvbF0gPSBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2l0ZW1zLWNoYW5nZWQnLCBldmVudCA9PiB7XG4gICAgICAgIHRoaXMuaXRlbXNDaGFuZ2VkKCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXNbc2VsZWN0ZWRJdGVtQ2hhbmdlZExpc3RlbmVyU3ltYm9sXSA9IGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2VsZWN0ZWQtaXRlbS1jaGFuZ2VkJywgZXZlbnQgPT4ge1xuICAgICAgICAvLyBSRVZJRVc6IENvbXBvbmVudHMgYXBwbHlpbmcgVGFyZ2V0U2VsZWN0aW9uIGJvdGggbGlzdGVuIHRvIHRoaXNcbiAgICAgICAgLy8gZXZlbnQgKG9uIHRoZSB0YXJnZXQpLCBhbmQgcmFpc2UgaXQgdGhlbXNlbHZlcy4gSW4gdGhlb3J5LCB0aGV5J3JlXG4gICAgICAgIC8vIGV4cGVjdGVkIHRvICpub3QqIGNhdGNoIHRoZSBldmVudHMgdGhleSByYWlzZSB0aGVtc2VsdmVzLCBidXQgQ2hyb21lXG4gICAgICAgIC8vIChhdCBsZWFzdCkgYXBwZWFycyB0byB2aW9sYXRlIHRoYXQgZXhwZWN0YXRpb24uIFRoYXQgaXMsIGl0J3NcbiAgICAgICAgLy8gcG9zc2libGUgdG8gaGF2ZSBldmVudC50YXJnZXQgPT09IHRoaXMuIE1vcmUgY29uZnVzaW5nbHksIHRoZSBndWFyZFxuICAgICAgICAvLyBiZWxvdywgd2hpY2ggaXMgaW50ZW5kZWQgdG8gYXZvaWQgcmVjdXJzaXZlIGNhbGxzIHRvXG4gICAgICAgIC8vIHNlbGVjdGVkSXRlbUNoYW5nZWQsIGRvZXNuJ3Qgd29yayBhcyBleHBlY3RlZC4gRXZlbiBpZiB0aGUgZGVidWdnZXJcbiAgICAgICAgLy8gc2hvd3MgZXZlbnQudGFyZ2V0ID09PSB0aGlzLCB0aGUgY29udGVudHMgb2YgdGhlIFwiaWZcIiBzdGF0ZW1lbnQgd2lsbFxuICAgICAgICAvLyBiZSBleGVjdXRlZC5cbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldCAhPT0gdGhpcykge1xuICAgICAgICAgIC8vIExldCB0aGUgY29tcG9uZW50IGtub3cgdGhlIHRhcmdldCdzIHNlbGVjdGlvbiBjaGFuZ2VkLCBidXQgd2l0aG91dFxuICAgICAgICAgIC8vIHJlLWludm9raW5nIHRoZSBzZWxlY3RJbmRleC9zZWxlY3RlZEl0ZW0gc2V0dGVyLlxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtQ2hhbmdlZCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIC8vIEZvcmNlIGluaXRpYWwgcmVmcmVzaC5cbiAgICAgIHRoaXMuaXRlbXNDaGFuZ2VkKCk7XG4gICAgfVxuXG4gIH1cblxuICByZXR1cm4gVGFyZ2V0U2VsZWN0aW9uO1xufTtcbiIsImltcG9ydCBjcmVhdGVTeW1ib2wgZnJvbSAnLi9jcmVhdGVTeW1ib2wnO1xuaW1wb3J0IHN5bWJvbHMgZnJvbSAnLi9zeW1ib2xzJztcblxuXG5jb25zdCBwbGF5aW5nU3ltYm9sID0gY3JlYXRlU3ltYm9sKCdwbGF5aW5nJyk7XG5jb25zdCBzZWxlY3Rpb25UaW1lckR1cmF0aW9uU3ltYm9sID0gY3JlYXRlU3ltYm9sKCdzZWxlY3Rpb25UaW1lckR1cmF0aW9uJyk7XG5jb25zdCB0aW1lclRpbWVvdXRTeW1ib2wgPSBjcmVhdGVTeW1ib2woJ3RpbWVyVGltZW91dCcpO1xuXG5cbi8qIEV4cG9ydGVkIGZ1bmN0aW9uIGV4dGVuZHMgYSBiYXNlIGNsYXNzIHdpdGggVGltZXJTZWxlY3Rpb24uICovXG5leHBvcnQgZGVmYXVsdCAoYmFzZSkgPT4ge1xuXG4gIC8qKlxuICAgKiBNaXhpbiB3aGljaCBwcm92aWRlcyBmb3IgYXV0b21hdGljIHRpbWVkIGNoYW5nZXMgaW4gc2VsZWN0aW9uLlxuICAgKlxuICAgKiBUaGlzIG1peGluIGlzIHVzZWZ1bCBmb3IgY3JlYXRpbmcgc2xpZGVzaG93LWxpa2UgZWxlbWVudHMuXG4gICAqXG4gICAqIFRoaXMgbWl4aW4gZXhwZWN0cyB0aGUgY29tcG9uZW50IHRvIGRlZmluZSBhbiBgaXRlbXNgIHByb3BlcnR5LCBhcyB3ZWxsIGFzXG4gICAqIGBzZWxlY3RGaXJzdGAgYW5kIGBzZWxlY3ROZXh0YCBtZXRob2RzLiBZb3UgY2FuIGltcGxlbWVudCB0aG9zZSB5b3Vyc2VsZixcbiAgICogb3IgdXNlIHRoZSBbQ29udGVudEFzSXRlbXNdKENvbnRlbnRBc0l0ZW1zLm1kKSBhbmRcbiAgICogW1NpbmdsZVNlbGVjdGlvbl0oU2luZ2xlU2VsZWN0aW9uLm1kKSBtaXhpbnMuXG4gICAqL1xuICBjbGFzcyBUaW1lclNlbGVjdGlvbiBleHRlbmRzIGJhc2Uge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgLy8gU2V0IGRlZmF1bHRzLlxuICAgICAgaWYgKHR5cGVvZiB0aGlzLnBsYXlpbmcgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMucGxheWluZyA9IHRoaXNbc3ltYm9scy5kZWZhdWx0c10ucGxheWluZztcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5zZWxlY3Rpb25UaW1lckR1cmF0aW9uID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aGlzLnNlbGVjdGlvblRpbWVyRHVyYXRpb24gPSB0aGlzW3N5bWJvbHMuZGVmYXVsdHNdLnNlbGVjdGlvblRpbWVyRHVyYXRpb247XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29udGVudENoYW5nZWQoKSB7XG4gICAgICBpZiAoc3VwZXIuY29udGVudENoYW5nZWQpIHsgc3VwZXIuY29udGVudENoYW5nZWQoKTsgfVxuICAgICAgcmVzdGFydFRpbWVyKHRoaXMpO1xuICAgIH1cblxuICAgIGdldCBbc3ltYm9scy5kZWZhdWx0c10oKSB7XG4gICAgICBjb25zdCBkZWZhdWx0cyA9IHN1cGVyW3N5bWJvbHMuZGVmYXVsdHNdIHx8IHt9O1xuICAgICAgZGVmYXVsdHMucGxheWluZyA9IGZhbHNlO1xuICAgICAgZGVmYXVsdHMuc2VsZWN0aW9uVGltZXJEdXJhdGlvbiA9IDEwMDA7XG4gICAgICByZXR1cm4gZGVmYXVsdHM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQmVnaW4gYXV0b21hdGljIHByb2dyZXNzaW9uIG9mIHRoZSBzZWxlY3Rpb24uXG4gICAgICovXG4gICAgcGxheSgpIHtcbiAgICAgIGlmIChzdXBlci5wbGF5KSB7IHN1cGVyLnBsYXkoKTsgfVxuICAgICAgc3RhcnRUaW1lcih0aGlzKTtcbiAgICAgIHRoaXNbcGxheWluZ1N5bWJvbF0gPSB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhdXNlIGF1dG9tYXRpYyBwcm9ncmVzc2lvbiBvZiB0aGUgc2VsZWN0aW9uLlxuICAgICAqL1xuICAgIHBhdXNlKCkge1xuICAgICAgaWYgKHN1cGVyLnBhdXNlKSB7IHN1cGVyLnBhdXNlKCk7IH1cbiAgICAgIGNsZWFyVGltZXIodGhpcyk7XG4gICAgICB0aGlzW3BsYXlpbmdTeW1ib2xdID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVHJ1ZSBpZiB0aGUgc2VsZWN0aW9uIGlzIGJlaW5nIGF1dG9tYXRpY2FsbHkgYWR2YW5jZWQuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAqL1xuICAgIGdldCBwbGF5aW5nKCkge1xuICAgICAgcmV0dXJuIHRoaXNbcGxheWluZ1N5bWJvbF07XG4gICAgfVxuICAgIHNldCBwbGF5aW5nKHBsYXlpbmcpIHtcbiAgICAgIGNvbnN0IHByZXZpb3VzUGxheWluZyA9IHRoaXNbcGxheWluZ1N5bWJvbF07XG4gICAgICBjb25zdCBwYXJzZWQgPSBTdHJpbmcocGxheWluZykgPT09ICd0cnVlJzsgLy8gQ2FzdCB0byBib29sZWFuXG4gICAgICBpZiAoJ3BsYXlpbmcnIGluIGJhc2UucHJvdG90eXBlKSB7IHN1cGVyLnBsYXlpbmcgPSBwbGF5aW5nOyB9XG4gICAgICBpZiAocGFyc2VkICE9PSBwcmV2aW91c1BsYXlpbmcpIHtcbiAgICAgICAgaWYgKHBsYXlpbmcpIHtcbiAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnBhdXNlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFdoZW4gdGhlIHNlbGVjdGVkIGl0ZW0gY2hhbmdlcyAoYmVjYXVzZSBvZiBzb21ldGhpbmcgdGhpcyBtaXhpbiBkaWQsIG9yXG4gICAgICogd2FzIGNoYW5nZWQgYnkgYW4gb3V0c2lkZSBhZ2VudCBsaWtlIHRoZSB1c2VyKSwgd2Ugd2FpdCBiZWZvcmUgYWR2YW5jaW5nXG4gICAgICogdG8gdGhlIG5leHQgaXRlbS4gQnkgdHJpZ2dlcmluZyB0aGUgbmV4dCBpdGVtIHRoaXMgd2F5LCB3ZSBpbXBsaWNpdGx5IGdldFxuICAgICAqIGEgZGVzaXJhYmxlIGJlaGF2aW9yOiBpZiB0aGUgdXNlciBjaGFuZ2VzIHRoZSBzZWxlY3Rpb24gKGUuZy4sIGluIGFcbiAgICAgKiBjYXJvdXNlbCksIHdlIGxldCB0aGVtIHNlZSB0aGF0IHNlbGVjdGlvbiBzdGF0ZSBmb3IgYSB3aGlsZSBiZWZvcmVcbiAgICAgKiBhZHZhbmNpbmcgdGhlIHNlbGVjdGlvbiBvdXJzZWx2ZXMuXG4gICAgICovXG4gICAgZ2V0IHNlbGVjdGVkSXRlbSgpIHtcbiAgICAgIHJldHVybiBzdXBlci5zZWxlY3RlZEl0ZW07XG4gICAgfVxuICAgIHNldCBzZWxlY3RlZEl0ZW0oaXRlbSkge1xuICAgICAgaWYgKCdzZWxlY3RlZEl0ZW0nIGluIGJhc2UucHJvdG90eXBlKSB7IHN1cGVyLnNlbGVjdGVkSXRlbSA9IGl0ZW07IH1cbiAgICAgIHJlc3RhcnRUaW1lcih0aGlzKTtcbiAgICB9XG5cbiAgICAvLyBJbiBjYXNlIHRoaXMgbWl4aW4gaXMgYmVpbmcgdXNlZCB3aXRoIFRhcmdldFNlbGVjdGlvbi5cbiAgICBzZWxlY3RlZEl0ZW1DaGFuZ2VkKCkge1xuICAgICAgaWYgKHN1cGVyLnNlbGVjdGVkSXRlbUNoYW5nZWQpIHsgc3VwZXIuc2VsZWN0ZWRJdGVtQ2hhbmdlZCgpOyB9XG4gICAgICByZXN0YXJ0VGltZXIodGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIHRpbWUgaW4gbWlsbGlzZWNvbmRzIHRoYXQgd2lsbCBlbGFwc2UgYWZ0ZXIgdGhlIHNlbGVjdGlvbiBjaGFuZ2VzXG4gICAgICogYmVmb3JlIHRoZSBzZWxlY3Rpb24gd2lsbCBiZSBhZHZhbmNlZCB0byB0aGUgbmV4dCBpdGVtIGluIHRoZSBsaXN0LlxuICAgICAqXG4gICAgICogQHR5cGUge251bWJlcn0gLSBUaW1lIGluIG1pbGxpc2Vjb25kc1xuICAgICAqIEBkZWZhdWx0IDEwMDAgKDEgc2Vjb25kKVxuICAgICAqL1xuICAgIGdldCBzZWxlY3Rpb25UaW1lckR1cmF0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXNbc2VsZWN0aW9uVGltZXJEdXJhdGlvblN5bWJvbF07XG4gICAgfVxuICAgIHNldCBzZWxlY3Rpb25UaW1lckR1cmF0aW9uKHZhbHVlKSB7XG4gICAgICB0aGlzW3NlbGVjdGlvblRpbWVyRHVyYXRpb25TeW1ib2xdID0gcGFyc2VJbnQodmFsdWUpO1xuICAgICAgaWYgKCdzZWxlY3Rpb25UaW1lckR1cmF0aW9uJyBpbiBiYXNlLnByb3RvdHlwZSkgeyBzdXBlci5zZWxlY3Rpb25UaW1lckR1cmF0aW9uID0gdmFsdWU7IH1cbiAgICB9XG5cbiAgfVxuXG4gIHJldHVybiBUaW1lclNlbGVjdGlvbjtcbn07XG5cblxuZnVuY3Rpb24gY2xlYXJUaW1lcihlbGVtZW50KSB7XG4gIGlmIChlbGVtZW50W3RpbWVyVGltZW91dFN5bWJvbF0pIHtcbiAgICBjbGVhclRpbWVvdXQoZWxlbWVudFt0aW1lclRpbWVvdXRTeW1ib2xdKTtcbiAgICBlbGVtZW50W3RpbWVyVGltZW91dFN5bWJvbF0gPSBudWxsO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlc3RhcnRUaW1lcihlbGVtZW50KSB7XG4gIGNsZWFyVGltZXIoZWxlbWVudCk7XG4gIGlmIChlbGVtZW50LnBsYXlpbmcgJiYgZWxlbWVudC5pdGVtcyAmJiBlbGVtZW50Lml0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICBzdGFydFRpbWVyKGVsZW1lbnQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHN0YXJ0VGltZXIoZWxlbWVudCkge1xuICAvLyBJZiBwbGF5KCkgaXMgY2FsbGVkIG1vcmUgdGhhbiBvbmNlLCBjYW5jZWwgYW55IGV4aXN0aW5nIHRpbWVyLlxuICBjbGVhclRpbWVyKGVsZW1lbnQpO1xuICBlbGVtZW50W3RpbWVyVGltZW91dFN5bWJvbF0gPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBzZWxlY3ROZXh0V2l0aFdyYXAoZWxlbWVudCk7XG4gIH0sIGVsZW1lbnQuc2VsZWN0aW9uVGltZXJEdXJhdGlvbik7XG59XG5cbi8vIFNlbGVjdCB0aGUgbmV4dCBpdGVtLCB3cmFwcGluZyB0byBmaXJzdCBpdGVtIGlmIG5lY2Vzc2FyeS5cbmZ1bmN0aW9uIHNlbGVjdE5leHRXaXRoV3JhcChlbGVtZW50KSB7XG4gIGNvbnN0IGl0ZW1zID0gZWxlbWVudC5pdGVtcztcbiAgaWYgKGl0ZW1zICYmIGl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICBpZiAoZWxlbWVudC5zZWxlY3RlZEluZGV4ID09IG51bGwgfHwgZWxlbWVudC5zZWxlY3RlZEluZGV4ID09PSBpdGVtcy5sZW5ndGggLSAxKSB7XG4gICAgICBlbGVtZW50LnNlbGVjdEZpcnN0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuc2VsZWN0TmV4dCgpO1xuICAgIH1cbiAgfVxufVxuIiwiLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gdG8gY3JlYXRlIGEgc3ltYm9sIHRoYXQgY2FuIGJlIHVzZWQgZm9yIGFzc29jaWF0aW5nIHByaXZhdGVcbiAqIGRhdGEgd2l0aCBhbiBlbGVtZW50LlxuICpcbiAqIE1peGlucyBhbmQgY29tcG9uZW50IGNsYXNzZXMgb2Z0ZW4gd2FudCB0byBhc3NvY2lhdGUgcHJpdmF0ZSBkYXRhIHdpdGggYW5cbiAqIGVsZW1lbnQgaW5zdGFuY2UsIGJ1dCBKYXZhU2NyaXB0IGRvZXMgbm90IGhhdmUgZGlyZWN0IHN1cHBvcnQgZm9yIHRydWVcbiAqIHByaXZhdGUgcHJvcGVydGllcy4gT25lIGFwcHJvYWNoIGlzIHRvIHVzZSB0aGVcbiAqIFtTeW1ib2xdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1N5bWJvbClcbiAqIGRhdGEgdHlwZSB0byBzZXQgYW5kIHJldHJpZXZlIGRhdGEgb24gYW4gZWxlbWVudC5cbiAqXG4gKiBVbmZvcnR1bmF0ZWx5LCB0aGUgU3ltYm9sIHR5cGUgaXMgbm90IGF2YWlsYWJsZSBpbiBJbnRlcm5ldCBFeHBsb3JlciAxMS4gVGhlXG4gKiBgY3JlYXRlU3ltYm9sYCBoZWxwZXIgZnVuY3Rpb24gZXhpc3RzIGFzIGEgd29ya2Fyb3VuZCBmb3IgSUUgMTEuIFJhdGhlciB0aGFuXG4gKiByZXR1cm5pbmcgYSB0cnVlIFN5bWJvbCwgaXQgc2ltcGx5IHJldHVybnMgYW4gdW5kZXJzY29yZS1wcmVmaXhlZCBzdHJpbmcuXG4gKlxuICogVXNhZ2U6XG4gKlxuICogICAgIGNvbnN0IGZvb1N5bWJvbCA9IGNyZWF0ZVN5bWJvbCgnZm9vJyk7XG4gKlxuICogICAgIGNsYXNzIE15RWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAqICAgICAgIGdldCBmb28oKSB7XG4gKiAgICAgICAgIHJldHVybiB0aGlzW2Zvb1N5bWJvbF07XG4gKiAgICAgICB9XG4gKiAgICAgICBzZXQgZm9vKHZhbHVlKSB7XG4gKiAgICAgICAgIHRoaXNbZm9vU3ltYm9sXSA9IHZhbHVlO1xuICogICAgICAgfVxuICogICAgIH1cbiAqXG4gKiBJbiBJRSAxMSwgdGhpcyBzYW1wbGUgd2lsbCBcImhpZGVcIiBkYXRhIGJlaGluZCBhbiBpbnN0YW5jZSBwcm9wZXJ0eSB0aGlzLl9mb28uXG4gKiBUaGUgdXNlIG9mIHRoZSB1bmRlcnNjb3JlIGlzIG1lYW50IHRvIHJlZHVjZSAobm90IGVsaW1pbmF0ZSkgdGhlIHBvdGVudGlhbFxuICogZm9yIG5hbWUgY29uZmxpY3RzLCBhbmQgZGlzY291cmFnZSAobm90IHByZXZlbnQpIGV4dGVybmFsIGFjY2VzcyB0byB0aGlzXG4gKiBkYXRhLiBJbiBtb2Rlcm4gYnJvd3NlcnMsIHRoZSBhYm92ZSBjb2RlIHdpbGwgZWxpbWluYXRlIHRoZSBwb3RlbnRpYWwgb2ZcbiAqIG5hbWluZyBjb25mbGljdHMsIGFuZCBiZXR0ZXIgaGlkZSB0aGUgZGF0YSBiZWhpbmQgYSByZWFsIFN5bWJvbC5cbiAqXG4gKiBAZnVuY3Rpb24gY3JlYXRlU3ltYm9sXG4gKiBAcGFyYW0ge3N0cmluZ30gZGVzY3JpcHRpb24gLSBBIHN0cmluZyB0byBpZGVudGlmeSB0aGUgc3ltYm9sIHdoZW4gZGVidWdnaW5nXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZVN5bWJvbChkZXNjcmlwdGlvbikge1xuICByZXR1cm4gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgU3ltYm9sKGRlc2NyaXB0aW9uKSA6XG4gICAgYF8ke2Rlc2NyaXB0aW9ufWA7XG59XG4iLCIvKlxuICogTWljcm90YXNrIGhlbHBlciBmb3IgSUUgMTEuXG4gKlxuICogRXhlY3V0aW5nIGEgZnVuY3Rpb24gYXMgYSBtaWNyb3Rhc2sgaXMgdHJpdmlhbCBpbiBicm93c2VycyB0aGF0IHN1cHBvcnRcbiAqIHByb21pc2VzLCB3aG9zZSB0aGVuKCkgY2xhdXNlcyB1c2UgbWljcm90YXNrIHRpbWluZy4gSUUgMTEgZG9lc24ndCBzdXBwb3J0XG4gKiBwcm9taXNlcywgYnV0IGRvZXMgc3VwcG9ydCBNdXRhdGlvbk9ic2VydmVycywgd2hpY2ggYXJlIGFsc28gZXhlY3V0ZWQgYXNcbiAqIG1pY3JvdGFza3MuIFNvIHRoaXMgaGVscGVyIHVzZXMgYW4gTXV0YXRpb25PYnNlcnZlciB0byBhY2hpZXZlIG1pY3JvdGFza1xuICogdGltaW5nLlxuICpcbiAqIFNlZSBodHRwczovL2pha2VhcmNoaWJhbGQuY29tLzIwMTUvdGFza3MtbWljcm90YXNrcy1xdWV1ZXMtYW5kLXNjaGVkdWxlcy9cbiAqXG4gKiBJbnNwaXJlZCBieSBQb2x5bWVyJ3MgYXN5bmMoKSBmdW5jdGlvbi5cbiAqL1xuXG5cbi8vIFRoZSBxdWV1ZSBvZiBwZW5kaW5nIGNhbGxiYWNrcyB0byBiZSBleGVjdXRlZCBhcyBtaWNyb3Rhc2tzLlxuY29uc3QgY2FsbGJhY2tzID0gW107XG5cbi8vIENyZWF0ZSBhbiBlbGVtZW50IHRoYXQgd2Ugd2lsbCBtb2RpZnkgdG8gZm9yY2Ugb2JzZXJ2YWJsZSBtdXRhdGlvbnMuXG5jb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuXG4vLyBBIG1vbm90b25pY2FsbHktaW5jcmVhc2luZyB2YWx1ZS5cbmxldCBjb3VudGVyID0gMDtcblxuXG4vKipcbiAqIEFkZCBhIGNhbGxiYWNrIHRvIHRoZSBtaWNyb3Rhc2sgcXVldWUuXG4gKlxuICogVGhpcyB1c2VzIGEgTXV0YXRpb25PYnNlcnZlciBzbyB0aGF0IGl0IHdvcmtzIG9uIElFIDExLlxuICpcbiAqIE5PVEU6IElFIDExIG1heSBhY3R1YWxseSB1c2UgdGltZW91dCB0aW1pbmcgd2l0aCBNdXRhdGlvbk9ic2VydmVycy4gVGhpc1xuICogbmVlZHMgbW9yZSBpbnZlc3RpZ2F0aW9uLlxuICpcbiAqIEBmdW5jdGlvbiBtaWNyb3Rhc2tcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1pY3JvdGFzayhjYWxsYmFjaykge1xuICBjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gIC8vIEZvcmNlIGEgbXV0YXRpb24uXG4gIGVsZW1lbnQudGV4dENvbnRlbnQgPSArK2NvdW50ZXI7XG59XG5cblxuLy8gRXhlY3V0ZSBhbnkgcGVuZGluZyBjYWxsYmFja3MuXG5mdW5jdGlvbiBleGVjdXRlQ2FsbGJhY2tzKCkge1xuICB3aGlsZSAoY2FsbGJhY2tzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBjYWxsYmFjayA9IGNhbGxiYWNrcy5zaGlmdCgpO1xuICAgIGNhbGxiYWNrKCk7XG4gIH1cbn1cblxuXG4vLyBDcmVhdGUgdGhlIG9ic2VydmVyLlxuY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihleGVjdXRlQ2FsbGJhY2tzKTtcbm9ic2VydmVyLm9ic2VydmUoZWxlbWVudCwge1xuICBjaGFyYWN0ZXJEYXRhOiB0cnVlXG59KTtcbiIsImltcG9ydCBjcmVhdGVTeW1ib2wgZnJvbSAnLi9jcmVhdGVTeW1ib2wnO1xuaW1wb3J0IHRvZ2dsZUNsYXNzIGZyb20gJy4vdG9nZ2xlQ2xhc3MnO1xuXG5cbi8vIFN5bWJvbHMgZm9yIHByaXZhdGUgZGF0YSBtZW1iZXJzIG9uIGFuIGVsZW1lbnQuXG5jb25zdCBzYWZlVG9TZXRBdHRyaWJ1dGVzU3ltYm9sID0gY3JlYXRlU3ltYm9sKCdzYWZlVG9TZXRBdHRyaWJ1dGVzJyk7XG5jb25zdCBwZW5kaW5nQXR0cmlidXRlc1N5bWJvbCA9IGNyZWF0ZVN5bWJvbCgncGVuZGluZ0F0dHJpYnV0ZXMnKTtcbmNvbnN0IHBlbmRpbmdDbGFzc2VzU3ltYm9sID0gY3JlYXRlU3ltYm9sKCdwZW5kaW5nQ2xhc3NlcycpO1xuXG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9ucyBmb3IgdXBkYXRpbmcgYXR0cmlidXRlcywgaW5jbHVkaW5nIHRoZSBgY2xhc3NgIGF0dHJpYnV0ZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuXG4gIC8qKlxuICAgKiBQZXJmb3JtIGFueSBwZW5kaW5nIHVwZGF0ZXMgdG8gYXR0cmlidXRlcyBhbmQgY2xhc3Nlcy5cbiAgICpcbiAgICogVGhpcyB3cml0ZXMgYW55IGBzZXRBdHRyaWJ1dGVgIG9yIGB0b2dnbGVDbGFzc2AgdmFsdWVzIHRoYXQgd2VyZSBwZXJmb3JtZWRcbiAgICogYmVmb3JlIGFuIGVsZW1lbnQgd2FzIGF0dGFjaGVkIHRvIHRoZSBkb2N1bWVudCBmb3IgdGhlIGZpcnN0IHRpbWUuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIHNob3VsZCBiZSBjYWxsZWQgYnkgbWl4aW5zL2NvbXBvbmVudHMgaW4gdGhlaXJcbiAgICogYGNvbm5lY3RlZENhbGxiYWNrYC4gSWYgbXVsaXRwbGUgbWl4aW5zL2NvbXBvbmVudHMgaW52b2tlIHRoaXMgZHVyaW5nIHRoZVxuICAgKiBzYW1lIGBjb25uZWN0ZWRDYWxsYmFja2AsIG9ubHkgdGhlIGZpcnN0IGNhbGwgd2lsbCBoYXZlIGFueSBlZmZlY3QuIFRoZVxuICAgKiBzdWJzZXF1ZW50IGNhbGxzIHdpbGwgYmUgaGFybWxlc3MuXG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBUaGUgZWxlbWVudCBiZWluZyBhZGRlZCB0byB0aGUgZG9jdW1lbnQuXG4gICAqL1xuICBjb25uZWN0ZWQoZWxlbWVudCkge1xuICAgIGVsZW1lbnRbc2FmZVRvU2V0QXR0cmlidXRlc1N5bWJvbF0gPSB0cnVlO1xuXG4gICAgLy8gU2V0IGFueSBwZW5kaW5nIGF0dHJpYnV0ZXMuXG4gICAgaWYgKGVsZW1lbnRbcGVuZGluZ0F0dHJpYnV0ZXNTeW1ib2xdKSB7XG4gICAgICBmb3IgKGxldCBhdHRyaWJ1dGUgaW4gZWxlbWVudFtwZW5kaW5nQXR0cmlidXRlc1N5bWJvbF0pIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBlbGVtZW50W3BlbmRpbmdBdHRyaWJ1dGVzU3ltYm9sXVthdHRyaWJ1dGVdO1xuICAgICAgICBzZXRBdHRyaWJ1dGVUb0VsZW1lbnQoZWxlbWVudCwgYXR0cmlidXRlLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgICBlbGVtZW50W3BlbmRpbmdBdHRyaWJ1dGVzU3ltYm9sXSA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gU2V0IGFueSBwZW5kaW5nIGNsYXNzZXMuXG4gICAgaWYgKGVsZW1lbnRbcGVuZGluZ0NsYXNzZXNTeW1ib2xdKSB7XG4gICAgICBmb3IgKGxldCBjbGFzc05hbWUgaW4gZWxlbWVudFtwZW5kaW5nQ2xhc3Nlc1N5bWJvbF0pIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBlbGVtZW50W3BlbmRpbmdDbGFzc2VzU3ltYm9sXVtjbGFzc05hbWVdO1xuICAgICAgICB0b2dnbGVDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUsIHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIGVsZW1lbnRbcGVuZGluZ0NsYXNzZXNTeW1ib2xdID0gbnVsbDtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNldC91bnNldCB0aGUgYXR0cmlidXRlIHdpdGggdGhlIGluZGljYXRlZCBuYW1lLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBleGlzdHMgcHJpbWFyaWx5IHRvIGhhbmRsZSB0aGUgY2FzZSB3aGVyZSBhbiBlbGVtZW50IHdhbnRzIHRvXG4gICAqIHNldCBhIGRlZmF1bHQgcHJvcGVydHkgdmFsdWUgdGhhdCBzaG91bGQgYmUgcmVmbGVjdGVkIGFzIGFuIGF0dHJpYnV0ZS4gQW5cbiAgICogaW1wb3J0YW50IGxpbWl0YXRpb24gb2YgY3VzdG9tIGVsZW1lbnQgY29uc3R1cmN0b3JzIGlzIHRoYXQgdGhleSBjYW5ub3RcbiAgICogc2V0IGF0dHJpYnV0ZXMuIEEgY2FsbCB0byBgc2V0QXR0cmlidXRlYCBkdXJpbmcgdGhlIGNvbnN0cnVjdG9yIHdpbGxcbiAgICogYmUgZGVmZXJyZWQgdW50aWwgdGhlIGVsZW1lbnQgaXMgY29ubmVjdGVkIHRvIHRoZSBkb2N1bWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGF0dHJpYnV0ZSAtIFRoZSBuYW1lIG9mIHRoZSAqYXR0cmlidXRlKiAobm90IHByb3BlcnR5KSB0byBzZXQuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBzZXQuIElmIG51bGwsIHRoZSBhdHRyaWJ1dGUgd2lsbCBiZSByZW1vdmVkLlxuICAgKi9cbiAgc2V0QXR0cmlidXRlKGVsZW1lbnQsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgICBpZiAoZWxlbWVudFtzYWZlVG9TZXRBdHRyaWJ1dGVzU3ltYm9sXSkge1xuICAgICAgLy8gU2FmZSB0byBzZXQgYXR0cmlidXRlcyBpbW1lZGlhdGVseS5cbiAgICAgIHNldEF0dHJpYnV0ZVRvRWxlbWVudChlbGVtZW50LCBhdHRyaWJ1dGUsIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRGVmZXIgc2V0dGluZyBhdHRyaWJ1dGVzIHVudGlsIHRoZSBmaXJzdCB0aW1lIHdlJ3JlIGNvbm5lY3RlZC5cbiAgICAgIGlmICghZWxlbWVudFtwZW5kaW5nQXR0cmlidXRlc1N5bWJvbF0pIHtcbiAgICAgICAgZWxlbWVudFtwZW5kaW5nQXR0cmlidXRlc1N5bWJvbF0gPSB7fTtcbiAgICAgIH1cbiAgICAgIGVsZW1lbnRbcGVuZGluZ0F0dHJpYnV0ZXNTeW1ib2xdW2F0dHJpYnV0ZV0gPSB2YWx1ZTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNldC91bnNldCB0aGUgY2xhc3Mgd2l0aCB0aGUgaW5kaWNhdGVkIG5hbWUuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGV4aXN0cyBwcmltYXJpbHkgdG8gaGFuZGxlIHRoZSBjYXNlIHdoZXJlIGFuIGVsZW1lbnQgd2FudHMgdG9cbiAgICogc2V0IGEgZGVmYXVsdCBwcm9wZXJ0eSB2YWx1ZSB0aGF0IHNob3VsZCBiZSByZWZsZWN0ZWQgYXMgYXMgY2xhc3MuIEFuXG4gICAqIGltcG9ydGFudCBsaW1pdGF0aW9uIG9mIGN1c3RvbSBlbGVtZW50IGNvbnN0dXJjdG9ycyBpcyB0aGF0IHRoZXkgY2Fubm90XG4gICAqIHNldCBhdHRyaWJ1dGVzLCBpbmNsdWRpbmcgdGhlIGBjbGFzc2AgYXR0cmlidXRlLiBBIGNhbGwgdG9cbiAgICogYHRvZ2dsZUNsYXNzYCBkdXJpbmcgdGhlIGNvbnN0cnVjdG9yIHdpbGwgYmUgZGVmZXJyZWQgdW50aWwgdGhlIGVsZW1lbnRcbiAgICogaXMgY29ubmVjdGVkIHRvIHRoZSBkb2N1bWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBjbGFzcyB0byBzZXQuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZSAtIFRydWUgdG8gc2V0IHRoZSBjbGFzcywgZmFsc2UgdG8gcmVtb3ZlIGl0LlxuICAgKi9cbiAgdG9nZ2xlQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lLCB2YWx1ZSkge1xuICAgIGlmIChlbGVtZW50W3NhZmVUb1NldEF0dHJpYnV0ZXNTeW1ib2xdKSB7XG4gICAgICAvLyBTYWZlIHRvIHNldCBjbGFzcyBpbW1lZGlhdGVseS5cbiAgICAgIHRvZ2dsZUNsYXNzKGVsZW1lbnQsIGNsYXNzTmFtZSwgdmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEZWZlciBzZXR0aW5nIGNsYXNzIHVudGlsIHRoZSBmaXJzdCB0aW1lIHdlJ3JlIGNvbm5lY3RlZC5cbiAgICAgIGlmICghZWxlbWVudFtwZW5kaW5nQ2xhc3Nlc1N5bWJvbF0pIHtcbiAgICAgICAgZWxlbWVudFtwZW5kaW5nQ2xhc3Nlc1N5bWJvbF0gPSB7fTtcbiAgICAgIH1cbiAgICAgIGVsZW1lbnRbcGVuZGluZ0NsYXNzZXNTeW1ib2xdW2NsYXNzTmFtZV0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxufTtcblxuXG4vLyBSZWZsZWN0IHRoZSBhdHRyaWJ1dGUgdG8gdGhlIGdpdmVuIGVsZW1lbnQuXG4vLyBJZiB0aGUgdmFsdWUgaXMgbnVsbCwgcmVtb3ZlIHRoZSBhdHRyaWJ1dGUuXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVUb0VsZW1lbnQoZWxlbWVudCwgYXR0cmlidXRlTmFtZSwgdmFsdWUpIHtcbiAgaWYgKHZhbHVlID09PSBudWxsIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcbiAgfSBlbHNlIHtcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lLCB2YWx1ZSk7XG4gIH1cbn1cbiIsImltcG9ydCBjcmVhdGVTeW1ib2wgZnJvbSAnLi9jcmVhdGVTeW1ib2wnO1xuXG4vKipcbiAqIEEgY29sbGVjdGlvbiBvZiBTeW1ib2wgb2JqZWN0cyBmb3Igc3RhbmRhcmQgY29tcG9uZW50IHByb3BlcnRpZXMgYW5kIG1ldGhvZHMuXG4gKlxuICogVGhlc2UgU3ltYm9sIG9iamVjdHMgYXJlIHVzZWQgdG8gYWxsb3cgbWl4aW5zIGFuZCBhIGNvbXBvbmVudCB0byBpbnRlcm5hbGx5XG4gKiBjb21tdW5pY2F0ZSwgd2l0aG91dCBleHBvc2luZyB0aGVzZSBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzIGluIHRoZSBjb21wb25lbnQnc1xuICogcHVibGljIEFQSS5cbiAqXG4gKiBUbyB1c2UgdGhlc2UgU3ltYm9sIG9iamVjdHMgaW4geW91ciBvd24gY29tcG9uZW50LCBpbmNsdWRlIHRoaXMgbW9kdWxlIGFuZFxuICogdGhlbiBjcmVhdGUgYSBwcm9wZXJ0eSBvciBtZXRob2Qgd2hvc2Uga2V5IGlzIHRoZSBkZXNpcmVkIFN5bWJvbC5cbiAqXG4gKiAgICAgaW1wb3J0ICdTaW5nbGVTZWxlY3Rpb24nIGZyb20gJ2Jhc2ljLWNvbXBvbmVudC1taXhpbnMvc3JjL1NpbmdsZVNlbGVjdGlvbic7XG4gKiAgICAgaW1wb3J0ICdzeW1ib2xzJyBmcm9tICdiYXNpYy1jb21wb25lbnQtbWl4aW5zL3NyYy9zeW1ib2xzJztcbiAqXG4gKiAgICAgY2xhc3MgTXlFbGVtZW50IGV4dGVuZHMgU2luZ2xlU2VsZWN0aW9uKEhUTUxFbGVtZW50KSB7XG4gKiAgICAgICBbc3ltYm9scy5hcHBseVNlbGVjdGlvbl0oaXRlbSwgc2VsZWN0ZWQpIHtcbiAqICAgICAgICAgLy8gVGhpcyB3aWxsIGJlIGludm9rZWQgd2hlbmV2ZXIgYW4gaXRlbSBpcyBzZWxlY3RlZC9kZXNlbGVjdGVkLlxuICogICAgICAgfVxuICogICAgIH1cbiAqXG4gKiBAbW9kdWxlIHN5bWJvbHNcbiAqL1xuY29uc3Qgc3ltYm9scyA9IHtcblxuICAvKipcbiAgICogU3ltYm9sIGZvciB0aGUgYGFwcGx5U2VsZWN0aW9uYCBtZXRob2QuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGFwcGxpZXMgdGhlIGluZGljYXRlZCBzZWxlY3Rpb24gc3RhdGUgdG8gYW4gaXRlbS5cbiAgICpcbiAgICogQGZ1bmN0aW9uIGFwcGx5U2VsZWN0aW9uXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGl0ZW0gLSB0aGUgaXRlbSBiZWluZyBzZWxlY3RlZC9kZXNlbGVjdGVkXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gc2VsZWN0ZWQgLSB0cnVlIGlmIHRoZSBpdGVtIGlzIHNlbGVjdGVkLCBmYWxzZSBpZiBub3RcbiAgICovXG4gIGFwcGx5U2VsZWN0aW9uOiBjcmVhdGVTeW1ib2woJ2FwcGx5U2VsZWN0aW9uJyksXG5cbiAgLyoqXG4gICAqIFN5bWJvbCBmb3IgdGhlIGBkZWZhdWx0c2AgcHJvcGVydHkuXG4gICAqXG4gICAqIFRoaXMgcHJvcGVydHkgY2FuIGJlIHVzZWQgdG8gc2V0IG9yIG92ZXJyaWRlIGRlZmF1bHRzIHRoYXQgd2lsbCBiZSBhcHBsaWVkXG4gICAqIHRvIGEgbmV3IGNvbXBvbmVudCBpbnN0YW5jZS4gV2hlbiBpbXBsZW1lbnRpbmcgdGhpcyBwcm9wZXJ0eSwgdGFrZSBjYXJlIHRvXG4gICAqIGZpcnN0IGFjcXVpcmUgYW55IGRlZmF1bHRzIGRlZmluZWQgYnkgdGhlIHN1cGVyY2xhc3MuIFRoZSBzdGFuZGFyZCBpZGlvbSBpc1xuICAgKiBhcyBmb2xsb3dzOlxuICAgKlxuICAgKiAgICAgZ2V0IFtzeW1ib2xzLmRlZmF1bHRzXSgpIHtcbiAgICogICAgICAgY29uc3QgZGVmYXVsdHMgPSBzdXBlcltzeW1ib2xzLmRlZmF1bHRzXSB8fCB7fTtcbiAgICogICAgICAgLy8gU2V0IG9yIG92ZXJyaWRlIGRlZmF1bHQgdmFsdWVzIGhlcmVcbiAgICogICAgICAgZGVmYXVsdHMuY3VzdG9tUHJvcGVydHkgPSBmYWxzZTtcbiAgICogICAgICAgcmV0dXJuIGRlZmF1bHRzO1xuICAgKiAgICAgfVxuICAgKlxuICAgKiBAdmFyIHtvYmplY3R9IGRlZmF1bHRzXG4gICAqL1xuICBkZWZhdWx0czogY3JlYXRlU3ltYm9sKCdkZWZhdWx0cycpLFxuXG4gIC8qKlxuICAgKiBTeW1ib2wgZm9yIHRoZSBgZHJhZ2dpbmdgIHByb3BlcnR5LlxuICAgKlxuICAgKiBDb21wb25lbnRzIGxpa2UgY2Fyb3VzZWxzIG9mdGVuIGRlZmluZSBhbmltYXRlZCBDU1MgdHJhbnNpdGlvbnMgZm9yXG4gICAqIHNsaWRpbmcgZWZmZWN0cy4gU3VjaCBhIHRyYW5zaXRpb24gc2hvdWxkIHVzdWFsbHkgKm5vdCogYmUgYXBwbGllZCB3aGlsZVxuICAgKiB0aGUgdXNlciBpcyBkcmFnZ2luZywgYmVjYXVzZSBhIENTUyBhbmltYXRpb24gd2lsbCBpbnRyb2R1Y2UgYSBsYWcgdGhhdFxuICAgKiBtYWtlcyB0aGUgc3dpcGUgZmVlbCBzbHVnZ2lzaC4gSW5zdGVhZCwgYXMgbG9uZyBhcyB0aGUgdXNlciBpcyBkcmFnZ2luZ1xuICAgKiB3aXRoIHRoZWlyIGZpbmdlciBkb3duLCB0aGUgdHJhbnNpdGlvbiBzaG91bGQgYmUgc3VwcHJlc3NlZC4gV2hlbiB0aGVcbiAgICogdXNlciByZWxlYXNlcyB0aGVpciBmaW5nZXIsIHRoZSB0cmFuc2l0aW9uIGNhbiBiZSByZXN0b3JlZCwgYWxsb3dpbmcgdGhlXG4gICAqIGFuaW1hdGlvbiB0byBzaG93IHRoZSBjYXJvdXNlbCBzbGlkaW5nIGludG8gaXRzIGZpbmFsIHBvc2l0aW9uLlxuICAgKlxuICAgKiBAdHlwZSB7Ym9vbGVhbn0gdHJ1ZSBpZiBhIGRyYWcgaXMgaW4gcHJvZ3Jlc3MsIGZhbHNlIGlmIG5vdC5cbiAgICovXG4gIGRyYWdnaW5nOiBjcmVhdGVTeW1ib2woJ2RyYWdnaW5nJyksXG5cbiAgLyoqXG4gICAqIFN5bWJvbCBmb3IgdGhlIGBnb0Rvd25gIG1ldGhvZC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaXMgaW52b2tlZCB3aGVuIHRoZSB1c2VyIHdhbnRzIHRvIGdvL25hdmlnYXRlIGRvd24uXG4gICAqXG4gICAqIEBmdW5jdGlvbiBnb0Rvd25cbiAgICovXG4gIGdvRG93bjogY3JlYXRlU3ltYm9sKCdnb0Rvd24nKSxcblxuICAvKipcbiAgICogU3ltYm9sIGZvciB0aGUgYGdvRW5kYCBtZXRob2QuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGludm9rZWQgd2hlbiB0aGUgdXNlciB3YW50cyB0byBnby9uYXZpZ2F0ZSB0byB0aGUgZW5kIChlLmcuLFxuICAgKiBvZiBhIGxpc3QpLlxuICAgKlxuICAgKiBAZnVuY3Rpb24gZ29FbmRcbiAgICovXG4gIGdvRW5kOiBjcmVhdGVTeW1ib2woJ2dvRW5kJyksXG5cbiAgLyoqXG4gICAqIFN5bWJvbCBmb3IgdGhlIGBnb0xlZnRgIG1ldGhvZC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaXMgaW52b2tlZCB3aGVuIHRoZSB1c2VyIHdhbnRzIHRvIGdvL25hdmlnYXRlIGxlZnQuXG4gICAqXG4gICAqIEBmdW5jdGlvbiBnb0xlZnRcbiAgICovXG4gIGdvTGVmdDogY3JlYXRlU3ltYm9sKCdnb0xlZnQnKSxcblxuICAvKipcbiAgICogU3ltYm9sIGZvciB0aGUgYGdvUmlnaHRgIG1ldGhvZC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaXMgaW52b2tlZCB3aGVuIHRoZSB1c2VyIHdhbnRzIHRvIGdvL25hdmlnYXRlIHJpZ2h0LlxuICAgKlxuICAgKiBAZnVuY3Rpb24gZ29SaWdodFxuICAgKi9cbiAgZ29SaWdodDogY3JlYXRlU3ltYm9sKCdnb1JpZ2h0JyksXG5cbiAgLyoqXG4gICAqIFN5bWJvbCBmb3IgdGhlIGBnb1N0YXJ0YCBtZXRob2QuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGludm9rZWQgd2hlbiB0aGUgdXNlciB3YW50cyB0byBnby9uYXZpZ2F0ZSB0byB0aGUgc3RhcnRcbiAgICogKGUuZy4sIG9mIGEgbGlzdCkuXG4gICAqXG4gICAqIEBmdW5jdGlvbiBnb1N0YXJ0XG4gICAqL1xuICBnb1N0YXJ0OiBjcmVhdGVTeW1ib2woJ2dvU3RhcnQnKSxcblxuICAvKipcbiAgICogU3ltYm9sIGZvciB0aGUgYGdvVXBgIG1ldGhvZC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaXMgaW52b2tlZCB3aGVuIHRoZSB1c2VyIHdhbnRzIHRvIGdvL25hdmlnYXRlIHVwLlxuICAgKlxuICAgKiBAZnVuY3Rpb24gZ29VcFxuICAgKi9cbiAgZ29VcDogY3JlYXRlU3ltYm9sKCdnb1VwJyksXG5cbiAgLyoqXG4gICAqIFN5bWJvbCBmb3IgdGhlIGBpdGVtQWRkZWRgIG1ldGhvZC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaXMgaW52b2tlZCB3aGVuIGEgbmV3IGl0ZW0gaXMgYWRkZWQgdG8gYSBsaXN0LlxuICAgKlxuICAgKiBAZnVuY3Rpb24gaXRlbUFkZGVkXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGl0ZW0gLSB0aGUgaXRlbSBiZWluZyBzZWxlY3RlZC9kZXNlbGVjdGVkXG4gICAqL1xuICBpdGVtQWRkZWQ6IGNyZWF0ZVN5bWJvbCgnaXRlbUFkZGVkJyksXG5cbiAgLyoqXG4gICAqIFN5bWJvbCBmb3IgdGhlIGBrZXlkb3duYCBtZXRob2QuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGludm9rZWQgd2hlbiBhbiBlbGVtZW50IHJlY2VpdmVzIGEgYGtleWRvd25gIGV2ZW50LlxuICAgKlxuICAgKiBAZnVuY3Rpb24ga2V5ZG93blxuICAgKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IC0gdGhlIGV2ZW50IGJlaW5nIHByb2Nlc3NlZFxuICAgKi9cbiAga2V5ZG93bjogY3JlYXRlU3ltYm9sKCdrZXlkb3duJylcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHN5bWJvbHM7XG4iLCIvKipcbiAqIEhlbHBlciBmdW5jdGlvbiBmb3Igc3RhbmRhcmQgY2xhc3NMaXN0LnRvZ2dsZSgpIGJlaGF2aW9yIG9uIG9sZCBicm93c2VycyxcbiAqIG5hbWVseSBJRSAxMS5cbiAqXG4gKiBUaGUgc3RhbmRhcmRcbiAqIFtjbGFzc2xpc3RdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2NsYXNzTGlzdClcbiAqIG9iamVjdCBoYXMgYSBgdG9nZ2xlKClgIGZ1bmN0aW9uIHRoYXQgc3VwcG9ydHMgYSBzZWNvbmQgQm9vbGVhbiBwYXJhbWV0ZXJcbiAqIHRoYXQgY2FuIGJlIHVzZWQgdG8gc3VjY2luY3RseSB0dXJuIGEgY2xhc3Mgb24gb3Igb2ZmLiBUaGlzIGZlYXR1cmUgaXMgb2Z0ZW5cbiAqIHVzZWZ1bCBpbiBkZXNpZ25pbmcgY3VzdG9tIGVsZW1lbnRzLCB3aGljaCBtYXkgd2FudCB0byBleHRlcm5hbGx5IHJlZmxlY3RcbiAqIGNvbXBvbmVudCBzdGF0ZSBpbiBhIENTUyBjbGFzcyB0aGF0IGNhbiBiZSB1c2VkIGZvciBzdHlsaW5nIHB1cnBvc2VzLlxuICpcbiAqIFVuZm9ydHVuYXRlbHksIElFIDExIGRvZXMgbm90IHN1cHBvcnQgdGhlIEJvb2xlYW4gcGFyYW1ldGVyIHRvXG4gKiBgY2xhc3NMaXN0LnRvZ2dsZSgpYC4gVGhpcyBoZWxwZXIgZnVuY3Rpb24gYmVoYXZlcyBsaWtlIHRoZSBzdGFuZGFyZFxuICogYHRvZ2dsZSgpYCwgaW5jbHVkaW5nIHN1cHBvcnQgZm9yIHRoZSBCb29sZWFuIHBhcmFtZXRlciwgc28gdGhhdCBpdCBjYW4gYmVcbiAqIHVzZWQgZXZlbiBvbiBJRSAxMS5cbiAqXG4gKiBAZnVuY3Rpb24gdG9nZ2xlQ2xhc3NcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBUaGUgZWxlbWVudCB0byBtb2RpZnlcbiAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWUgLSBUaGUgY2xhc3MgdG8gYWRkL3JlbW92ZVxuICogQHBhcmFtIHtib29sZWFufSBbZm9yY2VdIC0gRm9yY2UgdGhlIGNsYXNzIHRvIGJlIGFkZGVkIChpZiB0cnVlKSBvciByZW1vdmVkXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoaWYgZmFsc2UpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRvZ2dsZUNsYXNzKGVsZW1lbnQsIGNsYXNzTmFtZSwgZm9yY2UpIHtcbiAgY29uc3QgY2xhc3NMaXN0ID0gZWxlbWVudC5jbGFzc0xpc3Q7XG4gIGNvbnN0IGFkZENsYXNzID0gKHR5cGVvZiBmb3JjZSA9PT0gJ3VuZGVmaW5lZCcpID9cbiAgICAhY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkgOlxuICAgIGZvcmNlO1xuICBpZiAoYWRkQ2xhc3MpIHtcbiAgICBjbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gIH0gZWxzZSB7XG4gICAgY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICB9XG4gIHJldHVybiBhZGRDbGFzcztcbn1cbiIsImltcG9ydCBDb21wb3NhYmxlIGZyb20gJy4uLy4uL2Jhc2ljLWNvbXBvbmVudC1taXhpbnMvc3JjL0NvbXBvc2FibGUnO1xuaW1wb3J0IFNoYWRvd1RlbXBsYXRlIGZyb20gJy4uLy4uL2Jhc2ljLWNvbXBvbmVudC1taXhpbnMvc3JjL1NoYWRvd1RlbXBsYXRlJztcbmltcG9ydCBTaGFkb3dFbGVtZW50UmVmZXJlbmNlcyBmcm9tICcuLi8uLi9iYXNpYy1jb21wb25lbnQtbWl4aW5zL3NyYy9TaGFkb3dFbGVtZW50UmVmZXJlbmNlcyc7XG5pbXBvcnQgQXR0cmlidXRlTWFyc2hhbGxpbmcgZnJvbSAnLi4vLi4vYmFzaWMtY29tcG9uZW50LW1peGlucy9zcmMvQXR0cmlidXRlTWFyc2hhbGxpbmcnO1xuaW1wb3J0IERpc3RyaWJ1dGVkQ2hpbGRyZW4gZnJvbSAnLi4vLi4vYmFzaWMtY29tcG9uZW50LW1peGlucy9zcmMvRGlzdHJpYnV0ZWRDaGlsZHJlbic7XG5cblxuLyoqXG4gKiBBIHNhbXBsZSBnZW5lcmFsLXB1cnBvc2UgYmFzZSBjbGFzcyBmb3IgZGVmaW5pbmcgY3VzdG9tIGVsZW1lbnRzIHRoYXQgbWl4ZXNcbiAqIGluIHNvbWUgY29tbW9uIGZlYXR1cmVzOiB0ZW1wbGF0ZSBzdGFtcGluZyBpbnRvIGEgc2hhZG93IHJvb3QsIHNoYWRvdyBlbGVtZW50XG4gKiByZWZlcmVuY2VzLCBtYXJzaGFsbGluZyBhdHRyaWJ1dGVzIHRvIHByb3BlcnRpZXMsIGFuZCByZXRyaWV2aW5nIHRoZSBjaGlsZHJlblxuICogZGlzdHJpYnV0ZWQgdG8gYSBjb21wb25lbnQuXG4gKlxuICogVGhpcyBiYXNlIGNsYXNzIGlzIG5vdCBzcGVjaWFsIGluIGFueSB3YXksIGFuZCBpcyBkZWZpbmVkIG9ubHkgYXMgYVxuICogY29udmVuaWVudCBzaG9ydGhhbmQgZm9yIGFwcGx5aW5nIHRoZSBtaXhpbnMgbGlzdGVkIGFib3ZlLiBZb3UgY2FuIHVzZSB0aGlzXG4gKiBjbGFzcyBhcyBhIGJhc2UgY2xhc3MgZm9yIHlvdXIgb3duIGVsZW1lbnRzLCBvciBlYXNpbHkgY3JlYXRlIHlvdXIgb3duIGJhc2VcbiAqIGNsYXNzIGJ5IGFwcGx5aW5nIHRoZSBzYW1lIHNldCBvZiBtaXhpbnMuXG4gKlxuICogVGhlIEVsZW1lbnRCYXNlIGJhc2UgY2xhc3MgZG9lcyBub3QgcmVnaXN0ZXIgaXRzZWxmIGFzIGEgY3VzdG9tIGVsZW1lbnQgd2l0aFxuICogdGhlIGJyb3dzZXIsIGFuZCBoZW5jZSBjYW5ub3QgYmUgaW5kZXBlbmRlbnRseSBpbnN0YW50aWF0ZWQuXG4gKlxuICogQG1peGVzIEF0dHJpYnV0ZU1hcnNoYWxsaW5nIFxuICogQG1peGVzIENvbXBvc2FibGVcbiAqIEBtaXhlcyBEaXN0cmlidXRlZENoaWxkcmVuXG4gKiBAbWl4ZXMgU2hhZG93RWxlbWVudFJlZmVyZW5jZXNcbiAqIEBtaXhlcyBTaGFkb3dUZW1wbGF0ZVxuICovXG5jbGFzcyBFbGVtZW50QmFzZSBleHRlbmRzIENvbXBvc2FibGUoSFRNTEVsZW1lbnQpLmNvbXBvc2UoXG4gIFNoYWRvd1RlbXBsYXRlLCAgICAgICAgICAvLyBiZWZvcmUgbm9kZSBmaW5kaW5nLCBzbyBzaGFkb3cgcm9vdCBpcyBwb3B1bGF0ZWRcbiAgU2hhZG93RWxlbWVudFJlZmVyZW5jZXMsIC8vIGJlZm9yZSBtYXJzaGFsbGluZywgc28gcHJvcGVydGllcyBjYW4gdXNlIHJlZnNcbiAgQXR0cmlidXRlTWFyc2hhbGxpbmcsXG4gIERpc3RyaWJ1dGVkQ2hpbGRyZW5cbikge1xuXG4gIC8qXG4gICAqIERlYnVnZ2luZyB1dGlsaXR5OiBsb2dzIGEgbWVzc2FnZSwgcHJlZml4ZWQgYnkgdGhlIGNvbXBvbmVudCdzIHRhZy5cbiAgICovXG4gIGxvZyh0ZXh0KSB7XG4gICAgaWYgKHN1cGVyLmxvZykgeyBzdXBlci5sb2codGV4dCk7IH1cbiAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmxvY2FsTmFtZX06ICR7dGV4dH1gKTtcbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEVsZW1lbnRCYXNlO1xuIiwiLypcbiAqIFRoaXMgZmlsZSBpcyB0cmFuc3BpbGVkIHRvIGNyZWF0ZSBhbiBFUzUtY29tcGF0aWJsZSBkaXN0cmlidXRpb24gaW4gd2hpY2hcbiAqIHRoZSBwYWNrYWdlJ3MgbWFpbiBmZWF0dXJlKHMpIGFyZSBhdmFpbGFibGUgdmlhIHRoZSB3aW5kb3cuQmFzaWMgZ2xvYmFsLlxuICogSWYgeW91J3JlIGFscmVhZHkgdXNpbmcgRVM2IHlvdXJzZWxmLCBpZ25vcmUgdGhpcyBmaWxlLCBhbmQgaW5zdGVhZCBpbXBvcnRcbiAqIHRoZSBzb3VyY2UgZmlsZShzKSB5b3Ugd2FudCBmcm9tIHRoZSBzcmMgZm9sZGVyLlxuICovXG5cbmltcG9ydCBTbGlkZXNob3dUaW1lciBmcm9tICcuL3NyYy9TbGlkZXNob3dUaW1lcic7XG5cbndpbmRvdy5CYXNpYyA9IHdpbmRvdy5CYXNpYyB8fCB7fTtcbndpbmRvdy5CYXNpYy5TbGlkZXNob3dUaW1lciA9IFNsaWRlc2hvd1RpbWVyO1xuIiwiaW1wb3J0IEVsZW1lbnRCYXNlIGZyb20gJy4uLy4uL2Jhc2ljLWVsZW1lbnQtYmFzZS9zcmMvRWxlbWVudEJhc2UnO1xuaW1wb3J0IENvbnRlbnRGaXJzdENoaWxkVGFyZ2V0IGZyb20gJy4uLy4uL2Jhc2ljLWNvbXBvbmVudC1taXhpbnMvc3JjL0NvbnRlbnRGaXJzdENoaWxkVGFyZ2V0JztcbmltcG9ydCBEaXN0cmlidXRlZENoaWxkcmVuQXNDb250ZW50IGZyb20gJy4uLy4uL2Jhc2ljLWNvbXBvbmVudC1taXhpbnMvc3JjL0Rpc3RyaWJ1dGVkQ2hpbGRyZW5Bc0NvbnRlbnQnO1xuaW1wb3J0IFNpbmdsZVNlbGVjdGlvbiBmcm9tICcuLi8uLi9iYXNpYy1jb21wb25lbnQtbWl4aW5zL3NyYy9TaW5nbGVTZWxlY3Rpb24nO1xuaW1wb3J0IEtleWJvYXJkIGZyb20gJy4uLy4uL2Jhc2ljLWNvbXBvbmVudC1taXhpbnMvc3JjL0tleWJvYXJkJztcbmltcG9ydCBLZXlib2FyZERpcmVjdGlvbiBmcm9tICcuLi8uLi9iYXNpYy1jb21wb25lbnQtbWl4aW5zL3NyYy9LZXlib2FyZERpcmVjdGlvbic7XG5pbXBvcnQgc3ltYm9scyBmcm9tICcuLi8uLi9iYXNpYy1jb21wb25lbnQtbWl4aW5zL3NyYy9zeW1ib2xzJztcbmltcG9ydCBUYXJnZXRJbkNvbGxlY3RpdmUgZnJvbSAnLi4vLi4vYmFzaWMtY29tcG9uZW50LW1peGlucy9zcmMvVGFyZ2V0SW5Db2xsZWN0aXZlJztcbmltcG9ydCBUYXJnZXRTZWxlY3Rpb24gZnJvbSAnLi4vLi4vYmFzaWMtY29tcG9uZW50LW1peGlucy9zcmMvVGFyZ2V0U2VsZWN0aW9uJztcbmltcG9ydCBUaW1lclNlbGVjdGlvbiBmcm9tICcuLi8uLi9iYXNpYy1jb21wb25lbnQtbWl4aW5zL3NyYy9UaW1lclNlbGVjdGlvbic7XG5cblxuY29uc3QgYmFzZSA9IEVsZW1lbnRCYXNlLmNvbXBvc2UoXG4gIENvbnRlbnRGaXJzdENoaWxkVGFyZ2V0LFxuICBEaXN0cmlidXRlZENoaWxkcmVuQXNDb250ZW50LFxuICBTaW5nbGVTZWxlY3Rpb24sXG4gIEtleWJvYXJkLFxuICBLZXlib2FyZERpcmVjdGlvbixcbiAgVGFyZ2V0SW5Db2xsZWN0aXZlLFxuICBUYXJnZXRTZWxlY3Rpb24sXG4gIFRpbWVyU2VsZWN0aW9uXG4pO1xuXG5cbi8qKlxuICogQXV4aWxpYXJ5IGNvbXBvbmVudCB0byBhZHZhbmNlIGEgc2VsZWN0aW9uIHdpdGggYSB0aW1lci5cbiAqXG4gKiBUaGlzIGNvbXBvbmVudCBpcyBnZW5lcmFsbHkgdXNlZCB0byB3cmFwIGEgY29tcG9uZW50IGxpa2VcbiAqIFtiYXNpYy1jYXJvdXNlbF0oLi4vYmFzaWMtY2Fyb3VzZWwpIG9yIHRoZSBzaW1wbGVyXG4gKiBbYmFzaWMtc2xpZGluZy1jYXJvdXNlbF0oLi4vYmFzaWMtc2xpZGluZy1jYXJvdXNlbCkgdG8gYWRkIHNsaWRlc2hvd1xuICogYmVoYXZpb3IuIEZvciBhIHN0YW5kYWxvbmUgc2xpZGVzaG93IGNvbXBvbmVudCwgc2VlXG4gKiBbYmFzaWMtc2xpZGVzaG93XSguLi9iYXNpYy1zbGlkZXNob3cpLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogICAgIDxiYXNpYy1zbGlkZXNob3ctdGltZXI+XG4gKiAgICAgICA8YmFzaWMtY2Fyb3VzZWw+XG4gKiAgICAgICAgIC4uLiBpbWFnZXMgb3Igb3RoZXIgZWxlbWVudHMgLi4uXG4gKiAgICAgICA8L2Jhc2ljLWNhcm91c2VsPlxuICogICAgIDwvYmFzaWMtc2xpZGVzaG93LXRpbWVyPlxuICpcbiAqIFRoZSBiYXNpYy1zbGlkZXNob3ctdGltZXIgY29tcG9uZW50IHByb3ZpZGVzIG5vIHZpc2libGUgdXNlciBpbnRlcmZhY2VcbiAqIGVsZW1lbnRzLCBhbmQgZXhpc3RzIGNoaWVmbHkgYXMgYSBjb252ZW5pZW5jZSBmb3IgdXNlIGluIHNjZW5hcmlvcyBsaWtlIHRoZVxuICogb25lIGFib3ZlLiBJZiB5b3UncmUgZGV2ZWxvcGluZyBhIGNvbXBvbmVudCB0aGF0IHdpbGwgYWx3YXlzIHdhbnQgdG8gcHJvdmlkZVxuICogc2xpZGVzaG93IHNlbWFudGljcywgY29uc2lkZXIgZGlyZWN0bHkgYXBwbHlpbmcgdGhlXG4gKiBbVGltZXJTZWxlY3Rpb25dKC4uL2Jhc2ljLWNvbXBvbmVudC1taXhpbnMvZG9jcy9UaW1lclNlbGVjdGlvbi5tZCkgbWl4aW5cbiAqIHRvIHlvdXIgY29tcG9uZW50LlxuICpcbiAqIEBleHRlbmRzIEVsZW1lbnRCYXNlXG4gKi9cbmNsYXNzIFNsaWRlc2hvd1RpbWVyIGV4dGVuZHMgYmFzZSB7XG5cbiAgZ2V0IFtzeW1ib2xzLmRlZmF1bHRzXSgpIHtcbiAgICBjb25zdCBkZWZhdWx0cyA9IHN1cGVyW3N5bWJvbHMuZGVmYXVsdHNdIHx8IHt9O1xuICAgIGRlZmF1bHRzLnBsYXlpbmcgPSB0cnVlO1xuICAgIGRlZmF1bHRzLnNlbGVjdGlvbkFuaW1hdGlvbkR1cmF0aW9uID0gNTAwO1xuICAgIGRlZmF1bHRzLnNlbGVjdGlvblJlcXVpcmVkID0gdHJ1ZTtcbiAgICBkZWZhdWx0cy5zZWxlY3Rpb25UaW1lckR1cmF0aW9uID0gMzAwMDtcbiAgICByZXR1cm4gZGVmYXVsdHM7XG4gIH1cblxuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIGBcbiAgICAgIDxzdHlsZT5cbiAgICAgIDpob3N0IHtcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgfVxuICAgICAgPC9zdHlsZT5cbiAgICAgIDxzbG90Pjwvc2xvdD5cbiAgICBgO1xuICB9XG5cbn1cblxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2Jhc2ljLXNsaWRlc2hvdy10aW1lcicsIFNsaWRlc2hvd1RpbWVyKTtcbiJdfQ==
