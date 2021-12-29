const OrderItems = require("../models/order-items");
const Order = require("../models/order");
const { Promise } = require("mongoose");
const {getModelCount} = require ('../helpers/count')


const getOrdersCount = getModelCount(Order)

const createOrderItems = async (orderItemsRequest) => {
  return Promise.all(
    orderItemsRequest.map(async (orderItem) => {
      let newOrderItmes = new OrderItems({
        product: orderItem.product,
        quantity: orderItem.quantity,
      });
      newOrderItmes = await newOrderItmes.save();
      return newOrderItmes._id;
    })
  );
};



const culculateTotalPrice = async (orderItemsIds) => {
  const orderPrices = await Promise.all(
    orderItemsIds.map(async (orderItem) => {
      let productPrice = await OrderItems.findById(orderItem).populate(
        "product",
        "price -_id"
      );
      return productPrice.product.price * productPrice.quantity;
    })
  );
  totalOrderPrice = orderPrices.reduce((a, b) => a + b, 0);
  return totalOrderPrice;
};

const getTotalSales = async(req,res)=>{
try{
 const totalSales =   await Order.aggregate([{$group: {_id : null, totalSales: {$sum : "$totalPrice"}}}])
 console.log(totalSales,"eeeeee");
 if(!totalSales) throw "The orders sales can not generated! "
 res.status(200).json({totalSales: totalSales[0].totalSales})
}catch(err){
  res.status(500).send({succsess : false , error : err})
}
}


const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name")
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          populate: "category",
        },
      });
    if (orders) return res.status(200).json(orders);
    res.status(404).json({ succes: false, massege: "Orders not found !" });
  } catch (err) {
    res.status(500).json(err);
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({user : req.params.userId})
      .populate("user", "name")
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          populate: "category",
        },
      });
      
    if (orders.length === 0) throw "Orders of this user not found !" 
      
    res.status(200).json(orders);
  } catch (err) {
    if(err === "Orders of this user not found !") return res.status(404).json({message: err });
    res.status(500).json(err);
  }
};



const getOneOrder = async (req, res) => {
  try {
    const orders = await Order.findById(req.params.orderId)
      .populate("user", "name")
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          populate: "category",
        },
      });
    if (orders) return res.status(200).json(orders);
    res.status(404).json({ succes: false, massege: "Order not found !" });
  } catch (err) {
    res.status(500).json(err);
  }
};

const createOrder = async (req, res) => {
  try {
    const orderItemsIds = await createOrderItems(req.body.orderItems);
    const orderTotalPrice = await culculateTotalPrice(orderItemsIds);
    const {
      phone,
      status,
      shippingAddressOne,
      shippingAddressTwo,
      country,
      city,
      zipCode,
      user,
    } = req.body;
    let newOrder = new Order({
      orderItems: orderItemsIds,
      phone,
      status,
      shippingAddressOne,
      shippingAddressTwo,
      country,
      city,
      zipCode,
      totalPrice: orderTotalPrice,
      user,
    });
    if (!newOrder) throw "Can not create order";
    newOrder = await newOrder.save();
    res.json(newOrder);
  } catch (err) {
    if (err === "Can not creat order")
      return res.status(400).json({ success: false, message: err });
    console.log(err);
    res.status(500).json({ success: false, message: err });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    if (!req.body.status) throw "Status is required!";
    if (!req.params.orderId) throw "Order's id is required!";
    console.log(req.params.orderId);

    const newStatus = await Order.findByIdAndUpdate(
      req.params.orderId,
      {
        status: req.body.status,
      },
      { new: true }
    );
    console.log(newStatus);
    if (!newStatus)
      throw "Status not updated ! maybe Order's Id is not correct !";

    res.status(200).json(newStatus);
  } catch (err) {
    if (
      err === "Status is required!" ||
      err === "Order's id is required!" ||
      err === "Status not updated! maybe Order's Id is not correct !"
    )
      return res.status(404).json({ success: false, err });
    res.status(500).json({ success: false, error: err.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    if (!req.params.orderId) throw "Order's id is required!";
    let orderItemsDeleted = await Order.findById(req.params.orderId).select(
      "orderItems -_id"
    );
    orderItemsDeleted.orderItems.map(async (orderItemId) => {
      await OrderItems.findByIdAndRemove(orderItemId);
    });
    const orderDeleted = await Order.findByIdAndRemove(req.params.orderId);
    if (!orderDeleted)
      throw "Order is not deleted! maybe order's id is not correct!";
    return res.status(200).json({
      success: true,
      message: "Order is deleted with id : " + req.params.orderId,
    });
  } catch (err) {
    if (err === "Order's id is required!" || err === "Order is not deleted!")
      return res.status(404).json({ sussess: false, err });
    res.status(500).json({ succsess: false, error: err.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOneOrder,
  updateOrderStatus,
  deleteOrder,
  getTotalSales,
  getOrdersCount,
  getUserOrders
};
