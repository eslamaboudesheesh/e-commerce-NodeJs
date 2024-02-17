import { StatusCodes } from "http-status-codes";
import cloudinary from "../../utils/cloud.js";
import { Cart } from "../../../DB/models/cart.model.js";
import { Product } from "../../../DB/models/product.model.js";
import { Coupon } from "../../../DB/models/coupon.model.js";
import { Order } from "../../../DB/models/order.model.js";
import createInvoice from "../../utils/pdfInvoice.js";
import path from "path";
import { fileURLToPath } from "url";
import sendEmail from "../../utils/sendEmail.js";
const _dirname = path.dirname(fileURLToPath(import.meta.url));

export const addOrder = async (req, res, next) => {
  const { phone, address, payment, coupon } = req.body;
  // name slug create by image
  //check coupon
  let checkCoupon;

  if (coupon) {
    checkCoupon = await Coupon.findOne({
      name: coupon,
      expiredAt: { $gt: Date.now() },
    });
  }

  if (!checkCoupon) return next(new Error("coupon not found "));
  // get products from cart
  const cart = await Cart.findOne({ user: req.user._id });

  const products = cart.products;
  if (products.length < 1) return next(new Error("products not found "));

  //check products

  let orderProducts = [];
  let orderPrice = 0;

  for (let i = 0; i < products.length; i++) {
    const product = await Product.findById(products[i].productId);
    if (!product) return next(new Error(`${products[i].productId} not found `));

    if (!product.inStock(products[i].quantity))
      return next(new Error(`${products[i].productId} out of stock `));

    orderProducts.push({
      name: product.name,
      quantity: products[i].quantity,
      itemPrice: product.finalPrice,
      totalPrice: product.finalPrice * products[i].quantity,
      productId: product._id,
    });

    orderPrice += product.finalPrice * products[i].quantity;
  }
  // create order in DB
  const order = Order.create({
    user: req.user._id,
    address,
    phone,
    payment,
    products: orderProducts,
    price: orderPrice,
    coupon: {
      id: checkCoupon?._id,
      name: checkCoupon?.name,
      discount: checkCoupon?.discount,
    },
  });
  // create invoice
  const user = req.user;
  const invoice = {
    shipping: {
      name: user.userName,
      address: order.address,
      country: "Egypt",
    },
    items: orderProducts,
    subtotal: order.price,
    paid: order.finalPrice,
    invoice_nr: order._id,
  };
  const pdfPath = path.join(_dirname, `./../../tempInvoices/${order._id}.pdf`);
  createInvoice(invoice, pdfPath);
  // upload cloud
  const { secure_url, public_id } = await cloudinary.uploader.upload(pdfPath, {
    folder: `${process.env.CLOUD_FOLDER_NAME}/order/invoices`,
  });
  // add to DB  file  URL ,ID
  order.invoice = { url: secure_url, id: public_id };
  await order.save();
  // send email to user invoices
  const isSent = await sendEmail({
    to: user.email,
    subject: "invoices details",
    attachments: [
      {
        path: secure_url,
        contentType: "application/pdf",
      },
    ],
  });
  if (!isSent) return next(new Error("something went wrong"));
  // update stock
  updateStock(order.products, true);
  // clear cart
  clearCart(req.use._id);
  //return response
  return res.status(StatusCodes.CREATED).json({
    success: true,
    message: "order add successfully  ",
    result: order,
  });
};

export const cancelOrder = async (req, res, next) => {
  const { id } = req.params;
  // check order
  const order = await Order.findById(id);
  if (!order) return next(new Error("order not found "));

  //check status
  if (
    order.status === "delivered" ||
    order.status === "shipped" ||
    order.status === "canceled"
  )
    return next(new Error("order can't canceled "));
  //cancel order
  order.status = "canceled";
  await order.save();

  // update to stock
  updateStock(order.products, false);

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "order canceled  successfully",
    data: cart,
  });
};
