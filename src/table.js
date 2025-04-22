// Function to check if an array is empty and is array
const isNonEmptyArray = (arrayElement) => {
  return Array.isArray(arrayElement) && arrayElement.length > 0;
};

// Function to automatically create a table with the given columns and data
export const createTable = (columnsArray, dataArray, tableId) => {
  if (
    !isNonEmptyArray(columnsArray) ||
    !isNonEmptyArray(dataArray) ||
    !tableId
  ) {
    throw new Error(
      'Para a correta execução, precisamos de um array com as colunas, outro com as informações das linhas e também o id do elemento tabela selecionado',
    );
  }
  const tableElement = document.getElementById(tableId);
  if (!tableElement || tableElement.nodeName !== 'TABLE') {
    throw new Error('Id informado não corresponde a nenhum elemento table!');
  }

  createTableHeader(tableElement, columnsArray);
  createTableBody(tableElement, dataArray, columnsArray);
};

// Function to create the table header
function createTableHeader(tableReference, columnsArray) {
  // Function to create theader element and append it to the table reference
  const createTheadElement = (tableReference) => {
    const theadElement = document.createElement('thead');
    tableReference.appendChild(theadElement);
    return theadElement;
  };

  const tableHeaderReference =
    tableReference.querySelector('thead') ?? createTheadElement(tableReference);

  const tableHeaderRow = document.createElement('tr');
  /*
  Add classes to the table header row for styling
  The classes will depend on the needs and design of the project
   */
  [
    'bg-[#16A085]',
    'text-white',
    'text-left',
    'uppercase',
    'text-sm',
    'tracking-wider',
    'border-b',
    'border-[#1ABC9C]',
    'shadow-md',
  ].forEach((cssClass) => tableHeaderRow.classList.add(...cssClass.split(' ')));

  // Create all table header cells
  for (const tableColumnObject of columnsArray) {
    const tableHeaderElement = /*html*/ `<th class="text-center px-4 py-3 font-semibold">${tableColumnObject.columnLabel}</th>`;
    tableHeaderRow.innerHTML += tableHeaderElement;
  }

  tableHeaderReference.appendChild(tableHeaderRow);
}

// Function to create the table body
function createTableBody(tableReference, tableItems, columnsArray) {
  // Function to create tbpdy element and append it to the table reference
  const createTbodyElement = (tableReference) => {
    const tbodyElement = document.createElement('tbody');
    tableReference.appendChild(tbodyElement);
    return tbodyElement;
  };

  const tableBodyReference =
    tableReference.querySelector('tbody') ?? createTbodyElement(tableReference);

  // Create all table body rows
  for (const [itemIndex, tableItem] of tableItems.entries()) {
    const tableBodyRow = document.createElement('tr');

    if (itemIndex % 2 !== 0) {
      tableBodyRow.classList.add('bg-[#eaf9ee]');
    }

    // Create cells for each column in the row
    for (const tableColumn of columnsArray) {
      const formatFunction = tableColumn.format ?? ((info) => info);

      tableBodyRow.innerHTML += /*html*/ `<td class="text-center">${formatFunction(
        tableItem[tableColumn.accessor],
      )}</td>`;
    }

    tableBodyReference.appendChild(tableBodyRow);
  }
}
