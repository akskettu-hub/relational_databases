const ValidSession = require("../models/valid_sessions");
const { tokenExtractor, userSessionValidator } = require("../util/middleware");

const router = require("express").Router();

// Loging out requires valid token so that only a valid token holder can delete a user's sessions.
// This could lead to a situation where loging out 'fails' because the token has expired or
// has been previously deleted. This solution prevents an invalid token holder from
// deleting valid sessions.
router.delete(
  "/",
  tokenExtractor,
  userSessionValidator,
  async (req, res, next) => {
    try {
      await ValidSession.destroy({
        where: { userId: req.decodedToken.id },
      });
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
