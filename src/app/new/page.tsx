import { AddForm } from "./add-form"
export default function newPage() {
    return (
        <>
            <div className="flex">
                <div className="flex-auto  h-16 ">
                    <p className="text-2xl text-center	">Nuevo Restaurante</p>
                </div>
            </div>
            <div className="flex-auto ">
                <AddForm />
            </div>

        </>
    )
}