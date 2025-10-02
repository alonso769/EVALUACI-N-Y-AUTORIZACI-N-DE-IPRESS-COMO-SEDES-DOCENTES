import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableCaption, // Asegúrate de que TableCaption esté importado
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import registros from "@/data/registros";
import ImageSphere from "@/components/ImageSphere"; // ⬅️ IMPORTAR EL COMPONENTE DE LA ESFERA

export default function Hospital() {
    const navigate = useNavigate();

    return (
        // El 'min-h-screen' asegura que el main ocupe toda la altura de la pantalla
        <main className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-sky-50">
            
            {/* ⬅️ 1. CONTENEDOR DE LA ESFERA Y POSIBLE TÍTULO SUPERPUESTO ⬅️ */}
            <div className="relative w-full overflow-hidden">
                <ImageSphere />
                
                {/* Opcional: Título superpuesto a la esfera */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white text-shadow-lg leading-tight">
                        <span className="block mb-2">Campus Hospitalario</span> 
                        <span className="block text-blue-300">Interactiva</span>
                    </h1>
                </div>
            </div>
            
            {/* ⬅️ 2. SECCIÓN DE CONTENIDO (LA TABLA) ⬅️ */}
            {/* 'relative z-20' para que esté por encima de la esfera, '-mt-16' para superponerse un poco */}
            <section className="container py-8 relative z-20 bg-white shadow-2xl rounded-t-lg -mt-16"> 
                <div className="mb-6 rounded-xl border bg-accent/40 p-4 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Aquí podrá acceder a enlaces de registro institucionales.</p>
                    <p className="mt-1">Use la tabla para navegar entre los distintos recursos de cada establecimiento.</p>
                </div>

                <Card>
                    <CardHeader className="flex items-center justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <CardTitle>Registros del Hospital</CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">Listado de RIS, Establecimiento, Jefe y Enlace</p>
                        </div>
                        <Button variant="secondary" onClick={() => navigate("/")}>Volver al Inicio</Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>RIS</TableHead>
                                    <TableHead>Establecimiento</TableHead>
                                    <TableHead>Jefatura</TableHead>
                                    <TableHead>Enlace</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {registros.map((r) => (
                                    <TableRow key={`${r.ris}-${r.establecimiento}`}>
                                        <TableCell className="font-medium">{r.ris}</TableCell>
                                        <TableCell>{r.establecimiento}</TableCell>
                                        <TableCell>{r.jefatura}</TableCell>
                                        <TableCell>
                                            <a
                                                className="text-primary underline underline-offset-4 hover:opacity-80"
                                                href={r.enlace}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Abrir Enlace
                                            </a>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableCaption>
                                Datos de ejemplo, personalizables según su institución.
                            </TableCaption>
                        </Table>
                    </CardContent>
                </Card>
            </section>
        </main>
    );
}