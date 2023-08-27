import { Router } from "express";
import { 
  acceptService,
  addUserService,
  createService, 
  declineService, 
  getServiceById, 
  getServicesByCompany, 
  getServicesByUser,
  getUnssignedServices
} from "../controllers/Service.controller.js";
import { CompanyRequired, authRequired } from "../middlewares/authRequired.js";


const router = Router();


router.post('/', CompanyRequired, createService);
router.get('/company',CompanyRequired, getServicesByCompany);
router.get('/unssigned',CompanyRequired, getUnssignedServices);
router.get('/user', authRequired, getServicesByUser);
router.get('/:service_id',authRequired, getServiceById);
router.post('/add/user/:user_id', CompanyRequired, addUserService);
router.put('/accept/service/:service_id', authRequired, acceptService);
router.put('/decline/service/:service_id', authRequired, declineService);


export default router;