import React from "react";
import Hero3D from "@/components/Hero3D";
import registros from "@/data/registros";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export default function Index() {
  const recursosRef = React.useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<{ key: "ris" | "establecimiento" | "jefatura"; dir: "asc" | "desc" }>({ key: "ris", dir: "asc" });

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    const data = registros.filter((r) =>
      [r.ris, r.establecimiento, r.jefatura].some((v) => v.toLowerCase().includes(q)),
    );
    const sorted = [...data].sort((a, b) => {
      const va = a[sort.key].toLowerCase();
      const vb = b[sort.key].toLowerCase();
      if (va < vb) return sort.dir === "asc" ? -1 : 1;
      if (va > vb) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [query, sort]);

  const onSort = (key: "ris" | "establecimiento" | "jefatura") => {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  };

  const scrollToRecursos = () => recursosRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <Hero3D
        title="Campus Hospitalario Futurista"
        subtitle="Una visión interactiva de un hospital moderno dedicado a la salud y la educación."
        ctaLabel="Explorar recursos"
        onCtaClick={scrollToRecursos}
      />

      <section className="bg-gradient-to-br from-teal-50 via-white to-sky-50 py-12">
        <div className="container" ref={recursosRef}>
          <div className="mb-8 grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Recursos Académicos y Profesionales</h2>
              <p className="mt-2 text-muted-foreground">
                Acceda rápidamente a los registros y enlaces oficiales. Esta sección está pensada para personal
                clínico, docentes y estudiantes, combinando excelencia académica con innovación en salud.
              </p>
            </div>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Búsqueda rápida</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Buscar por RIS, Establecimiento o Jefatura"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex items-center justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <CardTitle>Tabla de Recursos</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">Listado de RIS, Establecimiento, Jefatura y Enlace (URL)</p>
              </div>
              <Button variant="secondary" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Volver arriba</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer select-none" onClick={() => onSort("ris")}>
                      <div className="inline-flex items-center gap-2">
                        RIS
                        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => onSort("establecimiento")}>
                      <div className="inline-flex items-center gap-2">
                        Establecimiento
                        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => onSort("jefatura")}>
                      <div className="inline-flex items-center gap-2">
                        Jefatura
                        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </TableHead>
                    <TableHead>Enlace (URL)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
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
                          Abrir
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableCaption>Datos de ejemplo, personalizables según su institución.</TableCaption>
              </Table>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
