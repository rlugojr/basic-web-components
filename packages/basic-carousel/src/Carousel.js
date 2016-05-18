import ElementBase from '../../basic-element-base/src/ElementBase';

import AnimationStage from '../../basic-animation-stage/src/AnimationStage'; // jshint ignore:line
import ContentAsItems from '../../basic-component-mixins/src/ContentAsItems';
import createSymbol from '../../basic-component-mixins/src/createSymbol';
import DirectionSelection from '../../basic-component-mixins/src/DirectionSelection';
import DistributedChildrenAsContent from '../../basic-component-mixins/src/DistributedChildrenAsContent';
import Generic from '../../basic-component-mixins/src/Generic';
import ItemsSelection from '../../basic-component-mixins/src/ItemsSelection';
import Keyboard from '../../basic-component-mixins/src/Keyboard';
import KeyboardDirection from '../../basic-component-mixins/src/KeyboardDirection';
import ObserveContentChanges from '../../basic-component-mixins/src/ObserveContentChanges';
import SelectionAriaActive from '../../basic-component-mixins/src/SelectionAriaActive';
import SwipeDirection from '../../basic-component-mixins/src/SwipeDirection';
import TargetInCollective from '../../basic-component-mixins/src/TargetInCollective';
import TargetSelection from '../../basic-component-mixins/src/TargetSelection';
import TrackpadDirection from '../../basic-component-mixins/src/TrackpadDirection';

const targetSymbol = createSymbol('target');


let base = ElementBase.compose(
  ContentAsItems,
  DirectionSelection,
  DistributedChildrenAsContent,
  Generic,
  ItemsSelection,
  Keyboard,
  KeyboardDirection,
  ObserveContentChanges,
  SelectionAriaActive,
  SwipeDirection,
  TargetInCollective,
  TargetSelection,
  TrackpadDirection
);


/**
 * Lets the user navigate laterally through a sequence of child elements.
 *
 * basic-carousel is an implementation of the carousel user interface pattern,
 * commonly used for navigating between images, pages, and other elements. This
 * pattern presents the user with a linear sequence of elements, only one of
 * which is shown at a time. The user can navigate to the next/previous element
 * with a variety of input methods.
 *
 * [Live demo](http://basicwebcomponents.org/basic-web-components/packages/basic-carousel/)
 *
 * You can also view demos with optional
 * [arrows](http://basicwebcomponents.org/basic-web-components/packages/basic-carousel/carouselWithArrows.html),
 * [dots](http://basicwebcomponents.org/basic-web-components/packages/basic-carousel/carouselWithDots.html),
 * or both [arrows and dots](http://basicwebcomponents.org/basic-web-components/packages/basic-carousel/carouselWithArrowsAndDots.html).
 *
 * basic-carousel uses its children as the elements the user will navigate
 * through. In a typical use, a basic-carousel can be used to navigate between a
 * sequence of images:
 *
 *     <basic-carousel>
 *       <img src="image1.jpg">
 *       <img src="image2.jpg">
 *       <img src="image3.jpg">
 *     </basic-carousel>
 *
 * The child elements can be of any type — they are not restricted to images.
 *
 * This component attempts to meet the [Gold Standard for web components]
 * (https://github.com/webcomponents/gold-standard/wiki) so that it is generally
 * as flexible and robust as standard HTML elements. For example, it meets the
 * "Content Changes" criteria: the carousel will adapt to new child elements
 * added or removed at runtime.
 *
 * Currently, this component does not meet the Gold Standard criteria "Size to
 * Content". As a result, for the time being, **you must manually set a size on
 * this component**. Two approaches are to: 1) stretch the component across
 * whatever surface it is contained within, or 2) set it to be larger than the
 * largest child element you want to display. The former approach is more
 * common, and can be achieved with CSS styling such as:
 *
 *     html {
 *       height: 100%;
 *     }
 *
 *     body {
 *       display: -webkit-flex;
 *       display: flex;
 *       height: 100%;
 *       margin: 0;
 *     }
 *
 *     basic-carousel {
 *       -webkit-flex: 1;
 *       flex: 1;
 *     }
 *
 * The standard basic-carousel component supports navigation via the following
 * input methods:
 *
 * * Keyboard. When the carousel has focus, the user can press Left, Right,
 *   Home, or End. These navigate to the expected element.
 * * Touch. On mobile and other touch-enabled devices, the user can drag left or
 *   right.
 * * Trackpad. The user can swipe left or right on a trackpad to navigate.
 *
 * Because carousels are used in a wide variety of circumstances, by default
 * basic-carousel provides a minimal appearance and no separately interactive
 * elements such as arrow buttons on the side or dots along the bottom. Those
 * elements can be added by wrapping a basic-carousel in optional accessories:
 *
 * * [basic-arrow-selection](http://github.com/basic-web-components/basic-web-components/packages/basic-arrow-selection).
 *   This adds prominent left and right arrow buttons on the side of the carousel.
 * * [basic-page-dots](http://github.com/basic-web-components/basic-web-components/packages/basic-page-dots).
 *   This adds a series of small dots below the carousel to indicate the user's
 *   current position in the sequence.
 *
 * See those components for more details, but in general you can construct a
 * common carousel with both arrow buttons and dots like so:
 *
 *     <basic-arrow-selection>
 *       <basic-page-dots>
 *         <basic-carousel>
 *           ... images, etc. ...
 *         </basic-carousel>
 *       </basic-page-dots>
 *     </basic-arrow-selection>
 *
 * For universal access, basic-carousel automatically adds a variety of
 * [ARIA](http://www.w3.org/WAI/intro/aria) properties to itself and to child
 * elements. This helps users navigate the sequence of elements in the carousel
 * using assistive technologies.
 *
 * @extends ElementBase
 * @mixes ContentAsItems
 * @mixes DirectionSelection
 * @mixes DistributedChildrenAsContent
 * @mixes Generic
 * @mixes ItemsSelection
 * @mixes Keyboard
 * @mixes KeyboardDirection
 * @mixes ObserveContentChanges
 * @mixes SelectionAriaActive
 * @mixes SwipeDirection
 * @mixes TargetInCollective
 * @mixes TargetSelection
 * @mixes TrackpadDirection
 */
