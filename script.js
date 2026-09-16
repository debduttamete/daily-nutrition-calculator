const form = document.getElementById("nutritionForm");

const ageInput = document.getElementById("Age");
const weightInput = document.getElementById("Weight");

const unitSelect = document.getElementById("unit");
const centimetersInput = document.getElementById("Centimeters");
const feetInput = document.getElementById("Feet");
const inchesInput = document.getElementById("Inches");

const formMessage = document.getElementById("formMessage");
const resultsCard = document.querySelector(".results-card");

const caloriesResult = document.getElementById("caloriesResult");
const calorieDescription = document.getElementById("calorieDescription");

const bmiResult = document.getElementById("bmiResult");
const bmiRecommendation = document.getElementById("bmiRecommendation");
const bmiDescription = document.getElementById("bmiDescription");

const healthyWeightResult =
    document.getElementById("healthyWeightResult");

const proteinResult = document.getElementById("proteinResult");
const carbsResult = document.getElementById("carbsResult");
const fatResult = document.getElementById("fatResult");

const waterResult = document.getElementById("waterResult");
const fiberResult = document.getElementById("fiberResult");
const stepsResult = document.getElementById("stepsResult");

const bmrResult = document.getElementById("bmrResult");
const activityFactorResult =
    document.getElementById("activityFactorResult");

const goalAdjustmentResult =
    document.getElementById("goalAdjustmentResult");

const calculationModeInputs =
    document.querySelectorAll('input[name="calculationMode"]');

const trainerSettings =
    document.getElementById("trainerSettings");

const trainerActivityMultiplier =
    document.getElementById("trainerActivityMultiplier");

const trainerAdjustmentType =
    document.getElementById("trainerAdjustmentType");

const trainerAdjustmentPercent =
    document.getElementById("trainerAdjustmentPercent");

const trainerProtein =
    document.getElementById("trainerProtein");

const trainerFat =
    document.getElementById("trainerFat");

const activityInputs =
    document.querySelectorAll('input[name="Activity"]');

const goalInputs =
    document.querySelectorAll('input[name="Goal"]');


// --------------------------------------------------
// HELPER FUNCTIONS
// --------------------------------------------------

function getSelectedRadio(name) {
    const selected = document.querySelector(
        `input[name="${name}"]:checked`
    );

    return selected ? selected.value : null;
}


// --------------------------------------------------
// CALCULATION MODE
// --------------------------------------------------

function updateModeFields() {
    const calculationMode =
        getSelectedRadio("calculationMode");

    const trainerMode =
        calculationMode === "trainer";

    // Show / hide Trainer Settings
    trainerSettings.hidden = !trainerMode;

    // Disable normal Activity + Goal controls
    // while Trainer Mode is active.
    activityInputs.forEach(function (input) {
        input.disabled = trainerMode;
    });

    goalInputs.forEach(function (input) {
        input.disabled = trainerMode;
    });
}


calculationModeInputs.forEach(function (input) {
    input.addEventListener("change", function () {
        updateModeFields();
    });
});


// Set correct state when page loads
updateModeFields();


// --------------------------------------------------
// TRAINER CALORIE ADJUSTMENT
// --------------------------------------------------

function updateTrainerAdjustment() {

    if (trainerAdjustmentType.value === "maintain") {

        trainerAdjustmentPercent.value = 0;

        trainerAdjustmentPercent.disabled = true;

    } else {

        trainerAdjustmentPercent.disabled = false;

        if (trainerAdjustmentPercent.value === "0") {

            if (
                trainerAdjustmentType.value === "deficit"
            ) {
                trainerAdjustmentPercent.value = 15;
            } else {
                trainerAdjustmentPercent.value = 10;
            }
        }
    }
}


trainerAdjustmentType.addEventListener(
    "change",
    updateTrainerAdjustment
);

updateTrainerAdjustment();

// --------------------------------------------------
// HEIGHT UNIT SWITCHING
// --------------------------------------------------

