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

let data = "";

// Subject name validation
subjectNameInp.addEventListener("input", () => {
  subjectNameInp.value = subjectNameInp.value.replace(/[^A-Za-z ]/g, "");
});

// Marks validation (max 3 digits)
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

  const subjectNames = mainTable.querySelectorAll(".subject");
  subjectNames.forEach((subject) => {
    const subjectValue = subject.textContent.toUpperCase();
    subjects.push(subjectValue);
  });

  if (subjects.includes(subjectNameInp.value.toUpperCase())) {
    findSubject = true;
  } else {
    findSubject = false;
  }

  if (Number(obtainedMarksInp.value) > Number(totalMarksInp.value)) {
    checkBigger = false;
  } else {
    checkBigger = true;
  }

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

  if (
    checkBigger &&
    !findSubject &&
    subjectNameInp.value != "" &&
    totalMarksInp.value != "" &&
    obtainedMarksInp.value != ""
  ) {
    warningPara.classList.remove("text-red-500");

    // Calculate percentage
    let percentage =
      (Number(obtainedMarksInp.value) / Number(totalMarksInp.value)) * 100;

    let grade;

    // Decide grade
    switch (true) {
      case percentage >= 90:
        grade = "A+";
        break;

      case percentage >= 80:
        grade = "A";
        break;

      case percentage >= 70:
        grade = "B";
        break;

      case percentage >= 60:
        grade = "C";
        break;

      case percentage >= 50:
        grade = "D";
        break;

      case percentage >= 33:
        grade = "E";
        break;

      default:
        grade = "Fail";
    }

    let newDate = `<div class="grid grid-cols-5 gap-3 lg:text-base text-sm uppercase subject-row">
                    <p class="subject">${subjectNameInp.value}</p>
                    <p class="text-center totalmakrs">${totalMarksInp.value}</p>
                    <p class="text-center obtainedmarks">${obtainedMarksInp.value}</p>
                    <p class="text-center grades">${grade}</p>
                    <button type="button" class="text-center delete-btn inline-block w-fit mx-auto hover:text-red-500 cursor-pointer transition duration-500"><i class="bi bi-trash-fill"></i></button>
                    </div>`;

    data += newDate;
    mainTable.innerHTML = data;
    localStorage.setItem("marksheetData", data);
    clearTableBtn.classList.remove("hidden");
    warningPara.textContent = "Feilds with * is mendatory to fill.";

    subjectNameInp.value = "";
    totalMarksInp.value = "";
    obtainedMarksInp.value = "";

    if (showTotalMarksElm.innerHTML != "") {
      calculateTotalmarks();
    }
  } else {
    warningPara.classList.add("text-red-500");
    if (findSubject) {
      warningPara.textContent = `You have added ${subjectNameInp.value} already`;
    }
    if (checkBigger === false) {
      warningPara.textContent = `Obtained marks could not be greater than total marks`;
    }
  }

  if (data != "") {
    percentageBox.style.display = "flex";
  }
});

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

calPerMarks.addEventListener("click", calculateTotalmarks);

window.addEventListener("load", () => {
  let storedData = localStorage.getItem("marksheetData");

  if (storedData != null && storedData != "") {
    data = storedData;
    mainTable.innerHTML = storedData;
    clearTableBtn.classList.remove("hidden");
    percentageBox.style.display = "flex";
  }
});

clearTableBtn.addEventListener("click", () => {
  data = "";
  localStorage.setItem("marksheetData", "");
  clearTableBtn.classList.add("hidden");
  percentageBox.style.display = "none";
  mainTable.innerHTML = "";
  showTotalMarksElm.innerHTML = "";
});

mainTable.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".delete-btn");
  if (!deleteBtn) return;

  const row = deleteBtn.closest(".subject-row");
  if (!row) return;

  row.remove();
  data = mainTable.innerHTML;
  localStorage.setItem("marksheetData", mainTable.innerHTML);

  if (showTotalMarksElm.innerHTML != "") {
    calculateTotalmarks();
  }

  const subjectRow = document.querySelectorAll(".subject-row");
  console.log(subjectRow.length);

  if (subjectRow.length === 0) {
    percentageBox.style.display = "none";
    clearTableBtn.classList.add("hidden");
    showTotalMarksElm.innerHTML = "";
  }
});
