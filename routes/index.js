const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeControllers')



router.get('/',homeController.home);
router.post("/add-habit", homeController.add);
router.get("/delete-habit", homeController.delete);
router.get("/view-habit", homeController.viewHabit);
router.get("/fetch-habit", homeController.FetchHabit);
router.get("/update-db-date", homeController.updateHabit);

// router.use('/user', require('./users'))
// router.use('/posts', require('./posts'))

module.exports = router;