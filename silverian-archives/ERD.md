erDiagram
    %% Relasi Tabel
    users ||--o{ news : "author_id"
    users ||--o{ game_mechanics : "author_id"
    users ||--o{ reviews : "user_id"
    users ||--o{ review_likes : "user_id"
    users ||--o{ review_comments : "user_id"

    tiers ||--o{ characters : "tier_id"

    codex_categories ||--o{ codex_entries : "category_id"

    characters ||--o{ reviews : "character_id"

    reviews ||--o{ review_likes : "review_id"
    reviews ||--o{ review_comments : "review_id"

    %% Struktur Tabel
    users {
        int id PK
        varchar username "UNIQUE"
        varchar email "UNIQUE"
        varchar password
        enum role "Admin/User"
        timestamp created_at
        timestamp updated_at
    }

    tiers {
        int id PK
        varchar name "UNIQUE"
        text description
        timestamp created_at
        timestamp updated_at
    }

    codex_categories {
        int id PK
        varchar name "UNIQUE"
        text description
        timestamp created_at
        timestamp updated_at
    }

    characters {
        int id PK
        int tier_id FK
        varchar name "UNIQUE"
        varchar element
        text description
        text lore_background
        varchar image_url
        timestamp created_at
        timestamp updated_at
    }

    news {
        int id PK
        int author_id FK
        varchar title
        text content
        varchar banner_url
        timestamp created_at
        timestamp updated_at
    }

    game_mechanics {
        int id PK
        int author_id FK
        varchar title
        text content
        varchar thumbnail_url
        varchar youtube_url
        text tips
        text faq
        timestamp created_at
        timestamp updated_at
    }

    codex_entries {
        int id PK
        int category_id FK
        varchar title
        text content
        varchar image_url
        timestamp created_at
        timestamp updated_at
    }

    reviews {
        int id PK
        int character_id FK
        int user_id FK
        int rating "1-5"
        text content
        timestamp created_at
    }

    review_likes {
        int id PK
        int review_id FK
        int user_id FK
    }

    review_comments {
        int id PK
        int review_id FK
        int user_id FK
        text content
        timestamp created_at
    }
