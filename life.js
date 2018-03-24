(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    root.Life = factory();
  }
})(this, function () {
  /**
    * Life is a client-side Framework for Building Applications with no dependencies.
    *
    * @author Jan-Markus Langer
    * @license MIT
    */

  /**
    *
    * Variables
    *
    */

  /**
    * Life Version
    *
    * @type {String}
    */
  const version = '0.15.16-beta';

  /**
    * Array which stores the items that get observed
    *
    * @type {Array}
    */
  const observerList = [];

  /**
    * Array that stores the attribute keywords
    *
    * @type {Array}
    */
  const observeItems = ['observe-innerHTML', 'observe-value'];

  /**
    * Array that stores the event listener keywords
    *
    * @type {Array}
    */
  const eventList = [
    'click',
    'dblclick',
    'mousedown',
    'mouseleave',
    'mouseenter',
    'mousemove',
    'mouseover',
    'mouseout',
    'mouseup',
    'keydown',
    'keypress',
    'keyup',
    'resize',
    'change',
    'scroll',
    'submit',
  ];

  /**
    * Array that stores the different browsers
    *
    * @type {Array}
    */
  const browserList = [
    { name: 'Vivaldi', keywords: ['Vivaldi'] },
    { name: 'Edge', keywords: ['Edge/'] },
    { name: 'Chrome', keywords: ['Chrome'] },
    { name: 'Safari', keywords: ['Safari'] },
    { name: 'Internet Explorer', keywords: ['MSIE', 'Trident'] },
    { name: 'Firefox', keywords: ['Firefox'] },
    { name: 'Opera', keywords: ['Opera'] },
  ];

  /**
    * DebugMode
    * when debugMode is true then the console will log errors and warnings
    *
    * @private
    * @type {Boolean}
    */
  let debugMode = false;

  /**
    *
    * Utils
    *
    */

  /**
    * This functions logs the errors
    *
    * @param {String} message  Error message
    */
  const logError = function logError(message) {
    if (debugMode) {
      console.warn(message);
    }
  };

  /**
    * validate if given value is Number
    *
    * @public
    * @param {*} value expects a Number
    * @returns {Boolean} true if value is number | false if not
    */
  const validateNumber = function validateNumber(value) {
    return Number.isInteger(value);
  };

  /**
    * validate if a given value is a Boolean
    *
    * @public
    * @param {*} value expected Boolean
    * @returns {Boolean} true if value is boolean | false if not
    */
  const validateBoolean = function validateBoolean(value) {
    return typeof value === 'boolean';
  };

  /**
    * validate if a given value is Array
    *
    * @public
    * @param {*} value expected Array
    * @returns {Boolean} true if value is an array | false if not
    */
  const validateArray = function validateArray(value) {
    return Array.isArray(value);
  };

  /**
    * validate if a given value is String
    *
    * @public
    * @param {*} value expected String
    * @returns {Boolean} true if value is string | false if not
    */
  const validateString = function validateString(value) {
    return typeof value === 'string';
  };

  /**
    * validate if a given value is an Object
    *
    * @public
    * @param {*} value expected object
    * @returns {Boolean} true if value is an object | false if not
    */
  const validateObject = function validateObject(value) {
    return typeof value === 'object';
  };

  /**
    * validate if a given value is an window Element
    *
    * @public
    * @param {*} value expects a window Element
    * @returns {Boolean} true if value is an Element | false if not
    */
  const validateHTMLElement = function validateHTMLElement(value) {
    return value instanceof Element;
  };

  /**
    * validate if given value is a function
    *
    * @public
    * @param {*} value expected a function
    * @returns {Boolean} true if value is a function | false if not
    */
  const validateFunction = function validateFunction(value) {
    return typeof value === 'function';
  };

  /**
    * APP mount
    *
    * @type {Null}
    */
  let mountNode = null;

  /**
    * set mountNode
    *
    * @public
    * @param {Node} node node to mount app
    */
  const setMountNode = function setMountNode(node) {
    if (node === document.body || document.body.contains(node)) {
      mountNode = node;
    } else {
      logError(`Tried to set mountNode but failed. ${node} is not excisting in document`);
    }
  };

  /**
    * remove mountNode
    *
    * @public
    */
  const removeMountNode = function removeMountNode() {
    mountNode = null;
  };

  /**
    * start DebugMode
    *
    * @public
    */
  const startDebugMode = function startDebugMode() {
    debugMode = true;
  };

  /**
    * start DebugMode
    *
    * @public
    */
  const endDebugMode = function endDebugMode() {
    debugMode = false;
  };

  /**
    *
    * Browser
    *
    */

  /**
    * This functions returns the current browser name
    *
    * @public
    * @returns {String} browserName
    */
  const getBrowser = function getBrowser() {
    const browserAgent = navigator.userAgent;
    const resultBrowser = browserList.filter(browserItem => browserAgent.indexOf(browserItem.keywords) > -1);
    return resultBrowser.length > 0 ? resultBrowser[0].name : 'Unkown';
  };

  /**
    * This function returns the Viewport width in pixel
    *
    * @public
    * @returns {Number} Viewport width
    */
  const getViewportWidth = function getViewportWidth() {
    return window.innerWidth;
  };

  /**
    * This function returns the Viewport height in pixel
    *
    * @public
    * @returns {Number} - Viewport width
    */
  const getViewportHeight = function getViewportHeight() {
    return window.innerHeight;
  };

  /**
    * This functions returns the document height in pixel
    *
    * @public
    * @returns {Number} document height in pixel
    */
  const getDocumentHeight = function getDocumentHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight,
    );
  };

  /**
    *
    * DOM
    *
    */

  /**
    * Helper function
    * This function creates a string ans insert this into an element
    *
    * @private
    * @param {dom} element HTMLElement
    * @param {String} string string to insert into the element
    */
  const appendElementText = function appendElementText(element, string) {
    element.appendChild(document.createTextNode(string));
  };

  /**
    * Helper function
    * This function handles stylesheets for an element
    *
    * @private
    * @param {dom} element dom element
    * @param {Object} styles css styles
    */
  const handleStyles = function handleStyles(element, styles) {
    if (typeof styles === 'string') {
      element.setAttribute('style', styles);
    }
  };

  /**
    * handles the custom events
    *
    * @private
    * @param {dom} element observed element
    * @param {string} proberty attribute
    * @param {string} probertyValue value
    */
  const handleObserveItem = function handleObserveItem(element, proberty, probertyValue) {
    // Bundle args together into one object
    element.setAttribute(proberty, probertyValue);
    observerList.push({
      item: element,
      attribute: proberty,
      value: probertyValue,
    });
  };

  /**
    * Helper function
    * This function checks for an event
    *
    * @private
    * @param {String} elementEvent element event
    * @returns {Boolean} true if elemenrEvent is in eventList
    */
  const isEvent = function isEvent(elementEvent) {
    return eventList.indexOf(elementEvent) > -1;
  };

  /**
    * Helper function
    * This function checks for an observe data
    *
    * @private
    * @param {String} elementAttribute element attribute
    * @returns {Boolean} true if attribute is an
    */
  const isObserveData = function isObserveData(elementAttribute) {
    return observeItems.indexOf(elementAttribute) > -1;
  };

  /** Helper function
    * This functions handles the object in an element
    *
    * @private
    * @param {dom} element HTMLElement
    * @param {Object} elementProperties object with proberties
    */
  const appendElementObject = function appendElementObject(element, elementProperties) {
    Object.entries(elementProperties).forEach((probertyFrag) => {
      const proberty = probertyFrag[0];
      const probertyValue = probertyFrag[1];
      if (proberty === 'style') {
        handleStyles(element, probertyValue);
      } else if (proberty === 'innerHTML') {
        element.innerHTML = probertyValue;
      } else if (isObserveData(proberty)) {
        handleObserveItem(element, proberty, probertyValue);
      } else if (isEvent(proberty)) {
        element.addEventListener(proberty, probertyValue);
        subscribeObserver(element, proberty);
      } else if (probertyValue) {
        element.setAttribute(proberty, probertyValue);
      } else {
        logError(`${proberty} is not valid!`);
      }
    });
  };

  /**
    * Helper function
    * This function handles an array
    *
    * @private
    * @param {object} element element
    * @param {*} children can be Array | window.Element | String
    */
  const appendElementArray = function appendElementArray(element, children) {
    children.forEach((child) => {
      if (validateArray(child)) {
        appendElementArray(element, child);
      } else if (validateHTMLElement(child)) {
        element.appendChild(child);
      } else if (validateString(child)) {
        appendElementText(element, child);
      } else if (validateObject(child)) {
        appendElementObject(element, child);
      }
    });
  };

  /**
    * This funtion creates an dom element
    *
    * @public
    * @param {String} tag element tag
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const createElement = function createElement(tag, ...args) {
    const element = document.createElement(tag);

    args.forEach((arg) => {
      if (validateArray(arg)) {
        // is an array
        appendElementArray(element, arg);
      } else if (validateHTMLElement(arg)) {
        // is a dom element
        element.appendChild(arg);
      } else if (validateString(arg)) {
        // is a string
        appendElementText(element, arg);
      } else if (validateObject(arg)) {
        // is an object
        appendElementObject(element, arg);
      }
    });

    return element;
  };

  /**
    *
    * Element collections
    *
    */

  /**
    * Text elements
    */

  /**
    * returns an <h1> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const h1 = (...args) => createElement('h1', ...args);


  /**
    * returns an <h2> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const h2 = (...args) => createElement('h2', ...args);

  /**
    * returns an <h3> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const h3 = (...args) => createElement('h3', ...args);

  /**
    * returns an <h4> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const h4 = (...args) => createElement('h4', ...args);

  /**
    * returns an <h5> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const h5 = (...args) => createElement('h5', ...args);

  /**
    * returns an <h6> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const h6 = (...args) => createElement('h6', ...args);

  /**
    * returns an <a> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const a = (...args) => createElement('a', ...args);

  /**
    * returns an <b> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const b = (...args) => createElement('b', ...args);

  /**
    * returns an <p> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const p = (...args) => createElement('p', ...args);

  /**
    * returns an <span> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const span = (...args) => createElement('span', ...args);

  /**
    * returns an <ul> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const ul = (...args) => createElement('ul', ...args);

  /**
    * returns an <ol> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const ol = (...args) => createElement('ol', ...args);

  /**
    * returns an <li> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const li = (...args) => createElement('li', ...args);

  /**
    * Media elements
    */

  /**
    * returns an <figure> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const figure = (...args) => createElement('figure', ...args);

  /**
    * returns an <img> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const img = (...args) => createElement('img', ...args);

  /**
    * returns an <video> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const video = (...args) => createElement('video', ...args);

  /**
    * returns an <iframe> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const iframe = (...args) => createElement('iframe', ...args);

  /**
    * returns an <audio> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const audio = (...args) => createElement('audio', ...args);

  /**
    * Form elements
    */

  /**
    * returns an <label> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const label = (...args) => createElement('label', ...args);

  /**
    * returns an <input> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const input = (...args) => createElement('input', ...args);

  /**
    * returns an <textarea> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const textarea = (...args) => createElement('textarea', ...args);

  /**
    * returns an <fieldset> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const fieldset = (...args) => createElement('fieldset', ...args);

  /**
    * returns an <select> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const select = (...args) => createElement('select', ...args);

  /**
    * returns an <option> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const option = (...args) => createElement('option', ...args);

  /**
    * returns an <form> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const form = (...args) => createElement('form', ...args);

  /**
    * returns an <legend> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const legend = (...args) => createElement('legend', ...args);

  /**
    * Other elements
    */

  /**
    * returns an <button> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const button = (...args) => createElement('button', ...args);

  /**
    * returns an <aside> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const aside = (...args) => createElement('aside', ...args);

  /**
    * returns an <article> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const article = (...args) => createElement('article', ...args);

  /**
    * returns an <body> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const body = (...args) => createElement('body', ...args);

  /**
    * returns an <div> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const div = (...args) => createElement('div', ...args);

  /**
    * returns an <footer> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const footer = (...args) => createElement('footer', ...args);

  /**
    * returns an <header> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const header = (...args) => createElement('header', ...args);

  /**
    * returns an <main> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const main = (...args) => createElement('main', ...args);

  /**
    * returns an <nav> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const nav = (...args) => createElement('nav', ...args);

  /**
    * returns an <script> element
    *
    * @public
    * @param {*} args Object | String | Array
    * @returns {dom} element
    */
  const script = (...args) => createElement('script', ...args);

  /**
    * This function render an vdom element in dom
    *
    * @public
    * @param {vdom} element HTML element
    * @param {querySelector} rootValue root element
    */
  const renderElement = function renderElement(element, rootValue) {
    // Check for model
    if (!element) {
      logError('Cannot render element. No valid model found.');
      return;
    }

    let root;

    // Check for root or mountNode
    if (rootValue) {
      root = rootValue;
    } else if (mountNode) {
      root = mountNode;
    } else {
      logError('Could not mount APP.');
      return;
    }

    root.appendChild(element);
  };

  /**
    * This function clones an node and returns the cloned element
    * https://developer.mozilla.org/de/docs/Web/API/Node/cloneNode
    *
    * @public
    * @param {node} node element to clone
    * @param {Boolean} deep if true
    * @returns {dom} clonedElement
    */
  const cloneElement = function cloneElement(node, deep) {
    if (!node) {
      logError(`Cannot clone Node: ${node}. ${node} is not defined.`);
      return;
    }

    return node.cloneNode(deep);
  };

  /**
    * This function delets an domElement in dom
    *
    * @public
    * @param {dom} node element to remove
    * @param {boolean} onanimationend if true element removes when animation is finished
    */
  const removeElement = function removeElement(node, onanimationend) {
    if (!node) {
      return;
    }
    if (onanimationend) {
      node.addEventListener('animationend', () => {
        node.parentNode.removeChild(node);
      });
    } else {
      node.parentNode.removeChild(node);
    }
  };


  /**
    *
    * View
    *
    */

  /**
    * This function removes all childs in dom
    *
    * @public
    * @param {dom} node element where all children gets removed
    */
  const clearView = function clearView(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  };

  /**
    * This function renders a model in dom
    *
    * @public
    * @param {vdom | Array} model model which gets rendered in root
    * @param {dom} rootValue model gets inserted in root
    */
  const renderView = function renderView(model, rootValue) {
    let root = rootValue;

    // Check for model
    if (!model) {
      logError('Cannot render View. No valid Model found.');
      return;
    }

    // Check for root or mountNode
    if (!root) {
      // there is a given mountNode
      if (mountNode !== null) {
        root = mountNode;
      } else {
        logError('Could not mount APP.');
        return;
      }
    }

    // clear View
    clearView(root);

    if (Array.isArray(model)) {
      model.forEach((modelFragment) => {
        if (validateHTMLElement(modelFragment)) {
          root.appendChild(modelFragment);
        }
      });
    } else {
      root.appendChild(model);
    }
  };

  /**
    *
    * Components
    *
    */

  /**
    * component counter
    *
    * @type {Number}
    */
  let componentCounter = 0;

  /**
    * This is the class for components
    *
    * @class Component
    * @public
    */
  class Component {
    /**
      * @constructor Component
      * @param {object} options options to render the component
      */
    constructor(options = {}) {
      componentCounter += 1;
      this.options = options;
      this.name = validateString(options.name)
        ? options.name
        : `life-component-${componentCounter}`;
      this.element = createElement(this.name);
      this.template = options.template;
      this.mount = options.mount;
      this.data = options.data;
    }

    /**
      * set template
      *
      * @param {dom} model element model
      */
    setTemplate(model) {
      this.template = model;
    }

    /**
      * set mount
      *
      * @param {node} mountValue dom element where to mount the component
      */
    setMount(mountValue) {
      this.mount = mountValue;
    }

    /**
      * set data
      *
      * @param {object} dataValue data to pass in component
      */
    setData(dataValue) {
      this.data = dataValue;
    }

    /**
      *
      * methods
      *
      */

    /**
      * renders the component in dom
      *
      */
    render() {
      if (validateHTMLElement(this.mount) && validateFunction(this.template)) {
        this.mount.appendChild(this.element);
        this.element.appendChild(this.template());
      }
    }

    /**
      * update the component - will rerender
      *
      */
    update() {
      if (validateHTMLElement(this.element)) {
        clearView(this.element);
        this.element.appendChild(this.template());
      }
    }

    /**
      * remove component
      *
      */
    remove() {
      removeElement(this.element);
    }

  }

  /**
    *
    * Observer
    *
    */

  /**
    * This function updates the Observerlist
    *
    * @private
    */
  const updateObserver = function updateObserver() {
    observerList.forEach((observerItem) => {
      const element = observerItem.item;
      if (validateFunction(observerItem.value)) {
        if (observerItem.attribute === 'observe-innerHTML') {
          element.innerHTML = observerItem.value();
        } else if (observerItem.attribute === 'observe-value') {
          element.value = observerItem.value();
        }
      }
    });
  };

  /**
    * This function adds an element to Observer
    *
    * @private
    * @param {dom} element dom element
    * @param {String} type type of observer
    */
  const subscribeObserver = function subscribeObserver(element, type) {
    element.addEventListener(type, updateObserver);
  };

  /**
    * This functions register a custom Observeritem
    *
    * @public
    * @param {function} observerFunction - adding this function to observerList
    */
  const registerObserver = function registerObserver(observerFunction) {
    observerList.push(observerFunction);
  };

  /**
    *
    * Router
    *
    */

  /**
    * Storing all the routes
    *
    * @type {Array}
    */
  let routes = [];

  /**
    * Storing the default Route
    *
    * @type {String}
    */
  let defaultRoute = '';

  /**
    * Storing the notfound Route
    *
    * @type {String}
    */
  let notfoundRoute = '';

  /**
    * This function return the current hash
    *
    * @private
    * @return {string} window.location.hash.substring(1)
    */
  const getHash = function getHash() {
    return window.location.hash.substring(1);
  };

  /**
    * This function checks if a hash is registered yet
    *
    * @param {string} hash url hash
    * @returns {boolean} if hash is indexOf route
    */
  const isRoute = function isRoute(hash) {
    return routes[hash] !== undefined;
  };

  /**
    * This functions load a hash function
    *
    * @private
    * @param {string} hash url hash
    */
  const loadRoute = function loadRoute(hash) {
    routes[hash]();
  };

  /**
    * Register a new route to routes
    *
    * @public
    * @param {string} hashValue hash will get registered in routes
    * @param {function} func this function fires when hash changed or loaded
    */
  const registerRoute = function registerRoute(hashValue, func) {
    const hash = hashValue[0] === '#'
      ? hashValue.replace('#', '')
      : hashValue;

    routes[hash] = func;
  };

  /**
    * Unregister a route from routes
    *
    * @public
    * @param {String} hash hash that should be removed from routes
    */
  const unregisterRoute = function unregisterRoute(hash) {
    routes = routes.splice(routes.indexOf(hash), 1);
  };

  /**
    * Setting a default route
    *
    * @public
    * @param {String} hash default route when page is loaded
    */
  const setDefaultRoute = function setDefaultRoute(hash) {
    // check if this hash is registered
    isRoute(hash)
      ? defaultRoute = hash
      : logError(`Cannote use ${hash}. It is not registered`);
  };

  /**
    * Setting a Notfound Errorpage
    *
    * @public
    * @param {String} hash not found route
    */
  const setNotfoundRoute = function setNotfoundRoute(hash) {
    // check if this hash is registered
    isRoute(hash)
      ? notfoundRoute = hash
      : logError(`Cannot use ${hash}. It is not registered`);
  };

  /**
    * Init the router
    *
    * @public
    */
  const initRouter = function initRouter() {
    window.addEventListener('hashchange', () => {
      const currentHash = getHash();
      if (isRoute(currentHash)) {
        loadRoute(currentHash);
      } else if (notfoundRoute !== '') {
        // 404
        window.location.hash = notfoundRoute;
      }
    });

    window.addEventListener('load', () => {
      const currentHash = getHash();
      if (isRoute(currentHash)) {
        loadRoute(currentHash);
      } else if (defaultRoute !== '') {
        window.location.hash = defaultRoute;
      }
    });
  };

  /**
    *
    * Export the functions
    *
    */

  return {
    version,
    validateNumber,
    validateBoolean,
    validateArray,
    validateString,
    validateObject,
    validateHTMLElement,
    validateFunction,
    startDebugMode,
    endDebugMode,
    setMountNode,
    removeMountNode,
    getBrowser,
    getViewportWidth,
    getViewportHeight,
    getDocumentHeight,
    createElement,
    renderElement,
    cloneElement,
    removeElement,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    a,
    b,
    p,
    span,
    ul,
    ol,
    li,
    figure,
    img,
    video,
    iframe,
    audio,
    label,
    input,
    textarea,
    fieldset,
    select,
    option,
    form,
    legend,
    button,
    aside,
    article,
    body,
    div,
    footer,
    header,
    main,
    nav,
    script,
    registerObserver,
    clearView,
    renderView,
    initRouter,
    Component,
    registerRoute,
    unregisterRoute,
    setDefaultRoute,
    setNotfoundRoute,
  };
});
