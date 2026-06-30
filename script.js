// Main application entry point
// ==========================
// Temperature Chart
// ==========================

const chartCanvas = document.getElementById("temperatureChart");

if (chartCanvas) {

    new Chart(chartCanvas, {

        type: "line",

        data: {

            labels: [

                "6 AM",

                "9 AM",

                "12 PM",

                "3 PM",

                "6 PM",

                "9 PM"

            ],

            datasets: [

                {

                    label: "Temperature",

                    data: [

                        20,

                        24,

                        30,

                        33,

                        28,

                        24

                    ],

                    borderColor: "#6d5dfc",

                    backgroundColor: "rgba(109,93,252,.2)",

                    fill: true,

                    tension: .4

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,
            
            aspectRatio: 2,

            plugins: {

                legend: {

                    labels: {

                        color: "white"

                    }

                }

            },

            scales: {

                x: {

                    ticks: {

                        color: "white"

                    }

                },

                y: {

                    ticks: {

                        color: "white"

                    }

                }

            }

        }

    });

}