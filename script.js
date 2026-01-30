const subjectNameInp = document.getElementById("subject-name");
const totalMarksInp = document.getElementById("total-marks");
const calculatePercentageMarks = document.getElementById(
  "calculate-percentage",
);
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
let serialNumber = 1;
let savedData = "";

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

      case percentage >= 40:
        grade = "E";
        break;

      default:
        grade = "Fail";
    }

    let newDate = ` <!-- Subject ${serialNumber} -->
                    <div class="grid grid-cols-6 gap-3 lg:text-xl text-lg uppercase">
                    <p>${serialNumber}.</p>
                    <p class="subject">${subjectNameInp.value}</p>
                    <p class="text-center totalmakrs">${totalMarksInp.value}</p>
                    <p class="text-center obtainedmarks">${obtainedMarksInp.value}</p>
                    <p class="text-center grades">${grade}</p>
                    <button
                        type="button"
                        class="text-center delete-btn inline-block w-fit mx-auto hover:text-red-500 cursor-pointer delete-subject-row-btn transition duration-500"
                    >
                        <i class="bi bi-trash-fill"></i>
                    </button>
                    </div>`;

    data += newDate;
    mainTable.innerHTML = data;
    localStorage.setItem("marksheetData", data);
    serialNumber += 1;
    localStorage.setItem("serialNumber", serialNumber);
    clearTableBtn.classList.remove("hidden");
    warningPara.textContent = "Feilds with * is mendatory to fill.";

    subjectNameInp.value = "";
    totalMarksInp.value = "";
    obtainedMarksInp.value = "";
    showTotalMarksElm.innerHTML = "";
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

calculatePercentageMarks.addEventListener("click", () => {
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

  showTotalMarksElm.innerHTML = `Total Max. Marks = ${totalMaxMarks} <br /> Total Obtained Marks = ${totalObtainedMarks} <br /> Total Percentage = ${totalPercentage.toFixed(2)}%`;

  console.log(totalMaxMarks, totalObtainedMarks, totalPercentage.toFixed(2));
});

window.addEventListener("load", () => {
  let storedData = localStorage.getItem("marksheetData");

  if (storedData != null && storedData != "") {
    serialNumber = Number(localStorage.getItem("serialNumber"));
    data = storedData;
    mainTable.innerHTML = storedData;
    clearTableBtn.classList.remove("hidden");
    percentageBox.style.display = "flex";
  }
});

clearTableBtn.addEventListener("click", () => {
  data = "";
  localStorage.setItem("marksheetData", "");
  localStorage.setItem("serialNumber", "");
  clearTableBtn.classList.add("hidden");
  percentageBox.style.display = "none";
  mainTable.innerHTML = "";
});
