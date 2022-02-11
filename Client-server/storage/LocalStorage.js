const LocalStorage = require('node-localstorage').LocalStorage;

const localStorage = new LocalStorage('./scratch');

module.exports = {
    localStorage
}