export interface PCPart {
  id: string
  name: string
  nameEs: string
  description: string
  color: string
  emissiveColor: string
  position: [number, number, number]
  scale: [number, number, number]
  shape: "box" | "cpu" | "ram" | "gpu" | "psu" | "fan" | "storage" | "case"
  step: number
  hint: string
  funFact: string
  quiz: {
    question: string
    options: string[]
    correctIndex: number
  }
}

export const PC_PARTS: PCPart[] = [
  {
    id: "case",
    name: "PC Case",
    nameEs: "Gabinete",
    description:
      "El gabinete es la estructura que aloja y protege todos los componentes internos de la PC. Proporciona ventilacion, organizacion de cables y puntos de montaje.",
    color: "#2a2a3e",
    emissiveColor: "#1a1a2e",
    position: [0, 0, 0],
    scale: [3, 4, 2],
    shape: "case",
    step: 1,
    hint: "Es lo primero que necesitas: la caja donde ira todo.",
    funFact:
      "Los primeros gabinetes de PC eran horizontales y se colocaban debajo del monitor, como los computadores IBM originales.",
    quiz: {
      question: "Cual es la funcion principal del gabinete?",
      options: [
        "Proteger y alojar los componentes",
        "Procesar datos",
        "Almacenar archivos",
        "Conectar a internet",
      ],
      correctIndex: 0,
    },
  },
  {
    id: "psu",
    name: "Power Supply Unit",
    nameEs: "Fuente de Poder",
    description:
      "La fuente de poder convierte la corriente alterna (AC) de la toma de corriente en corriente continua (DC) que necesitan los componentes de la PC.",
    color: "#4a4a5e",
    emissiveColor: "#3a3a4e",
    position: [0, -0.8, -0.2],
    scale: [2.4, 0.7, 1.4],
    shape: "psu",
    step: 7,
    hint: "Sin ella, nada tiene energia. Se instala generalmente en la parte inferior del gabinete.",
    funFact:
      "Una fuente de poder de 1000W puede alimentar hasta 10 bombillas de 100W simultaneamente.",
    quiz: {
      question: "Que tipo de corriente entrega la fuente de poder a los componentes?",
      options: [
        "Corriente alterna (AC)",
        "Corriente continua (DC)",
        "Corriente mixta",
        "Corriente estatica",
      ],
      correctIndex: 1,
    },
  },
  {
    id: "motherboard",
    name: "Motherboard",
    nameEs: "Placa Madre",
    description:
      "La placa madre es el circuito principal que conecta todos los componentes entre si. Tiene slots para RAM, CPU, GPU y conectores para almacenamiento y energia.",
    color: "#1a5c3a",
    emissiveColor: "#0d4a2d",
    position: [0, 0.1, -0.1],
    scale: [2.3, 2.3, 0.15],
    shape: "box",
    step: 2,
    hint: "Es la pieza central que conecta todo. Se monta verticalmente en el gabinete.",
    funFact:
      "Una placa madre moderna tiene mas de 10 capas de circuitos impresos con millones de conexiones.",
    quiz: {
      question: "Cual es la funcion de la placa madre?",
      options: [
        "Solo dar energia",
        "Conectar y comunicar todos los componentes",
        "Almacenar el sistema operativo",
        "Enfriar el procesador",
      ],
      correctIndex: 1,
    },
  },
  {
    id: "cpu",
    name: "CPU (Processor)",
    nameEs: "Procesador (CPU)",
    description:
      'El CPU es el "cerebro" de la computadora. Ejecuta instrucciones y realiza calculos. Se instala en un socket especifico de la placa madre.',
    color: "#8a8a9e",
    emissiveColor: "#6a6a7e",
    position: [0, 0.6, -0.3],
    scale: [0.5, 0.5, 0.08],
    shape: "cpu",
    step: 3,
    hint: "Es el cerebro de la computadora. Un chip cuadrado que va en el centro de la placa madre.",
    funFact:
      "Un procesador moderno tiene mas de 10 mil millones de transistores, cada uno mas pequeno que un virus.",
    quiz: {
      question: "Donde se instala el CPU?",
      options: [
        "En cualquier parte del gabinete",
        "En el socket de la placa madre",
        "Dentro de la GPU",
        "En la fuente de poder",
      ],
      correctIndex: 1,
    },
  },
  {
    id: "cooler",
    name: "CPU Cooler",
    nameEs: "Cooler del CPU",
    description:
      "El cooler mantiene la temperatura del CPU bajo control. Puede ser un disipador con ventilador o un sistema de refrigeracion liquida.",
    color: "#5a5a6e",
    emissiveColor: "#4a4a5e",
    position: [0, 0.6, 0.1],
    scale: [0.8, 0.8, 0.6],
    shape: "fan",
    step: 5,
    hint: "Se coloca directamente sobre el CPU para mantenerlo fresco.",
    funFact:
      "Sin un cooler, un CPU puede alcanzar temperaturas de mas de 100 grados Celsius en segundos.",
    quiz: {
      question: "Que pasa si el CPU no tiene cooler?",
      options: [
        "Funciona mas rapido",
        "No enciende",
        "Se sobrecalienta y puede danarse",
        "Consume menos energia",
      ],
      correctIndex: 2,
    },
  },
  {
    id: "ram",
    name: "RAM Memory",
    nameEs: "Memoria RAM",
    description:
      "La RAM es la memoria de acceso rapido donde el CPU almacena datos temporalmente mientras trabaja. Mas RAM permite ejecutar mas programas simultaneamente.",
    color: "#2e7d32",
    emissiveColor: "#1b5e20",
    position: [0.6, 0.5, -0.3],
    scale: [0.15, 1.2, 0.5],
    shape: "ram",
    step: 4,
    hint: "Son modulos delgados y alargados que van junto al CPU en la placa madre.",
    funFact:
      "La velocidad de la RAM se mide en MHz. La RAM DDR5 moderna puede alcanzar mas de 7000 MHz.",
    quiz: {
      question: "Que tipo de memoria es la RAM?",
      options: [
        "Memoria permanente",
        "Memoria temporal/volatil",
        "Memoria de solo lectura",
        "Memoria de video",
      ],
      correctIndex: 1,
    },
  },
  {
    id: "storage",
    name: "Storage (SSD)",
    nameEs: "Almacenamiento (SSD)",
    description:
      "El SSD almacena permanentemente el sistema operativo, programas y archivos. Es mucho mas rapido que un disco duro tradicional (HDD).",
    color: "#1565c0",
    emissiveColor: "#0d47a1",
    position: [-0.5, -0.6, -0.3],
    scale: [1, 0.1, 0.7],
    shape: "storage",
    step: 6,
    hint: "Un dispositivo delgado y compacto donde se guardan todos tus archivos permanentemente.",
    funFact:
      "Un SSD NVMe moderno puede leer datos a mas de 7000 MB/s, unas 100 veces mas rapido que un HDD.",
    quiz: {
      question: "Cual es la ventaja principal del SSD sobre el HDD?",
      options: [
        "Es mas barato",
        "Tiene mas capacidad",
        "Es mucho mas rapido",
        "Consume mas energia",
      ],
      correctIndex: 2,
    },
  },
  {
    id: "gpu",
    name: "Graphics Card (GPU)",
    nameEs: "Tarjeta Grafica (GPU)",
    description:
      "La GPU procesa graficos e imagenes. Es esencial para gaming, diseno 3D y edicion de video. Se conecta al slot PCIe de la placa madre.",
    color: "#3a3a4e",
    emissiveColor: "#2a2a3e",
    position: [0, -0.3, 0.1],
    scale: [2.2, 0.3, 1.2],
    shape: "gpu",
    step: 8,
    hint: "La pieza mas grande despues de la placa madre. Se encarga de los graficos y se conecta horizontalmente.",
    funFact:
      "Las GPUs modernas de gama alta tienen mas de 16,000 nucleos CUDA y pueden realizar billones de calculos por segundo.",
    quiz: {
      question: "Para que se usa principalmente la GPU?",
      options: [
        "Almacenar datos",
        "Procesar graficos e imagenes",
        "Dar energia al sistema",
        "Conectar a la red",
      ],
      correctIndex: 1,
    },
  },
]

