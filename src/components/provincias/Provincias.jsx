"use client";
import React from "react";
import { cn } from "@/lib/utils";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ListadoProvincias } from '@/components/provincias/ProvinciasJSON'

const Provincias = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="provincia"
      render={({ field }) => (
        <FormItem  className="flex flex-col w-2/5">
          <FormLabel>Provincia</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl className="border border-slate-800">
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[200px] justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? ListadoProvincias.find(
                      (provincia) => provincia.value === field.value
                    )?.label
                    : "Selecionar provincia"}
                  <CaretSortIcon className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 h-64">
              <Command>
                <CommandInput
                  placeholder="Buscar Provincias"
                  className="h-9"
                />
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {ListadoProvincias.map((provincia) => (
                    <CommandItem
                      value={provincia.label}
                      key={provincia.value}
                      onSelect={() => {
                        form.setValue("provincia", provincia.value);
                      }}
                    >
                      {provincia.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          provincia.value === field.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}


export { Provincias };
