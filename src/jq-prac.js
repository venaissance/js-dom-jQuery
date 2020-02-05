window.$ = window.jQuery = function(generalSelector) {
  let elements;

  if (generalSelector[0] === "<") {
    elements = [createElements(generalSelector)];
  } else if (typeof generalSelector === "string") {
    elements = document.querySelectorAll(generalSelector);
  } else if (generalSelector instanceof Array) {
    elements = generalSelector;
  }

  function createElements(string) {
    const container = document.createElement("template");
    container.innerHTML = string.trim();
    return container.content.firstChild;
  }

  const api = Object.create(jQuery.prototype);
  Object.assign(api, {
    elements: elements,
    oldApi: generalSelector.oldApi
  });
  return api;
};

jQuery.fn = jQuery.prototype = {
  constructor: jQuery,
  jquery: true,
  get(index) {
    return this.elements[index];
  },
  print() {
    console.log(this.elements);
    return this;
  },
  each(fn) {
    for (let i = 0; i < this.elements.length; i++) {
      fn.call(null, this.elements[i], i);
    }
    return this;
  },
  appendTo(node) {
    if (node instanceof Element) {
      this.each(el => node.appendChild(el));
    } else if (node.jquery === true) {
      this.each(el => node.get(0).appendChild(el));
    }
  },
  find(selector) {
    let array = [];
    for (let i = 0; i < this.elements.length; i++) {
      foundElements = Array.from(this.elements[i].querySelectorAll(selector));
      array = array.concat(foundElements);
    }
    array.oldApi = this;
    return jQuery(array);
  },
  end() {
    return this.oldApi;
  },
  addClass(className) {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].classList.add(className);
    }
    return this;
  },
  parent() {
    const array = [];
    this.each(node => {
      if (array.indexOf(node.parentNode) === -1) {
        array.push(node.parentNode);
      }
    });
    return jQuery(array);
  },
  children() {
    const array = [];
    this.each(node => {
      array.push(...node.children);
    });
    return jQuery(array);
  }
};
