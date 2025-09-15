// Main application script
// This file contains the core application logic, separated from admin functionality

// Global variables
let produceItems = [];
let editItemId = null;

// DOM Elements
let toggleAdminBtn, headerTitle, cashierView, adminDashboard, searchInput, produceGrid, messageBox;
let produceForm, formTitle, nameInput, pluCodeInput, descriptionInput, cancelEditBtn;
let csvUploadInput, exportCsvBtn, adminTableBody;

// --- Core Application Logic ---

// Helper function to check if a string is a URL
function isUrl(str) {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
}

// Display a message to the user
function showMessage(text, type = "success") {
  messageBox.textContent = text;
  messageBox.className = `block mb-4 p-3 rounded-lg text-sm text-center font-medium transition-all duration-300`;
  if (type === "success") {
    messageBox.classList.add("bg-green-100", "text-green-800");
  } else if (type === "error") {
    messageBox.classList.add("bg-red-100", "text-red-800");
  }
  messageBox.classList.remove("hidden");
  setTimeout(() => {
    messageBox.classList.add("hidden");
  }, 3000);
}

// Render the produce items for the cashier view
function renderProduceItems(items) {
  produceGrid.innerHTML = "";
  if (items.length === 0) {
    produceGrid.innerHTML = `<p class="col-span-full text-center text-gray-500">No produce found.</p>`;
    return;
  }
  items.forEach((item) => {
    const itemCard = document.createElement("div");
    itemCard.className =
      "bg-white rounded-xl shadow-md overflow-hidden transform transition-transform hover:scale-105 cursor-pointer";

    itemCard.innerHTML = `
       
            <div class="p-3 text-center">
                <h3 class="font-bold text-gray-800 truncate">${item.name}</h3>
                <p class="text-sm text-gray-500 font-mono mt-1">${item.plu_code}</p>
            </div>
        `;
    itemCard.onclick = () => showMessage(`${item.name} is: ${item.plu_code}`, "success");
    produceGrid.appendChild(itemCard);
  });
}

// Search for produce items
function searchProduce() {
  const query = searchInput.value.toLowerCase();
  const filteredItems = produceItems.filter(
    (item) => item.name.toLowerCase().includes(query) || item.plu_code.includes(query)
  );
  renderProduceItems(filteredItems);
}

// --- Admin Functions ---

// Render the admin table with CRUD buttons
function renderAdminTable() {
  adminTableBody.innerHTML = "";
  produceItems.forEach((item) => {
    const row = document.createElement("tr");
    row.className = "hover:bg-gray-50 transition-colors";

    row.innerHTML = `
            <td class="px-4 py-3 text-sm font-medium text-gray-900">${item.name}</td>
            <td class="px-4 py-3 text-sm text-gray-500 font-mono">${item.plu_code}</td>
            <td class="px-4 py-3 text-sm text-gray-500 font-mono">${item.description}</td>
            <td class="px-4 py-3 text-right text-sm font-medium whitespace-nowrap">
                <button data-id="${item.id}" class="edit-btn text-indigo-600 hover:text-indigo-900 transition-colors mr-2">Edit</button>
                <button data-id="${item.id}" class="delete-btn text-red-600 hover:text-red-900 transition-colors">Delete</button>
            </td>
        `;
    adminTableBody.appendChild(row);
  });
}

// Handle adding and editing of a produce item
async function handleFormSubmit(event) {
  event.preventDefault();
  const name = nameInput.value;
  const plu_code = pluCodeInput.value;
  const description = descriptionInput.value || "";

  try {
    if (editItemId) {
      // Update existing item
      await dbManager.updateProduceItem(editItemId, {
        name,
        plu_code,
        description,
      });
      showMessage("Item updated successfully.", "success");
    } else {
      // Add new item
      await dbManager.addProduceItem({
        name,
        plu_code,
        description,
      });
      showMessage("Item added successfully.", "success");
    }

    // Refresh data
    produceItems = await dbManager.getLocalProduceItems();

    // Reset form and UI
    produceForm.reset();
    formTitle.textContent = "Add New Item";
    editItemId = null;
    cancelEditBtn.classList.add("hidden");
    refreshAllViews();
  } catch (error) {
    console.error("Error saving item:", error);
    showMessage("Error saving item.", "error");
  }
}

