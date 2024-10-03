<script lang="ts">
	import type { DateRange } from 'bits-ui';

	import moment from 'moment';
	import * as echarts from 'echarts';
	import { onMount } from 'svelte';

	import { Button } from '$lib/components/ui/button/index.js';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	import { CalendarDate, type DateValue } from '@internationalized/date';

	import echartsTheme from './echartsTheme.json';
	echarts.registerTheme('illuminated', echartsTheme);

	import { useBirdhouse } from '@/models/useBirdhouse';
	const { getCharacterPapMetrics } = useBirdhouse();

	const papTypes = [
		'beehive',
		'corp',
		'cricket',
		'gsol',
		'incursion_hq',
		'incursion_vg',
		'locust',
		'peacetime',
		'scouts',
		'sig_squad',
		'sig_squad_strategic',
		'strategic',
		'survey'
	];

	const shipTypes = [
		'assault_frigate',
		'capsule',
		'combat_battlecruiser',
		'combat_recon_ship',
		'electronic_attack_ship',
		'interdictor',
		'logistics_frigate',
		'stealth_bomber'
	];

	export let characterId: number;

	let papMetrics = {};
	let barChart;
	let papTypesPieChart;
	let shipTypesPieChart;
	let ready = false;
	let byDayFiltered = [];
	let totalPapsByType = 0;
	let totalPapsByShipType = 0;

	// these want a year, month, day
	const today = moment();
	const monthAgo = moment().subtract(1, 'month');
	let selectedDateRange: DateRange | undefined = {
		start: new CalendarDate(monthAgo.year(), monthAgo.month() + 1, monthAgo.date()),
		end: new CalendarDate(today.year(), today.month() + 1, today.date())
	};

	onMount(async () => {
		papMetrics = await getCharacterPapMetrics(characterId);
		ready = true;

		window.onresize = () => {
			barChart.resize();
			papTypesPieChart.resize();
			shipTypesPieChart.resize();
		};
	});

	const setupBarChart = () => {
		if (!barChart) {
			barChart = echarts.init(document.getElementById('pap-bar-chart'), 'illuminated');
		}

		let barChartDataByType = {};
		byDayFiltered.forEach((dayEntry) => {
			const { character_id, entry_date, updated_at, total, ...metrics } = dayEntry;

			Object.keys(metrics).forEach((metricType) => {
				if (papTypes.includes(metricType)) {
					if (!barChartDataByType[metricType]) {
						barChartDataByType[metricType] = [];
					}

					barChartDataByType[metricType].push(metrics[metricType]);
				}
			});
		});

		// then we get the totals for each type
		let totals = Object.keys(barChartDataByType).map((metricType) => {
			return barChartDataByType[metricType].reduce((acc, curr) => acc + curr, 0);
		});

		// then we want to filter out any types that have a total of 0
		barChartDataByType = Object.keys(barChartDataByType).reduce((acc, curr, index) => {
			if (totals[index] !== 0) {
				acc[curr] = barChartDataByType[curr];
			}

			return acc;
		}, {});

		barChart.setOption({
			tooltip: {
				formatter: function (params) {
					const { character_id, entry_date, total, updated_at, ...metrics } = byDayFiltered.find(
						(entry) => entry.entry_date === params.name
					);

					let returnText = `${params.name}<br/>`;

					Object.keys(metrics).forEach((metricType) => {
						if (papTypes.includes(metricType) && metrics[metricType] !== 0) {
							returnText += `${metricType.replace(/_/g, ' ')}: ${metrics[metricType]}<br/>`;
						}
					});

					return returnText;
				}
			},
			xAxis: {
				data: byDayFiltered.map((metric) => metric.entry_date)
			},
			yAxis: {},
			series: Object.keys(barChartDataByType).map((metricType) => ({
				name: metricType.replace(/_/g, ' '),
				type: 'bar',
				data: barChartDataByType[metricType],
				stack: 'x'
			})),
			grid: {
				left: 40,
				top: 10,
				right: 30,
				bottom: 20
			}
		});
	};

	const setupPapTypesPieChart = () => {
		if (!papTypesPieChart) {
			papTypesPieChart = echarts.init(
				document.getElementById('pap-types-pie-chart'),
				'illuminated'
			);
		}

		const sumsByType = {};
		byDayFiltered.forEach((dayEntry) => {
			const { character_id, entry_date, updated_at, total, ...metrics } = dayEntry;

			Object.keys(metrics).forEach((metricType) => {
				if (papTypes.includes(metricType)) {
					if (!sumsByType[metricType]) {
						sumsByType[metricType] = 0;
					}

					sumsByType[metricType] += metrics[metricType];
				}
			});
		});

		const papTypesData = Object.keys(sumsByType)
			.map((type) => ({
				name: type.replace(/_/g, ' '),
				value: sumsByType[type]
			}))
			.filter((type) => type.value !== 0);

		papTypesPieChart.setOption({
			tooltip: {
				trigger: 'item',
				formatter: '{a} <br/>{b}: {c} ({d}%)'
			},
			series: [
				{
					name: 'PAPs by Type',
					type: 'pie',
					radius: ['60%', '90%'],
					data: papTypesData,
					label: {
						show: false
					},
					grid: {
						left: 0,
						top: 0,
						right: 0,
						bottom: 0
					}
				}
			]
		});
	};

	const setupShipTypesPieChart = () => {
		if (!shipTypesPieChart) {
			shipTypesPieChart = echarts.init(
				document.getElementById('pap-ship-types-pie-chart'),
				'illuminated'
			);
		}

		const sumsByType = {};
		byDayFiltered.forEach((dayEntry) => {
			const { character_id, entry_date, updated_at, total, ...metrics } = dayEntry;

			Object.keys(metrics).forEach((metricType) => {
				if (shipTypes.includes(metricType)) {
					if (!sumsByType[metricType]) {
						sumsByType[metricType] = 0;
					}

					sumsByType[metricType] += metrics[metricType];
				}
			});
		});

		const shipTypesData = Object.keys(sumsByType)
			.map((type) => ({
				name: type.replace(/_/g, ' '),
				value: sumsByType[type]
			}))
			.filter((type) => type.value !== 0);

		shipTypesPieChart.setOption({
			tooltip: {
				trigger: 'item',
				formatter: '{a} <br/>{b}: {c} ({d}%)'
			},
			series: [
				{
					name: 'PAPs Ship Types',
					type: 'pie',
					radius: ['60%', '90%'],
					data: shipTypesData,
					label: {
						show: false
					},
					grid: {
						left: 0,
						top: 0,
						right: 0,
						bottom: 0
					}
				}
			]
		});
	};

	const getTotalStrategicForMonth = () => {
		// we want the current month formatted as mm/yyyy
		let currentMonth = moment().format('MM/YYYY');
		if (!papMetrics.monthlyTotals[currentMonth]) return 0;
		return papMetrics.monthlyTotals[currentMonth].totalStrategic;
	};

	const getTotalPeacetimeForMonth = () => {
		// we want the current month formatted as mm/yyyy
		let currentMonth = moment().format('MM/YYYY');
		if (!papMetrics.monthlyTotals[currentMonth]) return 0;
		return papMetrics.monthlyTotals[currentMonth].totalPeacetime;
	};

	const onDateRangeChange = (newDateRange) => {
		if (!papMetrics?.papsByDay) return;
		if (!newDateRange?.start || !newDateRange?.end) return;

		let start = moment(
			newDateRange?.start?.year + '-' + newDateRange?.start?.month + '-' + newDateRange?.start?.day,
			'YYYY-MM-DD'
		);
		let end = moment(
			newDateRange?.end?.year + '-' + newDateRange?.end?.month + '-' + newDateRange?.end?.day,
			'YYYY-MM-DD'
		);

		if (start && end) {
			byDayFiltered = papMetrics.papsByDay.filter((entry) => {
				return (
					moment(entry.entry_date).isSameOrAfter(start) &&
					moment(entry.entry_date).isSameOrBefore(end)
				);
			});
		} else if (start) {
			byDayFiltered = papMetrics.papsByDay.filter((entry) => {
				return moment(entry.entry_date).isSameOrAfter(start);
			});
		} else {
			byDayFiltered = papMetrics.papsByDay;
		}

		setupBarChart();
		setupPapTypesPieChart();
		setupShipTypesPieChart();
	};

	const getTotalPapsByType = () => {
		let totalPaps = 0;
		byDayFiltered.forEach((dayEntry) => {
			const { character_id, entry_date, updated_at, total, ...metrics } = dayEntry;

			Object.keys(metrics).forEach((metricType) => {
				if (papTypes.includes(metricType)) {
					totalPaps += metrics[metricType];
				}
			});
		});

		return totalPaps;
	};

	const getTotalPapsByShipType = () => {
		let totalPaps = 0;
		byDayFiltered.forEach((dayEntry) => {
			const { character_id, entry_date, updated_at, total, ...metrics } = dayEntry;

			Object.keys(metrics).forEach((metricType) => {
				if (shipTypes.includes(metricType)) {
					totalPaps += metrics[metricType];
				}
			});
		});

		return totalPaps;
	};

	$: {
		if (papMetrics && selectedDateRange) {
			setTimeout(() => {
				onDateRangeChange(selectedDateRange);
				totalPapsByShipType = getTotalPapsByShipType();
				totalPapsByType = getTotalPapsByType();
			}, 700);
		}
	}
