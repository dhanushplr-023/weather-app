const ctx = document.getElementById('tempChart');

new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Mon','Tue','Wed','Thu','Fri'],
        datasets: [{
            label: 'Temperature',
            data: [22,24,23,25,27]
        }]
    }
});