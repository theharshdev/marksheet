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
  let findSubject = false;

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

  if (
    !findSubject &&
    subjectNameInp.value != "" &&
    totalMarksInp.value != "" &&
    obtainedMarksInp.value != ""
  ) {
    // console.log("All Good");
    warningPara.classList.remove("text-red-500");

    let newDate = ` <!-- Subject ${serialNumber} -->
                    <div class="grid grid-cols-6 gap-3">
                    <p class="text-lg uppercase">${serialNumber}.</p>
                    <p class="text-lg uppercase subject">${subjectNameInp.value}</p>
                    <p class="text-lg uppercase text-center totalmakrs">${totalMarksInp.value}</p>
                    <p class="text-lg uppercase text-center obtainedmarks">${obtainedMarksInp.value}</p>
                    <p class="text-lg uppercase text-center grades">c</p>
                    <button
                        type="button"
                        class="text-lg uppercase text-center delete-btn inline-block w-fit mx-auto text-red-500 cursor-pointer delete-subject-row-btn"
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
  } else {
    warningPara.classList.add("text-red-500");
    if (findSubject) {
      warningPara.textContent = `You have added ${subjectNameInp.value} already`;
    }
  }

  if (data != "") {
    percentageBox.style.display = "flex";
  }

  subjectNameInp.value = "";
  totalMarksInp.value = "";
  obtainedMarksInp.value = "";
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
  localStorage.setItem("marksheetData", "");
  localStorage.setItem("serialNumber", "");
  clearTableBtn.classList.add("hidden");
  percentageBox.style.display = "none";
  mainTable.innerHTML = "";
});
