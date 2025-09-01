const express =require('express');
const router =express.Router();
const {getDashboard,addVehicle,getVehicles,updateVehicle,deleteVehicle} =require('../controllers/workshopAdminController');
const authMiddleware =require('../middlewares/authmiddleware');
const checkPrivilege =require('../middlewares/checkPrevilegemiddleware');
const {getStaff,addStaff,editStaff,deleteStaff} =require('../controllers/staffConroller');
const {jobcardCreatePage,jobcardEditPage,getAllJobcards,createJobcard,updateJobcard,deleteJobcard} =require('../controllers/jobcardController');
const {getClients,getServiceHistory} =require('../controllers/clientController');
const upload = require("../middlewares/multer");
const noCache =require('../middlewares/noCache')

router.get('/dashboard',authMiddleware,checkPrivilege(["workshopadmin"]),noCache,getDashboard);
router.get('/vehicle',authMiddleware,checkPrivilege(["workshopadmin"]),noCache,getVehicles);
router.post('/vehicle', authMiddleware,checkPrivilege(["workshopadmin"]),noCache,addVehicle);
router.put('/vehicle/:id', authMiddleware,checkPrivilege(["workshopadmin"]),noCache, updateVehicle);
router.delete('/vehicle/:id', authMiddleware,checkPrivilege(["workshopadmin"]),noCache, deleteVehicle);


router.get('/staff',authMiddleware,checkPrivilege(["workshopadmin"]),noCache,getStaff);
router.post('/staff',authMiddleware,checkPrivilege(["workshopadmin"]),noCache,addStaff);
router.put('/staff/:id',authMiddleware,checkPrivilege(["workshopadmin"]),noCache,editStaff);
router.delete('/staff/:id',authMiddleware,checkPrivilege(["workshopadmin"]),noCache,deleteStaff);


router.get('/jobcard/create',authMiddleware,checkPrivilege(["workshopadmin"]),noCache,jobcardCreatePage);
router.get('/jobcard/edit/:id',authMiddleware,checkPrivilege(["workshopadmin"]),noCache,jobcardEditPage);

router.get('/jobcard',authMiddleware,checkPrivilege(["workshopadmin"]),noCache,getAllJobcards);
router.post('/jobcard',authMiddleware,checkPrivilege(["workshopadmin"]),noCache,upload.array("damagedParts", 10),createJobcard);
router.put('/jobcard/:id',authMiddleware,checkPrivilege(["workshopadmin"]),noCache,upload.array("damagedParts", 10),updateJobcard);
router.delete('/jobcard/:id',authMiddleware,checkPrivilege(["workshopadmin"]),noCache,deleteJobcard);


router.get('/client',authMiddleware,checkPrivilege(["workshopadmin"]),noCache,getClients)
router.get('/client/history/:phone',authMiddleware,checkPrivilege(["workshopadmin"]),noCache,getServiceHistory)
module.exports =router;