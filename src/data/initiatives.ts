export type ActivityStory = {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  formats: string;
  href: string;
  linkLabel: string;
  media: {
    src?: string;
    alt: string;
    motif: "statistics" | "code" | "learning";
  };
};

export const events: ActivityStory[] = [
  {
    id: "amostra",
    category: "Estatística em diálogo",
    title: "aMostra de Estatística",
    subtitle: "Estatística, pesquisa e atuação profissional.",
    description:
      "Promovemos a aMostra de Estatística em parceria com sua comissão organizadora, formada por estudantes de Estatística do IME-USP. A programação reúne palestras, mesas-redondas e minicursos sobre pesquisa e atuação profissional na área.",
    formats: "Palestras · Mesas-redondas · Minicursos",
    href: "https://amostra.ime.usp.br/",
    linkLabel: "Conheça a aMostra",
    media: {
      src: "/atividades/amostra.jpg",
      alt: "Identidade visual da aMostra de Estatística",
      motif: "statistics",
    },
  },
  {
    id: "symcomp",
    category: "Tecnologia em comunidade",
    title: "Semana da Computação",
    subtitle: "Em parceria com a SymComp.",
    description:
      "Promovemos a Semana da Computação no IME-USP em parceria com a SymComp, sua comissão organizadora. O evento reúne estudantes, pesquisadores e profissionais para discutir tecnologia, compartilhar experiências e participar de encontros e desafios.",
    formats: "Computação · Troca de experiências · Desafios",
    href: "https://symcomp.ime.usp.br/semana",
    linkLabel: "Explore a Semana da Computação",
    media: {
      src: "/atividades/semana-computacao.jpg",
      alt: "Arte da XVI Semana da Computação",
      motif: "code",
    },
  },
];

export const initiatives: ActivityStory[] = [
  {
    id: "imensina",
    category: "Acesso à universidade",
    title: "Cursinho IMEnsina",
    subtitle: "O conhecimento abre portas. Vamos abrir mais algumas.",
    description:
      "O IMEnsina é o cursinho popular pré-vestibular coordenado pela IME Jr no IME-USP. A iniciativa aproxima a comunidade universitária de estudantes que estão construindo seu caminho até o ensino superior.",
    formats: "Cursinho popular · Pré-vestibular · Impacto social",
    href: "https://www.instagram.com/imensina.usp/",
    linkLabel: "Acompanhe o IMEnsina",
    media: {
      src: "/atividades/imensina.jpg",
      alt: "Identidade visual do Cursinho IMEnsina",
      motif: "learning",
    },
  },
  {
    id: "youtube",
    category: "Conhecimento para compartilhar",
    title: "A sala de aula também é online.",
    subtitle: "Aulas no YouTube da IME Jr",
    description:
      "O que a gente aprende também pode ajudar quem está começando. No nosso canal, compartilhamos aulas e conteúdos para continuar estudando, descobrir assuntos e dar os primeiros passos em tecnologia e dados.",
    formats: "Aulas · Conteúdos introdutórios · Aprendizado no seu ritmo",
    href: "https://www.youtube.com/channel/UCc4ePc_uJuRT-4ZtZCG-xPw",
    linkLabel: "Explore as aulas no YouTube",
    media: {
      alt: "Espaço reservado para uma imagem de uma aula do canal da IME Jr",
      motif: "code",
    },
  },
];

export const talksMedia: ActivityStory["media"] = {
  src: "/atividades/palestras.png",
  alt: "Arte das palestras da IME Jr com uma apresentação em sala de aula.",
  motif: "code",
};
