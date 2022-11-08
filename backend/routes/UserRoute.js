import { Router } from "express";
import { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, updatePassword, userDetails, updateUser, getAllUsers, getSingleUser, updateRole, deleteUser } from '../controller/UserController';
import { isAuthenticatedUser, authorizeRoles } from '../middlewares/auth';

const router = Router();

/**
 * @description 회원 가입
 * @api /users/api/registration
 * @type POST
 */

router.route('/api/registration').post(registerUser);

/**
 * @description 로그인
 * @api /users/api/login
 * @type POST
 */

router.route('/api/login').post(loginUser);

/**
 * @description 로그아웃
 * @api /users/api/logout
 * @type GET
 */

router.route('/api/logout').get(logoutUser);

/**
 * @description 비밀번호 찾기
 * @api /users/api/forgot
 * @type POSt
 */

router.route('/api/forgot').post(forgotPassword);

/**
 * @description 비밀번호 초기화
 * @api /users/api/reset/:token
 * @type PUT
 */

router.route('/api/reset/:token').put(resetPassword);

/**
 * @description 비밀번호 변경
 * @api /users/api/updatePassword
 * @type PUT
 */

router.route('/api/updatePassword').put(isAuthenticatedUser, updatePassword);

/**
 * @description 유저 정보
 * @api /users/api/details
 * @type GET
 */

router.route('/api/details').get(isAuthenticatedUser, userDetails);

/**
 * @description 유저 정보 변경
 * @api /users/api/updateUser
 * @type PUT
 */

router.route('/api/updateUser').put(isAuthenticatedUser, updateUser);

/**
 * @description 모든 유저 목록
 * @api /users/api/allUsers
 * @type GET
 */

router.route('/api/allUsers').get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);

/**
 * @description 해당 유저 정보 보기
 * @api /users/api/user/:id
 * @type GET
 */

router.route('/api/user/:id').get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser);

/**
 * @description 유저 역할 변경
 * @api /users/api/updateRole/:id
 * @type PUT
 */

router.route('/api/updateRole/:id').put(isAuthenticatedUser, authorizeRoles("admin"), updateRole);

/**
 * @description 유저 역할 변경
 * @api /users/api/delete/:id
 * @type DELETE
 */

router.route('/api/delete/:id').delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

export default router;