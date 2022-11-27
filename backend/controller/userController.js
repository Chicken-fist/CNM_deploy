const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const mailer = require("../utils/mailer");
const bcryptjs = require("bcryptjs");
var ip = require("ip");
const { findById } = require("../models/userModel");
const handleTimeSend = (x) => {
  const month =
    x.getMonth() + 1 < 10 ? "0" + (x.getMonth() + 1) : x.getMonth() + 1;
  const date = x.getDate() < 10 ? "0" + x.getDate() : x.getDate();
  const a = x.getFullYear() + "-" + month + "-" + date;
  return a;
};
const register = asyncHandler(async (req, res) => {
  const { name, email, password, pic, sex, phone, birth } = req.body;
  if (!name || !email || !password || !sex || !phone || !birth) {
    res.status(400);
    throw new Error("Pls enter all Fields");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email already exists");
  }
  const phoneExits = await User.findOne({ phone });
  if (phoneExits) {
    res.status(400);
    throw new Error("Phone number already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
    pic,
    sex,
    phone,
    birth,
  });
  if (user) {
    bcryptjs.hash(user.email, 10).then((hashMail) => {
      console.log(
        `${process.env.APP_URL}/verify?email=${user.email}&token=${hashMail}`
      );
      mailer.sendMail(
        user.email,
        "Verify Email",
        `<!DOCTYPE html>
        <html>
        
        <head>
        
            <meta charset="utf-8">
            <meta http-equiv="x-ua-compatible" content="ie=edge">
            <title>Email Confirmation</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style type="text/css">
                /**
           * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
           */
                @media screen {
                    @font-face {
                        font-family: 'Source Sans Pro';
                        font-style: normal;
                        font-weight: 400;
                        src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
                    }
        
                    @font-face {
                        font-family: 'Source Sans Pro';
                        font-style: normal;
                        font-weight: 700;
                        src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
                    }
                }
        
                /**
           * Avoid browser level font resizing.
           * 1. Windows Mobile
           * 2. iOS / OSX
           */
                body,
                table,
                td,
                a {
                    -ms-text-size-adjust: 100%;
                    /* 1 */
                    -webkit-text-size-adjust: 100%;
                    /* 2 */
                }
        
                /**
           * Remove extra space added to tables and cells in Outlook.
           */
                table,
                td {
                    mso-table-rspace: 0pt;
                    mso-table-lspace: 0pt;
                }
        
                /**
           * Better fluid images in Internet Explorer.
           */
                img {
                    -ms-interpolation-mode: bicubic;
                }
        
                /**
           * Remove blue links for iOS devices.
           */
                a[x-apple-data-detectors] {
                    font-family: inherit !important;
                    font-size: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                    color: inherit !important;
                    text-decoration: none !important;
                }
        
                /**
           * Fix centering issues in Android 4.4.
           */
                div[style*="margin: 16px 0;"] {
                    margin: 0 !important;
                }
        
                body {
                    width: 100% !important;
                    height: 100% !important;
                    padding: 0 !important;
                    margin: 0 !important;
                }
        
                /**
           * Collapse table borders to avoid space between cells.
           */
                table {
                    border-collapse: collapse !important;
                }
        
                a {
                    color: #1a82e2;
                }
        
                img {
                    height: auto;
                    line-height: 100%;
                    text-decoration: none;
                    border: 0;
                    outline: none;
                }
            </style>
        
        </head>
        
        <body style="background-color: #e9ecef; ">
        
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 50px;">
        
                    <!-- start logo -->
                    <tr>
                        <td align="center" bgcolor="#e9ecef">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%"
                                style="max-width: 600px; background-color: #17A589 ;">
                                <tr>
                                    <td align="center" valign="top" style="padding: 36px 24px; font-size: 100px">
                                    ✉
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" bgcolor="#e9ecef">
                            <!--[if (gte mso 9)|(IE)]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                    <tr>
                    <td align="center" valign="top" width="600">
                    <![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"
                                style="background-color: #17A589 ;">
                                <tr>
                                    <td align="left" style="background-color: #17A589 ;"
                                        style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                                        <h1
                                            style="margin: 0; font-size: 32px;color: #fff; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
                                            <center>Confirm Your Email Address</center></h1>
                                    </td>
                                </tr>
                            </table>
                            <!--[if (gte mso 9)|(IE)]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->
                        </td>
                    </tr>
                    <!-- end hero -->
            
                    <!-- start copy block -->
                    <tr>
                        <td align="center" bgcolor="#e9ecef">
                            <!--[if (gte mso 9)|(IE)]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                    <tr>
                    <td align="center" valign="top" width="600">
                    <![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%"
                                style="max-width: 600px; background-color: #17A589 ;">
            
                                <!-- start copy -->
                                <tr>
                                    <td class="v-container-padding-padding"
                                        style="overflow-wrap:break-word;word-break:break-word;padding:10px 60px 30px;font-family:arial,helvetica,sans-serif;"
                                        align="left">
            
                                        <div class="v-text-align"
                                            style="color: #ffffff; line-height: 160%; text-align: left; word-wrap: break-word;">
                                            <p style="font-size: 14px; line-height: 160%;"><strong><span
                                                        style="font-family: Raleway, sans-serif; font-size: 18px; line-height: 28.8px;">Hello</span></strong>
                                            </p>
                                            <p style="font-size: 14px; line-height: 160%;">&nbsp;</p>
                                            <p style="font-size: 14px; line-height: 160%;"><span
                                                    style="font-family: Raleway, sans-serif; font-size: 16px; line-height: 25.6px;">Welcome to Message App. </span></p>
                                            <p style="font-size: 14px; line-height: 160%;"><span
                                                    style="font-family: Raleway, sans-serif; font-size: 16px; line-height: 25.6px;">We
                                                    had to suspend your account in order to ensure the saftey of your account. This
                                                    suspension is temporary. We will need some additional information to verify your
                                                    identity</span></p>
                                            <p style="font-size: 14px; line-height: 160%;">&nbsp;</p>
                                            <ul style="list-style-type: square;">
                                                <li style="font-size: 14px; line-height: 22.4px;"><strong><span
                                                            style="font-family: Raleway, sans-serif; font-size: 16px; line-height: 25.6px;">When
                                                            : ${handleTimeSend(
                                                              new Date()
                                                            )}</span></strong></li>
                                                <li style="font-size: 14px; line-height: 22.4px;"><strong><span
                                                    style="font-family: Raleway, sans-serif; font-size: 16px; line-height: 25.6px;">Name: ${
                                                      user.name
                                                    }</span></strong></li>
                                                <li style="font-size: 14px; line-height: 22.4px;"><span
                                                        style="font-family: Raleway, sans-serif; font-size: 16px; line-height: 25.6px;"><strong>Birth:
                                                            ${handleTimeSend(
                                                              user.birth
                                                            )}</strong>&nbsp; </span></li>
                                            </ul>
                                        </div>
            
                                    </td>
                                </tr>
                                <!-- end copy -->
            
                                <!-- start button -->
                                <tr>
                                    <td align="left" bgcolor="#ffffff">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%"
                                            style="background-color: #17A589 ;">
                                            <tr>
                                                <td align="center" style="background-color: #17A589 ;" style="padding: 12px;">
                                                    <table border="0" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td align="center" bgcolor="#fff" style="border-radius: 6px;">
                                                                <a href="https://mern-chat-wztm.onrender.com/api/user/verify?email=${
                                                                  user.email
                                                                }&token=${hashMail}" target="_blank"
                                                                    style="
                                                                    font-weight: bold;width: 400px;
                                                                    display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #17A589; text-decoration: none; border-radius: 6px;">
                                                                    VERIFY</a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="v-container-padding-padding"
                                        style="overflow-wrap:break-word;word-break:break-word;padding:10px 60px 50px;font-family:arial,helvetica,sans-serif;"
                                        align="left">
            
                                        <div class="v-text-align"
                                            style="color: #ffffff; line-height: 170%; text-align: left; word-wrap: break-word;">
                                            <p style="font-size: 14px; line-height: 170%;"><strong><span
                                                        style="font-size: 18px; line-height: 30.6px;"><span
                                                            style="font-family: Raleway, sans-serif; line-height: 30.6px; font-size: 18px;">Sincerely,</span></span></strong>
                                            </p>
                                            <p style="font-size: 14px; line-height: 170%;"><span
                                                    style="font-size: 18px; line-height: 30.6px;"><span
                                                        style="font-family: Raleway, sans-serif; line-height: 30.6px; font-size: 18px;">Customer
                                                        Service</span></span></p>
                                        </div>
            
                                    </td>
                                </tr>
                            </table>  
                        </td>
                    </tr>  
                </table>
            </div>
        </body>
        
        </html>`
      );
    });
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
      phone: user.phone,
      birth: user.birth,
      sex: user.sex,
    });
  } else {
    res.status(400);
    throw new Error("Cant create User ");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: email }, { phone: email }],
  });
  if (user && (await user.matchPassword(password))) {
    if (user.email_verified_at == null) {
      console.log("XIN HAY VAO XAC THUC BANG EMAIL");
      res.status(402);
      throw new Error("Verify by email to complete the registration process");
    } else {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        sex: user.sex,
        phone: user.phone,
        birth: user.birth,
        pic: user.pic,
        token: generateToken(user._id),
      });
      console.log("Dung + XAC THUC GOI");
    }
  } else {
    console.log("Sai Tai khoan");
    res.status(401);
    throw new Error("Login information is incorrect");
  }
});
// /api/user?search=xxx
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [{ phone: req.query.search }, { email: req.query.search }],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

