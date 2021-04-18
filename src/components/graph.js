import Chart from "react-google-charts"


import React from "react";


export class graph extends React.Component {
    render() {
        return (
            <Chart
                width={'500px'}
                height={'300px'}
                chartType="Bar"
                loader={<div>Loading Chart</div>}
                data={[
                    ['Year', 'Sales'],
                    ['2014', 1000],
                    ['2015', 1170],
                    ['2016', 660],
                    ['2017', 1030],
                ]}
                options={{
                    // Material design options
                    chart: {
                        title: 'Company Performance',
                        subtitle: 'Sales, Expenses, and Profit: 2014-2017',
                    },
                }}
                // For tests
                rootProps={{ 'data-testid': '2' }}
            />
        )
    }
}

export default graph;
