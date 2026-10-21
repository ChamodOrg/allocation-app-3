# What the design assumes about finance-entity-service

- The contract beside this definition was derived from the product's client code at d14b825 (backend/modules/entity/finance.bal, types.bal and backend/modules/types/types.bal), not from the service's published schema: it holds only the operations and fields the product uses, and the field types the client records declare. *assumed*
- The service answers the same shapes to the recreate as it does to the current app. *assumed*
