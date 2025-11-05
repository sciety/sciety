# Task 2a: Systems Architecture Diagram
## Co-design Sprint on Bonfire Features for Preprints

### Comprehensive System Architecture

```mermaid
graph TB
    subgraph "User Layer"
        R1[Researcher/Author]
        R2[Community Member]
        R3[Reader/Evaluator]
        R4[Moderator]
    end

    subgraph "Application Layer - Sciety Ecosystem"
        S[Sciety Platform<br/>Read-Only Aggregator]
        D[discussions.sciety.org<br/>Bonfire Instance]
        
        S -->|Display discussions| SD[Discussion Counters]
        S -->|Aggregate| EV[Preprint Evaluations]
        S -->|Link to| PP[Preprints via DOI]
    end

    subgraph "Bonfire Core Features"
        BA[Authentication & Identity]
        BC[Circles & Boundaries]
        BM[Moderation Tools]
        BT[Threading & Replies]
        BB[Badge System]
        BF[Federation Engine]
    end

    subgraph "Identity & Privacy Controls"
        OR[ORCID Integration]
        IP1[Public Profile]
        IP2[Pseudonymous<br/>Linked to ORCID]
        IP3[Fully Anonymous]
        
        OR --> IP1
        OR --> IP2
        IP3 -.->|No link| OR
    end

    subgraph "Scholarly Communication Protocols"
        AP[ActivityPub<br/>W3C Standard]
        CN[COAR Notify<br/>LDN + ActivityStreams2]
        DM[DocMaps<br/>JSON-LD]
        
        CN -->|Built on| AP
        DM -->|Represents| EE[Editorial Events]
    end

    subgraph "Archival Layer"
        ZEN[Zenodo API]
        ZDOI[DOI Minting]
        ZVER[Version Management]
        ZMETA[Metadata Registry]
        
        ZEN --> ZDOI
        ZEN --> ZVER
        ZEN --> ZMETA
    end

    subgraph "Federation Targets"
        M[Mastodon]
        BS[Bluesky<br/>via Bridgy Fed]
        FV[Other Fediverse<br/>Platforms]
    end

    subgraph "Data Models"
        PRE[Preprint<br/>DOI, Metadata]
        DISC[Discussion Thread<br/>Circle-scoped]
        EVAL[Evaluation/Review<br/>Badge/Comment]
        ARCH[Archived Discussion<br/>DOI, Timestamped]
    end

    %% User Interactions
    R1 -->|Discover preprint| S
    R1 -->|Start discussion| D
    R2 -->|Join circle| BC
    R2 -->|Add badge| BB
    R3 -->|Read & evaluate| S
    R4 -->|Moderate| BM

    %% Identity Flow
    R1 & R2 -->|Authenticate via| BA
    BA -->|Link to| OR
    OR -->|Choose privacy level| IP1 & IP2 & IP3

    %% Core Discussion Flow
    D -->|Create| BC
    BC -->|Contain| BT
    BC -->|Control visibility| BM
    BT -->|Quick evaluation| BB
    
    %% Protocol Integration
    D -->|Generate| AP
    D -->|Send notifications| CN
    BT & BB -->|Create DocMap| DM
    
    %% Sciety Integration
    CN -->|Notify| S
    DM -->|Index in| S
    AP -->|Display on| S
    
    %% Federation
    AP -->|Federate to| M & BS & FV
    BF -->|Distribute via| AP
    
    %% Archival Workflow
    R1 -->|Request archive| D
    D -->|Package discussion| ARCH
    ARCH -->|Deposit via| ZEN
    ZEN -->|Mint| ZDOI
    ZDOI -->|Link back to| S
    ZVER -->|Update on changes| S

    %% Data Relationships
    PP -->|Referenced in| DISC
    DISC -->|Contains| EVAL
    DISC -->|Can become| ARCH
    EV -->|Includes| DISC
    
    style S fill:#ff9900
    style D fill:#ff9900
    style ZEN fill:#0080ff
    style OR fill:#a6ce39
    style AP fill:#9370db
    style CN fill:#9370db
    style DM fill:#9370db
```

### System Context: Data Flow Overview

