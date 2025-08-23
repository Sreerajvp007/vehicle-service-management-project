const express =require('express');
const router =express.Router();
const {getDashboard,addVehicle,getVehicles,updateVehicle,deleteVehicle} =require('../controllers/workshopAdminController');
const authMiddleware =require('../middlewares/authmiddleware');
const checkPrivilege =require('../middlewares/checkPrevilegemiddleware');


router.get('/dashboard',authMiddleware,checkPrivilege(["workshopadmin"]),getDashboard)
router.get('/vehicle',authMiddleware,checkPrivilege(["workshopadmin"]),getVehicles);
router.post('/vehicle', authMiddleware,checkPrivilege(["workshopadmin"]), addVehicle);
router.put('/vehicle/:id', authMiddleware,checkPrivilege(["workshopadmin"]), updateVehicle);
router.delete('/vehicle/:id', authMiddleware,checkPrivilege(["workshopadmin"]), deleteVehicle);





module.exports =router;