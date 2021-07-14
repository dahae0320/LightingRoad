const bottomSheet = document.querySelector('.bottom-sheet');
const report = document.querySelector('.bottom-sheet .report');
const infoSummary = document.querySelector('.bottom-sheet .info-summary');


infoSummary.addEventListener('click', () => {
  bottomSheet.classList.remove('init');
  bottomSheet.classList.toggle('up');
  bottomSheet.classList.toggle('down');

  report.classList.remove('init');
  report.classList.toggle('up');
  report.classList.toggle('down');
});