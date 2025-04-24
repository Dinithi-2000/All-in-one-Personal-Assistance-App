import bcrypt from 'bcryptjs';
import express from 'express';
import expressAsyncHandler from 'express-async-handler';

import UserModel from '../models/UserModel.js';

const router = express.Router();

// MARK: User Profile Details
router.get(
    '/',
    expressAsyncHandler(async (req, res) => {
      const requestedUser = req.user;
      try {
        const user = await UserModel.findOne(
          { _id: requestedUser.id },
          'firstName middleName lastName mobile email profile_pic cover_pic birthDay gender ABN_Number bio about roleId isTasker isEmailVerified isMobileVerified isVerifiedUser education onbordingMessage externalSignUp createdAt updatedAt',
        );
        if (!user) {
          return res.status(400).send({ message: 'User Not Found.' });
        }
        let badges = [];
        badges = await fetchBadges(user._id);
  
        const taskerAddressTb = await TaskerAddressModel.find({ taskerId: req.user.id });
        const taskerTb = await TaskerModel.findOne({ taskerId: req.user.id }, { _id: 0, taskerId: 0, isVerifiedDocumentVerified: 0 });
        const taskerServiceTb = await TaskerServiceModel.findOne({ taskerId: req.user.id });
  
        const verification = {
          isAddressVerified: taskerAddressTb.length > 0,
          isServiceVerified: (taskerServiceTb?.services?.length ?? 0) > 0,
        };
        const stripeCompleteStatus = await getStripeAccontDetails2(user._id);
        const privileges = await UserPrivilegesModel.findOne({ userId: req.user.id });
  
        if (taskerTb) {
          verification.isVerifiedTasker = taskerTb.isVerifiedTasker;
        }
        const data = {
          username: `${user.firstName} ${user.lastName}`,
        };
        if (user.onbordingMessage == false) {
          await sendEmailViaOneSignal(user.email, process.env.ONESIGNAL_WELCOME_TEMP_ID_NEW, data);
          user.onbordingMessage = true;
          await user.save();
        }
  
        return res.status(200).send({
          ...user._doc,
          ...(taskerTb ? taskerTb._doc : {}),
          stripe_details_submitted: stripeCompleteStatus,
          badges,
          verification,
          privileges: privileges.privileges,
        });
      } catch (error) {
        return res.status(500).send({ message: error.message });
      }
    }),
  );

  export default router;