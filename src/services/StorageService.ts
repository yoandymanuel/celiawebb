
export interface StorageService {
    uploadFile(file: File[]): Promise<string []>;
    save( data: [] ) : Promise<void>;
    listAll():  Promise<{ id: string; }[]>;
    getAllTypeOfKitchens():  Promise<{ id: string; }[]>;

}