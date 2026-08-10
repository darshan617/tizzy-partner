import styles from "@/components/plans/plans-detail/PlansDetail.module.css";
import { CiUser } from "react-icons/ci";
import { IoMdArrowBack } from "react-icons/io";
import { LuLayers } from "react-icons/lu";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineAccessTime } from "react-icons/md";



const timelineItems = [
  {
    id: 1,
    title: "Order Created",
    description: "Order TXN00039 was placed by wilson thomas",
    time: "Today",
    done: true,
  },
  {
    id: 2,
    title: "Payment received",
    description: "₹934.56 received via credit/ wallet",
    time: "Today",
    done: true,
  },
  {
    id: 3,
    title: "Subscription Activated",
    description: "Tizzy® Mail Enterprise 100 GB provisioned for 3 users.",
    time: "Today",
    done: true,
  },
  {
    id: 4,
    title: "Renewal Scheduled",
    description: "Renewal at end of billing cycle",
    time: "Today",
    done: false,
  },
];

export default function PlansDetail() {
  return (
    <div className={styles.page}>
      <div className="container px-0">
        {/* Breadcrumb + Header */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <div className={styles.breadcrumb}>
              Dashboard / Customers / Customer Id : 00024 / Subscription Order
              Detail -00097
            </div>
            <h5 className={styles.pageTitle}>Plan Detail SUB-00097</h5>
          </div>
          <button className={styles.backBtn} type="button">
            <IoMdArrowBack /> Back
          </button>
        </div>

        <div className={`${styles.card} mb-3`}>
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className={styles.avatar}>N</div>
              <div className="ms-3">
                <div className={styles.companyName}>
                  Nexora Technologies Pvt. Ltd.
                </div>
                <div className="d-flex align-items-center gap-2 mt-1">
                  <span className={styles.customerIdBadge}>
                    Customer Id : 00024
                  </span>
                  <span className={styles.contactPerson}>
                    <CiUser size={14} /> Wilson Thomas
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.infoBlock}>
              <div className={styles.infoLabel}>Email</div>
              <div className={styles.infoValue}>vikasgoyal@gmail.com</div>
            </div>

            <div className={styles.infoBlock}>
              <div className={styles.infoLabel}>Contact No.</div>
              <div className={styles.infoValue}>+91 981234 56780</div>
            </div>
          </div>
        </div>
        <div className={`${styles.card} mb-3`}>
          <div className={styles.cardHeaderRow}>
            <span className={styles.cardHeaderTitle}>
              <LuLayers /> Subscription Details
            </span>
            <span className={styles.activeBadge}>Active</span>
          </div>

          <div className={styles.divider} />

          <div className={styles.subHeaderRow}>
            <div className="d-flex">
              <div className={styles.subIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="400"
                  height="400"
                  viewBox="0 0 400 400"
                  class="icon"
                >
                  <path
                    fill="#34a853"
                    d="M49,59s86.637-1.833,172,99L282,21,350,9V20s-36.234-2.265-53,43L144,391l-14-39,80-172S164.162,106.238,49,69V59Z"
                  ></path>
                </svg>
              </div>
              <div className="ms-2">
                <div className={styles.subName}>
                  Tizzy® Mail Enterprise 100 GB
                </div>
                <div className={styles.subPrice}>
                  ₹2850{" "}
                  <span className={styles.subUnit}>Per User / Per Year</span>
                </div>
              </div>
            </div>
            <div className={styles.provideText}>Provide : Tizzy Mail</div>
          </div>

          <div className={styles.detailGrid}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>License</span>
              <div className="d-flex align-items-center gap-2">
                <span className={styles.detailValue}>3 User</span>
                <button className={styles.addBtn} type="button">
                  <IoMdAdd size={14} className={styles.addIcon} /> Add
                </button>
              </div>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Domain</span>
              <span className={styles.detailValue}>goyal.com</span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Billing Cycle</span>
              <span className={styles.detailValue}>Yearly</span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Start Date</span>
              <span className={styles.detailValue}>21 Jul 2026</span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Renewal Date</span>
              <span className={styles.renewalValue}>20 Jul 2027</span>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-3">
            <button className={styles.upgradeBtn} type="button">
              Upgrade
            </button>
            <button className={styles.renewBtn} type="button">
              Renew
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className={styles.card}>
          <div className={styles.cardHeaderRow}>
            <span className={styles.cardHeaderTitle}>
            <MdOutlineAccessTime /> Timeline
            </span>
            <a href="#" className={styles.viewAllLink}>
              View All
            </a>
          </div>

          <div className={styles.divider} />

          <div className={styles.activityLabel}>ACTIVITY</div>

          <ul className={styles.timelineList}>
            {timelineItems.map((item) => (
              <li key={item.id} className={styles.timelineItem}>
                <span
                  className={`${styles.timelineDot} ${
                    item.done ? styles.timelineDotDone : ""
                  }`}
                />
                <div className={styles.timelineContent}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className={styles.timelineTitle}>{item.title}</div>
                      <div className={styles.timelineDesc}>
                        {item.description}
                      </div>
                    </div>
                    <span className={styles.timelineTime}>{item.time}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
