
/*
  Pages & Lattes - Signup Form
  Validates form inputs, displays shopper JSON,
  and sends shopper information to MongoDB.
*/

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signupForm");
  const jsonOutput = document.getElementById("jsonOutput");

  const STORAGE_KEY = "pagesAndLattesShoppers";

  const API_URL =
    "https://ist256.up.ist.psu.edu:3001/api/shopper";

  // Retrieve saved shoppers without passwords.
  function getCollection() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const collection = saved ? JSON.parse(saved) : [];

      if (!Array.isArray(collection)) {
        return [];
      }

      return collection.map(function (shopper) {
        const { password, confirmPassword, ...safeShopper } = shopper;
        return safeShopper;
      });
    } catch (error) {
      console.error("Could not read saved shoppers:", error);
      return [];
    }
  }

  function saveCollection(collection) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(collection)
    );
  }

  // Remove passwords from any older localStorage records.
  saveCollection(getCollection());

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    event.stopPropagation();

    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const confirmPassword =
      document.getElementById("confirmPassword");
    const phone = document.getElementById("phone");
    const favoriteGenre =
      document.getElementById("favoriteGenre");

    let valid = true;

    // Clear previous validation errors.
    [
      fullName,
      email,
      username,
      password,
      confirmPassword
    ].forEach(function (field) {
      field.classList.remove("is-invalid");
    });

    // Validate full name.
    if (fullName.value.trim() === "") {
      fullName.classList.add("is-invalid");
      valid = false;
    }

    // Validate email.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.value.trim())) {
      email.classList.add("is-invalid");
      valid = false;
    }

    // Validate username.
    if (username.value.trim().length < 3) {
      username.classList.add("is-invalid");
      valid = false;
    }

    // Validate password.
    if (password.value.length < 6) {
      password.classList.add("is-invalid");
      valid = false;
    }

    // Confirm passwords match.
    if (
      confirmPassword.value !== password.value ||
      confirmPassword.value === ""
    ) {
      confirmPassword.classList.add("is-invalid");
      valid = false;
    }

    // Stop if validation fails.
    if (!valid) {
      jsonOutput.style.display = "none";
      return;
    }

    // Build shopper JSON.
    // Passwords are intentionally excluded.
    const newUser = {
      fullName: fullName.value.trim(),
      email: email.value.trim(),
      username: username.value.trim(),
      phone: phone.value.trim(),
      favoriteGenre: favoriteGenre.value
    };

    // Send shopper data to the HTTPS API.
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
      });

      if (!response.ok) {
        throw new Error(
          "Server returned HTTP " + response.status
        );
      }

      console.log("Shopper saved to MongoDB");

      // Update the local JSON collection
      // only after the API confirms success.
      const collection = getCollection();

      collection.push(newUser);
      saveCollection(collection);

      // Display JSON collection on the page.
      jsonOutput.style.display = "block";
      jsonOutput.textContent = JSON.stringify(
        collection,
        null,
        2
      );

      form.reset();

    } catch (error) {
      console.error(
        "Shopper API submission failed:",
        error
      );

      alert(
        "Unable to save signup information. " +
        "Please try again."
      );
    }
  });
});
