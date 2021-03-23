const express = require("express");

const router = express.Router();

const { authenticated } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/upload");
const { partnerCheck, userCheck } = require("../middlewares/roleCheck");

//------------------------------REGISTER LOGIN-----------------------------------------------
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

//----------------------------------Profile--------------------------------------------
const {
  getProfiles,
  getDetailProfile,
  updateProfile,
  deleteProfile,
  getProfilePartner,
  getProfileUser,
} = require("../controllers/profile");

router.get("/profiles", getProfiles);
router.get("/profile/:id", authenticated, getDetailProfile);
router.patch(
  "/profile/:id",
  authenticated,
  uploadFile("imageFile", "videoFile"),
  updateProfile
);
router.delete("/profile/:id", authenticated, deleteProfile);
router.get("/profile-partners", getProfilePartner);
router.get("/profile-users", getProfileUser);

//-------------------------------PRODUCT-------------------------------
const {
  addProduct,
  getProducts,
  getProductById,
  getProductsByPartner,
  updateProduct,
  deletProduct,
} = require("../controllers/products");

router.post(
  "/add-product",
  authenticated,
  partnerCheck,
  uploadFile("imageFile", "videoFile"),
  addProduct
);
router.get("/products", getProducts);
router.get("/product/:id", authenticated, getProductById);
router.patch(
  "/product/:id",
  authenticated,
  partnerCheck,
  uploadFile("imageFile", "videoFile"),
  updateProduct
);
router.delete("/product/:id", authenticated, partnerCheck, deletProduct);
router.get("/products/:id", getProductsByPartner);

//-------------------------------TEST TRANSACTION START---------------------------------
const {
  addTransaction,
  getTransactionById,
} = require("../controllers/transactions");
router.post("/transaction", authenticated, addTransaction);
router.get("/transaction/:id", authenticated, getTransactionById);

// buat table order (pembanti) ada qty transactionId prodductId --> direlasikan ke product
// transaction has many order

module.exports = router;
