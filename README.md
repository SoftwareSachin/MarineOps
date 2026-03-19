# Marine Vessel Operations - System Architecture Diagram

## Current Implementation vs PRD Requirements

```mermaid
graph TB
    subgraph "CURRENT IMPLEMENTATION (15% Complete)"
        A[React Dashboard] --> B[Express Server]
        B --> C[PostgreSQL Database]
        B --> D[WebSocket Real-time Updates]
        D --> E[Mock Data Generator]
    end
    
    subgraph "MISSING CORE COMPONENTS (85% Required)"
        F[Digital Twin Simulation Engine]
        G[Deep Learning Models]
        H[Kafka Data Pipeline]
        I[ML Inference Engine]
        J[Security Framework]
    end
    
    style F fill:#ffcccc
    style G fill:#ffcccc
    style H fill:#ffcccc
    style I fill:#ffcccc
    style J fill:#ffcccc
```

## Complete Target Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React Dashboard]
        UI --> |WebSocket| WS[WebSocket Client]
        UI --> |REST API| API[API Gateway]
    end
    
    subgraph "Digital Twin Layer"
        DT[Digital Twin Engine]
        DT --> |Physics Simulation| PS[Propulsion System]
        DT --> |Hydrodynamics| HD[Hull Dynamics]
        DT --> |Environmental Sim| ES[Weather/Waves]
        DT --> |Synthetic Data| SD[Data Generator]
    end
    
    subgraph "Data Pipeline Layer"
        K[Kafka Broker]
        K --> |Raw Data| DP[Data Preprocessing]
        DP --> |Features| FE[Feature Extraction]
        FE --> |Validated Data| VD[Data Validation]
    end
    
    subgraph "AI/ML Layer"
        CNN[CNN Models<br/>Spatial Analysis]
        RNN[RNN/LSTM Models<br/>Temporal Prediction]
        ML[Model Training Pipeline]
        INF[ML Inference Engine]
        
        CNN --> |Propeller/Hull Analysis| INF
        RNN --> |Time Series Prediction| INF
        ML --> |Trained Models| INF
    end
    
    subgraph "Backend Services"
        MS[Microservices]
        MS --> |Alerts| AS[Alert Service]
        MS --> |Maintenance| MSVC[Maintenance Service]
        MS --> |Analytics| ANS[Analytics Service]
        MS --> |Prediction| PSVC[Prediction Service]
    end
    
    subgraph "Infrastructure Layer"
        DB[(PostgreSQL)]
        REDIS[(Redis Cache)]
        MON[Monitoring]
        LOG[Logging]
        SEC[Security Layer]
    end
    
    subgraph "External Systems"
        VES[Marine Vessels]
        SENS[Physical Sensors]
        NAV[Navigation Systems]
    end
    
    %% Data Flow Connections
    DT --> |Synthetic Telemetry| K
    VES --> |Real Telemetry| K
    SENS --> |Sensor Data| K
    NAV --> |Navigation Data| K
    
    K --> DP
    DP --> FE
    FE --> VD
    VD --> INF
    
    INF --> |Predictions| MS
    MS --> API
    API --> UI
    
    MS --> DB
    MS --> REDIS
    
    SEC --> |Encryption/Auth| MS
    SEC --> |Encryption/Auth| API
    
    MON --> |Metrics| MS
    LOG --> |Logs| MS
    
    %% Model Training Flow
    SD --> |Training Data| ML
    VD --> |Training Data| ML
    
    %% WebSocket Updates
    WS --> |Real-time Updates| UI
    MS --> |Live Data| WS
```

## Microservices Architecture

```mermaid
graph LR
    subgraph "Core Services"
        A[Vessel Service]
        B[Performance Service]
        C[Alert Service]
        D[Maintenance Service]
        E[Environmental Service]
    end
    
    subgraph "ML Services"
        F[Prediction Service]
        G[Anomaly Detection Service]
        H[Optimization Service]
        I[Model Training Service]
    end
    
    subgraph "Data Services"
        J[Data Ingestion Service]
        K[Data Processing Service]
        L[Feature Engineering Service]
        M[Model Serving Service]
    end
    
    subgraph "Support Services"
        N[Authentication Service]
        O[Notification Service]
        P[Audit Service]
        Q[Configuration Service]
    end
    
    %% Service Communication
    A --> B
    B --> F
    C --> G
    D --> H
    E --> J
    
    J --> K
    K --> L
    L --> M
    
    F --> M
    G --> M
    H --> M
    
    N --> A
    N --> B
    N --> C
    N --> D
    
    O --> C
    P --> Q
