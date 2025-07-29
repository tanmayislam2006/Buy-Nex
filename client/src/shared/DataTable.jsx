import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

const DataTable = ({ columns, data }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  console.log(data);

  return (
    <div className="overflow-x-auto w-full border border-base-300 rounded-xl shadow-sm">
      <table className="min-w-full text-sm text-base-content">
        <thead className="bg-primary text-white rounded-t-xl">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-4 font-semibold tracking-wide text-left">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className="divide-y divide-base-200">
          {table.getRowModel().rows.map((row, rowIndex) => (
            <tr
              key={row.id}
              className={`transition-all duration-200 hover:bg-base-200 ${
                rowIndex % 2 === 0 ? "bg-base-100" : "bg-base-200/40"
              }`}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-4 align-middle text-sm">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
