import { InputHTMLAttributes, useState } from 'react';

type LabelInputProps = {
    errors?: string[];
    input_props: InputHTMLAttributes<HTMLInputElement>;
};

export default function LabelInput(props: LabelInputProps) {
    const [value, setValue] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    return (
        <div className="flex flex-col mb-2 w-full">
            <input
                {...props.input_props}
                className={
                    'w-full border-2 rounded-md bg-inherit p-2 border-s-' +
                    (props.errors && props.errors.length > 0
                        ? 'red-500'
                        : 'white')
                }
                value={value}
                onChange={handleChange}
            />
            {/* On input value change error disappears */}
            {props.errors && (
                <ul className="pt-1">
                    {props.errors.map((error) => (
                        <li key={error} className="text-xs text-red-500">
                            {error}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