class Carousel extends base {

  attachedCallback() {
    if (super.attachedCallback) { super.attachedCallback(); }
    // HACK
    this.itemsChanged();
    this.selectionRequired = true;
  }

  createdCallback() {
    if (super.createdCallback) { super.createdCallback(); }
    this.navigationAxis = 'horizontal';
    this.target = this.$.stage;
  }

  get target() {
    return this[targetSymbol];
  }
  set target(value) {
    if ('target' in base.prototype) { super.target = value; }
    this[targetSymbol] = value;
  }

  // get selectedFraction() {
  //   return this.$.stage.selectedFraction;
  // }
  // set selectedFraction(value) {
  //   if ('selectedFraction' in base.prototype) { super.selectedFraction = value; }
  //   this.$.stage.selectedFraction = value;
  //   let event = new CustomEvent('selection-fraction-changed');
  //   this.dispatchEvent(event);
  // }
  //
  // get selectedIndex() {
  //   return super.selectedIndex;
  // }
  // set selectedIndex(value) {
  //   if ('selectedIndex' in base.prototype) { super.selectedIndex = value; }
  //   this.$.stage.selectedIndex = value;
  // }
  //
  // get selectedItem() {
  //   return super.selectedItem;
  // }
  // set selectedItem(item) {
  //   if ('selectedItem' in base.prototype) { super.selectedItem = item; }
  //   this.$.stage.selectedItem = item;
  // }
  //
  // /**
  //  * Determine whether a transition should be shown during selection.
  //  *
  //  * Components like carousels often define animated CSS transitions for
  //  * sliding effects. Such a transition should usually *not* be applied while
  //  * the user is dragging, because a CSS animation will introduce a lag that
  //  * makes the swipe feel sluggish. Instead, as long as the user is dragging
  //  * with their finger down, the transition should be suppressed. When the
  //  * user releases their finger, the transition can be restored, allowing the
  //  * animation to show the carousel sliding into its final position.
  //  *
  //  * Note: This property is only intended to let a component cooperate with
  //  * mixins that may be applied to it, and is not intended to let someone
  //  * using component permanently enable or disable transition effects.
  //  *
  //  * @type {boolean} true if a component-provided transition should be shown,
  //  * false if not.
  //  */
  // get showTransition() {
  //   return super.showTransition || this.$.stage.showTransition;
  // }
  // set showTransition(value) {
  //   if ('showTransition' in base.prototype) { super.showTransition = value; }
  //   this.$.stage.showTransition = value;
  // }

  get template() {
    return `
      <style>
      :host {
        display: -webkit-flex;
        display: flex;
      }

      basic-animation-stage {
        display: -webkit-flex;
        display: flex;
        -webkit-flex: 1;
        flex: 1;
      }
      </style>

      <basic-animation-stage id="stage">
        <slot></slot>
      </basic-animation-stage>
    `;
  }
}


document.registerElement('basic-carousel', Carousel);
export default Carousel;
