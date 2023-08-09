const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".menu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
})

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}))

//Function to show the login popup
document.getElementById("btnLogin-Pop").addEventListener("click", function() {
    document.getElementById("popup").style.display = "flex";
})

const popup = document.getElementById("popup");
// Close the popup when user clicks outside of it
popup.addEventListener("click", (event) => {
  if (event.target === popup) {
    popup.style.display = "none";
  }
});

function initMap() {
  var geocoder = new google.maps.Geocoder();
  var address = "Shop 1/701-705 Anzac Parade, Maroubra NSW 2035"; // Replace with the address you want to display

  geocoder.geocode({ address: address }, function (results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      var map = new google.maps.Map(document.getElementById('maps'), {
        center: results[0].geometry.location,
        zoom: 15
      });

      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

// Fetch services from the Setmore API
fetch('https://developer.setmore.com/api/v1/bookingapi/services', {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer {r1/2a03d293ac08LP_tYF9BP7D_1wkDU4Ptfr8Q3egOSaaBK}'
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
})
.catch(error => {
  console.error('Error fetching services:', error);
});

