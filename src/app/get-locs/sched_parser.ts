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
enum Days {
    MON,
    TUE,
    WED,
    THU,
    FRI
}

/**
 * Representation of a course.
 */
class Course {
    department: string;
    number: string;
    building: string;
    days: Days[];
    start: string;
    end: string;

    constructor(department: string, number: string, days: Days[], start: string, end: string, building: string) {
        this.department = department;
        this.number = number;
        this.building = building;
        this.days = days;
        this.start = start;
        this.end = end;
    }
}

/**
 * Returns a {@linkcode Course} filled with the fields given.
 * @param {string} dep - The depeartment
 * @param {string} num - The course #
 * @param {string} days - The days of the week the course is (some concatenated string of "M", "T", "W", "Th", "F")
 * @param {string} sta - The start time
 * @param {string} end - The end time
 * @param {string} bui - The course building
 */
function stringsToCourse(dep: string, num: string, days: string, sta: string, end: string, bui: string) {
    // console.log("Attributes:");
    // console.log("-----------");
    // console.log(dep);
    // console.log(num);
    // console.log(days);
    // console.log(sta);
    // console.log(end);
    // console.log(bui);
    // console.log("\n\n");
    let day_array: Days[] = [];
    if(days.search("M") != -1) {
        day_array.push(Days.MON);
    }
    if(days.search(/t($|[^h])/i) != -1) {
        day_array.push(Days.TUE);
    }
    if(days.search("W") != -1) {
        day_array.push(Days.WED);
    }
    if(days.search("Th") != -1) {
        day_array.push(Days.THU);
    }
    if(days.search("F") != -1) {
        day_array.push(Days.FRI);
    }

    return new Course(dep, num, day_array, sta, end, bui);
}

/**
 * Cleanses `tokens`, by seperating times and spaces and combined words.
 * @param {} tokens 
 */
function preProcessData(tokens: Array<string>) {
    // finds letters followed by numbers, and seperates them into seperate strings
    let i = 0;
    const letterNumber = /[a-zA-Z]\d/;
    while(i < tokens.length) {
        let index = tokens[i].search(letterNumber);
        if(index != -1) {
            tokens.splice(i + 1, 0, tokens[i].substring(index + 1));
            tokens[i] = tokens[i].substring(0, index + 1);
        }
        i++;
    }

    // seperates online into its own token
    for(let i = tokens.length - 1; i >= 0; i--) {
        let token = tokens[i];
        if(token.search(/.(Online)/) != -1) {
            tokens[i] = token.substring(0, token.search(/(Online)/));
            tokens.splice(i + 1, 0, "Online");
        }
    }

    // removes all hyphens
    for(let i = 0; i < tokens.length; i++) {
        tokens[i] = tokens[i].replaceAll("-", "");
    }

    // seperates spaces into new entries
    for(let i = tokens.length - 1; i >= 0; i--) {
        let split = tokens[i].split(" ").reverse();

        for(let entry of split) {
            if(entry.length > 0) {
                tokens.splice(i + 1, 0, entry);
            }
        }

        tokens.splice(i, 1);
    }

    // removes pairs of "Not Enrolled" tokens
    for(let i = tokens.length - 2; i >= 0; i--) {
        if(tokens[i].match("Not") && tokens[i + 1].match("Enrolled")) {
            tokens.splice(i, 2)
            i--;
        }
    }
}

/**
 * Parses the pre-processed tokens into a list of courses.
 * @param {} text - The tokens to process.
 */
export function processData(text: string) {
    console.log(text.split(/\t/));
    // PDF text
    let tokens = text.split(/[\t\n]/);
    preProcessData(tokens)
    console.log(tokens);

    let courses = [];
    var dep = "", num = "", bui = "", days = "", start = "", end = "";

    let currField = Fields.DEP;
    
    let i = 0;
    while(i < tokens.length) {
        let token = tokens[i];
        i++;

        switch(currField) {
            case Fields.DEP:
                if(token.search(/\d/) == -1) { // if there is no number
                    dep += token + " ";
                } else { // if there is a number (must be course number)
                    num = token;
                    currField = Fields.DAY;
                }
                break;

            case Fields.DAY:
                if(token.search(/(Online)/) != -1) {
                    currField = Fields.NA;
                } else {
                    days += token;
                    currField = Fields.STA;
                }
                break;
            
            case Fields.STA:
                start += token;
                currField = Fields.END;
                break;
            
            case Fields.END:
                end += token;
                currField = Fields.BUI;
                break;
            
            case Fields.BUI:
                if(token.search(/(Regular)/) == -1) { // only add token if doesn't contain "Regular" (done so that location is not shown as "Online Regular")
                    bui += token + " ";
                }    
                if(token.search(/\d/) != -1 || token.search(/(Regular)/) != -1) {
                    currField = Fields.NA;
                }                
                break;
            
            case Fields.NA:
                if(token.search(/(Person)/) != -1 || token.search(/(Enhanced)/) != -1 || token.search(/(Learning)/) != -1) {
                    courses.push(stringsToCourse(dep, num, days, start, end, bui));
                    dep = "", num = "", days = "", start = "", end = "", bui = "";
                    
                    i++;
                    currField = Fields.DEP;
                }
                break;
        }
    }

    return courses;
}