```mermaid
flowchart LR
    subgraph "Input Sources"
        PS[Preprint Servers<br/>arXiv, bioRxiv, etc.]
        U[Users/Researchers]
    end
    
    subgraph "Sciety-Bonfire Bridge"
        S[Sciety<br/>Aggregation]
        B[Bonfire<br/>Social Layer]
        P[Protocol Layer<br/>ActivityPub/COAR/DocMaps]
    end
    
    subgraph "Outputs"
        F[Fediverse]
        Z[Zenodo Archive]
        SC[Scholarly Record]
    end
    
    PS -->|DOI metadata| S
    U -->|Discover| S
    S -->|"Start Discussion" link| B
    B -->|Discussions & Badges| P
    P -->|COAR Notify| S
    P -->|DocMaps| S
    P -->|ActivityPub| F
    B -->|Archive request| Z
    Z -->|DOI reference| S
    S -->|Enhanced metadata| SC
    
    style S fill:#ff9900
    style B fill:#ff9900
    style P fill:#9370db
```

### Component Interaction: Protocol Details

```mermaid
sequenceDiagram
    participant U as User
    participant S as Sciety
    participant B as Bonfire
    participant O as ORCID
    participant AP as ActivityPub
    participant CN as COAR Notify
    participant DM as DocMaps
    participant Z as Zenodo
    participant F as Fediverse
    
    Note over U,F: Discovery & Setup
    U->>S: Browse preprint
    U->>B: Click "Start Discussion"
    B->>O: Authenticate
    O-->>B: Identity token
    B->>U: Choose privacy level
    U->>B: Create Circle (public/private)
    
    Note over U,F: Discussion Activity
    U->>B: Post comment/review
    B->>AP: Create ActivityPub Note
    B->>DM: Generate DocMap
    B->>CN: Send COAR Notify message
    
    Note over U,F: Federation
    AP->>F: Distribute to followers
    F-->>B: Replies from fediverse
    
    Note over U,F: Sciety Integration
    CN->>S: Notification of new discussion
    DM->>S: Structured evaluation metadata
    S->>S: Update discussion counter
    S->>U: Display on preprint page
    
    Note over U,F: Badge Engagement
    U->>B: Add emoji badge
    B->>DM: Update DocMap with badge
    DM->>S: Badge metadata
    S->>S: Aggregate badges
    
    Note over U,F: Archival Workflow
    U->>B: Request DOI for discussion
    B->>B: Package thread + metadata
    B->>Z: Create deposition
    Z->>Z: Mint DOI
    Z-->>B: DOI assigned
    B->>CN: Notify Sciety of archive
    CN->>S: Link archived DOI
    
    Note over U,F: Updates & Versioning
    U->>B: Continue discussion
    U->>B: Request updated archive
    B->>Z: Create new version
    Z->>Z: Mint version DOI
    Z-->>S: Update via COAR Notify
```

### Core User Journey: Researcher Discussion Workflow

```mermaid
flowchart TD
    Start([Researcher has preprint])
    
    Start --> DS[Discover preprint on Sciety]
    DS --> SD{Existing<br/>discussions?}
    
    SD -->|Yes| View[View discussions]
    SD -->|No| New[Start new discussion]
    
    View --> Join{Join existing<br/>circle?}
    Join -->|Yes| Auth
    Join -->|No| New
    
    New --> Auth[Authenticate via ORCID]
    Auth --> Privacy[Choose privacy level]
    
    Privacy --> P1[Public profile<br/>Full ORCID display]
    Privacy --> P2[Pseudonymous<br/>ORCID-linked ID]
    Privacy --> P3[Anonymous<br/>No ORCID link]
    
    P1 & P2 & P3 --> CreateCircle[Create Circle]
    
    CreateCircle --> SetBoundary{Set boundary}
    SetBoundary -->|Public now| Public[Public circle]
    SetBoundary -->|Private initially| Private[Private circle<br/>Can publish later]
    
    Public & Private --> Invite[Invite community members]
    Invite --> Discuss[Discussion happens]
    
    Discuss --> Engage{Engagement type}
    Engage -->|Quick signal| Badge[Add emoji badge]
    Engage -->|Detailed| Comment[Write comment/review]
    
    Badge --> DocMapB[Generate DocMap]
    Comment --> DocMapC[Generate DocMap]
    
    DocMapB & DocMapC --> Federate[Federate via ActivityPub]
    Federate --> NotifyS[COAR Notify → Sciety]
    NotifyS --> UpdateS[Sciety updates counter]
    
    UpdateS --> Archive{Want to<br/>archive?}
    Archive -->|Yes| Package[Package discussion]
    Archive -->|No| Continue[Continue discussion]
    
    Package --> Zenodo[Deposit to Zenodo]
    Zenodo --> MintDOI[Mint DOI]
    MintDOI --> LinkBack[Link DOI in Sciety]
    
    Continue --> MoreActivity{More<br/>activity?}
    MoreActivity -->|Yes| Discuss
    MoreActivity -->|No| UpdateArchive{Update<br/>archive?}
    
    UpdateArchive -->|Yes| Version[Create new version]
    UpdateArchive -->|No| End([Discussion complete])
    
    Version --> Zenodo
    LinkBack --> End
    
    style DS fill:#ff9900
    style UpdateS fill:#ff9900
    style Zenodo fill:#0080ff
    style Auth fill:#a6ce39
    style Federate fill:#9370db
```

