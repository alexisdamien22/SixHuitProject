export const FormHelpers = {
    isLoginValid(data) {
        return data.email?.includes("@") && data.password?.length >= 4;
    },

    isParentValid(data) {
        return (
            data.email?.includes("@") &&
            data.password?.length >= 8 &&
            data.password === data.confirmPassword
        );
    },

    isChildStepValid(step, data) {
        switch (step) {
            case 1:
                return data.name?.trim().length >= 2;
            case 2:
                const age = parseInt(data.age, 10);
                return !isNaN(age) && age >= 5 && age <= 99;
            case 3:
                return !!data.instrument;
            case 4:
                const time_amount = parseInt(data.time_amount, 10);
                return !isNaN(time_amount) && time_amount >= 0;
            case 5:
                return true;
            case 6:
                return !!data.mascot;
            case 7:
                return Array.isArray(data.days) && data.days.length > 0;
            default:
                return true;
        }
    },
};
