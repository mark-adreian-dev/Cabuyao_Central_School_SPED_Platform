import { SectionContext } from "@/context/Sections/SectionContext";
import { useContext } from "react";
import SectionTab from "./SectionTab";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SectionDataResponse } from "@/types/Response/SectionResponse";
import { PlusCircle, SearchIcon, Trash } from "lucide-react";
import { AddSectionForm } from "./AddSectionForm";

// eslint-disable-next-line react-refresh/only-export-components
export const columns: ColumnDef<SectionDataResponse>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "sectionList",
    cell: ({ row }) => {
      const sectionId = row.original.id;
      const createdAt = row.original.created_at;
      const isActive = row.original.isActive;
      const students = row.original.students;
      const sectionName = row.original.section_name;

      const faculty = row.original.faculty;
      const user = faculty.user;
      const facultyName = `${user.first_name} ${user.last_name}`;

      return (
        <SectionTab
          sectionName={sectionName}
          description={`Faculty: ${facultyName}`}
          sectionId={sectionId}
          dateCreated={new Date(createdAt)}
          isActive={Boolean(isActive)}
          studentCount={students.length}
        />
      );
    },
    filterFn: (row, _, filterValue) => {
      const sectionName = row.original.section_name.toLowerCase();
      const filter = String(filterValue).toLowerCase();
      return (
        sectionName.includes(filter) ||
        row.original.id.toString().includes(filter)
      );
    },
    enableColumnFilter: true,
  },
];

const SectionList = () => {
  const { sections, deleteSection } = useContext(SectionContext);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable<SectionDataResponse>({
    data: sections,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleDeleteSelection = () => {
    const selectedData: SectionDataResponse[] = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    const removeSection = async (sectionId: number) => {
      deleteSection(sectionId);
    }
    selectedData.map(section => {
      removeSection(section.id)
    })      
  }

  return (
    <>
      <div className="w-full px-6">
        <h1 className="text-6xl font-bold">Sections</h1>
        <div className="flex flex-col justify-between lg:flex-row lg:items-center py-4 space-x-4">
          <div className="w-full mb-3  flex items-center p-1 border-[1px] border-ring-ring/50 rounded-md lg:w-md lg:mb-0">
            <SearchIcon className="text-muted-foreground" />
            <Input
              placeholder="Find Sections"
              value={
                (table.getColumn("sectionList")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("sectionList")
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-md border-0 "
            />
          </div>
          <div className="flex">
            <AddSectionForm>
              <Button
                variant="default"
                className="mr-2"
                onClick={handleDeleteSelection}
              >
                <PlusCircle />
                New Section
              </Button>
            </AddSectionForm>

            <Button
              variant="default"
              className="bg-red-500"
              onClick={handleDeleteSelection}
              disabled={!(Object.entries(rowSelection).length !== 0)}
            >
              <Trash />
              Delete
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionList;
