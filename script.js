// ============================================================
// DAILY NUTRITION CALCULATOR
// V1
// ============================================================


// ============================================================
// DOM REFERENCES
// ============================================================

const form = document.getElementById("nutritionForm");

const ageInput = document.getElementById("Age");
const weightInput = document.getElementById("Weight");

const unitSelect = document.getElementById("unit");

const centimetersInput =
    document.getElementById("Centimeters");

const feetInput =
    document.getElementById("Feet");

const inchesInput =
    document.getElementById("Inches");


const formMessage =
    document.getElementById("formMessage");


/* Results */

const resultsCard =
    document.querySelector(".results-card");

const caloriesResult =
    document.getElementById("caloriesResult");

const calorieDescription =
    document.getElementById("calorieDescription");

const bmiResult =
    document.getElementById("bmiResult");

const bmiRecommendation =
    document.getElementById("bmiRecommendation");

const bmiDescription =
    document.getElementById("bmiDescription");

const healthyWeightResult =
    document.getElementById("healthyWeightResult");

const proteinResult =
    document.getElementById("proteinResult");

const carbsResult =
    document.getElementById("carbsResult");

const fatResult =
    document.getElementById("fatResult");

const waterResult =
    document.getElementById("waterResult");

const fiberResult =
    document.getElementById("fiberResult");

const stepsResult =
    document.getElementById("stepsResult");


/* Calculation details */

const bmrResult =
    document.getElementById("bmrResult");

const activityFactorResult =
    document.getElementById("activityFactorResult");

const goalAdjustmentResult =
    document.getElementById("goalAdjustmentResult");


// ============================================================
// HEIGHT INPUT SWITCHER
// ============================================================

function updateHeightInputs() {

    const usingCentimeters =
        unitSelect.value === "cm";


    centimetersInput.hidden =
        !usingCentimeters;

    feetInput.hidden =
        usingCentimeters;

    inchesInput.hidden =
        usingCentimeters;


    // Clear the inactive fields.
    // This prevents stale values being accidentally submitted.

    if (usingCentimeters) {

        feetInput.value = "";
        inchesInput.value = "";

    } else {

        centimetersInput.value = "";
    }
}


unitSelect.addEventListener(
    "change",
    updateHeightInputs
);


// Set initial state.
updateHeightInputs();


// ============================================================
// RADIO HELPER
// ============================================================

function getSelectedRadio(name) {

    const selected =
        document.querySelector(
            `input[name="${name}"]:checked`
        );

    return selected ? selected.value : null;
}


// ============================================================
// HEIGHT CONVERSION
// ============================================================

function getHeightInCm() {

    if (unitSelect.value === "cm") {

        return Number(
            centimetersInput.value
        );
    }


    const feet =
        Number(feetInput.value);

    const inches =
        Number(inchesInput.value);


    return (
        feet * 30.48
    ) + (
        inches * 2.54
    );
}


// ============================================================
// BMI
// ============================================================

function calculateBMI(
    weight,
    heightInCm
) {

    const heightInMeters =
        heightInCm / 100;


    return (
        weight /
        (heightInMeters * heightInMeters)
    );
}


// ============================================================
// BMI CATEGORY
// ============================================================

function getBMICategory(bmi) {

    if (bmi < 18.5) {
        return "Underweight";
    }

    if (bmi < 25) {
        return "Healthy weight";
    }

    if (bmi < 30) {
        return "Overweight";
    }

    if (bmi < 35) {
        return "Obesity — Class 1";
    }

    if (bmi < 40) {
        return "Obesity — Class 2";
    }

    return "Obesity — Class 3";
}


// ============================================================
// HEALTHY WEIGHT RANGE
// ============================================================

function getHealthyWeightRange(
    heightInCm
) {

    const heightInMeters =
        heightInCm / 100;


    const minimum =
        18.5 *
        heightInMeters *
        heightInMeters;


    const maximum =
        24.9 *
        heightInMeters *
        heightInMeters;


    return {
        minimum,
        maximum
    };
}


// ============================================================
// MIFFLIN-ST JEOR
// ============================================================

function calculateBMR(
    age,
    gender,
    weight,
    heightInCm
) {

    if (gender === "Male") {

        return (
            10 * weight +
            6.25 * heightInCm -
            5 * age +
            5
        );

    }


    return (
        10 * weight +
        6.25 * heightInCm -
        5 * age -
        161
    );
}


