const express = require('express');
const nugu = require('../nugu');
const router = express.Router();

router.post(`/GameStartAction`, nugu);
router.post(`/ResultAction`, nugu);
router.post(`/WinGameAction`, nugu);
router.post(`/ResultAction2`, nugu);
router.post(`/addAction`, nugu);
router.post(`/CheckAction`, nugu);
router.post(`/WinGameAction2`, nugu);


module.exports = router;