/* eslint-disable no-irregular-whitespace */
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { crossrefMultipleWorksResponseCodec } from '../../../../src/third-parties/crossref/fetch-all-paper-expression/fetch-works-that-point-to-individual-works';

describe('crossrefMultipleWorksResponseCodec', () => {
  const crossrefResponse = `
    {
        "status": "ok",
        "message-type": "work-list",
        "message-version": "1.0.0",
        "message": {
          "facets": {},
          "total-results": 1,
          "items": [
            {
              "indexed": {
                "date-parts": [
                  [
                    2024,
                    1,
                    15
                  ]
                ],
                "date-time": "2024-01-15T23:30:19Z",
                "timestamp": 1705361419616
              },
              "reference-count": 92,
              "publisher": "Elsevier BV",
              "issue": "5",
              "license": [
                {
                  "start": {
                    "date-parts": [
                      [
                        2022,
                        5,
                        1
                      ]
                    ],
                    "date-time": "2022-05-01T00:00:00Z",
                    "timestamp": 1651363200000
                  },
                  "content-version": "tdm",
                  "delay-in-days": 0,
                  "URL": "https://www.elsevier.com/tdm/userlicense/1.0/"
                },
                {
                  "start": {
                    "date-parts": [
                      [
                        2022,
                        4,
                        13
                      ]
                    ],
                    "date-time": "2022-04-13T00:00:00Z",
                    "timestamp": 1649808000000
                  },
                  "content-version": "vor",
                  "delay-in-days": 0,
                  "URL": "http://creativecommons.org/licenses/by/4.0/"
                }
              ],
              "content-domain": {
                "domain": [
                  "cell.com",
                  "elsevier.com",
                  "sciencedirect.com"
                ],
                "crossmark-restriction": true
              },
              "short-container-title": [
                "Cell Reports"
              ],
              "published-print": {
                "date-parts": [
                  [
                    2022,
                    5
                  ]
                ]
              },
              "DOI": "10.1016/j.celrep.2022.110776",
              "type": "journal-article",
              "created": {
                "date-parts": [
                  [
                    2022,
                    5,
                    6
                  ]
                ],
                "date-time": "2022-05-06T04:20:28Z",
                "timestamp": 1651810828000
              },
              "page": "110776",
              "update-policy": "http://dx.doi.org/10.1016/elsevier_cm_policy",
              "source": "Crossref",
              "is-referenced-by-count": 18,
              "title": [
                "Cholesterol determines the cytosolic entry and seeded aggregation of tau"
              ],
              "prefix": "10.1016",
              "volume": "39",
              "author": [
                {
                  "given": "Benjamin J.",
                  "family": "Tuck",
                  "sequence": "first",
                  "affiliation": []
                },
                {
                  "given": "Lauren V.C.",
                  "family": "Miller",
                  "sequence": "additional",
                  "affiliation": []
                },
                {
                  "given": "Taxiarchis",
                  "family": "Katsinelos",
                  "sequence": "additional",
                  "affiliation": []
                },
                {
                  "given": "Annabel E.",
                  "family": "Smith",
                  "sequence": "additional",
                  "affiliation": []
                },
                {
                  "given": "Emma L.",
                  "family": "Wilson",
                  "sequence": "additional",
                  "affiliation": []
                },
                {
                  "given": "Sophie",
                  "family": "Keeling",
                  "sequence": "additional",
                  "affiliation": []
                },
                {
                  "given": "Shi",
                  "family": "Cheng",
                  "sequence": "additional",
                  "affiliation": []
                },
                {
                  "given": "Marina J.",
                  "family": "Vaysburd",
                  "sequence": "additional",
                  "affiliation": []
                },
                {
                  "given": "Claire",
                  "family": "Knox",
                  "sequence": "additional",
                  "affiliation": []
                },
                {
                  "given": "Lucy",
                  "family": "Tredgett",
                  "sequence": "additional",
                  "affiliation": []
                },
                {
                  "given": "Emmanouil",
                  "family": "Metzakopian",
                  "sequence": "additional",
                  "affiliation": []
                },
                {
                  "given": "Leo C.",
                  "family": "James",
                  "sequence": "additional",
                  "affiliation": []
                },
                {
                  "given": "William A.",
                  "family": "McEwan",
                  "sequence": "additional",
                  "affiliation": []
                }
              ],
              "member": "78",
              "reference": [
                {
                  "key": "10.1016/j.celrep.2022.110776_bib1",
                  "doi-asserted-by": "crossref",
                  "first-page": "1678",
                  "DOI": "10.1038/s41467-017-01575-4",
                  "article-title": "Discovery and characterization of stable and toxic Tau/phospholipid oligomeric complexes",
                  "volume": "8",
                  "author": "Ait-Bouziad",
                  "year": "2017",
                  "journal-title": "Nat. Commun."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib2",
                  "doi-asserted-by": "crossref",
                  "first-page": "9340",
                  "DOI": "10.1523/JNEUROSCI.22-21-09340.2002",
                  "article-title": "Abundant tau filaments and nonapoptotic neurodegeneration in transgenic mice expressing human P301S tau protein",
                  "volume": "22",
                  "author": "Allen",
                  "year": "2002",
                  "journal-title": "J. Neurosci."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib3",
                  "doi-asserted-by": "crossref",
                  "DOI": "10.3389/fnmol.2017.00382",
                  "article-title": "Intracellular cholesterol trafficking and impact in neurodegeneration",
                  "volume": "10",
                  "author": "Arenas",
                  "year": "2017",
                  "journal-title": "Front. Mol. Neurosci."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib4",
                  "doi-asserted-by": "crossref",
                  "first-page": "1741",
                  "DOI": "10.1038/nprot.2012.099",
                  "article-title": "Culturing pyramidal neurons from the early postnatal mouse hippocampus and cortex",
                  "volume": "7",
                  "author": "Beaudoin",
                  "year": "2012",
                  "journal-title": "Nat. Protoc."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib5",
                  "doi-asserted-by": "crossref",
                  "first-page": "1456",
                  "DOI": "10.1016/j.bpj.2019.03.016",
                  "article-title": "Cholesterol depletion by MβCD enhances cell membrane tension and its variations-reducing integrity",
                  "volume": "116",
                  "author": "Biswas",
                  "year": "2019",
                  "journal-title": "Biophys. J."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib6",
                  "doi-asserted-by": "crossref",
                  "first-page": "756",
                  "DOI": "10.3389/fneur.2018.00756",
                  "article-title": "24S-Hydroxycholesterol correlates with tau and is increased in cerebrospinal fluid in Parkinson’s disease and corticobasal syndrome",
                  "volume": "9",
                  "author": "Björkhem",
                  "year": "2018",
                  "journal-title": "Front. Neurol."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib7",
                  "doi-asserted-by": "crossref",
                  "first-page": "1176",
                  "DOI": "10.1016/j.celrep.2015.04.043",
                  "article-title": "Synaptic contacts enhance cell-to-cell tau pathology propagation",
                  "volume": "11",
                  "author": "Calafate",
                  "year": "2015",
                  "journal-title": "Cell Rep."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib8",
                  "doi-asserted-by": "crossref",
                  "first-page": "931",
                  "DOI": "10.1016/j.celrep.2016.09.063",
                  "article-title": "Loss of Bin1 promotes the propagation of tau pathology",
                  "volume": "17",
                  "author": "Calafate",
                  "year": "2016",
                  "journal-title": "Cell Rep."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib9",
                  "doi-asserted-by": "crossref",
                  "first-page": "18952",
                  "DOI": "10.1074/jbc.RA119.009432",
                  "article-title": "Compromised function of the ESCRT pathway promotes endolysosomal escape of tau seeds and propagation of tau aggregation",
                  "volume": "294",
                  "author": "Chen",
                  "year": "2019",
                  "journal-title": "J. Biol. Chem."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib10",
                  "doi-asserted-by": "crossref",
                  "first-page": "79",
                  "DOI": "10.1016/j.expneurol.2018.07.017",
                  "article-title": "Therapeutic efficacy of regulable GDNF expression for Huntington’s and Parkinson’s disease by a high-induction, background-free “GeneSwitch” vector",
                  "volume": "309",
                  "author": "Cheng",
                  "year": "2018",
                  "journal-title": "Exp. Neurol."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib11",
                  "doi-asserted-by": "crossref",
                  "first-page": "909",
                  "DOI": "10.1038/ncb1901",
                  "article-title": "Transmission and spreading of tauopathy in transgenic mouse brain",
                  "volume": "11",
                  "author": "Clavaguera",
                  "year": "2009",
                  "journal-title": "Nat. Cell Biol."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib12",
                  "doi-asserted-by": "crossref",
                  "first-page": "9535",
                  "DOI": "10.1073/pnas.1301175110",
                  "article-title": "Brain homogenates from human tauopathies induce tau inclusions in mouse brain",
                  "volume": "110",
                  "author": "Clavaguera",
                  "year": "2013",
                  "journal-title": "Proc. Natl. Acad. Sci. U S A"
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib13",
                  "doi-asserted-by": "crossref",
                  "first-page": "1692",
                  "DOI": "10.1016/j.cell.2017.10.033",
                  "article-title": "A method for the acute and rapid degradation of endogenous proteins",
                  "volume": "171",
                  "author": "Clift",
                  "year": "2017",
                  "journal-title": "Cell"
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib14",
                  "doi-asserted-by": "crossref",
                  "first-page": "45",
                  "DOI": "10.1186/s13024-019-0346-0",
                  "article-title": "Organotypic brain slice cultures to model neurodegenerative proteinopathies",
                  "volume": "14",
                  "author": "Croft",
                  "year": "2019",
                  "journal-title": "Mol. Neurodegener."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib15",
                  "doi-asserted-by": "crossref",
                  "first-page": "2183",
                  "DOI": "10.1007/s12035-020-02232-6",
                  "article-title": "Cholesterol metabolism in neurodegenerative diseases: molecular mechanisms and therapeutic targets",
                  "volume": "58",
                  "author": "Dai",
                  "year": "2021",
                  "journal-title": "Mol. Neurobiol."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib16",
                  "doi-asserted-by": "crossref",
                  "first-page": "563",
                  "DOI": "10.1111/jnc.15144",
                  "article-title": "Knockin’ on heaven’s door: molecular mechanisms of neuronal tau uptake",
                  "volume": "156",
                  "author": "De La-Rocque",
                  "year": "2021",
                  "journal-title": "J. Neurochem."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib17",
                  "doi-asserted-by": "crossref",
                  "first-page": "400",
                  "DOI": "10.1021/acschembio.5b00753",
                  "article-title": "NanoLuc complementation reporter optimized for accurate measurement of protein interactions in cells",
                  "volume": "11",
                  "author": "Dixon",
                  "year": "2016",
                  "journal-title": "ACS Chem. Biol."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib18",
                  "doi-asserted-by": "crossref",
                  "first-page": "1",
                  "DOI": "10.1007/978-1-59745-519-0_1",
                  "article-title": "A glance at the structural and functional diversity of membrane lipids",
                  "volume": "400",
                  "author": "Dopico",
                  "year": "2007",
                  "journal-title": "Methods Mol. Biol."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib19",
                  "doi-asserted-by": "crossref",
                  "first-page": "4565",
                  "DOI": "10.1113/JP270590",
                  "article-title": "Membrane lipid rafts and neurobiology: age-related changes in membrane lipids and loss of neuronal function",
                  "volume": "594",
                  "author": "Egawa",
                  "year": "2016",
                  "journal-title": "J. Physiol."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib20",
                  "doi-asserted-by": "crossref",
                  "first-page": "3612",
                  "DOI": "10.1016/j.celrep.2018.03.021",
                  "article-title": "Extracellular monomeric and aggregated tau efficiently enter human neurons through overlapping but distinct pathways",
                  "volume": "22",
                  "author": "Evans",
                  "year": "2018",
                  "journal-title": "Cell Rep."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib21",
                  "article-title": "Whole genome CRISPR screens identify LRRK2-regulated endocytosis as a major mechanism for extracellular tau uptake by human neurons",
                  "author": "Evans",
                  "year": "2020",
                  "journal-title": "bioRxiv"
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib22",
                  "author": "Falcon"
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib23",
                  "doi-asserted-by": "crossref",
                  "first-page": "2438",
                  "DOI": "10.1074/jbc.M117.809293",
                  "article-title": "Galectin-8-mediated selective autophagy protects against seeded tau aggregation",
                  "volume": "293",
                  "author": "Falcon",
                  "year": "2018",
                  "journal-title": "J. Biol. Chem."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib24",
                  "doi-asserted-by": "crossref",
                  "first-page": "629",
                  "DOI": "10.1007/s00401-017-1722-x",
                  "article-title": "Endocytic vesicle rupture is a conserved mechanism of cellular invasion by amyloid proteins",
                  "volume": "134",
                  "author": "Flavin",
                  "year": "2017",
                  "journal-title": "Acta Neuropathol."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib25",
                  "doi-asserted-by": "crossref",
                  "first-page": "12845",
                  "DOI": "10.1074/jbc.M808759200",
                  "article-title": "Propagation of tau misfolding from the outside to the inside of a cell",
                  "volume": "284",
                  "author": "Frost",
                  "year": "2009",
                  "journal-title": "J. Biol. Chem."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib26",
                  "doi-asserted-by": "crossref",
                  "first-page": "579",
                  "DOI": "10.1016/S0022-2275(20)31487-5",
                  "article-title": "Niemann-Pick C1 protein regulates cholesterol transport to the trans-Golgi network and plasma membrane caveolae",
                  "volume": "43",
                  "author": "Garver",
                  "year": "2002",
                  "journal-title": "J. Lipid Res."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib27",
                  "doi-asserted-by": "crossref",
                  "first-page": "159",
                  "DOI": "10.1016/0896-6273(92)90117-V",
                  "article-title": "Tau proteins of Alzheimer paired helical filaments: abnormal phosphorylation of all six brain isoforms",
                  "volume": "8",
                  "author": "Goedert",
                  "year": "1992",
                  "journal-title": "Neuron"
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib28",
                  "doi-asserted-by": "crossref",
                  "first-page": "189",
                  "DOI": "10.1146/annurev-neuro-072116-031153",
                  "article-title": "Propagation of tau aggregates and neurodegeneration",
                  "volume": "40",
                  "author": "Goedert",
                  "year": "2017",
                  "journal-title": "Annu. Rev. Neurosci."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib29",
                  "doi-asserted-by": "crossref",
                  "first-page": "2383",
                  "DOI": "10.1002/1873-3468.13108",
                  "article-title": "Tau filaments in neurodegenerative diseases",
                  "volume": "592",
                  "author": "Goedert",
                  "year": "2018",
                  "journal-title": "FEBS Lett."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib30",
                  "doi-asserted-by": "crossref",
                  "first-page": "1171",
                  "DOI": "10.1016/j.bbamem.2018.02.001",
                  "article-title": "Effect of 25-hydroxycholesterol in viral membrane fusion: insights on HIV inhibition",
                  "volume": "1860",
                  "author": "Gomes",
                  "year": "2018",
                  "journal-title": "Biochim. Biophys. Acta Biomembr."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib31",
                  "doi-asserted-by": "crossref",
                  "first-page": "333",
                  "DOI": "10.1007/s00441-009-0881-z",
                  "article-title": "Synaptogenesis of hippocampal neurons in primary cell culture",
                  "volume": "338",
                  "author": "Grabrucker",
                  "year": "2009",
                  "journal-title": "Cell Tissue Res."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib32",
                  "doi-asserted-by": "crossref",
                  "first-page": "73",
                  "DOI": "10.1016/0304-4157(89)90004-X",
                  "article-title": "Na+/H+ exchange and growth factor-induced cytosolic pH changes. Role in cellular proliferation",
                  "volume": "988",
                  "author": "Grinstein",
                  "year": "1989",
                  "journal-title": "Biochim. Biophys. Acta"
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib33",
                  "doi-asserted-by": "crossref",
                  "first-page": "e202010004",
                  "DOI": "10.1083/jcb.202010004",
                  "article-title": "VPS13D bridges the ER to mitochondria and peroxisomes via Miro",
                  "volume": "220",
                  "author": "Guillén-Samander",
                  "year": "2021",
                  "journal-title": "J. Cell Biol."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib34",
                  "doi-asserted-by": "crossref",
                  "first-page": "2635",
                  "DOI": "10.1084/jem.20160833",
                  "article-title": "Unique pathological tau conformers from Alzheimer’s brains transmit tau pathology in nontransgenic mice",
                  "volume": "213",
                  "author": "Guo",
                  "year": "2016",
                  "journal-title": "J. Exp. Med."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib35",
                  "doi-asserted-by": "crossref",
                  "first-page": "1088",
                  "DOI": "10.1038/ng.440",
                  "article-title": "Genome-wide association study identifies variants at CLU and PICALM associated with Alzheimer’s disease",
                  "volume": "41",
                  "author": "Harold",
                  "year": "2009",
                  "journal-title": "Nat. Genet."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib36",
                  "doi-asserted-by": "crossref",
                  "first-page": "E3138",
                  "DOI": "10.1073/pnas.1301440110",
                  "article-title": "Heparan sulfate proteoglycans mediate internalization and propagation of specific proteopathic seeds",
                  "volume": "110",
                  "author": "Holmes",
                  "year": "2013",
                  "journal-title": "Proc. Natl. Acad. Sci. U S A"
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib37",
                  "doi-asserted-by": "crossref",
                  "first-page": "1024",
                  "DOI": "10.1523/JNEUROSCI.2642-12.2013",
                  "article-title": "Synthetic tau fibrils mediate transmission of neurofibrillary tangles in a transgenic mouse model of Alzheimer’s-like tauopathy",
                  "volume": "33",
                  "author": "Iba",
                  "year": "2013",
                  "journal-title": "J. Neurosci."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib38",
                  "doi-asserted-by": "crossref",
                  "first-page": "433",
                  "DOI": "10.1042/bj3350433",
                  "article-title": "Effects of cholesterol depletion by cyclodextrin on the sphingolipid microdomains of the plasma membrane",
                  "volume": "335",
                  "author": "Ilangumaran",
                  "year": "1998",
                  "journal-title": "Biochem. J."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib39",
                  "doi-asserted-by": "crossref",
                  "first-page": "2039",
                  "DOI": "10.1016/j.celrep.2018.04.056",
                  "article-title": "Unconventional secretion mediates the trans-cellular spreading of tau",
                  "volume": "23",
                  "author": "Katsinelos",
                  "year": "2018",
                  "journal-title": "Cell Rep."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib40",
                  "doi-asserted-by": "crossref",
                  "first-page": "19440",
                  "DOI": "10.1074/jbc.M112.346072",
                  "article-title": "Trans-cellular propagation of Tau aggregation by fibrillar species",
                  "volume": "287",
                  "author": "Kfoury",
                  "year": "2012",
                  "journal-title": "J. Biol. Chem."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib41",
                  "article-title": "Dual fates of exogenous tau seeds: lysosomal clearance vs. cytoplasmic amplification",
                  "author": "Kolay",
                  "year": "2022",
                  "journal-title": "bioRxiv"
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib42",
                  "doi-asserted-by": "crossref",
                  "first-page": "1094",
                  "DOI": "10.1038/ng.439",
                  "article-title": "Genome-wide association study identifies variants at CLU and CR1 associated with Alzheimer’s disease",
                  "volume": "41",
                  "author": "Lambert",
                  "year": "2009",
                  "journal-title": "Nat. Genet."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib43",
                  "doi-asserted-by": "crossref",
                  "first-page": "e31302",
                  "DOI": "10.1371/journal.pone.0031302",
                  "article-title": "Trans-synaptic spread of tau pathology in vivo",
                  "volume": "7",
                  "author": "Liu",
                  "year": "2012",
                  "journal-title": "PLoS One"
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib44",
                  "doi-asserted-by": "crossref",
                  "first-page": "106",
                  "DOI": "10.1038/nrneurol.2012.263",
                  "article-title": "Apolipoprotein E and Alzheimer disease: risk, mechanisms, and therapy",
                  "volume": "9",
                  "author": "Liu",
                  "year": "2013",
                  "journal-title": "Nat. Rev. Neurol."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib45",
                  "doi-asserted-by": "crossref",
                  "first-page": "439",
                  "DOI": "10.1194/jlr.M080440",
                  "article-title": "25-Hydroxycholesterol activates the expression of cholesterol 25-hydroxylase in an LXR-dependent mechanism",
                  "volume": "59",
                  "author": "Liu",
                  "year": "2018",
                  "journal-title": "J. Lipid Res."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib46",
                  "doi-asserted-by": "crossref",
                  "first-page": "119",
                  "DOI": "10.1093/brain/118.1.119",
                  "article-title": "Neurofibrillary tangles in Niemann-Pick disease type C",
                  "volume": "118",
                  "author": "Love",
                  "year": "1995",
                  "journal-title": "Brain"
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib47",
                  "doi-asserted-by": "crossref",
                  "first-page": "e12932",
                  "DOI": "10.1111/acel.12932",
                  "article-title": "Age-associated cholesterol reduction triggers brain insulin resistance by facilitating ligand-independent receptor activation and pathway desensitization",
                  "volume": "18",
                  "author": "Martín-Segura",
                  "year": "2019",
                  "journal-title": "Aging Cell"
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib48",
                  "doi-asserted-by": "crossref",
                  "first-page": "a016758",
                  "DOI": "10.1101/cshperspect.a016758",
                  "article-title": "Clathrin-independent pathways of endocytosis",
                  "volume": "6",
                  "author": "Mayor",
                  "year": "2014",
                  "journal-title": "Cold Spring Harb. Perspect. Biol."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib49",
                  "doi-asserted-by": "crossref",
                  "first-page": "574",
                  "DOI": "10.1073/pnas.1607215114",
                  "article-title": "Cytosolic Fc receptor TRIM21 inhibits seeded tau aggregation",
                  "volume": "114",
                  "author": "McEwan",
                  "year": "2017",
                  "journal-title": "Proc. Natl. Acad. Sci. U S A"
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib50",
                  "doi-asserted-by": "crossref",
                  "first-page": "38445",
                  "DOI": "10.1074/jbc.M003180200",
                  "article-title": "Niemann-pick type C1 (NPC1) overexpression alters cellular cholesterol homeostasis",
                  "volume": "275",
                  "author": "Millard",
                  "year": "2000",
                  "journal-title": "J. Biol. Chem."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib51",
                  "doi-asserted-by": "crossref",
                  "first-page": "41",
                  "DOI": "10.1186/s40478-021-01141-6",
                  "article-title": "Tau assemblies do not behave like independently acting prion-like particles in mouse neural tissue",
                  "volume": "9",
                  "author": "Miller",
                  "year": "2021",
                  "journal-title": "Acta Neuropathol. Commun."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib52",
                  "doi-asserted-by": "crossref",
                  "first-page": "14893",
                  "DOI": "10.1074/jbc.M115.652693",
                  "article-title": "Tau trimers are the minimal propagation unit spontaneously internalized to seed intracellular aggregation",
                  "volume": "290",
                  "author": "Mirbaha",
                  "year": "2015",
                  "journal-title": "J. Biol. Chem."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib53",
                  "doi-asserted-by": "crossref",
                  "first-page": "99",
                  "DOI": "10.1186/s40478-017-0488-7",
                  "article-title": "What is the evidence that tau pathology spreads through prion-like propagation?",
                  "volume": "5",
                  "author": "Mudher",
                  "year": "2017",
                  "journal-title": "Acta Neuropathol. Commun."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib54",
                  "doi-asserted-by": "crossref",
                  "first-page": "2729",
                  "DOI": "10.1096/fj.201700359",
                  "article-title": "Amyloid precursor protein and endosomal-lysosomal dysfunction in Alzheimer’s disease: inseparable partners in a multifactorial disease",
                  "volume": "31",
                  "author": "Nixon",
                  "year": "2017",
                  "journal-title": "FASEB J."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib55",
                  "doi-asserted-by": "crossref",
                  "first-page": "14",
                  "DOI": "10.1159/000026149",
                  "article-title": "Serum Total Cholesterol, Apolipoprotein E {FC12}e4 Allele, and Alzheimer’s Disease",
                  "volume": "17",
                  "author": "Notkola",
                  "year": "1998",
                  "journal-title": "Neuroepidemiology"
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib56",
                  "doi-asserted-by": "crossref",
                  "first-page": "2889",
                  "DOI": "10.1016/j.celrep.2016.08.028",
                  "article-title": "Aging triggers a repressive chromatin state at bdnf promoters in hippocampal neurons",
                  "volume": "16",
                  "author": "Palomer",
                  "year": "2016",
                  "journal-title": "Cell Rep."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib57",
                  "doi-asserted-by": "crossref",
                  "first-page": "27",
                  "DOI": "10.1016/S0022-3956(01)00050-4",
                  "article-title": "24S-hydroxycholesterol in cerebrospinal fluid is elevated in early stages of dementia",
                  "volume": "36",
                  "author": "Papassotiropoulos",
                  "year": "2002",
                  "journal-title": "J. Psychiatr. Res."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib58",
                  "doi-asserted-by": "crossref",
                  "first-page": "313",
                  "DOI": "10.1002/humu.10255",
                  "article-title": "Identification of 58 novel mutations in Niemann-Pick disease type C: correlation with biochemical phenotype and importance of PTC1-like domains in NPC1",
                  "volume": "22",
                  "author": "Park",
                  "year": "2003",
                  "journal-title": "Hum. Mutat."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib59",
                  "doi-asserted-by": "crossref",
                  "first-page": "803",
                  "DOI": "10.1016/j.stemcr.2017.02.016",
                  "article-title": "Inducible and deterministic forward programming of human pluripotent stem cells into neurons, skeletal myocytes, and oligodendrocytes",
                  "volume": "8",
                  "author": "Pawlowski",
                  "year": "2017",
                  "journal-title": "Stem Cell Rep."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib60",
                  "doi-asserted-by": "crossref",
                  "article-title": "Exosomal and vesicle-free tau seeds - propagation and convergence in endolysosomal permeabilization",
                  "author": "Polanco",
                  "year": "2021",
                  "journal-title": "FEBS J.",
                  "DOI": "10.1111/febs.16055"
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib61",
                  "doi-asserted-by": "crossref",
                  "first-page": "6382",
                  "DOI": "10.1038/s41598-018-24904-z",
                  "article-title": "Tau internalization is regulated by 6-O sulfation on heparan sulfate proteoglycans (HSPGs)",
                  "volume": "8",
                  "author": "Rauch",
                  "year": "2018",
                  "journal-title": "Sci. Rep."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib62",
                  "doi-asserted-by": "crossref",
                  "first-page": "381",
                  "DOI": "10.1038/s41586-020-2156-5",
                  "article-title": "LRP1 is a master regulator of tau uptake and spread",
                  "volume": "580",
                  "author": "Rauch",
                  "year": "2020",
                  "journal-title": "Nature"
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib63",
                  "doi-asserted-by": "crossref",
                  "first-page": "575",
                  "DOI": "10.1016/0896-6273(93)90070-8",
                  "article-title": "Apolipoprotein E in sporadic Alzheimer’s disease: allelic variation and receptor interactions",
                  "volume": "11",
                  "author": "William Rebeck",
                  "year": "1993",
                  "journal-title": "Neuron"
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib64",
                  "doi-asserted-by": "crossref",
                  "first-page": "1271",
                  "DOI": "10.1016/j.neuron.2014.04.047",
                  "article-title": "Distinct tau prion strains propagate in cells and mice and define different tauopathies",
                  "volume": "82",
                  "author": "Sanders",
                  "year": "2014",
                  "journal-title": "Neuron"
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib65",
                  "doi-asserted-by": "crossref",
                  "first-page": "676",
                  "DOI": "10.1038/nmeth.2019",
                  "article-title": "Fiji: an open-source platform for biological-image analysis",
                  "volume": "9",
                  "author": "Schindelin",
                  "year": "2012",
                  "journal-title": "Nat. Methods"
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib66",
                  "doi-asserted-by": "crossref",
                  "first-page": "523",
                  "DOI": "10.1038/nature24016",
                  "article-title": "ApoE4 markedly exacerbates tau-mediated neurodegeneration in a mouse model of tauopathy",
                  "volume": "549",
                  "author": "Shi",
                  "year": "2017",
                  "journal-title": "Nature"
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib67",
                  "doi-asserted-by": "crossref",
                  "first-page": "2546",
                  "DOI": "10.1084/jem.20190980",
                  "article-title": "Microglia drive APOE-dependent neurodegeneration in a tauopathy mouse model",
                  "volume": "216",
                  "author": "Shi",
                  "year": "2019",
                  "journal-title": "J. Exp. Med."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib68",
                  "doi-asserted-by": "crossref",
                  "first-page": "e99871",
                  "DOI": "10.15252/embj.201899871",
                  "article-title": "Clustering of Tau fibrils impairs the synaptic composition of α3-Na+/K+-ATPase and AMPA receptors",
                  "volume": "38",
                  "author": "Shrivastava",
                  "year": "2019",
                  "journal-title": "EMBO J."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib69",
                  "doi-asserted-by": "crossref",
                  "first-page": "100636",
                  "DOI": "10.1016/j.jbc.2021.100636",
                  "article-title": "PIKfyve activity is required for lysosomal trafficking of tau aggregates and tau seeding",
                  "volume": "296",
                  "author": "Soares",
                  "year": "2021",
                  "journal-title": "J. Biol. Chem."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib70",
                  "doi-asserted-by": "crossref",
                  "first-page": "294",
                  "DOI": "10.1186/1756-0500-3-294",
                  "article-title": "REAP: a two minute cell fractionation method",
                  "volume": "3",
                  "author": "Suzuki",
                  "year": "2010",
                  "journal-title": "BMC Res. Notes"
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib71",
                  "doi-asserted-by": "crossref",
                  "first-page": "470",
                  "DOI": "10.1001/jamaneurol.2019.4421",
                  "article-title": "Association of apolipoprotein E ε4 with medial temporal tau independent of amyloid-β",
                  "volume": "77",
                  "author": "Therriault",
                  "year": "2020",
                  "journal-title": "JAMA Neurol."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib72",
                  "doi-asserted-by": "crossref",
                  "first-page": "6992",
                  "DOI": "10.1038/s41380-019-0453-x",
                  "article-title": "VPS35 regulates tau phosphorylation and neuropathology in tauopathy",
                  "volume": "26",
                  "author": "Vagnozzi",
                  "year": "2019",
                  "journal-title": "Mol. Psychiatry"
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib73",
                  "doi-asserted-by": "crossref",
                  "first-page": "165",
                  "DOI": "10.1016/j.pneurobio.2006.09.005",
                  "article-title": "Cholesterol dysfunction in neurodegenerative diseases: is Huntington’s disease in the list?",
                  "volume": "80",
                  "author": "Valenza",
                  "year": "2006",
                  "journal-title": "Prog. Neurobiol."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib74",
                  "doi-asserted-by": "crossref",
                  "first-page": "363",
                  "DOI": "10.1016/j.stem.2018.12.013",
                  "article-title": "Cholesterol metabolism is a druggable axis that independently regulates tau and amyloid-β in iPSC-derived Alzheimer’s disease neurons",
                  "volume": "24",
                  "author": "van der Kant",
                  "year": "2019",
                  "journal-title": "Cell Stem Cell"
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib75",
                  "doi-asserted-by": "crossref",
                  "first-page": "21",
                  "DOI": "10.1038/s41583-019-0240-3",
                  "article-title": "Amyloid-β-independent regulators of tau pathology in Alzheimer disease",
                  "volume": "21",
                  "author": "van der Kant",
                  "year": "2020",
                  "journal-title": "Nat. Rev. Neurosci."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib76",
                  "first-page": "746",
                  "article-title": "Dysregulation of cholesterol balance in the brain: contribution to neurodegenerative diseases",
                  "volume": "5",
                  "author": "Vance",
                  "year": "2012",
                  "journal-title": "Dis. Model Mech."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib77",
                  "first-page": "118",
                  "article-title": "Genetic heterogeneity in Niemann-Pick C disease: a study using somatic cell hybridization and linkage analysis",
                  "volume": "58",
                  "author": "Vanier",
                  "year": "1996",
                  "journal-title": "Am. J. Hum. Genet."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib78",
                  "doi-asserted-by": "crossref",
                  "DOI": "10.3389/fnins.2018.00389",
                  "article-title": "Image-based profiling of synaptic connectivity in primary neuronal cell culture",
                  "volume": "12",
                  "author": "Verstraelen",
                  "year": "2018",
                  "journal-title": "Front. Neurosci."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib79",
                  "doi-asserted-by": "crossref",
                  "first-page": "162",
                  "DOI": "10.1016/j.ajhg.2011.06.001",
                  "article-title": "VPS35 mutations in Parkinson disease",
                  "volume": "89",
                  "author": "Vilariño-Güell",
                  "year": "2011",
                  "journal-title": "Am. J. Hum. Genet."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib80",
                  "doi-asserted-by": "crossref",
                  "first-page": "R93",
                  "DOI": "10.1186/ar1964",
                  "article-title": "Inhibition of macropinocytosis blocks antigen presentation of type II collagen in vitro and in vivo in HLA-DR1 transgenic mice",
                  "volume": "8",
                  "author": "von Delwig",
                  "year": "2006",
                  "journal-title": "Arthritis Res. Ther."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib81",
                  "doi-asserted-by": "crossref",
                  "first-page": "1252",
                  "DOI": "10.1038/s41467-021-21525-5",
                  "article-title": "An ESCRT-dependent step in fatty acid transfer from lipid droplets to mitochondria through VPS13D-TSG101 interactions",
                  "volume": "12",
                  "author": "Wang",
                  "year": "2021",
                  "journal-title": "Nat. Commun."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib82",
                  "doi-asserted-by": "crossref",
                  "first-page": "1163",
                  "DOI": "10.1111/jnc.13866",
                  "article-title": "Formation, release, and internalization of stable tau oligomers in cells",
                  "volume": "139",
                  "author": "Wegmann",
                  "year": "2016",
                  "journal-title": "J. Neurochem."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib83",
                  "doi-asserted-by": "crossref",
                  "first-page": "765",
                  "DOI": "10.1083/jcb.201105109",
                  "article-title": "VPS35 haploinsufficiency increases Alzheimer’s disease neuropathology",
                  "volume": "195",
                  "author": "Wen",
                  "year": "2011",
                  "journal-title": "J. Cell Biol."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib84",
                  "doi-asserted-by": "crossref",
                  "first-page": "E8187",
                  "DOI": "10.1073/pnas.1616344113",
                  "article-title": "Tau prions from Alzheimer’s disease and chronic traumatic encephalopathy patients propagate in cultured cells",
                  "volume": "113",
                  "author": "Woerman",
                  "year": "2016",
                  "journal-title": "Proc. Natl. Acad. Sci. U S A"
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib85",
                  "author": "Wu"
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib86",
                  "doi-asserted-by": "crossref",
                  "first-page": "1856",
                  "DOI": "10.1074/jbc.M112.394528",
                  "article-title": "Small misfolded Tau species are internalized via bulk endocytosis and anterogradely and retrogradely transported in neurons",
                  "volume": "288",
                  "author": "Wu",
                  "year": "2013",
                  "journal-title": "J. Biol. Chem."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib87",
                  "doi-asserted-by": "crossref",
                  "first-page": "1085",
                  "DOI": "10.1038/nn.4328",
                  "article-title": "Neuronal activity enhances tau propagation and tau pathology in vivo",
                  "volume": "19",
                  "author": "Wu",
                  "year": "2016",
                  "journal-title": "Nat. Neurosci."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib88",
                  "doi-asserted-by": "crossref",
                  "first-page": "17707",
                  "DOI": "10.1016/S0021-9258(19)47429-2",
                  "article-title": "Bafilomycin A1, a specific inhibitor of vacuolar-type H(+)-ATPase, inhibits acidification and protein degradation in lysosomes of cultured cells",
                  "volume": "266",
                  "author": "Yoshimori",
                  "year": "1991",
                  "journal-title": "J. Biol. Chem."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib89",
                  "doi-asserted-by": "crossref",
                  "first-page": "27296",
                  "DOI": "10.1074/jbc.M503922200",
                  "article-title": "Neurodegeneration in heterozygous niemann-pick type C1 (NPC1) mouse",
                  "volume": "280",
                  "author": "Yu",
                  "year": "2005",
                  "journal-title": "J. Biol. Chem."
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib90",
                  "doi-asserted-by": "crossref",
                  "first-page": "32105",
                  "DOI": "10.1073/pnas.2012197117",
                  "article-title": "Cholesterol 25-hydroxylase suppresses SARS-CoV-2 replication by blocking membrane fusion",
                  "volume": "117",
                  "author": "Zang",
                  "year": "2020",
                  "journal-title": "Proc. Natl. Acad. Sci. U S A"
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib91",
                  "doi-asserted-by": "crossref",
                  "first-page": "e43584",
                  "DOI": "10.7554/eLife.43584",
                  "article-title": "Heparin-induced tau filaments are polymorphic and differ from those in Alzheimer’s and Pick’s diseases",
                  "volume": "8",
                  "author": "Zhang",
                  "year": "2019",
                  "journal-title": "eLife"
                },
                {
                  "key": "10.1016/j.celrep.2022.110776_bib92",
                  "doi-asserted-by": "crossref",
                  "first-page": "4388",
                  "DOI": "10.1038/s41467-018-06783-0",
                  "article-title": "APOE ε2 is associated with increased tau pathology in primary tauopathy",
                  "volume": "9",
                  "author": "Zhao",
                  "year": "2018",
                  "journal-title": "Nat. Commun."
                }
              ],
              "container-title": [
                "Cell Reports"
              ],
              "language": "en",
              "link": [
                {
                  "URL": "https://api.elsevier.com/content/article/PII:S221112472200540X?httpAccept=text/xml",
                  "content-type": "text/xml",
                  "content-version": "vor",
                  "intended-application": "text-mining"
                },
                {
                  "URL": "https://api.elsevier.com/content/article/PII:S221112472200540X?httpAccept=text/plain",
                  "content-type": "text/plain",
                  "content-version": "vor",
                  "intended-application": "text-mining"
                }
              ],
              "deposited": {
                "date-parts": [
                  [
                    2022,
                    10,
                    26
                  ]
                ],
                "date-time": "2022-10-26T15:22:04Z",
                "timestamp": 1666797724000
              },
              "score": 0.0,
              "resource": {
                "primary": {
                  "URL": "https://linkinghub.elsevier.com/retrieve/pii/S221112472200540X"
                }
              },
              "issued": {
                "date-parts": [
                  [
                    2022,
                    5
                  ]
                ]
              },
              "references-count": 92,
              "journal-issue": {
                "issue": "5",
                "published-print": {
                  "date-parts": [
                    [
                      2022,
                      5
                    ]
                  ]
                }
              },
              "alternative-id": [
                "S221112472200540X"
              ],
              "URL": "http://dx.doi.org/10.1016/j.celrep.2022.110776",
              "relation": {
                "has-preprint": [
                  {
                    "id-type": "doi",
                    "id": "10.1101/2021.06.21.449238",
                    "asserted-by": "object"
                  }
                ]
              },
              "ISSN": [
                "2211-1247"
              ],
              "issn-type": [
                {
                  "value": "2211-1247",
                  "type": "print"
                }
              ],
              "subject": [
                "General Biochemistry, Genetics and Molecular Biology"
              ],
              "published": {
                "date-parts": [
                  [
                    2022,
                    5
                  ]
                ]
              },
              "assertion": [
                {
                  "value": "Elsevier",
                  "name": "publisher",
                  "label": "This article is maintained by"
                },
                {
                  "value": "Cholesterol determines the cytosolic entry and seeded aggregation of tau",
                  "name": "articletitle",
                  "label": "Article Title"
                },
                {
                  "value": "Cell Reports",
                  "name": "journaltitle",
                  "label": "Journal Title"
                },
                {
                  "value": "https://doi.org/10.1016/j.celrep.2022.110776",
                  "name": "articlelink",
                  "label": "CrossRef DOI link to publisher maintained version"
                },
                {
                  "value": "article",
                  "name": "content_type",
                  "label": "Content Type"
                },
                {
                  "value": "© 2022 The Authors.",
                  "name": "copyright",
                  "label": "Copyright"
                }
              ],
              "article-number": "110776"
            }
          ],
          "items-per-page": 20,
          "query": {
            "start-index": 0,
            "search-terms": null
          }
        }
      }
    `;

  describe('given a valid crossref response', () => {
    const result = pipe(
      crossrefResponse,
      crossrefMultipleWorksResponseCodec.decode,
    );

    it.failing('decodes successfully', () => {
      expect(E.isRight(result)).toBe(true);
    });
  });
});
