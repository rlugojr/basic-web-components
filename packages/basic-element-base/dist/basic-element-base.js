!function e(t,n,r){function o(u,a){if(!n[u]){if(!t[u]){var c="function"==typeof require&&require;if(!a&&c)return c(u,!0);if(i)return i(u,!0);var f=new Error("Cannot find module '"+u+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[u]={exports:{}};t[u][0].call(l.exports,function(e){var n=t[u][1][e];return o(n?n:e)},l,l.exports,e,t,n,r)}return n[u].exports}for(var i="function"==typeof require&&require,u=0;u<r.length;u++)o(r[u]);return o}({1:[function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e){var t=b[e];if(!t){var n=/-([a-z])/g;t=e.replace(n,function(e){return e[1].toUpperCase()}),b[e]=t}return t}function c(e){if(e===HTMLElement||e===Object)return[];var t=Object.getPrototypeOf(e.prototype).constructor,n=c(t),r=Object.getOwnPropertyNames(e.prototype),o=r.filter(function(t){return"function"==typeof Object.getOwnPropertyDescriptor(e.prototype,t).set}),i=o.map(function(e){return f(e)}),u=i.filter(function(e){return n.indexOf(e)<0});return n.concat(u)}function f(e){var t=y[e];if(!t){var n=/([A-Z])/g;t=e.replace(n,"-$1").toLowerCase()}return t}Object.defineProperty(n,"__esModule",{value:!0});var l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var i=Object.getPrototypeOf(t);return null===i?void 0:e(i,n,r)}if("value"in o)return o.value;var u=o.get;if(void 0!==u)return u.call(r)},p=e("./safeAttributes"),d=r(p),b={},y={};n.default=function(e){var t=function(e){function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return u(t,e),l(t,[{key:"attributeChangedCallback",value:function(e,n,r){s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"attributeChangedCallback",this)&&s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"attributeChangedCallback",this).call(this);var o=a(e);o in this&&!(o in HTMLElement.prototype)&&(this[o]=r)}},{key:"connectedCallback",value:function(){s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"connectedCallback",this)&&s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"connectedCallback",this).call(this),d.default.connected(this)}},{key:"reflectAttribute",value:function(e,t){return d.default.setAttribute(this,e,t)}},{key:"reflectClass",value:function(e,t){return d.default.toggleClass(this,e,t)}}],[{key:"observedAttributes",get:function(){return c(this)}}]),t}(e);return t}},{"./safeAttributes":7}],2:[function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function u(e,t){if("function"==typeof t)return t(e);var n=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),t}(e);return a(t,n.prototype,f),n}function a(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[];return Object.getOwnPropertyNames(e).forEach(function(r){if(n.indexOf(r)<0){var o=Object.getOwnPropertyDescriptor(e,r);Object.defineProperty(t,r,o)}}),t}Object.defineProperty(n,"__esModule",{value:!0});var c=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();n.default=function(e){var t=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),c(t,null,[{key:"compose",value:function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return t.reduce(u,this)}}]),t}(e);return t};var f=["constructor"]},{}],3:[function(e,t,n){"use strict";function r(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e,t){var n,o=Array.prototype.map.call(e,function(e){var n="undefined"!=typeof HTMLSlotElement?e instanceof HTMLSlotElement:"slot"===e.localName;if(n){var r=e.assignedNodes({flatten:!0});return r?a(r,t):[]}return e instanceof HTMLElement?[e]:e instanceof Text&&t?[e]:[]}),i=(n=[]).concat.apply(n,r(o));return i}Object.defineProperty(n,"__esModule",{value:!0});var c=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();n.default=function(e){var t=function(e){function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return u(t,e),c(t,[{key:"distributedChildren",get:function(){return a(this.children,!1)}},{key:"distributedChildNodes",get:function(){return a(this.childNodes,!0)}},{key:"distributedTextContent",get:function(){var e=this.distributedChildNodes.map(function(e){return e.textContent});return e.join("")}}]),t}(e);return t}},{}],4:[function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(e){var t=function(e){function t(){r(this,t);var e=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));if(e.shadowRoot){e.$={};var n=e.shadowRoot.querySelectorAll("[id]");[].forEach.call(n,function(t){var n=t.getAttribute("id");e.$[n]=t})}return e}return i(t,e),t}(e);return t}},{}],5:[function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e){var t=document.createElement("template"),n=document.createElement("div");for(n.innerHTML=e;n.childNodes.length>0;)t.content.appendChild(n.childNodes[0]);return t}function c(e,t){window.WebComponents.ShadowCSS.shimStyling(e.content,t)}Object.defineProperty(n,"__esModule",{value:!0});var f=e("../src/symbols"),l=r(f);n.default=function(e){var t=function(e){function t(){o(this,t);var e=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this)),n=e[l.default.template];if(n){"string"==typeof n&&(n=a(n)),window.ShadowDOMPolyfill&&c(n,e.localName);var r=e.attachShadow({mode:"open"}),u=document.importNode(n.content,!0);r.appendChild(u)}return e}return u(t,e),t}(e);return t}},{"../src/symbols":8}],6:[function(e,t,n){"use strict";function r(e){return"function"==typeof Symbol?Symbol(e):"_"+e}Object.defineProperty(n,"__esModule",{value:!0}),n.default=r},{}],7:[function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t,n){if(null===n||"undefined"==typeof n)e.removeAttribute(t);else{var r=String(n);e.getAttribute(t)!==r&&e.setAttribute(t,n)}}Object.defineProperty(n,"__esModule",{value:!0});var i=e("./createSymbol"),u=r(i),a=e("./toggleClass"),c=r(a),f=(0,u.default)("safeToSetAttributes"),l=(0,u.default)("pendingAttributes"),s=(0,u.default)("pendingClasses");n.default={connected:function(e){if(e[f]=!0,e[l]){for(var t in e[l]){var n=e[l][t];o(e,t,n)}e[l]=null}if(e[s]){for(var r in e[s]){var i=e[s][r];(0,c.default)(e,r,i)}e[s]=null}},setAttribute:function(e,t,n){e[f]?o(e,t,n):(e[l]||(e[l]={}),e[l][t]=n)},toggleClass:function(e,t,n){e[f]?(0,c.default)(e,t,n):(e[s]||(e[s]={}),e[s][t]=n)}}},{"./createSymbol":6,"./toggleClass":9}],8:[function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var o=e("./createSymbol"),i=r(o),u={defaults:(0,i.default)("defaults"),dragging:(0,i.default)("dragging"),goDown:(0,i.default)("goDown"),goEnd:(0,i.default)("goEnd"),goLeft:(0,i.default)("goLeft"),goRight:(0,i.default)("goRight"),goStart:(0,i.default)("goStart"),goUp:(0,i.default)("goUp"),handlingUserInteraction:(0,i.default)("handlingUserInteraction"),itemAdded:(0,i.default)("itemAdded"),itemsChanged:(0,i.default)("itemsChanged"),itemSelected:(0,i.default)("itemSelected"),keydown:(0,i.default)("keydown"),template:(0,i.default)("template")};n.default=u},{"./createSymbol":6}],9:[function(e,t,n){"use strict";function r(e,t,n){var r=e.classList,o="undefined"==typeof n?!r.contains(t):n;return o?r.add(t):r.remove(t),o}Object.defineProperty(n,"__esModule",{value:!0}),n.default=r},{}],10:[function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}var o=e("./src/ElementBase"),i=r(o);window.Basic=window.Basic||{},window.Basic.ElementBase=i.default},{"./src/ElementBase":11}],11:[function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(n,"__esModule",{value:!0});var a=e("../../basic-component-mixins/src/AttributeMarshallingMixin"),c=r(a),f=e("../../basic-component-mixins/src/ComposableMixin"),l=r(f),s=e("../../basic-component-mixins/src/DistributedChildrenMixin"),p=r(s),d=e("../../basic-component-mixins/src/ShadowElementReferencesMixin"),b=r(d),y=e("../../basic-component-mixins/src/ShadowTemplateMixin"),h=r(y),_=function(e){function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return u(t,e),t}((0,l.default)(HTMLElement).compose(h.default,b.default,c.default,p.default));n.default=_},{"../../basic-component-mixins/src/AttributeMarshallingMixin":1,"../../basic-component-mixins/src/ComposableMixin":2,"../../basic-component-mixins/src/DistributedChildrenMixin":3,"../../basic-component-mixins/src/ShadowElementReferencesMixin":4,"../../basic-component-mixins/src/ShadowTemplateMixin":5}]},{},[10]);
//# sourceMappingURL=basic-element-base.js.map
