/* vue-onsenui v2.6.2 - 2019-01-06 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('onsenui')) :
	typeof define === 'function' && define.amd ? define(['onsenui'], factory) :
	(global.VueOnsen = factory(global.ons));
}(this, (function (ons) { 'use strict';

ons = ons && ons.hasOwnProperty('default') ? ons['default'] : ons;

var setup = function (ons$$1) {
  return Object.keys(ons$$1).filter(function (k) {
    return [/^is/, /^disable/, /^enable/, /^mock/, /^open/, /^set/, /animit/, /elements/, /fastClick/, /GestureDetector/, /notification/, /orientation/, /platform/, /ready/].some(function (t) {
      return k.match(t);
    });
  }).reduce(function (r, k) {
    r[k] = ons$$1[k];
    return r;
  }, { _ons: ons$$1 });
};

var capitalize = function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

var camelize = function camelize(string) {
  return string.toLowerCase().replace(/-([a-z])/g, function (m, l) {
    return l.toUpperCase();
  });
};

var eventToHandler = function eventToHandler(name) {
  return '_on' + capitalize(name);
};

var handlerToProp = function handlerToProp(name) {
  return name.slice(2).charAt(0).toLowerCase() + name.slice(2).slice(1);
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};



















var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



































var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/* Private */
var _setupDBB = function _setupDBB(component) {
  var dbb = 'onDeviceBackButton';
  // Call original handler or parent handler by default
  var handler = component[dbb] || component.$el[dbb] && component.$el[dbb]._callback || function (e) {
    return e.callParentHandler();
  };

  component.$el[dbb] = function (event) {
    var runDefault = true;

    component.$emit(handlerToProp(dbb), _extends({}, event, {
      preventDefault: function preventDefault() {
        return runDefault = false;
      }
    }));

    runDefault && handler(event);
  };

  component._isDBBSetup = true;
};

/* Public */
// Device Back Button Handler
var deriveDBB = {
  mounted: function mounted() {
    _setupDBB(this);
  },


  // Core destroys deviceBackButton handlers on disconnectedCallback.
  // This fixes the behavior for <keep-alive> component.
  activated: function activated() {
    this._isDBBSetup === false && _setupDBB(this);
  },
  deactivated: function deactivated() {
    this._isDBBSetup === true && (this._isDBBSetup = false);
  },
  destroyed: function destroyed() {
    this.$el.onDeviceBackButton && this.$el.onDeviceBackButton.destroy();
  }
};

var deriveEvents = {
  computed: {
    unrecognizedListeners: function unrecognizedListeners() {
      var _this = this;

      var name = camelize('-' + this.$options._componentTag.slice(6));
      return Object.keys(this.$listeners || {}).filter(function (k) {
        return (_this.$ons.elements[name].events || []).indexOf(k) === -1;
      }).reduce(function (r, k) {
        r[k] = _this.$listeners[k];
        return r;
      }, {});
    }
  },

  mounted: function mounted() {
    var _this2 = this;

    this._handlers = {};

    (this.$el.constructor.events || []).forEach(function (key) {
      _this2._handlers[eventToHandler(key)] = function (event) {
        // Filter events from different components with the same name
        if (event.target === _this2.$el || !/^ons-/i.test(event.target.tagName)) {
          _this2.$emit(key, event);
        }
      };
      _this2.$el.addEventListener(key, _this2._handlers[eventToHandler(key)]);
    });
  },
  beforeDestroy: function beforeDestroy() {
    var _this3 = this;

    Object.keys(this._handlers).forEach(function (key) {
      _this3.$el.removeEventListener(key, _this3._handlers[key]);
    });
    this._handlers = null;
  }
};

/* Private */
var _toggleVisibility = function _toggleVisibility() {
  if (typeof this.visible === 'boolean' && this.visible !== this.$el.visible) {
    this.$el[this.visible ? 'show' : 'hide'].call(this.$el, this.normalizedOptions || this.options);
  }
};
var _teleport = function _teleport() {
  if (!this._isDestroyed && (!this.$el.parentNode || this.$el.parentNode !== document.body)) {
    document.body.appendChild(this.$el);
  }
};
var _unmount = function _unmount() {
  var _this = this;

  if (this.$el.visible === true) {
    this.$el.hide().then(function () {
      return _this.$el.remove();
    });
  } else {
    this.$el.remove();
  }
};

/* Public */
// Components that can be shown or hidden
var hidable = {
  props: {
    visible: {
      type: Boolean,
      default: undefined // Avoid casting to false
    }
  },

  watch: {
    visible: function visible() {
      _toggleVisibility.call(this);
    }
  },

  mounted: function mounted() {
    var _this2 = this;

    this.$nextTick(function () {
      return _toggleVisibility.call(_this2);
    });
  },
  activated: function activated() {
    var _this3 = this;

    this.$nextTick(function () {
      return _toggleVisibility.call(_this3);
    });
  }
};

// Components with 'options' property
var hasOptions = {
  props: {
    options: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  }
};

// Provides itself to its descendants
var selfProvider = {
  provide: function provide() {
    return defineProperty({}, this.$options._componentTag.slice(6), this);
  }
};

// Common event for Dialogs
var dialogCancel = {
  mounted: function mounted() {
    var _this4 = this;

    this.$on('dialog-cancel', function () {
      return _this4.$emit('update:visible', false);
    });
  }
};

// Moves the element to a global position
var portal = {
  mounted: function mounted() {
    _teleport.call(this);
  },
  updated: function updated() {
    _teleport.call(this);
  },
  activated: function activated() {
    _teleport.call(this);
  },
  deactivated: function deactivated() {
    _unmount.call(this);
  },
  beforeDestroy: function beforeDestroy() {
    _unmount.call(this);
  }
};

var modifier = {
  props: {
    modifier: {
      type: [String, Array, Object]
    }
  },

  computed: {
    normalizedModifier: function normalizedModifier() {
      var modifier = this.modifier;

      if (typeof modifier === 'string') {
        return modifier;
      }

      if (Array.isArray(modifier)) {
        return modifier.join(' ');
      }

      if ((typeof modifier === 'undefined' ? 'undefined' : _typeof(modifier)) === 'object') {
        return Object.keys(modifier).reduce(function (acc, key) {
          return acc + (modifier[key] ? ' ' + key : '');
        }, '').trim();
      }

      return false;
    }
  }
};

var _props;
var _props2;

/* Private */
var model = {
  prop: 'modelProp',
  event: 'modelEvent'
};

/* Public */

// Generic input
var modelInput = {
  model: model,
  props: (_props = {}, defineProperty(_props, model.prop, [Number, String]), defineProperty(_props, model.event, {
    type: String,
    default: 'input'
  }), _props),

  methods: {
    _updateValue: function _updateValue() {
      if (this[model.prop] !== undefined && this.$el.value !== this[model.prop]) {
        this.$el.value = this[model.prop];
      }
    },
    _onModelEvent: function _onModelEvent(event) {
      this.$emit(model.event, event.target.value);
    }
  },

  watch: defineProperty({}, model.prop, function () {
    this._updateValue();
  }),

  mounted: function mounted() {
    this._updateValue();
    this.$el.addEventListener(this[model.event], this._onModelEvent);
  },
  beforeDestroy: function beforeDestroy() {
    this.$el.removeEventListener(this[model.event], this._onModelEvent);
  }
};

// Checkable inputs
var modelCheckbox = {
  mixins: [modelInput],

  props: (_props2 = {}, defineProperty(_props2, model.prop, [Array, Boolean]), defineProperty(_props2, model.event, {
    type: String,
    default: 'change'
  }), _props2),

  methods: {
    _updateValue: function _updateValue() {
      if (this[model.prop] instanceof Array) {
        this.$el.checked = this[model.prop].indexOf(this.$el.value) >= 0;
      } else {
        this.$el.checked = this[model.prop];
      }
    },
    _onModelEvent: function _onModelEvent(event) {
      var _event$target = event.target,
          value = _event$target.value,
          checked = _event$target.checked;

      var newValue = void 0;

      if (this[model.prop] instanceof Array) {
        // Is Array
        var index = this[model.prop].indexOf(value);
        var included = index >= 0;

        if (included && !checked) {
          newValue = [].concat(toConsumableArray(this[model.prop].slice(0, index)), toConsumableArray(this[model.prop].slice(index + 1, this[model.prop].length)));
        }

        if (!included && checked) {
          newValue = [].concat(toConsumableArray(this[model.prop]), [value]);
        }
      } else {
        // Is Boolean
        newValue = checked;
      }

      // Emit if value changed
      newValue !== undefined && this.$emit(model.event, newValue);
    }
  }
};

// Radio input
var modelRadio = {
  mixins: [modelInput],
  props: defineProperty({}, model.event, {
    type: String,
    default: 'change'
  }),

  methods: {
    _updateValue: function _updateValue() {
      this.$el.checked = this[model.prop] === this.$el.value;
    },
    _onModelEvent: function _onModelEvent(event) {
      var _event$target2 = event.target,
          value = _event$target2.value,
          checked = _event$target2.checked;

      checked && this.$emit(model.event, value);
    }
  }
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-toolbar';
var VOnsToolbar = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-toolbar', _vm._g({ attrs: { "modifier": _vm.normalizedModifier } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-toolbar',
  mixins: [deriveEvents, hidable, modifier]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-bottom-toolbar';
var VOnsBottomToolbar = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-bottom-toolbar', _vm._g({ attrs: { "modifier": _vm.normalizedModifier } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-bottom-toolbar',
  mixins: [deriveEvents, modifier]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-toolbar-button';
var VOnsToolbarButton = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-toolbar-button', _vm._g({ attrs: { "modifier": _vm.normalizedModifier } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-toolbar-button',
  mixins: [deriveEvents, modifier]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-alert-dialog-button';
var VOnsAlertDialogButton = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-alert-dialog-button', _vm._g({ attrs: { "modifier": _vm.normalizedModifier } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-alert-dialog-button',
  mixins: [deriveEvents, modifier]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-button';
var VOnsButton = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-button', _vm._g({ attrs: { "modifier": _vm.normalizedModifier } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-button',
  mixins: [deriveEvents, modifier]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-icon';
var VOnsIcon = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-icon', _vm._g({ attrs: { "modifier": _vm.normalizedModifier } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-icon',
  mixins: [deriveEvents, modifier]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-card';
var VOnsCard = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-card', _vm._g({ attrs: { "modifier": _vm.normalizedModifier } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-card',
  mixins: [deriveEvents, modifier]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-list';
var VOnsList = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-list', _vm._g({ attrs: { "modifier": _vm.normalizedModifier } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-list',
  mixins: [deriveEvents, modifier]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-list-item';
var VOnsListItem = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-list-item', _vm._g({ attrs: { "modifier": _vm.normalizedModifier }, on: { "expansion": _vm.onExpansion } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-list-item',
  mixins: [deriveEvents, modifier],
  props: {
    expanded: {
      type: Boolean
    }
  },
  methods: {
    onExpansion: function onExpansion() {
      if (this.expanded !== this.$el.expanded) {
        this.$emit('update:expanded', this.$el.expanded);
      }
    }
  },
  watch: {
    expanded: function expanded() {
      var action = this.expanded ? 'show' : 'hide';
      this.$el[action + 'Expansion']();
    }
  }
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-list-title';
var VOnsListTitle = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-list-title', _vm._g({ attrs: { "modifier": _vm.normalizedModifier } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-list-title',
  mixins: [deriveEvents, modifier]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-list-header';
var VOnsListHeader = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-list-header', _vm._g({ attrs: { "modifier": _vm.normalizedModifier } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-list-header',
  mixins: [deriveEvents, modifier]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-ripple';
var VOnsRipple = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-ripple', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-ripple',
  mixins: [deriveEvents]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-row';
var VOnsRow = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-row', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-row',
  mixins: [deriveEvents]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-col';
var VOnsCol = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-col', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-col',
  mixins: [deriveEvents]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-progress-bar';
var VOnsProgressBar = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-progress-bar', _vm._g({ attrs: { "modifier": _vm.normalizedModifier } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-progress-bar',
  mixins: [deriveEvents, modifier]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-progress-circular';
var VOnsProgressCircular = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-progress-circular', _vm._g({ attrs: { "modifier": _vm.normalizedModifier } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-progress-circular',
  mixins: [deriveEvents, modifier]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-carousel-item';
var VOnsCarouselItem = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-carousel-item', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-carousel-item',
  mixins: [deriveEvents]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-splitter-mask';
var VOnsSplitterMask = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-splitter-mask', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-splitter-mask',
  mixins: [deriveEvents]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-splitter-content';
var VOnsSplitterContent = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-splitter-content', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-splitter-content',
  mixins: [deriveEvents]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-splitter';
var VOnsSplitter = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-splitter', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-splitter',
  mixins: [deriveEvents, selfProvider, deriveDBB]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-switch';
var VOnsSwitch = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-switch', _vm._g({ attrs: { "modifier": _vm.normalizedModifier } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-switch',
  mixins: [deriveEvents, modelCheckbox, modifier]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-checkbox';
var VOnsCheckbox = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-checkbox', _vm._g({ attrs: { "modifier": _vm.normalizedModifier } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-checkbox',
  mixins: [deriveEvents, modelCheckbox, modifier]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-input';
var VOnsInput = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-input', _vm._g({ attrs: { "modifier": _vm.normalizedModifier } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-input',
  mixins: [deriveEvents, modelInput, modifier]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-search-input';
var VOnsSearchInput = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-search-input', _vm._g({ attrs: { "modifier": _vm.normalizedModifier } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-search-input',
  mixins: [deriveEvents, modelInput, modifier]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-range';
var VOnsRange = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-range', _vm._g({ attrs: { "modifier": _vm.normalizedModifier } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-range',
  mixins: [deriveEvents, modelInput, modifier]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-radio';
var VOnsRadio = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-radio', _vm._g({ attrs: { "modifier": _vm.normalizedModifier } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-radio',
  mixins: [deriveEvents, modelRadio, modifier]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-fab';
var VOnsFab = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-fab', _vm._g({ attrs: { "modifier": _vm.normalizedModifier } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-fab',
  mixins: [deriveEvents, hidable, modifier]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-speed-dial-item';
var VOnsSpeedDialItem = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-speed-dial-item', _vm._g({ attrs: { "modifier": _vm.normalizedModifier } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-speed-dial-item',
  mixins: [deriveEvents, modifier]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-dialog';
var VOnsDialog = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-dialog', _vm._g({ attrs: { "modifier": _vm.normalizedModifier } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-dialog',
  mixins: [deriveEvents, hidable, hasOptions, dialogCancel, deriveDBB, portal, modifier]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-action-sheet';
var VOnsActionSheet = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-action-sheet', _vm._g({ attrs: { "modifier": _vm.normalizedModifier } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-action-sheet',
  mixins: [deriveEvents, hidable, hasOptions, dialogCancel, deriveDBB, portal, modifier]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-action-sheet-button';
var VOnsActionSheetButton = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-action-sheet-button', _vm._g({ attrs: { "modifier": _vm.normalizedModifier } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-action-sheet-button',
  mixins: [deriveEvents, modifier]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-modal';
var VOnsModal = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-modal', _vm._g({ attrs: { "modifier": _vm.normalizedModifier } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-modal',
  mixins: [deriveEvents, hidable, hasOptions, deriveDBB, portal, modifier]
};

/* This file was generated automatically by 'generate-components' task in bindings/vue/gulpfile.babel.js */
// 'ons-toast';
var VOnsToast = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-toast', _vm._g({ attrs: { "modifier": _vm.normalizedModifier } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-toast',
  mixins: [deriveEvents, hidable, hasOptions, deriveDBB, portal, modifier]
};

// 'ons-popover';
var VOnsPopover = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-popover', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-popover',
  mixins: [hidable, hasOptions, dialogCancel, deriveEvents, deriveDBB, portal],

  props: {
    target: {
      validator: function validator(value) {
        return value._isVue || typeof value === 'string' || value instanceof Event || value instanceof HTMLElement;
      }
    }
  },

  computed: {
    normalizedTarget: function normalizedTarget() {
      if (this.target && this.target._isVue) {
        return this.target.$el;
      }
      return this.target;
    },
    normalizedOptions: function normalizedOptions() {
      if (this.target) {
        return _extends({
          target: this.normalizedTarget
        }, this.options);
      }
      return this.options;
    }
  }
};

// 'ons-alert-dialog';
var VOnsAlertDialog = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-alert-dialog', _vm._g({ attrs: { "modifier": _vm.normalizedModifier } }, _vm.unrecognizedListeners), [_c('div', { staticClass: "alert-dialog-title" }, [_vm._t("title", [_vm._v(_vm._s(_vm.title))])], 2), _vm._v(" "), _c('div', { staticClass: "alert-dialog-content" }, [_vm._t("default")], 2), _vm._v(" "), _c('div', { staticClass: "alert-dialog-footer" }, [_vm._t("footer", _vm._l(_vm.footer, function (handler, key) {
      return _c('ons-alert-dialog-button', { key: key, on: { "click": handler } }, [_vm._v(_vm._s(key))]);
    }))], 2)]);
  }, staticRenderFns: [],
  name: 'v-ons-alert-dialog',
  mixins: [hidable, hasOptions, dialogCancel, deriveEvents, deriveDBB, portal, modifier],

  props: {
    title: {
      type: String
    },
    footer: {
      type: Object,
      validator: function validator(value) {
        return Object.keys(value).every(function (key) {
          return value[key] instanceof Function;
        });
      }
    }
  }
};

// 'ons-speed-dial';
var VOnsSpeedDial = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-speed-dial', { domProps: { "onClick": _vm.action } }, [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-speed-dial',
  mixins: [deriveEvents, hidable],

  props: {
    open: {
      type: Boolean,
      default: undefined
    }
  },

  methods: {
    action: function action() {
      var runDefault = true;
      this.$emit('click', { preventDefault: function preventDefault() {
          return runDefault = false;
        } });

      if (runDefault) {
        this.$el.toggleItems();
      }
    },
    _shouldUpdate: function _shouldUpdate() {
      return this.open !== undefined && this.open !== this.$el.isOpen();
    },
    _updateToggle: function _updateToggle() {
      this._shouldUpdate() && this.$el[this.open ? 'showItems' : 'hideItems'].call(this.$el);
    }
  },

  watch: {
    open: function open() {
      this._updateToggle();
    }
  },

  mounted: function mounted() {
    var _this = this;

    this.$on(['open', 'close'], function () {
      return _this._shouldUpdate() && _this.$emit('update:open', _this.$el.isOpen());
    });

    this._updateToggle();
  }
};

