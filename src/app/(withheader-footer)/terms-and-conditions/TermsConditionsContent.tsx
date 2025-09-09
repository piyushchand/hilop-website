"use client";
import React from "react";

const HighlightBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-6 text-yellow-900 text-sm font-medium">
    {children}
  </div>
);

const TermsAndConditions = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full py-10 lg:py-20 bg-cover bg-center bg-greenleaf lg:mb-20 ">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-5xl 2xl:text-6xl font-semibold mb-4">
                Terms & Conditions
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
              <div className="top-content-badge mb-4">Legal</div>
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
                  Welcome to Hilop Health. These Terms &amp; Conditions
                  (&quot;Terms&quot;) govern your access to and use of our
                  website, products, and services (collectively, the
                  &quot;Services&quot;). By using our Services, you agree to
                  these Terms. Please read them carefully. If you do not agree,
                  you may not use our Services.
                </p>
              </section>

              {/* Eligibility & Acceptance */}
              <section id="eligibility" className="scroll-mt-24">
                <h2 className="text-xl font-semibold mb-2">
                  Eligibility & Acceptance
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  You must be at least 18 years old and capable of entering into
                  a legally binding agreement to use our Services. By using our
                  Services, you represent and warrant that you meet these
                  requirements. If you use our Services on behalf of another
                  person or entity, you represent that you have authority to
                  bind them to these Terms.
                </p>
              </section>

              {/* Account Registration & Security */}
              <section id="account" className="scroll-mt-24">
                <h2 className="text-xl font-semibold mb-2">
                  Account Registration & Security
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>
                    Some features require you to create an account and provide
                    accurate, complete information.
                  </li>
                  <li>
                    You are responsible for maintaining the confidentiality of
                    your account credentials and for all activities under your
                    account.
                  </li>
                  <li>
                    Notify us immediately of any unauthorized use or security
                    breach of your account.
                  </li>
                  <li>
                    We reserve the right to suspend or terminate accounts at our
                    discretion.
                  </li>
                </ul>
              </section>

              {/* Permitted Use & Restrictions */}
              <section id="use" className="scroll-mt-24">
                <h2 className="text-xl font-semibold mb-2">
                  Permitted Use & Restrictions
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>
                    Our Services are for your personal, non-commercial use only.
                  </li>
                  <li>
                    You may not use our Services for any unlawful, harmful, or
                    fraudulent purpose.
                  </li>
                  <li>
                    You must not attempt to gain unauthorized access to any part
                    of our systems or data.
                  </li>
                  <li>
                    You may not copy, modify, distribute, or reverse engineer
                    any part of our Services except as permitted by law.
                  </li>
                  <li>
                    You must not upload or transmit any viruses, malware, or
                    harmful code.
                  </li>
                  <li>
                    Impersonation, harassment, or abusive conduct is strictly
                    prohibited.
                  </li>
                  <li>
                    We reserve the right to suspend or terminate your access for
                    any violation of these Terms.
                  </li>
                </ul>
              </section>

              {/* Orders, Subscriptions & Payments */}
              <section id="orders" className="scroll-mt-24">
                <h2 className="text-xl font-semibold mb-2">
                  Orders, Subscriptions & Payments
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>
                    All orders are subject to acceptance and availability. We
                    may refuse or cancel any order at our discretion.
                  </li>
                  <li>
                    Some products or services may be offered on a subscription
                    basis. By subscribing, you authorize recurring charges until
                    you cancel.
                  </li>
                  <li>
                    Prices, payment terms, and billing cycles will be clearly
                    disclosed at checkout. We may change prices at any time, but
                    changes will not affect orders already placed.
                  </li>
                  <li>
                    You are responsible for providing valid payment information
                    and ensuring sufficient funds for transactions.
                  </li>
                  <li>
                    We use secure third-party payment processors. We are not
                    responsible for errors or losses caused by payment
                    providers.
                  </li>
                </ul>
              </section>

              {/* Shipping, Delivery & Risk of Loss */}
              <section id="shipping" className="scroll-mt-24">
                <h2 className="text-xl font-semibold mb-2">
                  Shipping, Delivery & Risk of Loss
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>
                    Delivery timelines are estimates and may be affected by
                    factors beyond our control.
                  </li>
                  <li>
                    We are not liable for delays caused by third-party carriers
                    or unforeseen circumstances.
                  </li>
                  <li>
                    Product availability is subject to change. If a product is
                    unavailable after you place an order, we will notify you and
                    issue a refund if applicable.
                  </li>
                  <li>
                    Risk of loss and title for products pass to you upon
                    delivery.
                  </li>
                </ul>
              </section>

              {/* Cancellations, Returns & Refunds */}
              <section id="returns" className="scroll-mt-24">
                <h2 className="text-xl font-semibold mb-2">
                  Cancellations, Returns & Refunds
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>
                    You may cancel orders or subscriptions as permitted by our
                    policies and applicable law.
                  </li>
                  <li>
                    Refunds will be processed to your original payment method
                    within a reasonable timeframe.
                  </li>
                  <li>
                    Some products (such as prescription items or opened health
                    products) may not be eligible for return due to health and
                    safety regulations.
                  </li>
                  <li>
                    For details, please refer to our Refunds & Returns Policy or
                    contact our support team.
                  </li>
                </ul>
              </section>

              {/* User Content & Conduct */}
              <section id="user-content" className="scroll-mt-24">
                <h2 className="text-xl font-semibold mb-2">
                  User Content & Conduct
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>
                    You are responsible for any content you submit, post, or
                    share on our platform.
                  </li>
                  <li>
                    You must not post content that is unlawful, offensive, or
                    infringes on the rights of others.
                  </li>
                  <li>
                    We reserve the right to remove any content that violates
                    these Terms or our policies.
                  </li>
                </ul>
              </section>

              {/* Privacy & Data Security */}
              <section id="privacy" className="scroll-mt-24">
                <h2 className="text-xl font-semibold mb-2">
                  Privacy & Data Security
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Your privacy is important to us. Please review our{" "}
                  <a href="/privacy-policy" className="text-primary underline">
                    Privacy Policy
                  </a>{" "}
                  to understand how we collect, use, and protect your
                  information.
                </p>
                <HighlightBox>
                  <strong>Note:</strong> Health-related information is handled
                  with strict confidentiality and in accordance with applicable
                  laws.
                </HighlightBox>
              </section>

              {/* Intellectual Property */}
              <section id="intellectual" className="scroll-mt-24">
                <h2 className="text-xl font-semibold mb-2">
                  Intellectual Property
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>
                    All content, trademarks, logos, and intellectual property on
                    our website are owned by Hilop Health or our licensors.
                  </li>
                  <li>
                    You may not use, reproduce, or distribute any content
                    without our express written permission.
                  </li>
                  <li>
                    We reserve the right to modify, suspend, or discontinue any
                    part of our Services at any time.
                  </li>
                  <li>
                    Feedback or suggestions you provide may be used by us
                    without compensation or acknowledgment.
                  </li>
                </ul>
              </section>

              {/* Disclaimers & Limitation of Liability */}
              <section id="disclaimers" className="scroll-mt-24">
                <h2 className="text-xl font-semibold mb-2">
                  Disclaimers & Limitation of Liability
                </h2>
                <HighlightBox>
                  <strong>Important:</strong> Health-related information on our
                  platform is for informational purposes only and is not a
                  substitute for professional medical advice, diagnosis, or
                  treatment. Always consult a qualified healthcare provider for
                  medical concerns.
                </HighlightBox>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To the maximum extent permitted by law, Hilop Health and its
                  affiliates, officers, employees, and agents shall not be
                  liable for any indirect, incidental, special, consequential,
                  or punitive damages, or any loss of profits or revenues,
                  whether incurred directly or indirectly, or any loss of data,
                  use, goodwill, or other intangible losses, resulting from your
                  use of or inability to use our Services.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Your use of or inability to use our Services;</li>
                  <li>
                    Any unauthorized access to or use of our servers and/or any
                    personal information stored therein;
                  </li>
                  <li>
                    Any interruption or cessation of transmission to or from our
                    Services;
                  </li>
                  <li>
                    Any bugs, viruses, or harmful code transmitted through our
                    platform by any third party;
                  </li>
                  <li>
                    Any errors or omissions in any content or for any loss or
                    damage incurred as a result of your use of any content
                    posted, emailed, transmitted, or otherwise made available
                    through our Services.
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  In no event shall our total liability exceed the amount you
                  paid to us for the applicable product or service.
                </p>
              </section>

              {/* Indemnification */}
              <section id="indemnity" className="scroll-mt-24">
                <h2 className="text-xl font-semibold mb-2">Indemnification</h2>
                <p className="text-gray-700 leading-relaxed">
                  You agree to indemnify, defend, and hold harmless Hilop
                  Health, its affiliates, officers, employees, and agents from
                  and against any claims, liabilities, damages, losses, and
                  expenses, including reasonable fees, arising out of or in any
                  way connected with your access to or use of our Services, your
                  violation of these Terms, or your infringement of any rights
                  of another.
                </p>
              </section>

              {/* Governing Law & Dispute Resolution */}
              <section id="governing-law" className="scroll-mt-24">
                <h2 className="text-xl font-semibold mb-2">
                  Governing Law & Dispute Resolution
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  These Terms are governed by the laws of India, without regard
                  to its conflict of law principles. Any disputes arising from
                  or relating to these Terms or your use of our Services shall
                  be subject to the exclusive jurisdiction of the courts located
                  in [Your City, India].
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Before initiating any legal action, you agree to attempt to
                  resolve any dispute with us informally by contacting our
                  support team. If a resolution cannot be reached, the dispute
                  will be resolved through binding arbitration or mediation, as
                  required by applicable law.
                </p>
              </section>

              {/* Changes to Terms */}
              <section id="changes" className="scroll-mt-24">
                <h2 className="text-xl font-semibold mb-2">Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update these Terms from time to time. Changes will be
                  posted on this page with an updated effective date. Your
                  continued use of our Services after changes are posted
                  constitutes your acceptance of the revised Terms.
                </p>
              </section>

              {/* Contact Us */}
              <section id="contact" className="scroll-mt-24">
                <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about these Terms & Conditions or
                  our Services, please contact us:
                </p>
                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <p className="text-gray-700 mb-3 font-medium">
                    <strong className="text-green-700">Email:</strong>{" "}
                    info@hilop.com
                  </p>
                  <p className="text-gray-700 mb-3 font-medium">
                    <strong className="text-green-700">Phone:</strong> +91
                    9998852888
                  </p>
                </div>
              </section>

              <div className="text-center mt-8">
                <p className="text-gray-600 text-sm font-medium mb-10">
                  These Terms & Conditions are effective as of the date listed
                  above and apply to all users of Hilop Health Services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;
