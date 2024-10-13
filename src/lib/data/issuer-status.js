import { ShieldMinus, UserRoundCheck, UserRoundPen, UserRoundX } from "lucide-svelte";

/**
 * @param {string} value
 */
export function getStatusLabelByValue(value) {
    const status = issuerStatus.find((item) => item.value === value);
    return status ? status.label : null; // Return null or a default label if the value is not found
}

/**
 * @param {string} value
 */
export function getStatusByValue(value) {
    const status = issuerStatus.find((item) => item.value === value);
    return status ? status : null; // Return null or a default label if the value is not found
}

export const issuerStatus = [
    {
        value: "REGISTERED",
        label: "Completing Data",
        icon: UserRoundPen,
    },
    {
        value: "ACTIVE",
        label: "Active",
        icon: UserRoundCheck,
    },
    {
        value: "REJECTED",
        label: "Rejected",
        icon: UserRoundX,
    },
    {
        value: "DISABLED",
        label: "Disabled",
        icon: ShieldMinus,
    },
];