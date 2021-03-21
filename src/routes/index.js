const express = require("express");

const router = express.Router();

//-----------USER-----------------------------------------------
// const {
//   getUsers,
//   getDetailUser,
//   addUser,
//   updateUser,
//   deleteUser,
// } = require("../controllers/user");

// router.get("/users", getUsers);
// router.get("/user/:id", getDetailUser);
// router.post("/user", addUser);
// router.patch("/user/:id", updateUser);
// router.delete("/user/:id", deleteUser);

// //-----------PARTNER--------------------------------------------
// const {
//   getPartners,
//   getDetailPartner,
//   addPartner,
//   updatePartner,
//   deletePartner,
// } = require("../controllers/partner");

// router.get("/partners", getPartners);
// router.get("/partner/:id", getDetailPartner);
// router.post("/partner", addPartner);
// router.patch("/partner/:id", updatePartner);
// router.delete("/partner/:id", deletePartner);

//-----------------------------AUTH------------------------------------

const { registerProfile, login } = require("../controllers/auth");

router.post("/register", registerProfile);
router.post("/login", login);

//-----------Profile--------------------------------------------
const {
  getProfiles,
  getDetailProfile,
  updateProfile,
  deleteProfile,
  getProfilePartner,
  getProfileUser,
} = require("../controllers/profile");

router.get("/profiles", getProfiles);
router.get("/profile/:id", getDetailProfile);
router.patch("/profile/:id", updateProfile);
router.delete("/profile/:id", deleteProfile);
router.get("/profile-partners", getProfilePartner);
router.get("/profile-users", getProfileUser);

//-------------------------------TEST PRODUCT START-------------------------------
const {
  addProduct,
  getProducts,
  getProductById,
  getProductsByPartner,
  editProduct,
  deletProduct,
} = require("../controllers/products");

router.post("/add-product", addProduct);
router.get("/products", getProducts);
router.get("/product/:id", getProductById);
router.patch("/product/:id", editProduct);
router.delete("/product/:id", deletProduct);
router.get("/products/:id", getProductsByPartner);

//-------------------------------TEST END---------------------------------

module.exports = router;
