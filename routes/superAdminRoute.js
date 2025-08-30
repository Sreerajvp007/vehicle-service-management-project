const express =require('express');
const router =express.Router();
const {loginSuperAdmin,showloginPageSuper,logoutSuperAdmin} =require('../controllers/authController');
const {getWorkshops,addWorkshop,editWorkshop,deleteWorkshop,approveWorkshop,blockWorkshop,rejectWorkshop,getDashboard,unblockWorkshop} =require('../controllers/superAdminController')
const authMiddleware =require('../middlewares/authmiddleware');
const checkPrivilege =require('../middlewares/checkPrevilegemiddleware');
router.get('/login',showloginPageSuper);
router.post('/login',loginSuperAdmin);
router.post('/logout', logoutSuperAdmin);

router.get('/dashboard',authMiddleware,checkPrivilege(["superadmin"]),getDashboard)
router.get("/workshops",authMiddleware,checkPrivilege(["superadmin"]),getWorkshops);


router.post("/workshops/",authMiddleware,checkPrivilege(["superadmin"]),addWorkshop);


router.put("/workshops/:id",authMiddleware,checkPrivilege(["superadmin"]),editWorkshop);

router.delete("/workshops/:id",authMiddleware,checkPrivilege(["superadmin"]), deleteWorkshop);


router.put("/workshops/:id/approve",authMiddleware,checkPrivilege(["superadmin"]),approveWorkshop);
router.put("/workshops/:id/block",authMiddleware,checkPrivilege(["superadmin"]),blockWorkshop);
router.put("/workshops/:id/unblock", authMiddleware,checkPrivilege(["superadmin"]),unblockWorkshop);
router.delete("/workshops/:id/reject",authMiddleware,checkPrivilege(["superadmin"]),rejectWorkshop);


module.exports =router;