!function(){"use strict";var e=fabric.util.addListener,t=fabric.util.removeListener;fabric.CanvasEx=fabric.util.createClass(fabric.Canvas,{tapholdThreshold:2e3,_bindEvents:function(){var e=this;e.callSuper("_bindEvents"),e._onDoubleClick=e._onDoubleClick.bind(e),e._onTapHold=e._onTapHold.bind(e)},_onDoubleClick:function(e){var t=this,i=t.findTarget(e);t.fire("mouse:dblclick",{target:i,e:e}),i&&!t.isDrawingMode&&i.fire("object:dblclick",{e:e})},_onTapHold:function(e){var t=this,i=t.findTarget(e);t.fire("touch:taphold",{target:i,e:e}),i&&!t.isDrawingMode&&i.fire("taphold",{e:e}),"touchend"===e.type&&null!=t.touchStartTimer&&clearTimeout(t.touchStartTimer)},_onMouseDown:function(e){var t=this;if(t.callSuper("_onMouseDown",e),"touchstart"===e.type){var i=setTimeout(function(){t._onTapHold(e),t.isLongTap=!0},t.tapholdThreshold);return void(t.touchStartTimer=i)}if(3===e.which){var o=this.findTarget(e);t.fire("mouse:down",{target:o,e:e}),o&&!t.isDrawingMode&&o.fire("mousedown",{e:e})}},_onMouseUp:function(e){var t=this;if(t.callSuper("_onMouseUp",e),"touchend"===e.type){null!=t.touchStartTimer&&clearTimeout(t.touchStartTimer),t.isLongTap&&(t._onLongTapEnd(e),t.isLongTap=!1);var i=(new Date).getTime(),o=t.lastTouch||i+1,n=i-o;return void(300>n&&n>0?(t.lastTouch=null,t._onDoubleTap(e)):t.lastTouch=i)}},_onDoubleTap:function(e){var t=this,i=t.findTarget(e);t.fire("touch:doubletap",{target:i,e:e}),i&&!t.isDrawingMode&&i.fire("object:doubletap",{e:e})},_onLongTapEnd:function(e){var t=this,i=t.findTarget(e);t.fire("touch:longtapend",{target:i,e:e}),i&&!t.isDrawingMode&&i.fire("object:longtapend",{e:e})},_initEventListeners:function(){var t=this;t.callSuper("_initEventListeners"),e(t.upperCanvasEl,"dblclick",t._onDoubleClick)},removeListeners:function(){var e=this;e.callSuper("removeListeners"),t(e.upperCanvasEl,"dblclick",e._onDoubleClick)}})}();