### Privacy & Identity Architecture

```mermaid
graph TB
    subgraph "ORCID Authentication"
        OA[ORCID OAuth]
        OV[Verify researcher]
        OT[Issue token]
    end
    
    subgraph "Bonfire Identity Layer"
        BU[Bonfire User Account]
        OL[ORCID Link Storage]
        
        OL -->|encrypted| OM[ORCID mapping table]
    end
    
    subgraph "Privacy Modes"
        PM1[Mode 1: Public]
        PM2[Mode 2: Pseudonymous]
        PM3[Mode 3: Anonymous]
        
        PM1 -->|Display| PU1[Full name + ORCID iD]
        PM2 -->|Display| PU2[Pseudonym + ORCID badge]
        PM2 -->|Backend| PU2B[Linked for attribution]
        PM3 -->|Display| PU3[Generated pseudonym only]
        PM3 -->|Backend| PU3B[No ORCID connection]
    end
    
    subgraph "Circle Visibility"
        CV1[Public Circle]
        CV2[Private Circle]
        CV3[Unlisted Circle]
        
        CV1 -->|Visible to| Everyone
        CV2 -->|Visible to| Members[Members only]
        CV3 -->|Visible to| Link[Anyone with link]
    end
    
    subgraph "ActivityPub Federation"
        APF1[Federate public profiles]
        APF2[Pseudonymous federation]
        APF3[No federation for anonymous]
        
        APF1 -->|Include| ORCID_ID[ORCID iD in actor]
        APF2 -->|Include| Pseudo[Pseudonym in actor]
        APF2 -.->|Server knows| ORCIDLink[ORCID mapping]
        APF3 -->|Separate| NoLink[No attribution path]
    end
    
    subgraph "Zenodo Archive"
        ZA1[Public archive with ORCID]
        ZA2[Pseudonymous archive with ORCID]
        ZA3[Anonymous archive]
        
        ZA1 -->|Creator field| FullORCID[Full name + ORCID]
        ZA2 -->|Creator field| PseudoORCID[Pseudonym + ORCID]
        ZA3 -->|Creator field| AnonOnly[Pseudonym only]
    end
    
    %% Flows
    OA --> OV --> OT --> BU
    BU --> OL
    OL -->|User chooses| PM1 & PM2 & PM3
    
    PM1 -->|Posts in| CV1 & CV2 & CV3
    PM2 -->|Posts in| CV1 & CV2 & CV3
    PM3 -->|Posts in| CV1 & CV2 & CV3
    
    CV1 -->|Federates as| APF1 & APF2 & APF3
    
    PM1 -->|Archives as| ZA1
    PM2 -->|Archives as| ZA2
    PM3 -->|Archives as| ZA3
    
    style OA fill:#a6ce39
    style BU fill:#ff9900
    style CV1 fill:#90EE90
    style CV2 fill:#FFB6C1
    style ZA1 fill:#0080ff
    style ZA2 fill:#0080ff
```

### Protocol Integration: COAR Notify & DocMaps

