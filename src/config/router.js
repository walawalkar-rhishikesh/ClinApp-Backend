
const pMain = "/patient"
const dMain = "/doctor"
const RouterConfig = {
    signin: "/auth/signin",
    patient: {
        main: pMain,
        home: pMain + "/home",
        appointments: pMain + "/appointments",
        addAppointments: pMain + "/add-appointments",
        profile: pMain + "/profile"
    },
    doctor:{
        main: dMain,
        home: dMain + "/home",
        appointments: dMain + "/appointments",
        profile: dMain + "/profile",
        addPatient: dMain + "/add-patient"
    }

}

export default RouterConfig;
