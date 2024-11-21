import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Star, Filter, X, ArrowRight, Package, Shield, Clock, Truck, Gift, Users } from 'lucide-react';

const ProductCard = ({ product, onMoreInfo }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img
          src={product.imageUrl || "/api/placeholder/400/300"}
          alt={product.productName}
          className={`w-full h-48 object-cover transition-transform duration-300 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          ₹{product.price.toFixed(2)}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800">{product.productName}</h3>
          <span className="flex items-center text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            4.5
          </span>
        </div>
        
        <div className="mb-4">
          <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
            {product.productType}
          </span>
          <p className="text-gray-600 mt-2 text-sm">
            Quantity: {product.quantity} units
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onMoreInfo(product._id)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition duration-300 flex items-center justify-center space-x-1"
          >
            <span>Details</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          {/* <Link to={`/orderinfo/${product._id}`} className="flex-1">
            <button className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center justify-center space-x-1">
              <ShoppingCart className="h-4 w-4" />
              <span>Order</span>
            </button>
          </Link> */}
        </div>
      </div>
    </div>
  );
};

const ProductModal = ({ product, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/75 backdrop-blur-sm z-50" onClick={onClose}>
    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full m-4" onClick={e => e.stopPropagation()}>
      <div className="relative">
        <img
          src={product.imageUrl || "/api/placeholder/400/300"}
          alt={product.productName}
          className="w-full h-48 object-cover rounded-t-xl"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition"
        >
          <X size={16} />
        </button>
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{product.productName}</h2>
        <div className="space-y-3">
          <p className="flex items-center text-gray-600">
            <span className="font-semibold min-w-24">Distributor:</span>
            <span className="ml-2">{product.distributorName}</span>
          </p>
          <p className="flex items-center text-gray-600">
            <span className="font-semibold min-w-24">Type:</span>
            <span className="ml-2">{product.productType}</span>
          </p>
          <p className="flex items-center text-gray-600">
            <span className="font-semibold min-w-24">Price:</span>
            <span className="ml-2">₹{product.price.toFixed(2)}</span>
          </p>
          <p className="flex items-center text-gray-600">
            <span className="font-semibold min-w-24">Quantity:</span>
            <span className="ml-2">{product.quantity} units</span>
          </p>
          <div className="mt-4">
            <span className="font-semibold">Description:</span>
            <p className="mt-2 text-gray-600">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const productTypes = [
    "All",
    "Beauty",
    "Electronics",
    "Fashion",
    "Home Goods",
    "Health and Wellness",
    "Food and Beverage",
    "Sports and Outdoor Equipment",
    "Automotive",
    "Toys and Games",
    "Furniture",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://retail-connect-backend.onrender.com/api/landingpage/products/all");
        const data = await response.json();
        if (response.ok) {
          setProducts(data);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All" || product.productType === selectedType;
    return matchesSearch && matchesType;
  });

  const features = [
    {
      icon: <Package className="h-8 w-8" />,
      title: "Wide Selection",
      description: "Browse through thousands of quality products from trusted distributors"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure Shopping",
      description: "Your transactions and data are protected with enterprise-grade security"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "24/7 Support",
      description: "Our dedicated team is always ready to assist you"
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Fast Delivery",
      description: "Get your products delivered quickly and efficiently"
    },
    {
      icon: <Gift className="h-8 w-8" />,
      title: "Loyalty Rewards",
      description: "Earn points on every purchase and redeem for exclusive discounts"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community",
      description: "Join our thriving community of retailers and distributors"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-2 py-2 flex justify-between items-center">
        <Link to="/">
              <img
                className="h-8 w-auto md:h-14 rounded-lg"
                src="https://res.cloudinary.com/dlx3l4a9p/image/upload/v1730382942/wjyihm0hyh0ctnkow2m0.png"
                alt="Your Company"
              />
            </Link>
          <div className="space-x-4">
            <Link to="/auth/login" className="text-gray-600 hover:text-green-600 transition">Login</Link>
            <Link to="/auth/signup" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition">Sign Up</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-r from-green-400 to-blue-500">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-in">
            Welcome to Retail Pro
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Discover a new way of connecting with trusted distributors and accessing quality products
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/getstartedpage"
              className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg"
            >
              Get Started
            </Link>
            <Link
              to="/auth/signup"
              className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition transform hover:scale-105 shadow-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-4 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="md:hidden bg-green-500 text-white px-4 py-2 rounded-lg flex items-center justify-center"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              {isFilterOpen ? <X size={20} /> : <Filter size={20} />}
              <span className="ml-2">Filters</span>
            </button>
            <div className={`md:flex ${isFilterOpen ? 'block' : 'hidden'}`}>
              <select
                className="w-full md:w-auto px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {productTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
          Featured Products
        </h2>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-white text-center bg-red-500 rounded-xl p-4">
            {error}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-gray-600 text-center bg-gray-100 rounded-xl p-4">
            No products found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onMoreInfo={(id) => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-gray-100 py-16 mt-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="text-green-500 mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "John Doe", role: "Retailer", content: "Retail Pro has transformed the way I source products. The platform is intuitive and the product selection is unmatched." },
              { name: "Jane Smith", role: "Distributor", content: "As a distributor, I've seen a significant increase in my customer base thanks to Retail Pro. It's a game-changer." },
              { name: "Mike Johnson", role: "Retailer", content: "The customer support is exceptional. Any issues I've had were resolved quickly and professionally." }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.name[0]}
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-800 font-semibold">{testimonial.name}</p>
                    <p className="text-green-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-400 to-blue-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-white mb-8">Join our community of retailers and distributors today!</p>
          <Link
            to="/auth/signup"
            className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg inline-block"
          >
            Sign Up Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Retail Pro</h3>
              <p className="text-gray-400">Connecting retailers and distributors in a seamless marketplace.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
                <li><Link to="/products" className="text-gray-400 hover:text-white transition">Products</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-gray-400 hover:text-white transition">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link></li>
                <li><Link to="/cookies" className="text-gray-400 hover:text-white transition">Cookie Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-linkedin-in"></i></a>
                <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-instagram"></i></a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-400">&copy; 2024 Retail Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default LandingPage;