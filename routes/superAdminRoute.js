const express =require('express');
const router =express.Router();
const {loginSuperAdmin,showloginPageSuper,logoutSuperAdmin} =require('../controllers/authController');
const {getWorkshops,addWorkshop,editWorkshop,deleteWorkshop,approveWorkshop,blockWorkshop,resetToPending} =require('../controllers/superAdminController')
const authMiddleware =require('../middlewares/authmiddleware');

router.get('/login',showloginPageSuper)
router.post('/login',loginSuperAdmin);
router.post('/logout', logoutSuperAdmin);


router.get("/workshops",authMiddleware,getWorkshops);


router.post("/workshops/",authMiddleware,addWorkshop);


router.put("/workshops/:id",authMiddleware,editWorkshop);

router.delete("/workshops/:id",authMiddleware, deleteWorkshop);


router.put("/workshops/:id/approve",authMiddleware,approveWorkshop);
router.put("/workshops/:id/block",authMiddleware,blockWorkshop);
router.put("/workshops/:id/pending",authMiddleware,resetToPending);


module.exports =router;