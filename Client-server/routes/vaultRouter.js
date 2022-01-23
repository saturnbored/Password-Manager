const express =  require('express');
const router = express.Router();
const {addItem, getItem, updateItem, deleteItem, getDecryptedVault, getEncryptedVault} = require('../controllers/vaultControllers');

router.route('/item').post(addItem);

router.route('/item/:name').get(getItem).patch(updateItem).delete(deleteItem);

router.route('/all/decrypted').get(getDecryptedVault)

router.route('/all/encrypted').get(getEncryptedVault)

module.exports = router;