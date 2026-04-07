function openFeatures() {
    var allElems = document.querySelectorAll('.elem')
    var fullElemPage = document.querySelectorAll('.fullElem')
    var fullElemPageBackBtn = document.querySelectorAll('.fullElem .back')

    allElems.forEach(function (elem) {
        elem.addEventListener('click', function () {
            fullElemPage[elem.id].style.display = 'block'
        })
    })

    fullElemPageBackBtn.forEach(function (back) {
        back.addEventListener('click', function () {
            fullElemPage[back.id].style.display = 'none'
        })
    })
}

openFeatures()


function todoList() {

    var currentTask = []

    if (localStorage.getItem('currentTask')) {
        currentTask = JSON.parse(localStorage.getItem('currentTask'))
    } else {
        console.log('Task list is Empty');
    }



    function renderTask() {
        currentTask.sort((a, b) => {
            if (a.completed && !b.completed) return 1;
            if (!a.completed && b.completed) return -1;
            return 0;
        });

        var allTask = document.querySelector('.allTask')

        var sum = ''

        currentTask.forEach(function (elem, idx) {
            var completedClass = elem.completed ? 'task-completed' : '';
            sum = sum + `<div class="task ${completedClass}">
        <h5 class="${completedClass}">${elem.task} <span class=${elem.imp}>imp</span></h5>
        <button id=${idx}>${elem.completed ? 'Undo' : 'Mark as Completed'}</button>
        </div>`
        })

        allTask.innerHTML = sum

        localStorage.setItem('currentTask', JSON.stringify(currentTask))

        document.querySelectorAll('.task button').forEach(function (btn) {
            btn.addEventListener('click', function () {
                currentTask[btn.id].completed = !currentTask[btn.id].completed;
                renderTask()
            })
        })
    }
    renderTask()

    let form = document.querySelector('.addTask form')
    let taskInput = document.querySelector('.addTask form #task-input')
    let taskDetailsInput = document.querySelector('.addTask form textarea')
    let taskCheckbox = document.querySelector('.addTask form #check')

    form.addEventListener('submit', function (e) {
        e.preventDefault()
        currentTask.push(
            {
                task: taskInput.value,
                details: taskDetailsInput.value,
                imp: taskCheckbox.checked,
                completed: false
            }
        )
        renderTask()

        taskCheckbox.checked = false
        taskInput.value = ''
        taskDetailsInput.value = ''
    })
}

todoList()

function dailyPlanner() {
    var dayPlanner = document.querySelector('.day-planner')

    var dayPlanData = JSON.parse(localStorage.getItem('dayPlanData')) || {}

    const hours = []

    for (let i = 0; i < 18; i++) {
        hours.push(`${6 + i}:00 - ${7 + i}:00`)
    }

    // var hours = Array.from({ length: 18 }, (_, idx) => `${6 + idx}:00 - ${7 + idx}:00`)


    var wholeDaySum = ''
    hours.forEach(function (elem, idx) {

        var savedData = dayPlanData[idx] || ''

        wholeDaySum = wholeDaySum + `<div class="day-planner-time">
    <p>${elem}</p>
    <input id=${idx} type="text" placeholder="..." value=${savedData}>
</div>`
    })

    dayPlanner.innerHTML = wholeDaySum


    var dayPlannerInput = document.querySelectorAll('.day-planner input')

    dayPlannerInput.forEach(function (elem) {
        elem.addEventListener('input', function () {
            console.log('hello');
            dayPlanData[elem.id] = elem.value

            localStorage.setItem('dayPlanData', JSON.stringify(dayPlanData))
        })
    })
}

dailyPlanner()


function motivationalQuote() {
    var motivationQuoteContent = document.querySelector('.motivation-2 h1')
    var motivationAuthor = document.querySelector('.motivation-3 h2')

    async function fetchQuote() {
        let response = await fetch('https://api.quotable.io/random')
        let data = await response.json()

        motivationQuoteContent.innerHTML = data.content
        motivationAuthor.innerHTML = data.author
    }

    fetchQuote()
}

motivationalQuote()


