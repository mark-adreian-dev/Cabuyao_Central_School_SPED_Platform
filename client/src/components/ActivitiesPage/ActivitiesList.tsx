import { useContext } from "react";
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

import { Checkbox } from "@/components/ui/checkbox";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ActivityTab from "./ActivityTab";
import { ActivityContext } from "@/context/Activities/ActivitiesContext";
import type { ActivityDataResponse } from "@/types/Response/ActivityResponse";
import { PlusCircle, SearchIcon, Trash } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AddActivitiesForm } from "./AddActivitiesForm";


// eslint-disable-next-line react-refresh/only-export-components
export const columns: ColumnDef<ActivityDataResponse>[] = [
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
    id: "activitiesList",
    cell: ({ row }) => {
      const activityId = row.original.id;
      const activityDescription = row.original.activity_description;
      const perfectScore = row.original.perfect_score;
      const passingScore = row.original.passing_score;
      const createdAt = row.original.created_at
      const fileCount = row.original.files.length
    
      return (
        <ActivityTab
          activityDescription={activityDescription}
          activityId={activityId}
          passingScore={passingScore}
          perfectScore={perfectScore}
          dateCreated={new Date(createdAt)}
          fileCount={fileCount}
        />
      );
    },
    filterFn: (row, _, filterValue) => {
      const activityDescription = row.original.activity_description.toLowerCase();
      const filter = String(filterValue).toLowerCase();
      return (
        activityDescription.includes(filter) ||
        row.original.id.toString().includes(filter)
      );
    },
    enableColumnFilter: true,
  },
];

const ActivitiesList = () => {
  const { activities, deleteActivity } = useContext(ActivityContext);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable<ActivityDataResponse>({
    data: activities,
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
    const selectedData: ActivityDataResponse[] = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    const removeActivity = async (activityId: number) => {
      deleteActivity(activityId);
    };
    selectedData.map((activity) => {
      removeActivity(activity.id);
    });
  };
  return (
    <div>
      <div className="w-full px-6">
        <h1 className="text-6xl font-bold">Activities</h1>
        <div className="flex flex-col justify-between lg:flex-row lg:items-center py-4 space-x-4">
          <div className="w-full mb-3 lg:w-md lg:mb-0 flex items-center p-1 border-[1px] border-ring-ring/50 rounded-md">
            <SearchIcon className="text-muted-foreground" />
            <Input
              placeholder="Find activity"
              value={
                (table
                  .getColumn("activitiesList")
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn("activitiesList")
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-md border-0 "
            />
          </div>
          <div className="flex">
            <AddActivitiesForm>
              <Button
                variant="default"
                className="mr-2"
                onClick={handleDeleteSelection}
              >
                <PlusCircle />
                New Activity
              </Button>
            </AddActivitiesForm>

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
    </div>
  );
};

export default ActivitiesList;
