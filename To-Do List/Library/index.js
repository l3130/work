class LanresValidationLibrary {
    constructor() {
        this.formElement = null;
        this.validations = [];
    }

    addFormValidations(config) {
        this.formElement = document.getElementById(config.formId);
        this.validations = config.validations;

        // Attach the submit event to trigger validation
        this.formElement.addEventListener('submit', (e) => this.validateForm(e));
    }

    async validateForm(event) {
        event.preventDefault(); // Prevent form submission initially
        let isValid = true;

        const validationPromises = this.validations.map(async (validation) => {
            const inputElement = this.formElement.querySelector(`[name=${validation.id}]`);
            const value = inputElement.value.trim();

            // Clear previous error messages
            this.clearErrorMessage(inputElement);

            // Perform the validation
            const result = await this.applyValidation(value, validation);
            if (!result) {
                isValid = false;
                this.displayErrorMessage(inputElement, validation.message);
            }
        });

        await Promise.all(validationPromises);

        // Only submit the form if all validations pass
        if (isValid) {
            this.formElement.submit();
        }
    }

    async applyValidation(value, validation) {
        const rules = validation.rules.split(';');

        const validators = {
            required: () => value.length > 0,
            min: (length) => value.length >= parseInt(length),
            max: (length) => value.length <= parseInt(length),
            email: () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            phone: () => /^[0-9]{10}$/.test(value),
            asyncEmailCheck: async () => {
                // Simulating an API call (replace with real API request)
                return new Promise((resolve) => {
                    setTimeout(() => {
                        const existingEmails = ["test@example.com", "user@email.com"];
                        resolve(!existingEmails.includes(value)); // Return false if email is already in use
                    }, 1000);
                });
            }
        };

        for (const rule of rules) {
            const [ruleType, ruleValue] = rule.split(':');

            if (validators[ruleType]) {
                const result = validators[ruleType](ruleValue);
                if (result instanceof Promise) {
                    if (!(await result)) return false;
                } else if (!result) {
                    return false;
                }
            }
        }

        return true;
    }

    displayErrorMessage(inputElement, message) {
        const errorMessageElement = document.createElement('div');
        errorMessageElement.className = 'error-message';
        errorMessageElement.style.color = 'red';
        errorMessageElement.textContent = message;

        inputElement.parentElement.appendChild(errorMessageElement);
    }

    clearErrorMessage(inputElement) {
        const existingError = inputElement.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }
}

window.LanresValidationLibrary = LanresValidationLibrary