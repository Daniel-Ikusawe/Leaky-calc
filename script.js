const form = document.getElementById('calc-form');
const resultBox = document.getElementById('result');
const monthlyEl = document.getElementById('monthly');
const yearlyEl = document.getElementById('yearly');
const errorEl = document.getElementById('error');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const enquiries = parseFloat(document.getElementById('enquiries').value);
  const missed = parseFloat(document.getElementById('missed').value);
  const jobValue = parseFloat(document.getElementById('job-value').value);

  if (isNaN(enquiries) || isNaN(missed) || isNaN(jobValue) ||
      enquiries < 0 || missed < 0 || missed > 100 || jobValue < 0) {
    resultBox.classList.add('hidden');
    errorEl.classList.remove('hidden');
    return;
  }

  errorEl.classList.add('hidden');

  const missedPerWeek = enquiries * (missed / 100);
  const lostPerWeek = missedPerWeek * jobValue;
  const lostPerMonth = lostPerWeek * (52 / 12);
  const lostPerYear = lostPerWeek * 52;

  monthlyEl.textContent = '£' + Math.round(lostPerMonth).toLocaleString('en-GB');
  yearlyEl.textContent = '£' + Math.round(lostPerYear).toLocaleString('en-GB') + ' per year';

  resultBox.classList.remove('hidden');
});
