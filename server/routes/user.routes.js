import express from "express";
import {
  test,
  updateUser,
  deleteUser,
  getUsers,
  signOut,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyuser.js";

const router = express.Router();

// api test:
// router.get("/test1", (req, res) => {
//   res.json({ message: "Api is working!" });
// });

// test api :
router.get("/test", test);

router.put("/update/:userId", verifyToken, updateUser); // router.put(path, handler)
router.delete("/delete/:userId", verifyToken, deleteUser); // router.delete(path, handler)
router.post("/signout", signOut);
router.get("/getusers", verifyToken, getUsers);

export default router;
