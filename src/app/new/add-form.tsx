"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Provincias } from "@/components/provincias/Provincias";
import { TipoServicios } from "@/components/servicios/TipoServicios";
import { TipoCocinas } from "@/components/tipoCocina/TipoCocinas";
import { OpcionesChecks } from "@/components/Checks/OpcionesChecks";
import { CONST } from "@/lib/GLOBALS/CONSTANTS/Constants";
import { REGEX } from "@/lib/GLOBALS/REGEX/Regexs";
import {
  ValidationErrors,
  Coordenadas,
} from "@/lib/GLOBALS/INTERFACES/Interfaces";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import StorageFirebaseService from "@/services/StorageFirebaseService";
import { ModaNotifications } from "@/components/Modal/ModaNotifications";

const FormSchema = z.object({
  name: z.string().min(5),
  //   direccion: z.string().min(5), //TODO: Activar antes de subir a produccion
  website: z.string().url({ message: "Formato de URL incorrecto" }).min(5),
  phone: z.string().max(9).min(9),
  city: z.string().min(5),
  direccion: z.null().optional(),
  img: z.null().optional(),
  number: z.string().min(5),
  provincia: z.string({
    required_error: "Por favor selecciona una provincia.",
  }),
  tipoServicio: z.string({
    required_error: "Por favor selecciona un servicio.",
  }),
  tipoCocina: z.string({
    required_error: "Por favor selecciona un tipo de cocina .",
  }),
  descripcion: z.string().min(10).max(160),
  opcionVegana: z.boolean().default(false).optional(),
  envioDomicilio: z.boolean().default(false).optional(),
});
const ImageSchema = z.object({
  name: z.string(),
  type: z.string().refine((value) => value.startsWith("image/")),
  size: z
    .number()
    .refine((value) => value < 1024 * 1024 * CONST.FILES.MAX_SIZE_IMAGE_MB),
});

