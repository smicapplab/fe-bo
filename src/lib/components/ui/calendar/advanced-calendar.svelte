<script>
	import { Calendar as CalendarPrimitive } from 'bits-ui';
	import { DateFormatter, getLocalTimeZone, today } from '@internationalized/date';
	import * as Calendar from '$lib/components/ui/calendar/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { cn } from '$lib/utils.js';

	// Get today's date
	const currentDate = today(getLocalTimeZone());

	/**
	 * @type {undefined}
	 */
	export let value = undefined;
	export let maxValue = currentDate;
	export let minValue = currentDate.subtract({ years: 10 });

	const monthFmt = new DateFormatter('en-US', {
		month: 'long'
	});

	let placeholder = value ? value : maxValue;
	export let weekdayFormat = 'short';
	const monthOptions = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	].map((month, i) => ({ value: i + 1, label: month }));

	const length = maxValue.year - minValue.year + 1;
	function generateYearOptions() {
		return Array.from({ length }, (_, i) => ({
			label: String(maxValue.year - i),
			value: maxValue.year - i
		}));
	}

	const yearOptions = generateYearOptions();
	
	$: defaultYear = placeholder
		? {
				value: placeholder.year,
				label: String(placeholder.year)
			}
		: undefined;

	$: defaultMonth = placeholder
		? {
				value: placeholder.month,
				label: monthFmt.format(placeholder.toDate(getLocalTimeZone()))
			}
		: undefined;

	let className = undefined;
	export { className as class };
</script>

<CalendarPrimitive.Root
	bind:value
	bind:placeholder
	{weekdayFormat}
	class={cn('rounded-md border p-3', className)}
	{...$$restProps}
	on:keydown
	let:months
	let:weekdays
>
	<Calendar.Header>
		<Calendar.Heading class="flex items-center justify-between w-full gap-2">
			<Select.Root
				selected={defaultMonth}
				items={monthOptions}
				onSelectedChange={(v) => {
					if (!v || !placeholder) return;
					if (v.value === placeholder?.month) return;
					placeholder = placeholder.set({ month: v.value });
				}}
			>
				<Select.Trigger aria-label="Select month" class="w-[60%]">
					<Select.Value placeholder="Select month" />
				</Select.Trigger>
				<Select.Content class="max-h-[200px] overflow-y-auto">
					{#each monthOptions as { value, label }}
						<Select.Item {value} {label}>
							{label}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
			<Select.Root
				selected={defaultYear}
				items={yearOptions}
				onSelectedChange={(v) => {
					if (!v || !placeholder) return;
					if (v.value === placeholder?.year) return;
					placeholder = placeholder.set({ year: v.value });
				}}
			>
				<Select.Trigger aria-label="Select year" class="w-[40%]">
					<Select.Value placeholder="Select year" />
				</Select.Trigger>
				<Select.Content class="max-h-[200px] overflow-y-auto">
					{#each yearOptions as { value, label }}
						<Select.Item {value} {label}>
							{label}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</Calendar.Heading>
	</Calendar.Header>
	<Calendar.Months>
		{#each months as month}
			<Calendar.Grid>
				<Calendar.GridHead>
					<Calendar.GridRow class="flex">
						{#each weekdays as weekday}
							<Calendar.HeadCell>
								{weekday.slice(0, 2)}
							</Calendar.HeadCell>
						{/each}
					</Calendar.GridRow>
				</Calendar.GridHead>
				<Calendar.GridBody>
					{#each month.weeks as weekDates}
						<Calendar.GridRow class="w-full mt-2">
							{#each weekDates as date}
								<Calendar.Cell {date}>
									<Calendar.Day {date} month={month.value} />
								</Calendar.Cell>
							{/each}
						</Calendar.GridRow>
					{/each}
				</Calendar.GridBody>
			</Calendar.Grid>
		{/each}
	</Calendar.Months>
</CalendarPrimitive.Root>