```mermaid
graph TB
    subgraph "Bonfire Discussion Events"
        DE1[Discussion Created]
        DE2[Comment Added]
        DE3[Badge Added]
        DE4[Review Posted]
        DE5[Thread Archived]
    end
    
    subgraph "DocMaps Generation"
        DG[DocMaps Generator]
        
        DMStruct[DocMap Structure]
        DMStruct -->|Contains| DMInput[Initial Input: Preprint DOI]
        DMStruct -->|Contains| DMAssert[Assertions: reviewed, discussed]
        DMStruct -->|Contains| DMAction[Actions: review events]
        DMStruct -->|Contains| DMPartic[Participants: ORCIDs/pseudonyms]
        DMStruct -->|Contains| DMOutput[Outputs: discussion DOI if archived]
    end
    
    subgraph "COAR Notify Messages"
        CN[COAR Notify Generator]
        
        CNTypes[Message Types]
        CNTypes -->|1| CNReview[Review Request]
        CNTypes -->|2| CNEndorse[Endorsement]
        CNTypes -->|3| CNRelation[Relationship Announcement]
        CNTypes -->|4| CNAnnounce[Announcement]
        
        CNLDN[Linked Data Notification]
        CNLDN -->|Inbox| ScietyInbox[Sciety LDN Inbox]
        
        CNAS[ActivityStreams2 Payload]
    end
    
    subgraph "Sciety Processing"
        SI[Sciety Ingestion Service]
        
        SI -->|Parse| DocMapParser[DocMap Parser]
        SI -->|Parse| LDNParser[LDN Parser]
        
        DocMapParser -->|Extract| DiscMeta[Discussion Metadata]
        LDNParser -->|Extract| EventMeta[Event Metadata]
        
        DiscMeta -->|Update| PreprintPage[Preprint History]
        EventMeta -->|Update| DiscCounter[Discussion Counter]
        
        PreprintPage -->|Display| DiscLink[Link to Bonfire]
        PreprintPage -->|Display| ArchiveLink[Link to Zenodo DOI]
    end
    
    subgraph "Zenodo Integration"
        ZD[Zenodo Deposition]
        
        ZD -->|Metadata| ZMeta[Title, Description, DOI]
        ZD -->|Files| ZFiles[Thread export JSON/HTML]
        ZD -->|Related| ZRelated[Related preprint DOI]
        ZD -->|Creators| ZCreators[Participant ORCIDs]
        
        ZMeta -->|Publish| ZDOI[DOI Minted]
        ZDOI -->|Notify via| ZNotify[COAR Notify to Sciety]
    end
    
    %% Event Flows
    DE1 & DE2 & DE3 & DE4 --> DG
    DG -->|Generate| DMStruct
    
    DE1 & DE2 & DE3 & DE4 --> CN
    CN -->|Generate| CNTypes
    CNTypes -->|Format as| CNLDN & CNAS
    
    CNLDN -->|Send to| ScietyInbox
    DMStruct -->|Send to| SI
    
    DE5 -->|Trigger| ZD
    ZD -->|Create| ZDOI
    ZDOI -->|Triggers| ZNotify
    ZNotify -->|Update| SI
    
    style DG fill:#9370db
    style CN fill:#9370db
    style SI fill:#ff9900
    style ZD fill:#0080ff
```

### Badge System Architecture

```mermaid
graph LR
    subgraph "Badge Types"
        B1[Quality Badges]
        B2[Method Badges]
        B3[Outcome Badges]
        B4[Custom Badges]
        
        B1 -->|Examples| B1E[✓ Rigorous<br/>✓ Novel<br/>✓ Clear]
        B2 -->|Examples| B2E[⚙️ Reproducible<br/>⚙️ Well-designed<br/>⚙️ Sound methods]
        B3 -->|Examples| B3E[💡 Important<br/>💡 Surprising<br/>💡 Useful]
        B4 -->|Examples| B4E[Community-defined]
    end
    
    subgraph "Badge Actions"
        BA[User adds badge]
        BA -->|Triggers| BAA[ActivityPub activity]
        BA -->|Triggers| BAD[DocMap event]
        BA -->|Triggers| BAS[Sciety update]
    end
    
    subgraph "Badge Storage"
        BS[Bonfire Database]
        BS -->|Stores| BSU[User ID + Badge + Target]
        BS -->|Stores| BST[Timestamp]
        BS -->|Stores| BSC[Context: Circle/Thread]
    end
    
    subgraph "Badge Aggregation"
        BAG[Aggregate badges by type]
        BAG -->|Count| BAGC[Badge totals]
        BAG -->|Group by| BAGU[User profile]
        BAG -->|Weight by| BAGW[Community reputation]
    end
    
    subgraph "Badge Display"
        BDS[Display on Sciety]
        BDB[Display on Bonfire]
        BDF[Display in Fediverse]
        
        BDS -->|Show| Counts[Badge counts per preprint]
        BDB -->|Show| UserBadges[User's given badges]
        BDF -->|Show| BadgeActs[Badge as reaction]
    end
    
    subgraph "Badge Metadata"
        BMD[DocMap Badge Entry]
        BMD -->|action| ActionType[badge-added]
        BMD -->|actor| ActorID[ORCID or pseudonym]
        BMD -->|object| TargetDOI[Preprint DOI]
        BMD -->|badge_type| BadgeType[Quality/Method/etc]
        BMD -->|timestamp| Timestamp
    end
    
    B1 & B2 & B3 & B4 --> BA
    BA --> BS
    BS --> BAG
    BAG --> BDS & BDB & BDF
    BA --> BMD
    BMD -->|Included in| BAD
    
    style BA fill:#ff9900
    style BAG fill:#ff9900
    style BMD fill:#9370db
```