function pomodoroTimer() {

    let timer = document.querySelector('.pomo-timer h1')
    var startBtn = document.querySelector('.pomo-timer .start-timer')
    var pauseBtn = document.querySelector('.pomo-timer .pause-timer')
    var resetBtn = document.querySelector('.pomo-timer .reset-timer')
    var session = document.querySelector('.pomodoro-fullpage .session')
    var addTimeBtn = document.querySelector('#add-time')
    var subTimeBtn = document.querySelector('#sub-time')
    var alarmAudio = document.querySelector('#pomo-alarm')

    var isWorkSession = true
    let workMinutes = 25
    let totalSeconds = workMinutes * 60
    let timerInterval = null

    addTimeBtn.addEventListener('click', function() {
        if(!timerInterval && workMinutes < 60) {
            workMinutes += 5;
            resetTimer();
        }
    })

    subTimeBtn.addEventListener('click', function() {
        if(!timerInterval && workMinutes > 5) {
            workMinutes -= 5;
            resetTimer();
        }
    })

    function updateTimer() {
        let minutes = Math.floor(totalSeconds / 60)
        let seconds = totalSeconds % 60

        timer.innerHTML = `${String(minutes).padStart('2', '0')}:${String(seconds).padStart('2', '0')}`
    }

    function startTimer() {
        clearInterval(timerInterval)

        timerInterval = setInterval(function () {
            if (totalSeconds > 0) {
                totalSeconds--
                updateTimer()
            } else {
                alarmAudio.play();
                clearInterval(timerInterval)
                if (isWorkSession) {
                    isWorkSession = false
                    timer.innerHTML = '05:00'
                    session.innerHTML = 'Take a Break'
                    session.style.backgroundColor = 'var(--blue)'
                    totalSeconds = 5 * 60
                    updateTimer()
                } else {
                    isWorkSession = true
                    timer.innerHTML = `${String(workMinutes).padStart('2', '0')}:00`
                    session.innerHTML = 'Work Session'
                    session.style.backgroundColor = 'var(--green)'
                    totalSeconds = workMinutes * 60
                    updateTimer()
                }
            }
        }, 1000)
    }

    function pauseTimer() {
        clearInterval(timerInterval)
        timerInterval = null;
    }
    
    function resetTimer() {
        isWorkSession = true;
        totalSeconds = workMinutes * 60
        clearInterval(timerInterval)
        timerInterval = null;
        session.innerHTML = 'Work Session'
        session.style.backgroundColor = 'var(--green)'
        updateTimer()
    }
    
    startBtn.addEventListener('click', startTimer)
    pauseBtn.addEventListener('click', pauseTimer)
    resetBtn.addEventListener('click', function () {
        workMinutes = 25;
        resetTimer();
    })

}

pomodoroTimer()



