const AddBtn = document.querySelector(".addBtn");
const habitName = document.querySelector(".habitName");
const tabs = document.querySelector(".tabs");
let daysContainer = document.querySelector(".days");
let habits = JSON.parse(localStorage.getItem("habits")) || [];
let currentTab;

// Add New Habit
function addNewHabit() {
  AddBtn.addEventListener("click", () => {
    if (!habitName.value || habitName.value.trim() === "") {
      alert("Nothing To Save");
      habitName.value = "";
    } else {
      habits.push({
        habitName: habitName.value,
        days: new Array(100).fill(0).map((_, i) => ({
          status: "uncomplete",
          day: i + 1,
        })),
      });
      //   Update Local Storage
      localStorage.setItem("habits", JSON.stringify(habits));
      // update Dom
      renderTabs();
      daysContainer.innerHTML = "";
      habitName.value = "";
    }
  });
}
// render Habits in tabs
function renderTabs() {
  tabs.innerHTML = "";
  habits.forEach(({ habitName, days }) => {
    let html = `
         <div class="tab flex" data-id="${habitName}">
        <span class="delete-habit" data-id="${habitName}">x</span>

        ${habitName}
      </div>
        `;

    tabs.innerHTML += html;
  });
}
// activiate a habit tab
function selectTab() {
  tabs.addEventListener("click", (e) => {
    if (e.target.classList.contains("tab")) {
      document.querySelectorAll(".tab").forEach((tab) => {
        tab.classList.remove("active");
      });
      e.target.classList.add("active");
      currentTab = e.target.getAttribute("data-id");
      daysContainer.innerHTML = "";
      renderDays(currentTab);
    }
  });
}
// delete a habit
function deleteTab() {
  tabs.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-habit")) {
      let userDecision = confirm("Are Sure To Delete This Habit Forever ?");
      if (userDecision)
        // delete the habit from habits array
        habits.splice(
          habits.findIndex(
            (habit) => habit.habitName == e.target.getAttribute("data-id")
          ),
          1
        );
      //    update local storage
      localStorage.setItem("habits", JSON.stringify(habits));
      // update dom
      renderTabs();
      daysContainer.innerHTML = "";
    }
  });
}
// render days of habit
function renderDays(currentTab) {
  if (currentTab) {
    daysContainer.innerHTML = "";

    habits[
      habits.findIndex((habit) => habit.habitName == currentTab)
    ].days.forEach(({ day, status }) => {
      let html = `
      <span class="day ${status} flex">${day}</span>
      `;
      daysContainer.innerHTML += html;
    });
  }
}

function updateStatus() {
  daysContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("day")) {
      if (
        habits.find((habit) => habit.habitName == currentTab).days[
          `${e.target.textContent - 1}`
        ].status == "uncomplete"
      ) {
        changeStatus("completed", e);
      } else if (
        habits.find((habit) => habit.habitName == currentTab).days[
          `${e.target.textContent - 1}`
        ].status == "completed"
      ) {
        changeStatus("missed", e);
      } else if (
        habits.find((habit) => habit.habitName == currentTab).days[
          `${e.target.textContent - 1}`
        ].status == "missed"
      ) {
        changeStatus("uncomplete", e);
      }
    }
  });
}

function changeStatus(status, event) {
  habits.find((habit) => habit.habitName == currentTab).days[
    `${event.target.textContent - 1}`
  ].status = status;
  renderDays(currentTab);
  localStorage.setItem("habits", JSON.stringify(habits));
}

addNewHabit();
renderTabs();
selectTab();
renderDays(currentTab);
deleteTab();
updateStatus();
