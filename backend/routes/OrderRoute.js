import { Router } from 'express';
import { createOrder, getSingleOrder, getAllOrders, getAdminAllOrders, updateOrderStatus, deleteOrder } from '../controller/OrderController';
import { isAuthenticatedUser, authorizeRoles } from '../middlewares/auth';

const router = Router();

/**
 * @description 주문 등록
 * @api /orders/api/create
 * @type POST
 */

router.route('/api/create').post(isAuthenticatedUser, createOrder);

/**
 * @description 주문 내역
 * @api /orders/api/:id
 * @type GET
 */

router.route('/api/:id').get(isAuthenticatedUser, getSingleOrder);

/**
 * @description 모든 주문 내역
 * @api /orders/api/orderList
 * @type GET
 */

router.route('/api/orderList/me').get(isAuthenticatedUser, getAllOrders);

/**
 * @description 모든 주문 내역 (관리자)
 * @api /orders/api/adminOrderList
 * @type GET
 */

router.route('/api/orderList/admin').get(isAuthenticatedUser, authorizeRoles("admin"), getAdminAllOrders);

/**
 * @description 주문 상태 수정 (관리자)
 * @api /orders/api/update/:id
 * @type PUT
 */

router.route('/api/update/:id').put(isAuthenticatedUser, authorizeRoles("admin"), updateOrderStatus);

/**
 * @description 주문 삭제 (관리자)
 * @api /orders/api/delete/:id
 * @type DELETE
 */

router.route('/api/delete/:id').delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

export default router;