```

## Data Flow Architecture

```mermaid
sequenceDiagram
    participant V as Marine Vessel
    participant DT as Digital Twin
    participant K as Kafka
    participant DP as Data Processing
    participant ML as ML Models
    participant API as API Gateway
    participant UI as Dashboard
    
    V->>K: Real Telemetry
    DT->>K: Synthetic Data
    
    K->>DP: Raw Data Stream
    DP->>DP: Preprocessing
    DP->>DP: Feature Extraction
    DP->>ML: Processed Data
    
    ML->>ML: Inference
    ML->>API: Predictions
    
    API->>UI: REST Response
    API->>UI: WebSocket Updates
    
    UI->>V: Control Commands
    UI->>DT: Simulation Requests
```

## Technology Stack

```mermaid
graph TB
    subgraph "Frontend"
        React[React.js]
        TS[TypeScript]
        Tailwind[Tailwind CSS]
        Shadcn[Shadcn/UI]
        Charts[Recharts]
    end
    
    subgraph "Backend"
        Node[Node.js]
        Express[Express.js]
        TS2[TypeScript]
        WebSocket[WebSocket]
    end
    
    subgraph "AI/ML"
        Python[Python 3.8+]
        TF[TensorFlow]
        PyTorch[PyTorch]
        Scikit[Scikit-learn]
        OpenCV[OpenCV]
    end
    
    subgraph "Data Pipeline"
        Kafka[Apache Kafka]
        Redis[Redis]
        PostgreSQL[PostgreSQL]
        Drizzle[Drizzle ORM]
    end
    
    subgraph "Infrastructure"
        Docker[Docker]
        K8s[Kubernetes]
        Nginx[Nginx]
        Monitor[Prometheus/Grafana]
    end
    
    subgraph "Security"
        TLS[TLS/SSL]
        JWT[JWT Auth]
        RBAC[Role-Based Access]
        Audit[Audit Logging]
    end
```

## Security Architecture

```mermaid
graph TB
    subgraph "Security Layers"
        FW[Firewall/WAF]
        LB[Load Balancer]
        TLS[TLS Termination]
        AUTH[Authentication]
        AUTHZ[Authorization]
        AUDIT[Audit Logging]
        ENC[Encryption at Rest]
    end
    
    subgraph "Data Protection"
        PII[PII Protection]
        GDPR[GDPR Compliance]
        MASK[Data Masking]
        BACKUP[Secure Backups]
    end
    
    subgraph "Network Security"
        VPC[VPC Isolation]
        SG[Security Groups]
        VPN[VPN Access]
        IAM[IAM Roles]
    end
    
    FW --> LB
    LB --> TLS
    TLS --> AUTH
    AUTH --> AUTHZ
    AUTHZ --> AUDIT
    AUDIT --> ENC
    
    ENC --> PII
    PII --> GDPR
    GDPR --> MASK
    MASK --> BACKUP
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Development"
        DEV[Local Development]
        DEV_DB[(Dev Database)]
        DEV_KAFKA[Dev Kafka]
    end
    
    subgraph "Staging"
        STAGE[Staging Environment]
        STAGE_DB[(Staging DB)]
        STAGE_KAFKA[Staging Kafka]
        STAGE_ML[ML Models]
    end
    
    subgraph "Production"
        PROD[Production Cluster]
        PROD_DB[(Production DB)]
        PROD_KAFKA[Production Kafka]
        PROD_ML[ML Inference]
        CDN[CDN]
    end
    
    subgraph "CI/CD Pipeline"
        GIT[Git Repository]
        BUILD[Build Pipeline]
        TEST[Automated Testing]
        DEPLOY[Deployment Pipeline]
    end
    
    GIT --> BUILD
    BUILD --> TEST
    TEST --> DEPLOY
    
    DEPLOY --> STAGE
    STAGE --> PROD
    
    DEV --> GIT
```

