// jQuery函数：不是构造函数的构造函数
window.$ = window.jQuery = function(generalSelector) {
  let elements;
  // 创建div
  if (generalSelector[0] === "<") {
    // 如果选择器是一段HTML，创建元素
    elements = [createElement(generalSelector)];
  } else if (typeof generalSelector === "string") {
    // 正常选择器，查找元素
    elements = document.querySelectorAll(generalSelector);
  } else if (generalSelector instanceof Array) {
    // 处理数组
    elements = generalSelector;
  }
  function createElement(string) {
    const container = document.createElement("template");
    container.innerHTML = string.trim();
    return container.content.firstChild;
  }
  // 为把共用函数放在一起，创建以jQuery.prototype为原型的对象
  // 等同于：const api = {__proto__: jQuery.prototype}
  const api = Object.create(jQuery.prototype);
  // 把必要属性传递过去，等同于
  // api.elements = elements
  // api.oldApi = selectorOrArrayOrTemplate.oldApi
  Object.assign(api, {
    elements: elements,
    oldApi: generalSelector.oldApi
  });
  return api;
};

// 共有方法放原型，节省内存空间
// jQuery.fn 别名
jQuery.fn = jQuery.prototype = {
  constructor: jQuery,
  jquery: true,
  // 闭包：函数内使用外部变量
  get(index) {
    return this.elements[index];
  },
  // DOM新增节点
  appendTo(node) {
    if (node instanceof Element) {
      // 如果是节点，直接添加
      this.each(el => node.appendChild(el));
    } else if (node.jquery === true) {
      // 如果是jQuery对象，则加到第一个jQuery对象里
      this.each(el => node.get(0).appendChild(el));
    }
  },
  // 遍历
  each(fn) {
    for (let i = 0; i < this.elements.length; i++) {
      fn.call(null, this.elements[i], i);
    }
    return this;
  },
  // 查询
  find(selector) {
    let array = [];
    for (let i = 0; i < this.elements.length; i++) {
      foundElements = Array.from(this.elements[i].querySelectorAll(selector));
      array = array.concat(foundElements);
      console.log(array);
    }
    array.oldApi = this; // 保存调用find()的对象，用于end()返回
    return jQuery(array);
  },
  // 添加类
  addClass(className) {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].classList.add(className);
    }
    return this;
  },
  // 查爸爸
  parent() {
    const array = [];
    this.each(node => {
      if (array.indexOf(node.parentNode) === -1) {
        array.push(node.parentNode);
      }
    });
    return jQuery(array);
  },
  // 查儿子
  children() {
    const array = [];
    this.each(node => {
      array.push(...node.children);
    });
    return jQuery(array);
  },
  // 输出
  print() {
    console.log(this.elements);
    return this;
  },
  // 返回
  end() {
    return this.oldApi; // oldApi和this配合实现返回，高级代码的精髓
  }
};
