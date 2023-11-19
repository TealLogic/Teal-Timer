// Set the date we're counting down to
//let countDownDate = new Date("December 31, 2023 23:59:59").getTime();

let countDownDate = 0;
document.getElementById("dateInput").addEventListener("change", function() {
    let input = this.value;
    countDownDate = new Date(input).getTime();
    
    // Update the countdown every 1 second
    let countdownInterval = setInterval(function() {

        // Get the current date and time
        let now = new Date().getTime();
    
        // Calculate the remaining time
        let distance = countDownDate - now;
    
        // Calculate weeks, days, hours, minutes, seconds, and milliseconds
        let weeks = Math.floor(distance / (1000 * 60 * 60 * 24 * 7));
        let days = Math.floor((distance % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        let milliseconds = ((distance % 1000) / 100).toFixed(1);
    
        // Display the countdown
        document.getElementById("weeks").innerHTML = weeks + " Weeks";
        document.getElementById("days").innerHTML = days + " Days";
        document.getElementById("hours").innerHTML = hours + " Hours";
        document.getElementById("minutes").innerHTML = minutes + " Minutes";
        document.getElementById("seconds").innerHTML = seconds + " Seconds";
        document.getElementById("milliseconds").innerHTML = milliseconds + " Milliseconds";
    
        // If the countdown is over, display a message
        if (distance < 0) {
        clearInterval(countdownInterval);
        document.getElementById("countdown").innerHTML = "EXPIRED";
        }
    }, 1); // Update every 1 millisecond
});