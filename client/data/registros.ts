export interface Registro {
  ris: string;
  establecimiento: string;
  jefatura: string;
  enlace: string;
}

const registros: Registro[] = [
  {
    ris: "RIS-001",
    establecimiento: "Hospital Central",
    jefatura: "Dra. Valentina Ortiz",
    enlace: "https://www.minsal.cl/",
  },
  {
    ris: "RIS-002",
    establecimiento: "Clínica Norte",
    jefatura: "Dr. Martín Rivas",
    enlace: "https://www.gob.cl/",
  },
  {
    ris: "RIS-003",
    establecimiento: "Centro de Salud Sur",
    jefatura: "Enf. Camila Fuentes",
    enlace: "https://www.who.int/",
  },
  {
    ris: "RIS-004",
    establecimiento: "Hospital Universitario",
    jefatura: "Dr. Álvaro Núñez",
    enlace: "https://www.paho.org/",
  },
];

export default registros;
