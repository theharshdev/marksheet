// All elements ------------------------------------------------------------
const subjectNameInp = document.getElementById("subject-name");
const totalMarksInp = document.getElementById("total-marks");
const calPerMarks = document.getElementById("calculate-percentage");
const mainTable = document.getElementById("main-table");
const obtainedMarksInp = document.getElementById("obtained-marks");
const addToTableBtn = document.getElementById("add-to-table-btn");
const percentageBox = document.getElementById("percentage-box");
const showPercentageElm = document.getElementById("show-percentage");
const showObtainedMarksElm = document.getElementById("show-obtained-marks");
const showTotalMarksElm = document.getElementById("show-total-marks");
const warningPara = document.getElementById("warning-para");
const clearTableBtn = document.getElementById("clear-table-btn");

// Making a space for user input data -----------------------------------------
let data = "";

// Subject name validation ----------------------------------------------------
subjectNameInp.addEventListener("input", () => {
  subjectNameInp.value = subjectNameInp.value.replace(/[^A-Za-z ]/g, "");
});

// Marks validation (max 3 digits) --------------------------------------------
function limitToThreeDigits(input) {
  input.value = input.value.replace(/\D/g, "").slice(0, 3);
}

totalMarksInp.addEventListener("input", () => {
  limitToThreeDigits(totalMarksInp);
});

obtainedMarksInp.addEventListener("input", () => {
  limitToThreeDigits(obtainedMarksInp);
});

addToTableBtn.addEventListener("click", () => {
  let subjects = [];
  let findSubject;
  let checkBigger;

  // Getting subjects name which are present in the table ---------------------
  const subjectNames = mainTable.querySelectorAll(".subject");
  subjectNames.forEach((subject) => {
    const subjectValue = subject.textContent.toUpperCase();
    // Pushing it to an array
    subjects.push(subjectValue);
  });

  // Checking if the entered subject name, already exist or not ---------------
  if (subjects.includes(subjectNameInp.value.toUpperCase())) {
    findSubject = true;
  } else {
    findSubject = false;
  }

  // Validating that obtained marks should not be greater than maximum marks ---
  if (Number(obtainedMarksInp.value) > Number(totalMarksInp.value)) {
    checkBigger = false;
  } else {
    checkBigger = true;
  }

  // Giving the warning if any of the input is empty ---------------------------
  if (
    subjectNameInp.value != "" ||
    totalMarksInp.value != "" ||
    obtainedMarksInp.value != ""
  ) {
    warningPara.classList.add("text-red-500");
    warningPara.textContent = "Feilds with * is mendatory to fill.";
  } else {
    warningPara.classList.remove("text-red-500");
  }

  // Checking all the conditions if subject name exist and --------------------
  // obtained marks should not be greater than maximum marks and --------------
  // not any input is empty ---------------------------------------------------
  if (
    checkBigger &&
    !findSubject &&
    subjectNameInp.value != "" &&
    totalMarksInp.value != "" &&
    obtainedMarksInp.value != ""
  ) {
    warningPara.classList.remove("text-red-500");

    // Calculate percentage ---------------------------------------------------
    let percentage =
      (Number(obtainedMarksInp.value) / Number(totalMarksInp.value)) * 100;

    let grade;

    // Assign a value to grade according to percentage ------------------------
    if (percentage >= 90) {
      grade = "A+";
    } else if (percentage >= 80) {
      grade = "A";
    } else if (percentage >= 70) {
      grade = "B";
    } else if (percentage >= 60) {
      grade = "C";
    } else if (percentage >= 50) {
      grade = "D";
    } else if (percentage >= 33) {
      grade = "E";
    } else {
      grade = "FAIL";
    }

    // Adding new html with data given by the user after validating all things -----
    let newDate = `<div class="grid grid-cols-5 gap-3 lg:text-base text-sm uppercase subject-row">
                    <p class="subject">${subjectNameInp.value}</p>
                    <p class="text-center totalmakrs">${totalMarksInp.value}</p>
                    <p class="text-center obtainedmarks">${obtainedMarksInp.value}</p>
                    <p class="text-center grades">${grade}</p>
                    <button type="button" class="text-center delete-btn inline-block w-fit mx-auto hover:text-red-500 cursor-pointer transition duration-500"><i class="bi bi-trash3"></i></button>
                    </div>`;

    // Adding it to main data ---------------------------------------------------
    data += newDate;
    mainTable.innerHTML = data;
    localStorage.setItem("marksheetData", data);
    clearTableBtn.classList.remove("hidden");
    warningPara.textContent = "Feilds with * is mendatory to fill.";
    // Empty the inputs after successful submission ----------------------------
    subjectNameInp.value = "";
    totalMarksInp.value = "";
    obtainedMarksInp.value = "";
    // Calculating total makrs & percentage -------------------------------------
    if (showTotalMarksElm.innerHTML != "") {
      calculateTotalmarks();
    }
  } else {
    warningPara.classList.add("text-red-500");
    // Shwoing warnings if user entered the subject name again and --------------
    // if obtained makrs are greater than maximum marks -------------------------
    if (findSubject) {
      warningPara.textContent = `You have added ${subjectNameInp.value} already`;
    }
    if (checkBigger === false) {
      warningPara.textContent = `Obtained marks could not be greater than total marks`;
    }
  }

  // Showing button for calculation if data is not empty -------------------------
  if (data != "") {
    percentageBox.style.display = "flex";
  }
});

