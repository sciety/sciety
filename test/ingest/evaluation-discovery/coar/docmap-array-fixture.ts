export const constructDocmapArrayWithActionDoiUnderTest = (actionDoi: string): JSON => JSON.parse(`[
  {
    "type": "docmap",
    "id": "https://neuro.peercommunityin.org/metadata/recommendation?article_id=217",
    "publisher": {
      "name": "Peer Community in Neuroscience",
      "url": "https://neuro.peercommunityin.org/about/"
    },
    "created": "2025-09-09T15:54:13",
    "updated": "2025-09-09T15:54:13",
    "first-step": "_:b0",
    "steps": {
      "_:b0": {
        "inputs": [],
        "actions": [
          {
            "participants": [
              {
                "actor": {
                  "type": "person",
                  "name": "Theo Desachy"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Marc Thevenet"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Samuel Garcia"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Anistasha Lightning"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Anne Didier"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Nathalie Mandairon"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Nicola Kuczewski"
                },
                "role": "author"
              }
            ],
            "outputs": [
              {
                "published": "2024-07-30T11:52:23",
                "doi": "https://doi.org/10.1101/2024.07.25.605060",
                "type": "preprint"
              }
            ],
            "inputs": []
          }
        ],
        "assertions": [
          {
            "status": "catalogued",
            "item": "https://doi.org/10.1101/2024.07.25.605060"
          }
        ],
        "next-step": "_:b1"
      },
      "_:b1": {
        "actions": [
          {
            "participants": [
              {
                "actor": {
                  "type": "person",
                  "name": "Amanda Almacellas Barbanoj"
                },
                "role": "author"
              }
            ],
            "outputs": [
              {
                "published": "2025-09-09T15:54:13",
                "doi": "${actionDoi}",
                "type": "editorial-decision"
              }
            ],
            "inputs": [
              {
                "published": "2024-07-30T11:52:23",
                "doi": "https://doi.org/10.1101/2024.07.25.605060",
                "type": "preprint"
              }
            ]
          },
          {
            "participants": [
              {
                "actor": {
                  "type": "person",
                  "name": "Georgie Mills"
                },
                "role": "author"
              }
            ],
            "outputs": [
              {
                "published": "2025-09-09T15:54:13",
                "doi": "10.24072/pci.neuro.100217",
                "type": "review"
              }
            ],
            "inputs": [
              {
                "published": "2024-07-30T11:52:23",
                "doi": "https://doi.org/10.1101/2024.07.25.605060",
                "type": "preprint"
              }
            ]
          },
          {
            "participants": [
              {
                "actor": {
                  "type": "person",
                  "name": "Anonymous reviewer"
                },
                "role": "author"
              }
            ],
            "outputs": [
              {
                "published": "2025-09-09T15:54:13",
                "doi": "10.24072/pci.neuro.100217",
                "type": "review"
              }
            ],
            "inputs": [
              {
                "published": "2024-07-30T11:52:23",
                "doi": "https://doi.org/10.1101/2024.07.25.605060",
                "type": "preprint"
              }
            ]
          },
          {
            "participants": [
              {
                "actor": {
                  "type": "person",
                  "name": "Daniel Lakens"
                },
                "role": "author"
              }
            ],
            "outputs": [
              {
                "published": "2025-09-09T15:54:13",
                "doi": "10.24072/pci.neuro.100217",
                "type": "review"
              }
            ],
            "inputs": [
              {
                "published": "2024-07-30T11:52:23",
                "doi": "https://doi.org/10.1101/2024.07.25.605060",
                "type": "preprint"
              }
            ]
          },
          {
            "participants": [
              {
                "actor": {
                  "type": "person",
                  "name": "James McCutcheon"
                },
                "role": "author"
              }
            ],
            "outputs": [
              {
                "published": "2025-09-09T15:54:13",
                "doi": "10.24072/pci.neuro.100217",
                "type": "review"
              }
            ],
            "inputs": [
              {
                "published": "2024-07-30T11:52:23",
                "doi": "https://doi.org/10.1101/2024.07.25.605060",
                "type": "preprint"
              }
            ]
          }
        ],
        "assertions": [
          {
            "status": "reviewed",
            "item": "https://doi.org/10.1101/2024.07.25.605060"
          }
        ],
        "inputs": [],
        "previous-step": "_:b0",
        "next-step": "_:b2"
      },
      "_:b3": {
        "actions": [
          {
            "participants": [
              {
                "actor": {
                  "type": "person",
                  "name": "Amanda Almacellas Barbanoj"
                },
                "role": "author"
              }
            ],
            "outputs": [
              {
                "published": "2025-09-09T15:54:13",
                "doi": "10.24072/pci.neuro.100217",
                "type": "editorial-decision"
              }
            ],
            "inputs": [
              {
                "published": "2025-01-07T15:36:54",
                "doi": "https://doi.org/10.1101/2024.07.25.605060 ",
                "type": "preprint"
              }
            ]
          },
          {
            "participants": [
              {
                "actor": {
                  "type": "person",
                  "name": "Daniel Lakens"
                },
                "role": "author"
              }
            ],
            "outputs": [
              {
                "published": "2025-09-09T15:54:13",
                "doi": "10.24072/pci.neuro.100217",
                "type": "review"
              }
            ],
            "inputs": [
              {
                "published": "2025-01-07T15:36:54",
                "doi": "https://doi.org/10.1101/2024.07.25.605060 ",
                "type": "preprint"
              }
            ]
          }
        ],
        "assertions": [
          {
            "status": "reviewed",
            "item": "https://doi.org/10.1101/2024.07.25.605060 "
          }
        ],
        "inputs": [],
        "previous-step": "_:b2",
        "next-step": "_:b4"
      },
      "_:b5": {
        "actions": [
          {
            "participants": [
              {
                "actor": {
                  "type": "person",
                  "name": "Amanda Almacellas Barbanoj"
                },
                "role": "author"
              }
            ],
            "outputs": [
              {
                "published": "2025-09-09T15:54:13",
                "doi": "10.24072/pci.neuro.100217",
                "type": "editorial-decision"
              }
            ],
            "inputs": [
              {
                "published": "2025-03-06T10:00:34",
                "doi": "https://doi.org/10.1101/2024.07.25.605060   ",
                "type": "preprint"
              }
            ]
          }
        ],
        "assertions": [
          {
            "status": "reviewed",
            "item": "https://doi.org/10.1101/2024.07.25.605060   "
          }
        ],
        "inputs": [],
        "previous-step": "_:b4",
        "next-step": "_:b6"
      },
      "_:b7": {
        "actions": [
          {
            "participants": [
              {
                "actor": {
                  "type": "person",
                  "name": "Amanda Almacellas Barbanoj"
                },
                "role": "author"
              }
            ],
            "outputs": [
              {
                "published": "2025-09-09T15:54:13",
                "doi": "10.24072/pci.neuro.100217",
                "type": "editorial-decision"
              }
            ],
            "inputs": [
              {
                "published": "2025-06-17T11:42:21",
                "doi": "https://doi.org/10.1101/2024.07.25.605060",
                "type": "preprint"
              }
            ]
          },
          {
            "participants": [
              {
                "actor": {
                  "type": "person",
                  "name": "Daniel Lakens"
                },
                "role": "author"
              }
            ],
            "outputs": [
              {
                "published": "2025-09-09T15:54:13",
                "doi": "10.24072/pci.neuro.100217",
                "type": "review"
              }
            ],
            "inputs": [
              {
                "published": "2025-06-17T11:42:21",
                "doi": "https://doi.org/10.1101/2024.07.25.605060",
                "type": "preprint"
              }
            ]
          }
        ],
        "assertions": [
          {
            "status": "reviewed",
            "item": "https://doi.org/10.1101/2024.07.25.605060"
          }
        ],
        "inputs": [],
        "previous-step": "_:b6",
        "next-step": "_:b8"
      },
      "_:b9": {
        "actions": [
          {
            "participants": [
              {
                "actor": {
                  "type": "person",
                  "name": "Amanda Almacellas Barbanoj"
                },
                "role": "author"
              }
            ],
            "outputs": [
              {
                "published": "2025-09-09T15:54:13",
                "doi": "10.24072/pci.neuro.100217",
                "type": "editorial-decision"
              }
            ],
            "inputs": [
              {
                "published": "2025-08-28T09:30:49",
                "doi": "https://doi.org/10.1101/2024.07.25.605060",
                "type": "preprint"
              }
            ]
          }
        ],
        "assertions": [
          {
            "status": "reviewed",
            "item": "https://doi.org/10.1101/2024.07.25.605060"
          }
        ],
        "inputs": [],
        "previous-step": "_:b8",
        "next-step": "_:b10"
      },
      "_:b2": {
        "inputs": [
          {
            "published": "2024-07-30T11:52:23",
            "doi": "https://doi.org/10.1101/2024.07.25.605060",
            "type": "preprint"
          }
        ],
        "actions": [
          {
            "participants": [
              {
                "actor": {
                  "type": "person",
                  "name": "Theo Desachy"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Marc Thevenet"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Samuel Garcia"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Anistasha Lightning"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Anne Didier"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Nathalie Mandairon"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Nicola Kuczewski"
                },
                "role": "author"
              }
            ],
            "outputs": [
              {
                "published": "2025-01-07T15:36:54",
                "doi": "https://doi.org/10.1101/2024.07.25.605060 ",
                "type": "preprint"
              }
            ],
            "inputs": []
          },
          {
            "participants": [
              {
                "actor": {
                  "type": "person",
                  "name": "Theo Desachy"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Marc Thevenet"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Samuel Garcia"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Anistasha Lightning"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Anne Didier"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Nathalie Mandairon"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Nicola Kuczewski"
                },
                "role": "author"
              }
            ],
            "outputs": [
              {
                "published": "2025-09-09T15:54:13",
                "doi": "10.24072/pci.neuro.100217",
                "type": "reply"
              }
            ],
            "inputs": []
          }
        ],
        "assertions": [
          {
            "status": "catalogued",
            "item": "https://doi.org/10.1101/2024.07.25.605060"
          }
        ],
        "previous-step": "_:b1",
        "next-step": "_:b3"
      },
      "_:b4": {
        "inputs": [
          {
            "published": "2025-01-07T15:36:54",
            "doi": "https://doi.org/10.1101/2024.07.25.605060 ",
            "type": "preprint"
          }
        ],
        "actions": [
          {
            "participants": [
              {
                "actor": {
                  "type": "person",
                  "name": "Theo Desachy"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Marc Thevenet"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Samuel Garcia"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Anistasha Lightning"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Anne Didier"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Nathalie Mandairon"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Nicola Kuczewski"
                },
                "role": "author"
              }
            ],
            "outputs": [
              {
                "published": "2025-03-06T10:00:34",
                "doi": "https://doi.org/10.1101/2024.07.25.605060   ",
                "type": "preprint"
              }
            ],
            "inputs": []
          },
          {
            "participants": [
              {
                "actor": {
                  "type": "person",
                  "name": "Theo Desachy"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Marc Thevenet"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Samuel Garcia"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Anistasha Lightning"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Anne Didier"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Nathalie Mandairon"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Nicola Kuczewski"
                },
                "role": "author"
              }
            ],
            "outputs": [
              {
                "published": "2025-09-09T15:54:13",
                "doi": "10.24072/pci.neuro.100217",
                "type": "reply"
              }
            ],
            "inputs": []
          }
        ],
        "assertions": [
          {
            "status": "catalogued",
            "item": "https://doi.org/10.1101/2024.07.25.605060 "
          }
        ],
        "previous-step": "_:b3",
        "next-step": "_:b5"
      },
      "_:b6": {
        "inputs": [
          {
            "published": "2025-03-06T10:00:34",
            "doi": "https://doi.org/10.1101/2024.07.25.605060   ",
            "type": "preprint"
          }
        ],
        "actions": [
          {
            "participants": [
              {
                "actor": {
                  "type": "person",
                  "name": "Theo Desachy"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Marc Thevenet"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Samuel Garcia"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Anistasha Lightning"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Anne Didier"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Nathalie Mandairon"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Nicola Kuczewski"
                },
                "role": "author"
              }
            ],
            "outputs": [
              {
                "published": "2025-06-17T11:42:21",
                "doi": "https://doi.org/10.1101/2024.07.25.605060",
                "type": "preprint"
              }
            ],
            "inputs": []
          },
          {
            "participants": [
              {
                "actor": {
                  "type": "person",
                  "name": "Theo Desachy"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Marc Thevenet"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Samuel Garcia"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Anistasha Lightning"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Anne Didier"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Nathalie Mandairon"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Nicola Kuczewski"
                },
                "role": "author"
              }
            ],
            "outputs": [
              {
                "published": "2025-09-09T15:54:13",
                "doi": "10.24072/pci.neuro.100217",
                "type": "reply"
              }
            ],
            "inputs": []
          }
        ],
        "assertions": [
          {
            "status": "catalogued",
            "item": "https://doi.org/10.1101/2024.07.25.605060   "
          }
        ],
        "previous-step": "_:b5",
        "next-step": "_:b7"
      },
      "_:b8": {
        "inputs": [
          {
            "published": "2025-06-17T11:42:21",
            "doi": "https://doi.org/10.1101/2024.07.25.605060",
            "type": "preprint"
          }
        ],
        "actions": [
          {
            "participants": [
              {
                "actor": {
                  "type": "person",
                  "name": "Theo Desachy"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Marc Thevenet"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Samuel Garcia"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Anistasha Lightning"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Anne Didier"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Nathalie Mandairon"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Nicola Kuczewski"
                },
                "role": "author"
              }
            ],
            "outputs": [
              {
                "published": "2025-08-28T09:30:49",
                "doi": "https://doi.org/10.1101/2024.07.25.605060",
                "type": "preprint"
              }
            ],
            "inputs": []
          },
          {
            "participants": [
              {
                "actor": {
                  "type": "person",
                  "name": "Theo Desachy"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Marc Thevenet"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Samuel Garcia"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Anistasha Lightning"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Anne Didier"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Nathalie Mandairon"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Nicola Kuczewski"
                },
                "role": "author"
              }
            ],
            "outputs": [
              {
                "published": "2025-09-09T15:54:13",
                "doi": "10.24072/pci.neuro.100217",
                "type": "reply"
              }
            ],
            "inputs": []
          }
        ],
        "assertions": [
          {
            "status": "catalogued",
            "item": "https://doi.org/10.1101/2024.07.25.605060"
          }
        ],
        "previous-step": "_:b7",
        "next-step": "_:b9"
      },
      "_:b10": {
        "inputs": [
          {
            "published": "2025-08-28T09:30:49",
            "doi": "https://doi.org/10.1101/2024.07.25.605060",
            "type": "preprint"
          }
        ],
        "actions": [
          {
            "participants": [
              {
                "actor": {
                  "type": "person",
                  "name": "Theo Desachy"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Marc Thevenet"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Samuel Garcia"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Anistasha Lightning"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Anne Didier"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Nathalie Mandairon"
                },
                "role": "author"
              },
              {
                "actor": {
                  "type": "person",
                  "name": "Nicola Kuczewski"
                },
                "role": "author"
              }
            ],
            "outputs": [
              {
                "published": "2025-10-23T00:00:00",
                "doi": "https://doi.org/10.24072/pcjournal.636",
                "type": "journal-article"
              }
            ],
            "inputs": []
          }
        ],
        "assertions": [
          {
            "status": "published",
            "item": "https://doi.org/10.24072/pcjournal.636"
          }
        ],
        "previous-step": "_:b9"
      }
    },
    "@context": "https://w3id.org/docmaps/context.jsonld"
  }
]`) as JSON;
