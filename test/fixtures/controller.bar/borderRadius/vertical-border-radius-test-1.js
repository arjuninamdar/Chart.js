module.exports = {
    threshold: 0.01,
    config: {
        type: 'bar',
        data: {
            labels: Array.from({length: 10}, (_, i) => i), // Lots of data points
            datasets: [
                {
                    data: [0, -5, 5, -10, 10, -15, 15, -20, 20, -25], // Negative and positive values
                    borderWidth: 0,
                    borderRadius: {topLeft: 100, topRight: 100, bottomLeft: 100, bottomRight: 0}
                }
            ]
        },
        options: {
            elements: {
                bar: {
                    backgroundColor: '#CCCCCC80',
                    borderColor: '#60606080',
                }
            },
            scales: {
                x: {display: false},
                y: {display: false}
            }
        }
    },
    options: {
        canvas: {
            height: 512,
            width: 256
        }
    }
};

