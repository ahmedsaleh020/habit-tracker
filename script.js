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
        days: new Array(200).fill(0),
      });
      //   Update Local Storage
      localStorage.setItem("habits", JSON.stringify(habits));
      // update Dom
      renderTabs();

      habitName.value = "";
    }
  });
}

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
function selectTab() {
  tabs.addEventListener("click", (e) => {
    if (e.target.classList.contains("tab")) {
      document.querySelectorAll(".tab").forEach((tab) => {
        tab.classList.remove("active");
      });
      e.target.classList.add("active");
      currentTab = e.target.getAttribute("data-id");
      renderDays(currentTab);
    }
  });
}
function deleteTab() {
  tabs.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-habit")) {
      let userDecision = confirm("Are Sure To Delete This Habit Forever ?");
      if (userDecision)
        // delete the habit from habits array
        habits.splice(
          habits.findIndex(
            (habit) => habit.habitName == e.target.getAttribute("data-id")
          )
        );
      //    update local storage
      localStorage.setItem("habits", JSON.stringify(habits));
      // update dom
      renderTabs();
      daysContainer.innerHTML = "";
    }
  });
}

function renderDays(currentTab) {
  if (currentTab) {
    daysContainer.innerHTML += "";
    habits
      .at(habits.findIndex((habit) => habit.habitName == currentTab))
      .days.forEach((day) => {
        let html = `
      <span class="day flex">${day}</span>
      `;
        daysContainer.innerHTML += html;
      });
  }
}
addNewHabit();
renderTabs();
selectTab();
renderDays(currentTab);
deleteTab();
