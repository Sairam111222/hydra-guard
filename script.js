// Sample data
let reminders = [
    {
        id: 1,
        title: "Drink Water",
        time: "2025-03-08T09:00",
        priority: "high",
        notes: "Remember to have at least 200ml of water",
        completed: false
    },
    {
        id: 2,
        title: "Medication Time",
        time: "2025-03-08T12:30",
        priority: "high",
        notes: "Take blood pressure medication with food",
        completed: false
    },
    {
        id: 3,
        title: "Restroom Break",
        time: "2025-03-08T14:00",
        priority: "medium",
        notes: "Scheduled restroom break",
        completed: false
    }
];

// DOM elements
const reminderList = document.getElementById('reminder-list');
const addReminderBtn = document.getElementById('add-reminder-btn');
const reminderTitle = document.getElementById('reminder-title');
const reminderTime = document.getElementById('reminder-time');
const reminderPriority = document.getElementById('reminder-priority');
const reminderNotes = document.getElementById('reminder-notes');
const toast = document.getElementById('toast');
const reminderModal = document.getElementById('reminder-modal');
const closeModal = document.getElementById('close-modal');
const saveEditBtn = document.getElementById('save-edit-btn');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendChatBtn = document.getElementById('send-chat-btn');
const todayReminders = document.getElementById('today-reminders');
const addWaterBtn = document.getElementById('add-water-btn');
const resetWaterBtn = document.getElementById('reset-water-btn');
const waterProgressBar = document.getElementById('water-progress-bar');

// Water tracker variables
let currentWater = 1200;
const targetWater = 2000;

// Display reminders
function displayReminders() {
    reminderList.innerHTML = '';
    
    if (reminders.length === 0) {
        reminderList.innerHTML = '<p>No reminders yet. Add one above!</p>';
        return;
    }
    
    // Sort reminders by time
    reminders.sort((a, b) => new Date(a.time) - new Date(b.time));
    
    reminders.forEach(reminder => {
        const li = document.createElement('li');
        li.className = reminder-item ${reminder.priority} ${reminder.completed ? 'completed' : ''};
        li.dataset.id = reminder.id;
        
        const date = new Date(reminder.time);
        const formattedTime = date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        li.innerHTML = `
            <div class="reminder-info">
                <div class="reminder-title">${reminder.title}</div>
                <div class="reminder-time">⏰ ${formattedTime}</div>
                <div class="reminder-priority">🔔 ${reminder.priority.charAt(0).toUpperCase() + reminder.priority.slice(1)} Priority</div>
            </div>
            <div class="reminder-actions">
                <button class="complete-btn" data-id="${reminder.id}">✓</button>
                <button class="edit-btn" data-id="${reminder.id}">✎</button>
                <button class="delete-btn" data-id="${reminder.id}">✕</button>
            </div>
        `;
        
        reminderList.appendChild(li);
    });
    
    updateTodayReminders();
}

// Update today's reminders
function updateTodayReminders() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todaysReminders = reminders.filter(reminder => {
        const reminderDate = new Date(reminder.time);
        return reminderDate >= today && reminderDate < tomorrow;
    });
    
    if (todaysReminders.length === 0) {
        todayReminders.innerHTML = '<p>No reminders for today.</p>';
        return;
    }
    
    todayReminders.innerHTML = '';
    todaysReminders.forEach(reminder => {
        const div = document.createElement('div');
        div.className = 'reminder-item';
        
        const time = new Date(reminder.time).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        div.innerHTML = `
            <div class="reminder-title">${reminder.title}</div>
            <div class="reminder-time">⏰ ${time}</div>
        `;
        
        todayReminders.appendChild(div);
    });
}