// ============================================================
// ACTIVITY FACTORS
// ============================================================

const activityFactors = {

    sedentary: 1.20,

    lightly_active: 1.375,

    moderately_active: 1.55,

    very_active: 1.725,

    extremely_active: 1.90
};


function getActivityFactor(
    activity
) {

    return activityFactors[activity];
}


// ============================================================
// MAINTENANCE CALORIES
// ============================================================

function calculateMaintenanceCalories(
    bmr,
    activity
) {

    const activityFactor =
        getActivityFactor(activity);


    return bmr * activityFactor;
}


// ============================================================
// GOAL CALORIES
// ============================================================

function calculateGoalCalories(
    maintenanceCalories,
    goal,
    gender
) {

    /*
        For V1:

        Maintain:
            100% of maintenance

        Lose:
            approximately 15% deficit
            capped at 750 kcal

        Gain:
            approximately 10% surplus
    */


    if (goal === "maintain") {

        return {
            calories:
                maintenanceCalories,

            adjustment:
                0
        };
    }


    if (goal === "lose") {

        const deficit =
            Math.min(
                maintenanceCalories * 0.15,
                750
            );


        // Guard against an implausibly low
        // calorie target.

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
            calories,
            adjustment:
                calories -
                maintenanceCalories
        };
    }


    // Gain weight

    const surplus =
        maintenanceCalories * 0.10;


    return {
        calories:
            maintenanceCalories + surplus,

        adjustment:
            surplus
    };
}


// ============================================================
// MACRONUTRIENTS
// ============================================================

