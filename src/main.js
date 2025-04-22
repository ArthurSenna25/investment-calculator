import '@fortawesome/fontawesome-free/css/all.min.css';
import { generateReturnsArray } from './investmentGoals';
import { Chart } from 'chart.js/auto';
import { createTable } from './table';

// Get the form, input fields, buttons and chart elements
const form = document.getElementById('investment-form');
const clearFormButton = document.getElementById('clear-form');

const finalMoneyChart = document.getElementById('final-money-distribution');
const progressionChart = document.getElementById('progression');

let doughnutChartReference = {};
let progressionChartReference = {};

const columnsArray = [
  { columnLabel: 'Mês', accessor: 'month' },
  {
    columnLabel: 'Total Investido',
    accessor: 'investedAmount',
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: 'Rendimento Mensal',
    accessor: 'interestReturns',
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: 'Rendimento Total',
    accessor: 'totalInterestReturns',
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: 'Quantia Total',
    accessor: 'totalAmount',
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
];

// Function to format currency values for the chart
function formatCurrencyToTable(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function formatCurrencyToGraph(value) {
  return value.toFixed(2);
}

// Function to generate the returns array based on user input
function renderProgression(event) {
  event.preventDefault();
  if (document.querySelector('.error')) {
    return;
  }

  resetCharts();
  resetTable();

  const startingAmount = Number(
    document.getElementById('starting-amount').value.replace(',', '.'),
  );
  const additionalContribution = Number(
    document.getElementById('additional-contribution').value.replace(',', '.'),
  );
  const timeAmount = Number(document.getElementById('time-amount').value);
  const timeAmountPeriod = document.getElementById('time-amount-period').value;
  const returnRate = Number(
    document.getElementById('return-rate').value.replace(',', '.'),
  );
  const returnRatePeriod = document.getElementById('evaluation-period').value;
  const taxRate = Number(
    document.getElementById('tax-rate').value.replace(',', '.'),
  );

  const returnsArray = generateReturnsArray(
    startingAmount,
    timeAmount,
    timeAmountPeriod,
    additionalContribution,
    returnRate,
    returnRatePeriod,
  );

  // Charts (Doughnut and Bar)

  //Investment Final Process
  const finalInvestmentObject = returnsArray[returnsArray.length - 1];

  //Charts (Doughnut and Bar)
  doughnutChartReference = new Chart(finalMoneyChart, {
    type: 'doughnut',
    data: {
      labels: ['Total investido', 'Rendimento', 'Imposto'],
      datasets: [
        {
          data: [
            formatCurrencyToGraph(finalInvestmentObject.investedAmount),
            formatCurrencyToGraph(
              finalInvestmentObject.totalInterestReturns * (1 - taxRate / 100),
            ),
            formatCurrencyToGraph(
              finalInvestmentObject.totalInterestReturns * (taxRate / 100),
            ),
          ],
          backgroundColor: [
            'rgb(255, 99, 132)', // Investido
            'rgb(54, 162, 235)', // Rendimento
            'rgb(255, 205, 86)', // Imposto
          ],
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 1, // Maintain square aspect ratio
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 16,
            },
          },
        },
      },
    },
  });

  // Bar Chart for Progression
  progressionChartReference = new Chart(progressionChart, {
    type: 'bar',
    data: {
      labels: returnsArray.map((investmentObject) => investmentObject.month),
      datasets: [
        {
          label: 'Total Investido',
          data: returnsArray.map((investmentObject) =>
            formatCurrencyToGraph(investmentObject.investedAmount),
          ),
          backgroundColor: 'rgb(255, 99, 132)',
        },
        {
          label: 'Retorno do Investimento',
          data: returnsArray.map((investmentObject) =>
            formatCurrencyToGraph(investmentObject.interestReturns),
          ),
          backgroundColor: 'rgb(54, 162, 235)',
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 16,
            },
          },
        },
      },
    },
  });

  // Table
  createTable(columnsArray, returnsArray, 'results-table');
}

// Function to check if an object is empty
function isObjectEmpty(object) {
  return Object.keys(object).length === 0;
}

// Function to clear the charts
function resetCharts() {
  if (
    !isObjectEmpty(doughnutChartReference) &&
    !isObjectEmpty(progressionChartReference)
  ) {
    doughnutChartReference.destroy();
    progressionChartReference.destroy();
  }
}

// Function to reset the table before rendering new data
function resetTable() {
  const table = document.getElementById('results-table');
  table.innerHTML = ''; // Limpa toda a tabela, incluindo o cabeçalho e o corpo
}

// Function to clear the form inputs and charts
function clearForm() {
  form['starting-amount'].value = '';
  form['additional-contribution'].value = '';
  form['time-amount'].value = '';
  form['return-rate'].value = '';
  form['tax-rate'].value = '';

  resetCharts();
  resetTable();

  const errorInputsContainers = document.querySelectorAll('.error');

  for (const errorInputsContainer of errorInputsContainers) {
    errorInputsContainer.classList.remove('error');
    errorInputsContainer.parentElement.querySelector('p').remove();
  }
}

// Function to validate user input
function validateInput(event) {
  if (event.target.value === '') {
    return;
  }

  const { parentElement } = event.target;
  const grandParentElement = event.target.parentElement.parentElement;
  const inputValue = event.target.value.replace(',', '.');

  if (
    (!parentElement.classList.contains('error') && isNaN(inputValue)) ||
    Number(inputValue) < 0
  ) {
    const errorTextElement = document.createElement('p');
    errorTextElement.innerText = 'Insira um valor numérico maior que zero!';
    errorTextElement.classList.add('text-red-500');

    parentElement.classList.add('error');
    grandParentElement.appendChild(errorTextElement);
  } else if (
    (parentElement.classList.contains('error') && !isNaN(inputValue)) ||
    Number(inputValue) > 0
  ) {
    parentElement.classList.remove('error');
    grandParentElement.querySelector('p').remove();
  }
}

for (const formElement of form) {
  if (formElement.tagName === 'INPUT' && formElement.hasAttribute('name')) {
    formElement.addEventListener('blur', validateInput);
  }
}

const mainEl = document.querySelector('main');
const carouselEl = document.getElementById('carousel');
const previousButton = document.getElementById('slide-arrow-previous');
const nextButton = document.getElementById('slide-arrow-next');

// Add event Listeners to the caousel buttons
previousButton.addEventListener('click', () => {
  carouselEl.scrollLeft -= mainEl.clientWidth;
});

nextButton.addEventListener('click', () => {
  carouselEl.scrollLeft += mainEl.clientWidth;
});

// Add event listener to the form submission
form.addEventListener('submit', renderProgression);
clearFormButton.addEventListener('click', clearForm);