const AddForm = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<ValidationErrors[]>([]);
  const [direccion, setDireccion] = useState("");
  const [poblacion, setPoblacion] = useState("");
  const [pais, setPais] = useState("");
  const [cp, setCp] = useState("");
  const [imageSelectedNames, setImageSelectedNames] = useState<string[]>([]);
  const [coordenadaUser, setCoordenadasUser] = useState<Coordenadas | null>(
    null
  );

  // StorageFirebaseService.listAll().then((data) => {
  //   console.log({ data });
  // });
  
  //trabajando con la direccion
  const handleAdress = (data: any) => {
    // console.log({data})
    const { description, place_id, terms } = data;
    const termsLenght = terms.length;

    // const cpEncontrado = description?.match(regexCodigoPostal)
    const cpEncontrado = description.match(REGEX.CodigoPostal);
    cpEncontrado && setCp(cpEncontrado[0]);

    setDireccion(description);
    setPoblacion(terms[termsLenght - 2]?.value);
    setPais(terms[termsLenght - 1]?.value);
    geocodeByAddress(description)
      .then((results) => getLatLng(results[0])) // TODO: tener en cuenta este result por que da una direccion mas exacta.
      .then(({ lat, lng }) => {
        console.info(data);
        setCoordenadasUser({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      });

    // console.log(description)
    // console.log(terms[termsLenght-2]?.value)
    // console.log(terms[termsLenght-1]?.value)
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
      filesArray.forEach((file) => {
        try {
          ImageSchema.parse({
            name: file.name,
            type: file.type,
            size: file.size,
          });
        } catch (error: any) {
          toast({
            title: "Selecccion de archivo no valida!!",
            variant: "destructive",
            description: (
              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <code className="text-white">
                  {JSON.stringify(error, null, 1)}
                </code>
              </pre>
            ),
          });
        }
        setSelectedFiles([...filesArray]);
        setImageSelectedNames((prevNames) => [...prevNames, file.name]);
      });
    }
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    // defaultValues: {
    //   name: "",
    //   website: "",
    //   phone: "",
    //   city: "",
    //   number: "",
    //   opcionVegana: false,
    //   envioDomicilio: false,
    //   descripcion: "",
    // },
    defaultValues: {
      name: "test restaurante insert ",
      website: "http://localhost:3000/new",
      phone: "123456789",
      city: "Badalona",
      number: "08912",
      opcionVegana: true,
      envioDomicilio: false,
      descripcion: "esto es un test de prueba de una descripcion en el insert",
      
    },
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    // StorageFirebaseService.uploadFile(selectedFiles)
    //   .then((imageUploadsNames: string[]) => {
      let datas ={
        name: data.name,
        address: direccion,
        description: data.descripcion,
        phone: data.phone,
        website: data.website,
        delivery: data.envioDomicilio,
        typeRestaurant: data.tipoServicio,
        kitchenRestaurant: data.tipoCocina,
        location: coordenadaUser,
        veganOption: data.opcionVegana,
        geodata: {
          city: poblacion,
          country: pais.trim(),
          isCountryCode: CONST.IDIOMA.ESPANOL,
          provincia: data.city.trim(),
          number: cp,
        },
        geohash: "",
        images: [] , // [...imageUploadsNames], //TODO: quitar el || [] cuando se suba a produccion
        rating: 0,
        ratingTotal: 0,
        quantityVoting: 0,
        createAt: new Date(),
        createdBy: CONST.ORIGEN.WEB,
        owner: "",
        approveByAdmin: false,
      // })

    }
        StorageFirebaseService.save(datas)
      .then(() => {
        form.reset();
        toast({
          title: "Datos guardados correctamente",
          variant: "success",
          description: "Los datos se han guardado correctamente.",
        });
      })
      .catch((error) => {
        console.error("Error al guardar los datos", error);
        toast({
          title: `Error al guardar los datos: ${error}`,
          variant: "destructive",
          description: "Error al guardar los datos.",
        });
      });
  }

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-3 gap-5 gap-y-10  ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Restaurante</FormLabel>
                  <FormControl>
                    <Input
                      className="border border-slate-800"
                      placeholder="Nombre Restaurante"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Web del Restaurante</FormLabel>
                  <FormControl>
                    <Input
                      className="border border-slate-800"
                      placeholder="Web del Restaurante"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="w-2/5">
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input
                      className="border border-slate-800"
                      placeholder="Número de teléfono"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poblacion</FormLabel>
                  <FormControl>
                    <Input
                      className="border border-slate-800"
                      placeholder="Población"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Dirección del Restaurante</FormLabel>
                  <FormControl className="border rounded-md shadow border-slate-800">
                    <GooglePlacesAutocomplete //TODO ADD: añadir los estilos
                      placeholder="Dirección del Restaurante"
                      minLengthAutocomplete={5}
                      debounce={3}
                      autocompletionRequest={{
                        componentRestrictions: {
                          country: [CONST.IDIOMA.ESPANOL],
                        },
                      }}
                      apiKey="AIzaSyBRFy8b7c7bJdDVWH9BSiFa_fZLREgf1ls"
                      //apiOptions={{ language: CONST.IDIOMA.ESPANOL, region: CONST.IDIOMA.ESPANOL }}
                      initialValue={""}
                      onSelect={handleAdress}
                    />
                    {/*<Input className='border border-slate-800' placeholder="Dirección del Restaurante" {...field} />*/}
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem className="w-2/5">
                  <FormLabel>Portal</FormLabel>
                  <FormControl>
                    <Input
                      className="border border-slate-800"
                      placeholder="Portal"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Provincias form={form} />
            <TipoServicios form={form} />
            <TipoCocinas form={form} />
          </div>
          <Separator />

          <div className="grid w-4/5 grid-cols-2 gap-5">
            <div>
              <OpcionesChecks form={form} type={CONST.ENVIO_DOMICILIO} />
            </div>

            <div>
              <OpcionesChecks form={form} type={CONST.OPCION_VEGANA} />
            </div>
          </div>

          <div className="grid w-4/5 grid-cols-2 gap-5">
            <div>
              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción del Restaurante</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descripción del Restaurante..."
                        className="border resize border-slate-800"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className={"mt-2 w-5/5  "}>
              <FormLabel>Adjuntar Imagenes</FormLabel>
              <FormField
                control={form.control}
                name="img"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md shadow border-slate-800">
                    <FormControl>
                      <Input
                        id="picture"
                        type="file"
                        multiple={true}
                        accept={CONST.FILES.IMAGENES_PERMITIDAS}
                        onChange={handleFileChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex justify-around w-4/5 ">
            <Button
              className="w-2/5 mt-20 bg-green-700 border hover:bg-green-900"
              type="submit"
            >
              Enviar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export { AddForm };
