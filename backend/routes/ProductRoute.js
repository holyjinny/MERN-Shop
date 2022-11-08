import { Router } from 'express';
import { createProduct, getAllProducts, updateProduct, deleteProduct, detailsProduct, createReview, getSingleProductReviews, deleteReview } from '../controller/ProductController';
import { isAuthenticatedUser, authorizeRoles } from '../middlewares/auth';

const router = Router();

/**
 * @description 모든 상품 목록
 * @api /products/api/productsList
 * @type GET
 */

router.route('/api/productsList').get(getAllProducts);

/**
 * @description 상품 등록
 * @api /products/api/new
 * @type POST
 */

router.route('/api/new').post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

/**
 * @description 상품 수정
 * @api /products/api/update/:id
 * @type PUT
 */

router.route('/api/update/:id').put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);

/**
 * @description 상품 삭제
 * @api /products/api/delete/:id
 * @type DELETE
 */

router.route('/api/delete/:id').delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

/**
 * @description 상품 상세 보기
 * @api /products/api/details/:id
 * @type GET
 */

router.route('/api/details/:id').get(detailsProduct);

/**
 * @description 리뷰 등록
 * @api /products/api/review
 * @type POST
 */

router.route('/api/review').post(isAuthenticatedUser, createReview);

/**
 * @description 해당 제품 리뷰 목록
 * @api /products/api/getSingleProductReviews
 * @type GET
 */

router.route('/api/getSingleProductReviews').get(getSingleProductReviews);

/**
 * @description 리뷰 삭제
 * @api /products/api/deleteReview
 * @type DELETE
 */

router.route('/api/deleteReview').delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview);

export default router;