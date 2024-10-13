
/**
 * @param {string} value
 */
export function getCompanyLabelByValue(value) {
    const status = companyTypes.find((item) => item.value === value);
    return status ? status.label : null;
}

/**
 * @param {string} value
 */
export function getCompanyTypeByValue(value) {
    const status = companyTypes.find((item) => item.value === value);
    return status ? status : null; // Return null or a default label if the value is not found
}

const companyTypes = [
    { "value": "SOLE", "label": "Sole Proprietorship" },
    { "value": "CORP", "label": "Corporation" },
    { "value": "PART", "label": "Partnership" },
    { "value": "OPC", "label": "One Person Corporation (OPC)" }
]