export const ASSEMBLY_STEPS = [
  {
    step: 1,
    title: "Preparar el Gabinete",
    instruction: "Primero, abre el gabinete y preparalo para recibir los componentes.",
  },
  {
    step: 2,
    title: "Montar la Placa Madre",
    instruction: "Instala la placa madre en el gabinete usando los separadores y tornillos.",
  },
  {
    step: 3,
    title: "Colocar el Procesador",
    instruction: "Abre el socket del CPU, coloca el procesador alineando la flecha dorada.",
  },
  {
    step: 4,
    title: "Insertar la Memoria RAM",
    instruction: "Abre las pestanas del slot y presiona la RAM hasta que haga click.",
  },
  {
    step: 5,
    title: "Instalar el Cooler",
    instruction: "Aplica pasta termica y monta el cooler sobre el CPU.",
  },
  {
    step: 6,
    title: "Conectar el Almacenamiento",
    instruction: "Conecta el SSD al slot M.2 o con cable SATA a la placa madre.",
  },
  {
    step: 7,
    title: "Instalar la Fuente de Poder",
    instruction: "Coloca la fuente de poder en la parte inferior del gabinete y asegurala.",
  },
  {
    step: 8,
    title: "Instalar la Tarjeta Grafica",
    instruction: "Inserta la GPU en el slot PCIe principal y conecta los cables de energia.",
  },
]