// 'ons-carousel';
var VOnsCarousel = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-carousel', _vm._g({ attrs: { "initial-index": _vm.index }, domProps: { "onSwipe": _vm.onSwipe }, on: { "postchange": function postchange($event) {
          if ($event.target !== $event.currentTarget) {
            return null;
          }_vm.$emit('update:index', $event.activeIndex);
        } } }, _vm.unrecognizedListeners), [_c('div', [_vm._t("default")], 2), _vm._v(" "), _c('div')]);
  }, staticRenderFns: [],
  name: 'v-ons-carousel',
  mixins: [hasOptions, deriveEvents],

  props: {
    index: {
      type: Number
    },
    onSwipe: {
      type: Function
    }
  },

  watch: {
    index: function index() {
      if (this.index !== this.$el.getActiveIndex()) {
        this.$el.setActiveIndex(this.index, this.options);
      }
    }
  }
};

// 'ons-tab';

var VOnsTab = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-tab', { attrs: { "active": _vm.active }, domProps: { "onClick": _vm.action } });
  }, staticRenderFns: [],
  name: 'v-ons-tab',
  inject: ['tabbar'],

  props: {
    page: {},
    props: {},
    active: {
      type: Boolean
    }
  },

  methods: {
    action: function action() {
      var runDefault = true;
      this.$emit('click', { preventDefault: function preventDefault() {
          return runDefault = false;
        } });

      if (runDefault) {
        this.tabbar.$el.setActiveTab(this.$el.index, _extends({ reject: false }, this.tabbar.options));
      }
    }
  },

  watch: {
    active: function active() {
      this.$el.setActive(this.active);
    }
  }
};

// 'ons-tabbar';
var VOnsTabbar = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-tabbar', _vm._g({ attrs: { "activeIndex": _vm.index, "modifier": _vm.normalizedModifier }, domProps: { "onSwipe": _vm.onSwipe }, on: { "prechange": function prechange($event) {
          if ($event.target !== $event.currentTarget) {
            return null;
          }_vm.$nextTick(function () {
            return !$event.detail.canceled && _vm.$emit('update:index', $event.index);
          });
        } } }, _vm.unrecognizedListeners), [_c('div', { staticClass: "tabbar__content" }, [_c('div', [_vm._t("pages", _vm._l(_vm.tabs, function (tab) {
      return _c(tab.page, _vm._g(_vm._b({ key: tab.page.key || tab.page.name || _vm._tabKey(tab), tag: "component" }, 'component', tab.props, false), _vm.unrecognizedListeners));
    }))], 2), _vm._v(" "), _c('div')]), _vm._v(" "), _c('div', { staticClass: "tabbar", style: _vm.tabbarStyle }, [_vm._t("default", _vm._l(_vm.tabs, function (tab) {
      return _c('v-ons-tab', _vm._b({ key: _vm._tabKey(tab) }, 'v-ons-tab', tab, false));
    })), _vm._v(" "), _c('div', { staticClass: "tabbar__border" })], 2)]);
  }, staticRenderFns: [],
  name: 'v-ons-tabbar',
  mixins: [deriveEvents, hasOptions, hidable, selfProvider, modifier],

  props: {
    index: {
      type: Number
    },
    tabs: {
      type: Array,
      validator: function validator(value) {
        return value.every(function (tab) {
          return ['icon', 'label', 'page'].some(function (prop) {
            return !!Object.getOwnPropertyDescriptor(tab, prop);
          });
        });
      }
    },
    onSwipe: {
      type: Function
    },
    tabbarStyle: {
      type: null
    }
  },

  methods: {
    _tabKey: function _tabKey(tab) {
      return tab.key || tab.label || tab.icon;
    }
  },

  watch: {
    index: function index() {
      if (this.index !== this.$el.getActiveTabIndex()) {
        this.$el.setActiveTab(this.index, _extends({ reject: false }, this.options));
      }
    }
  }
};

// 'ons-back-button';
var VOnsBackButton = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-back-button', { domProps: { "onClick": _vm.action } }, [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-back-button',
  inject: ['navigator'],
  mixins: [modifier],

  methods: {
    action: function action() {
      var runDefault = true;
      this.$emit('click', { preventDefault: function preventDefault() {
          return runDefault = false;
        } });

      if (runDefault && this.navigator.pageStack.length > 1) {
        this.navigator.popPage();
      }
    }
  }
};

// 'ons-navigator';
var VOnsNavigator = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-navigator', _vm._g({ domProps: { "options": _vm.options }, on: { "postpop": function postpop($event) {
          if ($event.target !== $event.currentTarget) {
            return null;
          }_vm._checkSwipe($event);
        } } }, _vm.unrecognizedListeners), [_vm._t("default", _vm._l(_vm.pageStack, function (page) {
      return _c(page, _vm._g(_vm._b({ key: page.key || page.name, tag: "component" }, 'component', page.onsNavigatorProps, false), _vm.unrecognizedListeners));
    }))], 2);
  }, staticRenderFns: [],
  name: 'v-ons-navigator',
  mixins: [hasOptions, selfProvider, deriveEvents, deriveDBB],

  props: {
    pageStack: {
      type: Array,
      required: true
    },
    popPage: {
      type: Function,
      default: function _default() {
        this.pageStack.pop();
      }
    }
  },

  methods: {
    isReady: function isReady() {
      if (this.hasOwnProperty('_ready') && this._ready instanceof Promise) {
        return this._ready;
      }
      return Promise.resolve();
    },
    onDeviceBackButton: function onDeviceBackButton(event) {
      if (this.pageStack.length > 1) {
        this.popPage();
      } else {
        event.callParentHandler();
      }
    },
    _findScrollPage: function _findScrollPage(page) {
      var nextPage = page._contentElement.children.length === 1 && this.$ons._ons._util.getTopPage(page._contentElement.children[0]);
      return nextPage ? this._findScrollPage(nextPage) : page;
    },
    _eachPage: function _eachPage(start, end, cb) {
      for (var i = start; i < end; i++) {
        cb(this.$children[i].$el);
      }
    },
    _reattachPage: function _reattachPage(pageElement) {
      var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var restoreScroll = arguments[2];

      this.$el.insertBefore(pageElement, position);
      restoreScroll instanceof Function && restoreScroll();
      pageElement._isShown = true;
    },
    _redetachPage: function _redetachPage(pageElement) {
      pageElement._destroy();
      return Promise.resolve();
    },
    _animate: function _animate(_ref) {
      var _this = this;

      var lastLength = _ref.lastLength,
          currentLength = _ref.currentLength,
          lastTopPage = _ref.lastTopPage,
          currentTopPage = _ref.currentTopPage,
          restoreScroll = _ref.restoreScroll;

      var pushedOptions = this.pageStack[this.pageStack.length - 1].onsNavigatorOptions || currentTopPage.__vue__.onsNavigatorOptions || {};

      // Push
      if (currentLength > lastLength) {
        var isReattached = false;
        if (lastTopPage.parentElement !== this.$el) {
          this._reattachPage(lastTopPage, this.$el.children[lastLength - 1], restoreScroll);
          isReattached = true;
          lastLength--;
        }

        this._eachPage(lastLength, currentLength, function (el) {
          el.style.visibility = 'hidden';
        });
        this._eachPage(lastLength, currentLength - 1, function (el) {
          el.pushedOptions = pushedOptions;
        });

        return this.$el._pushPage(_extends({}, pushedOptions, { leavePage: lastTopPage })).then(function () {
          setImmediate(function () {
            _this._eachPage(lastLength, currentLength, function (el) {
              el.style.visibility = '';
            });
            _this._eachPage(lastLength - 1, currentLength - 1, function (el) {
              el.style.display = 'none';
            });
          });

          if (isReattached) {
            _this._redetachPage(lastTopPage);
          }
        });
      }

      // Pop
      if (currentLength < lastLength) {
        this._reattachPage(lastTopPage, null, restoreScroll);
        return this.$el._popPage({}, function () {
          return _this._redetachPage(lastTopPage);
        });
      }

      // Replace page
      currentTopPage.style.visibility = 'hidden';
      this._reattachPage(lastTopPage, currentTopPage, restoreScroll);
      return this.$el._pushPage(_extends({}, pushedOptions, { _replacePage: true })).then(function () {
        return _this._redetachPage(lastTopPage);
      });
    },
    _checkSwipe: function _checkSwipe(event) {
      if (this.$el.hasAttribute('swipeable') && event.leavePage !== this.$el.lastChild && event.leavePage === this.$children[this.$children.length - 1].$el) {
        this.popPage();
      }
    }
  },

  watch: {
    pageStack: function pageStack(after, before) {
      if (this.$el.hasAttribute('swipeable') && this.$children.length !== this.$el.children.length) {
        return;
      }

      var propWasMutated = after === before; // Can be mutated or replaced
      var lastTopPage = this.$children[this.$children.length - 1].$el;
      var scrollElement = this._findScrollPage(lastTopPage);
      var scrollValue = scrollElement.scrollTop || 0;

      this._pageStackUpdate = {
        lastTopPage: lastTopPage,
        lastLength: propWasMutated ? this.$children.length : before.length,
        currentLength: !propWasMutated && after.length,
        restoreScroll: function restoreScroll() {
          return scrollElement.scrollTop = scrollValue;
        }
      };

      // this.$nextTick(() => { }); // Waits too long, updated() hook is faster and prevents flickerings
    }
  },

  updated: function updated() {
    if (this._pageStackUpdate) {
      var currentTopPage = this.$children[this.$children.length - 1].$el;
      var _pageStackUpdate = this._pageStackUpdate,
          lastTopPage = _pageStackUpdate.lastTopPage,
          currentLength = _pageStackUpdate.currentLength;
      var _pageStackUpdate2 = this._pageStackUpdate,
          lastLength = _pageStackUpdate2.lastLength,
          restoreScroll = _pageStackUpdate2.restoreScroll;

      currentLength = currentLength === false ? this.$children.length : currentLength;

      if (currentTopPage !== lastTopPage) {
        this._ready = this._animate({ lastLength: lastLength, currentLength: currentLength, lastTopPage: lastTopPage, currentTopPage: currentTopPage, restoreScroll: restoreScroll });
      } else if (currentLength !== lastLength) {
        currentTopPage.updateBackButton(currentLength > 1);
      }

      lastTopPage = currentTopPage = this._pageStackUpdate = null;
    }
  }
};

// 'ons-splitter-side';
var VOnsSplitterSide = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-splitter-side', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-splitter-side',
  mixins: [hasOptions, deriveEvents],

  props: {
    open: {
      type: Boolean,
      default: undefined
    }
  },

  methods: {
    action: function action() {
      this._shouldUpdate() && this.$el[this.open ? 'open' : 'close'].call(this.$el, this.options).catch(function () {});
    },
    _shouldUpdate: function _shouldUpdate() {
      return this.open !== undefined && this.open !== this.$el.isOpen;
    }
  },

  watch: {
    open: function open() {
      this.action();
    }
  },

  mounted: function mounted() {
    var _this = this;

    this.$on(['postopen', 'postclose', 'modechange'], function () {
      return _this._shouldUpdate() && _this.$emit('update:open', _this.$el.isOpen);
    });

    this.action();
  }
};

// 'ons-lazy-repeat';

var VOnsLazyRepeat = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-lazy-repeat');
  }, staticRenderFns: [],
  name: 'v-ons-lazy-repeat',

  props: {
    renderItem: {
      type: Function,
      required: true,
      validator: function validator(value) {
        var component = value(0);
        if (component._isVue && !component._isMounted) {
          component.$destroy();
          return true;
        }
        return false;
      }
    },
    length: {
      type: Number,
      required: true
    },
    calculateItemHeight: {
      type: Function,
      default: undefined
    }
  },

  data: function data() {
    return {
      provider: null
    };
  },


  methods: {
    _setup: function _setup() {
      var _this = this;

      this.provider && this.provider.destroy();

      var delegate = new this.$ons._ons._internal.LazyRepeatDelegate({
        calculateItemHeight: this.calculateItemHeight,
        createItemContent: function createItemContent(i) {
          return _this.renderItem(i).$mount().$el;
        },
        destroyItem: function destroyItem(i, _ref) {
          var element = _ref.element;
          return element.__vue__.$destroy();
        },
        countItems: function countItems() {
          return _this.length;
        }
      }, null);

      this.provider = new this.$ons._ons._internal.LazyRepeatProvider(this.$parent.$el, delegate);
    },
    refresh: function refresh() {
      return this.provider.refresh();
    }
  },

  watch: {
    renderItem: function renderItem() {
      this._setup();
    },
    length: function length() {
      this._setup();
    },
    calculateItemHeight: function calculateItemHeight() {
      this._setup();
    }
  },

  mounted: function mounted() {
    this._setup();
    this.$vnode.context.$on('refresh', this.refresh);
  },
  beforeDestroy: function beforeDestroy() {
    this.$vnode.context.$off('refresh', this.refresh);

    // This will destroy the provider once the rendered element
    // is detached (detachedCallback). Therefore, animations
    // have time to finish before elements start to disappear.
    // It cannot be set earlier in order to prevent accidental
    // destroys if this element is retached by something else.
    this.$el._lazyRepeatProvider = this.provider;
    this.provider = null;
  }
};

// 'ons-select';
var VOnsSelect = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-select', _vm._g({ attrs: { "modifier": _vm.normalizedModifier } }, _vm.$listeners), [_c('select', { directives: [{ name: "model", rawName: "v-model", value: _vm.selectedValue, expression: "selectedValue" }], on: { "change": function change($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
            return o.selected;
          }).map(function (o) {
            var val = "_value" in o ? o._value : o.value;return val;
          });_vm.selectedValue = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
        } } }, [_vm._t("default")], 2)]);
  }, staticRenderFns: [],
  name: 'v-ons-select',
  mixins: [modifier],
  model: {
    prop: 'modelProp',
    event: 'modelEvent'
  },
  props: {
    modelProp: [Number, String],
    modelEvent: {
      type: String,
      default: 'input'
    }
  },
  computed: {
    selectedValue: {
      get: function get() {
        return this.modelProp;
      },
      set: function set(val) {
        this.$emit('modelEvent', val);
      }
    }
  }
};

// 'ons-segment';
var VOnsSegment = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-segment', { attrs: { "active-index": _vm.index }, on: { "postchange": function postchange($event) {
          if ($event.target !== $event.currentTarget) {
            return null;
          }_vm.$emit('update:index', $event.index);
        } } }, [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-segment',
  mixins: [deriveEvents],

  props: {
    index: {
      type: Number
    }
  },

  watch: {
    index: function index() {
      if (this.index !== this.$el.getActiveButtonIndex()) {
        this.$el.setActiveButton(this.index, { reject: false });
      }
    }
  }
};

// 'ons-pull-hook';
var VOnsPullHook = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-pull-hook', _vm._g({ domProps: { "onAction": _vm.action, "onPull": _vm.onPull } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-pull-hook',
  mixins: [deriveEvents],

  props: {
    action: {
      type: Function
    },
    onPull: {
      type: Function
    }
  }
};

// 'ons-page';
var VOnsPage = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-page', _vm._g({ attrs: { "modifier": _vm.normalizedModifier }, domProps: { "onInfiniteScroll": _vm.infiniteScroll } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-page',
  mixins: [deriveEvents, deriveDBB, modifier],

  props: {
    infiniteScroll: {
      type: Function
    }
  }
};

// Generic components:


var components = Object.freeze({
	VOnsToolbar: VOnsToolbar,
	VOnsBottomToolbar: VOnsBottomToolbar,
	VOnsToolbarButton: VOnsToolbarButton,
	VOnsAlertDialogButton: VOnsAlertDialogButton,
	VOnsButton: VOnsButton,
	VOnsIcon: VOnsIcon,
	VOnsCard: VOnsCard,
	VOnsList: VOnsList,
	VOnsListItem: VOnsListItem,
	VOnsListTitle: VOnsListTitle,
	VOnsListHeader: VOnsListHeader,
	VOnsRipple: VOnsRipple,
	VOnsRow: VOnsRow,
	VOnsCol: VOnsCol,
	VOnsProgressBar: VOnsProgressBar,
	VOnsProgressCircular: VOnsProgressCircular,
	VOnsCarouselItem: VOnsCarouselItem,
	VOnsSplitterMask: VOnsSplitterMask,
	VOnsSplitterContent: VOnsSplitterContent,
	VOnsSplitter: VOnsSplitter,
	VOnsSwitch: VOnsSwitch,
	VOnsCheckbox: VOnsCheckbox,
	VOnsInput: VOnsInput,
	VOnsSearchInput: VOnsSearchInput,
	VOnsRange: VOnsRange,
	VOnsRadio: VOnsRadio,
	VOnsFab: VOnsFab,
	VOnsSpeedDialItem: VOnsSpeedDialItem,
	VOnsDialog: VOnsDialog,
	VOnsActionSheet: VOnsActionSheet,
	VOnsActionSheetButton: VOnsActionSheetButton,
	VOnsModal: VOnsModal,
	VOnsToast: VOnsToast,
	VOnsPopover: VOnsPopover,
	VOnsAlertDialog: VOnsAlertDialog,
	VOnsSpeedDial: VOnsSpeedDial,
	VOnsCarousel: VOnsCarousel,
	VOnsTab: VOnsTab,
	VOnsTabbar: VOnsTabbar,
	VOnsBackButton: VOnsBackButton,
	VOnsNavigator: VOnsNavigator,
	VOnsSplitterSide: VOnsSplitterSide,
	VOnsLazyRepeat: VOnsLazyRepeat,
	VOnsSelect: VOnsSelect,
	VOnsSegment: VOnsSegment,
	VOnsPullHook: VOnsPullHook,
	VOnsPage: VOnsPage
});

var $ons = setup(ons);

$ons.install = function (Vue) {
  Object.keys(components).forEach(function (key) {
    return Vue.component(components[key].name, components[key]);
  });

  /**
   * Expose ons object.
   */
  Vue.prototype.$ons = $ons;
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use({ install: $ons.install });
}

