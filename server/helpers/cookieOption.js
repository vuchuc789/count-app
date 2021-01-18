const threeYearsToMillisecond = 3 * 365 * 24 * 60 * 60 * 1000;
const isSSL = process.env.NODE_ENV === "production";

const cookieOption = {
  maxAge: threeYearsToMillisecond,
  httpOnly: true,
  secure: isSSL,
  signed: true,
  sameSite: "None",
};

module.exports = cookieOption;
