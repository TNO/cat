import m from 'mithril';
import { SlimdownView, render } from 'mithril-ui-form';
import { Dashboards, UserType } from '../models';
import { MeiosisComponent } from '../services';
import tnoLogo from '../assets/tno_txt.svg';
import { Select, ISelectOptions } from 'mithril-materialized';
import { i18n, t } from 'mithriljs-i18n';

const mdNl = `#### Capability Assessment Tool

De Capability Assessment Tool (CAT) ondersteunt het proces om in het veiligheidsdomein op systematische wijze de status van de voor het betreffende domein essentiële capability’s te analyseren en eventuele verbetervoorstellen vast te leggen en te delen met betrokken stakeholders. De belangrijkste functionaliteiten van CAT hebben betrekking op het assisteren bij:

1.	Definiëren en karakteriseren van relevante capability’s in een zeker veiligheidsdomein.
2.	Evalueren van het belang (importance) en de huidige staat (performance) van de capability’s, alsmede een beoordeling van de noodzaak tot eventuele versterking ervan (improvement needs).
3.	Karakteriseren en beoordelen van verbetervoorstellen ter versterking van capability’s.

##### Structuur

Na het opstarten verschijnt het START-scherm met daarin een korte toelichting op CAT en opties om gegevens op te slaan of eerder opgeslagen gegevens op te halen. Via de acht iconen rechts  bovenaan het scherm kunnen de verschillende schermen met onderdelen waaruit CAT is opgebouwd, bereikt worden. De eerste vier – aangeduid met donkerblauwe iconen – betreffen schermen met informatie die alleen geraadpleegd kan worden. De overige vier – aangeduid met lichtblauwe iconen – zijn CAT-modules waarmee systematisch het evaluatieproces kan worden doorlopen. Het betreft:

- START: Startscherm.
- INFO: Achtergrond van CAT en toelichting op de structuur en methodiek en het gebruik ervan.
- TAXONOMIE: Begrippenlijst.
- OVERZICHT: Samenvattend overzicht van alle binnen het betreffende veiligheidsdomein gedefinieerde capability’s inclusief een actueel overzicht van uitgevoerde evaluaties.
- EVALUATIEKADER: Module waarin de parameters voor de beoordeling van capability’s in het betreffende veiligheidsdomein worden vastgelegd.
- VOORBEREIDING: Module waarin voor het betreffende veiligheidsdomein op drie niveaus een capability-hiërarchie kan worden ingevoerd, inlcusief betrokken organisaties en te bereiken doelstellingen.
- BEOORDELING: Module waarin per capability de beoordeling kan worden vastgesteld.
- ONTWIKKELING: Module waarin per capability verbetervoorstellen kunnen worden vastgelegd, inclusief de verwachtingen ten aanzien van verbeterde prestaties na implementatie van die voorstellen.

![CAT proces](${process.env.SERVER}/cat_process.png)

##### START

Todo

##### OVERZICHT

In dit scherm zijn alle binnen de categorieën gedefinieerde subcategorieën in gekleurde tegels weergegeven, inclusief de capability’s die op het derde niveau – binnen de subcatgeorieën – vastgesteld zijn. Door op de naam te klikken wordt overgeschakeld naar het scherm BEOORDELING van de desbetreffende capability.
Voor iedere capability is in een vakje aan de hand van een kleurcodering de status van de laatste beoordeling weergegeven. Indien het vakje grijs is, heeft nog geen beoordeling plaatsgevonden. Achter iedere capability kunnen drie symbolen staan. Een vinkje duidt erop dat in de module BEOORDELING is aangegeven dat besloten is dat de capability verbeterd moet worden; een getal met een lampje betekent dat er in de module ONTWIKKELING een aantal verbetervoorstellen zijn uitgewerkt; twee radertjes geeft aan dat in de module ONTWIKKELING is aangegeven dat een verbetervoorstel is aangenomen.

##### CAT-modules

###### EVALUATIEKADER

Vaststellen van het beoordelingskader binnen het betreffende veiligheidsdomein aan de hand van:
- STAKEHOLDER-TYPEN: Definiëring van typen stakeholders die betrokken zijn bij het betreffende veiligheidsdomein.
- IMPORTANTIE: Definiëring van de schaal om het belang van een capability in uit te drukken.
- PRESTATIECRITERIA: Definiëring van de criteria, inlcusief schaalindeling, om de huidige staat waarin een capability wordt uitgevoerd in uit te drukken.
- PROBLEEMSOORTEN: Definiëring van de aard van problemen of tekortkomingen van een capability.
- BEOORDELINGSMATRIX: Definiëring van beoordelingsscores op basis van de maten van belangrijkheid en de huidige prestaties, uitgedrukt in de noodzaak tot verbetering van de capability.

###### VOORBEREIDING

Nader specificeren van de omgeving binnen het veiligheidsdomein waarin evaluatie plaatsvindt aan de hand van:

- STAKEHOLDERS: Specificeren van stakeholders die betrokken zijn bij het uitvoeren van één of meer capability’s.
- HOOFDDOELSTELLINGEN: Specificeren van de belangrijkste doelstellingen van de overheid binnen het betreffende veiligheidsdomein.
- CATEGORIEËN: Specificeren van categorieën (eerste niveau) en daarbinnen subcategorieën (tweede niveau) van capability’s.
- CAPABILITIES: Specificeren van capability’s binnen alle subcategorieën van capability’s (derde niveau). De capability-hiërarchie in CAT bestaat dus uit drie niveaus. Evaluatie vindt plaats met de op het derde niveau gedefinieerde capability’s.

###### BEOORDELING

Evalueren van de staat van een capability die wordt uitgedrukt in een aanduiding voor de noodzaak tot verbetering. Bovendien kan worden aangegeven of een besluit is genomen de capability te versterken.

##### ONTWIKKELING

Vastleggen van één of meer voorstellen om een capability te versterken. Het betreft een omschrijving van het voorstel inclusief de verwachte resultaten in geval het voorstel is doorgevoerd. Bovendien kan worden aangegeven of een besluit is genomen een bepaald verbetervoorstel daadwerkelijk uit te voeren.

##### Achtergrond
… (komt later als CAT verder is ontwikkeld)

##### Verantwoording
… (komt later als CAT verder is ontwikkeld)


...`;

