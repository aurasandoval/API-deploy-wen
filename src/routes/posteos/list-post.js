const { Router } = require("express");
const router = Router();
const { Post, User, Driver, LicensePlate } = require("../../db.js");

router.get("/", async function (req, res) {
  const { user, admin } = req.query;
  try {
    let posts = await Post.findAll();
    if (admin === "true") {
      return res.json(posts);
    }
    let foundUser = await User.findOne({ where: { user: user } });
    let postsUser = posts.filter((e) => e.userId === foundUser.id);
    let prueba = await postsUser.map((post) => {
      let userReplace = await User.findOne({ where: { id: post.userId } });
      let driverReplace = await Driver.findOne({
        where: { id: post.driverId },
      });
      let licenseReplace = await LicensePlate.findOne({
        where: { id: post.licensePlateId },
      });
      post.userId = userReplace;
      post.driverId = driverReplace;
      post.licensePlateId = licenseReplace;
    });
    return res.json(prueba);
  } catch (err) {
    res.status(500).send({ err: err, msg: "Algo sucedió en la ruta" });
  }
});

module.exports = router;
