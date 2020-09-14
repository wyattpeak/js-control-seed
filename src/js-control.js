import './js-control.css';
/**
 * This JSDoc type def represents the data coming into your control from Decisions,
 * when `setValue` is called.
 * @typedef YourInputs
 * @property {string} name
 * @property {string} value
 */

/**
 * @typedef DecisionsJsControl
 * @property {function} DecisionsJsControl.initialize - (host: JQuery, component: any): void;
 * @property {function} DecisionsJsControl.resize - (height: number, width: number): void;
 * @property {function} DecisionsJsControl.setValue - (data: YourInputs): void;
 * @property {function} DecisionsJsControl.getValue - (): YourOutputs;
 */

if (process.env.NODE_ENV === 'development') {
  // place things here that you need to load or do only in the dev environment.
  // this code will be removed in production.
}

/**
 * JSControl class. Name of class will become name of functional constructor that
 * Decisions will call to create an instance of your control.
 * 1. Rename to reflect the name of your JS Control
 * @typedef {DecisionsJsControl} SortControl
 */
export class SortControl {
  /** @type {HTMLElement} parent element, within which to render your control. */
  parentElement;

  /** @type {JQuery<HTMLElement>} host */
  host;

  /** @type {HTMLDivElement} */
  wrapper;

  /**@type {HTMLDivElement} */
  label;

  /** @type {HTMLDivElement} */
  sortableList;

  /** @type {HTMLButtonElement} */
  addButton;

  lastDraggedOver;
  curDropSlot;

  addListDropSlot(cls, listElement) {
    let elDropSlot = document.createElement('div');
    elDropSlot.className = 'sort-list-drop-slot';

    cls.sortableList.appendChild(elDropSlot);
  }

  addListElement(cls, value) {
    let el = document.createElement('div');
    el.className = 'sort-list-element';
    el.setAttribute('draggable', 'true');

    let elLabel = document.createElement('div');
    elLabel.className = 'sort-list-element-label';
    elLabel.innerText = value;

    let elDelete = document.createElement('div');
    elDelete.className = 'sort-list-element-delete';
    elDelete.innerText = 'x';

    elDelete.addEventListener('click', function(el) {
      let listElement = el.target.parentNode;
      let dropSlot = $(listElement).next('.sort-list-drop-slot')[0];
      cls.sortableList.removeChild(listElement);
      cls.sortableList.removeChild(dropSlot);
    })

    el.appendChild(elLabel);
    el.appendChild(elDelete);

    cls.sortableList.appendChild(el);

    cls.addListDropSlot(cls);
  }

  constructor() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'sort-wrapper';

    this.label = document.createElement('div');
    this.label.className = 'sort-label';

    this.sortableList = document.createElement('div');
    this.sortableList.className = 'sort-list';

    let cls = this;
    this.addButton = document.createElement('button');
    this.addButton.className = 'sort-add-button';
    this.addButton.innerText = '+';
    this.addButton.addEventListener('click', function(el) {
      let newElement = prompt('Please enter the new element name');
      cls.addListElement(cls, newElement);
    })

    this.lastDraggedOver = null;
    $(this.sortableList).on('dragstart', '.sort-list-element', function(e) {
      cls.lastDraggedOver = null;
      cls.curDropSlot = $(e.currentTarget).next('.sort-list-drop-slot')[0];
    });

    $(this.sortableList).on('dragend', '.sort-list-element', function(e) {
      let el = e.currentTarget;
      if(cls.lastDraggedOver != null) {
        cls.lastDraggedOver.after(el);
        el.after(cls.curDropSlot);
      }
    });

    $(this.sortableList).on('dragover', '.sort-list-drop-slot', function(e) {
      cls.lastDraggedOver = e.currentTarget;
    });

    this.wrapper.appendChild(this.label);
    this.wrapper.appendChild(this.sortableList);
    this.wrapper.appendChild(this.addButton);
  }

  /**
   * Do any work that needs to be done once for your control.
   *
   * In this example, we are creating the HTML parts using vanilla JS,
   * but you could embed another library into your control,
   * or use a [script control](https://documentation.decisions.com/docs/javascript-control-using-library)
   * @param {JQuery<HTMLElement>} host jquery element to append custom content into
   */
  initialize(host) {
    this.host = host;
    this.parentElement = host[0];
    this.parentElement.appendChild(this.wrapper);
  }

  /**
   * @param {YourInputs} values - an object with keys : values matching each input you have/will
   * define for your control on the Decisions side.
   */
  setValue(values) {
    // store any data your control needs to store
    this.label.innerText = values.name;

    this.sortableList.innerHTML = '';

    let cls = this;
    this.addListDropSlot(cls);
    values.value.forEach(function(val) {
      cls.addListElement(cls, val);
    });
  }

  /**
   * If your control requires programmatic resize, handle it here.
   * @param {number} height in pixels
   * @param {number} width in pixels
   */
  resize(height, width) {
    console.log('height', height, 'width', width);
  }

  /**
   * Return values if control needs to output data.
   */
  getValue() {
    let value = [];

    let listElements = $(this.sortableList).find('.sort-list-element-label');
    listElements.each(function(el) {
      value.push($(this).text());
    });

    return {name: this.label.innerText, value: value};
  }
}

// add constructor to global context.
window.SortControl = SortControl;
