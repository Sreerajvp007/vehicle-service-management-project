const express =require('express');
const router =express.Router();
const {addVehicle,getVehicles,updateVehicle,deleteVehicle} =require('../controllers/workshopAdminController')
const userAuthmiddleware =require('../middlewares/userAuthmiddleware')

router.get('/vehicle', userAuthmiddleware, getVehicles);
router.post('/vehicle', userAuthmiddleware, addVehicle);
router.put('/vehicle/:id', userAuthmiddleware, updateVehicle);
router.delete('/vehicle/:id', userAuthmiddleware, deleteVehicle);

module.exports =router;