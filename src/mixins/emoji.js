export default {
  methods: {
    creatingEmoji(el) {
      if (
        $(el)
          .siblings('.typeahead')
          .css('display') == 'block'
      ) {
        return true
      }
      return false
    },
  }
}
