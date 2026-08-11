import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

type SeriesType =
    | {
          name: string;
          data: number[];
      }[]
    | number[];

interface DashboardChartProps {
    type?:
        | 'line'
        | 'area'
        | 'bar'
        | 'donut'
        | 'radialBar'
        | 'pie';

    height?: string;

    categories?: string[];

    series: SeriesType;

    colors?: string[];

    showToolbar?: boolean;
}

export default function DashboardChart({
    type = 'area',
    height = "350",
    categories = [],
    series,
    colors = ['#3B82F6', '#10B981'],
    showToolbar = false,
}: DashboardChartProps) {
    const isCircleChart =
        type === 'donut' ||
        type === 'pie' ||
        type === 'radialBar';

    const options: ApexOptions = {
        chart: {
            type,
            height,
            stacked: false,
            background: 'transparent',

            toolbar: {
                show: showToolbar,
            },

            zoom: {
                enabled: false,
            },

            fontFamily: 'inherit',
        },

        colors,

        dataLabels: {
            enabled: false,
        },

        stroke: {
            width:
                type === 'bar' ||
                type === 'donut' ||
                type === 'pie' ||
                type === 'radialBar'
                    ? 0
                    : 3,

            curve:
                type === 'line' || type === 'area'
                    ? 'smooth'
                    : 'straight',
        },

        grid: {
            show: !isCircleChart,
            borderColor: '#f1f5f9',
            strokeDashArray: 4,
        },

        xaxis: isCircleChart
            ? undefined
            : {
                  categories,

                  axisBorder: {
                      show: false,
                  },

                  axisTicks: {
                      show: false,
                  },

                  labels: {
                      style: {
                          colors: '#94a3b8',
                          fontSize: '12px',
                      },
                  },
              },

        yaxis: isCircleChart
            ? undefined
            : {
                  labels: {
                      style: {
                          colors: '#94a3b8',
                          fontSize: '12px',
                      },
                  },
              },

        legend: {
            show: isCircleChart,
            position: 'bottom',
            fontSize: '14px',
        },

        tooltip: {
            theme: 'light',
        },

        fill:
            type === 'area'
                ? {
                      type: 'gradient',

                      gradient: {
                          shadeIntensity: 1,
                          opacityFrom: 0.45,
                          opacityTo: 0.05,
                          stops: [0, 90, 100],
                      },
                  }
                : {
                      opacity: 1,
                  },

        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 6,
                columnWidth: '45%',
            },

            pie: {
                donut: {
                    size: '70%',
                },
            },

            radialBar: {
                hollow: {
                    size: '65%',
                },
            },
        },

        responsive: [
            {
                breakpoint: 768,

                options: {
                    chart: {
                        height: 280,
                    },
                },
            },
        ],
    };

    return (
        <Chart
            options={options}
            series={series as any}
            type={type}
            height={height}
        />
    );
}