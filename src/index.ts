import { z } from "zod";

type User = {
    name: string;
    age: number;
    is_allowed: 0 | 1;
    is_blocked?: 0 | 1;
    messages: string[];
    activity: {
        is_online: 0 | 1 | undefined;
        last_posted: number;
    };
};

const lumine: User = {
    name: "Lumine",
    age: 9999,
    is_allowed: 1,
    is_blocked: undefined,
    messages: ["123"],
    activity: {
        is_online: 1,
        last_posted: 0,
    },
};

const useForm = <TValues>(
    schema: z.Schema<TValues>,
    onSubmit: (values: TValues) => any,
) => {
    return {
        onSubmit: (args: any) => {
            schema.parse(args);
            onSubmit(args);
        },
    };
};

const LoginSchema = z.object({
    email: z.string(),
    password: z.number(),
    gg: z.number(),
});

const form = useForm(LoginSchema, (values) => console.log(values.email));

form.onSubmit({
    name: 123,
});
