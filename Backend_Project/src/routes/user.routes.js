import { Router } from "express";
import { loginUser, logoutUser, registerUser,refreshAccessToken,changeCurrentPassword, gerCurrentUser,updateAccountDetails,updateUserAvatar,getUserChannelProfile,getWatchHistory} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middlewares.js";
import {verifyJWT} from "../middlewares/auth.middlewares.js"
const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount:1
        },
        {
            name: "coverImage",
            maxCount:1
        }
    ]),
    registerUser
)

router.route("/login").post (loginUser)

//secured Routes

router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").post(verifyJWT,gerCurrentUser)
router.route("/update-account-details").patch(verifyJWT,updateAccountDetails)

router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/channel-profile/:username").get(verifyJWT,getUserChannelProfile)
router.route("/watch-history").get(verifyJWT,getWatchHistory)

export default router