// Handle editing an item
function handleEditClick(event) {
  const idToEdit = event.target.dataset.id;
  const itemToEdit = produceItems.find((item) => item.id === idToEdit);
  if (itemToEdit) {
    editItemId = itemToEdit.id;
    nameInput.value = itemToEdit.name;
    pluCodeInput.value = itemToEdit.plu_code;
    descriptionInput.value = itemToEdit.description;
    formTitle.textContent = "Edit Item";
    cancelEditBtn.classList.remove("hidden");
  }
}

// Handle deleting an item
async function handleDeleteClick(event) {
  const idToDelete = event.target.dataset.id;
  try {
    await dbManager.deleteProduceItem(idToDelete);
    showMessage("Item deleted successfully.", "success");
    // Refresh data
    produceItems = await dbManager.getLocalProduceItems();
    refreshAllViews();
  } catch (error) {
    console.error("Error deleting item:", error);
    showMessage("Error deleting item.", "error");
  }
}

function refreshAllViews() {
  renderAdminTable();
  renderProduceItems(produceItems);
}

// Handle CSV import
function handleCsvImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    let itemsImported = 0;

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      const [name, plu_code, description] = line.split(",");

      if (name && plu_code) {
        const newItem = {
          id: crypto.randomUUID(),
          name: name.trim(),
          plu_code: plu_code.trim(),
          description: description ? description.trim() : "",
        };

        // Always add as new item since id is auto-generated
        produceItems.push(newItem);
        itemsImported++;
      }
    }
    showMessage(`CSV imported. Added: ${itemsImported} items`, "success");
    refreshAllViews();
  };
  reader.readAsText(file);
}

// Handle CSV export
function handleCsvExport() {
  const headers = ["name", "plu_code", "description"];
  const rows = produceItems.map((item) => headers.map((header) => item[header]).join(","));
  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "produce_data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showMessage("CSV file exported successfully.", "success");
}

// Initialize DOM elements and setup event listeners
async function initializeApp() {
  // Get DOM elements
  toggleAdminBtn = document.getElementById("toggle-admin-btn");
  headerTitle = document.getElementById("header-title");
  cashierView = document.getElementById("cashier-view");
  adminDashboard = document.getElementById("admin-dashboard");
  searchInput = document.getElementById("search-input");
  produceGrid = document.getElementById("produce-grid");
  messageBox = document.getElementById("message-box");

  // Admin form elements
  produceForm = document.getElementById("produce-form");
  formTitle = document.getElementById("form-title");
  nameInput = document.getElementById("name");
  pluCodeInput = document.getElementById("plu_code");
  descriptionInput = document.getElementById("description");
  cancelEditBtn = document.getElementById("cancel-edit-btn");
  csvUploadInput = document.getElementById("csv-upload");
  exportCsvBtn = document.getElementById("export-csv-btn");
  adminTableBody = document.getElementById("admin-table-body");

  // Initialize data from database manager
  produceItems = await dbManager.getLocalProduceItems();

  // Setup event listeners
  searchInput.addEventListener("input", searchProduce);

  // Admin event listeners
  if (produceForm) produceForm.addEventListener("submit", handleFormSubmit);
  if (adminTableBody) {
    adminTableBody.addEventListener("click", (event) => {
      if (event.target.classList.contains("edit-btn")) {
        handleEditClick(event);
      } else if (event.target.classList.contains("delete-btn")) {
        handleDeleteClick(event);
      }
    });
  }
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", () => {
      produceForm.reset();
      formTitle.textContent = "Add New Item";
      editItemId = null;
      cancelEditBtn.classList.add("hidden");
    });
  }
  if (csvUploadInput) csvUploadInput.addEventListener("change", handleCsvImport);
  if (exportCsvBtn) exportCsvBtn.addEventListener("click", handleCsvExport);

  // Initialize admin manager
  adminManager.init();

  // Initial render
  refreshAllViews();
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});
