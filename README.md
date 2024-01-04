# Description
[![npm version](https://img.shields.io/npm/v/schema-transformer?style=flat&colorA=18181B&colorB=d8c449)](https://www.npmjs.com/package/sunsettia)
![Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/idea456/cae78aa41f0e72f261e01fd2fcee51f4/raw/schema-transformer.json)


`schema-transformer` provides a simple utility for transforming data objects according to a specified schema. It allows you to select specific and deeply nested fields within an object and apply transformations to them while preserving unselected field types and casting the types of the selected fields. 

This is convenient to apply transformations for deeply nested fields, whereby you want to preserve the types of other fields but only cast the type of the field you want to transform.

# Installation

```bash
npm install schema-transformer
# or
yarn add schema-transformer
```

# Usage

```typescript
import { Transformer } from 'schema-transformer';

// Define your data schema
type User = {
    name: string;
    has_logged_out: 0 | 1;
    is_loading: string | "";
    status: {
        is_online: 0 | 1 | undefined;
        is_blocked: boolean;
        logs: string[];
    };
    scores: string[];
};

// Create an instance of your data with the initial values
const user: User = {
    name: "123",
    has_logged_out: 1,
    is_loading: "",
    status: {
        is_online: 0,
        is_blocked: false,
        logs: ["1", "2", "3"],
    },
    scores: ["123", "456", "789"],
};

// Create a transformer instance with your data
const transformer = new Transformer(user);

// Select fields you want to transform
const transformedUser = transformer
    .select("has_logged_out", "status.is_online")
    .apply((v) => Boolean(v))
    .transform();

// user.has_logged_out and user.status.is_online types are casted to boolean and values transformed
user.has_logged_out
//        ^? has_logged_out: number
user.status.is_online
//        ^? has_logged_out: number
```

# API reference
### `Transformer(data: unknown)`
`data (any)`: The data object you want to transform.

# License
This project is licensed under the MIT License - see the LICENSE file for details.

