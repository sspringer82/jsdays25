import { createFileRoute } from "@tanstack/react-router";
import {
  Column,
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Book } from "../../types/Book";
import { fetchBooks } from "../../api/books";
import { useState } from "react";

export const Route = createFileRoute("/ts-table/")({
  component: RouteComponent,
  loader: fetchBooks,
});

const columnHelper = createColumnHelper<Book>();

const columns = [
  columnHelper.accessor("id", {
    header: () => "ID",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("isbn", {
    header: () => "ISBN",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("title", {
    header: () => "Title",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("author", {
    header: () => "Author",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("publishedYear", {
    header: () => "Published Year",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("genre", {
    header: () => "Genre",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("pages", {
    header: () => "Pages",
    cell: (info) => info.renderValue(),
  }),
];

function RouteComponent() {
  const data = Route.useLoaderData();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // sort
    getSortedRowModel: getSortedRowModel(),
    // filter
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <>
                      <div
                        className={
                          header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : ""
                        }
                        onClick={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === "asc"
                              ? "Sort ascending"
                              : header.column.getNextSortingOrder() === "desc"
                                ? "Sort descending"
                                : "Clear sort"
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        &nbsp;
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                      <div>
                        <Filter column={header.column} />
                      </div>
                    </>
                  )}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();

  return (
    <input
      className="w-36 border shadow rounded"
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? "") as string}
    />
  );
}
