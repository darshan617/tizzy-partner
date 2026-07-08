import React, { useState } from "react";
import styles from "@/components/help-center/HelpCenter.module.css";
import Link from "next/link";
import logo from "@/assets/signup/logo-1.png";
import leftImage from "@/assets/images/cuate.png";
import rightImage from "@/assets/images/cuate-1.png";
import { FaSearch } from "react-icons/fa";
import { BiChevronDown } from "react-icons/bi";
import { FiMail, FiMapPin } from "react-icons/fi";
import {
  FaFacebookF,
  FaGoogle,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Image from "next/image";

const EMAIL_CONTACTS = [
  {
    label: "For Corporate Sales",
    email: "sales@tizzycloud.com",
  },
  {
    label: "For Technical Support",
    email: "support@tizzycloud.com",
  },
  {
    label: "For Billing / Renewal",
    email: "accounts@tizzycloud.com",
  },
];

const SOCIAL_LINKS = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/tizzycloud",
    icon: FaInstagram,
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/tizzycloud",
    icon: FaFacebookF,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/tizzycloud",
    icon: FaLinkedinIn,
  },
  {
    id: "x",
    label: "X",
    href: "https://x.com/tizzycloud",
    icon: FaXTwitter,
  },
  {
    id: "google",
    label: "Google",
    href: "https://www.google.com/search?q=tizzycloud",
    icon: FaGoogle,
    className: styles.socialGoogle,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: "https://wa.me/919925992599",
    icon: FaWhatsapp,
    className: styles.socialWhatsapp,
  },
];

const FAQ_ITEMS = [
  {
    id: "renew-plan",
    question: "How to renew my plan?",
    answer: "-",
  },
  {
    id: "upgrade-plan",
    question: "How to upgrade my plan?",
    answer: "-",
  },
  {
    id: "payment-failed",
    question: "Why is my payment not successful?",
    answer: "-",
  },
  {
    id: "credit-system",
    question: "How does the credit system work?",
    answer: "-",
  },
  {
    id: "downgrade-plan",
    question: "Can I downgrade my plan?",
    answer: "-",
  },
  {
    id: "credit-balance",
    question: "How do I check my credit balance?",
    answer: "-",
  },
  {
    id: "renewal-vs-upgrade",
    question: "What is the difference between renewal and upgrade?",
    answer: "-",
  },
  {
    id: "upgrade-before-expiry",
    question: "Can I upgrade my plan before expiry?",
    answer: "-",
  },
];

const TABS = [
  { id: "raise-query", label: "Raise Query" },
  { id: "help-center", label: "Help Center" },
];

const HelpCenter = () => {
  const [activeTab, setActiveTab] = useState("help-center");
  const [openFaqId, setOpenFaqId] = useState(null);

  const toggleFaq = (id) => {
    setOpenFaqId((current) => (current === id ? null : id));
  };
  return (
    <div className="container">
      <div className={styles.breadcrumbs} aria-label="Breadcrumb">
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
          }}
        >
          <Link href="/dashboard" className={styles.breadcrumbLink}>
            Dashboard
          </Link>
          <span className={styles.separator}>/</span>
          <span className={styles.crumbCurrent}>My Account</span>
        </span>
      </div>

      <div className={styles.title}>
        <h1>Help Center</h1>
      </div>

      <div
        className={styles.toggleTrack}
        role="tablist"
        aria-label="Help center sections"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`${styles.toggleItem} ${
              activeTab === tab.id ? styles.toggleItemActive : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.toggleContent}>
        <div className={styles.toggleContentMain}>
          <div className="row">
            <div className="col-lg-3 ">
              <div className={styles.toggleContentLeftItem}>
                <Image
                  src={leftImage}
                  alt="Help Center"
                  width={500}
                  height={500}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className={styles.middleContent}>
                <div className={styles.toggleContentItem}>
                  <Image
                    src={logo}
                    alt="Help Center"
                    width={500}
                    height={500}
                  />
                </div>
                <div className={styles.toggleContentItemText}>
                  <h2>How can we help you?</h2>
                </div>
              </div>
              <div
                className={styles.searchWrapper}
                style={{ marginTop: "1.5rem" }}
              >
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Describe Your Issue"
                />
                <span className={styles.searchIcon} aria-hidden="true">
                  <FaSearch />
                </span>
              </div>
            </div>
            <div className="col-lg-3">
              <div className={styles.toggleContentRightItem}>
                <Image
                  src={rightImage}
                  alt="Help Center"
                  width={500}
                  height={500}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.faqAccordion}>
          {FAQ_ITEMS.map((item) => {
            const isOpen = openFaqId === item.id;
            return (
              <div key={item.id} className={styles.faqItem}>
                <button
                  type="button"
                  className={styles.faqTrigger}
                  aria-expanded={isOpen}
                  onClick={() => toggleFaq(item.id)}
                >
                  <span className={styles.faqQuestion}>{item.question}</span>
                  <BiChevronDown
                    className={`${styles.faqChevron} ${
                      isOpen ? styles.faqChevronOpen : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className={styles.faqAnswer}>{item.answer}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <section className={styles.contactSection}>
        <h2 className={styles.contactTitle}>Contact Us</h2>
        <div className="row g-4">
          <div className="col-lg-4">
            <div className={styles.contactCard}>
              <div className={styles.contactCardHeader}>
                <span className={styles.contactIconWrap} aria-hidden="true">
                  <FiMail size={25} />
                </span>
                <h3 className={styles.contactCardTitle}>Gmail</h3>
              </div>
              <ul className={styles.contactList}>
                {EMAIL_CONTACTS.map((item) => (
                  <li key={item.email} className={styles.contactListItem}>
                    <span className={styles.contactLabel}>{item.label} -</span>{" "}
                    <a
                      href={`mailto:${item.email}`}
                      className={styles.contactLink}
                    >
                      {item.email}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-lg-4">
            <div className={styles.contactCard}>
              <div className={styles.contactCardHeader}>
                <span className={styles.contactIconWrap} aria-hidden="true">
                  <FiMapPin size={25} />
                </span>
                <h3
                  className={`${styles.contactCardTitle} ${styles.contactCardTitleUpper}`}
                >
                  Corporate Office Address
                </h3>
              </div>
              <div className={styles.contactAddress}>
                <p className={styles.contactCompany}>
                  Tizzy®Cloud Computing Private Limited
                </p>
                <p>Office No. 511, Kalpataru Avenue,</p>
                <p>Akurli Road, Kandivali East,</p>
                <p>Mumbai - 400101,</p>
                <p>Maharashtra, INDIA</p>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className={styles.contactCard}>
              <div className={styles.contactCardHeader}>
                <span className={styles.contactIconWrap} aria-hidden="true">
                  <FiMapPin size={25} />
                </span>
                <h3 className={styles.contactCardTitle}>Global Help</h3>
              </div>
              <p className={styles.contactPhone}>
                <a href="tel:+919925992599" className={styles.contactLink}>
                  +91 9925992599
                </a>
              </p>
              <div className={styles.socialLinks}>
                {SOCIAL_LINKS.map(
                  ({ id, label, href, icon: Icon, className }) => (
                    <Link
                      key={id}
                      href={href}
                      className={`${styles.socialLink} ${className || ""}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                    >
                      <Icon aria-hidden="true" size={25} />
                    </Link>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenter;
