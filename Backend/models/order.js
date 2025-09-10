import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    items: [
      {
        productName: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        qty: {
          type: Number,
          required: true,
          min: 1
        }
      }
    ],
    totalAmount: { 
      type: Number, 
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending"
    },
    paymentDetails: {
      razorpay_order_id: {
        type: String,
        required: true
      },
      razorpay_payment_id: {
        type: String,
        required: true
      },
      razorpay_signature: {
        type: String,
        required: true
      },
      payment_status: {
        type: String,
        enum: ["Success", "Failed", "Pending"],
        default: "Success"
      }
    },
    billingDetails: {
      address: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      zipCode: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      }
    },
    deliveryDetails: {
      estimatedDeliveryDate: Date,
      actualDeliveryDate: Date,
      deliveryNotes: String,
      trackingNumber: String
    },
    rentalPeriod: {
      startDate: {
        type: Date,
        default: Date.now
      },
      endDate: Date,
      returnDate: Date
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for order duration
orderSchema.virtual('orderDuration').get(function() {
  if (this.rentalPeriod.endDate && this.rentalPeriod.startDate) {
    const diffTime = Math.abs(this.rentalPeriod.endDate - this.rentalPeriod.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return null;
});

// Virtual for formatted total amount
orderSchema.virtual('formattedTotal').get(function() {
  return `₹${this.totalAmount.toFixed(2)}`;
});

// Pre-save middleware to calculate end date based on rental days
orderSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    // Calculate total rental days (assuming all items have same rental period)
    const maxRentalDays = Math.max(...this.items.map(item => item.qty));
    
    if (!this.rentalPeriod.endDate) {
      const startDate = this.rentalPeriod.startDate || new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + maxRentalDays);
      this.rentalPeriod.endDate = endDate;
    }
  }
  next();
});

// Static method to find orders by status
orderSchema.statics.findByStatus = function(status) {
  return this.find({ status: status });
};

// Instance method to check if order is overdue
orderSchema.methods.isOverdue = function() {
  if (this.rentalPeriod.endDate && !this.rentalPeriod.returnDate) {
    return new Date() > this.rentalPeriod.endDate;
  }
  return false;
};

// Fix: prevent OverwriteModelError
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;