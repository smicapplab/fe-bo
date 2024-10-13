<script>
	import * as Table from '$lib/components/ui/table/index.js';
	import { getCompanyLabelByValue } from '$lib/data/company-type';
	import { getStatusLabelByValue } from '$lib/data/issuer-status';
	import { DateFormatter } from '@internationalized/date';
	import { createTable, Render, Subscribe } from 'svelte-headless-table';
	import { writable } from 'svelte/store';

	const df = new DateFormatter('en-US', {
		month: 'short', // Use short month format (e.g., "Oct")
		day: 'numeric', // Display the day as a numeric value
		year: 'numeric' // Display the year as a numeric value
	});

	export let data = [];
    
    // Create a writable store for table data
	const tableData = writable(data);

	const table = createTable(tableData, {
		// sort: addSortBy({ disableMultiSort: true }),
		// page: addPagination(),
		// filter: addTableFilter({
		// 	fn: ({ filterValue, value }) => value.includes(filterValue)
		// }),
		// select: addSelectedRows(),
		// hide: addHiddenColumns()
	});

	const columns = table.createColumns([
		table.column({
			accessor: 'companyName',
			header: 'Issuer Name',
			cell: ({ value }) => value ?? '-'
		}),
		table.column({
			accessor: 'companyType',
			header: 'Company Type',
			cell: ({ value }) => getCompanyLabelByValue(value)
		}),
		table.column({
			accessor: 'contact',
			header: 'Contact',
			cell: ({ value }) => {
				const contactName = `${value.firstName} ${value.lastName}`;
				return `${contactName} (${value.email})`;
			}
		}),
		table.column({
			accessor: 'status',
			header: 'Status',
			cell: ({ value }) => getStatusLabelByValue(value)
		}),
		table.column({
			accessor: 'createdAt',
			header: 'Registered On',
			cell: ({ value }) => {
				const formatted = df.format(new Date(value));
				return formatted;
			}
		})
	]);
	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);

    // Watch for changes in the `data` prop and update the table data store
	$: tableData.set(data); // Reactively update table data whenever `data` changes
</script>

<div class="w-full">
	<div class="flex items-center py-4">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
									<Table.Head {...attrs}>
										<Render of={cell.render()} />
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs}>
										<Render of={cell.render()} />
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>
