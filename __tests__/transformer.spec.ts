import {Transformer} from '../src'
import { test, expectTypeOf, expect } from 'vitest'

const mock = {
    name: 'Jack',
    checks: [0, 0, 1, 0],
    status: {
        is_online: 0,
        has_been_banned: 1,
        records: {
            is_archived: 1,
            logs: [],
            details: {
                is_stale: 0
            }
        }
    }
}

test('Nested transformation', () => {
    const transformer = new Transformer(mock);
    const assertedObj = transformer.select('status.is_online', 'status.has_been_banned').apply((is_online) => Boolean(is_online)).transform();

    expectTypeOf(assertedObj.status.is_online).toMatchTypeOf<boolean>()
    expect(assertedObj.status.is_online).toBe(false);

    expectTypeOf(assertedObj.status.has_been_banned).toMatchTypeOf<boolean>()
    expect(assertedObj.status.has_been_banned).toBe(true);
})

test('Deeply nested transformation', () => {
    const transformer = new Transformer(mock);
    const assertedObj = transformer.select('status.records.is_archived', 'status.records.details.is_stale').apply((is_archived) => Boolean(is_archived)).transform();

    expectTypeOf(assertedObj.status.records.is_archived).toMatchTypeOf<boolean>()
    expect(assertedObj.status.records.is_archived).toBe(true);
    expectTypeOf(assertedObj.status.records.details.is_stale).toMatchTypeOf<boolean>()
    expect(assertedObj.status.records.details.is_stale).toBe(false);
})

test('apply() argument infers the correct original type', () => {
    const transformer = new Transformer(mock);
    const assertedObj = transformer.select('status.is_online', 'status.has_been_banned').apply((is_online) => {
        expectTypeOf(is_online).toMatchTypeOf<number>()
        return Boolean(is_online)
    }).transform();
})

test('Array transformations', () => {
    const transformer = new Transformer(mock);
    const assertedObj = transformer.select('checks').apply((checks) => checks.map(check =>  Boolean(check))).transform();

    expectTypeOf(assertedObj.checks).toMatchTypeOf<boolean[]>()
    expect(assertedObj.checks).toStrictEqual([false, false, true, false]);
})