```
transformer
    .object(lumine)
    .select((lumine) => lumine.activity.is_online)
    .mod((value) => Boolean(value))
    .select((lumine) => lumine.is_allowed)
    .mod((value) => Boolean(value))
    .transform()
```

```
transformer
    .object(lumine)
    .selectors(
        lumine => lumine.activity.is_online,
        lumine => lumine.is_allowed,
        lumine => lumine.is_blocked
    )
    .mod(value => Boolean(value))
    .transform()
```

```
transformer
    .object(lumine)
    .selectors(
        (lumine) => lumine.activity.is_online,
        (lumine) => lumine.is_allowed,
        transformer.arraySelector((el) => el.is_lagging),
    )
    .mod((value) => Boolean(value))
    .transform();
```