const mdEn = `#### Capability Assessment Tool

The Capability Assessment Tool (CAT) supports the process of systematically analysing the status of essential capabilities within the domain of Disaster Resilient Societies (DRS) and documenting and sharing any improvement proposals with relevant stakeholders. The main functionalities of CAT pertain to assisting with:

1. Defining and characterizing relevant capabilities within the domain of DRS.
2. Evaluating the importance and current performance of these capabilities, as well as assessing the need for any potential enhancements.

##### Structure

After starting up, the START screen appears, containing a brief introduction to CAT and options to save data or retrieve previously saved data. The seven icons (depended on the select user, see ABOUT) at the top right of the screen provide access to the various screens that make up CAT. The first five screens-indicated by dark blue icons-contain information that can only be consulted. The remaining two-indicated by light blue icons-are CAT modules that can be adjusted. These include:

- HOME: Start screen.
- OVERVIEW: Summary of all capabilities defined within the relevant phases of the Disaster Management Cycle (mitigation/prevention, preparedness, response and recovery).
- ASSESSMENT: Module for determining the evaluation of each capability.
- ABOUT: Background information on CAT, including explanations of its structure, methodology, and usage. In the top right corner users can select their role from three options: Regular user (access to HOME, OVERVIEW, ASSESSMENT, ABOUT and TAXONOMY), Moderator (access to an additional tab: PREPARATION), and Administrator (access to an additional tab: SETTINGS)
- TAXONOMY: Glossary of terms.
- PREPARATION: Module for entering a capability hierarchy for the relevant security domain at three levels, including the involved organizations and objectives to be achieved.
- SETTINGS: Settings such as scales, performance criteria, gaps and assessments can be adjusted.

##### OVERVIEW

In this screen, all subcategories defined within the categories are displayed in coloured tiles, including the capabilities established at the third level within the subcategories. By clicking on the name, you will switch to the ASSESSMENT screen of thee respective capability.

For each capability, the status of the latest assessment is indicated in a box using colour coding. If the box is grey, no assessment has been conducted yet.

##### CAT-modules

###### SETTINGS

Settings can be adjusted to fit the needs of your assessment (this task can only be carried out as an Administrator):

- GENERAL: Possibility to turn on Solution Assessment, allows users to add improvement proposals for each capability, including expectations regarding enhanced performance following the implementation of these proposals.
- TASKS: Adjusting the scales for the assessment themes
- PERFORMANCE: Adjusting the assessment aspects
- GAPS: Adjusting the problem areas of the gaps
- ASSESSMENT MATRIX: Adjusting the scales for assessment score

###### PREPARATION

Further specifying the environment within the DRS domain in which evaluation takes place based on (this task can be carried out as a Moderator and Administrator):

- GROUP GOALS: Specifying the main objectives of your organization within the DRS domain.
- STAKEHOLDER: Specifying the stakeholders involved in performing one or more capabilities.
- CATEGORIES: Specifying categories to organize the capabilities (currently organized per Disaster Management Cycle phase).
- CAPABILITIES: Specifying capabilities within all subcategories of categories (per Disaster Management Cycle phase).

###### ASSESSMENT FRAMEWORK

Establishing the assessment framework within the relevant phase of the Disaster Management Cycle based on:

- DESCRIPTION: Describing the capability.
- STAKEHOLDER TYPES: Defining the types of stakeholders involved.
- ASSESSMENT THEMES: Assessing the contribution of the capability to the themes (preventing incidents, minimise losses from hazards, help victims, adequate recovery).
- ASSESSMENT ASPECTS: Assessing the aspects (effectiveness, safety/security of professionals and efficiency) of the capability
- ADD CAPABILITY GAPS: Describe the gap within this capability
- PROBLEM AREAS: Evaluate the capability gap using the THOR-method (technological, human, organizational, regulatory), indicate if and how the gap affects each area.
- DOCUMENTATION: If possible, include relevant documents or websites, to support the THOR assessment.

> **Note:** In the top right corner the assessment score of the capability is shown: dark green (need for improvement, very low), light green (need for improvement, low), yellow (need for improvement, moderate), orange (need for improvement, high) and red (need for improvement, very high). Next to the assessment score there is a download button, this generates a Capability Assessment Report, of the capability.

###### EVALUATION

Evaluating the state of a capability, indicated by a color-coded assessment of the need for improvements, is shown for each assessed capability in the overview. On the left side of the page, there are several options to filter results, including capabilities, descriptions, keywords and stakeholders. Below the filter options, there is an EXPORT TO WORD button, which generates a Capability Assessment Report containing all the completed assessments.`;

