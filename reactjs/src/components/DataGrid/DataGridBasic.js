import { DataGrid } from '@mui/x-data-grid';

export default function DataGridBasic(columns, rows) {
  return <DataGrid columns={columns} rows={rows} checkboxSelection disableSelectionOnClick />;
}
