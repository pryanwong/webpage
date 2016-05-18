/////////////////////////////////////////////////////
// fabric.canvasex.js
//
// Author: Jim Ma (https://github.com/mazong1123)
//
// Contact: mazong1123@gmail.com
//
// License: MIT
//
/////////////////////////////////////////////////////
(function () {
    'use strict';

    var addListener = fabric.util.addListener;
    var removeListener = fabric.util.removeListener;

    fabric.CanvasEx = fabric.util.createClass(fabric.Canvas, /** @lends fabric.Canvas */ {
        tapholdThreshold: 2000,

        _bindEvents: function () {
            var self = this;

            self.callSuper('_bindEvents');

            self._onDoubleClick = self._onDoubleClick.bind(self);
            self._onTapHold = self._onTapHold.bind(self);
        },

        _onDoubleClick: function (e) {
            var self = this;

            var target = self.findTarget(e);
            self.fire('mouse:dblclick', {
                target: target,
                e: e
            });

            if (target && !self.isDrawingMode) {
                // To unify the behavior, the object's double click event does not fire on drawing mode.
                target.fire('object:dblclick', {
                    e: e
                });
            }
        },

        _onTapHold: function (e) {
            var self = this;

            var target = self.findTarget(e);
            self.fire('touch:taphold', {
                target: target,
                e: e
            });

            if (target && !self.isDrawingMode) {
                // To unify the behavior, the object's tap hold event does not fire on drawing mode.
                target.fire('taphold', {
                    e: e
                });
            }

            if (e.type === 'touchend' && self.touchStartTimer != null) {
                clearTimeout(self.touchStartTimer);
            }
        },

        _onMouseDown: function (e) {
            var self = this;

            self.callSuper('_onMouseDown', e);

            if (e.type === 'touchstart') {
                var touchStartTimer = setTimeout(function () {
                    self._onTapHold(e);
                    self.isLongTap = true;
                }, self.tapholdThreshold);

                self.touchStartTimer = touchStartTimer;

                return;
            }

            // Add right click support
            if (e.which === 3) {
                var target = this.findTarget(e);
                self.fire('mouse:down', { target: target, e: e });
                if (target && !self.isDrawingMode) {
                    // To unify the behavior, the object's mouse down event does not fire on drawing mode.
                    target.fire('mousedown', {
                        e: e
                    });
                }
            }
        },

        _onMouseUp: function (e) {
            var self = this;

            self.callSuper('_onMouseUp', e);

            if (e.type === 'touchend') {
                // Process tap hold.
                if (self.touchStartTimer != null) {
                    clearTimeout(self.touchStartTimer);
                }

                // Process long tap.
                if (self.isLongTap) {
                    self._onLongTapEnd(e);
                    self.isLongTap = false;
                }

                // Process double click
                var now = new Date().getTime();
                var lastTouch = self.lastTouch || now + 1;
                var delta = now - lastTouch;
                if (delta < 300 && delta > 0) {
                    // After we detct a doubletap, start over
                    self.lastTouch = null;

                    self._onDoubleTap(e);
                } else {
                    self.lastTouch = now;
                }

                return;
            }
        },

        _onDoubleTap: function (e) {
            var self = this;

            var target = self.findTarget(e);
            self.fire('touch:doubletap', {
                target: target,
                e: e
            });

            if (target && !self.isDrawingMode) {
                // To unify the behavior, the object's double tap event does not fire on drawing mode.
                target.fire('object:doubletap', {
                    e: e
                });
            }
        },

        _onLongTapEnd: function (e) {
            var self = this;

            var target = self.findTarget(e);
            self.fire('touch:longtapend', {
                target: target,
                e: e
            });

            if (target && !self.isDrawingMode) {
                // To unify the behavior, the object's long tap end event does not fire on drawing mode.
                target.fire('object:longtapend', {
                    e: e
                });
            }
        },

        _initEventListeners: function () {
            var self = this;
            self.callSuper('_initEventListeners');

            addListener(self.upperCanvasEl, 'dblclick', self._onDoubleClick);
        },

        removeListeners: function () {
            var self = this;
            self.callSuper('removeListeners');

            removeListener(self.upperCanvasEl, 'dblclick', self._onDoubleClick);
        }
    });
})();

