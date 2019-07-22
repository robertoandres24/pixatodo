import Vue from 'vue'
// localStorage persistence
var STORAGE_KEY = 'pixatodo-todos'
var BGIMAGE_KEY = 'bgImage'
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
    var image = JSON.parse(localStorage.getItem(BGIMAGE_KEY))
    return image
  },
  save: function (imgSource) {
    localStorage.setItem(BGIMAGE_KEY, JSON.stringify(imgSource))
  },
  destroy: function () {
    localStorage.removeItem(BGIMAGE_KEY)
  }
}
Vue.prototype.$localStorage = { todoStorage, currentBg }
