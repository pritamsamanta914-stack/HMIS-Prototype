/* =========================================
   HMIS - JAVASCRIPT
========================================= */


/* =========================================
   USER FUNCTIONS
========================================= */

function user() {

    const savedUser =
        localStorage.getItem("hmisUser");

    if (savedUser) {

        return JSON.parse(savedUser);

    }

    return {
        name: "Patient",
        phone: "",
        id: "P001"
    };
}


/* =========================================
   REGISTER
========================================= */

function register(event) {

    event.preventDefault();


    const form =
        document.getElementById(
            "registrationForm"
        );


    const formData =
        new FormData(form);


    const name =
        formData.get("name");

    const phone =
        formData.get("phone");

    const dob =
        formData.get("dob");

    const gender =
        formData.get("gender");

    const password =
        formData.get("password");


    const error =
        document.getElementById(
            "registrationError"
        );


    if (
        !name ||
        !phone ||
        !dob ||
        !gender ||
        !password
    ) {

        error.textContent =
            "Please fill all fields.";

        return;

    }


    if (phone.length !== 10) {

        error.textContent =
            "Phone number must contain 10 digits.";

        return;

    }


    if (password.length < 6) {

        error.textContent =
            "Password must contain at least 6 characters.";

        return;

    }


    const patient = {

        name: name,

        phone: phone,

        dob: dob,

        gender: gender,

        password: password,

        id: "P001"

    };


    localStorage.setItem(

        "hmisPatient",

        JSON.stringify(patient)

    );


    alert(
        "Registration successful!"
    );


    window.location.href =
        "patient-login.html";

}


/* =========================================
   LOGIN
========================================= */

function login(event) {

    event.preventDefault();


    const form =
        document.getElementById(
            "loginForm"
        );


    const formData =
        new FormData(form);


    const phone =
        formData.get("phone");

    const password =
        formData.get("password");


    const error =
        document.getElementById(
            "loginError"
        );


    const savedPatient =
        localStorage.getItem(
            "hmisPatient"
        );


    if (!savedPatient) {

        error.textContent =
            "No account found. Please register first.";

        return;

    }


    const patient =
        JSON.parse(savedPatient);


    if (
        patient.phone !== phone ||
        patient.password !== password
    ) {

        error.textContent =
            "Invalid phone number or password.";

        return;

    }


    const loggedInUser = {

        name: patient.name,

        phone: patient.phone,

        id: patient.id

    };


    localStorage.setItem(

        "hmisUser",

        JSON.stringify(loggedInUser)

    );


    alert(
        "Login successful!"
    );


    window.location.href =
        "dashboard.html";

}


/* =========================================
   LOGIN GUARD
========================================= */

function guard() {

    const savedUser =
        localStorage.getItem(
            "hmisUser"
        );


    if (!savedUser) {

        alert(
            "Please login first."
        );


        window.location.href =
            "patient-login.html";

        return false;

    }


    return true;

}


/* =========================================
   APPOINTMENT STORAGE
========================================= */

function getAppointments() {

    const data =
        localStorage.getItem(
            "hmisAppointments"
        );


    if (!data) {

        return [];

    }


    return JSON.parse(data);

}


function saveAppointments(data) {

    localStorage.setItem(

        "hmisAppointments",

        JSON.stringify(data)

    );

}


/* =========================================
   BOOK APPOINTMENT
========================================= */

function book(event) {

    event.preventDefault();


    if (!guard()) {

        return;

    }


    const department =
        document.getElementById(
            "dept"
        ).value;


    const date =
        document.getElementById(
            "date"
        ).value;


    const time =
        document.getElementById(
            "time"
        ).value;


    if (
        !department ||
        !date ||
        !time
    ) {

        alert(
            "Please fill all appointment details."
        );

        return;

    }


    const fees = {

        General: 500,

        Cardiology: 1000,

        Orthopedics: 800,

        Pediatrics: 600

    };


    const appointments =
        getAppointments();


    const appointment = {

        id:
            "APT" +
            String(
                appointments.length + 1
            ).padStart(3, "0"),

        dept:
            department,

        date:
            date,

        time:
            time,

        fee:
            fees[department],

        paid:
            false

    };


    appointments.push(
        appointment
    );


    saveAppointments(
        appointments
    );


    alert(
        "Appointment booked successfully!"
    );


    window.location.href =
        "billing.html";

}


