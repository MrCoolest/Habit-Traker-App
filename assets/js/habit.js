(function () {
  console.log("Workign inside habit js");
  const daysList = document.getElementById("item-list");
  const habit_name = document.getElementById("habit-name");
  const start_date = document.getElementById("start-date");
  const end_date = document.getElementById("end-date");
  const filter_button = document.getElementById("filter");
  var a = moment().toString();
  console.log(a);

  filter_button.addEventListener("click", filter_habits);



  function SetMinMaxDateOnDatePicker() {
    currentDate = moment().format('YYYY-MM-DD');
    sixtyDaysBefore = moment(currentDate).subtract(60, 'days').format('YYYY-MM-DD');
    // console.log(sixtyDaysBefore);
    start_date.setAttribute("max", currentDate)
    end_date.setAttribute("max", currentDate);
    start_date.setAttribute("min", sixtyDaysBefore)
    end_date.setAttribute("min", sixtyDaysBefore);
    start_date.value = moment(currentDate).subtract(6, 'days').format('YYYY-MM-DD');
    end_date.value = currentDate;
}

// call function to fix min max values
SetMinMaxDateOnDatePicker();

const updateThisDateInDb = async function (date, value) {
    console.log('value',value)
    const res = await fetch(`/update-db-date?id=${getHabitId()}&date=${date}&value=${value}`)
    const data = await res.json();
    // console.log(data);
}

const renderOnLoad = async function (days, endDate) {
    const data = await fetch_habits();
    const recordTracker = data;
    console.log(recordTracker);
    renderDaysList(days, recordTracker, endDate);
}


  //  this function helps in rendering the date list
    // it sets some properties of all the dates so that user can interact properly
    const renderDaysList = function (count, recordTracker, endDate) {
        let i = 0;
        // const currentDate = moment().format('YYYY-MM-DD');
        while (i <= count) {
            const fromattedDate = moment(endDate).subtract(i, 'days').format('LL');
            const date = moment(endDate).subtract(i, 'days').format('l');
            console.log('date', moment(endDate).subtract(i, 'days').format('l'))
            const listElement = document.createElement("li");
            listElement.setAttribute("class", "list-item");
            listElement.setAttribute("id", date);

            const dateDiv = document.createElement("div");
            dateDiv.setAttribute("class", "date-div");
            dateDiv.innerHTML = fromattedDate;

            // Mark the date as current date
            if (moment(endDate).subtract(i, 'days').valueOf() == moment(currentDate).valueOf()) {
                dateDiv.innerHTML += " (TODAY)";
                listElement.style.border = " 2px solid lightslategray";
            }

            const statusDiv = document.createElement("div");
            statusDiv.setAttribute("class", "status");
            console.log('date',date)
            console.log('recordTracker',recordTracker)
            if (date in recordTracker) {
                // console.log(date + "  " + recordTracker[date])
                if (recordTracker[date] == false) {
                    statusDiv.style.backgroundColor = "red";
                }
                else if (recordTracker[date] == true) {
                    statusDiv.style.backgroundColor = "green";
                }
                else if (recordTracker[date] == null) {
                    statusDiv.style.backgroundColor = "gray";
                }
            }
            else {
                statusDiv.style.backgroundColor = "gray";
            }

            listElement.onclick = function () {
                let value = 0;
                if (statusDiv.style.backgroundColor == "gray") {
                    statusDiv.style.backgroundColor = "green"
                    value = '1';
                }
                else if (statusDiv.style.backgroundColor == "green") {
                    statusDiv.style.backgroundColor = "red"
                    value = '0';
                }
                else if (statusDiv.style.backgroundColor == "red") {
                    statusDiv.style.backgroundColor = "gray"
                    value = '-1';
                }
                updateThisDateInDb(date, value);
            }

            listElement.appendChild(dateDiv);
            listElement.appendChild(statusDiv);

            daysList.appendChild(listElement);
            i++;
        }
    }


  function filter_habits(e) {
    let startDateMoment = moment(start_date.value);
    let endDateMoment = moment(end_date.value);
    let days = endDateMoment.diff(startDateMoment, 'days');
    if (days < 0) {
        alert("Start date cannot be greater than end date");
        return;
    }
    daysList.innerHTML = "";
    renderOnLoad(days, endDateMoment);
    const habit_data = fetch_habits();
    console.log(habit_data);
  }

  function getHabitId(){
    const queryString =  window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id')
    return id;
  }

  async function fetch_habits() {
    const id = getHabitId();
    const res = await fetch("/fetch-habit?id=" + id);
    const data = await res.json();
    return data;
  }
})();
