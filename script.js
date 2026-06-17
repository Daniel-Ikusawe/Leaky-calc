const enquiriesEl  = document.getElementById('enquiries');
const jobValueEl   = document.getElementById('job-value');
const missedEl     = document.getElementById('missed');
const missedDisplay = document.getElementById('missed-display');

const addonCheckboxes = document.querySelectorAll('.service-list input[type="checkbox"]:not([disabled])');

const totalSetupEl   = document.getElementById('total-setup');
const totalMonthlyEl = document.getElementById('total-monthly');

const lostMonthlyEl    = document.getElementById('lost-monthly');
const lostYearlyEl     = document.getElementById('lost-yearly');
const recoveredMonthlyEl = document.getElementById('recovered-monthly');
const serviceMonthlyEl = document.getElementById('service-monthly');
const netMonthlyEl     = document.getElementById('net-monthly');
const roiOngoingEl     = document.getElementById('roi-ongoing');
const roiTotalEl       = document.getElementById('roi-total');

const BASE_SETUP   = 1200;
const BASE_MONTHLY = 750;
const RECOVERY_RATE = 0.8;

function fmt(n) {
  return '£' + Math.round(n).toLocaleString('en-GB');
}

function fmtPct(n) {
  return Math.round(n) + '%';
}

function getServiceCosts() {
  let setup   = BASE_SETUP;
  let monthly = BASE_MONTHLY;

  addonCheckboxes.forEach(function (cb) {
    if (cb.checked) {
      setup   += parseFloat(cb.dataset.setup   || 0);
      monthly += parseFloat(cb.dataset.monthly || 0);
    }
  });

  return { setup, monthly };
}

function updateServiceSummary() {
  const { setup, monthly } = getServiceCosts();
  totalSetupEl.textContent   = fmt(setup);
  totalMonthlyEl.textContent = fmt(monthly) + '/mo';
}

function calculate() {
  updateServiceSummary();

  const enquiries = parseFloat(enquiriesEl.value);
  const jobValue  = parseFloat(jobValueEl.value);
  const missedPct = parseFloat(missedEl.value);

  if (!enquiries || !jobValue || isNaN(enquiries) || isNaN(jobValue)) {
    [lostMonthlyEl, lostYearlyEl, recoveredMonthlyEl,
     serviceMonthlyEl, netMonthlyEl, roiOngoingEl, roiTotalEl].forEach(function (el) {
      el.textContent = '—';
    });
    netMonthlyEl.className  = 'result-value';
    roiOngoingEl.className  = 'result-value';
    roiTotalEl.className    = 'result-hero accent';
    return;
  }

  const { setup, monthly } = getServiceCosts();

  const missedPerWeek    = enquiries * (missedPct / 100);
  const lostPerWeek      = missedPerWeek * jobValue;
  const lostPerMonth     = lostPerWeek * (52 / 12);
  const lostPerYear      = lostPerWeek * 52;

  const recoveredMonthly = lostPerMonth * RECOVERY_RATE;
  const netMonthly       = recoveredMonthly - monthly;

  const roiOngoing = monthly > 0
    ? ((recoveredMonthly - monthly) / monthly) * 100
    : null;

  const totalSpend3mo  = setup + (monthly * 3);
  const totalReturn3mo = netMonthly * 3;
  const roiTotal = totalSpend3mo > 0
    ? (totalReturn3mo / totalSpend3mo) * 100
    : null;

  lostMonthlyEl.textContent    = fmt(lostPerMonth);
  lostYearlyEl.textContent     = fmt(lostPerYear) + ' per year';
  recoveredMonthlyEl.textContent = fmt(recoveredMonthly);
  serviceMonthlyEl.textContent = fmt(monthly) + '/mo';

  netMonthlyEl.textContent  = fmt(netMonthly);
  netMonthlyEl.className    = 'result-value ' + (netMonthly >= 0 ? 'positive' : 'negative');

  roiOngoingEl.textContent  = roiOngoing !== null ? fmtPct(roiOngoing) : '—';
  roiOngoingEl.className    = 'result-value ' + (roiOngoing !== null && roiOngoing >= 0 ? 'positive' : 'negative');

  roiTotalEl.textContent = roiTotal !== null ? fmtPct(roiTotal) : '—';
  roiTotalEl.className   = 'result-hero ' + (roiTotal !== null && roiTotal >= 0 ? 'green-hero' : 'red-hero');
}

missedEl.addEventListener('input', function () {
  missedDisplay.textContent = missedEl.value + '%';
  calculate();
});

enquiriesEl.addEventListener('input', calculate);
jobValueEl.addEventListener('input', calculate);
addonCheckboxes.forEach(function (cb) {
  cb.addEventListener('change', calculate);
});

calculate();
