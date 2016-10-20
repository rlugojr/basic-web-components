import ElementBase from '../../basic-element-base/src/ElementBase';
import ContentAsItems from '../../basic-component-mixins/src/ContentAsItems';
import DistributedChildrenAsContent from '../../basic-component-mixins/src/DistributedChildrenAsContent';
import FractionalSelection from '../../basic-component-mixins/src/FractionalSelection';
import SelectionAnimation from '../../basic-component-mixins/src/SelectionAnimation';
import SelectionAriaActive from '../../basic-component-mixins/src/SelectionAriaActive';
import SingleSelection from '../../basic-component-mixins/src/SingleSelection';
import symbols from '../../basic-component-mixins/src/symbols';
import TimerSelection from '../../basic-component-mixins/src/TimerSelection';


let base = ElementBase.compose(
  ContentAsItems,
  DistributedChildrenAsContent,
  FractionalSelection,
  SelectionAnimation,
  SelectionAriaActive,
  SingleSelection,
  TimerSelection
);

/**
 * Slideshow with animated transitions.
 *
 * By default the slideshow will immediately begin playing when it is connected
 * to the document, advance every 3000 ms (3 seconds), and use a simple
 * crossfade effect.
 *
 * This component can be used on its own. To incorporate slideshow behavior into
 * a component of your own, apply the
 * [TimerSelection](../basic-component-mixins/docs/TimerSelection.md) mixin. To
 * add slideshow functionality to a component such as a carousel, wrap it with
 * the auxiliary [basic-slideshow-timer](../basic-slideshow-timer) component.
 *
 * @extends ElementBase
 * @mixes ContentAsItems
 * @mixes DistributedChildrenAsContent
 * @mixes FractionalSelection
 * @mixes SelectionAnimation
 * @mixes SelectionAriaActive
 * @mixes SingleSelection
 * @mixes TimerSelection
 */
class Slideshow extends base {

  get [symbols.defaults]() {
    let defaults = super[symbols.defaults] || {};
    defaults.playing = true;
    defaults.selectionAnimationDuration = 500;
    defaults.selectionAnimationEffect = 'crossfade';
    defaults.selectionRequired = true;
    defaults.selectionTimerDuration = 3000;
    defaults.selectionWraps = true;
    return defaults;
  }

  get template() {
    return `
      <style>
      :host {
        display: -webkit-flex;
        display: flex;
        overflow: hidden;
        position: relative;
      }

      #container ::slotted(*) {
        height: 100%;
        object-fit: contain;
        position: absolute;
        width: 100%;
        will-change: transform;
      }
      </style>

      <div id="container" role="none">
        <slot></slot>
      </div>
    `;
  }

}


customElements.define('basic-slideshow', Slideshow);