</script>

{#if ready}
	<div class="flex flex-col gap-3 w-full h-full">
		<div class="flex flex-wrap gap-3 items-center justify-center border-b-2 border-black pb-3">
			<div
				class="flex items-center bg-slate-800 border-4 border-black lg:px-3 lg:py-2 max-lg:px-3 max-lg:py-2"
			>
				<div class="text-4xl mr-4 ml-1">{getTotalStrategicForMonth()}</div>
				<div class="lg:text-xl max-lg:text-lg text-left">Strategic PAPs<br />this month</div>
			</div>
			<div
				class="flex items-center bg-orange-900 border-4 border-black lg:px-3 lg:py-2 max-lg:px-3 max-lg:py-2"
			>
				<div class="text-4xl mr-4 ml-1">{getTotalPeacetimeForMonth()}</div>

				<div class="lg:text-xl max-lg:text-lg text-left">Peacetime PAPs<br />this month</div>
			</div>
		</div>

		<div class="flex flex-col px-3">
			<div class="flex justify-between items-center px-3">
				<div class="text-2xl">PAPs per day</div>
				<Popover.Root openFocus>
					<Popover.Trigger asChild let:builder>
						<Button variant="outline" builders={[builder]}>
							{#if selectedDateRange && selectedDateRange.start}
								{#if selectedDateRange.end}
									{moment(
										selectedDateRange.start.year +
											'-' +
											selectedDateRange.start.month +
											'-' +
											selectedDateRange.start.day,
										'YYYY-MM-DD'
									).format('MM/DD/YYYY')} - {moment(
										selectedDateRange.end.year +
											'-' +
											selectedDateRange.end.month +
											'-' +
											selectedDateRange.end.day,
										'YYYY-MM-DD'
									).format('MM/DD/YYYY')}
								{:else}
									{moment(selectedDateRange.start).format('MM/DD/YYYY')}
								{/if}
							{:else}
								Select a date range
							{/if}
						</Button>
					</Popover.Trigger>
					<Popover.Content class="bg-background-800 text-background-50 w-auto p-0" align="start">
						<RangeCalendar bind:value={selectedDateRange} initialFocus numberOfMonths={1} />
					</Popover.Content>
				</Popover.Root>
			</div>
			<div id="pap-bar-chart" class="w-full h-64"></div>
		</div>

		<div class="grid grid-cols-2 gap-5 justify-center flex-grow px-5 max-h-64 min-h-64">
			<div class="flex flex-col flex-grow relative">
				<div class="text-2xl">PAPs ship types</div>
				<div id="pap-ship-types-pie-chart" class="flex-grow"></div>
				<div
					class="flex absolute items-center justify-center text-3xl w-full h-full mt-4 pointer-events-none"
				>
					{totalPapsByShipType}
				</div>
			</div>
			<div class="flex flex-col flex-grow relative">
				<div class="text-2xl">PAPs by type</div>
				<div id="pap-types-pie-chart" class="flex-grow"></div>
				<div
					class="flex absolute items-center justify-center text-3xl w-full h-full mt-4 pointer-events-none"
				>
					{totalPapsByType}
				</div>
			</div>
		</div>
	</div>
{/if}
