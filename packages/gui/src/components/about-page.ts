import m from 'mithril';
import { SlimdownView, render } from 'mithril-ui-form';
import { Dashboards } from '../models';
import { MeiosisComponent } from '../services';
import tnoLogo from '../assets/tno_txt.svg';

const md = `#### Capability Assessment Tool

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
          '.flex-container',
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
    return [m('.row.markdown', m.trust(render(md))), m(Attribution, { state, actions })];
  },
});