export const Attribution: MeiosisComponent = () => {
  return {
    view: ({
      attrs: {
        state: {
          app: { catModel },
        },
      },
    }) => {
      const { attributionLogo, attributionText, logo } = catModel.data || {};

      return (
        (attributionLogo || attributionText) &&
        m(
          '.footer.flex-container',
          {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
            },
          },
          [
            m(
              '.logo',
              { style: 'max-width: 100%' },
              attributionLogo &&
                m('img[height=50][title=Attribution logo]', { src: attributionLogo })
            ),
            m(
              '.flex-item',
              { style: { flex: '1', margin: '0 20px', fontSize: '10pt' } },
              attributionText && m(SlimdownView, { md: attributionText, removeParagraphs: true })
            ),
            m(
              '.logo.right-align',
              { style: 'max-width: 100%' },
              m('img[height=50][title=Owner]', { src: logo || tnoLogo })
            ),
          ]
        )
      );
    },
  };
};

export const AboutPage: MeiosisComponent = () => ({
  oninit: ({
    attrs: {
      actions: { setPage },
    },
  }) => setPage(Dashboards.ABOUT),
  view: ({ attrs: { state, actions } }) => {
    const { curUser } = state.app;
    console.log(`Cur user: ${curUser}`);
    return [
      m('.row', [
        m(Select, {
          label: t('select_user'),
          initialValue: curUser,
          options: [
            { id: 'user', label: t('user') },
            { id: 'moderator', label: t('moderator') },
            { id: 'admin', label: t('admin') },
          ],
          onchange: (v) => v && actions.saveCurUser(v[0]),
          className: 'col offset-s6 s6 offset-m9 m3',
        } as ISelectOptions<UserType>),
        m('.col.s12.markdown', m.trust(render(i18n.currentLocale === 'nl' ? mdNl : mdEn))),
      ]),
      m(Attribution, { state, actions }),
    ];
  },
});
