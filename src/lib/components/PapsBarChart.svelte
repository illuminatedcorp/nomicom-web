<script lang="ts">
	import * as echarts from 'echarts';
	import { onMount } from 'svelte';

	export let metrics;
	export let startDate;
	export let endDate;

	const papTypes = [
		'strategic',
		'beehive',
		'sigSquadStrategic',
		'locust',
		'incursionHq',
		'scouts',
		'corp',
		'cricket',
		'gsol',
		'incursionVg',
		'peacetime',
		'sigSquad',
		'survey'
	];

	const uuid = crypto.randomUUID();
	let barChart;
	let targetHeight = 0;

	$: {
		// if we have metrics
		if (metrics?.length) {
			targetHeight = metrics.length * 15 + 100;

			// we want to format the data for the bar chart

			setupBarChart();
		}
	}

	onMount(() => {});

	const setupBarChart = () => {
		// this is going to be a stacked bar chart by member showing all of the pap types

		if (!barChart) {
			barChart = echarts.init(document.getElementById('pap-bar-chart-' + uuid), 'illuminated');

			window.onresize = () => {
				update();
			};
		}

		let barChartDataByType = {};
		metrics.forEach((characterEntry) => {
			const { totals } = characterEntry;

			if (Object.keys(totals).length === 0) {
				// we want to add 0 values for each metric type
				papTypes.forEach((metricType) => {
					totals[metricType] = 0;
				});
			}

			Object.keys(totals).forEach((metricType) => {
				if (papTypes.includes(metricType)) {
					if (!barChartDataByType[metricType]) {
						barChartDataByType[metricType] = [];
					}

					barChartDataByType[metricType].push(totals[metricType]);
				}
			});
		});

		barChart.setOption({
			tooltip: {
				trigger: 'axis',
				axisPointer: { type: 'cross' },
				formatter: function (params) {
					const characterName = params[0].name;
					const { totals } = metrics.find((entry) => entry.name === characterName);

					let returnText = `${characterName}<br/>`;

					Object.keys(totals).forEach((metricType) => {
						if (papTypes.includes(metricType) && totals[metricType] !== 0) {
							returnText += `${metricType.replace(/_/g, ' ')}: ${totals[metricType]}<br/>`;
						}
					});

					return returnText;
				}
			},
			xAxis: {
				type: 'value'
			},
			yAxis: {
				data: metrics.map((metric) => metric.name)
			},
			series: [
				...Object.keys(barChartDataByType)
					// we want the sort order to match the order of the papTypes array
					.sort((a, b) => papTypes.indexOf(a) - papTypes.indexOf(b))
					.map((metricType) => ({
						name: metricType.replace(/_/g, ' '),
						type: 'bar',
						data: barChartDataByType[metricType],
						stack: 'y'
					})),
				{
					name: 'Minimum Line',
					type: 'line',
					data: metrics.map(() => 8),
					lineStyle: {
						color: 'green'
					}
				}
			],
			grid: {
				left: 150,
				top: 20,
				right: 30,
				bottom: 30
			}
		});
	};

	export const update = () => {
		if (barChart) {
			barChart.resize({
				height: targetHeight
			});
		}
	};
</script>

<div class="w-full">
	<div id="pap-bar-chart-{uuid}" class="w-full"></div>
</div>
