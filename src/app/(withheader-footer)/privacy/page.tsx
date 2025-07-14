"use client";

const PrivacyPolicy = () => {
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
    { id: "information-collected", title: "2. Information We Collect" },
    { id: "how-we-use", title: "3. How We Use Your Information" },
    {
      id: "information-sharing",
      title: "4. Information Sharing and Disclosure",
    },
    { id: "data-security", title: "5. Data Security" },
    { id: "your-rights", title: "6. Your Rights and Choices" },
    { id: "cookies", title: "7. Cookies and Tracking Technologies" },
    { id: "third-party", title: "8. Third-Party Services" },
    { id: "children-privacy", title: "9. Children's Privacy" },
    {
      id: "international-transfers",
      title: "10. International Data Transfers",
    },
    { id: "changes-policy", title: "11. Changes to This Privacy Policy" },
    { id: "contact-us", title: "12. Contact Us" },
    { id: "compliance", title: "13. Compliance with Laws" },
  ];

  return (
    <>
      <section className="w-full py-10 lg:py-20 bg-cover bg-center bg-greenleaf lg:mb-20 ">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-5xl 2xl:text-6xl font-semibold mb-4">
                Privacy Policy
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
              <div className="top-content-badge mb-4">Privacy & Legal</div>
            </div>
          </div>
        </div>
      </section>

      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 ">
          <div className="max-w-4xl mx-auto">
            <div className=" rounded-xl  p-6 mb-8  ">
              <h2 className="text-2xl font-semibold hover:text-green-700 text-dark mb-6">
                Table of Contents
              </h2>
              <div className="grid  gap-3">
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

            <div className=" rounded-xl  p-8 space-y-8  ">
              <section id="introduction" className="scroll-mt-20">
                <h2 className="text-2xl font-semibold text-dark mb-6 flex items-center">
                  1. Introduction
                </h2>

                <p className="text-gray-700 leading-relaxed">
                  By using our services, you agree to the collection and use of
                  information in accordance with this policy. If you do not
                  agree with our policies and practices, please do not use our
                  services. By using our services, you agree to the collection
                  and use of information in accordance with this policy. If you
                  do not agree with our policies and practices, please do not
                  use our services.
                </p>
              </section>

              <section id="information-collected" className="scroll-mt-20">
                <h2 className="text-2xl font-semibold text-dark mb-6 flex items-center">
                  2. Information We Collect
                </h2>

                <h3 className="text-xl font-medium text-gray-800 mb-3">
                  2.1 Personal Information
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may collect the following personal information:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Name, email address, and phone number</li>
                  <li>Date of birth and gender</li>
                  <li>Medical history and health information</li>
                  <li>Prescription information and medication details</li>
                  <li>Billing and shipping addresses</li>
                  <li> shipping addresses</li>
                  <li>Lorem and shipping addresses</li>
                  <li>Billing  addresses</li>
                  <li>
                    Payment information (processed securely through third-party
                    providers)
                  </li>
                </ul>

                <h3 className="text-xl font-medium text-gray-800 mb-3">
                  2.2 Automatically Collected Information
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  When you visit our website or use our app, we automatically
                  collect:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>
                    Device information (IP address, browser type, operating
                    system)
                  </li>
                  <li>Usage data (pages visited, time spent, features used)</li>
                  <li>Location data (with your consent)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-800 mb-3">
                  2.3 Health Information
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  As a healthcare platform, we may collect sensitive health
                  information including medical conditions, prescriptions, and
                  treatment history. This information is protected under
                  applicable health privacy laws and regulations.
                </p>
              </section>

              <section id="how-we-use" className="scroll-mt-20">
                <h2 className="text-2xl font-semibold text-dark mb-6 flex items-center">
                  3. How We Use Your Information
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use the collected information for the following purposes:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Providing and maintaining our healthcare services</li>
                  <li>Processing prescriptions and medication orders</li>
                  <li>
                    Communicating with you about your health and treatment
                  </li>
                  <li>Improving our services and user experience</li>
                  <li>Ensuring compliance with healthcare regulations</li>
                  <li>Preventing fraud and ensuring security</li>
                  <li>Sending important updates and notifications</li>
                </ul>
              </section>

              <section id="information-sharing" className="scroll-mt-20">
                <h2 className="text-2xl font-semibold text-dark mb-6 flex items-center">
                  4. Information Sharing and Disclosure
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We do not sell, trade, or otherwise transfer your personal
                  information to third parties without your consent, except in
                  the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>
                    <strong>Healthcare Providers:</strong> We may share your
                    information with licensed healthcare professionals to
                    provide medical services
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law or
                    to protect our rights and safety
                  </li>
                  <li>
                    <strong>Service Providers:</strong> With trusted third-party
                    service providers who assist in operating our platform
                  </li>
                  <li>
                    <strong>Emergency Situations:</strong> In medical
                    emergencies where immediate action is required
                  </li>
                </ul>
              </section>

              <section id="data-security" className="scroll-mt-20">
                <h2 className="text-2xl font-semibold text-dark mb-6 flex items-center">
                  5. Data Security
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We implement appropriate technical and organizational security
                  measures to protect your personal information, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Encryption of sensitive data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Compliance with healthcare data protection standards</li>
                  <li>Employee training on data privacy and security</li>
                </ul>
              </section>

              <section id="your-rights" className="scroll-mt-20">
                <h2 className="text-2xl font-semibold text-dark mb-6 flex items-center">
                  6. Your Rights and Choices
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You have the following rights regarding your personal
                  information:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>
                    <strong>Access:</strong> Request access to your personal
                    information
                  </li>
                  <li>
                    <strong>Correction:</strong> Request correction of
                    inaccurate information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your personal
                    information (subject to legal requirements)
                  </li>
                  <li>
                    <strong>Portability:</strong> Request a copy of your data in
                    a portable format
                  </li>
                  <li>
                    <strong>Opt-out:</strong> Opt out of marketing
                    communications
                  </li>
                  <li>
                    <strong>Consent:</strong> Withdraw consent for data
                    processing where applicable
                  </li>
                </ul>
              </section>

              <section id="cookies" className="scroll-mt-20">
                <h2 className="text-2xl font-semibold text-dark mb-6 flex items-center">
                  7. Cookies and Tracking Technologies
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use cookies and similar technologies to enhance your
                  experience on our platform. These technologies help us:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze website traffic and usage patterns</li>
                  <li>Provide personalized content and recommendations</li>
                  <li>Ensure security and prevent fraud</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  You can control cookie settings through your browser
                  preferences, though disabling certain cookies may affect the
                  functionality of our services.
                </p>
              </section>

              <section id="third-party" className="scroll-mt-20">
                <h2 className="text-2xl font-semibold text-dark mb-6 flex items-center">
                  8. Third-Party Services
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our platform may contain links to third-party websites or
                  integrate with third-party services. We are not responsible
                  for the privacy practices of these external services. We
                  encourage you to review their privacy policies before
                  providing any personal information.
                </p>
              </section>

              <section id="children-privacy" className="scroll-mt-20">
                <h2 className="text-2xl font-semibold text-dark mb-6 flex items-center">
                  9. Children&apos;s Privacy
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Our services are not intended for children under the age of
                  13. We do not knowingly collect personal information from
                  children under 13. If you believe we have collected
                  information from a child under 13, please contact us
                  immediately.
                </p>
              </section>

              <section id="international-transfers" className="scroll-mt-20">
                <h2 className="text-2xl font-semibold text-dark mb-6 flex items-center">
                  10. International Data Transfers
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Your information may be transferred to and processed in
                  countries other than your own. We ensure that such transfers
                  comply with applicable data protection laws and implement
                  appropriate safeguards to protect your information.
                </p>
              </section>

              <section id="changes-policy" className="scroll-mt-20">
                <h2 className="text-2xl font-semibold text-dark mb-6 flex items-center">
                  11. Changes to This Privacy Policy
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will
                  notify you of any material changes by posting the new policy
                  on this page and updating the &quot;Last updated&quot; date.
                  We encourage you to review this policy periodically.
                </p>
              </section>

              <section id="contact-us" className="scroll-mt-20">
                <h2 className="text-2xl font-semibold text-dark mb-6 flex items-center">
                  12. Contact Us
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our
                  data practices, please contact us:
                </p>
                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <p className="text-gray-700 mb-3 font-medium">
                    <strong className="text-green-700">Email:</strong>{" "}
                    privacy@hilop.com
                  </p>
                  <p className="text-gray-700 mb-3 font-medium">
                    <strong className="text-green-700">Phone:</strong> +1 (234)
                    567-8900
                  </p>
                  <p className="text-gray-700 mb-3 font-medium">
                    <strong className="text-green-700">Address:</strong> 123
                    Herbal Lane, Nature City, Earth
                  </p>
                  <p className="text-gray-700 font-medium">
                    <strong className="text-green-700">
                      Data Protection Officer:
                    </strong>{" "}
                    dpo@hilop.com
                  </p>
                </div>
              </section>

              <section id="compliance" className="scroll-mt-20">
                <h2 className="text-2xl font-semibold text-dark mb-6 flex items-center">
                  13. Compliance with Laws
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  This Privacy Policy complies with applicable data protection
                  laws and regulations, including but not limited to the Health
                  Insurance Portability and Accountability Act (HIPAA), General
                  Data Protection Regulation (GDPR), and other relevant
                  healthcare privacy laws.
                </p>
              </section>
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-600 text-sm font-medium mb-10">
                This privacy policy is effective as of the date listed above and
                applies to all users of Hilop Health services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
