import Vue from 'vue'
// localStorage persistence
var STORAGE_KEY = 'pixatodo-todos'
var BGIMAGE_KEY = 'pixatodo-bg'
var TAG_KEY = 'pixatodo-tag'
var todoStorage = {
  fetch: function () {
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    todos.forEach(function (todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}
var currentBg = {
  fetch: function () {
    return JSON.parse(localStorage.getItem(BGIMAGE_KEY))
  },
  save: function (imgSource) {
    localStorage.setItem(BGIMAGE_KEY, JSON.stringify(imgSource))
  },
  destroy: function () {
    localStorage.removeItem(BGIMAGE_KEY)
  }
}
var currentTag = {
  fetch: function () {
    return JSON.parse(localStorage.getItem(TAG_KEY))
  },
  save: function (tag) {
    localStorage.setItem(TAG_KEY, JSON.stringify(tag))
  },
  destroy: function () {
    localStorage.removeItem(TAG_KEY)
  }
}
Vue.prototype.$localStorage = { todoStorage, currentBg, currentTag }