const verify = asyncHandler(async (req, res) => {
  console.log("DO DO DO");
  bcryptjs.compare(req.query.email, req.query.token, (err, result) => {
    if (result == true) {
      User.findOneAndUpdate(
        { email: req.query.email },
        { email: req.query.email, email_verified_at: new Date() },
        (err, data) => {
          if (err) console.log(err);
          else {
            console.log("XONG XONG XONG");
            res.render("thanks");
          }
        }
      );
    } else {
      console.log("Ko tim ra");
    }
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { userId, name, pic, sex, birth } = req.body;
  // const userExists = await User.findOne({ _id: userId });
  // if(!userExists ){
  //   res.status(400);
  //   throw new Error("User is not exists");
  // }
  // console.log(userId);
  if (!name || !sex || !birth) {
    res.status(400);
    throw new Error("Pls enter all Fields");
  }
  // if (userExists) {
  //   res.status(400);
  //   throw new Error("User already exists");
  // }
  // const { userId } = req.body;
  await User.findByIdAndUpdate(
    {
      _id: userId,
    },
    {
      name,
      pic,
      sex,
      birth,
    }
  );
  const userNew = await User.findById({_id: userId })
  if (userNew) {
    setTimeout(() => {
      console.log(userNew);
      res.status(200).json({
        _id: userNew._id,
        name: userNew.name,
        email: userNew.email,
        pic: userNew.pic,
        phone: userNew.phone,
        birth: userNew.birth,
        sex: userNew.sex,
      });
    }, 1000);
  } else {
    res.status(400);
    throw new Error("Cant update User ");
  }
});

module.exports = { register, authUser, allUsers, verify, updateProfile };