---

## Key Technical Decisions & Rationale

### 1. **Sciety as Read-Only Aggregator**
- **Decision**: Sciety handles no authentication, only displays aggregated content
- **Rationale**: Simplifies integration, avoids dual-login complexity
- **Impact**: All social features live in Bonfire

### 2. **ORCID-Linked Privacy Modes**
- **Decision**: Three privacy levels with granular ORCID control
- **Rationale**: Researchers need flexibility in professional identity disclosure
- **Impact**: Complex but essential for adoption

### 3. **Circle-Based Boundary Control**
- **Decision**: Discussions scoped to Circles with controllable visibility
- **Rationale**: Enables private→public workflows, community moderation
- **Impact**: Matches researcher needs for iterative disclosure

### 4. **Badge-First Engagement**
- **Decision**: Lightweight emoji badges as primary engagement mechanism
- **Rationale**: Time-constrained researchers prefer reactions over comments
- **Impact**: Higher engagement rates expected (50% vs 4.4% for comments)

### 5. **Optional Zenodo Archiving**
- **Decision**: User-triggered archival with DOI minting
- **Rationale**: Not all discussions merit permanent archival
- **Impact**: Enables scholarly citation when valuable

### 6. **DocMaps for Structured Metadata**
- **Decision**: Generate DocMaps for all evaluation activities
- **Rationale**: Machine-readable, aggregatable, standards-compliant
- **Impact**: Enables ecosystem interoperability

### 7. **COAR Notify for Sciety Integration**
- **Decision**: Use COAR Notify for Bonfire→Sciety communication
- **Rationale**: Scholarly communication standard, built on ActivityPub
- **Impact**: Future-proof for wider repository integration

### 8. **ActivityPub for Federation**
- **Decision**: Standard ActivityPub implementation
- **Rationale**: Enables cross-platform discussion, network effects
- **Impact**: Discussions visible across Mastodon, Bluesky, etc.

---

## Data Models

### Bonfire Discussion Object
```json
{
  "id": "https://discussions.sciety.org/discussion/abc123",
  "type": "Note",
  "attributedTo": {
    "type": "Person",
    "id": "https://discussions.sciety.org/users/researcher1",
    "orcid": "https://orcid.org/0000-0001-2345-6789",
    "displayMode": "public|pseudonymous|anonymous"
  },
  "context": "https://discussions.sciety.org/circles/circle123",
  "inReplyTo": "https://doi.org/10.1101/2024.01.01.123456",
  "content": "Discussion text...",
  "published": "2025-11-05T10:30:00Z",
  "badges": [
    {
      "type": "Badge",
      "badgeType": "rigorous",
      "addedBy": "https://orcid.org/0000-0001-2345-6789",
      "timestamp": "2025-11-05T10:35:00Z"
    }
  ]
}
```

### COAR Notify Message
```json
{
  "@context": [
    "https://www.w3.org/ns/activitystreams",
    "https://purl.org/coar/notify"
  ],
  "type": "Announce",
  "actor": {
    "id": "https://discussions.sciety.org",
    "name": "Sciety Discussions",
    "type": "Service"
  },
  "object": {
    "id": "https://discussions.sciety.org/discussion/abc123",
    "type": "coar-notify:ReviewAction",
    "object": "https://doi.org/10.1101/2024.01.01.123456",
    "context": "https://discussions.sciety.org/circles/circle123"
  },
  "target": {
    "id": "https://sciety.org/inbox",
    "type": "Service"
  },
  "published": "2025-11-05T10:30:00Z"
}
```

