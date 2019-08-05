import emojis from 'emoji-datasource/emoji.json'

const find = (name) => emojis.filter(e => e.short_name.includes(name))

export { find }
