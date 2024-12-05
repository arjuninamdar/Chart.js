module.exports = {
    threshold: 0.01,
    config: {
        type: 'bar',
        data: {
            labels: Array.from({length: 20}, (_, i) => i), // Lots of data points
            datasets: [
                {
                    data: [0, 5, -5, 10, -10, 15, -15, 20, -20, 25, -25],
                    borderWidth: 10,
                    borderRadius: {topLeft: 0, topRight: 5, bottomLeft: 5, bottomRight: 5}
                }
            ]
        },
        options: {
            indexAxis: 'y', // Horizontal bar
            elements: {
                bar: {
                    backgroundColor: '#AAAAAA80',
                    borderColor: '#80808080',
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
            height: 256,
            width: 512
        }
    }
};