/* =========================================
   LAST APPOINTMENT
========================================= */

function lastAppt() {

    const appointments =
        getAppointments();


    if (
        appointments.length === 0
    ) {

        return null;

    }


    return appointments[
        appointments.length - 1
    ];

}


/* =========================================
   LOAD BILL
========================================= */

function loadBill() {

    const table =
        document.getElementById(
            "billTable"
        );


    if (!table) {

        return;

    }


    const appointment =
        lastAppt();


    if (!appointment) {

        table.innerHTML = `

            <tr>

                <td colspan="2">

                    No appointment found.

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML = `

        <tr>

            <td>
                Consultation
                (${appointment.dept})
            </td>

            <td>
                ₹${appointment.fee}
            </td>

        </tr>


        <tr>

            <td>
                <strong>Total</strong>
            </td>

            <td>
                <strong>
                    ₹${appointment.fee}
                </strong>
            </td>

        </tr>

    `;

}


/* =========================================
   PAYMENT
========================================= */

function pay() {

    const appointments =
        getAppointments();


    if (
        appointments.length === 0
    ) {

        alert(
            "No appointment found."
        );

        return;

    }


    const index =
        appointments.length - 1;


    appointments[index].paid =
        true;


    saveAppointments(
        appointments
    );


    alert(
        "Payment successful!"
    );


    window.location.href =
        "confirmation.html";

}


/* =========================================
   CONFIRMATION
========================================= */

function showConfirmation() {

    const element =
        document.getElementById(
            "confirmationText"
        );


    if (!element) {

        return;

    }


    const appointment =
        lastAppt();


    if (!appointment) {

        element.textContent =
            "No appointment found.";

        return;

    }


    element.textContent =

        "Appointment " +
        appointment.id +
        " has been confirmed for " +
        appointment.dept +
        " on " +
        appointment.date +
        " at " +
        appointment.time +
        ". Payment received: ₹" +
        appointment.fee;

}


/* =========================================
   DASHBOARD
========================================= */

function loadDashboard() {

    if (!guard()) {

        return;

    }


    const welcome =
        document.getElementById(
            "welcome"
        );


    const table =
        document.getElementById(
            "appointmentTable"
        );


    const currentUser =
        user();


    if (welcome) {

        welcome.textContent =
            "Welcome, " +
            currentUser.name +
            " 👋";

    }


    if (!table) {

        return;

    }


    const appointments =
        getAppointments();


    if (
        appointments.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td colspan="5">

                    No appointments yet.

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        appointments
        .map(function(item) {

            return `

                <tr>

                    <td>
                        ${item.id}
                    </td>

                    <td>
                        ${item.date}
                    </td>

                    <td>
                        ${item.dept}
                    </td>

                    <td>
                        ${item.time}
                    </td>

                    <td>

                        ${
                            item.paid
                            ? "Paid"
                            : "Payment Due"
                        }

                    </td>

                </tr>

            `;

        })
        .join("");

}


/* =========================================
   CASE SUMMARY
========================================= */

function saveCase(event) {

    event.preventDefault();


    if (!guard()) {

        return;

    }


    const symptoms =
        document.getElementById(
            "symptoms"
        ).value;


    const history =
        document.getElementById(
            "history"
        ).value;


    const allergies =
        document.getElementById(
            "allergies"
        ).value;


    const caseData = {

        symptoms:
            symptoms,

        history:
            history,

        allergies:
            allergies

    };


    localStorage.setItem(

        "hmisCaseSummary",

        JSON.stringify(caseData)

    );


    alert(
        "Case summary saved successfully!"
    );


    window.location.href =
        "prescription.html";

}