function updateHeightInputs() {

    if (unitSelect.value === "cm") {

        centimetersInput.hidden = false;
        centimetersInput.disabled = false;
        centimetersInput.required = true;

        feetInput.hidden = true;
        feetInput.disabled = true;
        feetInput.required = false;

        inchesInput.hidden = true;
        inchesInput.disabled = true;
        inchesInput.required = false;

    } else {

        centimetersInput.hidden = true;
        centimetersInput.disabled = true;
        centimetersInput.required = false;

        feetInput.hidden = false;
        feetInput.disabled = false;
        feetInput.required = true;

        inchesInput.hidden = false;
        inchesInput.disabled = false;
        inchesInput.required = true;
    }
}


unitSelect.addEventListener(
    "change",
    updateHeightInputs
);

updateHeightInputs();
// --------------------------------------------------
// HEIGHT CONVERSION
// --------------------------------------------------

function getHeightInCentimeters() {

    if (unitSelect.value === "cm") {
        return Number(centimetersInput.value);
    }

    const feet = Number(feetInput.value);
    const inches = Number(inchesInput.value);

    return (
        feet * 30.48 +
        inches * 2.54
    );
}


// --------------------------------------------------
// BMI
// --------------------------------------------------

function calculateBMI(weight, heightCm) {

    const heightMeters =
        heightCm / 100;

    return (
        weight /
        (heightMeters * heightMeters)
    );
}


function getBMICategory(bmi) {

    if (bmi < 18.5) {
        return "Underweight";
    }

    if (bmi < 25) {
        return "Healthy Weight";
    }

    if (bmi < 30) {
        return "Overweight";
    }

    if (bmi < 35) {
        return "Obesity Class 1";
    }

    if (bmi < 40) {
        return "Obesity Class 2";
    }

    return "Obesity Class 3";
}


function getBMIRecommendation(bmi) {

    if (bmi < 18.5) {
        return "Consider gradually increasing your calorie and nutrient intake.";
    }

    if (bmi < 25) {
        return "Your BMI is within the healthy range.";
    }

    if (bmi < 30) {
        return "A gradual reduction in body weight may improve health outcomes.";
    }

    if (bmi < 35) {
        return "Consider working toward gradual weight reduction.";
    }

    if (bmi < 40) {
        return "Consider discussing a structured weight-management plan with a healthcare professional.";
    }

    return "Consider discussing a structured weight-management plan with a healthcare professional.";
}


// --------------------------------------------------
// HEALTHY WEIGHT RANGE
// --------------------------------------------------

function calculateHealthyWeightRange(heightCm) {

    const heightMeters =
        heightCm / 100;

    const minimumWeight =
        18.5 *
        heightMeters *
        heightMeters;

    const maximumWeight =
        24.9 *
        heightMeters *
        heightMeters;

    return {
        minimum: minimumWeight,
        maximum: maximumWeight
    };
}


// --------------------------------------------------
// BMR
// --------------------------------------------------

function calculateBMR(
    weight,
    heightCm,
    age,
    gender
) {

    if (gender === "Male") {

        return (
            10 * weight +
            6.25 * heightCm -
            5 * age +
            5
        );
    }

    return (
        10 * weight +
        6.25 * heightCm -
        5 * age -
        161
    );
}


// --------------------------------------------------
// ACTIVITY FACTOR
// --------------------------------------------------

function getActivityFactor(activity) {

    const activityFactors = {

        sedentary: 1.20,

        lightly_active: 1.375,

        moderately_active: 1.55,

        very_active: 1.725,

        extremely_active: 1.90
    };

    return (
        activityFactors[activity] ||
        1.20
    );
}


// --------------------------------------------------
// MAINTENANCE CALORIES
// --------------------------------------------------

function calculateMaintenanceCalories(
    bmr,
    activityFactor
) {

    return bmr * activityFactor;
}


// --------------------------------------------------
// STANDARD MODE GOAL CALORIES
// --------------------------------------------------

function calculateGoalCalories(
    maintenanceCalories,
    goal,
    gender
) {

    // Maintain
    if (goal === "maintain") {

        return {
            calories: maintenanceCalories,
            adjustment: 0
        };
    }


    // Lose
    if (goal === "lose") {

        const deficit =
            Math.min(
                maintenanceCalories * 0.15,
                750
            );

        const minimumCalories =
            gender === "Male"
                ? 1500
                : 1200;

        const calories =
            Math.max(
                maintenanceCalories - deficit,
                minimumCalories
            );

        return {
            calories: calories,
            adjustment:
                calories - maintenanceCalories
        };
    }


    // Gain
    const surplus =
        maintenanceCalories * 0.10;

    return {
        calories:
            maintenanceCalories + surplus,

        adjustment: surplus
    };
}


