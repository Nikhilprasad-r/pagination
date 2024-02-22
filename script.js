let header = document.getElementById("heading");

let H = document.createElement("h1");
H.id = "title";
H.textContent = "Pagination task with given JSON";
header.appendChild(H);
let P = document.createElement("p");
P.id = "description";
P.textContent = "Pagination task with given JSON";
header.appendChild(P);

fetch(
  "https://raw.githubusercontent.com/Rajavasanthan/jsondata/master/pagenation.json"
)
  .then((response) => response.json())
  .then((data) => {
    const itemsPerPage = 5; // Display 5 rows per page
    let currentPage = 1;
    let currentData = [];

    // Render table on a page
    const table = document.createElement("table");

    table.classList.add("table", "table-bordered");

    const tableHeader = document.createElement("thead");

    const tableHeaderRow = document.createElement("tr");
    ["ID", "Name", "Email"].forEach((headerText) => {
      const th = document.createElement("th");
      th.scope = "col";

      th.textContent = headerText;
      tableHeaderRow.appendChild(th);
    });
    tableHeader.appendChild(tableHeaderRow);
    table.appendChild(tableHeader);
    const tableBody = document.createElement("tbody");
    tableBody.id = "data-container";
    table.appendChild(tableBody);
    const tableContainer = document.getElementById("table-responsive");
    tableContainer.appendChild(table);

    function renderPage(pageNumber) {
      const start = (pageNumber - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      currentData = data.slice(start, end);

      const container = document.getElementById("data-container");
      container.innerHTML = "";
      currentData.forEach((item) => {
        const row = document.createElement("tr");
        row.classList.add("border-b", "dark:border-gray-700");
        row.innerHTML = `
    <td >${item.id}</td>
    <td >${item.name}</td>
    <td >${item.email}</td>`;
        container.appendChild(row);
      });
    }

    // Render pagination buttons
    function renderPaginationButtons() {
      const totalPages = Math.ceil(data.length / itemsPerPage);
      const paginationContainer = document.getElementById("buttons");
      paginationContainer.innerHTML = "";

      // Calculate the range of buttons to display
      let startPage = currentPage - 2;
      let endPage = currentPage + 1;
      if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(totalPages, 4);
      }
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - 3);
      }

      // Previous Button
      const prevButton = document.createElement("button");
      prevButton.textContent = "Previous";
      prevButton.id = "prevButton";
      prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--;
          renderPage(currentPage);
          renderPaginationButtons();
        }
      });
      paginationContainer.appendChild(prevButton);

      // Pagination buttons within the range
      for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.addEventListener("click", () => {
          currentPage = i;
          renderPage(currentPage);
          renderPaginationButtons();
        });
        paginationContainer.appendChild(button);
      }

      // Next Button
      const nextButton = document.createElement("button");
      nextButton.textContent = "Next";
      nextButton.id = "nextButton";
      nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
          currentPage++;
          renderPage(currentPage);
          renderPaginationButtons();
        }
      });
      paginationContainer.appendChild(nextButton);

      highlightCurrentPageButton();
    }

    // Highlight the current page button
    function highlightCurrentPageButton() {
      const buttons = document.querySelectorAll("#buttons button");
      buttons.forEach((button) => {
        button.classList.remove("active");
        if (parseInt(button.textContent) === currentPage) {
          button.classList.add("active");
        }
      });
    }

    renderPage(currentPage);
    renderPaginationButtons();
  })
  .catch((error) => console.error("Error fetching data:", error));
