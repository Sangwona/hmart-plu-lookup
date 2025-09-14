// Admin module - handles admin authentication and related functionality

class AdminManager {
  constructor() {
    this.ADMIN_CODE = "1234"; // 4-digit admin code
    this.isAdminMode = false;
    this.enteredCode = "";
    this.maxCodeLength = 4;
  }

  // Initialize admin functionality
  init() {
    this.setupEventListeners();
  }

  // Setup event listeners for admin functionality
  setupEventListeners() {
    const toggleAdminBtn = document.getElementById("toggle-admin-btn");
    const keypadButtons = document.querySelectorAll(".keypad-button");
    const codeInput = document.getElementById("code-input");
    const modal = document.getElementById("code-modal");

    if (toggleAdminBtn) {
      toggleAdminBtn.addEventListener("click", () => this.handleAdminToggle());
    }

    // Keypad button listeners
    keypadButtons.forEach((button) => {
      button.addEventListener("click", (e) =>
        this.handleKeypadClick(e.target.dataset.key)
      );
    });

    // Typing support for code input
    if (codeInput) {
      codeInput.addEventListener("input", (e) => this.handleTypingInput(e));
      codeInput.addEventListener("keydown", (e) => this.handleKeyDown(e));
    }

    // Modal click outside to close
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.hideCodeModal();
        }
      });
    }

    // Global ESC key listener for modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        this.hideCodeModal();
      }
    });
  }

  // Handle admin mode toggle
  handleAdminToggle() {
    if (this.isAdminMode) {
      this.exitAdminMode();
    } else {
      this.showCodeModal();
    }
  }

  // Show the 4-digit code input modal
  showCodeModal() {
    const modal = document.getElementById("code-modal");
    if (modal) {
      modal.classList.remove("hidden");
      this.enteredCode = "";
      this.updateCodeDisplay();
      // Focus on typing input for keyboard support
      const codeInput = document.getElementById("code-input");
      if (codeInput) {
        setTimeout(() => codeInput.focus(), 100);
      }
    }
  }

  // Hide the code input modal
  hideCodeModal() {
    const modal = document.getElementById("code-modal");
    if (modal) {
      modal.classList.add("hidden");
      this.enteredCode = "";
      this.updateCodeDisplay();
      const codeInput = document.getElementById("code-input");
      if (codeInput) codeInput.value = "";
    }
  }

  // Handle keypad button clicks
  handleKeypadClick(key) {
    if (key === "clear") {
      this.clearCode();
    } else if (key === "delete") {
      this.deleteLastDigit();
    } else if (
      key >= "0" &&
      key <= "9" &&
      this.enteredCode.length < this.maxCodeLength
    ) {
      this.addDigit(key);
    }
  }

  // Handle typing input
  handleTypingInput(event) {
    const input = event.target;
    const value = input.value.replace(/[^0-9]/g, ""); // Only allow numbers

    if (value.length <= this.maxCodeLength) {
      this.enteredCode = value;
      this.updateCodeDisplay();
      input.value = value;

      // Auto-submit when 4 digits are entered
      if (value.length === this.maxCodeLength) {
        setTimeout(() => this.verifyCode(), 300);
      }
    } else {
      input.value = this.enteredCode;
    }
  }

  // Handle keyboard events
  handleKeyDown(event) {
    if (
      event.key === "Enter" &&
      this.enteredCode.length === this.maxCodeLength
    ) {
      this.verifyCode();
    } else if (event.key === "Backspace") {
      this.deleteLastDigit();
    }
  }

  // Add a digit to the code
  addDigit(digit) {
    if (this.enteredCode.length < this.maxCodeLength) {
      this.enteredCode += digit;
      this.updateCodeDisplay();

      // Auto-submit when 4 digits are entered via keypad
      if (this.enteredCode.length === this.maxCodeLength) {
        setTimeout(() => this.verifyCode(), 300);
      }
    }
  }

  // Delete the last digit
  deleteLastDigit() {
    this.enteredCode = this.enteredCode.slice(0, -1);
    this.updateCodeDisplay();
  }

  // Clear the entire code
  clearCode() {
    this.enteredCode = "";
    this.updateCodeDisplay();
  }

  // Update the visual code display (dots)
  updateCodeDisplay() {
    const dots = document.querySelectorAll(".code-dot");
    dots.forEach((dot, index) => {
      if (index < this.enteredCode.length) {
        dot.classList.add("filled");
      } else {
        dot.classList.remove("filled");
      }
    });
  }

  // Verify the entered code
  verifyCode() {
    if (this.enteredCode === this.ADMIN_CODE) {
      this.enterAdminMode();
      this.hideCodeModal();
    } else {
      this.showError();
      setTimeout(() => {
        this.clearCode();
        const codeInput = document.getElementById("code-input");
        if (codeInput) codeInput.focus();
      }, 1000);
    }
  }

  // Show error message
  showError() {
    const errorMessage = document.getElementById("code-error");
    if (errorMessage) {
      errorMessage.classList.remove("hidden");
      setTimeout(() => errorMessage.classList.add("hidden"), 2000);
    }

    // Visual feedback - shake animation
    const modal = document.getElementById("code-modal");
    if (modal) {
      modal.style.animation = "shake 0.5s";
      setTimeout(() => (modal.style.animation = ""), 500);
    }
  }

  // Enter admin mode
  enterAdminMode() {
    this.isAdminMode = true;
    const cashierView = document.getElementById("cashier-view");
    const adminDashboard = document.getElementById("admin-dashboard");
    const toggleAdminBtn = document.getElementById("toggle-admin-btn");
    const headerTitle = document.getElementById("header-title");

    if (cashierView) cashierView.classList.add("hidden");
    if (adminDashboard) adminDashboard.classList.remove("hidden");
    if (toggleAdminBtn) toggleAdminBtn.textContent = "Go to Cashier";
    if (headerTitle) headerTitle.textContent = "Admin Panel";
  }

  // Exit admin mode
  exitAdminMode() {
    this.isAdminMode = false;
    const cashierView = document.getElementById("cashier-view");
    const adminDashboard = document.getElementById("admin-dashboard");
    const toggleAdminBtn = document.getElementById("toggle-admin-btn");
    const headerTitle = document.getElementById("header-title");

    if (cashierView) cashierView.classList.remove("hidden");
    if (adminDashboard) adminDashboard.classList.add("hidden");
    if (toggleAdminBtn) toggleAdminBtn.textContent = "Go to Admin";
    if (headerTitle) headerTitle.textContent = "Cashier View";
  }

  // Check if currently in admin mode
  isInAdminMode() {
    return this.isAdminMode;
  }
}

// CSS animation for shake effect
const shakeKeyframes = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
`;

// Add shake animation to document
const style = document.createElement("style");
style.textContent = shakeKeyframes;
document.head.appendChild(style);

// Export for use in other modules
const adminManager = new AdminManager();
