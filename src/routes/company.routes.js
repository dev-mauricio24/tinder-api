import { Router } from "express";
import { CompanyRequired } from "../middlewares/authRequired.js";
import { 
  deleteCompany,
  getCompany, 
  updateCompany 
} from "../controllers/company.controller.js";


const router = Router();

router.get('/', CompanyRequired, getCompany)
router.put('/update', CompanyRequired, updateCompany)
router.post('/delete', CompanyRequired, deleteCompany)

export default router;