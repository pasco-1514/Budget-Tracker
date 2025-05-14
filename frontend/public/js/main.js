// DOM Elements and Functionality for Expense Tracker

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");

  // Get DOM elements
  const addExpenseBtn = document.getElementById("addExpenseBtn");
  const addExpenseModal = document.getElementById("addExpenseModal");
  const closeAddModal = document.getElementById("closeAddModal");

  // Log for debugging
  console.log("Add Expense Button:", addExpenseBtn);
  console.log("Add Expense Modal:", addExpenseModal);

  // Show Add Expense Modal when button is clicked
  if (addExpenseBtn) {
    addExpenseBtn.addEventListener("click", () => {
      console.log("Add Expense button clicked");
      if (addExpenseModal) {
        addExpenseModal.classList.remove("hidden");
        document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
      } else {
        console.error("Modal element not found");
      }
    });
  } else {
    console.error("Add Expense button not found");
  }

  // Close Add Expense Modal when close button is clicked
  if (closeAddModal) {
    closeAddModal.addEventListener("click", () => {
      console.log("Close modal button clicked");
      if (addExpenseModal) {
        addExpenseModal.classList.add("hidden");
        document.body.style.overflow = "auto"; // Restore scrolling
      }
    });
  }

  // Close modal when clicking outside of it
  if (addExpenseModal) {
    addExpenseModal.addEventListener("click", (e) => {
      if (e.target === addExpenseModal) {
        addExpenseModal.classList.add("hidden");
        document.body.style.overflow = "auto";
      }
    });
  }

  // Handle form validation
  const expenseForms = document.querySelectorAll("form");
  expenseForms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      // Get all required inputs
      const requiredInputs = form.querySelectorAll("[required]");
      let isValid = true;

      // Check if all required fields are filled
      requiredInputs.forEach((input) => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add("border-red-500");

          // Add error message if not already present
          const errorEl = input.parentNode.querySelector(".error-message");
          if (!errorEl) {
            const error = document.createElement("p");
            error.classList.add(
              "error-message",
              "text-red-500",
              "text-sm",
              "mt-1"
            );
            error.textContent = "This field is required";
            input.parentNode.appendChild(error);
          }
        } else {
          input.classList.remove("border-red-500");
          const errorEl = input.parentNode.querySelector(".error-message");
          if (errorEl) {
            errorEl.remove();
          }
        }
      });

      // If form is not valid, prevent submission
      if (!isValid) {
        e.preventDefault();
      }
    });
  });

  // Add animation classes to expense items
  const expenseItems = document.querySelectorAll(
    ".flex.justify-between.items-center.w-full.h-24"
  );
  expenseItems.forEach((item) => {
    item.classList.add("expense-item");
  });

  // Add class for expense list scrolling
  const expenseList = document.querySelector(".flex.flex-col.w-full");
  if (expenseList) {
    expenseList.classList.add("expense-list");
  }

  // Format currency for inputs
  const currencyInputs = document.querySelectorAll('input[type="number"]');
  currencyInputs.forEach((input) => {
    input.addEventListener("blur", (e) => {
      // Format to 2 decimal places if needed
      const value = parseFloat(e.target.value);
      if (!isNaN(value)) {
        e.target.value = value.toFixed(2);
      }
    });
  });

  // Enable ESC key to close modals
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      addExpenseModal &&
      !addExpenseModal.classList.contains("hidden")
    ) {
      addExpenseModal.classList.add("hidden");
      document.body.style.overflow = "auto";
    }
  });
});
