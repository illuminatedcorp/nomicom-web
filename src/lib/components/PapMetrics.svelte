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

	import { usePapService } from '@/models/usePapService';
	const { getCharacterPapMetrics } = usePapService();

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

	export let characterIds: number[];

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
		papMetrics = await getCharacterPapMetrics(characterIds);
		// corpTopContributors = await getCorporationTopPapMetrics(98718341);

		// we set the initial date range to the date of the first PAP entry to the current date
		if (papMetrics?.papsByDay?.length > 0) {
			const firstEntryDate = moment(papMetrics.papsByDay[papMetrics.papsByDay.length - 1].entryDate);
			selectedDateRange = {
				start: new CalendarDate(firstEntryDate.year(), firstEntryDate.month() + 1, firstEntryDate.date()),
				end: new CalendarDate(today.year(), today.month() + 1, today.date())
			};
		}

		ready = true;

		window.onresize = () => {
			barChart?.resize();
			papTypesPieChart?.resize();
			shipTypesPieChart?.resize();
		};
	});

	const setupBarChart = () => {
		if (!barChart) {
			barChart = echarts.init(document.getElementById('pap-bar-chart'), 'illuminated');
		}

		// first up we need to fill in missing date entries with 0s
		// earliest dates are at the end of the array
		let byDayFilteredFilled = [];
		const earliestDate = moment.utc(byDayFiltered[byDayFiltered.length - 1].entryDate).subtract(1, 'days');
		const today = moment.utc();

		let currentDate = earliestDate;
		while (currentDate.isSameOrBefore(today)) {
			const entry = byDayFiltered.find((entry) => {
				return moment.utc(entry.entryDate).isSame(currentDate);
			});

			if (entry) {
				byDayFilteredFilled.push(entry);
			} else {
				byDayFilteredFilled.push({
					// characterId: characterId.toString(),
					entryDate: currentDate.format('YYYY-MM-DD'),
					updatedAt: currentDate.toISOString(),
					total: 0,
					beehive: 0,
					corp: 0,
					cricket: 0,
					gsol: 0,
					incursionHq: 0,
					incursionVg: 0,
					locust: 0,
					peacetime: 0,
					scouts: 0,
					sigSquad: 0,
					sigSquadStrategic: 0,
					strategic: 0,
					survey: 0,
					assaultFrigate: 0,
					capsule: 0,
					combatBattlecruiser: 0,
					combatReconShip: 0,
					electronicAttackShip: 0,
					interdictor: 0,
					logisticsFrigate: 0,
					stealthBomber: 0
				});
			}

			currentDate = currentDate.add(1, 'days');
		}

		byDayFiltered.sort((a, b) => {
			return moment.utc(a.entryDate).isAfter(moment.utc(b.entryDate)) ? 1 : -1;
		});

		let barChartDataByType = {};
		byDayFilteredFilled.forEach((dayEntry) => {
			const { character_id, entryDate, updated_at, total, ...metrics } = dayEntry;

			Object.keys(metrics).forEach((metricType) => {
				if (papTypes.includes(metricType)) {
					if (!barChartDataByType[metricType]) {
						barChartDataByType[metricType] = [];
					}

					barChartDataByType[metricType].push(metrics[metricType]);
				}
			});
		});

		barChart.setOption({
			tooltip: {
				formatter: function (params) {
					const { character_id, entryDate, total, updated_at, ...metrics } = byDayFiltered.find((entry) => entry.entryDate === params.name);

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
				data: byDayFilteredFilled.map((metric) => metric.entryDate)
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
			papTypesPieChart = echarts.init(document.getElementById('pap-types-pie-chart'), 'illuminated');
		}

		const sumsByType = {};
		byDayFiltered.forEach((dayEntry) => {
			const { character_id, entryDate, updated_at, total, ...metrics } = dayEntry;

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
			shipTypesPieChart = echarts.init(document.getElementById('pap-ship-types-pie-chart'), 'illuminated');
		}

		const sumsByType = {};
		byDayFiltered.forEach((dayEntry) => {
			const { character_id, entryDate, updated_at, total, ...metrics } = dayEntry;

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

	const onDateRangeChange = (newDateRange) => {
		if (!papMetrics?.papsByDay) return;
		if (!newDateRange?.start || !newDateRange?.end) return;

		let start = moment(newDateRange?.start?.year + '-' + newDateRange?.start?.month + '-' + newDateRange?.start?.day, 'YYYY-MM-DD');
		let end = moment(newDateRange?.end?.year + '-' + newDateRange?.end?.month + '-' + newDateRange?.end?.day, 'YYYY-MM-DD');

		if (start && end) {
			byDayFiltered = papMetrics.papsByDay.filter((entry) => {
				return moment(entry.entryDate).isSameOrAfter(start) && moment(entry.entryDate).isSameOrBefore(end);
			});
		} else if (start) {
			byDayFiltered = papMetrics.papsByDay.filter((entry) => {
				return moment(entry.entryDate).isSameOrAfter(start);
			});
		} else {
			byDayFiltered = papMetrics.papsByDay;
		}

		// setupBarChart();
		setupPapTypesPieChart();
		setupShipTypesPieChart();
	};

	const getTotalPapsByType = () => {
		let totalPaps = 0;
		byDayFiltered.forEach((dayEntry) => {
			const { character_id, entryDate, updated_at, total, ...metrics } = dayEntry;

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
			const { character_id, entryDate, updated_at, total, ...metrics } = dayEntry;

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

	export const update = async () => {
		papMetrics = await getCharacterPapMetrics(characterIds);
		// corpTopContributors = await getCorporationTopPapMetrics(98718341);

		onDateRangeChange(selectedDateRange);
		totalPapsByShipType = getTotalPapsByShipType();
		totalPapsByType = getTotalPapsByType();

		barChart?.resize();
		papTypesPieChart?.resize();
		shipTypesPieChart?.resize();
	};
</script>

{#if ready}
	{#if papMetrics === null}
		<div class="flex flex-col items-center justify-center h-full">
			<div class="text-2xl">There was an issue getting the PAP data. Please try again later.</div>
		</div>
	{:else}
		<div class="flex flex-col w-full h-full">
			<div class="flex flex-col flex-grow gap-3 px-3 pt-3 background-gradient">
				<div class="text-2xl">Time Range Data</div>
				<div class="flex flex-col">
					<div class="flex justify-between items-center px-3">
						<div class="text-xl text-left">
							PAPs per day from {moment(selectedDateRange.start).format('MM/DD/YYYY')} to {moment(selectedDateRange.end).format(
								'MM/DD/YYYY'
							)}
						</div>
						<Popover.Root openFocus>
							<Popover.Trigger asChild let:builder>
								<Button variant="outline" builders={[builder]}>
									{#if selectedDateRange && selectedDateRange.start}
										{#if selectedDateRange.end}
											{moment(
												selectedDateRange.start.year + '-' + selectedDateRange.start.month + '-' + selectedDateRange.start.day,
												'YYYY-MM-DD'
											).format('MM/DD/YYYY')} - {moment(
												selectedDateRange.end.year + '-' + selectedDateRange.end.month + '-' + selectedDateRange.end.day,
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
					<!-- <div id="pap-bar-chart" class="w-full h-64"></div> -->
				</div>

				<div class="grid grid-cols-2 gap-5 justify-center flex-grow px-2 max-h-64 min-h-64">
					<div class="flex flex-col flex-grow relative">
						<div class="text-2xl">PAPs ship types</div>
						<div id="pap-ship-types-pie-chart" class="flex-grow"></div>
						<div class="flex absolute items-center justify-center text-3xl w-full h-full mt-4 pointer-events-none">
							{totalPapsByShipType}
						</div>
					</div>
					<div class="flex flex-col flex-grow relative">
						<div class="text-2xl">PAPs by type</div>
						<div id="pap-types-pie-chart" class="flex-grow"></div>
						<div class="flex absolute items-center justify-center text-3xl w-full h-full mt-4 pointer-events-none">
							{totalPapsByType}
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
{/if}
