```
transformer
    .object(lumine)
    .select((lumine) => lumine.activity.is_online)
    .mod((value) => Boolean(value))
    .select((lumine) => lumine.is_allowed)
    .mod((value) => Boolean(value))
    .transform()
```