// --------------------------------------------------
// TRAINER MODE GOAL CALORIES
// --------------------------------------------------

function calculateTrainerGoalCalories(
    maintenanceCalories,
    adjustmentType,
    adjustmentPercent,
    gender
) {

    // Maintain
    if (adjustmentType === "maintain") {

        return {
            calories: maintenanceCalories,
            adjustment: 0
        };
    }


    const percentage =
        adjustmentPercent / 100;


    // Deficit
    if (adjustmentType === "deficit") {

        const deficit =
            maintenanceCalories * percentage;

        const minimumCalories =
            gender === "Male"
                ? 1500
                : 1200;

        const calories =
            Math.max(
                maintenanceCalories - deficit,
                minimumCalories
            );

        return {
            calories: calories,

            adjustment:
                calories - maintenanceCalories
        };
    }


    // Surplus
    if (adjustmentType === "surplus") {

        const surplus =
            maintenanceCalories * percentage;

        return {
            calories:
                maintenanceCalories + surplus,

            adjustment: surplus
        };
    }


    return {
        calories: maintenanceCalories,
        adjustment: 0
    };
}


// --------------------------------------------------
// MACROS
// --------------------------------------------------

function calculateMacros(
    calories,
    weight,
    proteinPerKg,
    fatPercent
) {

    const protein =
        weight * proteinPerKg;

    const proteinCalories =
        protein * 4;

    const fatCalories =
        calories *
        (fatPercent / 100);

    const fat =
        fatCalories / 9;

    const remainingCalories =
        calories -
        proteinCalories -
        fatCalories;

    const carbs =
        Math.max(
            remainingCalories / 4,
            0
        );

    return {
        protein,
        carbs,
        fat
    };
}


// --------------------------------------------------
// DAILY TARGETS
// --------------------------------------------------

function calculateWater(
    gender,
    activity
) {

    let water =
        gender === "Male"
            ? 3.7
            : 2.7;


    if (
        activity === "very_active" ||
        activity === "extremely_active"
    ) {

        water += 0.3;
    }

    return water;
}


function calculateFiber(calories) {

    return Math.max(
        25,
        calories * 0.014
    );
}


function getStepRecommendation(activity) {

    const stepRecommendations = {

        sedentary:
            "7,000–8,000 steps",

        lightly_active:
            "7,000–10,000 steps",

        moderately_active:
            "8,000–10,000 steps",

        very_active:
            "8,000–12,000 steps",

        extremely_active:
            "8,000–12,000 steps"
    };

    return (
        stepRecommendations[activity] ||
        "7,000–10,000 steps"
    );
}