return $ons;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLW9uc2VudWkuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXR1cC5qcyIsIi4uL3NyYy9pbnRlcm5hbC91dGlsLmpzIiwiLi4vc3JjL21peGlucy9kZXJpdmUuanMiLCIuLi9zcmMvbWl4aW5zL2NvbW1vbi5qcyIsIi4uL3NyYy9taXhpbnMvbW9kZWwuanMiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zVG9vbGJhci52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zQm90dG9tVG9vbGJhci52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zVG9vbGJhckJ1dHRvbi52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zQWxlcnREaWFsb2dCdXR0b24udnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc0J1dHRvbi52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zSWNvbi52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zQ2FyZC52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zTGlzdC52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zTGlzdEl0ZW0udnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc0xpc3RUaXRsZS52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zTGlzdEhlYWRlci52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zUmlwcGxlLnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNSb3cudnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc0NvbC52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zUHJvZ3Jlc3NCYXIudnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc1Byb2dyZXNzQ2lyY3VsYXIudnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc0Nhcm91c2VsSXRlbS52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zU3BsaXR0ZXJNYXNrLnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNTcGxpdHRlckNvbnRlbnQudnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc1NwbGl0dGVyLnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNTd2l0Y2gudnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc0NoZWNrYm94LnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNJbnB1dC52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zU2VhcmNoSW5wdXQudnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc1JhbmdlLnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNSYWRpby52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zRmFiLnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNTcGVlZERpYWxJdGVtLnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNEaWFsb2cudnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc0FjdGlvblNoZWV0LnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNBY3Rpb25TaGVldEJ1dHRvbi52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zTW9kYWwudnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc1RvYXN0LnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNQb3BvdmVyLnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNBbGVydERpYWxvZy52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zU3BlZWREaWFsLnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNDYXJvdXNlbC52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zVGFiLnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNUYWJiYXIudnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc0JhY2tCdXR0b24udnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc05hdmlnYXRvci52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zU3BsaXR0ZXJTaWRlLnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNMYXp5UmVwZWF0LnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNTZWxlY3QudnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc1NlZ21lbnQudnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc1B1bGxIb29rLnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNQYWdlLnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL2luZGV4LmpzIiwiLi4vc3JjL2luZGV4LnVtZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvbnMpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9ucylcbiAgICAuZmlsdGVyKGsgPT4gW1xuICAgICAgL15pcy8sXG4gICAgICAvXmRpc2FibGUvLFxuICAgICAgL15lbmFibGUvLFxuICAgICAgL15tb2NrLyxcbiAgICAgIC9eb3Blbi8sXG4gICAgICAvXnNldC8sXG4gICAgICAvYW5pbWl0LyxcbiAgICAgIC9lbGVtZW50cy8sXG4gICAgICAvZmFzdENsaWNrLyxcbiAgICAgIC9HZXN0dXJlRGV0ZWN0b3IvLFxuICAgICAgL25vdGlmaWNhdGlvbi8sXG4gICAgICAvb3JpZW50YXRpb24vLFxuICAgICAgL3BsYXRmb3JtLyxcbiAgICAgIC9yZWFkeS8sXG4gICAgXS5zb21lKHQgPT4gay5tYXRjaCh0KSkpXG4gICAgLnJlZHVjZSgociwgaykgPT4ge1xuICAgICAgcltrXSA9IG9uc1trXTtcbiAgICAgIHJldHVybiByO1xuICAgIH0sIHsgX29uczogb25zIH0pO1xufVxuIiwiZXhwb3J0IGNvbnN0IGh5cGhlbmF0ZSA9IHN0cmluZyA9PiBzdHJpbmcucmVwbGFjZSgvKFthLXpBLVpdKShbQS1aXSkvZywgJyQxLSQyJykudG9Mb3dlckNhc2UoKTtcblxuZXhwb3J0IGNvbnN0IGNhcGl0YWxpemUgPSBzdHJpbmcgPT4gc3RyaW5nLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyaW5nLnNsaWNlKDEpO1xuXG5leHBvcnQgY29uc3QgY2FtZWxpemUgPSBzdHJpbmcgPT4gc3RyaW5nLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvLShbYS16XSkvZywgKG0sIGwpID0+IGwudG9VcHBlckNhc2UoKSk7XG5cbmV4cG9ydCBjb25zdCBldmVudFRvSGFuZGxlciA9IG5hbWUgPT4gJ19vbicgKyBjYXBpdGFsaXplKG5hbWUpO1xuXG5leHBvcnQgY29uc3QgaGFuZGxlclRvUHJvcCA9IG5hbWUgPT4gbmFtZS5zbGljZSgyKS5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIG5hbWUuc2xpY2UoMikuc2xpY2UoMSk7XG4iLCJpbXBvcnQgeyBjYW1lbGl6ZSwgZXZlbnRUb0hhbmRsZXIsIGhhbmRsZXJUb1Byb3AgfSBmcm9tICcuLi9pbnRlcm5hbC91dGlsJztcblxuLyogUHJpdmF0ZSAqL1xuY29uc3QgX3NldHVwREJCID0gY29tcG9uZW50ID0+IHtcbiAgY29uc3QgZGJiID0gJ29uRGV2aWNlQmFja0J1dHRvbic7XG4gIC8vIENhbGwgb3JpZ2luYWwgaGFuZGxlciBvciBwYXJlbnQgaGFuZGxlciBieSBkZWZhdWx0XG4gIGNvbnN0IGhhbmRsZXIgPSBjb21wb25lbnRbZGJiXSB8fCAoY29tcG9uZW50LiRlbFtkYmJdICYmIGNvbXBvbmVudC4kZWxbZGJiXS5fY2FsbGJhY2spIHx8IChlID0+IGUuY2FsbFBhcmVudEhhbmRsZXIoKSk7XG5cbiAgY29tcG9uZW50LiRlbFtkYmJdID0gZXZlbnQgPT4ge1xuICAgIGxldCBydW5EZWZhdWx0ID0gdHJ1ZTtcblxuICAgIGNvbXBvbmVudC4kZW1pdChoYW5kbGVyVG9Qcm9wKGRiYiksIHtcbiAgICAgIC4uLmV2ZW50LFxuICAgICAgcHJldmVudERlZmF1bHQ6ICgpID0+IHJ1bkRlZmF1bHQgPSBmYWxzZVxuICAgIH0pO1xuXG4gICAgcnVuRGVmYXVsdCAmJiBoYW5kbGVyKGV2ZW50KTtcbiAgfTtcblxuICBjb21wb25lbnQuX2lzREJCU2V0dXAgPSB0cnVlO1xufTtcblxuLyogUHVibGljICovXG4vLyBEZXZpY2UgQmFjayBCdXR0b24gSGFuZGxlclxuY29uc3QgZGVyaXZlREJCID0ge1xuICBtb3VudGVkKCkge1xuICAgIF9zZXR1cERCQih0aGlzKTtcbiAgfSxcblxuICAvLyBDb3JlIGRlc3Ryb3lzIGRldmljZUJhY2tCdXR0b24gaGFuZGxlcnMgb24gZGlzY29ubmVjdGVkQ2FsbGJhY2suXG4gIC8vIFRoaXMgZml4ZXMgdGhlIGJlaGF2aW9yIGZvciA8a2VlcC1hbGl2ZT4gY29tcG9uZW50LlxuICBhY3RpdmF0ZWQoKSB7XG4gICAgdGhpcy5faXNEQkJTZXR1cCA9PT0gZmFsc2UgJiYgX3NldHVwREJCKHRoaXMpO1xuICB9LFxuXG4gIGRlYWN0aXZhdGVkKCkge1xuICAgIHRoaXMuX2lzREJCU2V0dXAgPT09IHRydWUgJiYgKHRoaXMuX2lzREJCU2V0dXAgPSBmYWxzZSk7XG4gIH0sXG5cbiAgZGVzdHJveWVkKCkge1xuICAgIHRoaXMuJGVsLm9uRGV2aWNlQmFja0J1dHRvbiAmJiB0aGlzLiRlbC5vbkRldmljZUJhY2tCdXR0b24uZGVzdHJveSgpO1xuICB9XG59O1xuXG5jb25zdCBkZXJpdmVFdmVudHMgPSB7XG4gIGNvbXB1dGVkOiB7XG4gICAgdW5yZWNvZ25pemVkTGlzdGVuZXJzKCkge1xuICAgICAgY29uc3QgbmFtZSA9IGNhbWVsaXplKCctJyArIHRoaXMuJG9wdGlvbnMuX2NvbXBvbmVudFRhZy5zbGljZSg2KSk7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy4kbGlzdGVuZXJzIHx8IHt9KVxuICAgICAgICAuZmlsdGVyKGsgPT4gKHRoaXMuJG9ucy5lbGVtZW50c1tuYW1lXS5ldmVudHMgfHwgW10pLmluZGV4T2YoaykgPT09IC0xKVxuICAgICAgICAucmVkdWNlKChyLCBrKSA9PiB7XG4gICAgICAgICAgcltrXSA9IHRoaXMuJGxpc3RlbmVyc1trXTtcbiAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgfSwge30pO1xuICAgIH1cbiAgfSxcblxuICBtb3VudGVkKCkge1xuICAgIHRoaXMuX2hhbmRsZXJzID0ge307XG5cbiAgICAodGhpcy4kZWwuY29uc3RydWN0b3IuZXZlbnRzIHx8IFtdKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICB0aGlzLl9oYW5kbGVyc1tldmVudFRvSGFuZGxlcihrZXkpXSA9IGV2ZW50ID0+IHtcbiAgICAgICAgLy8gRmlsdGVyIGV2ZW50cyBmcm9tIGRpZmZlcmVudCBjb21wb25lbnRzIHdpdGggdGhlIHNhbWUgbmFtZVxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSB0aGlzLiRlbCB8fCAhL15vbnMtL2kudGVzdChldmVudC50YXJnZXQudGFnTmFtZSkpIHtcbiAgICAgICAgICB0aGlzLiRlbWl0KGtleSwgZXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgdGhpcy4kZWwuYWRkRXZlbnRMaXN0ZW5lcihrZXksIHRoaXMuX2hhbmRsZXJzW2V2ZW50VG9IYW5kbGVyKGtleSldKTtcbiAgICB9KTtcbiAgfSxcblxuICBiZWZvcmVEZXN0cm95KCkge1xuICAgIE9iamVjdC5rZXlzKHRoaXMuX2hhbmRsZXJzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICB0aGlzLiRlbC5yZW1vdmVFdmVudExpc3RlbmVyKGtleSwgdGhpcy5faGFuZGxlcnNba2V5XSk7XG4gICAgfSk7XG4gICAgdGhpcy5faGFuZGxlcnMgPSBudWxsO1xuICB9XG59O1xuXG5leHBvcnQgeyBkZXJpdmVEQkIsIGRlcml2ZUV2ZW50cyB9O1xuIiwiLyogUHJpdmF0ZSAqL1xuY29uc3QgX3RvZ2dsZVZpc2liaWxpdHkgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHR5cGVvZiB0aGlzLnZpc2libGUgPT09ICdib29sZWFuJyAmJiB0aGlzLnZpc2libGUgIT09IHRoaXMuJGVsLnZpc2libGUpIHtcbiAgICB0aGlzLiRlbFt0aGlzLnZpc2libGUgPyAnc2hvdycgOiAnaGlkZSddLmNhbGwodGhpcy4kZWwsIHRoaXMubm9ybWFsaXplZE9wdGlvbnMgfHwgdGhpcy5vcHRpb25zKTtcbiAgfVxufTtcbmNvbnN0IF90ZWxlcG9ydCA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMuX2lzRGVzdHJveWVkICYmICghdGhpcy4kZWwucGFyZW50Tm9kZSB8fCB0aGlzLiRlbC5wYXJlbnROb2RlICE9PSBkb2N1bWVudC5ib2R5KSkge1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy4kZWwpO1xuICB9XG59O1xuY29uc3QgX3VubW91bnQgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuJGVsLnZpc2libGUgPT09IHRydWUpIHtcbiAgICB0aGlzLiRlbC5oaWRlKCkudGhlbigoKSA9PiB0aGlzLiRlbC5yZW1vdmUoKSk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy4kZWwucmVtb3ZlKCk7XG4gIH1cbn07XG5cbi8qIFB1YmxpYyAqL1xuLy8gQ29tcG9uZW50cyB0aGF0IGNhbiBiZSBzaG93biBvciBoaWRkZW5cbmNvbnN0IGhpZGFibGUgPSB7XG4gIHByb3BzOiB7XG4gICAgdmlzaWJsZToge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCAvLyBBdm9pZCBjYXN0aW5nIHRvIGZhbHNlXG4gICAgfVxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgdmlzaWJsZSgpIHtcbiAgICAgIF90b2dnbGVWaXNpYmlsaXR5LmNhbGwodGhpcyk7XG4gICAgfVxuICB9LFxuXG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy4kbmV4dFRpY2soKCkgPT4gX3RvZ2dsZVZpc2liaWxpdHkuY2FsbCh0aGlzKSk7XG4gIH0sXG5cbiAgYWN0aXZhdGVkKCkge1xuICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IF90b2dnbGVWaXNpYmlsaXR5LmNhbGwodGhpcykpO1xuICB9XG59O1xuXG4vLyBDb21wb25lbnRzIHdpdGggJ29wdGlvbnMnIHByb3BlcnR5XG5jb25zdCBoYXNPcHRpb25zID0ge1xuICBwcm9wczoge1xuICAgIG9wdGlvbnM6IHtcbiAgICAgIHR5cGU6IE9iamVjdCxcbiAgICAgIGRlZmF1bHQoKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbi8vIFByb3ZpZGVzIGl0c2VsZiB0byBpdHMgZGVzY2VuZGFudHNcbmNvbnN0IHNlbGZQcm92aWRlciA9IHtcbiAgcHJvdmlkZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgW3RoaXMuJG9wdGlvbnMuX2NvbXBvbmVudFRhZy5zbGljZSg2KV06IHRoaXNcbiAgICB9XG4gIH1cbn07XG5cbi8vIENvbW1vbiBldmVudCBmb3IgRGlhbG9nc1xuY29uc3QgZGlhbG9nQ2FuY2VsID0ge1xuICBtb3VudGVkKCkge1xuICAgIHRoaXMuJG9uKCdkaWFsb2ctY2FuY2VsJywgKCkgPT4gdGhpcy4kZW1pdCgndXBkYXRlOnZpc2libGUnLCBmYWxzZSkpO1xuICB9XG59O1xuXG4vLyBNb3ZlcyB0aGUgZWxlbWVudCB0byBhIGdsb2JhbCBwb3NpdGlvblxuY29uc3QgcG9ydGFsID0ge1xuICBtb3VudGVkKCkge1xuICAgIF90ZWxlcG9ydC5jYWxsKHRoaXMpO1xuICB9LFxuICB1cGRhdGVkKCkge1xuICAgIF90ZWxlcG9ydC5jYWxsKHRoaXMpO1xuICB9LFxuICBhY3RpdmF0ZWQoKSB7XG4gICAgX3RlbGVwb3J0LmNhbGwodGhpcyk7XG4gIH0sXG4gIGRlYWN0aXZhdGVkKCkge1xuICAgIF91bm1vdW50LmNhbGwodGhpcyk7XG4gIH0sXG4gIGJlZm9yZURlc3Ryb3koKSB7XG4gICAgX3VubW91bnQuY2FsbCh0aGlzKTtcbiAgfVxufTtcblxuY29uc3QgbW9kaWZpZXIgPSB7XG4gIHByb3BzOiB7XG4gICAgbW9kaWZpZXI6IHtcbiAgICAgIHR5cGU6IFtTdHJpbmcsIEFycmF5LCBPYmplY3RdXG4gICAgfSxcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIG5vcm1hbGl6ZWRNb2RpZmllcigpIHtcbiAgICAgIGNvbnN0IG1vZGlmaWVyID0gdGhpcy5tb2RpZmllcjtcblxuICAgICAgaWYgKHR5cGVvZiBtb2RpZmllciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICByZXR1cm4gbW9kaWZpZXI7XG4gICAgICB9XG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KG1vZGlmaWVyKSkge1xuICAgICAgICByZXR1cm4gbW9kaWZpZXIuam9pbignICcpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIG1vZGlmaWVyID09PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMobW9kaWZpZXIpXG4gICAgICAgICAgLnJlZHVjZSgoYWNjLCBrZXkpID0+IChhY2MgKyAobW9kaWZpZXJba2V5XSA/IGAgJHtrZXl9YCA6ICcnKSksICcnKVxuICAgICAgICAgIC50cmltKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCB7IGhpZGFibGUsIGhhc09wdGlvbnMsIHNlbGZQcm92aWRlciwgZGlhbG9nQ2FuY2VsLCBwb3J0YWwsIG1vZGlmaWVyIH07XG4iLCIvKiBQcml2YXRlICovXG5jb25zdCBtb2RlbCA9IHtcbiAgcHJvcDogJ21vZGVsUHJvcCcsXG4gIGV2ZW50OiAnbW9kZWxFdmVudCdcbn07XG5cbi8qIFB1YmxpYyAqL1xuXG4vLyBHZW5lcmljIGlucHV0XG5jb25zdCBtb2RlbElucHV0ID0ge1xuICBtb2RlbCxcbiAgcHJvcHM6IHtcbiAgICBbbW9kZWwucHJvcF06IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgW21vZGVsLmV2ZW50XToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ2lucHV0J1xuICAgIH1cbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgX3VwZGF0ZVZhbHVlKCkge1xuICAgICAgaWYgKHRoaXNbbW9kZWwucHJvcF0gIT09IHVuZGVmaW5lZCAmJiB0aGlzLiRlbC52YWx1ZSAhPT0gdGhpc1ttb2RlbC5wcm9wXSkge1xuICAgICAgICB0aGlzLiRlbC52YWx1ZSA9IHRoaXNbbW9kZWwucHJvcF07XG4gICAgICB9XG4gICAgfSxcbiAgICBfb25Nb2RlbEV2ZW50KGV2ZW50KSB7XG4gICAgICB0aGlzLiRlbWl0KG1vZGVsLmV2ZW50LCBldmVudC50YXJnZXQudmFsdWUpO1xuICAgIH1cbiAgfSxcblxuICB3YXRjaDoge1xuICAgIFttb2RlbC5wcm9wXSgpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVZhbHVlKCk7XG4gICAgfVxuICB9LFxuXG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5fdXBkYXRlVmFsdWUoKTtcbiAgICB0aGlzLiRlbC5hZGRFdmVudExpc3RlbmVyKHRoaXNbbW9kZWwuZXZlbnRdLCB0aGlzLl9vbk1vZGVsRXZlbnQpO1xuICB9LFxuICBiZWZvcmVEZXN0cm95KCkge1xuICAgIHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpc1ttb2RlbC5ldmVudF0sIHRoaXMuX29uTW9kZWxFdmVudCk7XG4gIH1cbn07XG5cbi8vIENoZWNrYWJsZSBpbnB1dHNcbmNvbnN0IG1vZGVsQ2hlY2tib3ggPSB7XG4gIG1peGluczogW21vZGVsSW5wdXRdLFxuXG4gIHByb3BzOiB7XG4gICAgW21vZGVsLnByb3BdOiBbQXJyYXksIEJvb2xlYW5dLFxuICAgIFttb2RlbC5ldmVudF06IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdjaGFuZ2UnXG4gICAgfVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBfdXBkYXRlVmFsdWUoKSB7XG4gICAgICBpZiAodGhpc1ttb2RlbC5wcm9wXSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHRoaXMuJGVsLmNoZWNrZWQgPSB0aGlzW21vZGVsLnByb3BdLmluZGV4T2YodGhpcy4kZWwudmFsdWUpID49IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLiRlbC5jaGVja2VkID0gdGhpc1ttb2RlbC5wcm9wXTtcbiAgICAgIH1cbiAgICB9LFxuICAgIF9vbk1vZGVsRXZlbnQoZXZlbnQpIHtcbiAgICAgIGNvbnN0IHsgdmFsdWUsIGNoZWNrZWQgfSA9IGV2ZW50LnRhcmdldDtcbiAgICAgIGxldCBuZXdWYWx1ZTtcblxuICAgICAgaWYgKHRoaXNbbW9kZWwucHJvcF0gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAvLyBJcyBBcnJheVxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXNbbW9kZWwucHJvcF0uaW5kZXhPZih2YWx1ZSk7XG4gICAgICAgIGNvbnN0IGluY2x1ZGVkID0gaW5kZXggPj0gMDtcblxuICAgICAgICBpZiAoaW5jbHVkZWQgJiYgIWNoZWNrZWQpIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IFtcbiAgICAgICAgICAgIC4uLnRoaXNbbW9kZWwucHJvcF0uc2xpY2UoMCwgaW5kZXgpLFxuICAgICAgICAgICAgLi4udGhpc1ttb2RlbC5wcm9wXS5zbGljZShpbmRleCArIDEsIHRoaXNbbW9kZWwucHJvcF0ubGVuZ3RoKVxuICAgICAgICAgIF07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWluY2x1ZGVkICYmIGNoZWNrZWQpIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IFsgLi4udGhpc1ttb2RlbC5wcm9wXSwgdmFsdWUgXTtcbiAgICAgICAgfVxuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBJcyBCb29sZWFuXG4gICAgICAgIG5ld1ZhbHVlID0gY2hlY2tlZDtcbiAgICAgIH1cblxuICAgICAgLy8gRW1pdCBpZiB2YWx1ZSBjaGFuZ2VkXG4gICAgICBuZXdWYWx1ZSAhPT0gdW5kZWZpbmVkICYmIHRoaXMuJGVtaXQobW9kZWwuZXZlbnQsIG5ld1ZhbHVlKTtcbiAgICB9XG4gIH1cbn07XG5cbi8vIFJhZGlvIGlucHV0XG5jb25zdCBtb2RlbFJhZGlvID0ge1xuICBtaXhpbnM6IFttb2RlbElucHV0XSxcbiAgcHJvcHM6IHtcbiAgICBbbW9kZWwuZXZlbnRdOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnY2hhbmdlJ1xuICAgIH1cbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgX3VwZGF0ZVZhbHVlKCkge1xuICAgICAgdGhpcy4kZWwuY2hlY2tlZCA9IHRoaXNbbW9kZWwucHJvcF0gPT09IHRoaXMuJGVsLnZhbHVlO1xuICAgIH0sXG4gICAgX29uTW9kZWxFdmVudChldmVudCkge1xuICAgICAgY29uc3QgeyB2YWx1ZSwgY2hlY2tlZCB9ID0gZXZlbnQudGFyZ2V0O1xuICAgICAgY2hlY2tlZCAmJiB0aGlzLiRlbWl0KG1vZGVsLmV2ZW50LCB2YWx1ZSk7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgeyBtb2RlbElucHV0LCBtb2RlbENoZWNrYm94LCBtb2RlbFJhZGlvIH07XG5cbiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy10b29sYmFyIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIiA6bW9kaWZpZXI9XCJub3JtYWxpemVkTW9kaWZpZXJcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLXRvb2xiYXI+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICAvKiBUaGlzIGZpbGUgd2FzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5IGJ5ICdnZW5lcmF0ZS1jb21wb25lbnRzJyB0YXNrIGluIGJpbmRpbmdzL3Z1ZS9ndWxwZmlsZS5iYWJlbC5qcyAqL1xuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy10b29sYmFyJztcbiAgaW1wb3J0IHsgZGVyaXZlRXZlbnRzLCBoaWRhYmxlLCBtb2RpZmllciB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy10b29sYmFyJyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHMsIGhpZGFibGUsIG1vZGlmaWVyXVxuICB9O1xuPC9zY3JpcHQ+IiwiPHRlbXBsYXRlPlxuICA8b25zLWJvdHRvbS10b29sYmFyIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIiA6bW9kaWZpZXI9XCJub3JtYWxpemVkTW9kaWZpZXJcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLWJvdHRvbS10b29sYmFyPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgLyogVGhpcyBmaWxlIHdhcyBnZW5lcmF0ZWQgYXV0b21hdGljYWxseSBieSAnZ2VuZXJhdGUtY29tcG9uZW50cycgdGFzayBpbiBiaW5kaW5ncy92dWUvZ3VscGZpbGUuYmFiZWwuanMgKi9cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtYm90dG9tLXRvb2xiYXInO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMsIG1vZGlmaWVyIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLWJvdHRvbS10b29sYmFyJyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHMsIG1vZGlmaWVyXVxuICB9O1xuPC9zY3JpcHQ+IiwiPHRlbXBsYXRlPlxuICA8b25zLXRvb2xiYXItYnV0dG9uIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIiA6bW9kaWZpZXI9XCJub3JtYWxpemVkTW9kaWZpZXJcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLXRvb2xiYXItYnV0dG9uPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgLyogVGhpcyBmaWxlIHdhcyBnZW5lcmF0ZWQgYXV0b21hdGljYWxseSBieSAnZ2VuZXJhdGUtY29tcG9uZW50cycgdGFzayBpbiBiaW5kaW5ncy92dWUvZ3VscGZpbGUuYmFiZWwuanMgKi9cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtdG9vbGJhci1idXR0b24nO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMsIG1vZGlmaWVyIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLXRvb2xiYXItYnV0dG9uJyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHMsIG1vZGlmaWVyXVxuICB9O1xuPC9zY3JpcHQ+IiwiPHRlbXBsYXRlPlxuICA8b25zLWFsZXJ0LWRpYWxvZy1idXR0b24gdi1vbj1cInVucmVjb2duaXplZExpc3RlbmVyc1wiIDptb2RpZmllcj1cIm5vcm1hbGl6ZWRNb2RpZmllclwiPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9vbnMtYWxlcnQtZGlhbG9nLWJ1dHRvbj5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIC8qIFRoaXMgZmlsZSB3YXMgZ2VuZXJhdGVkIGF1dG9tYXRpY2FsbHkgYnkgJ2dlbmVyYXRlLWNvbXBvbmVudHMnIHRhc2sgaW4gYmluZGluZ3MvdnVlL2d1bHBmaWxlLmJhYmVsLmpzICovXG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLWFsZXJ0LWRpYWxvZy1idXR0b24nO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMsIG1vZGlmaWVyIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLWFsZXJ0LWRpYWxvZy1idXR0b24nLFxuICAgIG1peGluczogW2Rlcml2ZUV2ZW50cywgbW9kaWZpZXJdXG4gIH07XG48L3NjcmlwdD4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtYnV0dG9uIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIiA6bW9kaWZpZXI9XCJub3JtYWxpemVkTW9kaWZpZXJcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLWJ1dHRvbj5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIC8qIFRoaXMgZmlsZSB3YXMgZ2VuZXJhdGVkIGF1dG9tYXRpY2FsbHkgYnkgJ2dlbmVyYXRlLWNvbXBvbmVudHMnIHRhc2sgaW4gYmluZGluZ3MvdnVlL2d1bHBmaWxlLmJhYmVsLmpzICovXG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLWJ1dHRvbic7XG4gIGltcG9ydCB7IGRlcml2ZUV2ZW50cywgbW9kaWZpZXIgfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtYnV0dG9uJyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHMsIG1vZGlmaWVyXVxuICB9O1xuPC9zY3JpcHQ+IiwiPHRlbXBsYXRlPlxuICA8b25zLWljb24gdi1vbj1cInVucmVjb2duaXplZExpc3RlbmVyc1wiIDptb2RpZmllcj1cIm5vcm1hbGl6ZWRNb2RpZmllclwiPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9vbnMtaWNvbj5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIC8qIFRoaXMgZmlsZSB3YXMgZ2VuZXJhdGVkIGF1dG9tYXRpY2FsbHkgYnkgJ2dlbmVyYXRlLWNvbXBvbmVudHMnIHRhc2sgaW4gYmluZGluZ3MvdnVlL2d1bHBmaWxlLmJhYmVsLmpzICovXG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLWljb24nO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMsIG1vZGlmaWVyIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLWljb24nLFxuICAgIG1peGluczogW2Rlcml2ZUV2ZW50cywgbW9kaWZpZXJdXG4gIH07XG48L3NjcmlwdD4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtY2FyZCB2LW9uPVwidW5yZWNvZ25pemVkTGlzdGVuZXJzXCIgOm1vZGlmaWVyPVwibm9ybWFsaXplZE1vZGlmaWVyXCI+XG4gICAgPHNsb3Q+PC9zbG90PlxuICA8L29ucy1jYXJkPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgLyogVGhpcyBmaWxlIHdhcyBnZW5lcmF0ZWQgYXV0b21hdGljYWxseSBieSAnZ2VuZXJhdGUtY29tcG9uZW50cycgdGFzayBpbiBiaW5kaW5ncy92dWUvZ3VscGZpbGUuYmFiZWwuanMgKi9cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtY2FyZCc7XG4gIGltcG9ydCB7IGRlcml2ZUV2ZW50cywgbW9kaWZpZXIgfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtY2FyZCcsXG4gICAgbWl4aW5zOiBbZGVyaXZlRXZlbnRzLCBtb2RpZmllcl1cbiAgfTtcbjwvc2NyaXB0PiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy1saXN0IHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIiA6bW9kaWZpZXI9XCJub3JtYWxpemVkTW9kaWZpZXJcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLWxpc3Q+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICAvKiBUaGlzIGZpbGUgd2FzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5IGJ5ICdnZW5lcmF0ZS1jb21wb25lbnRzJyB0YXNrIGluIGJpbmRpbmdzL3Z1ZS9ndWxwZmlsZS5iYWJlbC5qcyAqL1xuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1saXN0JztcbiAgaW1wb3J0IHsgZGVyaXZlRXZlbnRzLCBtb2RpZmllciB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy1saXN0JyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHMsIG1vZGlmaWVyXVxuICB9O1xuPC9zY3JpcHQ+IiwiPHRlbXBsYXRlPlxuICA8b25zLWxpc3QtaXRlbSB2LW9uPVwidW5yZWNvZ25pemVkTGlzdGVuZXJzXCIgOm1vZGlmaWVyPVwibm9ybWFsaXplZE1vZGlmaWVyXCIgdi1vbjpleHBhbnNpb249XCJvbkV4cGFuc2lvblwiPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9vbnMtbGlzdC1pdGVtPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgLyogVGhpcyBmaWxlIHdhcyBnZW5lcmF0ZWQgYXV0b21hdGljYWxseSBieSAnZ2VuZXJhdGUtY29tcG9uZW50cycgdGFzayBpbiBiaW5kaW5ncy92dWUvZ3VscGZpbGUuYmFiZWwuanMgKi9cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtbGlzdC1pdGVtJztcbiAgaW1wb3J0IHsgZGVyaXZlRXZlbnRzLCBtb2RpZmllciB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy1saXN0LWl0ZW0nLFxuICAgIG1peGluczogW2Rlcml2ZUV2ZW50cywgbW9kaWZpZXJdLFxuICAgIHByb3BzOiB7XG4gICAgICBleHBhbmRlZDoge1xuICAgICAgICB0eXBlOiBCb29sZWFuXG4gICAgICB9XG4gICAgfSxcbiAgICBtZXRob2RzOiB7XG4gICAgICBvbkV4cGFuc2lvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuZXhwYW5kZWQgIT09IHRoaXMuJGVsLmV4cGFuZGVkKSB7XG4gICAgICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOmV4cGFuZGVkJywgdGhpcy4kZWwuZXhwYW5kZWQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB3YXRjaDoge1xuICAgICAgZXhwYW5kZWQoKSB7XG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuZXhwYW5kZWQgPyAnc2hvdycgOiAnaGlkZSc7XG4gICAgICAgIHRoaXMuJGVsW2FjdGlvbiArICdFeHBhbnNpb24nXSgpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbjwvc2NyaXB0PiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy1saXN0LXRpdGxlIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIiA6bW9kaWZpZXI9XCJub3JtYWxpemVkTW9kaWZpZXJcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLWxpc3QtdGl0bGU+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICAvKiBUaGlzIGZpbGUgd2FzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5IGJ5ICdnZW5lcmF0ZS1jb21wb25lbnRzJyB0YXNrIGluIGJpbmRpbmdzL3Z1ZS9ndWxwZmlsZS5iYWJlbC5qcyAqL1xuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1saXN0LXRpdGxlJztcbiAgaW1wb3J0IHsgZGVyaXZlRXZlbnRzLCBtb2RpZmllciB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy1saXN0LXRpdGxlJyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHMsIG1vZGlmaWVyXVxuICB9O1xuPC9zY3JpcHQ+IiwiPHRlbXBsYXRlPlxuICA8b25zLWxpc3QtaGVhZGVyIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIiA6bW9kaWZpZXI9XCJub3JtYWxpemVkTW9kaWZpZXJcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLWxpc3QtaGVhZGVyPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgLyogVGhpcyBmaWxlIHdhcyBnZW5lcmF0ZWQgYXV0b21hdGljYWxseSBieSAnZ2VuZXJhdGUtY29tcG9uZW50cycgdGFzayBpbiBiaW5kaW5ncy92dWUvZ3VscGZpbGUuYmFiZWwuanMgKi9cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtbGlzdC1oZWFkZXInO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMsIG1vZGlmaWVyIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLWxpc3QtaGVhZGVyJyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHMsIG1vZGlmaWVyXVxuICB9O1xuPC9zY3JpcHQ+IiwiPHRlbXBsYXRlPlxuICA8b25zLXJpcHBsZSB2LW9uPVwidW5yZWNvZ25pemVkTGlzdGVuZXJzXCI+XG4gICAgPHNsb3Q+PC9zbG90PlxuICA8L29ucy1yaXBwbGU+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICAvKiBUaGlzIGZpbGUgd2FzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5IGJ5ICdnZW5lcmF0ZS1jb21wb25lbnRzJyB0YXNrIGluIGJpbmRpbmdzL3Z1ZS9ndWxwZmlsZS5iYWJlbC5qcyAqL1xuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1yaXBwbGUnO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMgfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtcmlwcGxlJyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHNdXG4gIH07XG48L3NjcmlwdD4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtcm93IHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLXJvdz5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIC8qIFRoaXMgZmlsZSB3YXMgZ2VuZXJhdGVkIGF1dG9tYXRpY2FsbHkgYnkgJ2dlbmVyYXRlLWNvbXBvbmVudHMnIHRhc2sgaW4gYmluZGluZ3MvdnVlL2d1bHBmaWxlLmJhYmVsLmpzICovXG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLXJvdyc7XG4gIGltcG9ydCB7IGRlcml2ZUV2ZW50cyB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy1yb3cnLFxuICAgIG1peGluczogW2Rlcml2ZUV2ZW50c11cbiAgfTtcbjwvc2NyaXB0PiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy1jb2wgdi1vbj1cInVucmVjb2duaXplZExpc3RlbmVyc1wiPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9vbnMtY29sPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgLyogVGhpcyBmaWxlIHdhcyBnZW5lcmF0ZWQgYXV0b21hdGljYWxseSBieSAnZ2VuZXJhdGUtY29tcG9uZW50cycgdGFzayBpbiBiaW5kaW5ncy92dWUvZ3VscGZpbGUuYmFiZWwuanMgKi9cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtY29sJztcbiAgaW1wb3J0IHsgZGVyaXZlRXZlbnRzIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLWNvbCcsXG4gICAgbWl4aW5zOiBbZGVyaXZlRXZlbnRzXVxuICB9O1xuPC9zY3JpcHQ+IiwiPHRlbXBsYXRlPlxuICA8b25zLXByb2dyZXNzLWJhciB2LW9uPVwidW5yZWNvZ25pemVkTGlzdGVuZXJzXCIgOm1vZGlmaWVyPVwibm9ybWFsaXplZE1vZGlmaWVyXCI+XG4gICAgPHNsb3Q+PC9zbG90PlxuICA8L29ucy1wcm9ncmVzcy1iYXI+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICAvKiBUaGlzIGZpbGUgd2FzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5IGJ5ICdnZW5lcmF0ZS1jb21wb25lbnRzJyB0YXNrIGluIGJpbmRpbmdzL3Z1ZS9ndWxwZmlsZS5iYWJlbC5qcyAqL1xuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1wcm9ncmVzcy1iYXInO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMsIG1vZGlmaWVyIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLXByb2dyZXNzLWJhcicsXG4gICAgbWl4aW5zOiBbZGVyaXZlRXZlbnRzLCBtb2RpZmllcl1cbiAgfTtcbjwvc2NyaXB0PiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy1wcm9ncmVzcy1jaXJjdWxhciB2LW9uPVwidW5yZWNvZ25pemVkTGlzdGVuZXJzXCIgOm1vZGlmaWVyPVwibm9ybWFsaXplZE1vZGlmaWVyXCI+XG4gICAgPHNsb3Q+PC9zbG90PlxuICA8L29ucy1wcm9ncmVzcy1jaXJjdWxhcj5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIC8qIFRoaXMgZmlsZSB3YXMgZ2VuZXJhdGVkIGF1dG9tYXRpY2FsbHkgYnkgJ2dlbmVyYXRlLWNvbXBvbmVudHMnIHRhc2sgaW4gYmluZGluZ3MvdnVlL2d1bHBmaWxlLmJhYmVsLmpzICovXG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLXByb2dyZXNzLWNpcmN1bGFyJztcbiAgaW1wb3J0IHsgZGVyaXZlRXZlbnRzLCBtb2RpZmllciB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy1wcm9ncmVzcy1jaXJjdWxhcicsXG4gICAgbWl4aW5zOiBbZGVyaXZlRXZlbnRzLCBtb2RpZmllcl1cbiAgfTtcbjwvc2NyaXB0PiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy1jYXJvdXNlbC1pdGVtIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLWNhcm91c2VsLWl0ZW0+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICAvKiBUaGlzIGZpbGUgd2FzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5IGJ5ICdnZW5lcmF0ZS1jb21wb25lbnRzJyB0YXNrIGluIGJpbmRpbmdzL3Z1ZS9ndWxwZmlsZS5iYWJlbC5qcyAqL1xuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1jYXJvdXNlbC1pdGVtJztcbiAgaW1wb3J0IHsgZGVyaXZlRXZlbnRzIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLWNhcm91c2VsLWl0ZW0nLFxuICAgIG1peGluczogW2Rlcml2ZUV2ZW50c11cbiAgfTtcbjwvc2NyaXB0PiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy1zcGxpdHRlci1tYXNrIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLXNwbGl0dGVyLW1hc2s+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICAvKiBUaGlzIGZpbGUgd2FzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5IGJ5ICdnZW5lcmF0ZS1jb21wb25lbnRzJyB0YXNrIGluIGJpbmRpbmdzL3Z1ZS9ndWxwZmlsZS5iYWJlbC5qcyAqL1xuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1zcGxpdHRlci1tYXNrJztcbiAgaW1wb3J0IHsgZGVyaXZlRXZlbnRzIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLXNwbGl0dGVyLW1hc2snLFxuICAgIG1peGluczogW2Rlcml2ZUV2ZW50c11cbiAgfTtcbjwvc2NyaXB0PiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy1zcGxpdHRlci1jb250ZW50IHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLXNwbGl0dGVyLWNvbnRlbnQ+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICAvKiBUaGlzIGZpbGUgd2FzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5IGJ5ICdnZW5lcmF0ZS1jb21wb25lbnRzJyB0YXNrIGluIGJpbmRpbmdzL3Z1ZS9ndWxwZmlsZS5iYWJlbC5qcyAqL1xuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1zcGxpdHRlci1jb250ZW50JztcbiAgaW1wb3J0IHsgZGVyaXZlRXZlbnRzIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLXNwbGl0dGVyLWNvbnRlbnQnLFxuICAgIG1peGluczogW2Rlcml2ZUV2ZW50c11cbiAgfTtcbjwvc2NyaXB0PiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy1zcGxpdHRlciB2LW9uPVwidW5yZWNvZ25pemVkTGlzdGVuZXJzXCI+XG4gICAgPHNsb3Q+PC9zbG90PlxuICA8L29ucy1zcGxpdHRlcj5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIC8qIFRoaXMgZmlsZSB3YXMgZ2VuZXJhdGVkIGF1dG9tYXRpY2FsbHkgYnkgJ2dlbmVyYXRlLWNvbXBvbmVudHMnIHRhc2sgaW4gYmluZGluZ3MvdnVlL2d1bHBmaWxlLmJhYmVsLmpzICovXG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLXNwbGl0dGVyJztcbiAgaW1wb3J0IHsgZGVyaXZlRXZlbnRzLCBzZWxmUHJvdmlkZXIsIGRlcml2ZURCQiB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy1zcGxpdHRlcicsXG4gICAgbWl4aW5zOiBbZGVyaXZlRXZlbnRzLCBzZWxmUHJvdmlkZXIsIGRlcml2ZURCQl1cbiAgfTtcbjwvc2NyaXB0PiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy1zd2l0Y2ggdi1vbj1cInVucmVjb2duaXplZExpc3RlbmVyc1wiIDptb2RpZmllcj1cIm5vcm1hbGl6ZWRNb2RpZmllclwiPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9vbnMtc3dpdGNoPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgLyogVGhpcyBmaWxlIHdhcyBnZW5lcmF0ZWQgYXV0b21hdGljYWxseSBieSAnZ2VuZXJhdGUtY29tcG9uZW50cycgdGFzayBpbiBiaW5kaW5ncy92dWUvZ3VscGZpbGUuYmFiZWwuanMgKi9cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtc3dpdGNoJztcbiAgaW1wb3J0IHsgZGVyaXZlRXZlbnRzLCBtb2RlbENoZWNrYm94LCBtb2RpZmllciB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy1zd2l0Y2gnLFxuICAgIG1peGluczogW2Rlcml2ZUV2ZW50cywgbW9kZWxDaGVja2JveCwgbW9kaWZpZXJdXG4gIH07XG48L3NjcmlwdD4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtY2hlY2tib3ggdi1vbj1cInVucmVjb2duaXplZExpc3RlbmVyc1wiIDptb2RpZmllcj1cIm5vcm1hbGl6ZWRNb2RpZmllclwiPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9vbnMtY2hlY2tib3g+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICAvKiBUaGlzIGZpbGUgd2FzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5IGJ5ICdnZW5lcmF0ZS1jb21wb25lbnRzJyB0YXNrIGluIGJpbmRpbmdzL3Z1ZS9ndWxwZmlsZS5iYWJlbC5qcyAqL1xuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1jaGVja2JveCc7XG4gIGltcG9ydCB7IGRlcml2ZUV2ZW50cywgbW9kZWxDaGVja2JveCwgbW9kaWZpZXIgfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtY2hlY2tib3gnLFxuICAgIG1peGluczogW2Rlcml2ZUV2ZW50cywgbW9kZWxDaGVja2JveCwgbW9kaWZpZXJdXG4gIH07XG48L3NjcmlwdD4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtaW5wdXQgdi1vbj1cInVucmVjb2duaXplZExpc3RlbmVyc1wiIDptb2RpZmllcj1cIm5vcm1hbGl6ZWRNb2RpZmllclwiPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9vbnMtaW5wdXQ+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICAvKiBUaGlzIGZpbGUgd2FzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5IGJ5ICdnZW5lcmF0ZS1jb21wb25lbnRzJyB0YXNrIGluIGJpbmRpbmdzL3Z1ZS9ndWxwZmlsZS5iYWJlbC5qcyAqL1xuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1pbnB1dCc7XG4gIGltcG9ydCB7IGRlcml2ZUV2ZW50cywgbW9kZWxJbnB1dCwgbW9kaWZpZXIgfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtaW5wdXQnLFxuICAgIG1peGluczogW2Rlcml2ZUV2ZW50cywgbW9kZWxJbnB1dCwgbW9kaWZpZXJdXG4gIH07XG48L3NjcmlwdD4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtc2VhcmNoLWlucHV0IHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIiA6bW9kaWZpZXI9XCJub3JtYWxpemVkTW9kaWZpZXJcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLXNlYXJjaC1pbnB1dD5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIC8qIFRoaXMgZmlsZSB3YXMgZ2VuZXJhdGVkIGF1dG9tYXRpY2FsbHkgYnkgJ2dlbmVyYXRlLWNvbXBvbmVudHMnIHRhc2sgaW4gYmluZGluZ3MvdnVlL2d1bHBmaWxlLmJhYmVsLmpzICovXG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLXNlYXJjaC1pbnB1dCc7XG4gIGltcG9ydCB7IGRlcml2ZUV2ZW50cywgbW9kZWxJbnB1dCwgbW9kaWZpZXIgfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtc2VhcmNoLWlucHV0JyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHMsIG1vZGVsSW5wdXQsIG1vZGlmaWVyXVxuICB9O1xuPC9zY3JpcHQ+IiwiPHRlbXBsYXRlPlxuICA8b25zLXJhbmdlIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIiA6bW9kaWZpZXI9XCJub3JtYWxpemVkTW9kaWZpZXJcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLXJhbmdlPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgLyogVGhpcyBmaWxlIHdhcyBnZW5lcmF0ZWQgYXV0b21hdGljYWxseSBieSAnZ2VuZXJhdGUtY29tcG9uZW50cycgdGFzayBpbiBiaW5kaW5ncy92dWUvZ3VscGZpbGUuYmFiZWwuanMgKi9cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtcmFuZ2UnO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMsIG1vZGVsSW5wdXQsIG1vZGlmaWVyIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLXJhbmdlJyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHMsIG1vZGVsSW5wdXQsIG1vZGlmaWVyXVxuICB9O1xuPC9zY3JpcHQ+IiwiPHRlbXBsYXRlPlxuICA8b25zLXJhZGlvIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIiA6bW9kaWZpZXI9XCJub3JtYWxpemVkTW9kaWZpZXJcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLXJhZGlvPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgLyogVGhpcyBmaWxlIHdhcyBnZW5lcmF0ZWQgYXV0b21hdGljYWxseSBieSAnZ2VuZXJhdGUtY29tcG9uZW50cycgdGFzayBpbiBiaW5kaW5ncy92dWUvZ3VscGZpbGUuYmFiZWwuanMgKi9cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtcmFkaW8nO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMsIG1vZGVsUmFkaW8sIG1vZGlmaWVyIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLXJhZGlvJyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHMsIG1vZGVsUmFkaW8sIG1vZGlmaWVyXVxuICB9O1xuPC9zY3JpcHQ+IiwiPHRlbXBsYXRlPlxuICA8b25zLWZhYiB2LW9uPVwidW5yZWNvZ25pemVkTGlzdGVuZXJzXCIgOm1vZGlmaWVyPVwibm9ybWFsaXplZE1vZGlmaWVyXCI+XG4gICAgPHNsb3Q+PC9zbG90PlxuICA8L29ucy1mYWI+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICAvKiBUaGlzIGZpbGUgd2FzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5IGJ5ICdnZW5lcmF0ZS1jb21wb25lbnRzJyB0YXNrIGluIGJpbmRpbmdzL3Z1ZS9ndWxwZmlsZS5iYWJlbC5qcyAqL1xuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1mYWInO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMsIGhpZGFibGUsIG1vZGlmaWVyIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLWZhYicsXG4gICAgbWl4aW5zOiBbZGVyaXZlRXZlbnRzLCBoaWRhYmxlLCBtb2RpZmllcl1cbiAgfTtcbjwvc2NyaXB0PiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy1zcGVlZC1kaWFsLWl0ZW0gdi1vbj1cInVucmVjb2duaXplZExpc3RlbmVyc1wiIDptb2RpZmllcj1cIm5vcm1hbGl6ZWRNb2RpZmllclwiPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9vbnMtc3BlZWQtZGlhbC1pdGVtPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgLyogVGhpcyBmaWxlIHdhcyBnZW5lcmF0ZWQgYXV0b21hdGljYWxseSBieSAnZ2VuZXJhdGUtY29tcG9uZW50cycgdGFzayBpbiBiaW5kaW5ncy92dWUvZ3VscGZpbGUuYmFiZWwuanMgKi9cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtc3BlZWQtZGlhbC1pdGVtJztcbiAgaW1wb3J0IHsgZGVyaXZlRXZlbnRzLCBtb2RpZmllciB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy1zcGVlZC1kaWFsLWl0ZW0nLFxuICAgIG1peGluczogW2Rlcml2ZUV2ZW50cywgbW9kaWZpZXJdXG4gIH07XG48L3NjcmlwdD4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtZGlhbG9nIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIiA6bW9kaWZpZXI9XCJub3JtYWxpemVkTW9kaWZpZXJcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLWRpYWxvZz5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIC8qIFRoaXMgZmlsZSB3YXMgZ2VuZXJhdGVkIGF1dG9tYXRpY2FsbHkgYnkgJ2dlbmVyYXRlLWNvbXBvbmVudHMnIHRhc2sgaW4gYmluZGluZ3MvdnVlL2d1bHBmaWxlLmJhYmVsLmpzICovXG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLWRpYWxvZyc7XG4gIGltcG9ydCB7IGRlcml2ZUV2ZW50cywgaGlkYWJsZSwgaGFzT3B0aW9ucywgZGlhbG9nQ2FuY2VsLCBkZXJpdmVEQkIsIHBvcnRhbCwgbW9kaWZpZXIgfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtZGlhbG9nJyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHMsIGhpZGFibGUsIGhhc09wdGlvbnMsIGRpYWxvZ0NhbmNlbCwgZGVyaXZlREJCLCBwb3J0YWwsIG1vZGlmaWVyXVxuICB9O1xuPC9zY3JpcHQ+IiwiPHRlbXBsYXRlPlxuICA8b25zLWFjdGlvbi1zaGVldCB2LW9uPVwidW5yZWNvZ25pemVkTGlzdGVuZXJzXCIgOm1vZGlmaWVyPVwibm9ybWFsaXplZE1vZGlmaWVyXCI+XG4gICAgPHNsb3Q+PC9zbG90PlxuICA8L29ucy1hY3Rpb24tc2hlZXQ+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICAvKiBUaGlzIGZpbGUgd2FzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5IGJ5ICdnZW5lcmF0ZS1jb21wb25lbnRzJyB0YXNrIGluIGJpbmRpbmdzL3Z1ZS9ndWxwZmlsZS5iYWJlbC5qcyAqL1xuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1hY3Rpb24tc2hlZXQnO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMsIGhpZGFibGUsIGhhc09wdGlvbnMsIGRpYWxvZ0NhbmNlbCwgZGVyaXZlREJCLCBwb3J0YWwsIG1vZGlmaWVyIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLWFjdGlvbi1zaGVldCcsXG4gICAgbWl4aW5zOiBbZGVyaXZlRXZlbnRzLCBoaWRhYmxlLCBoYXNPcHRpb25zLCBkaWFsb2dDYW5jZWwsIGRlcml2ZURCQiwgcG9ydGFsLCBtb2RpZmllcl1cbiAgfTtcbjwvc2NyaXB0PiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy1hY3Rpb24tc2hlZXQtYnV0dG9uIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIiA6bW9kaWZpZXI9XCJub3JtYWxpemVkTW9kaWZpZXJcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLWFjdGlvbi1zaGVldC1idXR0b24+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICAvKiBUaGlzIGZpbGUgd2FzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5IGJ5ICdnZW5lcmF0ZS1jb21wb25lbnRzJyB0YXNrIGluIGJpbmRpbmdzL3Z1ZS9ndWxwZmlsZS5iYWJlbC5qcyAqL1xuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1hY3Rpb24tc2hlZXQtYnV0dG9uJztcbiAgaW1wb3J0IHsgZGVyaXZlRXZlbnRzLCBtb2RpZmllciB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy1hY3Rpb24tc2hlZXQtYnV0dG9uJyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHMsIG1vZGlmaWVyXVxuICB9O1xuPC9zY3JpcHQ+IiwiPHRlbXBsYXRlPlxuICA8b25zLW1vZGFsIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIiA6bW9kaWZpZXI9XCJub3JtYWxpemVkTW9kaWZpZXJcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLW1vZGFsPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgLyogVGhpcyBmaWxlIHdhcyBnZW5lcmF0ZWQgYXV0b21hdGljYWxseSBieSAnZ2VuZXJhdGUtY29tcG9uZW50cycgdGFzayBpbiBiaW5kaW5ncy92dWUvZ3VscGZpbGUuYmFiZWwuanMgKi9cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtbW9kYWwnO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMsIGhpZGFibGUsIGhhc09wdGlvbnMsIGRlcml2ZURCQiwgcG9ydGFsLCBtb2RpZmllciB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy1tb2RhbCcsXG4gICAgbWl4aW5zOiBbZGVyaXZlRXZlbnRzLCBoaWRhYmxlLCBoYXNPcHRpb25zLCBkZXJpdmVEQkIsIHBvcnRhbCwgbW9kaWZpZXJdXG4gIH07XG48L3NjcmlwdD4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtdG9hc3Qgdi1vbj1cInVucmVjb2duaXplZExpc3RlbmVyc1wiIDptb2RpZmllcj1cIm5vcm1hbGl6ZWRNb2RpZmllclwiPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9vbnMtdG9hc3Q+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICAvKiBUaGlzIGZpbGUgd2FzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5IGJ5ICdnZW5lcmF0ZS1jb21wb25lbnRzJyB0YXNrIGluIGJpbmRpbmdzL3Z1ZS9ndWxwZmlsZS5iYWJlbC5qcyAqL1xuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy10b2FzdCc7XG4gIGltcG9ydCB7IGRlcml2ZUV2ZW50cywgaGlkYWJsZSwgaGFzT3B0aW9ucywgZGVyaXZlREJCLCBwb3J0YWwsIG1vZGlmaWVyIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLXRvYXN0JyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHMsIGhpZGFibGUsIGhhc09wdGlvbnMsIGRlcml2ZURCQiwgcG9ydGFsLCBtb2RpZmllcl1cbiAgfTtcbjwvc2NyaXB0PiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy1wb3BvdmVyIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLXBvcG92ZXI+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1wb3BvdmVyJztcbiAgaW1wb3J0IHsgaGlkYWJsZSwgaGFzT3B0aW9ucywgZGlhbG9nQ2FuY2VsLCBkZXJpdmVFdmVudHMsIGRlcml2ZURCQiwgcG9ydGFsIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLXBvcG92ZXInLFxuICAgIG1peGluczogW2hpZGFibGUsIGhhc09wdGlvbnMsIGRpYWxvZ0NhbmNlbCwgZGVyaXZlRXZlbnRzLCBkZXJpdmVEQkIsIHBvcnRhbF0sXG5cbiAgICBwcm9wczoge1xuICAgICAgdGFyZ2V0OiB7XG4gICAgICAgIHZhbGlkYXRvcih2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZS5faXNWdWUgfHwgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB2YWx1ZSBpbnN0YW5jZW9mIEV2ZW50IHx8IHZhbHVlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY29tcHV0ZWQ6IHtcbiAgICAgIG5vcm1hbGl6ZWRUYXJnZXQoKSB7XG4gICAgICAgIGlmICh0aGlzLnRhcmdldCAmJiB0aGlzLnRhcmdldC5faXNWdWUpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy50YXJnZXQuJGVsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnRhcmdldDtcbiAgICAgIH0sXG4gICAgICBub3JtYWxpemVkT3B0aW9ucygpIHtcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0KSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRhcmdldDogdGhpcy5ub3JtYWxpemVkVGFyZ2V0LFxuICAgICAgICAgICAgLi4udGhpcy5vcHRpb25zXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbjwvc2NyaXB0PlxuIiwiPHRlbXBsYXRlPlxuICA8b25zLWFsZXJ0LWRpYWxvZyB2LW9uPVwidW5yZWNvZ25pemVkTGlzdGVuZXJzXCIgOm1vZGlmaWVyPVwibm9ybWFsaXplZE1vZGlmaWVyXCI+XG4gICAgPGRpdiBjbGFzcz1cImFsZXJ0LWRpYWxvZy10aXRsZVwiPlxuICAgICAgPHNsb3QgbmFtZT1cInRpdGxlXCI+e3t0aXRsZX19PC9zbG90PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJhbGVydC1kaWFsb2ctY29udGVudFwiPlxuICAgICAgPHNsb3Q+PC9zbG90PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJhbGVydC1kaWFsb2ctZm9vdGVyXCI+XG4gICAgICA8c2xvdCBuYW1lPVwiZm9vdGVyXCI+XG4gICAgICAgIDxvbnMtYWxlcnQtZGlhbG9nLWJ1dHRvbiB2LWZvcj1cIihoYW5kbGVyLCBrZXkpIGluIGZvb3RlclwiIDprZXk9XCJrZXlcIiBAY2xpY2s9XCJoYW5kbGVyXCI+e3trZXl9fTwvb25zLWFsZXJ0LWRpYWxvZy1idXR0b24+XG4gICAgICA8L3Nsb3Q+XG4gICAgPC9kaXY+XG4gIDwvb25zLWFsZXJ0LWRpYWxvZz5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLWFsZXJ0LWRpYWxvZyc7XG4gIGltcG9ydCB7IGhpZGFibGUsIGhhc09wdGlvbnMsIGRpYWxvZ0NhbmNlbCwgZGVyaXZlRXZlbnRzLCBkZXJpdmVEQkIsIHBvcnRhbCwgbW9kaWZpZXIgfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtYWxlcnQtZGlhbG9nJyxcbiAgICBtaXhpbnM6IFtoaWRhYmxlLCBoYXNPcHRpb25zLCBkaWFsb2dDYW5jZWwsIGRlcml2ZUV2ZW50cywgZGVyaXZlREJCLCBwb3J0YWwsIG1vZGlmaWVyXSxcblxuICAgIHByb3BzOiB7XG4gICAgICB0aXRsZToge1xuICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgIH0sXG4gICAgICBmb290ZXI6IHtcbiAgICAgICAgdHlwZTogT2JqZWN0LFxuICAgICAgICB2YWxpZGF0b3IodmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModmFsdWUpLmV2ZXJ5KGtleSA9PiB2YWx1ZVtrZXldIGluc3RhbmNlb2YgRnVuY3Rpb24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuPC9zY3JpcHQ+XG4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtc3BlZWQtZGlhbCA6b24tY2xpY2sucHJvcD1cImFjdGlvblwiPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9vbnMtc3BlZWQtZGlhbD5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLXNwZWVkLWRpYWwnO1xuICBpbXBvcnQgeyBoaWRhYmxlLCBkZXJpdmVFdmVudHMgfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtc3BlZWQtZGlhbCcsXG4gICAgbWl4aW5zOiBbZGVyaXZlRXZlbnRzLCBoaWRhYmxlXSxcblxuICAgIHByb3BzOiB7XG4gICAgICBvcGVuOiB7XG4gICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgICAgfVxuICAgIH0sXG5cbiAgICBtZXRob2RzOiB7XG4gICAgICBhY3Rpb24oKSB7XG4gICAgICAgIGxldCBydW5EZWZhdWx0ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy4kZW1pdCgnY2xpY2snLCB7IHByZXZlbnREZWZhdWx0OiAoKSA9PiBydW5EZWZhdWx0ID0gZmFsc2UgfSk7XG5cbiAgICAgICAgaWYgKHJ1bkRlZmF1bHQpIHtcbiAgICAgICAgICB0aGlzLiRlbC50b2dnbGVJdGVtcygpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgX3Nob3VsZFVwZGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3BlbiAhPT0gdW5kZWZpbmVkICYmIHRoaXMub3BlbiAhPT0gdGhpcy4kZWwuaXNPcGVuKCk7XG4gICAgICB9LFxuICAgICAgX3VwZGF0ZVRvZ2dsZSgpIHtcbiAgICAgICAgdGhpcy5fc2hvdWxkVXBkYXRlKCkgJiYgdGhpcy4kZWxbdGhpcy5vcGVuID8gJ3Nob3dJdGVtcycgOiAnaGlkZUl0ZW1zJ10uY2FsbCh0aGlzLiRlbCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHdhdGNoOiB7XG4gICAgICBvcGVuKCkge1xuICAgICAgICB0aGlzLl91cGRhdGVUb2dnbGUoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgbW91bnRlZCgpIHtcbiAgICAgIHRoaXMuJG9uKFsnb3BlbicsICdjbG9zZSddLCAoKSA9PiB0aGlzLl9zaG91bGRVcGRhdGUoKSAmJiB0aGlzLiRlbWl0KCd1cGRhdGU6b3BlbicsIHRoaXMuJGVsLmlzT3BlbigpKSk7XG5cbiAgICAgIHRoaXMuX3VwZGF0ZVRvZ2dsZSgpO1xuICAgIH1cbiAgfTtcbjwvc2NyaXB0PlxuIiwiPHRlbXBsYXRlPlxuICA8b25zLWNhcm91c2VsXG4gICAgOm9uLXN3aXBlLnByb3A9XCJvblN3aXBlXCJcbiAgICA6aW5pdGlhbC1pbmRleD1cImluZGV4XCJcbiAgICBAcG9zdGNoYW5nZS5zZWxmPVwiJGVtaXQoJ3VwZGF0ZTppbmRleCcsICRldmVudC5hY3RpdmVJbmRleClcIlxuICAgIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIlxuICA+XG4gICAgPGRpdj5cbiAgICAgIDxzbG90Pjwvc2xvdD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2PjwvZGl2PlxuICA8L29ucy1jYXJvdXNlbD5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLWNhcm91c2VsJztcbiAgaW1wb3J0IHsgaGFzT3B0aW9ucywgZGVyaXZlRXZlbnRzIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLWNhcm91c2VsJyxcbiAgICBtaXhpbnM6IFtoYXNPcHRpb25zLCBkZXJpdmVFdmVudHNdLFxuXG4gICAgcHJvcHM6IHtcbiAgICAgIGluZGV4OiB7XG4gICAgICAgIHR5cGU6IE51bWJlclxuICAgICAgfSxcbiAgICAgIG9uU3dpcGU6IHtcbiAgICAgICAgdHlwZTogRnVuY3Rpb25cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgd2F0Y2g6IHtcbiAgICAgIGluZGV4KCkge1xuICAgICAgICBpZiAodGhpcy5pbmRleCAhPT0gdGhpcy4kZWwuZ2V0QWN0aXZlSW5kZXgoKSkge1xuICAgICAgICAgIHRoaXMuJGVsLnNldEFjdGl2ZUluZGV4KHRoaXMuaW5kZXgsIHRoaXMub3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG48L3NjcmlwdD5cbiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy10YWIgOmFjdGl2ZT1cImFjdGl2ZVwiIDpvbi1jbGljay5wcm9wPVwiYWN0aW9uXCI+XG4gIDwvb25zLXRhYj5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLXRhYic7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy10YWInLFxuICAgIGluamVjdDogWyd0YWJiYXInXSxcblxuICAgIHByb3BzOiB7XG4gICAgICBwYWdlOiB7IH0sXG4gICAgICBwcm9wczogeyB9LFxuICAgICAgYWN0aXZlOiB7XG4gICAgICAgIHR5cGU6IEJvb2xlYW5cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgbWV0aG9kczoge1xuICAgICAgYWN0aW9uKCkge1xuICAgICAgICBsZXQgcnVuRGVmYXVsdCA9IHRydWU7XG4gICAgICAgIHRoaXMuJGVtaXQoJ2NsaWNrJywgeyBwcmV2ZW50RGVmYXVsdDogKCkgPT4gcnVuRGVmYXVsdCA9IGZhbHNlIH0pO1xuXG4gICAgICAgIGlmIChydW5EZWZhdWx0KSB7XG4gICAgICAgICAgdGhpcy50YWJiYXIuJGVsLnNldEFjdGl2ZVRhYih0aGlzLiRlbC5pbmRleCwgeyByZWplY3Q6IGZhbHNlLCAuLi50aGlzLnRhYmJhci5vcHRpb25zIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHdhdGNoOiB7XG4gICAgICBhY3RpdmUoKSB7XG4gICAgICAgIHRoaXMuJGVsLnNldEFjdGl2ZSh0aGlzLmFjdGl2ZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuPC9zY3JpcHQ+XG4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtdGFiYmFyXG4gICAgOm9uLXN3aXBlLnByb3A9XCJvblN3aXBlXCJcbiAgICA6YWN0aXZlSW5kZXg9XCJpbmRleFwiXG4gICAgOm1vZGlmaWVyPVwibm9ybWFsaXplZE1vZGlmaWVyXCJcbiAgICB2LW9uPVwidW5yZWNvZ25pemVkTGlzdGVuZXJzXCJcbiAgICBAcHJlY2hhbmdlLnNlbGY9XCIkbmV4dFRpY2soKCkgPT4gISRldmVudC5kZXRhaWwuY2FuY2VsZWQgJiYgJGVtaXQoJ3VwZGF0ZTppbmRleCcsICRldmVudC5pbmRleCkpXCJcbiAgPlxuICAgIDxkaXYgY2xhc3M9XCJ0YWJiYXJfX2NvbnRlbnRcIj5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxzbG90IG5hbWU9XCJwYWdlc1wiPlxuICAgICAgICAgIDxjb21wb25lbnQgdi1mb3I9XCJ0YWIgaW4gdGFic1wiIHYtYmluZD1cInRhYi5wcm9wc1wiIDppcz1cInRhYi5wYWdlXCIgOmtleT1cIih0YWIucGFnZS5rZXkgfHwgdGFiLnBhZ2UubmFtZSB8fCBfdGFiS2V5KHRhYikpXCIgdi1vbj1cInVucmVjb2duaXplZExpc3RlbmVyc1wiPjwvY29tcG9uZW50PlxuICAgICAgICA8L3Nsb3Q+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXY+PC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInRhYmJhclwiIDpzdHlsZT1cInRhYmJhclN0eWxlXCI+XG4gICAgICA8c2xvdD5cbiAgICAgICAgPHYtb25zLXRhYiB2LWZvcj1cInRhYiBpbiB0YWJzXCIgdi1iaW5kPVwidGFiXCIgOmtleT1cIl90YWJLZXkodGFiKVwiPjwvdi1vbnMtdGFiPlxuICAgICAgPC9zbG90PlxuICAgICAgPGRpdiBjbGFzcz1cInRhYmJhcl9fYm9yZGVyXCI+PC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvb25zLXRhYmJhcj5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLXRhYmJhcic7XG4gIGltcG9ydCB7IGRlcml2ZUV2ZW50cywgaGFzT3B0aW9ucywgaGlkYWJsZSwgc2VsZlByb3ZpZGVyLCBtb2RpZmllciB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy10YWJiYXInLFxuICAgIG1peGluczogW2Rlcml2ZUV2ZW50cywgaGFzT3B0aW9ucywgaGlkYWJsZSwgc2VsZlByb3ZpZGVyLCBtb2RpZmllcl0sXG5cbiAgICBwcm9wczoge1xuICAgICAgaW5kZXg6IHtcbiAgICAgICAgdHlwZTogTnVtYmVyXG4gICAgICB9LFxuICAgICAgdGFiczoge1xuICAgICAgICB0eXBlOiBBcnJheSxcbiAgICAgICAgdmFsaWRhdG9yKHZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlLmV2ZXJ5KHRhYiA9PiBbJ2ljb24nLCAnbGFiZWwnLCAncGFnZSddLnNvbWUocHJvcCA9PiAhIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFiLCBwcm9wKSkpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb25Td2lwZToge1xuICAgICAgICB0eXBlOiBGdW5jdGlvblxuICAgICAgfSxcbiAgICAgIHRhYmJhclN0eWxlOiB7XG4gICAgICAgIHR5cGU6IG51bGxcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgbWV0aG9kczoge1xuICAgICAgX3RhYktleSh0YWIpIHtcbiAgICAgICAgcmV0dXJuIHRhYi5rZXkgfHwgdGFiLmxhYmVsIHx8IHRhYi5pY29uO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICB3YXRjaDoge1xuICAgICAgaW5kZXgoKSB7XG4gICAgICAgIGlmICh0aGlzLmluZGV4ICE9PSB0aGlzLiRlbC5nZXRBY3RpdmVUYWJJbmRleCgpKSB7XG4gICAgICAgICAgdGhpcy4kZWwuc2V0QWN0aXZlVGFiKHRoaXMuaW5kZXgsIHsgcmVqZWN0OiBmYWxzZSwgLi4udGhpcy5vcHRpb25zIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuPC9zY3JpcHQ+XG4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtYmFjay1idXR0b24gOm9uLWNsaWNrLnByb3A9XCJhY3Rpb25cIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLWJhY2stYnV0dG9uPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtYmFjay1idXR0b24nO1xuICBpbXBvcnQgeyBtb2RpZmllciB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy1iYWNrLWJ1dHRvbicsXG4gICAgaW5qZWN0OiBbJ25hdmlnYXRvciddLFxuICAgIG1peGluczogW21vZGlmaWVyXSxcblxuICAgIG1ldGhvZHM6IHtcbiAgICAgIGFjdGlvbigpIHtcbiAgICAgICAgbGV0IHJ1bkRlZmF1bHQgPSB0cnVlO1xuICAgICAgICB0aGlzLiRlbWl0KCdjbGljaycsIHsgcHJldmVudERlZmF1bHQ6ICgpID0+IHJ1bkRlZmF1bHQgPSBmYWxzZSB9KTtcblxuICAgICAgICBpZiAocnVuRGVmYXVsdCAmJiB0aGlzLm5hdmlnYXRvci5wYWdlU3RhY2subGVuZ3RoID4gMSkge1xuICAgICAgICAgIHRoaXMubmF2aWdhdG9yLnBvcFBhZ2UoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbjwvc2NyaXB0PlxuIiwiPHRlbXBsYXRlPlxuICA8b25zLW5hdmlnYXRvciBAcG9zdHBvcC5zZWxmPVwiX2NoZWNrU3dpcGVcIiA6b3B0aW9ucy5wcm9wPVwib3B0aW9uc1wiIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIj5cbiAgICA8c2xvdD5cbiAgICAgIDxjb21wb25lbnRcbiAgICAgICAgdi1mb3I9XCJwYWdlIGluIHBhZ2VTdGFja1wiXG4gICAgICAgIDppcz1cInBhZ2VcIlxuICAgICAgICA6a2V5PVwicGFnZS5rZXkgfHwgcGFnZS5uYW1lXCJcbiAgICAgICAgdi1vbj1cInVucmVjb2duaXplZExpc3RlbmVyc1wiXG4gICAgICAgIHYtYmluZD1cInBhZ2Uub25zTmF2aWdhdG9yUHJvcHNcIlxuICAgICAgPjwvY29tcG9uZW50PlxuICAgIDwvc2xvdD5cbiAgPC9vbnMtbmF2aWdhdG9yPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtbmF2aWdhdG9yJztcbiAgaW1wb3J0IHsgaGFzT3B0aW9ucywgc2VsZlByb3ZpZGVyLCBkZXJpdmVFdmVudHMsIGRlcml2ZURCQiB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy1uYXZpZ2F0b3InLFxuICAgIG1peGluczogW2hhc09wdGlvbnMsIHNlbGZQcm92aWRlciwgZGVyaXZlRXZlbnRzLCBkZXJpdmVEQkJdLFxuXG4gICAgcHJvcHM6IHtcbiAgICAgIHBhZ2VTdGFjazoge1xuICAgICAgICB0eXBlOiBBcnJheSxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWVcbiAgICAgIH0sXG4gICAgICBwb3BQYWdlOiB7XG4gICAgICAgIHR5cGU6IEZ1bmN0aW9uLFxuICAgICAgICBkZWZhdWx0KCkge1xuICAgICAgICAgIHRoaXMucGFnZVN0YWNrLnBvcCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIG1ldGhvZHM6IHtcbiAgICAgIGlzUmVhZHkoKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KCdfcmVhZHknKSAmJiB0aGlzLl9yZWFkeSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fcmVhZHk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgfSxcbiAgICAgIG9uRGV2aWNlQmFja0J1dHRvbihldmVudCkge1xuICAgICAgICBpZiAodGhpcy5wYWdlU3RhY2subGVuZ3RoID4gMSkge1xuICAgICAgICAgIHRoaXMucG9wUGFnZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGV2ZW50LmNhbGxQYXJlbnRIYW5kbGVyKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBfZmluZFNjcm9sbFBhZ2UocGFnZSkge1xuICAgICAgICBjb25zdCBuZXh0UGFnZSA9IHBhZ2UuX2NvbnRlbnRFbGVtZW50LmNoaWxkcmVuLmxlbmd0aCA9PT0gMVxuICAgICAgICAgICYmIHRoaXMuJG9ucy5fb25zLl91dGlsLmdldFRvcFBhZ2UocGFnZS5fY29udGVudEVsZW1lbnQuY2hpbGRyZW5bMF0pO1xuICAgICAgICByZXR1cm4gbmV4dFBhZ2UgPyB0aGlzLl9maW5kU2Nyb2xsUGFnZShuZXh0UGFnZSkgOiBwYWdlO1xuICAgICAgfSxcbiAgICAgIF9lYWNoUGFnZShzdGFydCwgZW5kLCBjYikge1xuICAgICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgICAgIGNiKHRoaXMuJGNoaWxkcmVuW2ldLiRlbCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBfcmVhdHRhY2hQYWdlKHBhZ2VFbGVtZW50LCBwb3NpdGlvbiA9IG51bGwsIHJlc3RvcmVTY3JvbGwpIHtcbiAgICAgICAgdGhpcy4kZWwuaW5zZXJ0QmVmb3JlKHBhZ2VFbGVtZW50LCBwb3NpdGlvbik7XG4gICAgICAgIHJlc3RvcmVTY3JvbGwgaW5zdGFuY2VvZiBGdW5jdGlvbiAmJiByZXN0b3JlU2Nyb2xsKCk7XG4gICAgICAgIHBhZ2VFbGVtZW50Ll9pc1Nob3duID0gdHJ1ZTtcbiAgICAgIH0sXG4gICAgICBfcmVkZXRhY2hQYWdlKHBhZ2VFbGVtZW50KSB7XG4gICAgICAgIHBhZ2VFbGVtZW50Ll9kZXN0cm95KCk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgIH0sXG4gICAgICBfYW5pbWF0ZSh7IGxhc3RMZW5ndGgsIGN1cnJlbnRMZW5ndGgsIGxhc3RUb3BQYWdlLCBjdXJyZW50VG9wUGFnZSwgcmVzdG9yZVNjcm9sbCB9KSB7XG4gICAgICAgIGNvbnN0IHB1c2hlZE9wdGlvbnMgPSB0aGlzLnBhZ2VTdGFja1t0aGlzLnBhZ2VTdGFjay5sZW5ndGggLSAxXS5vbnNOYXZpZ2F0b3JPcHRpb25zXG4gICAgICAgICAgfHwgY3VycmVudFRvcFBhZ2UuX192dWVfXy5vbnNOYXZpZ2F0b3JPcHRpb25zXG4gICAgICAgICAgfHwge307XG5cbiAgICAgICAgLy8gUHVzaFxuICAgICAgICBpZiAoY3VycmVudExlbmd0aCA+IGxhc3RMZW5ndGgpIHtcbiAgICAgICAgICBsZXQgaXNSZWF0dGFjaGVkID0gZmFsc2U7XG4gICAgICAgICAgaWYgKGxhc3RUb3BQYWdlLnBhcmVudEVsZW1lbnQgIT09IHRoaXMuJGVsKSB7XG4gICAgICAgICAgICB0aGlzLl9yZWF0dGFjaFBhZ2UobGFzdFRvcFBhZ2UsIHRoaXMuJGVsLmNoaWxkcmVuW2xhc3RMZW5ndGggLSAxXSwgcmVzdG9yZVNjcm9sbCk7XG4gICAgICAgICAgICBpc1JlYXR0YWNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgbGFzdExlbmd0aC0tO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuX2VhY2hQYWdlKGxhc3RMZW5ndGgsIGN1cnJlbnRMZW5ndGgsIGVsID0+IHsgZWwuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nIH0pO1xuICAgICAgICAgIHRoaXMuX2VhY2hQYWdlKGxhc3RMZW5ndGgsIGN1cnJlbnRMZW5ndGggLSAxLCBlbCA9PiB7IGVsLnB1c2hlZE9wdGlvbnMgPSBwdXNoZWRPcHRpb25zIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIHRoaXMuJGVsLl9wdXNoUGFnZSh7IC4uLnB1c2hlZE9wdGlvbnMsIGxlYXZlUGFnZTogbGFzdFRvcFBhZ2UgfSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgc2V0SW1tZWRpYXRlKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lYWNoUGFnZShsYXN0TGVuZ3RoLCBjdXJyZW50TGVuZ3RoLCBlbCA9PiB7IGVsLnN0eWxlLnZpc2liaWxpdHkgPSAnJyB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9lYWNoUGFnZShsYXN0TGVuZ3RoIC0gMSwgY3VycmVudExlbmd0aCAtIDEsIGVsID0+IHsgZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJyB9KTtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgaWYgKGlzUmVhdHRhY2hlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlZGV0YWNoUGFnZShsYXN0VG9wUGFnZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUG9wXG4gICAgICAgIGlmIChjdXJyZW50TGVuZ3RoIDwgbGFzdExlbmd0aCkge1xuICAgICAgICAgIHRoaXMuX3JlYXR0YWNoUGFnZShsYXN0VG9wUGFnZSwgbnVsbCwgcmVzdG9yZVNjcm9sbCk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuJGVsLl9wb3BQYWdlKHsgfSwgKCkgPT4gdGhpcy5fcmVkZXRhY2hQYWdlKGxhc3RUb3BQYWdlKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXBsYWNlIHBhZ2VcbiAgICAgICAgY3VycmVudFRvcFBhZ2Uuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICB0aGlzLl9yZWF0dGFjaFBhZ2UobGFzdFRvcFBhZ2UsIGN1cnJlbnRUb3BQYWdlLCByZXN0b3JlU2Nyb2xsKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuJGVsLl9wdXNoUGFnZSh7IC4uLnB1c2hlZE9wdGlvbnMsIF9yZXBsYWNlUGFnZTogdHJ1ZSB9KVxuICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMuX3JlZGV0YWNoUGFnZShsYXN0VG9wUGFnZSkpO1xuICAgICAgfSxcbiAgICAgIF9jaGVja1N3aXBlKGV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLiRlbC5oYXNBdHRyaWJ1dGUoJ3N3aXBlYWJsZScpICYmXG4gICAgICAgICAgZXZlbnQubGVhdmVQYWdlICE9PSB0aGlzLiRlbC5sYXN0Q2hpbGQgJiYgZXZlbnQubGVhdmVQYWdlID09PSB0aGlzLiRjaGlsZHJlblt0aGlzLiRjaGlsZHJlbi5sZW5ndGggLSAxXS4kZWxcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5wb3BQYWdlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgd2F0Y2g6IHtcbiAgICAgIHBhZ2VTdGFjayhhZnRlciwgYmVmb3JlKSB7XG4gICAgICAgIGlmICh0aGlzLiRlbC5oYXNBdHRyaWJ1dGUoJ3N3aXBlYWJsZScpICYmIHRoaXMuJGNoaWxkcmVuLmxlbmd0aCAhPT0gdGhpcy4kZWwuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJvcFdhc011dGF0ZWQgPSBhZnRlciA9PT0gYmVmb3JlOyAvLyBDYW4gYmUgbXV0YXRlZCBvciByZXBsYWNlZFxuICAgICAgICBjb25zdCBsYXN0VG9wUGFnZSA9IHRoaXMuJGNoaWxkcmVuW3RoaXMuJGNoaWxkcmVuLmxlbmd0aCAtIDFdLiRlbDtcbiAgICAgICAgY29uc3Qgc2Nyb2xsRWxlbWVudCA9IHRoaXMuX2ZpbmRTY3JvbGxQYWdlKGxhc3RUb3BQYWdlKTtcbiAgICAgICAgY29uc3Qgc2Nyb2xsVmFsdWUgPSBzY3JvbGxFbGVtZW50LnNjcm9sbFRvcCB8fCAwO1xuXG4gICAgICAgIHRoaXMuX3BhZ2VTdGFja1VwZGF0ZSA9IHtcbiAgICAgICAgICBsYXN0VG9wUGFnZSxcbiAgICAgICAgICBsYXN0TGVuZ3RoOiBwcm9wV2FzTXV0YXRlZCA/IHRoaXMuJGNoaWxkcmVuLmxlbmd0aCA6IGJlZm9yZS5sZW5ndGgsXG4gICAgICAgICAgY3VycmVudExlbmd0aDogIXByb3BXYXNNdXRhdGVkICYmIGFmdGVyLmxlbmd0aCxcbiAgICAgICAgICByZXN0b3JlU2Nyb2xsOiAoKSA9PiBzY3JvbGxFbGVtZW50LnNjcm9sbFRvcCA9IHNjcm9sbFZhbHVlXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gdGhpcy4kbmV4dFRpY2soKCkgPT4geyB9KTsgLy8gV2FpdHMgdG9vIGxvbmcsIHVwZGF0ZWQoKSBob29rIGlzIGZhc3RlciBhbmQgcHJldmVudHMgZmxpY2tlcmluZ3NcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlZCgpIHtcbiAgICAgIGlmICh0aGlzLl9wYWdlU3RhY2tVcGRhdGUpIHtcbiAgICAgICAgbGV0IGN1cnJlbnRUb3BQYWdlID0gdGhpcy4kY2hpbGRyZW5bdGhpcy4kY2hpbGRyZW4ubGVuZ3RoIC0gMV0uJGVsO1xuICAgICAgICBsZXQgeyBsYXN0VG9wUGFnZSwgY3VycmVudExlbmd0aCB9ID0gdGhpcy5fcGFnZVN0YWNrVXBkYXRlO1xuICAgICAgICBjb25zdCB7IGxhc3RMZW5ndGgsIHJlc3RvcmVTY3JvbGwgfSA9IHRoaXMuX3BhZ2VTdGFja1VwZGF0ZTtcbiAgICAgICAgY3VycmVudExlbmd0aCA9IGN1cnJlbnRMZW5ndGggPT09IGZhbHNlID8gdGhpcy4kY2hpbGRyZW4ubGVuZ3RoIDogY3VycmVudExlbmd0aDtcblxuICAgICAgICBpZiAoY3VycmVudFRvcFBhZ2UgIT09IGxhc3RUb3BQYWdlKSB7XG4gICAgICAgICAgdGhpcy5fcmVhZHkgPSB0aGlzLl9hbmltYXRlKHsgbGFzdExlbmd0aCwgY3VycmVudExlbmd0aCwgbGFzdFRvcFBhZ2UsIGN1cnJlbnRUb3BQYWdlLCByZXN0b3JlU2Nyb2xsIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRMZW5ndGggIT09IGxhc3RMZW5ndGgpIHtcbiAgICAgICAgICBjdXJyZW50VG9wUGFnZS51cGRhdGVCYWNrQnV0dG9uKGN1cnJlbnRMZW5ndGggPiAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxhc3RUb3BQYWdlID0gY3VycmVudFRvcFBhZ2UgPSB0aGlzLl9wYWdlU3RhY2tVcGRhdGUgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbjwvc2NyaXB0PlxuIiwiPHRlbXBsYXRlPlxuICA8b25zLXNwbGl0dGVyLXNpZGUgdi1vbj1cInVucmVjb2duaXplZExpc3RlbmVyc1wiPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9vbnMtc3BsaXR0ZXItc2lkZT5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLXNwbGl0dGVyLXNpZGUnO1xuICBpbXBvcnQgeyBoYXNPcHRpb25zLCBkZXJpdmVFdmVudHMgfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtc3BsaXR0ZXItc2lkZScsXG4gICAgbWl4aW5zOiBbaGFzT3B0aW9ucywgZGVyaXZlRXZlbnRzXSxcblxuICAgIHByb3BzOiB7XG4gICAgICBvcGVuOiB7XG4gICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgICAgfVxuICAgIH0sXG5cbiAgICBtZXRob2RzOiB7XG4gICAgICBhY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuX3Nob3VsZFVwZGF0ZSgpICYmIHRoaXMuJGVsW3RoaXMub3BlbiA/ICdvcGVuJyA6ICdjbG9zZSddLmNhbGwodGhpcy4kZWwsIHRoaXMub3B0aW9ucykuY2F0Y2goKCkgPT4ge30pO1xuICAgICAgfSxcbiAgICAgIF9zaG91bGRVcGRhdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wZW4gIT09IHVuZGVmaW5lZCAmJiB0aGlzLm9wZW4gIT09IHRoaXMuJGVsLmlzT3BlbjtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgd2F0Y2g6IHtcbiAgICAgIG9wZW4oKSB7XG4gICAgICAgIHRoaXMuYWN0aW9uKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIG1vdW50ZWQoKSB7XG4gICAgICB0aGlzLiRvbihbJ3Bvc3RvcGVuJywgJ3Bvc3RjbG9zZScsICdtb2RlY2hhbmdlJ10sICgpID0+IHRoaXMuX3Nob3VsZFVwZGF0ZSgpICYmIHRoaXMuJGVtaXQoJ3VwZGF0ZTpvcGVuJywgdGhpcy4kZWwuaXNPcGVuKSk7XG5cbiAgICAgIHRoaXMuYWN0aW9uKCk7XG4gICAgfVxuICB9O1xuPC9zY3JpcHQ+XG4iLCI8dGVtcGxhdGU+XG4gIDwhLS0gVGhpcyBlbGVtZW50IGlzIHVzZWxlc3MgZXhjZXB0IGZvciB0aGUgZGVzdHJveSBwYXJ0IC0tPlxuICA8b25zLWxhenktcmVwZWF0Pjwvb25zLWxhenktcmVwZWF0PlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbmltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLWxhenktcmVwZWF0JztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAndi1vbnMtbGF6eS1yZXBlYXQnLFxuXG4gIHByb3BzOiB7XG4gICAgcmVuZGVySXRlbToge1xuICAgICAgdHlwZTogRnVuY3Rpb24sXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIHZhbGlkYXRvcih2YWx1ZSkge1xuICAgICAgICBjb25zdCBjb21wb25lbnQgPSB2YWx1ZSgwKTtcbiAgICAgICAgaWYgKGNvbXBvbmVudC5faXNWdWUgJiYgIWNvbXBvbmVudC5faXNNb3VudGVkKSB7XG4gICAgICAgICAgY29tcG9uZW50LiRkZXN0cm95KCk7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0sXG4gICAgbGVuZ3RoOiB7XG4gICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICByZXF1aXJlZDogdHJ1ZVxuICAgIH0sXG4gICAgY2FsY3VsYXRlSXRlbUhlaWdodDoge1xuICAgICAgdHlwZTogRnVuY3Rpb24sXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcbiAgICB9XG4gIH0sXG5cbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcHJvdmlkZXI6IG51bGxcbiAgICB9O1xuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBfc2V0dXAoKSB7XG4gICAgICB0aGlzLnByb3ZpZGVyICYmIHRoaXMucHJvdmlkZXIuZGVzdHJveSgpO1xuXG4gICAgICBjb25zdCBkZWxlZ2F0ZSA9IG5ldyB0aGlzLiRvbnMuX29ucy5faW50ZXJuYWwuTGF6eVJlcGVhdERlbGVnYXRlKHtcbiAgICAgICAgY2FsY3VsYXRlSXRlbUhlaWdodDogdGhpcy5jYWxjdWxhdGVJdGVtSGVpZ2h0LFxuICAgICAgICBjcmVhdGVJdGVtQ29udGVudDogaSA9PiB0aGlzLnJlbmRlckl0ZW0oaSkuJG1vdW50KCkuJGVsLFxuICAgICAgICBkZXN0cm95SXRlbTogKGksIHsgZWxlbWVudCB9KSA9PiBlbGVtZW50Ll9fdnVlX18uJGRlc3Ryb3koKSxcbiAgICAgICAgY291bnRJdGVtczogKCkgPT4gdGhpcy5sZW5ndGhcbiAgICAgIH0sIG51bGwpO1xuXG4gICAgICB0aGlzLnByb3ZpZGVyID0gbmV3IHRoaXMuJG9ucy5fb25zLl9pbnRlcm5hbC5MYXp5UmVwZWF0UHJvdmlkZXIodGhpcy4kcGFyZW50LiRlbCwgZGVsZWdhdGUpO1xuICAgIH0sXG4gICAgcmVmcmVzaCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3ZpZGVyLnJlZnJlc2goKTtcbiAgICB9XG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICByZW5kZXJJdGVtKCkge1xuICAgICAgdGhpcy5fc2V0dXAoKTtcbiAgICB9LFxuICAgIGxlbmd0aCgpIHtcbiAgICAgIHRoaXMuX3NldHVwKCk7XG4gICAgfSxcbiAgICBjYWxjdWxhdGVJdGVtSGVpZ2h0KCkge1xuICAgICAgdGhpcy5fc2V0dXAoKTtcbiAgICB9XG4gIH0sXG5cbiAgbW91bnRlZCgpIHtcbiAgICB0aGlzLl9zZXR1cCgpO1xuICAgIHRoaXMuJHZub2RlLmNvbnRleHQuJG9uKCdyZWZyZXNoJywgdGhpcy5yZWZyZXNoKTtcbiAgfSxcblxuICBiZWZvcmVEZXN0cm95KCkge1xuICAgIHRoaXMuJHZub2RlLmNvbnRleHQuJG9mZigncmVmcmVzaCcsIHRoaXMucmVmcmVzaCk7XG5cbiAgICAvLyBUaGlzIHdpbGwgZGVzdHJveSB0aGUgcHJvdmlkZXIgb25jZSB0aGUgcmVuZGVyZWQgZWxlbWVudFxuICAgIC8vIGlzIGRldGFjaGVkIChkZXRhY2hlZENhbGxiYWNrKS4gVGhlcmVmb3JlLCBhbmltYXRpb25zXG4gICAgLy8gaGF2ZSB0aW1lIHRvIGZpbmlzaCBiZWZvcmUgZWxlbWVudHMgc3RhcnQgdG8gZGlzYXBwZWFyLlxuICAgIC8vIEl0IGNhbm5vdCBiZSBzZXQgZWFybGllciBpbiBvcmRlciB0byBwcmV2ZW50IGFjY2lkZW50YWxcbiAgICAvLyBkZXN0cm95cyBpZiB0aGlzIGVsZW1lbnQgaXMgcmV0YWNoZWQgYnkgc29tZXRoaW5nIGVsc2UuXG4gICAgdGhpcy4kZWwuX2xhenlSZXBlYXRQcm92aWRlciA9IHRoaXMucHJvdmlkZXI7XG4gICAgdGhpcy5wcm92aWRlciA9IG51bGw7XG4gIH1cbn07XG48L3NjcmlwdD5cbiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy1zZWxlY3Qgdi1vbj1cIiRsaXN0ZW5lcnNcIiA6bW9kaWZpZXI9XCJub3JtYWxpemVkTW9kaWZpZXJcIj5cbiAgICA8c2VsZWN0IHYtbW9kZWw9XCJzZWxlY3RlZFZhbHVlXCI+XG4gICAgICA8c2xvdD48L3Nsb3Q+XG4gICAgPC9zZWxlY3Q+XG4gIDwvb25zLXNlbGVjdD5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLXNlbGVjdCc7XG4gIGltcG9ydCB7IG1vZGlmaWVyIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLXNlbGVjdCcsXG4gICAgbWl4aW5zOiBbbW9kaWZpZXJdLFxuICAgIG1vZGVsOiB7XG4gICAgICBwcm9wOiAnbW9kZWxQcm9wJyxcbiAgICAgIGV2ZW50OiAnbW9kZWxFdmVudCdcbiAgICB9LFxuICAgIHByb3BzOiB7XG4gICAgICBtb2RlbFByb3A6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBtb2RlbEV2ZW50OiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgZGVmYXVsdDogJ2lucHV0J1xuICAgICAgfVxuICAgIH0sXG4gICAgY29tcHV0ZWQ6IHtcbiAgICAgIHNlbGVjdGVkVmFsdWU6IHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLm1vZGVsUHJvcDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0KHZhbCkge1xuICAgICAgICAgIHRoaXMuJGVtaXQoJ21vZGVsRXZlbnQnLCB2YWwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuPC9zY3JpcHQ+XG4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtc2VnbWVudCA6YWN0aXZlLWluZGV4PVwiaW5kZXhcIiBAcG9zdGNoYW5nZS5zZWxmPVwiJGVtaXQoJ3VwZGF0ZTppbmRleCcsICRldmVudC5pbmRleClcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLXNlZ21lbnQ+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1zZWdtZW50JztcbiAgaW1wb3J0IHsgZGVyaXZlRXZlbnRzIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLXNlZ21lbnQnLFxuICAgIG1peGluczogW2Rlcml2ZUV2ZW50c10sXG5cbiAgICBwcm9wczoge1xuICAgICAgaW5kZXg6IHtcbiAgICAgICAgdHlwZTogTnVtYmVyXG4gICAgICB9XG4gICAgfSxcblxuICAgIHdhdGNoOiB7XG4gICAgICBpbmRleCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaW5kZXggIT09IHRoaXMuJGVsLmdldEFjdGl2ZUJ1dHRvbkluZGV4KCkpIHtcbiAgICAgICAgICB0aGlzLiRlbC5zZXRBY3RpdmVCdXR0b24odGhpcy5pbmRleCwgeyByZWplY3Q6IGZhbHNlIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuPC9zY3JpcHQ+XG4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtcHVsbC1ob29rXG4gICAgOm9uLWFjdGlvbi5wcm9wPVwiYWN0aW9uXCJcbiAgICA6b24tcHVsbC5wcm9wPVwib25QdWxsXCJcbiAgICB2LW9uPVwidW5yZWNvZ25pemVkTGlzdGVuZXJzXCJcbiAgPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9vbnMtcHVsbC1ob29rPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtcHVsbC1ob29rJztcbiAgaW1wb3J0IHsgZGVyaXZlRXZlbnRzIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLXB1bGwtaG9vaycsXG4gICAgbWl4aW5zOiBbZGVyaXZlRXZlbnRzXSxcblxuICAgIHByb3BzOiB7XG4gICAgICBhY3Rpb246IHtcbiAgICAgICAgdHlwZTogRnVuY3Rpb25cbiAgICAgIH0sXG4gICAgICBvblB1bGw6IHtcbiAgICAgICAgdHlwZTogRnVuY3Rpb25cbiAgICAgIH1cbiAgICB9XG4gIH07XG48L3NjcmlwdD5cbiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy1wYWdlXG4gICAgOm9uLWluZmluaXRlLXNjcm9sbC5wcm9wPVwiaW5maW5pdGVTY3JvbGxcIlxuICAgIDptb2RpZmllcj1cIm5vcm1hbGl6ZWRNb2RpZmllclwiXG4gICAgdi1vbj1cInVucmVjb2duaXplZExpc3RlbmVyc1wiXG4gID5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLXBhZ2U+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1wYWdlJztcbiAgaW1wb3J0IHsgZGVyaXZlRXZlbnRzLCBkZXJpdmVEQkIsIG1vZGlmaWVyIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLXBhZ2UnLFxuICAgIG1peGluczogW2Rlcml2ZUV2ZW50cywgZGVyaXZlREJCLCBtb2RpZmllcl0sXG5cbiAgICBwcm9wczoge1xuICAgICAgaW5maW5pdGVTY3JvbGw6IHtcbiAgICAgICAgdHlwZTogRnVuY3Rpb25cbiAgICAgIH1cbiAgICB9XG4gIH07XG48L3NjcmlwdD5cbiIsIi8vIEdlbmVyaWMgY29tcG9uZW50czpcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc1Rvb2xiYXIgfSBmcm9tICcuL1ZPbnNUb29sYmFyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc0JvdHRvbVRvb2xiYXIgfSBmcm9tICcuL1ZPbnNCb3R0b21Ub29sYmFyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc1Rvb2xiYXJCdXR0b24gfSBmcm9tICcuL1ZPbnNUb29sYmFyQnV0dG9uJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc0FsZXJ0RGlhbG9nQnV0dG9uIH0gZnJvbSAnLi9WT25zQWxlcnREaWFsb2dCdXR0b24nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zQnV0dG9uIH0gZnJvbSAnLi9WT25zQnV0dG9uJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc0ljb24gfSBmcm9tICcuL1ZPbnNJY29uJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc0NhcmQgfSBmcm9tICcuL1ZPbnNDYXJkJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc0xpc3QgfSBmcm9tICcuL1ZPbnNMaXN0JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc0xpc3RJdGVtIH0gZnJvbSAnLi9WT25zTGlzdEl0ZW0nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zTGlzdFRpdGxlIH0gZnJvbSAnLi9WT25zTGlzdFRpdGxlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc0xpc3RIZWFkZXIgfSBmcm9tICcuL1ZPbnNMaXN0SGVhZGVyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc1JpcHBsZSB9IGZyb20gJy4vVk9uc1JpcHBsZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFZPbnNSb3cgfSBmcm9tICcuL1ZPbnNSb3cnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zQ29sIH0gZnJvbSAnLi9WT25zQ29sJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc1Byb2dyZXNzQmFyIH0gZnJvbSAnLi9WT25zUHJvZ3Jlc3NCYXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zUHJvZ3Jlc3NDaXJjdWxhciB9IGZyb20gJy4vVk9uc1Byb2dyZXNzQ2lyY3VsYXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zQ2Fyb3VzZWxJdGVtIH0gZnJvbSAnLi9WT25zQ2Fyb3VzZWxJdGVtJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc1NwbGl0dGVyTWFzayB9IGZyb20gJy4vVk9uc1NwbGl0dGVyTWFzayc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFZPbnNTcGxpdHRlckNvbnRlbnQgfSBmcm9tICcuL1ZPbnNTcGxpdHRlckNvbnRlbnQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zU3BsaXR0ZXIgfSBmcm9tICcuL1ZPbnNTcGxpdHRlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFZPbnNTd2l0Y2ggfSBmcm9tICcuL1ZPbnNTd2l0Y2gnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zQ2hlY2tib3ggfSBmcm9tICcuL1ZPbnNDaGVja2JveCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFZPbnNJbnB1dCB9IGZyb20gJy4vVk9uc0lucHV0JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc1NlYXJjaElucHV0IH0gZnJvbSAnLi9WT25zU2VhcmNoSW5wdXQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zUmFuZ2UgfSBmcm9tICcuL1ZPbnNSYW5nZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFZPbnNSYWRpbyB9IGZyb20gJy4vVk9uc1JhZGlvJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc0ZhYiB9IGZyb20gJy4vVk9uc0ZhYic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFZPbnNTcGVlZERpYWxJdGVtIH0gZnJvbSAnLi9WT25zU3BlZWREaWFsSXRlbSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFZPbnNEaWFsb2cgfSBmcm9tICcuL1ZPbnNEaWFsb2cnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zQWN0aW9uU2hlZXQgfSBmcm9tICcuL1ZPbnNBY3Rpb25TaGVldCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFZPbnNBY3Rpb25TaGVldEJ1dHRvbiB9IGZyb20gJy4vVk9uc0FjdGlvblNoZWV0QnV0dG9uJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc01vZGFsIH0gZnJvbSAnLi9WT25zTW9kYWwnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zVG9hc3QgfSBmcm9tICcuL1ZPbnNUb2FzdCc7XG5cbi8vIE1hbnVhbCBjb21wb25lbnRzOlxuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zUG9wb3ZlciB9IGZyb20gJy4vVk9uc1BvcG92ZXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zQWxlcnREaWFsb2cgfSBmcm9tICcuL1ZPbnNBbGVydERpYWxvZyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFZPbnNTcGVlZERpYWwgfSBmcm9tICcuL1ZPbnNTcGVlZERpYWwnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zQ2Fyb3VzZWwgfSBmcm9tICcuL1ZPbnNDYXJvdXNlbCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFZPbnNUYWIgfSBmcm9tICcuL1ZPbnNUYWInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zVGFiYmFyIH0gZnJvbSAnLi9WT25zVGFiYmFyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc0JhY2tCdXR0b24gfSBmcm9tICcuL1ZPbnNCYWNrQnV0dG9uJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc05hdmlnYXRvciB9IGZyb20gJy4vVk9uc05hdmlnYXRvcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFZPbnNTcGxpdHRlclNpZGUgfSBmcm9tICcuL1ZPbnNTcGxpdHRlclNpZGUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zTGF6eVJlcGVhdCB9IGZyb20gJy4vVk9uc0xhenlSZXBlYXQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zU2VsZWN0IH0gZnJvbSAnLi9WT25zU2VsZWN0JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc1NlZ21lbnQgfSBmcm9tICcuL1ZPbnNTZWdtZW50JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc1B1bGxIb29rIH0gZnJvbSAnLi9WT25zUHVsbEhvb2snO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zUGFnZSB9IGZyb20gJy4vVk9uc1BhZ2UnO1xuIiwiaW1wb3J0IG9ucyBmcm9tICdvbnNlbnVpJztcbmltcG9ydCBzZXR1cCBmcm9tICcuL3NldHVwJztcbmltcG9ydCAqIGFzIGNvbXBvbmVudHMgZnJvbSAnLi9jb21wb25lbnRzJztcblxuY29uc3QgJG9ucyA9IHNldHVwKG9ucyk7XG5cbiRvbnMuaW5zdGFsbCA9IChWdWUsIHBhcmFtcyA9IHt9KSA9PiB7XG4gIC8qKlxuICAgKiBSZWdpc3RlciBjb21wb25lbnRzIG9mIHZ1ZS1vbnNlbnVpLlxuICAgKi9cbiAgT2JqZWN0LmtleXMoY29tcG9uZW50cylcbiAgICAuZm9yRWFjaChrZXkgPT4gVnVlLmNvbXBvbmVudChjb21wb25lbnRzW2tleV0ubmFtZSwgY29tcG9uZW50c1trZXldKSk7XG5cbiAgLyoqXG4gICAqIEV4cG9zZSBvbnMgb2JqZWN0LlxuICAgKi9cbiAgVnVlLnByb3RvdHlwZS4kb25zID0gJG9ucztcbn07XG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuVnVlKSB7XG4gIHdpbmRvdy5WdWUudXNlKHsgaW5zdGFsbDogJG9ucy5pbnN0YWxsIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCAkb25zO1xuIl0sIm5hbWVzIjpbIm9ucyIsIk9iamVjdCIsImtleXMiLCJmaWx0ZXIiLCJzb21lIiwiayIsIm1hdGNoIiwidCIsInJlZHVjZSIsInIiLCJfb25zIiwiY2FwaXRhbGl6ZSIsInN0cmluZyIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJjYW1lbGl6ZSIsInRvTG93ZXJDYXNlIiwicmVwbGFjZSIsIm0iLCJsIiwiZXZlbnRUb0hhbmRsZXIiLCJuYW1lIiwiaGFuZGxlclRvUHJvcCIsIl9zZXR1cERCQiIsImRiYiIsImhhbmRsZXIiLCJjb21wb25lbnQiLCIkZWwiLCJfY2FsbGJhY2siLCJlIiwiY2FsbFBhcmVudEhhbmRsZXIiLCJydW5EZWZhdWx0IiwiJGVtaXQiLCJldmVudCIsIl9pc0RCQlNldHVwIiwiZGVyaXZlREJCIiwib25EZXZpY2VCYWNrQnV0dG9uIiwiZGVzdHJveSIsImRlcml2ZUV2ZW50cyIsIiRvcHRpb25zIiwiX2NvbXBvbmVudFRhZyIsIiRsaXN0ZW5lcnMiLCIkb25zIiwiZWxlbWVudHMiLCJldmVudHMiLCJpbmRleE9mIiwiX2hhbmRsZXJzIiwiY29uc3RydWN0b3IiLCJmb3JFYWNoIiwia2V5IiwidGFyZ2V0IiwidGVzdCIsInRhZ05hbWUiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIl90b2dnbGVWaXNpYmlsaXR5IiwidmlzaWJsZSIsImNhbGwiLCJub3JtYWxpemVkT3B0aW9ucyIsIm9wdGlvbnMiLCJfdGVsZXBvcnQiLCJfaXNEZXN0cm95ZWQiLCJwYXJlbnROb2RlIiwiZG9jdW1lbnQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJfdW5tb3VudCIsImhpZGUiLCJ0aGVuIiwicmVtb3ZlIiwiaGlkYWJsZSIsIkJvb2xlYW4iLCJ1bmRlZmluZWQiLCIkbmV4dFRpY2siLCJoYXNPcHRpb25zIiwic2VsZlByb3ZpZGVyIiwiZGlhbG9nQ2FuY2VsIiwiJG9uIiwicG9ydGFsIiwibW9kaWZpZXIiLCJTdHJpbmciLCJBcnJheSIsImlzQXJyYXkiLCJqb2luIiwiYWNjIiwidHJpbSIsIm1vZGVsIiwibW9kZWxJbnB1dCIsInByb3AiLCJOdW1iZXIiLCJ2YWx1ZSIsIl91cGRhdGVWYWx1ZSIsIl9vbk1vZGVsRXZlbnQiLCJtb2RlbENoZWNrYm94IiwiY2hlY2tlZCIsIm5ld1ZhbHVlIiwiaW5kZXgiLCJpbmNsdWRlZCIsImxlbmd0aCIsIm1vZGVsUmFkaW8iLCJyZW5kZXIiLCJleHBhbmRlZCIsImFjdGlvbiIsIl9pc1Z1ZSIsIkV2ZW50IiwiSFRNTEVsZW1lbnQiLCJub3JtYWxpemVkVGFyZ2V0IiwiZXZlcnkiLCJGdW5jdGlvbiIsInByZXZlbnREZWZhdWx0IiwidG9nZ2xlSXRlbXMiLCJvcGVuIiwiaXNPcGVuIiwiX3Nob3VsZFVwZGF0ZSIsIl91cGRhdGVUb2dnbGUiLCJnZXRBY3RpdmVJbmRleCIsInNldEFjdGl2ZUluZGV4IiwidGFiYmFyIiwic2V0QWN0aXZlVGFiIiwicmVqZWN0Iiwic2V0QWN0aXZlIiwiYWN0aXZlIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwidGFiIiwibGFiZWwiLCJpY29uIiwiZ2V0QWN0aXZlVGFiSW5kZXgiLCJuYXZpZ2F0b3IiLCJwYWdlU3RhY2siLCJwb3BQYWdlIiwicG9wIiwiaGFzT3duUHJvcGVydHkiLCJfcmVhZHkiLCJQcm9taXNlIiwicmVzb2x2ZSIsInBhZ2UiLCJuZXh0UGFnZSIsIl9jb250ZW50RWxlbWVudCIsImNoaWxkcmVuIiwiX3V0aWwiLCJnZXRUb3BQYWdlIiwiX2ZpbmRTY3JvbGxQYWdlIiwic3RhcnQiLCJlbmQiLCJjYiIsImkiLCIkY2hpbGRyZW4iLCJwYWdlRWxlbWVudCIsInBvc2l0aW9uIiwicmVzdG9yZVNjcm9sbCIsImluc2VydEJlZm9yZSIsIl9pc1Nob3duIiwiX2Rlc3Ryb3kiLCJsYXN0TGVuZ3RoIiwiY3VycmVudExlbmd0aCIsImxhc3RUb3BQYWdlIiwiY3VycmVudFRvcFBhZ2UiLCJwdXNoZWRPcHRpb25zIiwib25zTmF2aWdhdG9yT3B0aW9ucyIsIl9fdnVlX18iLCJpc1JlYXR0YWNoZWQiLCJwYXJlbnRFbGVtZW50IiwiX3JlYXR0YWNoUGFnZSIsIl9lYWNoUGFnZSIsInN0eWxlIiwidmlzaWJpbGl0eSIsIl9wdXNoUGFnZSIsImxlYXZlUGFnZSIsImRpc3BsYXkiLCJfcmVkZXRhY2hQYWdlIiwiX3BvcFBhZ2UiLCJfcmVwbGFjZVBhZ2UiLCJoYXNBdHRyaWJ1dGUiLCJsYXN0Q2hpbGQiLCJhZnRlciIsImJlZm9yZSIsInByb3BXYXNNdXRhdGVkIiwic2Nyb2xsRWxlbWVudCIsInNjcm9sbFZhbHVlIiwic2Nyb2xsVG9wIiwiX3BhZ2VTdGFja1VwZGF0ZSIsIl9hbmltYXRlIiwidXBkYXRlQmFja0J1dHRvbiIsImNhdGNoIiwiX2lzTW91bnRlZCIsIiRkZXN0cm95IiwicHJvdmlkZXIiLCJkZWxlZ2F0ZSIsIl9pbnRlcm5hbCIsIkxhenlSZXBlYXREZWxlZ2F0ZSIsImNhbGN1bGF0ZUl0ZW1IZWlnaHQiLCJyZW5kZXJJdGVtIiwiJG1vdW50IiwiZWxlbWVudCIsIkxhenlSZXBlYXRQcm92aWRlciIsIiRwYXJlbnQiLCJyZWZyZXNoIiwiX3NldHVwIiwiJHZub2RlIiwiY29udGV4dCIsIiRvZmYiLCJfbGF6eVJlcGVhdFByb3ZpZGVyIiwibW9kZWxQcm9wIiwidmFsIiwiZ2V0QWN0aXZlQnV0dG9uSW5kZXgiLCJzZXRBY3RpdmVCdXR0b24iLCJzZXR1cCIsImluc3RhbGwiLCJWdWUiLCJjb21wb25lbnRzIiwicHJvdG90eXBlIiwid2luZG93IiwidXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsWUFBZSxVQUFTQSxNQUFULEVBQWM7U0FDcEJDLE9BQU9DLElBQVAsQ0FBWUYsTUFBWixFQUNKRyxNQURJLENBQ0c7V0FBSyxD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
