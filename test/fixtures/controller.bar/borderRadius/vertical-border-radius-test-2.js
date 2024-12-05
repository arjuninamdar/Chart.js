module.exports = {
    threshold: 0.01,
    config: {
        type: 'bar',
        data: {
            labels: Array.from({length: 15}, (_, i) => `Label ${i}`), // Lots of data points
            datasets: [
                {
                    data: [10, -5, 20, -10, 30, -15, 40, -20, 50, -25], // Mixed positive/negative
                    borderWidth: 10,
                    borderRadius: {topLeft: 5, topRight: 5, bottomLeft: 5, bottomRight: 0}
                }
            ]
        },
        options: {
            elements: {
                bar: {
                    backgroundColor: '#DDDDDD80',
                    borderColor: '#50505080',
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

