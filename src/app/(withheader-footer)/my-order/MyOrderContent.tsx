"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import Button from "@/components/uiFramework/Button";
import Image from "next/image";
import Modal from "@/components/animationComponents/animated-model";
import { OrderService, Order } from "@/services/orderService";
import LoadingSpinner from "@/components/LoadingSpinner";
import {toast,  Toaster} from "react-hot-toast";

// Types for the component
type OrderStatus = "processing" | "delivered" | "cancelled" | "shipped" | "pending";

const filterOptions: Array<"All" | OrderStatus> = ["All", "processing", "delivered", "cancelled", "shipped", "pending"];

export default function MyOrder() {
  const [activeFilter, setActiveFilter] = useState<(typeof filterOptions)[number]>("All");
  const [modalOrder, setModalOrder] = useState<Order | null>(null);
  const [visibleCount, setVisibleCount] = useState(4);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [invoiceDownloading, setInvoiceDownloading] = useState(false);

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await OrderService.getOrderList();
        if (response.success) {
          setOrders(response.data);
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

  const filteredOrders = activeFilter === "All" 
    ? orders 
    : orders.filter((order) => order.status === activeFilter);

  const visibleOrders = filteredOrders.slice(0, visibleCount);

  // Get available statuses that have orders
  const getAvailableStatuses = () => {
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Always include "All" and add statuses that have orders
    return ["All", ...filterOptions.filter(status => status !== "All" && statusCounts[status])] as Array<"All" | OrderStatus>;
  };

  const getStatusCount = (status: "All" | OrderStatus) => {
    if (status === "All") return orders.length;
    return orders.filter(order => order.status === status).length;
  };

  const availableStatuses = getAvailableStatuses();

  // Reset activeFilter if current filter is not available
  useEffect(() => {
    if (!availableStatuses.includes(activeFilter)) {
      setActiveFilter("All");
    }
  }, [availableStatuses, activeFilter]);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const handleOrderClick = async (order: Order) => {
    try {
      setModalLoading(true);
      const response = await OrderService.getOrderDetail(order._id);
      if (response.success) {
        setModalOrder(response.data);
      } else {
        console.error("Failed to fetch order details");
        // Fallback to basic order data
        setModalOrder(order);
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
      // Fallback to basic order data
      setModalOrder(order);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDownloadInvoice = async (orderId: string) => {
    try {
      setInvoiceDownloading(true);
      const result = await OrderService.downloadInvoice(orderId);
      
      if (result.success && 'data' in result && result.data) {
        console.log('Invoice download response:', result.data);
        
        // Handle the API response format you showed
        if (result.data.pdf_base64) {
          try {
            // Convert base64 to blob and download
            const byteCharacters = atob(result.data.pdf_base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = result.data.filename || `invoice-${orderId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            console.log('PDF downloaded successfully:', result.data.filename);
            toast.success('Invoice downloaded successfully!');
          } catch (base64Error) {
            console.error('Error converting base64 to PDF:', base64Error);
            toast.error('Error processing PDF data. Please try again.');
          }
        } else {
          console.error('No PDF data found in response:', result.data);
          alert('No invoice data available for download.');
        }
      } else {
        console.error('Failed to download invoice:', result);
        const errorMessage = 'error' in result ? result.error : 'Unknown error';
        alert(`Failed to download invoice: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Error downloading invoice. Please try again.');
    } finally {
      setInvoiceDownloading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatAddress = (address: Order['shipping_address']) => {
    if (!address) return '';
    const parts = [
      address.address,
      address.landmark,
      address.city,
      address.state,
      address.zipcode,
      address.country
    ].filter(Boolean);
    return parts.join(", ");
  };

  if (loading) {
    return (
      <>
      <section className="w-full bg-gray-100 mb-16 lg:mb-40">
        <div className="container lg:mt-20 mt-10">
          <h1 className="text-5xl 2xl:text-6xl font-semibold mb-6 lg:mb-10">
            My Orders
          </h1>
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner isVisible={true} />
          </div>
        </div>
      </section>
      </>
    );
  }

  return (
    <>
      <Toaster position="bottom-right" />
      <section className="w-full bg-gray-100 mb-16 lg:mb-40">
        <div className="container lg:mt-20 mt-10">
          <h1 className="text-5xl 2xl:text-6xl font-semibold mb-6 lg:mb-10">
            My Orders
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {orders.length > 0 && (
            <Swiper
              spaceBetween={16}
              slidesPerView="auto"
              className="mb-8"
              centeredSlides={false}
            >
              {availableStatuses.map((status) => (
                <SwiperSlide key={status} className="!w-fit">
                  <Button
                    onClick={() => {
                      setActiveFilter(status);
                      setVisibleCount(4);
                    }}
                    className="w-full"
                    label={`${status.charAt(0).toUpperCase() + status.slice(1)}${status !== "All" ? ` (${getStatusCount(status)})` : ''}`}
                    variant={activeFilter === status ? "btn-primary" : "btn-light"}
                    size="xl"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          {/* Orders Grid */}
          {visibleOrders.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {visibleOrders.map((order) => (
                  <div
                    key={order._id}
                    onClick={() => handleOrderClick(order)}
                    className="bg-white rounded-lg border border-gray-200 transition-shadow cursor-pointer hover:shadow-lg flex flex-col"
                  >
                    <div className="flex px-5 py-3 justify-between items-center border-b border-gray-200">
                      <div>
                        <h3 className="text-lg font-medium text-dark mb-1">
                          {order.order_number}
                        </h3>
                        <p className="text-gray-700">
                          Order ID: {order._id.slice(-8)}
                        </p>
                      </div>
                      <div>
                        <p className="text-lg text-gray-800 font-medium">
                          {formatDate(order.createdAt)}
                        </p>
                        <p className="text-gray-700 text-end">
                          {formatTime(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col gap-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex gap-4 items-center border-b last:border-0 pb-3 last:pb-0 border-gray-200">
                          <Image
                            src={item.image || "/images/placeholder.svg"}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-lg object-cover bg-gray-200"
                          />
                          <div>
                            <p className="text-lg text-gray-700 mb-1 line-clamp-2">
                              {item.name}
                            </p>
                            <p className="text-base font-medium text-dark">
                              Qty: {item.quantity} {item.price ? `× ${item.price.toFixed(2)}` : ''}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-5 border-t border-gray-200 flex justify-between items-center mt-auto">
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusColor(order.status)}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-dark">
                          {order.total ? order.total.toFixed(2) : '0.00'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {visibleOrders.length < filteredOrders.length && (
                <div className="mt-8 flex justify-center">
                  <Button
                    label="Show More"
                    onClick={handleShowMore}
                    variant="btn-dark"
                    size="xl"
                    className="text-center"
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-500 py-20">
              No orders found for &ldquo;{activeFilter}&rdquo;.
            </p>
          )}

          {/* Order Detail Modal */}
          {modalOrder && (
            <Modal
              className="max-w-sm w-full h-fit rounded-lg overflow-hidden shadow-lg"
              isOpen={!!modalOrder}
              onClose={() => setModalOrder(null)}
            >
              {modalLoading ? (
                <div className="p-8 flex justify-center">
                  <LoadingSpinner isVisible={true} />
                </div>
              ) : (
                <>
                  <h2 className="text-lg md:text-2xl font-semibold p-6 border-b border-gray-200">
                    {modalOrder.order_number}
                  </h2>
                  <div className="max-h-[70vh] overflow-y-auto">
                    {/* Order Info */}
                    <div className="p-6 flex items-center justify-between border-gray-200">
                      <p className="text-gray-700 text-sm">
                        Order ID: {modalOrder._id.slice(-8)}
                      </p>
                      <p className="text-gray-700 text-sm">{formatDate(modalOrder.createdAt)}</p>
                    </div>

                    {/* Items */}
                    <div className="px-6 border-gray-200">
                      <h3 className="font-medium text-dark text-lg mb-3">Order Items</h3>
                      <div className="flex flex-col gap-3">
                        {modalOrder.items.map((item, i) => (
                          <div
                            key={i}
                            className="flex gap-4 items-center border-b last:border-0 pb-3 last:pb-0 border-gray-200"
                          >
                            <Image
                              src={item.image || "/images/placeholder.svg"}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="w-20 h-20 rounded-lg object-cover bg-gray-200"
                            />
                            <div className="flex-1">
                              <p className="text-lg text-dark font-medium mb-1 line-clamp-2">{item.name}</p>
                              <p className="text-md mb-1 text-gray-600">
                                Qty: {item.quantity} {item.price ? `× $${item.price.toFixed(2)}` : ''}
                              </p>
                              <p className="text-sm text-gray-600">
                                Total: ₹{item.total ? item.total.toFixed(2) : '0.00'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    {modalOrder.shipping_address && (
                      <div className="p-6 border-b border-gray-200">
                        <h3 className="font-medium text-dark text-lg mb-3">Shipping Address</h3>
                          <p className="text-gray-600 mt-2">{formatAddress(modalOrder.shipping_address)}</p>
                      </div>
                    )}

                    {/* Order Summary */}
                    <div className="p-6 bg-gray-100 flex flex-col gap-3">
                      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <p className="text-dark">Subtotal</p>
                        <p className="text-gray-600 font-medium">
                          ${modalOrder.subtotal ? modalOrder.subtotal.toFixed(2) : '0.00'}
                        </p>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <p className="text-dark">Shipping Fee</p>
                        <p className="text-gray-600 font-medium">
                          ${modalOrder.shipping_fee ? modalOrder.shipping_fee.toFixed(2) : '0.00'}
                        </p>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <p className="text-dark">Tax</p>
                        <p className="text-gray-600 font-medium">
                          ${modalOrder.tax ? modalOrder.tax.toFixed(2) : '0.00'}
                        </p>
                      </div>
                      {(modalOrder.hilop_coins_discount || 0) > 0 && (
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                          <p className="text-dark">Hilop Coins Discount</p>
                          <p className="text-green-800 font-medium">
                            -${(modalOrder.hilop_coins_discount || 0).toFixed(2)}
                          </p>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-3">
                        <p className="text-dark font-semibold text-lg">Total Amount</p>
                        <Button
                          label={`$${modalOrder.total ? modalOrder.total.toFixed(2) : '0.00'}`}
                          variant="btn-dark"
                          size="xl"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadInvoice(modalOrder._id)}
                    disabled={invoiceDownloading}
                    className="text-green-800 hover:underline p-6 text-center font-semibold block border-t border-gray-200 w-full bg-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {invoiceDownloading ? 'Downloading...' : 'Download invoice'}
                  </button>
                </>
              )}
            </Modal>
          )}
        </div>
      </section>
    </>
  );
}
