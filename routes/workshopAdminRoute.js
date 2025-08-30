const express =require('express');
const router =express.Router();
const {getDashboard,addVehicle,getVehicles,updateVehicle,deleteVehicle} =require('../controllers/workshopAdminController');
const authMiddleware =require('../middlewares/authmiddleware');
const checkPrivilege =require('../middlewares/checkPrevilegemiddleware');
const {getStaff,addStaff,editStaff,deleteStaff} =require('../controllers/staffConroller');
const {jobcardCreatePage,jobcardEditPage,getAllJobcards,createJobcard,updateJobcard,deleteJobcard} =require('../controllers/jobcardController');
const {getClients,getServiceHistory} =require('../controllers/clientController');
const upload = require("../middlewares/multer");


router.get('/dashboard',authMiddleware,checkPrivilege(["workshopadmin"]),getDashboard);
router.get('/vehicle',authMiddleware,checkPrivilege(["workshopadmin"]),getVehicles);
router.post('/vehicle', authMiddleware,checkPrivilege(["workshopadmin"]), addVehicle);
router.put('/vehicle/:id', authMiddleware,checkPrivilege(["workshopadmin"]), updateVehicle);
router.delete('/vehicle/:id', authMiddleware,checkPrivilege(["workshopadmin"]), deleteVehicle);


router.get('/staff',authMiddleware,checkPrivilege(["workshopadmin"]),getStaff);
router.post('/staff',authMiddleware,checkPrivilege(["workshopadmin"]),addStaff);
router.put('/staff/:id',authMiddleware,checkPrivilege(["workshopadmin"]),editStaff);
router.delete('/staff/:id',authMiddleware,checkPrivilege(["workshopadmin"]),deleteStaff);


router.get('/jobcard/create',authMiddleware,checkPrivilege(["workshopadmin"]),jobcardCreatePage);
router.get('/jobcard/edit/:id',authMiddleware,checkPrivilege(["workshopadmin"]),jobcardEditPage);

router.get('/jobcard',authMiddleware,checkPrivilege(["workshopadmin"]),getAllJobcards);
router.post('/jobcard',authMiddleware,checkPrivilege(["workshopadmin"]),upload.array("damagedParts", 10),createJobcard);
router.put('/jobcard/:id',authMiddleware,checkPrivilege(["workshopadmin"]),upload.array("damagedParts", 10),updateJobcard);
router.delete('/jobcard/:id',authMiddleware,checkPrivilege(["workshopadmin"]),deleteJobcard);


router.get('/client',authMiddleware,checkPrivilege(["workshopadmin"]),getClients)
router.get('/client/history/:phone',authMiddleware,checkPrivilege(["workshopadmin"]),getServiceHistory)
module.exports =router;