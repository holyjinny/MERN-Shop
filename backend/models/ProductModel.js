import { Schema, model } from 'mongoose';

const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, "상품명을 입력해주세요."],
        trim: true,
        maxLength: [15, "상품명은 15자를 넘길 수 없습니다."],
    },
    description: {
        type: String,
        required: [true, "상품의 내용을 입력해주세요."],
        maxLength: [4000, "내용은 4000자를 넘길 수 없습니다."],
    },
    price: {
        type: Number,
        required: [true, "상품의 가격을 입력해주세요."],
        maxLength: [8, "가격은 8자리를 넘길 수 없습니다."],
    },
    discountPrice: {
        type: String,
        maxLength: [4, "할인은 4자리를 넘길 수 없습니다."],
    },
    color: {
        type: String,
    },
    size: {
        type: String,
    },
    ratings: {
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        }
    ],
    category: {
        type: String,
        required: [true, "상품의 카테고리를 등록해주세요."],
    },
    stock: {
        type: Number,
        required: [true, "상품의 재고를 등록해주세요."],
        maxLength: [3, "재고는 3자리를 넘길 수 없습니다."],
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
            },
            time: {
                type: Date,
                default: Date.now(),
            },
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createAt: {
        type: Date,
        default: Date.now(),
    },
});

const Product = model("Product", ProductSchema);

export default Product;