function calculateMacros(
    calories,
    weight,
    goal
) {

    /*
        Protein:

        Maintain → 1.6 g/kg
        Gain    → 1.6 g/kg
        Lose    → 1.8 g/kg

        These values stay inside
        commonly used ranges for
        exercising adults.
    */


    const proteinPerKg =
        goal === "lose"
            ? 1.8
            : 1.6;


    const protein =
        weight * proteinPerKg;


    const proteinCalories =
        protein * 4;


    /*
        Fat is set to 25% of calories.

        Remaining energy goes to carbs.
    */

    const fatCalories =
        calories * 0.25;


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


// ============================================================
// DAILY TARGETS
// ============================================================

function calculateDailyTargets(
    age,
    gender,
    activity,
    calories
) {

    /*
        Water:

        These are total-water reference values,
        meaning water from beverages + food,
        not simply plain drinking water.

        Adult reference values from
        National Academies are roughly:

        Men    → 3.7 L/day
        Women  → 2.7 L/day

        We add a small activity adjustment
        for very/highly active users.
    */

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


    /*
        Fiber:

        Use roughly 14 g per 1,000 kcal,
        but never below 25 g.
    */

    const fiber =
        Math.max(
            25,
            calories * 0.014
        );


    /*
        Steps:

        This is intentionally presented as
        a general movement target, not a
        medical prescription.
    */

    let steps = "7–10k";

    if (activity === "sedentary") {
        steps = "7–8k";
    }

    if (activity === "lightly_active") {
        steps = "7–10k";
    }

    if (activity === "moderately_active") {
        steps = "8–10k";
    }

    if (activity === "very_active") {
        steps = "8–12k";
    }

    if (activity === "extremely_active") {
        steps = "8–12k";
    }


    return {
        water,
        fiber,
        steps
    };
}


// ============================================================
// FORM VALIDATION
// ============================================================

function showError(message) {

    formMessage.textContent =
        message;

    formMessage.classList.add(
        "show"
    );
}


function clearError() {

    formMessage.textContent = "";

    formMessage.classList.remove(
        "show"
    );
}


// ============================================================
// DISPLAY RESULTS
// ============================================================

function displayResults(
    bmi,
    bmiCategory,
    healthyRange,
    dailyCalories,
    macros,
    targets,
    bmr,
    activityFactor,
    goalAdjustment
) {

    caloriesResult.textContent =
        Math.round(
            dailyCalories
        ).toLocaleString();


    calorieDescription.textContent =
        "Estimated daily energy target based on your activity and goal.";


    bmiResult.textContent =
        bmi.toFixed(1);


    bmiRecommendation.textContent =
        bmiCategory;


    bmiDescription.textContent =
        "Adult BMI screening category";


    healthyWeightResult.textContent =
        `${healthyRange.minimum.toFixed(1)} – ${healthyRange.maximum.toFixed(1)}`;


    proteinResult.textContent =
        Math.round(
            macros.protein
        );


    carbsResult.textContent =
        Math.round(
            macros.carbs
        );


    fatResult.textContent =
        Math.round(
            macros.fat
        );


    waterResult.textContent =
        `${targets.water.toFixed(1)} L`;


    fiberResult.textContent =
        `${Math.round(targets.fiber)} g`;


    stepsResult.textContent =
        targets.steps;


    bmrResult.textContent =
        `${Math.round(bmr)} kcal/day`;


    activityFactorResult.textContent =
        `× ${activityFactor}`;


    if (goalAdjustment === 0) {

        goalAdjustmentResult.textContent =
            "Maintenance";

    } else if (goalAdjustment < 0) {

        goalAdjustmentResult.textContent =
            `${Math.round(
                goalAdjustment
            )} kcal`;

    } else {

        goalAdjustmentResult.textContent =
            `+${Math.round(
                goalAdjustment
            )} kcal`;
    }


    resultsCard.classList.remove(
        "has-results"
    );


    // Force a reflow so the animation
    // can replay on every calculation.

    void resultsCard.offsetWidth;


    resultsCard.classList.add(
        "has-results"
    );
}


// ============================================================
// FORM SUBMISSION
// ============================================================

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        clearError();


        // ----------------------------------------------------
        // READ INPUTS
        // ----------------------------------------------------

        const age =
            Number(ageInput.value);


        const weight =
            Number(weightInput.value);


        const gender =
            getSelectedRadio(
                "Gender"
            );


        const activity =
            getSelectedRadio(
                "Activity"
            );


        const goal =
            getSelectedRadio(
                "Goal"
            );


        const heightInCm =
            getHeightInCm();


        // ----------------------------------------------------
        // VALIDATE AGE
        // ----------------------------------------------------

        if (
            !Number.isFinite(age) ||
            age < 18 ||
            age > 90
        ) {

            showError(
                "Enter an age between 18 and 90."
            );

            ageInput.focus();

            return;
        }


        // ----------------------------------------------------
        // VALIDATE GENDER
        // ----------------------------------------------------

        if (!gender) {

            showError(
                "Select your gender."
            );

            return;
        }


        // ----------------------------------------------------
        // VALIDATE WEIGHT
        // ----------------------------------------------------

        if (
            !Number.isFinite(weight) ||
            weight < 25 ||
            weight > 450
        ) {

            showError(
                "Enter a realistic weight between 25 and 450 kg."
            );

            weightInput.focus();

            return;
        }


        // ----------------------------------------------------
        // VALIDATE HEIGHT
        // ----------------------------------------------------

        if (
            !Number.isFinite(heightInCm) ||
            heightInCm < 91.44 ||
            heightInCm > 274.32
        ) {

            showError(
                "Enter a height between 91.4 and 274.3 cm."
            );

            return;
        }


        // ----------------------------------------------------
        // VALIDATE ACTIVITY
        // ----------------------------------------------------

        if (!activity) {

            showError(
                "Select an activity level."
            );

            return;
        }


        // ----------------------------------------------------
        // VALIDATE GOAL
        // ----------------------------------------------------

        if (!goal) {

            showError(
                "Select your goal."
            );

            return;
        }


        // ----------------------------------------------------
        // CALCULATIONS
        // ----------------------------------------------------

        const bmi =
            calculateBMI(
                weight,
                heightInCm
            );


        const bmiCategory =
            getBMICategory(
                bmi
            );


        const healthyRange =
            getHealthyWeightRange(
                heightInCm
            );


        const bmr =
            calculateBMR(
                age,
                gender,
                weight,
                heightInCm
            );


        const activityFactor =
            getActivityFactor(
                activity
            );


        const maintenanceCalories =
            calculateMaintenanceCalories(
                bmr,
                activity
            );


        const goalCalories =
            calculateGoalCalories(
                maintenanceCalories,
                goal,
                gender
            );


        const macros =
            calculateMacros(
                goalCalories.calories,
                weight,
                goal
            );


        const targets =
            calculateDailyTargets(
                age,
                gender,
                activity,
                goalCalories.calories
            );


        // ----------------------------------------------------
        // DISPLAY
        // ----------------------------------------------------

        displayResults(
            bmi,
            bmiCategory,
            healthyRange,
            goalCalories.calories,
            macros,
            targets,
            bmr,
            activityFactor,
            goalCalories.adjustment
        );

    }
);