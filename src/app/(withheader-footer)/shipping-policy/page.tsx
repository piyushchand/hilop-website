"use client";

const Page = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  const tableOfContents = [
    { id: "introduction", title: "1. Introduction" },
    { id: "shipping-coverage", title: "2. Shipping Coverage" },
    { id: "processing-time", title: "3. Order Processing Time" },
    { id: "shipping-methods", title: "4. Shipping Methods & Delivery" },
    { id: "shipping-fees", title: "5. Shipping Fees" },
    { id: "order-tracking", title: "6. Order Tracking" },
    { id: "delays", title: "7. Delays & Issues" },
    { id: "address-changes", title: "8. Address Changes" },
    { id: "contact-us", title: "9. Contact Us" },
  ];

  return (
    <>
      <section className="w-full py-10 lg:py-20 bg-cover bg-center bg-greenleaf lg:mb-20 ">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-5xl 2xl:text-6xl font-semibold mb-4">
                Shipping Policy
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
              <div className="top-content-badge mb-4">Shipping & Delivery</div>
            </div>
          </div>
        </div>
      </section>

      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 ">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-semibold hover:text-green-700 text-dark mb-6">
                Table of Contents
              </h2>
              <div className="grid gap-3">
                {tableOfContents.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-left text-black hover:text-green-700 cursor-pointer transition-all duration-300 py-2 px-3 rounded-lg hover:bg-green-50 font-medium"
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl p-8 space-y-8">
              <section id="introduction" className="scroll-mt-20">
                <h2 className="text-2xl font-semibold text-dark mb-6 flex items-center">
                  1. Introduction
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  At Hilop Health, we are committed to delivering your products
                  quickly, safely, and efficiently. Please review our shipping
                  policy to understand how we process and deliver your orders.
                </p>
              </section>

              <section id="shipping-coverage" className="scroll-mt-20">
                <h2 className="text-2xl font-semibold text-dark mb-6 flex items-center">
                  2. Shipping Coverage
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We currently ship to all major cities and regions within
                  India. For international shipping, please contact our support
                  team before placing your order.
                </p>
              </section>

              <section id="processing-time" className="scroll-mt-20">
                <h2 className="text-2xl font-semibold text-dark mb-6 flex items-center">
                  3. Order Processing Time
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>
                    Orders are processed within 1-2 business days after payment
                    confirmation.
                  </li>
                  <li>
                    Orders placed on weekends or holidays will be processed on
                    the next business day.
                  </li>
                </ul>
              </section>

              <section id="shipping-methods" className="scroll-mt-20">
                <h2 className="text-2xl font-semibold text-dark mb-6 flex items-center">
                  4. Shipping Methods & Delivery
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>
                    We use reliable courier partners to ensure timely delivery.
                  </li>
                  <li>
                    Estimated delivery time is 3-7 business days for most
                    locations.
                  </li>
                  <li>
                    Remote or rural areas may require additional delivery time.
                  </li>
                </ul>
              </section>

              <section id="shipping-fees" className="scroll-mt-20">
                <h2 className="text-2xl font-semibold text-dark mb-6 flex items-center">
                  5. Shipping Fees
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>
                    Shipping charges are calculated at checkout based on your
                    location and order value.
                  </li>
                  <li>
                    We may offer free shipping promotions from time to time.
                    Please check our website for current offers.
                  </li>
                </ul>
              </section>

              <section id="order-tracking" className="scroll-mt-20">
                <h2 className="text-2xl font-semibold text-dark mb-6 flex items-center">
                  6. Order Tracking
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Once your order is shipped, you will receive a tracking number
                  via email or SMS. You can use this number to track your
                  shipment on the courier’s website.
                </p>
              </section>

              <section id="delays" className="scroll-mt-20">
                <h2 className="text-2xl font-semibold text-dark mb-6 flex items-center">
                  7. Delays & Issues
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>
                    While we strive for timely delivery, delays may occur due to
                    unforeseen circumstances (weather, strikes, etc.).
                  </li>
                  <li>
                    If your order is delayed beyond the estimated delivery time,
                    please contact our support team for assistance.
                  </li>
                </ul>
              </section>

              <section id="address-changes" className="scroll-mt-20">
                <h2 className="text-2xl font-semibold text-dark mb-6 flex items-center">
                  8. Address Changes
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Please ensure your shipping address is correct before placing
                  your order. Address changes after dispatch may not be possible
                  and could result in additional charges or delays.
                </p>
              </section>

              <section id="contact-us" className="scroll-mt-20">
                <h2 className="text-2xl font-semibold text-dark mb-6 flex items-center">
                  9. Contact Us
                </h2>
                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <p className="text-gray-700 mb-3 font-medium">
                    <strong className="text-green-700">Email:</strong>{" "}
                    support@hilop.com
                  </p>
                  <p className="text-gray-700 mb-3 font-medium">
                    <strong className="text-green-700">Phone:</strong> +1 (234)
                    567-8900
                  </p>
                  <p className="text-gray-700 font-medium">
                    <strong className="text-green-700">Address:</strong> 123
                    Herbal Lane, Nature City, Earth
                  </p>
                </div>
              </section>
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-600 text-sm font-medium mb-10">
                This shipping policy is effective as of the date listed above
                and applies to all orders placed on Hilop Health.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