// --------------------------------------------------
// FORM SUBMIT
// --------------------------------------------------

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        // Clear previous message
        formMessage.textContent = "";

        formMessage.className =
            "form-message";


        // ------------------------------------------
        // BASIC INPUTS
        // ------------------------------------------

        const age =
            Number(ageInput.value);

        const weight =
            Number(weightInput.value);

        const gender =
            getSelectedRadio("Gender");

        const calculationMode =
            getSelectedRadio("calculationMode");

        const heightCm =
            getHeightInCentimeters();


        // ------------------------------------------
        // STANDARD-ONLY INPUTS
        // ------------------------------------------

        const activity =
            getSelectedRadio("Activity");

        const goal =
            getSelectedRadio("Goal");


        // ------------------------------------------
        // BASIC VALIDATION
        // ------------------------------------------

        if (
            !age ||
            age < 18 ||
            age > 80
        ) {

            formMessage.textContent =
                "Please enter an age between 18 and 80.";

            formMessage.classList.add("error");

            return;
        }


        if (
            !weight ||
            weight <= 0
        ) {

            formMessage.textContent =
                "Please enter a valid weight.";

            formMessage.classList.add("error");

            return;
        }


        if (!gender) {

            formMessage.textContent =
                "Please select your gender.";

            formMessage.classList.add("error");

            return;
        }


        if (
            !heightCm ||
            heightCm <= 0
        ) {

            formMessage.textContent =
                "Please enter a valid height.";

            formMessage.classList.add("error");

            return;
        }


        // ------------------------------------------
        // STANDARD MODE VALIDATION
        // ------------------------------------------

        if (
            calculationMode !== "trainer"
        ) {

            if (!activity) {

                formMessage.textContent =
                    "Please select your activity level.";

                formMessage.classList.add("error");

                return;
            }


            if (!goal) {

                formMessage.textContent =
                    "Please select your goal.";

                formMessage.classList.add("error");

                return;
            }
        }


        // ------------------------------------------
        // BMI
        // ------------------------------------------

        const bmi =
            calculateBMI(
                weight,
                heightCm
            );

        const bmiCategory =
            getBMICategory(bmi);

        const bmiRecommendationText =
            getBMIRecommendation(bmi);


        // ------------------------------------------
        // HEALTHY WEIGHT
        // ------------------------------------------

        const healthyWeight =
            calculateHealthyWeightRange(
                heightCm
            );


        // ------------------------------------------
        // BMR
        // ------------------------------------------

        const bmr =
            calculateBMR(
                weight,
                heightCm,
                age,
                gender
            );


        // ------------------------------------------
        // ACTIVITY FACTOR
        // ------------------------------------------

        let activityFactor;


        if (
            calculationMode === "trainer"
        ) {

            activityFactor =
                Number(
                    trainerActivityMultiplier.value
                );


            if (
                !activityFactor ||
                activityFactor < 1 ||
                activityFactor > 2.5
            ) {

                formMessage.textContent =
                    "Trainer activity multiplier must be between 1.00 and 2.50.";

                formMessage.classList.add("error");

                return;
            }

        } else {

            activityFactor =
                getActivityFactor(activity);
        }


        // ------------------------------------------
        // MAINTENANCE CALORIES
        // ------------------------------------------

        const maintenanceCalories =
            calculateMaintenanceCalories(
                bmr,
                activityFactor
            );


        // ------------------------------------------
        // GOAL + MACROS
        // ------------------------------------------

        let goalCalories;
        let macros;


        // ==========================================
        // TRAINER MODE
        // ==========================================

        if (
            calculationMode === "trainer"
        ) {

            const adjustmentType =
                trainerAdjustmentType.value;

            const adjustmentPercent =
                Number(
                    trainerAdjustmentPercent.value
                );

            const proteinPerKg =
                Number(
                    trainerProtein.value
                );

            const fatPercent =
                Number(
                    trainerFat.value
                );


            // Trainer adjustment validation

            if (
                adjustmentPercent < 0 ||
                adjustmentPercent > 50
            ) {

                formMessage.textContent =
                    "Trainer calorie adjustment must be between 0% and 50%.";

                formMessage.classList.add("error");

                return;
            }


            // Trainer protein validation

            if (
                !proteinPerKg ||
                proteinPerKg < 0.8 ||
                proteinPerKg > 3.5
            ) {

                formMessage.textContent =
                    "Trainer protein target must be between 0.8 and 3.5 g/kg.";

                formMessage.classList.add("error");

                return;
            }


            // Trainer fat validation

            if (
                !fatPercent ||
                fatPercent < 15 ||
                fatPercent > 50
            ) {

                formMessage.textContent =
                    "Trainer fat target must be between 15% and 50%.";

                formMessage.classList.add("error");

                return;
            }


            // Trainer calorie target

            goalCalories =
                calculateTrainerGoalCalories(
                    maintenanceCalories,
                    adjustmentType,
                    adjustmentPercent,
                    gender
                );


            // Trainer macros

            macros =
                calculateMacros(
                    goalCalories.calories,
                    weight,
                    proteinPerKg,
                    fatPercent
                );


        // ==========================================
        // STANDARD MODE
        // ==========================================

        } else {

            goalCalories =
                calculateGoalCalories(
                    maintenanceCalories,
                    goal,
                    gender
                );


            const proteinPerKg =
                goal === "lose"
                    ? 1.8
                    : 1.6;


            macros =
                calculateMacros(
                    goalCalories.calories,
                    weight,
                    proteinPerKg,
                    25
                );
        }


        // ------------------------------------------
        // DAILY TARGETS
        // ------------------------------------------

        let water;
        let steps;


        if (
            calculationMode === "trainer"
        ) {

            // Trainer mode does not use the
            // standard activity multiplier
            // for water calculation.

            water =
                gender === "Male"
                    ? 3.7
                    : 2.7;


            // Keep the client's previously
            // selected activity as an informational
            // step recommendation only.

            const selectedActivity =
                activity ||
                "moderately_active";

            steps =
                getStepRecommendation(
                    selectedActivity
                );

        } else {

            water =
                calculateWater(
                    gender,
                    activity
                );

            steps =
                getStepRecommendation(
                    activity
                );
        }


        const fiber =
            calculateFiber(
                goalCalories.calories
            );


        // ------------------------------------------
        // DISPLAY CALORIES
        // ------------------------------------------

        caloriesResult.textContent =
            `${Math.round(goalCalories.calories)} kcal`;


        if (
            calculationMode === "trainer"
        ) {

            calorieDescription.textContent =
                "Customized trainer target based on your selected settings.";

        } else {

            if (goal === "maintain") {

                calorieDescription.textContent =
                    "Estimated calories to maintain your current weight.";

            } else if (goal === "lose") {

                calorieDescription.textContent =
                    "Estimated daily calories for gradual weight loss.";

            } else {

                calorieDescription.textContent =
                    "Estimated daily calories for gradual weight gain.";
            }
        }


        // ------------------------------------------
        // DISPLAY BMI
        // ------------------------------------------

        bmiResult.textContent =
            bmi.toFixed(1);

        bmiRecommendation.textContent =
            bmiCategory;

        bmiDescription.textContent =
            bmiRecommendationText;


        // ------------------------------------------
        // DISPLAY HEALTHY WEIGHT
        // ------------------------------------------

        healthyWeightResult.textContent =
            `${healthyWeight.minimum.toFixed(1)}–${healthyWeight.maximum.toFixed(1)} kg`;


        // ------------------------------------------
        // DISPLAY MACROS
        // ------------------------------------------

        proteinResult.textContent =
            `${Math.round(macros.protein)} g`;

        carbsResult.textContent =
            `${Math.round(macros.carbs)} g`;

        fatResult.textContent =
            `${Math.round(macros.fat)} g`;


        // ------------------------------------------
        // DISPLAY DAILY TARGETS
        // ------------------------------------------

        waterResult.textContent =
            `${water.toFixed(1)} L`;

        fiberResult.textContent =
            `${Math.round(fiber)} g`;

        stepsResult.textContent =
            steps;


        // ------------------------------------------
        // DISPLAY CALCULATION DETAILS
        // ------------------------------------------

        bmrResult.textContent =
            `${Math.round(bmr)} kcal`;

        activityFactorResult.textContent =
            activityFactor.toFixed(2);


        const adjustment =
            goalCalories.adjustment;


        if (adjustment === 0) {

            goalAdjustmentResult.textContent =
                "0 kcal";

        } else if (adjustment < 0) {

            goalAdjustmentResult.textContent =
                `${Math.round(adjustment)} kcal`;

        } else {

            goalAdjustmentResult.textContent =
                `+${Math.round(adjustment)} kcal`;
        }


        // ------------------------------------------
        // SHOW RESULTS
        // ------------------------------------------

        resultsCard.hidden = false;

        resultsCard.classList.remove(
            "result-reveal"
        );

        // Restart animation
        void resultsCard.offsetWidth;

        resultsCard.classList.add(
            "result-reveal"
        );

        resultsCard.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
);


// --------------------------------------------------
// DARK MODE
// --------------------------------------------------

const themeToggle =
    document.getElementById("themeToggle");

const html =
    document.documentElement;

const savedTheme =
    localStorage.getItem("theme");


if (savedTheme) {
    html.dataset.theme =
        savedTheme;
}


if (
    html.dataset.theme === "dark"
) {

    themeToggle.textContent =
        "🌙 Dark";

} else {

    themeToggle.textContent =
        "☀️ Light";
}


themeToggle.addEventListener(
    "click",
    function () {

        if (
            html.dataset.theme === "dark"
        ) {

            html.dataset.theme =
                "light";

            themeToggle.textContent =
                "☀️ Light";

        } else {

            html.dataset.theme =
                "dark";

            themeToggle.textContent =
                "🌙 Dark";
        }


        localStorage.setItem(
            "theme",
            html.dataset.theme
        );
    }
);
