module.exports = {
  //auth
  login: require("./auth/login"),
  logout: require("./auth/logout"),
  signup: require("./auth/signup"),
  token: require("./auth/token"),
  //validation
  getEmailValidation: require("./auth/emailValidation"),
  getNameValidation: require("./auth/nameValidation"),
  //user
  getUserInfo: require("./user/userInfo"),
  updateInfo: require("./user/updateInfo"),
  deleteInfo: require("./user/deleteInfo"),
  userReport: require("./user/userReport"),
  updatePfp: require("./user/updatePfp"),
  deletePfp: require("./user/deletePfp"),
  //post
  uploadPost: require("./post/uploads"),
  getUserLocation: require("./post/getLocation"),
  getPostDetail: require("./post/postDetail"),
  updatePost: require("./post/updatePost"),
  deletePost: require("./post/deletePost"),
  postStatus: require("./post/postStatus"),
  postList: require("./post/getPostList"),
  // room
  getMessage: require("./room/message"),
  getRoomList: require("./room/room"),
  joinRoom: require("./room/join"),
  getParticipant: require("./room/participant"),
  //admin
  getReportList: require("./admin/report"),
  blockUser: require("./admin/block"),
};