### DocMap Structure
```json
{
  "@context": "https://w3id.org/docmaps/context.jsonld",
  "id": "https://discussions.sciety.org/docmaps/abc123",
  "type": "docmap",
  "created": "2025-11-05T10:30:00Z",
  "updated": "2025-11-05T15:45:00Z",
  "publisher": {
    "id": "https://discussions.sciety.org",
    "name": "Sciety Discussions"
  },
  "first-step": "_:step1",
  "steps": {
    "_:step1": {
      "actions": [
        {
          "participants": [
            {
              "actor": {
                "type": "person",
                "name": "Researcher Name",
                "orcid": "https://orcid.org/0000-0001-2345-6789"
              },
              "role": "peer-reviewer"
            }
          ],
          "outputs": [
            {
              "type": "review",
              "doi": "https://doi.org/10.5281/zenodo.123456",
              "published": "2025-11-05T10:30:00Z",
              "content": [
                {
                  "type": "web-page",
                  "url": "https://discussions.sciety.org/discussion/abc123"
                }
              ]
            }
          ]
        }
      ],
      "inputs": [
        {
          "doi": "https://doi.org/10.1101/2024.01.01.123456",
          "type": "preprint"
        }
      ]
    }
  }
}
```

### Zenodo Deposition Metadata
```json
{
  "metadata": {
    "upload_type": "other",
    "description": "Community discussion of preprint: [Title]",
    "title": "Discussion: [Preprint Title]",
    "creators": [
      {
        "name": "Researcher Name",
        "affiliation": "Institution",
        "orcid": "0000-0001-2345-6789"
      }
    ],
    "access_right": "open",
    "license": "cc-by-4.0",
    "related_identifiers": [
      {
        "identifier": "10.1101/2024.01.01.123456",
        "relation": "isSupplementTo",
        "resource_type": "publication-preprint"
      }
    ],
    "communities": [
      {"identifier": "sciety"}
    ],
    "keywords": [
      "preprint review",
      "open science",
      "scholarly communication"
    ]
  }
}
```

---

## API Endpoints

### Bonfire → Sciety (COAR Notify)
```
POST https://sciety.org/inbox
Content-Type: application/ld+json

[COAR Notify LDN payload]
```

### Bonfire → Zenodo (Archival)
```
POST https://zenodo.org/api/deposit/depositions
Authorization: Bearer {token}
Content-Type: application/json

[Deposition metadata + files]
```

### Zenodo → Sciety (Archive Notification)
```
POST https://sciety.org/inbox
Content-Type: application/ld+json

[COAR Notify: new archive DOI linked to preprint]
```

### Sciety → Bonfire (Display)
```
GET https://discussions.sciety.org/api/discussions?preprint={doi}
Accept: application/ld+json

Returns: Array of discussion ActivityPub objects
```

---

## Implementation Priorities

### Phase 1: Core Integration (Weeks 1-4)
1. ORCID authentication in Bonfire
2. Circle creation with boundary controls
3. Basic ActivityPub federation
4. COAR Notify sender implementation
5. Sciety LDN inbox setup

### Phase 2: Rich Features (Weeks 5-8)
1. Badge system implementation
2. Privacy mode controls
3. DocMaps generation
4. Enhanced discussion threading
5. Sciety display integration

### Phase 3: Archival & Polish (Weeks 9-12)
1. Zenodo API integration
2. DOI minting workflow
3. Version management
4. Documentation
5. User testing with eLife Ambassadors

---

## Success Metrics

1. **Technical Integration**
   - 100% COAR Notify message validation
   - <1s ActivityPub federation latency
   - 99.9% Zenodo API success rate

2. **User Experience**
   - <3 clicks from Sciety to posting in Bonfire
   - <5 min Circle setup time
   - >70% badge engagement vs comments

3. **Scholarly Impact**
   - Discussions cited via Zenodo DOIs
   - ORCID profiles showing discussion contributions
   - Cross-platform visibility (Mastodon, Bluesky)

