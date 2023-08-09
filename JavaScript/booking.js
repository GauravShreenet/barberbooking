function fetchTimeSlots(accessToken, serviceKey, staffKey) {
  const date = document.getElementById('date').value; // Get the selected date
  const time = document.getElementById('time').value; // Get the selected time

  console.log('accessToken:', accessToken);
  console.log('serviceKey:', serviceKey);
  console.log('staffKey:', staffKey);
  console.log('date:', date);
  console.log('time:', time);

  const timeSlotData = {
    staff_key: staffKey,
    service_key: serviceKey,
    selected_date: date,
    selected_time: time // Add the selected_time field
  };

  fetch('https://developer.setmore.com/api/v1/bookingapi/slots', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    },
    body: JSON.stringify(timeSlotData)
  })
  .then(response => response.json())
  .then(data => {
    console.log('API response:', data);

    const timeSelect = document.getElementById('time');

    // Clear previous time slots
    while (timeSelect.firstChild) {
      timeSelect.removeChild(timeSelect.firstChild);
    }

    if (data && data.response === true && data.slots) {
      const timeSlots = data.slots;
      console.log('timeSlots:', timeSlots);

      // Assuming data is an array of time strings ["05.00", "05.30", "06.00", ...]
      timeSlots.forEach(timeSlot => {
        const option = document.createElement('option');
        option.value = timeSlot;
        option.text = timeSlot;
        timeSelect.appendChild(option);
      });
    } else {
      console.error('Error fetching time slots:', data.msg);
    }
  })
  .catch(error => {
    console.error('Error fetching time slots:', error);
  });
}

function generateTimeOptions() {
  const timeSelect = document.getElementById('time');
  timeSelect.innerHTML = ''; // Clear previous options

  const openingHour = 9; // Opening hour (change this according to your opening hour)
  const closingHour = 17; // Closing hour (change this according to your closing hour)

  for (let hour = openingHour; hour < closingHour; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const option = document.createElement('option');
      option.value = formattedTime;
      option.text = formattedTime;
      timeSelect.appendChild(option);
    }
  }
}

// Call generateTimeOptions to populate the time options when the page loads
generateTimeOptions();

function getDefaultDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

document.addEventListener('DOMContentLoaded', () => {
      generateTimeOptions();

      const refresh_token = 'r1/2a03d293ac08LP_tYF9BP7D_1wkDU4Ptfr8Q3egOSaaBK'; // Replace with your refresh token
      const defaultDate = getDefaultDate();
      document.getElementById('date').value = defaultDate;

      // Fetch access token using the refresh token
      fetch('https://developer.setmore.com/api/v1/o/oauth2/token?refreshToken=' + refresh_token, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        const accessToken = data.data.token.access_token;
        console.log('Access token:', accessToken);

        // Fetch staff members from the Setmore API
        fetch('https://developer.setmore.com/api/v1/bookingapi/staffs', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          }
        })
        .then(response => response.json())
        .then(data => {
          const staffSelect = document.getElementById('staff');

          data.data.staffs.forEach(staff => {
            const option = document.createElement('option');
            option.value = staff.key;
            option.text = staff.first_name + ' ' + staff.last_name;
            staffSelect.appendChild(option);
          });

          // After fetching staff members, set the staffKey variable to the value of the first staff member (or any other logic to set the desired staffKey)
          const staffKey = data.data.staffs[0].key;
          console.log('staffKey:', staffKey);

          // Fetch services using the access token
          fetch('https://developer.setmore.com/api/v1/bookingapi/services', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + accessToken
            }
          })
          .then(response => response.json())
          .then(data => {
            const serviceSelect = document.getElementById('service');
        
            data.data.services.forEach(service => {
              const option = document.createElement('option');
              option.value = service.key;
              option.text = service.service_name;
              serviceSelect.appendChild(option);
            });

            // After fetching services, set the serviceKey variable to the value of the first service (or any other logic to set the desired serviceKey)
            const serviceKey = data.data.services[0].key;
            console.log('serviceKey:', serviceKey);
        
            // Fetch time slots after setting staffKey and serviceKey
            fetchTimeSlots(accessToken, serviceKey, staffKey, defaultDate);
          })
          .catch(error => {
            console.error('Error fetching services:', error);
          });
        })
        .catch(error => {
          console.error('Error fetching staff members:', error);
        });
      })
      .catch(error => {
        console.error('Error obtaining access token:', error);
      });
      
      // Add an event listener on the date input element
      const dateInput = document.getElementById('date');
      dateInput.addEventListener('change', () => {
        // Fetch time slots when a date is selected
        const selectedDate = document.getElementById('date').value;
        fetchTimeSlots(accessToken, serviceKey, staffKey, selectedDate);
      });
    });