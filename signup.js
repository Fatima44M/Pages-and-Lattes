// signup.js — validates the sign-up form, builds a JSON object
// from the DOM input values, and displays the JSON collection on the page.

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signupForm");
  const jsonOutput = document.getElementById("jsonOutput");

  // Keep every submission in a "collection" (array) stored in localStorage
  const STORAGE_KEY = "pagesAndLattesShoppers";

  function getCollection() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  function saveCollection(collection) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();

    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const phone = document.getElementById("phone");
    const favoriteGenre = document.getElementById("favoriteGenre");

    let valid = true;

    // --- Field integrity checks ---
    [fullName, email, username, password, confirmPassword].forEach(field => {
      field.classList.remove("is-invalid");
    });

    if (fullName.value.trim() === "") {
      fullName.classList.add("is-invalid");
      valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
      email.classList.add("is-invalid");
      valid = false;
    }

    if (username.value.trim().length < 3) {
      username.classList.add("is-invalid");
      valid = false;
    }

    if (password.value.length < 6) {
      password.classList.add("is-invalid");
      valid = false;
    }

    if (confirmPassword.value !== password.value || confirmPassword.value === "") {
      confirmPassword.classList.add("is-invalid");
      valid = false;
    }

    if (!valid) {
      jsonOutput.style.display = "none";
      return;
    }

    // --- Build JSON object from DOM input name:value pairs ---
    const newUser = {
      fullName: fullName.value.trim(),
      email: email.value.trim(),
      username: username.value.trim(),
      password: password.value,
      phone: phone.value.trim(),
      favoriteGenre: favoriteGenre.value
    };

    // Add to the shopper collection and persist it
    const collection = getCollection();
    collection.push(newUser);
    saveCollection(collection);

    // --- Display the JSON document (the full collection) on the page ---
    jsonOutput.style.display = "block";
    jsonOutput.textContent = JSON.stringify(collection, null, 2);

    form.reset();
  });
});
