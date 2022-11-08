import Product from '../models/ProductModel';
import ErrorHandler from '../utils/ErrorHandler';
import catchAsyncErrors from '../middlewares/catchAsyncErrors';
import Features from '../utils/Features';

// 모든 상품 목록
const getAllProducts = catchAsyncErrors(async (req, res) => {

    const resultPerPage = 10;

    const feature = new Features(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);

    const products = await feature.query;

    res.status(200).json({
        success: true,
        products,
    });
});

// 상품 등록
const createProduct = catchAsyncErrors(async (req, res, next) => {

    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product,
    });
});

// 상품 수정
const updateProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("해당 상품을 수정할 수 없습니다.", 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body,
        {
            new: true,
            runValidators: true,
            useUnified: false,
        }
    );

    res.status(200).json({
        success: true,
        product,
    });
});

// 상품 삭제
const deleteProduct = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("해당 상품을 삭제할 수 없습니다.", 404));
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: "상품을 삭제했습니다.",
    });
});

// 상품 상세 보기
const detailsProduct = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("해당 상품 페이지를 찾을 수 없습니다.", 404));
    }

    res.status(200).json({
        success: true,
        product,
        productCount,
    });
});

// 리뷰 등록 및 리뷰 수정
const createReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString());

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString()) {
                (rev.rating = rating),
                    (rev.comment = comment);
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});

// 제품 별 해당 리뷰 목록
const getSingleProductReviews = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler("해당하는 제품을 찾을 수 없습니다.", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});

// 리뷰 삭제 (관리자)
const deleteReview = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("해당 상품을 찾을 수 없습니다.", 404));
    }

    const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString());

    let avg = 0;

    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
        ratings = 0;
    } else {
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        },
    );

    res.status(200).json({
        success: true,
    });
});

export { createProduct, getAllProducts, updateProduct, deleteProduct, detailsProduct, createReview, getSingleProductReviews, deleteReview };