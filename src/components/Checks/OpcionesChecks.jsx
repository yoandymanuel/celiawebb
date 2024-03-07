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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const TypeChecks = {
    "envioDomicilio": {
        label: "Envio Domicilio",
        description: "Indica que tu restaurante ofrece pedidos a domicilio",
        name: "envioDomicilio"
    },
    "recogidaLocal": {
        label: "Recogida en Local",
        description: "Indica que tu restaurante permite recoger pedidos en el local",
        name: "recogidaLocal"
    },
    "opcionVegana": {
        label: "Opción Vegana",
        description: "Indica que tu restaurante ofrece opciones veganas",
        name: "opcionVegana"
    },
    "default": {
        label: "Opción",
        description: "Descripción de la opción",
        name: "opcion"
    }
}

const OpcionesChecks = ({ form, type }) => {
    const typeSelected = type in TypeChecks   ? type: 'default';
    return (
        <div>
            <FormField
                control={form.control}
                name={TypeChecks[typeSelected].name}
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md shadow border-slate-800">
                        <FormControl>
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none ">
                            <FormLabel>{TypeChecks[typeSelected].label}</FormLabel>
                            <FormDescription>
                                {TypeChecks[typeSelected].description}
                            </FormDescription>
                        </div>
                    </FormItem>
                )}
            />

        </div>
    )

}

export { OpcionesChecks }