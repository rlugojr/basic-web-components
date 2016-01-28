<a name="ContentAsItems"></a>
## ContentAsItems
Mixin which maps content semantics (elements) to list item
semantics.

This mixin expects a component to provide a `content` property returning a
raw set of elements. You can provide that yourself, or use the
`DistributedChildrenAsContent` mixin.

Items differ from element contents in several ways:

* They are often referenced via index.
* They may have a selection state.
* It's common to do work to initialize the appearance or state of a new item.
* Auxiliary invisible child elements are filtered out and not counted as
  items. Auxiliary elements include link, script, style, and template
  elements. This filtering ensures that those auxiliary elements can be used
  in markup inside of a list without being treated as list items.

**Kind**: global class  
<a name="undefineditems"></a>
## undefineditems : <code>Array.&lt;HTMLElement&gt;</code>
The current set of items in the list. See the top-level documentation for
mixin for a description of how items differ from plain content.

**Kind**: global variable  
<a name="applySelection"></a>
## applySelection(item, selected)
Apply the selection state to a single item.

Invoke this method to signal that the selected state of the indicated item
has changed. By default, this applies a `selected` CSS class if the item
is selected, and removed it if not selected.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>HTMLElement</code> | The item whose selection state has changed. |
| selected | <code>boolean</code> | True if the item is selected, false if not. |

<a name="indexOfItem"></a>
## indexOfItem(item) ⇒ <code>number</code>
Return the positional index for the indicated item.

Because this acts like a getter, this does not invoke a base implementation.

**Kind**: global function  
**Returns**: <code>number</code> - The index of the item, or -1 if not found.  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>HTMLElement</code> | The item whose index is requested. |

<a name="itemAdded"></a>
## itemAdded(item)
This method is invoked whenever a new item is added to the list.

The default implementation of this method does nothing. You can override
this to perform per-item initialization.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>HTMLElement</code> | The item that was added. |

<a name="itemsChanged"></a>
## itemsChanged()
This method is invoked when the underlying contents change. It is also
invoked on component initialization – since the items have "changed" from
being nothing.

**Kind**: global function  
<a name="event_items-changed"></a>
## "items-changed"
Fires when the items in the list change.

**Kind**: event emitted  