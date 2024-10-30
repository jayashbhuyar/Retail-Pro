import React, { useState, useEffect, lazy, Suspense } from "react";
import { ChevronDown, ChevronUp, Calendar, Package, DollarSign, SortDesc,IndianRupeeIcon } from "lucide-react";

import DistributorsNavbar from "../components/Navbar/DistributorsNavbar";
import RetailerNavbar from "../components/Navbar/RetailerNavbar";
import AdminNav from "../components/Navbar/AdminNav";

// Lazy load the PDF generation component
const PDFDownloadButton = lazy(() => import('./PDFDownloadButton'));

const userData = JSON.parse(localStorage.getItem("userdata"));
const userRole = userData?.role; // Fetch the user's role from local storage

// Determine which navbar to render based on user role
const renderNavbar = () => {
  switch (userRole) {
    case "retailer":
      return <RetailerNavbar />;
    case "distributor":
      return <DistributorsNavbar />;
    case "admin":
      return <AdminNav />;
    default:
      return null; // Return nothing if no role matches
  }
};

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userdata"));
      const userEmail = userData?.email;

      if (!userEmail) {
        throw new Error("User email not found");
      }

      const response = await fetch(
        `http://localhost:8000/api/invoices/email?email=${encodeURIComponent(userEmail)}`, {
          method: "GET", // Specify the request method if needed (GET is default)
          credentials: "include", // Include credentials with the request
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch invoices: ${errorText}`);
      }

      const data = await response.json();
      console.log("Fetched invoices:", data);

      if (data.length === 0) {
        setError("No invoices found");
      } else {
        // Sort invoices by createdAt date in descending order
        const sortedInvoices = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setInvoices(sortedInvoices);
        setSelectedInvoice(sortedInvoices[0]);
      }
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderInvoiceDetails = () => {
    if (!selectedInvoice) return null;

    return (
      <>
        {/* Render the appropriate navbar */}
        <div
          id="invoice-content"
          className="p-4 md:p-8 bg-gradient-to-r from-indigo-50 to-purple-50"
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-indigo-700">
              Invoice
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              #{selectedInvoice.invoiceNo}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            {renderInfoCard(
              "Order Date",
              formatDate(selectedInvoice.createdAt),
              "bg-blue-100"
            )}
            {renderInfoCard(
              "Acceptance Date",
              selectedInvoice.orderStatus === "accepted"
                ? formatDate(selectedInvoice.updatedAt)
                : "Pending",
              "bg-green-100"
            )}
            {renderInfoCard(
              "Delivery Before",
              formatDate(selectedInvoice.deliveryBefore),
              "bg-yellow-100"
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
            {renderContactCard(
              "Distributor",
              {
                name: selectedInvoice.distributorName,
                email: selectedInvoice.distributorEmail,
                phone: selectedInvoice.distributorPhone,
                address: selectedInvoice.distributorAddress,
              },
              "bg-indigo-100"
            )}
            {renderContactCard(
              "Retailer",
              {
                name: selectedInvoice.retailerName,
                email: selectedInvoice.retailerEmail,
                phone: selectedInvoice.retailerPhone,
                shopName: selectedInvoice.shopName,
                address: selectedInvoice.retailerAddress,
              },
              "bg-purple-100"
            )}
          </div>

          <div className="mb-8 bg-white p-4 md:p-6 rounded-lg shadow-lg border border-indigo-200">
            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-indigo-700 border-b pb-2">
              Product Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-2">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-indigo-50">
                        <th className="p-2 border-b">Product</th>
                        <th className="p-2 border-b">Quantity</th>
                        <th className="p-2 border-b">Price</th>
                        <th className="p-2 border-b">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.product ? (
                        <tr>
                          <td className="p-2 border-b">
                            {selectedInvoice.product.productName}
                          </td>
                          <td className="p-2 border-b">
                            {selectedInvoice.product.quantity}
                          </td>
                          <td className="p-2 border-b">
                          ₹:{selectedInvoice.product.price.toFixed(2)}
                          </td>
                          <td className="p-2 border-b">
                          ₹:{selectedInvoice.product.total.toFixed(2)}
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan="4" className="p-2 border-b text-center">
                            No product information available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold text-indigo-600">
                    Product Description
                  </h4>
                  <p className="text-gray-700">
                    {selectedInvoice.product?.productDescription ||
                      "No description available"}
                  </p>
                </div>
              </div>
              <div>
                {selectedInvoice.product?.productImage ? (
                  <img
                    src={selectedInvoice.product.productImage}
                    alt={selectedInvoice.product.productName}
                    className="w-full h-auto object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg">
                    <p className="text-gray-500">No image available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg border border-indigo-200">
              <h3 className="text-xl md:text-2xl font-semibold mb-4 text-indigo-700 border-b pb-2">
                Payment QR Code
              </h3>
              <div className="flex justify-center">
                <img
                  src={selectedInvoice.qrCodeImage}
                  alt="Payment QR Code"
                  className="w-36 h-36 md:w-48 md:h-48"
                />
              </div>
              <p className="text-center mt-4 text-sm text-gray-500">
                Scan to make payment
              </p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg border border-indigo-200">
              <h3 className="text-xl md:text-2xl font-semibold mb-4 text-indigo-700 border-b pb-2">
                Order Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-semibold">
                    {selectedInvoice.orderStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Net Amount:</span>
                  <span className="font-semibold">
                  ₹: {selectedInvoice.netAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Authorized Signature:</span>
                  <span className="font-semibold">
                    {selectedInvoice.authorizedSignature}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderInfoCard = (title, value, bgColor) => (
    <div className={`${bgColor} p-4 rounded-lg shadow-md`}>
      <h3 className="text-base md:text-lg font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-lg md:text-xl font-bold text-indigo-700">{value}</p>
    </div>
  );

  const renderContactCard = (title, info, bgColor) => (
    <div className={`${bgColor} p-4 md:p-6 rounded-lg shadow-md`}>
      <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 border-b pb-2">{title}</h3>
      {Object.entries(info).map(([key, value]) => (
        <p key={key} className="text-sm md:text-base text-gray-700 mb-1">
          <span className="font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}:</span> {value}
        </p>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500 text-xl">{error}</div>;
  }

  if (!invoices.length) {
    return <div className="text-center mt-8 text-xl">No invoices found</div>;
  }

  return (
    <>
      {renderNavbar()} 
   
    <div 
    className="max-w-6xl mx-auto p-4 md:p-6 bg-gradient-to-br from-indigo-50 to-purple-100 min-h-screen">
      <div className="mb-8 relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full p-4 bg-white rounded-lg shadow-md flex justify-between items-center hover:bg-indigo-50 transition duration-300"
        >
          <span className="font-semibold text-indigo-700">
            Invoice #{selectedInvoice?.invoiceNo}
          </span>
          <div className="flex items-center">
            <SortDesc className="text-indigo-500 mr-2" size={20} />
            {isDropdownOpen ? <ChevronUp className="text-indigo-500" /> : <ChevronDown className="text-indigo-500" />}
          </div>
        </button>
        {isDropdownOpen && (
          <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            {invoices.map((invoice) => (
              <button
                key={invoice._id}
                onClick={() => {
                  setSelectedInvoice(invoice);
                  setIsDropdownOpen(false);
                }}
                className="w-full p-2 text-left hover:bg-indigo-50 transition duration-300"
              >
                Invoice #{invoice.invoiceNo} - {invoice.companyName } ({formatDate(invoice.createdAt)})
              </button>
            ))}
          </div>
        )}
       
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 md:p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex flex-col md:flex-row justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-0">{selectedInvoice?.companyName} {"Distributors "}</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <PDFDownloadButton invoiceData={selectedInvoice} />
          </Suspense>
        </div>
        {renderInvoiceDetails()}
       
      </div>
    </div>
    </>
  );
};

export default InvoicePage;