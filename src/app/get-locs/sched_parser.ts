const BASE_MAGIC_KEY_URL = "https://gissvc.osu.edu/arcgis/rest/services/Apps/Campusmap_OSU_Buildings_Locator/GeocodeServer/suggest?";
const BASE_COORDINATE_URL = "https://gissvc.osu.edu/arcgis/rest/services/Apps/Campusmap_OSU_Buildings_Locator/GeocodeServer/findAddressCandidates?";

/**
 * Enum of fields for each course.
 */
enum Fields {
    DEP,
    NUM,
    DAY,
    STA,
    END,
    BUI,
    NA
}

/**
 * Enum of days for each day of school week
 */
export const MON=0, TUE=1, WED=2, THU=3, FRI=4;
export const DAYS=[MON,TUE,WED,THU,FRI];
/**
 * Representation of a course.
 */
export class Course {
    department: string;
    number: string;
    building: string;
    days: number[];
    start: Date; // represented as a time during 1/1/1970
    end: Date; // represented as a time during 1/1/1970
    inPerson: boolean;
    coords: number[] | null;

    constructor(department: string, number: string, days: number[], start: Date, end: Date, building: string, inPerson: boolean, coords: number[] | null) {
        this.department = department;
        this.number = number;
        this.building = building;
        this.days = days;
        this.start = start;
        this.end = end;
        this.inPerson = inPerson;
        this.coords = coords;
    }
}

const DEP_INDEX = 1, NUM_INDEX = 2, DAYTIMELOC_INDEX = 7, MODE_INDEX = 10;

/**
 * Returns a {@linkcode Course} filled with the fields given.
 * @param {string} dep - The depeartment
 * @param {string} num - The course #
 * @param {string} days - The days of the week the course is (some concatenated string of "M", "T", "W", "Th", "F")
 * @param {string} sta - The start time
 * @param {string} end - The end time
 * @param {string} bui - The course building
 */
function stringsToCourse(dep: string, num: string, days: string, sta: string, end: string, bui: string, inPerson: boolean, coords: number[] | null): Course {
    let day_array: number[] = [];
    if (days.search("M") != -1) {
        day_array.push(MON);
    }
    if (days.search(/t($|[^h])/i) != -1) {
        day_array.push(TUE);
    }
    if (days.search("W") != -1) {
        day_array.push(WED);
    }
    if (days.search("Th") != -1) {
        day_array.push(THU);
    }
    if (days.search("F") != -1) {
        day_array.push(FRI);
    }

    return new Course(dep, num, day_array, new Date("1 Jan 1970 " + sta), new Date("1 Jan 1970 " + end), bui, inPerson, coords);
}

function splitIntoCourseTokens(tokens: Array<string>) {
    let courseTokens = [];

    let start = 0;
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] == "\n") {
            courseTokens.push(tokens.slice(start, i));
            start = i + 1;
        }
    }
    courseTokens.push(tokens.slice(start,));

    return courseTokens;
}

async function getCoordinates(inPerson: boolean, loc: string): Promise<number[] | null> {

    if(!inPerson) {
        return null;
    } else { // fetch coords from OSU api and push to courses
        return fetch(
            BASE_MAGIC_KEY_URL + new URLSearchParams({ "text": loc, "f": "json" }) // get magic key
        ).then((response) => // parse magic key json
            response.json()
        ).then((json) => // get coordinates using magic key
            fetch(BASE_COORDINATE_URL + new URLSearchParams({
                "magicKey": json.suggestions[0].magicKey,
                "f": "json",
                "outSR": "4140"
            })).then((response) => // parse coords json
                response.json()
            ).then((json) => // get coords from json
                [json.candidates[0].location.x, json.candidates[0].location.y]
            )
        )
    }
}

/**
 * Parses the pre-processed tokens into a list of courses.
 * @param {} text - The tokens to process.
 */
export async function processData(text: string): Promise<Array<Course>> {
    return new Promise(async (resolve) => { 
        text = text.slice(text.search("\t\n\t") + 3); // format text to remove any filler at beginning
        let tokens = text.split(/\t/); // split based on cell dividers (which are just tabs)

        let courses = new Array<Course>;

        try {
            for (let course of splitIntoCourseTokens(tokens)) {
                let dep = course[DEP_INDEX].trim();
                let num = course[NUM_INDEX].trim();

                let dayTimeLoc = course[DAYTIMELOC_INDEX].trim().split(" ");
                let days = dayTimeLoc[0];
                let start = dayTimeLoc[1];
                let end = dayTimeLoc[3];
                let loc = dayTimeLoc.slice(5,).join(' ');

                let mode = course[MODE_INDEX];
                let inPerson = mode.search(/(in person)/i) != -1;

                await getCoordinates(inPerson, loc).then((coords) => // get coords then push to list
                    courses.push(stringsToCourse(dep, num, days, start, end, loc, inPerson, coords))
                );
            }
        } catch {
            console.log("Invalid input");
        }

        resolve(courses);
    })
}