// Add a new reminder
function addReminder() {
    const title = reminderTitle.value.trim();
    const time = reminderTime.value;
    const priority = reminderPriority.value;
    const notes = reminderNotes.value.trim();
    
    if (!title || !time) {
        showToast('Please fill in all required fields');
        return;
    }
    
    const newReminder = {
        id: reminders.length > 0 ? Math.max(...reminders.map(r => r.id)) + 1 : 1,
        title,
        time,
        priority,
        notes,
        completed: false
    };
    
    reminders.push(newReminder);
    
    reminderTitle.value = '';
    reminderTime.value = '';
    reminderPriority.value = 'low';
    reminderNotes.value = '';
    
    displayReminders();
    showToast('Reminder added successfully!');
    
    // Schedule notification
    scheduleNotification(newReminder);
}

// Schedule a notification
function scheduleNotification(reminder) {
    const now = new Date();
    const reminderTime = new Date(reminder.time);
    
    if (reminderTime > now) {
        const timeToReminder = reminderTime - now;
        
        setTimeout(() => {
            if (Notification.permission === 'granted') {
                new Notification(reminder.title, {
                    body: reminder.notes || 'It\'s time for your reminder!',
                    icon: 'https://cdn-icons-png.flaticon.com/512/3059/3059518.png'
                });
            }
            
            showToast(Reminder: ${reminder.title});
        }, timeToReminder);
    }
}

// Delete a reminder
function deleteReminder(id) {
    reminders = reminders.filter(reminder => reminder.id !== id);
    displayReminders();
    showToast('Reminder deleted');
}

// Complete a reminder
function completeReminder(id) {
    const reminder = reminders.find(reminder => reminder.id === id);
    if (reminder) {
        reminder.completed = !reminder.completed;
        displayReminders();
        showToast(reminder.completed ? 'Reminder completed' : 'Reminder reopened');
    }
}

// Edit a reminder
let currentEditId = null;

function openEditModal(id) {
    currentEditId = id;
    const reminder = reminders.find(reminder => reminder.id === id);
    
    if (reminder) {
        document.getElementById('edit-title').value = reminder.title;
        document.getElementById('edit-time').value = reminder.time;
        document.getElementById('edit-priority').value = reminder.priority;
        document.getElementById('edit-notes').value = reminder.notes;
        
        reminderModal.style.display = 'flex';
    }
}

function saveEditedReminder() {
    const title = document.getElementById('edit-title').value.trim();
    const time = document.getElementById('edit-time').value;
    const priority = document.getElementById('edit-priority').value;
    const notes = document.getElementById('edit-notes').value.trim();
    
    if (!title || !time) {
        showToast('Please fill in all required fields');
        return;
    }
    
    const reminder = reminders.find(reminder => reminder.id === currentEditId);
    if (reminder) {
        reminder.title = title;
        reminder.time = time;
        reminder.priority = priority;
        reminder.notes = notes;
        
        displayReminders();
        reminderModal.style.display = 'none';
        showToast('Reminder updated successfully!');
    }
}

// Show toast message
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Handle water tracker
function updateWaterProgress() {
    const progress = (currentWater / targetWater) * 100;
    waterProgressBar.style.width = ${progress}%;
}

addWaterBtn.addEventListener('click', () => {
    currentWater += 200;
    if (currentWater > targetWater) currentWater = targetWater;
    updateWaterProgress();
});

resetWaterBtn.addEventListener('click', () => {
    currentWater = 0;
    updateWaterProgress();
});

// Event listeners
addReminderBtn.addEventListener('click', addReminder);

reminderList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = parseInt(e.target.dataset.id);
        deleteReminder(id);
    } else if (e.target.classList.contains('complete-btn')) {
        const id = parseInt(e.target.dataset.id);
        completeReminder(id);
    } else if (e.target.classList.contains('edit-btn')) {
        const id = parseInt(e.target.dataset.id);
        openEditModal(id);
    }
});

closeModal.addEventListener('click', () => {
    reminderModal.style.display = 'none';
});

saveEditBtn.addEventListener('click', saveEditedReminder);

// Initial display
displayReminders();
updateWaterProgress();