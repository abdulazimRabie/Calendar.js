let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.getElementById("calendar"); 
const backDropModal = document.getElementById("modalBackDrop");
const newEventModal = document.getElementById("newEventModal");
const deleteEventModal = document.getElementById("deleteEventModal");
const eventInput = document.getElementById("eventTitleInput");
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


function openModal(date) {
  clicked = date;
  let eventForDay = events.find(e => e.date == date); // {date:-/-/-, title:''}
  console.log(eventForDay);
  if (eventForDay) {
    deleteEventModal.style.display = "block";
    document.getElementById("eventTitle").innerText = eventForDay.title;
  } else {
    newEventModal.style.display = "block";
  }

  backDropModal.style.display = "block";
  document.body.style.overflow = "hidden";

}

function load() {
  let dt = new Date();

  if (nav !== 0) {
    dt.setMonth(dt.getMonth() + nav);
  }

  let day = dt.getDate();
  let month = dt.getMonth();
  let year = dt.getFullYear();

  let daysInMonth = new Date(year, month+1, 0).getDate();
  let dateString = new Date(year, month, 1).toLocaleDateString('en-us', {
    weekday: "long",
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });

  let paddingDays = weekdays.indexOf(dateString.split(", ")[0]);

  calendar.innerHTML = ``;

  document.getElementById("monthDisplay").innerText = 
  `${dt.toLocaleString('en-us', {month: 'long'})} ${year}`;

  for (let i = 1; i <= daysInMonth + paddingDays; i++) {
    let daySquare = document.createElement("div");
    daySquare.classList.add("day");

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;
      const dayString = `${month + 1}/${i - paddingDays}/${year}`;
      const eventOfDay = events.find(e => e.date == dayString);

      if ((day == i - paddingDays) && nav == 0) {
        daySquare.id = 'currentDay';
      }

      if (eventOfDay) {
        let eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.innerText = eventOfDay.title;
        daySquare.appendChild(eventDiv);
      }

      daySquare.addEventListener('click', () => openModal(dayString));;
    } 
    else {
      daySquare.classList.add("padding");
    }

    calendar.appendChild(daySquare);
  }
}

function closeModal() {
  newEventModal.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDropModal.style.display = 'none';
  document.body.style.overflowY = "scroll";
  eventInput.value = '';

  clicked = null;
}

function saveEvent() {
  events.push({
    date: clicked,
    title: eventInput.value
  });
  localStorage.setItem("events", JSON.stringify(events));

  closeModal();
  load();
}

function deleteEvent() {
  // let eventIndex = events.indexOf(events.find(e => e.date == clicked));
  // events.splice(eventIndex, 1);
  // do the above or
  events = events.filter(e => e.date !== clicked);
  localStorage.setItem('events', JSON.stringify(events));

  closeModal();
  load();
}

function initButton() {
  document.getElementById("nextButton").addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById("backButton").addEventListener('click', () => {
    nav--;
    load();
  });

  document.getElementById("saveButton").addEventListener('click', saveEvent);
  document.getElementById("cancelButton").addEventListener('click', closeModal);

  document.getElementById("deleteButton").addEventListener('click', deleteEvent);
  document.getElementById("closeButton").addEventListener('click', closeModal);;

}




initButton();
load();