// log.debug("Create Custom Image Class");
fabric.CustomImage = fabric.util.createClass(fabric.Image, {
   type: 'custom-image',
   initialize: function(element, options) {
       this.callSuper('initialize', element, options);
       options && this.set('model', options.model);
       options && this.set('config', options.config);
       options && this.set('origloc', options.origloc);
       options && this.set('price', options.price);
       options && this.set('configdbid', options.configdbid);
   },
   toObject: function() {
       return fabric.util.object.extend(this.callSuper('toObject'),
                                     {config: this.config,
                                      price:  this.price,
                                      model:  this.model,
                                      origloc: this.origloc,
                                      configdbid: this.configdbid});
   },
   setConfig: function(configString) {
      this.config = configString;
      canvas.trigger('custom-image:textChange');
   },
   _render: function(ctx) {
      this.callSuper('_render', ctx);
      if (this.config != 'undefined') {
        //log.debug("In Call Super Render, ctx")
        log.trace(ctx)
        ctx.font = '12px Helvetica';
        ctx.fillStyle = '#333';
        //log.debug("render text");
        textwidth = ctx.measureText(this.config).width
        ctx.fillText(this.config, -textwidth/2, (this.height/2+10))
      }
   }
});
fabric.CustomImage.fromObject = function(object, callback) {
 fabric.util.loadImage(object.src, function(img) {
   callback && callback(new fabric.CustomImage(img, object));
  });
};
fabric.CustomImage.async = true;

//log.debug("Create Custom Line Class");
fabric.Customline = fabric.util.createClass(fabric.Line, {
  type: 'customline',
  initialize: function(coords, options) {
      options || (options = {});
      this.callSuper('initialize', coords ,options);
      options && this.set('objId', options.objId);
      options && this.set('cone', options.cone);
      options && this.set('ctwo', options.ctwo);
  },
  toObject: function() {
      return fabric.util.object.extend(this.callSuper('toObject'),
                                    {objId: this.objId,
                                     cone:    this.cone,
                                     ctwo:    this.ctwo});
  },
  setObjId: function(objIdString) {
     this.objId = objIdString;
  },
  getObjId: function() {
     return this.objId;
  },
  setCone: function(c1String) {
     this.cone = c1String;
  },
  setCtwo: function(c2String) {
     this.ctwo = c2String;
  },
   _render: function(ctx) {
      this.callSuper('_render', ctx);
   }
});
fabric.Customline.fromObject = function (object) {
  return new fabric.Customline([object.x1,object.y1,object.x2,object.y2], object);
};
fabric.Customline.async = false;

//log.debug("Create Custom Circlezero Class");
fabric.Circlezero = fabric.util.createClass(fabric.Circle, {
 type: 'circlezero',
 initialize: function(element, options) {
     this.callSuper('initialize', element, options);
     options && this.set('belongsTo', options.belongsTo);
 },
 toObject: function() {
     return fabric.util.object.extend(this.callSuper('toObject'),
                                   {belongsTo: this.belongsTo});
 },
 setBelongsTo: function(belongsToString) {
    this.belongsTo = belongsToString;
 },
 _render: function(ctx) {
    this.callSuper('_render', ctx);
 }
});
fabric.Circlezero.fromObject = function(object) {
  return new fabric.Circlezero(object);
};
fabric.Circlezero.async = false;

//log.debug("Create Custom Circleone Class");
fabric.Circleone = fabric.util.createClass(fabric.Circle, {
type: 'circleone',
initialize: function(element, options) {
    this.callSuper('initialize', element, options);
    options && this.set('belongsTo', options.belongsTo);
},
toObject: function() {
    return fabric.util.object.extend(this.callSuper('toObject'),
                                  {belongsTo: this.belongsTo});
},
setBelongsTo: function(belongsToString) {
   this.belongsTo = belongsToString;
},
_render: function(ctx) {
   this.callSuper('_render', ctx);
}
});
fabric.Circleone.fromObject = function(object) {
  return new fabric.Circleone(object);
};
fabric.Circleone.async = false;
