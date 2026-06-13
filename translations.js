const translations = {
  da: {
    startside: {
      museumName: "Museum Navn",
      exhibitionTitle: "Udstillingstitel",
      blobs: {
        quiz: ["Quiz om menstruation"],
        video: ["Hør om forskning i", "menstruationsblod"],
        cyklus: ["Udforsk menstruationens", "fire faser"],
      },
      video1: {
        label: "Film 1",
        title: "Videotitel placeholder",
      },
      video2: {
        label: "Film 2",
        title: "Forsker-video",
      },
      quiz: {
        label: "Interaktivt",
        title: "Tag quizzen",
        body: "Test din viden om udstillingen",
        btn: "Start",
      },
    },
    quiz: {
      title: "Quiz",
      intro:
        "Test din viden om udstillingen. Du vil blive stillet spørgsmål, og efter hvert svar får du en forklaring.",
      introQuestionCount: "spørgsmål",
      introReady: "Er du klar?",
      startBtn: "Start quiz",
      nextBtn: "Næste spørgsmål",
      resultsTitle: "Resultat",
      playAgainBtn: "Prøv igen",
      backBtn: "Til forsiden",
      correctLabel: "Rigtigt!",
      wrongLabel: "Forkert!",
      quitTitle: "Er du sikker?",
      quitBody: "Hvis du forlader quizzen nu, mister du al din fremgang.",
      quitConfirm: "Forlad quiz",
      quitCancel: "Fortryd",
      resultsHeading: "Resultat",
      resultsBetterThan: "Du klarede dig bedre end",
      resultsOfVisitors: "af alle andre besøgende",
      resultsBasedOn: "Baseret på",
      resultsAttempts: "forsøg i alt",
      questions: [
        {
          question: "Hvornår får en pige typisk sin første menstruation?",
          options: ["9 år", "13 år", "18 år"],
          correct: 1,
          explanation:
            "Det er meget forskelligt, hvornår en pige får sin menstruation. De fleste får den, når de er mellem 9 og 18 år. Piger får menstruation tidligere, end man gjorde i gamle dage – bl.a. fordi vi får bedre kost.",
          icon: {
            icon: "bind",
            x: 72,
            y: 6,
            size: 200,
            opacity: 0.8,
            rotation: -1,
          },
          explanationIcon: {
            icon: "blod",
            x: 10,
            y: 60,
            size: 240,
            opacity: 0.8,
            rotation: -1,
          },
        },
        {
          question: 'Hvad betyder ordet "menstruation"?',
          options: ["Blodets tid", "Det røde", "Månedlig", "Sundhed"],
          correct: 2,
          explanation:
            'Menstruation betyder "månedlig". Menstruationscyklussen varer i gennemsnit mellem 23 og 35 dage. Derfor har det fået navn fra det latinske ord "mensis", som betyder måned.',
          icon: {
            icon: "blod",
            x: 75,
            y: 8,
            size: 200,
            opacity: 0.8,
            rotation: -1,
          },
          explanationIcon: [
            {
              icon: "calendar",
              x: 70,
              y: 55,
              size: 240,
              opacity: 0.6,
            },
          ],
        },
        {
          question:
            "Hvor mange menstruationer har en kvinde i løbet af sit liv?",
          options: ["Ca. 8.000", "Ca. 400", "Ca. 40"],
          correct: 1,
          explanation:
            "I dag har en kvinde ca. 400 menstruationer i løbet af sit liv. For 150 år siden var tallet tættere på 40, bl.a. fordi kvinder havde mange graviditeter.",
          icon: {
            icon: "kvinde",
            x: 70,
            y: 38,
            size: 200,
            opacity: 0.99,
          },
          explanationIcon: [
            {
              icon: "tampon",
              x: 70,
              y: 55,
              size: 240,
              opacity: 0.8,
            },
          ],
        },
        {
          question:
            "Hvornår i livet har man de kraftigste menstruationssmerter?",
          options: [
            "De første år efter man har fået sin første menstruation",
            "Omkring 30-års alderen",
            "De sidste år inden menstruationen stopper",
          ],
          correct: 0,
          explanation:
            "Flest piger i teenageårene og kvinder i starten af 20'erne har voldsomme menstruationssmerter.",
          icon: {
            icon: "kvinde",
            x: 70,
            y: 38,
            size: 200,
            opacity: 0.99,
          },
        },
        {
          question:
            "Det er først for nylig, at man er begyndt at forske i menstruationsblod. Hvad er årsagen?",
          options: [
            "Kvinder har ikke villet donere blod til forskning",
            "Forskningsverdenen har historisk set fokuseret mest på mandekroppen",
            "Forskere har syntes, at blodet var ulækkert",
            "Menstruationen har været tabubelagt",
          ],
          correct: 1,
          explanation:
            "Det er svært at give én forklaring på, hvorfor forskere ikke har interesseret sig for menstruationsblod. Nogle af grundene er, at menstruation har været tabubelagt, og at forskningsverdenen historisk har været mest optaget af mandekroppen.",
          explanationIcon: [
            {
              icon: "kop",
              x: 70,
              y: 55,
              size: 240,
              opacity: 0.8,
            },
          ],
        },
        {
          question: "Hvorfor undersøger forskere menstruationsblod?",
          options: [
            "Fordi de gerne vil vide, hvordan man standser menstruationen",
            "Fordi kvinders cyklus kan give svar på spørgsmål om kvinders sundhed",
            "Fordi de ønsker at bruge menstruationsblod til blodtransfusion",
          ],
          correct: 1,
          explanation:
            "Menstruationsblod består af forskellige slags celler, proteiner og andre stoffer, som alt sammen kan fortælle forskere om kvinders sundhed.",
          icon: {
            icon: "science",
            x: 90,
            y: 5,
            size: 240,
            opacity: 0.99,
          },
          explanationIcon: [
            {
              icon: "kvinde",
              x: 75,
              y: 55,
              size: 260,
              opacity: 0.9,
            },
            {
              icon: "blod",
              x: 8,
              y: 7,
              size: 260,
              opacity: 0.7,
            },
          ],
        },
      ],
    },
  },
  en: {
    startside: {
      museumName: "Museum Name",
      exhibitionTitle: "Exhibition Title",
      blobs: {
        quiz: ["Quiz about menstruation"],
        video: ["Hear about research in", "menstrual blood"],
        cyklus: ["Explore the four phases", "of menstruation"],
      },
      video1: {
        label: "Film 1",
        title: "Video title placeholder",
      },
      video2: {
        label: "Film 2",
        title: "Video title placeholder",
      },
      quiz: {
        label: "Interactive",
        title: "Take the quiz",
        body: "Test your knowledge about the exhibition",
        btn: "Start",
      },
    },
    quiz: {
      title: "Quiz",
      intro:
        "Test your knowledge about the exhibition. You will be asked questions, and after each answer you will receive an explanation.",
      introQuestionCount: "questions",
      introReady: "Are you ready?",
      startBtn: "Start quiz",
      nextBtn: "Next question",
      resultsTitle: "Results",
      playAgainBtn: "Try again",
      backBtn: "← Homepage",
      correctLabel: "Correct!",
      wrongLabel: "Incorrect!",
      quitTitle: "Are you sure?",
      quitBody: "If you leave the quiz now, you will lose all your progress.",
      quitConfirm: "Leave quiz",
      quitCancel: "Cancel",
      resultsHeading: "Result",
      resultsBetterThan: "You did better than",
      resultsOfVisitors: "of all other visitors",
      resultsBasedOn: "Based on",
      resultsAttempts: "attempts in total",
      questions: [
        {
          question: "When does a girl typically get her first period?",
          options: ["9 years old", "13 years old", "18 years old"],
          correct: 1,
          explanation:
            "It varies greatly when a girl gets her first period. Most girls get their period when they are between 9 and 18 years old. Girls now get their period earlier than previous generations, partly due to improved nutrition.",
          icon: {
            icon: "bind",
            x: 72,
            y: 6,
            size: 200,
            opacity: 0.8,
            rotation: -1,
          },
          explanationIcon: {
            icon: "blod",
            x: 10,
            y: 60,
            size: 240,
            opacity: 0.8,
            rotation: -1,
          },
        },
        {
          question: 'What does the word "menstruation" mean?',
          options: ["The red flow", "Bleeding", "Monthly", "Health"],
          correct: 2,
          explanation:
            'Menstruation means "monthly". A menstrual cycle averages between 23 to 35 days. Its name is therefore derived from the Latin word "mensis", which means month.',
          icon: {
            icon: "blod",
            x: 75,
            y: 8,
            size: 200,
            opacity: 0.8,
            rotation: -1,
          },
          explanationIcon: [
            {
              icon: "calendar",
              x: 70,
              y: 55,
              size: 240,
              opacity: 0.6,
            },
          ],
        },
        {
          question: "How many periods does a woman have during her life?",
          options: ["About 1000", "About 400", "About 40"],
          correct: 1,
          explanation:
            "Today, a woman has about 400 periods during her life. 150 years ago, the number was closer to 40, partly because women had many pregnancies.",
          icon: {
            icon: "kvinde",
            x: 70,
            y: 42,
            size: 200,
            opacity: 0.99,
          },
          explanationIcon: [
            {
              icon: "tampon",
              x: 70,
              y: 55,
              size: 240,
              opacity: 0.8,
            },
          ],
        },
        {
          question:
            "At what stage in life do women have the most severe menstrual cramps?",
          options: [
            "The first few years after their first period",
            "In their 30s",
            "The last few years before their period stops",
          ],
          correct: 0,
          explanation:
            "Teenage girls and women in the beginning of their 20s have the most severe menstrual cramps.",
          icon: {
            icon: "kvinde",
            x: 70,
            y: 38,
            size: 200,
            opacity: 0.99,
          },
        },
        {
          question:
            "Only recently have scientists begun researching menstrual blood. Why is that?",
          options: [
            "Women have not been willing to donate blood for research",
            "The research community has historically focused on the male body",
            "Researchers have found menstrual blood to be 'gross'",
            "Menstruation has been a taboo",
          ],
          correct: 1,
          explanation:
            "It's difficult to give a single explanation as to why researchers have not been interested in menstrual blood. Some of the reasons are that menstruation is a taboo subject, and that the research community historically has favoured the male body in research.",
          explanationIcon: [
            {
              icon: "kop",
              x: 70,
              y: 55,
              size: 240,
              opacity: 0.8,
            },
          ],
        },

        {
          question: "Why do researchers study menstrual blood?",
          options: [
            "They want to know how to stop menstruation",
            "Because women's menstrual cycles can answer questions about their health",
            "They want to use menstrual blood for blood transfusions",
          ],
          correct: 1,
          explanation:
            "Menstrual blood consists of different types of cells, proteins, and other compounds, which can all tell researchers about women's health.",
          icon: {
            icon: "science",
            x: 85,
            y: 5,
            size: 240,
            opacity: 0.99,
          },
          explanationIcon: [
            {
              icon: "kvinde",
              x: 75,
              y: 55,
              size: 260,
              opacity: 0.9,
            },
            {
              icon: "blod",
              x: 8,
              y: 7,
              size: 260,
              opacity: 0.7,
            },
          ],
        },
      ],
    },
  },
};

export default translations;
