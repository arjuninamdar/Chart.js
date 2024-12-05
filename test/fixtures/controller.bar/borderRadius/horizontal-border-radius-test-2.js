module.exports = {
    threshold: 0.01,
    config: {
        type: 'bar',
        data: {
            labels: ['A', 'B', 'C'], // Small data points
            datasets: [
                {
                    data: [5, 10, 15], // All positive values
                    borderWidth: 1,
                    borderRadius: {topLeft: 0, topRight: 10, bottomLeft: 10, bottomRight: 10}
                }
            ]
        },
        options: {
            indexAxis: 'y', // Horizontal bar
            elements: {
                bar: {
                    backgroundColor: '#BBBBBB80',
                    borderColor: '#70707080',
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

