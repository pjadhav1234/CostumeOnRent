import React, { useEffect, useState } from "react";
import axios from "axios";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setError("Please login to view orders");
          setLoading(false);
          return;
        }

        // Use the correct API endpoint from the backend routes
        const response = await axios.get(`http://localhost:5000/api/payment/user-orders/${userId}`);
        
        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          setError("Failed to fetch orders");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders by status
  const filterOrdersByStatus = (status) => {
    if (status === 'all') return orders;
    if (status === 'current') return orders.filter(order => 
      ['Processing', 'Shipped'].includes(order.status)
    );
    if (status === 'pending') return orders.filter(order => 
      order.status === 'Pending'
    );
    if (status === 'completed') return orders.filter(order => 
      ['Delivered', 'Cancelled'].includes(order.status)
    );
    return orders.filter(order => order.status === status);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'Pending': 'warning',
      'Processing': 'info',
      'Shipped': 'primary',
      'Delivered': 'success',
      'Cancelled': 'danger'
    };
    return statusColors[status] || 'secondary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = filterOrdersByStatus(activeTab);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">My Orders</h2>
          
          {/* Order Status Tabs */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Orders ({orders.length})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveTab('pending')}
              >
                Pending ({orders.filter(o => o.status === 'Pending').length})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'current' ? 'active' : ''}`}
                onClick={() => setActiveTab('current')}
              >
                Current ({orders.filter(o => ['Processing', 'Shipped'].includes(o.status)).length})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`}
                onClick={() => setActiveTab('completed')}
              >
                Completed ({orders.filter(o => ['Delivered', 'Cancelled'].includes(o.status)).length})
              </button>
            </li>
          </ul>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3" style={{ fontSize: '4rem', opacity: 0.5 }}>📦</div>
              <h4>No {activeTab !== 'all' ? activeTab : ''} orders found</h4>
              <p className="text-muted">
                {activeTab === 'all' 
                  ? "You haven't placed any orders yet." 
                  : `No ${activeTab} orders at the moment.`
                }
              </p>
            </div>
          ) : (
            <div className="row">
              {filteredOrders.map(order => (
                <div key={order._id} className="col-12 mb-4">
                  <div className="card shadow-sm">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-0">Order #{order._id.slice(-8)}</h6>
                        <small className="text-muted">
                          Placed on {formatDate(order.createdAt)}
                        </small>
                      </div>
                      <span className={`badge bg-${getStatusBadge(order.status)} fs-6`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="card-body">
                      {/* Order Items */}
                      <div className="mb-3">
                        <h6 className="mb-2">Items:</h6>
                        {order.items.map((item, i) => (
                          <div key={i} className="d-flex justify-content-between align-items-center mb-1">
                            <span>
                              {item.productName} × {item.qty} days
                            </span>
                            <span className="text-success fw-bold">
                              ₹{(item.price * item.qty).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Billing Details */}
                      {order.billingDetails && (
                        <div className="mb-3">
                          <h6 className="mb-2">Delivery Address:</h6>
                          <p className="small text-muted mb-1">
                            {order.billingDetails.address}, {order.billingDetails.city}, {order.billingDetails.state} - {order.billingDetails.zipCode}
                          </p>
                          <p className="small text-muted mb-0">
                            Phone: {order.billingDetails.phone}
                          </p>
                        </div>
                      )}

                      {/* Rental Period */}
                      {order.rentalPeriod && (
                        <div className="mb-3">
                          <h6 className="mb-2">Rental Period:</h6>
                          <div className="row">
                            <div className="col-sm-6">
                              <small className="text-muted">Start Date:</small><br/>
                              <span className="fw-bold">
                                {formatDate(order.rentalPeriod.startDate)}
                              </span>
                            </div>
                            {order.rentalPeriod.endDate && (
                              <div className="col-sm-6">
                                <small className="text-muted">End Date:</small><br />
                                <span className="fw-bold">
                                  {formatDate(order.rentalPeriod.endDate)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Tracking Information */}
                      {order.deliveryDetails?.trackingNumber && (
                        <div className="mb-3">
                          <h6 className="mb-2">Tracking Information:</h6>
                          <p className="mb-0">
                            <strong>Tracking Number:</strong> {order.deliveryDetails.trackingNumber}
                          </p>
                        </div>
                      )}

                      {/* Total Amount */}
                      <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                        <span className="fw-bold">Total Amount:</span>
                        <span className="h5 text-success mb-0">
                          ₹{order.totalAmount.toFixed(2)}
                        </span>
                      </div>

                      {/* Payment Status */}
                      {order.paymentDetails && (
                        <div className="mt-2">
                          <small className="text-muted">
                            Payment ID: {order.paymentDetails.razorpay_payment_id}
                          </small>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="card-footer bg-light">
                      <div className="d-flex gap-2">
                        {order.status === 'Pending' && (
                          <button className="btn btn-sm btn-outline-danger">
                            Cancel Order
                          </button>
                        )}
                        {['Processing', 'Shipped'].includes(order.status) && (
                          <button className="btn btn-sm btn-outline-primary">
                            Track Order
                          </button>
                        )}
                        {order.status === 'Delivered' && (
                          <button className="btn btn-sm btn-outline-success">
                            Reorder
                          </button>
                        )}
                        <button className="btn btn-sm btn-outline-secondary">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;