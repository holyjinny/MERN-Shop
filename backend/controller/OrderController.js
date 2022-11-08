import Order from '../models/OrderModel';
import Product from '../models/ProductModel';
import ErrorHandler from '../utils/ErrorHandler';
import catchAsyncErrors from '../middlewares/catchAsyncErrors';

// 주문 등록
const createOrder = catchAsyncErrors(async (req, res, next) => {

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        order,
    });
});

// 주문 내역
const getSingleOrder = catchAsyncErrors(async (req, res, next) => {

    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email",
    );

    if (!order) {
        return next(new ErrorHandler("주문 내역이 없습니다.", 404));
    };

    res.status(200).json({
        success: true,
        order,
    });
});

// 모든 주문 보기
const getAllOrders = catchAsyncErrors(async (req, res, next) => {

    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders,
    });
});

// 모든 주문 보기 (관리자)
const getAdminAllOrders = catchAsyncErrors(async (req, res, next) => {

    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    });
});

// 주문 상태 수정 (관리자)
const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("해당하는 주문을 찾을 수 없습니다.", 404));
    }

    if (order.orderStatus === "배달 완료") {
        return next(new ErrorHandler("해당 주문은 이미 배달이 완료되었습니다.", 400));
    }

    if (req.body.status === "발송준비") {
        order.orderItems.forEach(async (o) => {
            await updateStock(o.product, o.quantity);
        });
    }

    order.orderStatus = req.body.status;

    if (req.body.status === "배달 완료") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});

async function updateStock(id, quantity) {

    const product = await Product.findById(id);

    product.stock -= quantity;

    await product.save({ validateBeforeSave: false });
}

// 주문 삭제 (관리자)
const deleteOrder = catchAsyncErrors(async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("해당 주문 내역을 찾을 수 없습니다.", 404));
    }

    await order.remove();

    res.status(200).json({
        success: true,
    });
});

export { createOrder, getSingleOrder, getAllOrders, getAdminAllOrders, updateOrderStatus, deleteOrder }