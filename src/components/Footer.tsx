'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Accordion from './uiFramework/Accordion';
import { Facebook, Github, Instagram, LinkIcon, Mail, MailCheck, Phone, Twitter } from 'lucide-react';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(
    new Date().getFullYear().toString()
  );

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  const accordionItems = [
    {
      title: 'Digital transform',
      links: [
        { link: '/', linkText: 'MVP Development' },
        { link: '/', linkText: 'UI / UX Design' },
        { link: '/', linkText: 'Web Application' },
        { link: '/', linkText: 'SAAS Development' },
        { link: '/', linkText: 'Mobile App Development' },
      ],
    },
    {
      title: 'Cloud and DevOps engineering',
      links: [
        { link: '/', linkText: 'aws' },
        { link: '/', linkText: 'Azure' },
        { link: '/', linkText: 'Google Cloud Platform' },
      ],
    },
  ];
  return (
    <footer className="px-4 pb-4">
      <div className="overflow-hidden rounded-2xl bg-black pt-[100px]">
        <div className="container">
          <div className="grid gap-x-4 gap-y-8 border-b border-gray-700 pb-10 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-12">
            <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
              <Link
                href="/"
                className="mb-5"
              >
                <Image
                  src="/image/logotnwhite.svg"
                  alt="thinknovus logo"
                  width={236}
                  height={40}
                />
              </Link>
              <div>
                <label
                  htmlFor="price"
                  className="mt-5 inline-block text-xl text-white"
                >
                  Subscribe our newsletters
                </label>
                <div className="mt-5">
                  <div className="hover:ring-primary-800 flex items-center rounded-md bg-gray-800 transition-all duration-300 hover:ring-2">
                    <input
                      id="price"
                      name="price"
                      type="text"
                      placeholder="Email *"
                      className="min-w-0 grow border-none bg-transparent px-5 py-3 text-base text-gray-400 placeholder:text-gray-600 focus:outline-none"
                    />
                    <Link
                      href="/"
                      className="px-3 py-3 text-gray-400 hover:text-primary"
                      aria-label="Subscribe to newsletter"
                    >
                      <MailCheck className="" />
                    </Link>
                  </div>
                </div>
              </div>
              <div>
                <p className="mb-5 mt-5 text-base text-white">Social</p>
                <div className="flex flex-wrap gap-2 sm:gap-2">
                  <Link
                    href="https://www.instagram.com/think.novus/"
                    className="social-icon"
                    aria-label="Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram />
                  </Link>
                  <Link
                    href="https://www.linkedin.com/company/think-novus/"
                    className="social-icon"
                    aria-label="Linkedin"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkIcon />
                  </Link>
                  <Link
                    href="https://www.facebook.com/thinknovus.official/"
                    className="social-icon"
                    aria-label="Facebook"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook />
                  </Link>
                  <Link
                    href="https://x.com/thinknovus"
                    className="social-icon"
                    aria-label="Twitter"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter />
                  </Link>
                  <Link
                    href="https://github.com/mitulkanani"
                    className="social-icon"
                    aria-label="Github"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github />
                  </Link>

                
                </div>
              </div>
            </div>
            <div className="sm:col-span-1 md:col-span-3 lg:col-span-3">
              <p className="mb-6 text-base uppercase text-white">Services</p>
              <Link
                href="/"
                className="custome-text-hover mb-4 block text-white"
              >
                AI and Data Consulting
              </Link>
              <Accordion items={accordionItems} />
            </div>
            <div className="sm:col-span-1 md:col-span-3 lg:col-span-2">
              <p className="mb-6 text-base uppercase text-white">Industry</p>
              <Link
                href="/"
                className="custome-text-hover mb-4 block text-white"
              >
                Healthcare
              </Link>
              <Link
                href="/"
                className="custome-text-hover mb-4 block text-white"
              >
                Logistics
              </Link>
              <Link
                href="/"
                className="custome-text-hover block text-white"
              >
                E-Commerce
              </Link>
            </div>
            <div className="sm:col-span-2 md:col-span-3 lg:col-span-3">
              <p className="mb-6 text-base uppercase text-white">
                business inquiries
              </p>
              <Link
                href="mailto:hello@thinknovus.com"
                className="mb-4 flex items-center gap-2"
              >
                <Mail className="text-white opacity-60" />
                <span className="custome-text-hover text-white">
                  {' '}
                  hello@thinknovus.com
                </span>
              </Link>
              <Link
                href="tel:+919033680165"
                className="mb-4 flex items-center gap-2"
              >
                <Phone className="text-white opacity-60" />
                <span className="custome-text-hover text-white">
                  {' '}
                  (+91) 9033680165
                </span>
              </Link>
              <p className="mb-2 text-xl text-gray-200">Book a Call</p>
              <p className="mb-4 text-gray-400">
                A 30-min Discovery call to see how we can help
              </p>

              <div>
                <figure className="flex items-center rounded-full border border-gray-800 bg-gray-800 p-3 duration-300 hover:bg-gray-900 hover:transition-all">
                  <video
                    className="h-11 w-11 rounded-full"
                    preload="auto"
                    autoPlay
                    playsInline
                    loop
                    muted
                    width="44"
                  >
                    <source
                      src="/videos/memojicall.mp4"
                      type="video/mp4"
                    />
                  </video>
                  <div className="ml-3">
                    <p className="text-white">Mitul kanani</p>
                    <p className="text-gray-400">
                      Co-Founder & Creative Director
                    </p>
                  </div>
                </figure>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 items-center gap-y-2 py-4 md:grid-cols-2">
            <div className="basis-auto text-center md:basis-1/4 md:text-left">
              <p className="text-gray-400">
                &copy; {currentYear} Thinknovus. All rights reserved.
              </p>
            </div>
            <div className="text-end">
              <div className="items-center justify-center sm:flex md:justify-end">
                <div className="flex items-center justify-center">
                  <Link
                    href="/"
                    className="custome-text-hover text-nowrap px-3 text-white"
                  >
                    About Us
                  </Link>
                  <div className="h-4 w-[1] border border-gray-700"></div>
                  <Link
                    href="/"
                    className="custome-text-hover text-nowrap px-3 text-white"
                  >
                    Career
                  </Link>
                </div>
                <div className="hidden h-4 w-[1] border border-gray-700 sm:block"></div>
                <div className="flex items-center justify-center">
                  <Link
                    href="/"
                    className="custome-text-hover col-start-auto col-end-auto text-nowrap px-3 text-white"
                  >
                    Privacy Policy
                  </Link>
                  <div className="h-4 w-[1] border border-gray-700"></div>
                  <Link
                    href="/"
                    className="custome-text-hover col-start-auto col-end-auto text-nowrap px-3 text-white"
                  >
                    Site Map
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
