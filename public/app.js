        // Initialize Lottie animation
        var animation = lottie.loadAnimation({
            container: document.getElementById('lottieAnimation'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://782771295fc926251f8dc891d8142c83.cdn.bubble.io/f1730137470558x190109093103175700/no%20data%20loader.json'
        });

        // set chart data

        var chartData = {

            title: {
              text: 'U.S Solar Employment Growth',
              align: 'left'
            },
          
            subtitle: {
              text: 'By Job Category. Source: <a href="https://irecusa.org/programs/solar-jobs-census/" target="_blank">IREC</a>.',
              align: 'left'
            },
          
            yAxis: {
              title: {
                text: 'Number of Employees'
              }
            },
          
            xAxis: {
              accessibility: {
                rangeDescription: 'Range: 2010 to 2022'
              }
            },
          
            legend: {
              layout: 'vertical',
              align: 'right',
              verticalAlign: 'middle'
            },
          
            plotOptions: {
              series: {
                label: {
                  connectorAllowed: false
                },
                pointStart: 2010
              }
            },
          
            series: [{
              name: 'Installation & Developers',
              data: [
                43934, 48656, 65165, 81827, 112143, 142383,
                171533, 165174, 155157, 161454, 154610, 168960, 171558
              ]
            }, {
              name: 'Manufacturing',
              data: [
                24916, 37941, 29742, 29851, 32490, 30282,
                38121, 36885, 33726, 34243, 31050, 33099, 33473
              ]
            }, {
              name: 'Sales & Distribution',
              data: [
                11744, 30000, 16005, 19771, 20185, 24377,
                32147, 30912, 29243, 29213, 25663, 28978, 30618
              ]
            }, {
              name: 'Operations & Maintenance',
              data: [
                null, null, null, null, null, null, null,
                null, 11164, 11218, 10077, 12530, 16585
              ]
            }, {
              name: 'Other',
              data: [
                21908, 5548, 8105, 11248, 8989, 11816, 18274,
                17300, 13053, 11906, 10073, 11471, 11648
              ]
            }],
          
            responsive: {
              rules: [{
                condition: {
                  maxWidth: 500
                },
                chartOptions: {
                  legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                  }
                }
              }]
            }
          
          };

        // Initialize default chart (hidden by default)
        document.addEventListener('DOMContentLoaded', function() {
            // Clear local storage variable 'file_path' if it exists
            if (localStorage.getItem('file_path')) {
                localStorage.removeItem('file_path');
            }

            Highcharts.chart('chartContainer', chartData);
        });



        //function to send message to chat
        function sendMessage() {
            const userInput = document.getElementById('userInput');
            const message = userInput.value.trim();
            if (message) {
                // Retrieve filePath from localStorage
                const filePath = localStorage.getItem('file_path');

                // Check if filePath is empty
                if (!filePath) {
                    alert("Please upload a file to get started");
                    return; // Exit the function early
                }

               

                // Call sendMessageToAI with message and filePath
                sendMessageToAI(message, filePath).then(data => {
                   
                    // Handle the chartData if needed
                    chartData = data; // Update the global chartData variable
                    Highcharts.chart('chartContainer', chartData); // Reinitialize the Highcharts container
                    document.getElementById('dummyDataWarning').classList.add('hide');

                     
                }).catch(error => {
                    console.error('Error sending message to AI:', error);
                });

                userInput.value = '';
            }
        }

        