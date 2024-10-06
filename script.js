const AddBtn = document.querySelector(".addBtn");
const habitName = document.querySelector(".habitName");
const tabs = document.querySelector(".tabs");
let daysContainer = document.querySelector(".days");
let habits = JSON.parse(localStorage.getItem("habits")) || [];
let countersContainer = document.querySelector(".counters");
let completedCounter = document.querySelector(".completed-counter");
let missedCounter = document.querySelector(".missed-counter");
let streakCounter = document.querySelector(".streak-counter");
let currentTab, selected;
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
      countersContainer.classList.remove("show");
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
      selected = e.target;
    }
    tabsToggle("remove");
    selected.classList.add("active");
    currentTab = selected.dataset.id;
    daysContainer.innerHTML = "";
    renderDays(currentTab);
    countersContainer.classList.add("show");
    daysContainer.style.visibility = "visible";
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
      countersContainer.classList.remove("show");

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
    countersContainer.classList.add("show");
    updateCounters(currentTab);
  }
}
// Handles status update on click
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
//Changes the status of a day
function changeStatus(status, event) {
  habits.find((habit) => habit.habitName == currentTab).days[
    `${event.target.textContent - 1}`
  ].status = status;
  renderDays(currentTab);
  localStorage.setItem("habits", JSON.stringify(habits));
}

// Update the counters of completed and missed days
function updateCounters(currentTab) {
  const habit = habits.find((habit) => habit.habitName == currentTab);
  const completedDays = habit.days.filter(
    (day) => day.status === "completed"
  ).length;
  const missedDays = habit.days.filter((day) => day.status === "missed").length;

  completedCounter.textContent = `Completed: ${completedDays}`;
  missedCounter.textContent = `Missed: ${missedDays}`;
  const longestStreak = calculateLongestStreak(habit.days);
  streakCounter.textContent = `Longest Streak : ${longestStreak}`;
}

// Calculate the longest streak of  completed days
function calculateLongestStreak(days) {
  return days.reduce(
    (acc, curr) => {
      if (curr.status == "completed") {
        acc.currentStreak++;
        if (acc.currentStreak > acc.longestStreak) {
          acc.longestStreak = acc.currentStreak;
        }
      } else {
        acc.currentStreak = 0;
      }
      return acc;
    },
    { currentStreak: 0, longestStreak: 0 }
  ).longestStreak;
}
// hide daysContainer and De-activate selected tab when click outside
function closeOutSide() {
  daysContainer.style.visibility = "hidden";
  countersContainer.classList.remove("show");
  tabsToggle("remove");
}
document.addEventListener("click", function (e) {
  if (
    e.target == daysContainer ||
    e.target == tabs ||
    e.target.classList.contains("tab")
  )
    return;
  else {
    closeOutSide();
  }
});
// show and hide tabs
function tabsToggle(method) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList[`${method}`]("active");
  });
}
addNewHabit();
renderTabs();
selectTab();
renderDays(currentTab);
deleteTab();
updateStatus();
