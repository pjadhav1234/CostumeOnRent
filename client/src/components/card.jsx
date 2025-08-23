import React from "react";

const Vehicles = () => {
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Available Vehicles</h2>
      <div className="row">
        
        {/* Card 1 */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-lg h-100">
            <img
              src="https://via.placeholder.com/400x250"
              className="card-img-top"
              alt="Car"
            />
            <div className="card-body">
              <h5 className="card-title">Honda City</h5>
              <p className="card-text">
                <strong>₹2000 / day</strong>
              </p>
              <ul>
                <li>Fuel: Petrol</li>
                <li>Seats: 5</li>
                <li>AC: Yes</li>
              </ul>
              <button className="btn btn-primary w-100">Add to Cart</button>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-lg h-100">
            <img
              src="https://via.placeholder.com/400x250"
              className="card-img-top"
              alt="Bike"
            />
            <div className="card-body">
              <h5 className="card-title">Royal Enfield</h5>
              <p className="card-text">
                <strong>₹1200 / day</strong>
              </p>
              <ul>
                <li>Fuel: Petrol</li>
                <li>Seats: 2</li>
                <li>Helmet: Included</li>
              </ul>
              <button className="btn btn-primary w-100">Add to Cart</button>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-lg h-100">
            <img
              src="https://via.placeholder.com/400x250"
              className="card-img-top"
              alt="SUV"
            />
            <div className="card-body">
              <h5 className="card-title">Mahindra Thar</h5>
              <p className="card-text">
                <strong>₹3000 / day</strong>
              </p>
              <ul>
                <li>Fuel: Diesel</li>
                <li>Seats: 4</li>
                <li>AC: Yes</li>
              </ul>
              <button className="btn btn-primary w-100">Add to Cart</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Vehicles;
