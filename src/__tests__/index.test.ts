import { Transformer } from "..";

type User = {
    name: string;
    age: number;
    is_allowed: 0 | 1;
    is_blocked?: 0 | 1;
    messages: string[];
    logs: string[];
    activity: {
        is_online: 0 | 1 | undefined;
        last_posted: number;
        records: string[];
        recordsNum: number[];
        logs: {
            id: string;
            records: number[];
        };
    };
};

const lumine: User = {
    name: "Lumine",
    age: 9999,
    is_allowed: 1,
    is_blocked: undefined,
    messages: ["123"],
    logs: ["1", "0", "1"],
    activity: {
        is_online: 1,
        last_posted: 0,
        records: ["1"],
        recordsNum: [1],
        logs: {
            id: "1",
            records: [1, 2, 3, 4, 5],
        },
    },
};

const transformer = new Transformer(lumine);
let output = transformer
    .select(
        "activity.is_online",
        "is_allowed",
        "activity.last_posted",
        "is_blocked",
    )
    .apply((value) => Boolean(value))
    .select(
        "messages",
        "activity.logs.records",
        "logs",
        "activity.records",
        "activity.recordsNum",
    )
    .apply((array) => array.map((item) => Boolean(item)))
    .transform();

output.is_blocked;
//   	^?
output.is_allowed;
//   	^?
output.activity.is_online;
//            	^?
output.activity.last_posted;
//            	^?
output.messages;
//   	^?

output.activity.logs.records;
//                  	^?

output.activity.records;

output.activity.recordsNum;

output.logs;
//  	^?

console.log("OUTPUT", output.messages);
