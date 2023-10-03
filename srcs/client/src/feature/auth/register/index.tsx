import type { RegisterError } from './action';
import { useId, useState } from 'react';
import { useNavigation } from 'react-router-dom';
import { useActionData } from 'react-router-dom';
import AccountForm from './forms/accountForm';
import { BirthdayForm } from './forms/birthdayForm';

// Component -------------------------------------------------------------------
export default function RegisterForm() {
    const id = useId();
    const navigation = useNavigation();
    const data = useActionData() as RegisterError | undefined;
    const [step, setStep] = useState(0);

    switch (step) {
        case 0:
            return <AccountForm id={id} navigation={navigation} data={data} />;
        case 1:
            return <BirthdayForm />;
    }
}
