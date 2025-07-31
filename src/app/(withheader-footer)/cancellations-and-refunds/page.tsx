"use client";
import React from "react";

const HighlightBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-6 text-yellow-900 text-sm font-medium">
    {children}
  </div>
);

const Page = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full py-10 lg:py-20 bg-cover bg-center bg-greenleaf lg:mb-20 ">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-5xl 2xl:text-6xl font-semibold mb-4">
                Cancellations & Refunds Policy
              </h1>
              <p className="text-gray-600 text-lg font-medium">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="text-center md:text-right">
              <div className="top-content-badge mb-4">Customer Care</div>
            </div>
          </div>
        </div>
      </section>

      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 ">
          <div className="max-w-4xl mx-auto flex flex-col gap-10">
            {/* Main Content */}
            <div className="rounded-xl p-6 md:p-8 space-y-10 bg-white shadow-sm">
              {/* Introduction */}
              <section id="introduction" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-3">Introduction</h2>
                <p className="text-gray-700 leading-relaxed">
                  At Hilop Health, we strive to provide the best experience for
                  our customers. Please read our Cancellations & Refunds Policy
                  carefully to understand your rights and obligations regarding
                  order cancellations, returns, and refunds.
                </p>
              </section>

              {/* Order Cancellations */}
              <section id="cancellations" className="scroll-mt-24">
                <h2 className="text-xl font-semibold mb-2">
                  Order Cancellations
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>
                    Orders can be cancelled before they are processed or
                    shipped. To cancel, please contact our support team as soon
                    as possible.
                  </li>
                  <li>
                    Once an order has been shipped, it cannot be cancelled. You
                    may, however, be eligible for a return or refund as per our
                    policy below.
                  </li>
                  <li>
                    Subscription services can be cancelled at any time before
                    the next billing cycle.
                  </li>
                </ul>
              </section>

              {/* Returns & Exchanges */}
              <section id="returns" className="scroll-mt-24">
                <h2 className="text-xl font-semibold mb-2">
                  Returns & Exchanges
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>
                    We accept returns for eligible products within 7 days of
                    delivery, provided the item is unused, unopened, and in its
                    original packaging.
                  </li>
                  <li>
                    Certain products, such as prescription medicines, opened
                    health products, or items marked as non-returnable, are not
                    eligible for return due to health and safety regulations.
                  </li>
                  <li>
                    If you receive a damaged, defective, or incorrect item,
                    please contact us within 48 hours of delivery with
                    supporting photos for a prompt resolution.
                  </li>
                  <li>
                    Exchanges are subject to product availability and approval
                    by our support team.
                  </li>
                </ul>
              </section>

              {/* Refunds */}
              <section id="refunds" className="scroll-mt-24">
                <h2 className="text-xl font-semibold mb-2">Refunds</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>
                    Approved refunds will be processed to your original payment
                    method within 7-10 business days after we receive and
                    inspect the returned item.
                  </li>
                  <li>
                    Shipping charges are non-refundable unless the return is due
                    to our error (damaged, defective, or incorrect item).
                  </li>
                  <li>
                    If you have not received your refund within the specified
                    timeframe, please contact your bank or payment provider
                    first, then reach out to our support team if needed.
                  </li>
                </ul>
              </section>

              {/* Exceptions & Non-Returnable Items */}
              <section id="exceptions" className="scroll-mt-24">
                <h2 className="text-xl font-semibold mb-2">
                  Exceptions & Non-Returnable Items
                </h2>
                <HighlightBox>
                  <strong>Note:</strong> For health and safety reasons, the
                  following items are not eligible for return or refund:
                  <ul className="list-disc list-inside mt-2">
                    <li>Opened or used health and wellness products</li>
                    <li>Prescription medicines</li>
                    <li>Personal care items</li>
                    <li>
                      Items marked as Non-Returnable at the time of purchase
                    </li>
                  </ul>
                </HighlightBox>
              </section>

              {/* How to Request a Cancellation, Return, or Refund */}
              <section id="how-to" className="scroll-mt-24">
                <h2 className="text-xl font-semibold mb-2">
                  How to Request a Cancellation, Return, or Refund
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>
                    Contact our support team at{" "}
                    <a
                      href="mailto:support@hilop.com"
                      className="text-primary underline"
                    >
                      support@hilop.com
                    </a>{" "}
                    or call +91 12345 67890.
                  </li>
                  <li>
                    Provide your order number, contact details, and a brief
                    description of your request.
                  </li>
                  <li>
                    For returns, include clear photos of the product and
                    packaging (if applicable).
                  </li>
                  <li>
                    Our team will review your request and guide you through the
                    next steps.
                  </li>
                </ul>
              </section>

              {/* Policy Updates */}
              <section id="updates" className="scroll-mt-24">
                <h2 className="text-xl font-semibold mb-2">Policy Updates</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Cancellations & Refunds Policy from time to
                  time. Changes will be posted on this page with an updated
                  effective date. Your continued use of our services after
                  changes are posted constitutes your acceptance of the revised
                  policy.
                </p>
              </section>

              {/* Contact Us */}
              <section id="contact" className="scroll-mt-24">
                <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about this policy or need
                  assistance, please contact us:
                </p>
                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <p className="text-gray-700 mb-3 font-medium">
                    <strong className="text-green-700">Email:</strong>{" "}
                    support@hilop.com
                  </p>
                  <p className="text-gray-700 mb-3 font-medium">
                    <strong className="text-green-700">Phone:</strong> +91 12345
                    67890
                  </p>
                  <p className="text-gray-700 font-medium">
                    <strong className="text-green-700">Address:</strong> 123
                    Herbal Lane, Nature City, India
                  </p>
                </div>
              </section>
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-600 text-sm font-medium mb-10">
                This Cancellations & Refunds Policy is effective as of the date
                listed above and applies to all users of Hilop Health Services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
