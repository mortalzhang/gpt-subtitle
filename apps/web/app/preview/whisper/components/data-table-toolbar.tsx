"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { priorities, statuses } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Task } from "../data/schema";
import { ModelType } from "../data/types";
import { createJobs, outPutSrt, outPutSrtStop } from "../api/osrt";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  rowSelection: Record<string, boolean>;
  model?: ModelType;
}

export function DataTableToolbar<TData extends Task>({
  table,
  rowSelection,
  model,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getPreFilteredRowModel().rows.length >
    table.getFilteredRowModel().rows.length;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
        {Object.keys(rowSelection).length ? (
          <Button
            onClick={() => {
              const jobs = table.getSelectedRowModel().flatRows.map((row) => {
                return {
                  file: row.original.id,
                  language: row.original.language,
                  model: model ?? "",
                  priority: row.original.priority,
                };
              });
              console.debug(jobs);
              createJobs(jobs);
            }}
            className="h-8 px-2 lg:px-3"
          >
            Translate Selected
          </Button>
        ) : null}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