function weatherFunctionality() {

    var header1Time = document.querySelector('.header1 h1')
    var header1Date = document.querySelector('.header1 h2')
    var header1Greeting = document.querySelector('.header1 .greeting')
    var header1Location = document.querySelector('.header1 .location')
    
    var header2Temp = document.querySelector('.header2 h2')
    var header2Condition = document.querySelector('.header2 h4')
    var precipitation = document.querySelector('.header2 .precipitation')
    var humidity = document.querySelector('.header2 .humidity')
    var wind = document.querySelector('.header2 .wind')

    async function weatherAPICall(lat, lon) {
        try {
            var response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m`);
            var weatherData = await response.json();
            
            var wco = weatherData.current.weather_code;
            var condition = wco <= 3 ? "Clear/Cloudy" : (wco <= 69 ? "Rain/Drizzle" : "Snow/Thunder");

            header2Temp.innerHTML = `${weatherData.current.temperature_2m}°C`;
            header2Condition.innerHTML = condition;
            wind.innerHTML = `Wind: ${weatherData.current.wind_speed_10m} km/h`;
            humidity.innerHTML = `Humidity: ${weatherData.current.relative_humidity_2m}%`;
            precipitation.innerHTML = `Precipitation: ${weatherData.current.precipitation}mm`;
            
            var locResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            var locData = await locResponse.json();
            var city = locData.address.city || locData.address.town || locData.address.state || "Your Location";
            if (header1Location) header1Location.innerHTML = city;

        } catch (error) {
            console.log("Weather fetch error: ", error)
            if (header1Location) header1Location.innerHTML = "Location Unknown";
        }
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                weatherAPICall(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                console.log("Permission denied for geolocation, falling back to Bhopal coordinates");
                weatherAPICall(23.2599, 77.4126); 
            }
        );
    } else {
         weatherAPICall(23.2599, 77.4126); 
    }

    function timeDate() {
        const totalDaysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        var date = new Date()
        var dayOfWeek = totalDaysOfWeek[date.getDay()]
        var hours = date.getHours()
        var minutes = date.getMinutes()
        var seconds = date.getSeconds()
        var tarik = date.getDate()
        var month = monthNames[date.getMonth()]
        var year = date.getFullYear()

        header1Date.innerHTML = `${tarik} ${month}, ${year}`
        
        let greeting = "Good Morning, User!";
        if (hours >= 12 && hours < 17) {
            greeting = "Good Afternoon, User!";
        } else if (hours >= 17) {
            greeting = "Good Evening, User!";
        }
        if(header1Greeting) header1Greeting.innerHTML = greeting;

        let displayHours = hours % 12 || 12;
        let ampm = hours >= 12 ? 'PM' : 'AM';
        
        header1Time.innerHTML = `${dayOfWeek}, ${String(displayHours).padStart('2', '0')}:${String(minutes).padStart('2', '0')}:${String(seconds).padStart('2', '0')} ${ampm}`
    }

    setInterval(() => {
        timeDate()
    }, 1000);

}

weatherFunctionality()


function changeTheme() {

    var theme = document.querySelector('.theme')
    var rootElement = document.documentElement

    var flag = 0
    theme.addEventListener('click', function () {

        if (flag == 0) {
            rootElement.style.setProperty('--pri', '#F8F4E1')
            rootElement.style.setProperty('--sec', '#222831')
            rootElement.style.setProperty('--tri1', '#948979')
            rootElement.style.setProperty('--tri2', '#393E46')
            flag = 1
        } else if (flag == 1) {
            rootElement.style.setProperty('--pri', '#F1EFEC')
            rootElement.style.setProperty('--sec', '#030303')
            rootElement.style.setProperty('--tri1', '#D4C9BE')
            rootElement.style.setProperty('--tri2', '#123458')
            flag = 2
        } else if (flag == 2) {
            rootElement.style.setProperty('--pri', '#F8F4E1')
            rootElement.style.setProperty('--sec', '#381c0a')
            rootElement.style.setProperty('--tri1', '#FEBA17')
            rootElement.style.setProperty('--tri2', '#74512D')
            flag = 0
        }
    })


}

changeTheme()

function dailyGoals() {
    var goalsList = document.querySelector('.goals-list');
    var goalsForm = document.querySelector('.goals-form');
    var goalInput = document.querySelector('#goal-input');

    var currentGoals = JSON.parse(localStorage.getItem('currentGoals')) || [];

    function renderGoals() {
        var sum = '';
        currentGoals.forEach(function(goal, idx) {
            var completedClass = goal.completed ? 'task-completed' : '';
            sum += `<div class="task ${completedClass}">
                <h5 class="${completedClass}">Goal ${idx + 1}: ${goal.text}</h5>
                <div style="display:flex; gap:10px;">
                   <button id="goal-toggle-${idx}" style="background-color: var(--green); color: var(--pri); padding: 10px 20px; font-size: 16px; border-radius: 5px; border: none; font-weight: bold; cursor:pointer;" onclick="toggleGoal(${idx})">${goal.completed ? 'Undo' : 'Done'}</button>
                   <button id="goal-del-${idx}" style="background-color: var(--red); color: var(--pri); padding: 10px 20px; font-size: 16px; border-radius: 5px; border: none; font-weight: bold; cursor:pointer;" onclick="deleteGoal(${idx})">Delete</button>
                </div>
            </div>`;
        });
        
        if (goalsList) goalsList.innerHTML = sum;
        localStorage.setItem('currentGoals', JSON.stringify(currentGoals));

        if (goalInput) {
            if (currentGoals.length >= 3) {
                goalInput.placeholder = "Great! Focus on these 3 goals today.";
                goalInput.disabled = true;
                if(document.querySelector('.goals-form button')) document.querySelector('.goals-form button').disabled = true;
            } else {
                goalInput.placeholder = "Enter a major priority for today...";
                goalInput.disabled = false;
                if(document.querySelector('.goals-form button')) document.querySelector('.goals-form button').disabled = false;
            }
        }
    }

    window.toggleGoal = function(idx) {
        currentGoals[idx].completed = !currentGoals[idx].completed;
        renderGoals();
    }

    window.deleteGoal = function(idx) {
        currentGoals.splice(idx, 1);
        renderGoals();
    }

    if(goalsForm) {
        goalsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (goalInput.value.trim() !== '' && currentGoals.length < 3) {
                currentGoals.push({
                    text: goalInput.value.trim(),
                    completed: false
                });
                goalInput.value = '';
                renderGoals();
            }
        });
    }

    renderGoals();
}

dailyGoals();