// Calculating total marks, obtained marks & total percentage --------------------
function calculateTotalmarks() {
  const totalmakrs = mainTable.querySelectorAll(".totalmakrs");
  const obtainedmarks = mainTable.querySelectorAll(".obtainedmarks");

  let totalMaxMarks = 0;
  let totalObtainedMarks = 0;

  totalmakrs.forEach((totalmark, i) => {
    const maxMarks = Number(totalmark.textContent);
    const obtainedmark = Number(obtainedmarks[i].textContent);

    totalObtainedMarks += obtainedmark;
    totalMaxMarks += maxMarks;
  });

  const totalPercentage = (totalObtainedMarks / totalMaxMarks) * 100;

  showTotalMarksElm.innerHTML = `<div class="py-4 px-6">Total Max. Marks = ${totalMaxMarks} <br /> Total Obtained Marks = ${totalObtainedMarks} <br /> Total Percentage = ${totalPercentage.toFixed(2)}%</div>`;
}

// Added on click on calculate btn --------------------------------------------
calPerMarks.addEventListener("click", calculateTotalmarks);

window.addEventListener("load", () => {
  let storedData = localStorage.getItem("marksheetData");

  if (storedData != null && storedData != "") {
    // Filling the local storage data in data variable ------------------------
    data = storedData;
    mainTable.innerHTML = storedData;
    // Showing clear table btn ------------------------------------------------
    clearTableBtn.classList.remove("hidden");
    // Shwoing total marks & percentage section after -------------------------
    // validation if local storag have any data -------------------------------
    percentageBox.style.display = "flex";
  }
});

// Added table delete functionality here -------------------------------------
clearTableBtn.addEventListener("click", () => {
  // Empty the data ----------------------------------------------------------
  data = "";
  // Empty the local storage -------------------------------------------------
  localStorage.setItem("marksheetData", "");
  clearTableBtn.classList.add("hidden");
  percentageBox.style.display = "none";
  mainTable.innerHTML = "";
  showTotalMarksElm.innerHTML = "";
});

// Added row deletion here --------------------------------------------------
mainTable.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".delete-btn");
  if (!deleteBtn) return;

  const row = deleteBtn.closest(".subject-row");
  if (!row) return;

  // Removing the subject row -----------------------------------------------
  row.remove();
  // Refreshing the data with new innerHTML ---------------------------------
  data = mainTable.innerHTML;
  // Setting the new innerHTML to the local storage -------------------------
  localStorage.setItem("marksheetData", mainTable.innerHTML);
  // Updating the marks and percentage on subject row deletion --------------
  if (showTotalMarksElm.innerHTML != "") {
    calculateTotalmarks();
  }

  // Hiding percentageBox, clearTableBtn when there is no subject rows in table --------
  if (document.querySelectorAll(".subject-row").length === 0) {
    percentageBox.style.display = "none";
    clearTableBtn.classList.add("hidden");
    // Empty the total marks & percentage innerHTML ----------------------------
    showTotalMarksElm.innerHTML = "";
  }
});
