document.getElementById("reservationForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent actual form submission
  if (!validateDates()) return;

  const total = calculateTotalPrice();
  if (total <= 0) {
    alert('Please fill all fields correctly and select valid dates.');
    return;
  }

  alert(`Reservation successful!\n\n${summaryDiv.textContent}`);
  form.reset();
  summaryDiv.style.display = 'none';
});

const form = document.getElementById('reservationForm');
const roomType = document.getElementById('roomType');
const acPreference = document.getElementById('acPreference');
const roomsBooked = document.getElementById('roomsBooked');
const startDate = document.getElementById('startdate');
const endDate = document.getElementById('enddate');
const dateError = document.getElementById('dateError');
const summaryDiv = document.getElementById('summary');

const roomPrices = {
  single: 1000,
  double: 1800,
};

const acPrices = {
  nonac: 0,
  ac: 500,
};

function calculateTotalPrice() {
  const numRooms = parseInt(roomsBooked.value, 10) || 0;
  const room = roomType.value;
  const ac = acPreference.value;

  if (!room || !ac || numRooms <= 0) {
    return 0;
  }

  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  const timeDiff = end.getTime() - start.getTime();
  const nights = timeDiff > 0 ? Math.ceil(timeDiff / (1000 * 3600 * 24)) : 0;

  if (nights <= 0) return 0;

  const basePricePerNight = roomPrices[room] + acPrices[ac];
  const baseTotal = basePricePerNight * numRooms * nights;

  // Apply GST (12% for rooms below ₹7500/night)
  const gstRate = 0.12;
  const gstAmount = baseTotal * gstRate;
  const totalWithGST = baseTotal + gstAmount;

  return {
    baseTotal,
    gstAmount,
    totalWithGST,
    nights,
    basePricePerNight,
  };
}

function validateDates() {
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  if (start >= end) {
    dateError.textContent = "End date must be after start date.";
    return false;
  }
  dateError.textContent = "";
  return true;
}

function updateSummary() {
  if (!validateDates()) {
    summaryDiv.style.display = 'none';
    return;
  }

  const { baseTotal, gstAmount, totalWithGST, nights } = calculateTotalPrice();
  if (totalWithGST > 0) {
    summaryDiv.style.display = 'block';
    summaryDiv.innerHTML = `
      <strong>Booking Summary:</strong><br/>
      Rooms: ${roomsBooked.value}<br/>
      Type: ${roomType.options[roomType.selectedIndex].text}<br/>
      AC: ${acPreference.options[acPreference.selectedIndex].text}<br/>
      Nights: ${nights}<br/>
      Base Price: ₹${baseTotal.toLocaleString()}<br/>
      GST (12%): ₹${gstAmount.toLocaleString()}<br/>
      <strong>Total Price (incl. GST): ₹${totalWithGST.toLocaleString()}</strong>
    `;
  } else {
    summaryDiv.style.display = 'none';
  }
}

// Trigger summary update when inputs change
[roomType, acPreference, roomsBooked, startDate, endDate].forEach(el => {
  el.addEventListener('change', updateSummary);
  el.addEventListener('input', updateSummary);
});
// This function will be triggered when form is submitted
function speakThankYou() {
  const message = new SpeechSynthesisUtterance("Thank you for your reservation.");
  message.lang = "en-US";
  message.pitch = 1;
  message.rate = 1;
  window.speechSynthesis.speak(message);
}

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent actual form submission
  speakThankYou();

  // You can also show a confirmation message here
  alert("Thank you! Your reservation has been submitted.");
});
