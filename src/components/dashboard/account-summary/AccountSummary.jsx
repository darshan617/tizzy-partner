import React, { useEffect } from 'react'
import { ChevronUp, Plus } from 'lucide-react';
import styles from '@/components/dashboard/account-summary/AccountSummary.module.css'

const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={styles.icon}>
    <path fill="currentColor" d="M4.892 9.614c0-.402.323-.728.722-.728H9.47c.4 0 .723.326.723.728a.726.726 0 0 1-.723.729H5.614a.726.726 0 0 1-.722-.729" />
    <path fill="currentColor" fillRule="evenodd" d="M21.188 10.004q-.094-.005-.2-.004h-2.773C15.944 10 14 11.736 14 14s1.944 4 4.215 4h2.773q.106.001.2-.004c.923-.056 1.739-.757 1.808-1.737c.004-.064.004-.133.004-.197v-4.124c0-.064 0-.133-.004-.197c-.069-.98-.885-1.68-1.808-1.737m-3.217 5.063c.584 0 1.058-.478 1.058-1.067c0-.59-.474-1.067-1.058-1.067s-1.06.478-1.06 1.067c0 .59.475 1.067 1.06 1.067" clipRule="evenodd" />
    <path fill="currentColor" d="M21.14 10.002c0-1.181-.044-2.448-.798-3.355a4 4 0 0 0-.233-.256c-.749-.748-1.698-1.08-2.87-1.238C16.099 5 14.644 5 12.806 5h-2.112C8.856 5 7.4 5 6.26 5.153c-1.172.158-2.121.49-2.87 1.238c-.748.749-1.08 1.698-1.238 2.87C2 10.401 2 11.856 2 13.694v.112c0 1.838 0 3.294.153 4.433c.158 1.172.49 2.121 1.238 2.87c.749.748 1.698 1.08 2.87 1.238c1.14.153 2.595.153 4.433.153h2.112c1.838 0 3.294 0 4.433-.153c1.172-.158 2.121-.49 2.87-1.238q.305-.308.526-.66c.45-.72.504-1.602.504-2.45l-.15.001h-2.774C15.944 18 14 16.264 14 14s1.944-4 4.215-4h2.773q.079 0 .151.002" opacity="0.5" />
    <path fill="currentColor" d="M10.101 2.572L8 3.992l-1.733 1.16C7.405 5 8.859 5 10.694 5h2.112c1.838 0 3.294 0 4.433.153q.344.045.662.114L16 4l-2.113-1.428a3.42 3.42 0 0 0-3.786 0" />
  </svg>
)

const CustomerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={styles.icon}>
    <path fill="currentColor" d="M16 6a4 4 0 1 1-8 0a4 4 0 0 1 8 0" />
    <path fill="currentColor" fillRule="evenodd" d="M16.5 22c-1.65 0-2.475 0-2.987-.513C13 20.975 13 20.15 13 18.5s0-2.475.513-2.987C14.025 15 14.85 15 16.5 15s2.475 0 2.987.513C20 16.025 20 16.85 20 18.5s0 2.475-.513 2.987C18.975 22 18.15 22 16.5 22m1.968-4.254a.583.583 0 1 0-.825-.825l-1.92 1.92l-.366-.365a.583.583 0 1 0-.825.825l.778.778a.583.583 0 0 0 .825 0z" clipRule="evenodd" />
    <path fill="currentColor" d="M14.477 21.92c-.726.053-1.547.08-2.477.08c-8 0-8-2.015-8-4.5S7.582 13 12 13c2.88 0 5.406.856 6.814 2.141C18.298 15 17.574 15 16.5 15c-1.65 0-2.475 0-2.987.513C13 16.025 13 16.85 13 18.5s0 2.475.513 2.987c.237.238.542.365.964.434" opacity="0.5" />
  </svg>
)

const SubscriptionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={styles.icon}>
    <path fill="currentColor" d="M3.378 5.082C3 5.62 3 7.22 3 10.417v1.574c0 5.638 4.239 8.375 6.899 9.536c.721.315 1.082.473 2.101.473c1.02 0 1.38-.158 2.101-.473C16.761 20.365 21 17.63 21 11.991v-1.574c0-3.198 0-4.797-.378-5.335c-.377-.537-1.88-1.052-4.887-2.081l-.573-.196C13.595 2.268 12.812 2 12 2s-1.595.268-3.162.805L8.265 3C5.258 4.03 3.755 4.545 3.378 5.082" opacity="0.5" />
    <path fill="currentColor" d="m10.861 8.363l-.13.235c-.145.259-.217.388-.329.473s-.252.117-.532.18l-.254.058c-.984.222-1.476.334-1.593.71c-.117.377.218.769.889 1.553l.174.203c.19.223.285.334.328.472s.029.287 0 .584l-.026.27c-.102 1.047-.152 1.57.154 1.803s.767.02 1.688-.403l.239-.11c.261-.12.392-.181.531-.181s.27.06.531.18l.239.11c.92.425 1.382.637 1.688.404s.256-.756.154-1.802l-.026-.271c-.029-.297-.043-.446 0-.584s.138-.25.328-.472l.174-.203c.67-.784 1.006-1.176.889-1.553c-.117-.376-.609-.488-1.593-.71l-.254-.058c-.28-.063-.42-.095-.532-.18s-.184-.214-.328-.472l-.131-.236C12.632 7.454 12.379 7 12 7s-.632.454-1.139 1.363" />
  </svg>
)

const RenewalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={styles.icon}>
    <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.5" />
    <path fill="currentColor" d="M7.378 11.63h-.75zm0 .926l-.562.497a.75.75 0 0 0 1.08.044zm2.141-1.015a.75.75 0 0 0-1.038-1.082zm-2.958-1.038a.75.75 0 1 0-1.122.994zm8.37-1.494a.75.75 0 1 0 1.102-1.018zM12.045 6.25c-2.986 0-5.416 2.403-5.416 5.38h1.5c0-2.137 1.747-3.88 3.916-3.88zm-5.416 5.38v.926h1.5v-.926zm1.269 1.467l1.622-1.556l-1.038-1.082l-1.622 1.555zm.042-1.039l-1.378-1.555l-1.122.994l1.377 1.556zm8.094-4.067a5.42 5.42 0 0 0-3.99-1.741v1.5a3.92 3.92 0 0 1 2.889 1.26zm.585 3.453l.56-.498a.75.75 0 0 0-1.08-.043zm-2.139 1.014a.75.75 0 1 0 1.04 1.082zm2.96 1.04a.75.75 0 0 0 1.12-.997zm-8.393 1.507a.75.75 0 0 0-1.094 1.026zm2.888 2.745c2.993 0 5.434-2.4 5.434-5.38h-1.5c0 2.135-1.753 3.88-3.934 3.88zm5.434-5.38v-.926h-1.5v.926zm-1.27-1.467l-1.619 1.555l1.04 1.082l1.618-1.555zm-.04 1.04l1.38 1.554l1.122-.996l-1.381-1.555zM7.952 16.03a5.45 5.45 0 0 0 3.982 1.719v-1.5c-1.143 0-2.17-.48-2.888-1.245z" />
  </svg>
)

const STAT_CARDS = [
  {
    gradClass: 'infoGrad',
    colorClass: 'infoColor',
    Icon: WalletIcon,
    label: 'Total Revenue',
    prefix: '₹',
    count: '51.6',
    suffix: 'k',
    badgeClass: 'up',
    change: '8.72%',
    anchor: null,
  },
  {
    gradClass: 'successGrad',
    colorClass: 'successColor',
    Icon: CustomerIcon,
    label: 'Active Customers',
    prefix: '',
    count: '245',
    suffix: 'k',
    badgeClass: 'down',
    change: '8.72%',
    anchor: {
      href: 'add_new_customer.html',
      tooltip: 'Add New Customer',
    },
  },
  {
    gradClass: 'warningGrad',
    colorClass: 'warningColor',
    Icon: SubscriptionIcon,
    label: 'Active Subscriptions',
    prefix: '',
    count: '1023',
    suffix: 'k',
    badgeClass: 'up',
    change: '8.72%',
    anchor: null,
  },
  {
    gradClass: 'secondaryGrad',
    colorClass: 'secondaryColor',
    Icon: RenewalIcon,
    label: 'Renewals This Month',
    prefix: '',
    count: '560',
    suffix: '',
    badgeClass: 'down',
    change: '8.72%',
    anchor: null,
  },
]

const PageHeader = ({ name }) => (
  <div className="col">
    <div className="row align-items-center">
      <div className="col">
        <nav className={`${styles.breadcrumb} mb-0`}>
          <a className={styles['breadcrumb-item']}>Welcome,</a>
          <h1 className={`${styles['breadcrumb-item']} ${styles.active}`} aria-current="page">{name}</h1>
        </nav>
      </div>
    </div>
  </div>
)

const StatBadge = ({ badgeClass, change }) => (
  <div className={`${styles.statusBadge} ${styles[badgeClass]}`}>
    <ChevronUp className={styles.icon} size={18} />
    <span>{change}</span>
  </div>
)

const StatCard = ({ gradClass, colorClass, Icon, href, label, prefix, count, suffix, badgeClass, change, anchor }) => (
  <div className="col pt-4">
    <div className={`${styles.statBox} ${styles[gradClass]}`}>
      <div className={`${styles.statIcon} ${styles[colorClass]}`}>
        <Icon />
      </div>

      <span className={`${styles.statText} mt-3`}>
        <div className={`${styles.statLabel} mb-2`}>{label}</div>
        <div className="d-flex align-items-center">
          <div className={styles.statValue}>
            {prefix}
            <span className="count" data-count={count}>0</span>
            {suffix}
          </div>
          <StatBadge badgeClass={badgeClass} change={change} />
        </div>
      </span>

      {anchor && (
        <a
          href={anchor.href}
          className={styles.statAnchor}
          data-bs-toggle="tooltip"
          title={anchor.tooltip}
        >
          <Plus className={styles.icon} size={18} />
        </a>
      )}
    </div>
  </div>
)

const AccountSummarySection = () => (
  <div className="col">
    <div className={`${styles.sectionCard} py-4 px-sm-4 px-3`}>
      <div className="mb-2">
        <h2 className={styles.sectionCardHead}>Account Summary</h2>
        <small className="ms-1">(As on 02 Apr, 2026)</small>
      </div>

      <div className="row row-cols-md-4 row-cols-sm-4 row-cols-2 g-sm-4 g-3">
        {STAT_CARDS.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
    </div>
  </div>
)

const AccountSummary = () => {
  useEffect(() => {
    const counters = document.querySelectorAll('.count')

    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-count'))
      let current = 0
      const increment = target / 100

      const updateCounter = () => {
        if (current < target) {
          current += increment
          counter.innerText = target % 1 !== 0 ? current.toFixed(1) : Math.ceil(current)
          requestAnimationFrame(updateCounter)
        } else {
          counter.innerText = target
        }
      }

      updateCounter()
    })
  }, [])

  return (
    <div className={`${styles.containerMain} mx-auto d-flex flex-column`}>
      <div className="row flex-column gy-4 py-4">
        <PageHeader name="Janak Singh" />
        <AccountSummarySection />
      </div>
    </div>
  )
}

export default AccountSummary